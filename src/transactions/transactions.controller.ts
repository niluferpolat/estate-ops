import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionsDto } from './dto/create-transactions.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

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
}
