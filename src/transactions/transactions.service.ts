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

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name) private readonly transactionModel: Model<Transaction>,
    private readonly agenciesService: AgenciesService,
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
    const { transactionId, stage: nextStage } = changeStageDto;
    const transaction = await this.transactionModel.findById(changeStageDto.transactionId);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    const difference = this.getStageOrder(changeStageDto.stage) - this.getStageOrder(transaction.stage);

    if (difference !== 1) {
      throw new BadRequestException('Given stage is not next stage of current one');
    }
    if (changeStageDto) transaction.stage = changeStageDto.stage;
    return transaction.save();
  }

  private getStageOrder(stage: TransactionStages): number {
    const stageOrder = Object.values(TransactionStages);
    return stageOrder.indexOf(stage) + 1;
  }
}
