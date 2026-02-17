import { inferAsyncReturnType, initTRPC, TRPCError } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryService } from '../category/category.service';
import { TransactionService } from '../transaction/transaction.service';
import superjson from 'superjson';
import * as jwt from 'jsonwebtoken';
import { BudgetService } from 'src/budget/budget.service';
import { RecurringService } from 'src/recurring/recurring.service';
import { DataService } from 'src/data/data.service';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

// Định nghĩa kiểu dữ liệu User cho Context
type UserContext = {
    id: number;
    email: string;
} | null;

export const createContext = (
    opts: trpcExpress.CreateExpressContextOptions & {
        authService: AuthService;
        prismaService: PrismaService;
        categoryService: CategoryService;
        transactionService: TransactionService;
        budgetService: BudgetService;
        recurringService: RecurringService;
        dataService: DataService;
    },
) => {
    const authHeader = opts.req.headers.authorization;

    let user: UserContext = null;

    if (authHeader) {
        try {
            const token = authHeader.split(' ')[1];
            const decoded: any = jwt.verify(token, JWT_SECRET);
            if (decoded && decoded.userId) {
                user = { id: decoded.userId, email: decoded.email };
            }
        } catch (error) {
            
        }
    }

    return {
        req: opts.req,
        res: opts.res,
        authService: opts.authService,
        prismaService: opts.prismaService,
        categoryService: opts.categoryService,
        transactionService: opts.transactionService,
        budgetService: opts.budgetService,
        recurringService: opts.recurringService,
        dataService: opts.dataService,
        user,
    };
};

export type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create({
    transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

const isAuthed = t.middleware(({ ctx, next }) => {
    if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next({
        ctx: {
            user: ctx.user,
        },
    });
});

export const protectedProcedure = t.procedure.use(isAuthed);