import { Module } from '@nestjs/common';
import { RecurringService } from './recurring.service';

@Module({
    providers: [RecurringService]
})
export class RecurringModule { }
