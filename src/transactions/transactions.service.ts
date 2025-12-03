import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionsService {
  createTransaction() {
    return { message: 'Transaction created' };
  }
}
