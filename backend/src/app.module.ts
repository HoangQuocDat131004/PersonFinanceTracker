import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module';
import { TransactionService } from './transaction/transaction.service';
import { TransactionModule } from './transaction/transaction.module';
import { BudgetService } from './budget/budget.service';
import { BudgetModule } from './budget/budget.module';
import { RecurringService } from './recurring/recurring.service';
import { RecurringModule } from './recurring/recurring.module';
import { DataService } from './data/data.service';
import { DataModule } from './data/data.module';

@Module({
  imports: [
    CategoryModule,
    AuthModule,
    PrismaModule,
    TransactionModule,
    BudgetModule,
    RecurringModule,
    DataModule
  ],
  controllers: [],
  providers: [TransactionService, BudgetService, RecurringService, DataService],
})
export class AppModule { }
