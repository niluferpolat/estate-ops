import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionsDto } from './dto/create-transactions.dto';
import { Transaction } from './schemas/transactions.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AgentRoles } from './enums/agentRoles.enum';
import { AgenciesService } from '../agencies/agencies.service';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionStages } from './enums/transactionStages.enum';
import { ChangeStateTransactionDto } from './dto/change-stage-transaction.dto';
import { TransactionHistoryService } from 'src/transaction-history/transaction-history.service';
import { COMMISSION_RULES } from './enums/commission-rules';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name) private readonly transactionModel: Model<Transaction>,
    private readonly agenciesService: AgenciesService,
    private readonly transactionHistoryService: TransactionHistoryService,
  ) {}

  async createTransaction(createTransactionDto: CreateTransactionsDto): Promise<Transaction> {
    const { assignedAgents } = createTransactionDto;
    const roles = assignedAgents.flatMap(agent => agent.role);
    if (roles.length === 0) {
      throw new BadRequestException(`Role is required`);
    }
    Object.values(AgentRoles).map(required => {
      if (!roles.includes(required)) {
        throw new BadRequestException(`Missing required role: ${required}`);
      }
    });
    const exists = await this.transactionModel.findOne({
      agencyId: createTransactionDto.agencyId,
      propertyIdNumber: createTransactionDto.propertyIdNumber,
    });
    if (exists) {
      throw new ConflictException('This transaction already exists for this property and agency. Use update instead.');
    }
    const transaction = await this.transactionModel.create(createTransactionDto);

    await this.transactionHistoryService.createStageChange({
      transactionId: transaction._id,
      fromStage: TransactionStages.AGREEMENT,
      toStage: TransactionStages.AGREEMENT,
      note: 'Transaction created',
    });
    return transaction;
  }

  async findAllTransaction(agencyId: string): Promise<Transaction[]> {
    const agency = await this.agenciesService.findById(agencyId);
    return this.transactionModel.find({ agencyId: agency._id }).exec();
  }

  async updateTransaction(updateTransactionDto: UpdateTransactionDto): Promise<Transaction> {
    const { assignedAgents, transactionId } = updateTransactionDto;
    const roles = assignedAgents.flatMap(agent => agent.role);
    if (roles.length === 0) {
      throw new BadRequestException(`Role is required`);
    }
    Object.values(AgentRoles).map(required => {
      if (!roles.includes(required)) {
        throw new BadRequestException(`Missing required role: ${required}`);
      }
    });

    const existing = await this.transactionModel.findById(transactionId);

    if (!existing) {
      throw new NotFoundException('Transaction not found');
    }

    if (existing.stage === TransactionStages.COMPLETED) {
      throw new BadRequestException('Completed transactions cannot be updated');
    }

    const updated = await this.transactionModel.findByIdAndUpdate(transactionId, updateTransactionDto, { new: true });

    if (!updated) {
      throw new NotFoundException('Transaction not found');
    }
    return updated;
  }

  async moveToNextLevel(changeStageDto: ChangeStateTransactionDto): Promise<Transaction> {
    const transaction = await this.transactionModel.findById(changeStageDto.transactionId);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    const difference = this.getStageOrder(changeStageDto.stage) - this.getStageOrder(transaction.stage);

    if (difference !== 1) {
      throw new BadRequestException('Given stage is not next stage of current one');
    }

    const previousStage = transaction.stage;
    transaction.stage = changeStageDto.stage;

    const savedData = await transaction.save();
    await this.transactionHistoryService.createStageChange({
      transactionId: savedData._id,
      fromStage: previousStage,
      toStage: savedData.stage,
    });

    return savedData;
  }

  private getStageOrder(stage: TransactionStages): number {
    const stageOrder = Object.values(TransactionStages);
    return stageOrder.indexOf(stage) + 1;
  }

  async getFinancialBreakdown(transactionId: string) {
    const transaction = await this.transactionModel.findById(transactionId);
    if (!transaction) {
      return new NotFoundException('Transaction not found');
    }

    if (transaction.stage !== TransactionStages.COMPLETED) {
      throw new BadRequestException('Financial breakdown is only for completed transactions');
    }
    const totalCommission = transaction.totalCommission;
    const relevantRoles = [AgentRoles.LISTING_AGENT, AgentRoles.SELLING_AGENT];

    const weightedAgents = transaction.assignedAgents
      .map(agent => {
        const roles = Array.isArray((agent as any).role) ? (agent as any).role : ((agent as any).roles ?? []);

        const weight = roles.filter(r => relevantRoles.includes(r)).length;

        return {
          agentId: agent.agentId ?? (agent as any).id,
          agentName: agent.agentName ?? (agent as any).name,
          roles,
          weight,
        };
      })
      .filter(a => a.weight > 0);

    if (weightedAgents.length === 0) {
      throw new BadRequestException('At least one listing/selling agent is required');
    }

    const totalWeight = weightedAgents.reduce((sum, agent) => sum + agent.weight, 0);
    const agencyId = typeof transaction.agencyId === 'string' ? transaction.agencyId : transaction.agencyId.toHexString();

    const agency = await this.agenciesService.findById(agencyId);

    const agencyCommission = (totalCommission * COMMISSION_RULES.agencyPercentage) / 100;
    const agentPool = (totalCommission * COMMISSION_RULES.agentPercentage) / 100;

    const agentCommissionPerWeight = agentPool / totalWeight;

    const agentCommissions = weightedAgents.map(agent => {
      const commissionAmount = agent.weight * agentCommissionPerWeight;

      return {
        agentId: agent.agentId,
        agentName: agent.agentName,
        roles: agent.role,
        commission: Number(commissionAmount.toFixed(2)),
      };
    });

    return {
      transaction: {
        id: transaction._id,
        propertyIdNumber: transaction.propertyIdNumber,
        clientIdNumber: transaction.clientIdNumber,
      },
      totalCommission,
      agency: {
        name: agency.name,
        commission: agencyCommission,
      },
      agents: {},
    };
  }
}
