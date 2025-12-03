import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionsDto } from './dto/create-update-transactions.dto';

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
  createTransaction(@Body() createTransactionDto: CreateTransactionsDto) {
    return this.transactionsService.createTransaction(createTransactionDto);
  }
  @Get(':id')
  findOneTransaction() {
    return { message: 'Single transaction details' };
  }
}
