import { Controller, Get, Post, Put } from '@nestjs/common';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}
  @Get()
  getAllTransactions() {
    return { message: 'List of all transactions' };
  }
  @Put(':id')
  transitionUpdate() {
    return { message: 'Transaction updated' };
  }
  @Post()
  createTransaction() {
    return this.transactionsService.createTransaction();
  }
  @Get(':id')
  findOneTransaction() {
    return { message: 'Single transaction details' };
  }
}
