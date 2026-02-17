import { Module } from '@nestjs/common';
import { BudgetService } from './budget.service';

@Module({
    providers: [BudgetService]
})
export class BudgetModule { }
