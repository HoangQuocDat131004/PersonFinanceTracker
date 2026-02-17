
import { router } from './trpc.context';
import { authRouter } from '../auth/auth.router';
import { categoryRouter } from 'src/category/category.router';
import { transactionRouter } from 'src/transaction/transaction.router';
import { budgetRouter } from 'src/budget/budget.router';
import { recurringRouter } from 'src/recurring/recurring.router';
import { dataRouter } from 'src/data/data.router';

export const appRouter = router({
    auth: authRouter,
    category: categoryRouter,
    transaction: transactionRouter,
    budget: budgetRouter,
    recurring: recurringRouter,
    data: dataRouter,
});

// Xuất kiểu dữ liệu để Frontend dùng 
export type AppRouter = typeof appRouter;