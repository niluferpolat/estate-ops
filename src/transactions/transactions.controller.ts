import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionsDto } from './dto/create-transactions.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionHistoryService } from '../transaction-history/transaction-history.service';
import { ChangeStateTransactionDto } from './dto/change-stage-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private transactionsService: TransactionsService,
    private readonly transactionHistoryService: TransactionHistoryService,
  ) {}

  @Get(':agencyId')
  async getAllTransactions(@Param('agencyId') agencyId: string) {
    return await this.transactionsService.findAllTransaction(agencyId);
  }

  @Post()
  async createTransaction(@Body() createTransactionDto: CreateTransactionsDto) {
    return await this.transactionsService.createTransaction(createTransactionDto);
  }

  @Put()
  async updateTransaction(@Body() updateTransactionDto: UpdateTransactionDto) {
    return await this.transactionsService.updateTransaction(updateTransactionDto);
  }

  @Get(':id/history')
  async getTransactionHistory(@Param('id') id: string) {
    return await this.transactionHistoryService.getHistoryForTransaction(id);
  }

  @Post('moveToNextStage')
  async moveToNextStage(@Body() changeStageTransactionDto: ChangeStateTransactionDto) {
    return await this.transactionsService.moveToNextLevel(changeStageTransactionDto);
  }

  @Get(':id/financialBreakdown')
  async getFinancialBreakdown(@Param('id') id: string) {
    return await this.transactionsService.getFinancialBreakdown(id);
  }
}
