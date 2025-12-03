import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateTransactionsDto } from './dto/create-update-transactions.dto';
import { Transaction } from './schemas/transactions.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AgentRoles } from './enums/agentRoles.enum';
import { AgenciesService } from '../agencies/agencies.service';

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
}
