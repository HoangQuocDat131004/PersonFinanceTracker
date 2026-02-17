import { z } from 'zod';
import { router, protectedProcedure } from '../trpc/trpc.context';

export const recurringRouter = router({

    // API Lấy danh sách
    list: protectedProcedure.query(async (opts) => {
        const context = opts.ctx;
        return context.recurringService.list(context.user.id);
    }),

    // API Tạo mới quy tắc
    create: protectedProcedure
        .input(z.object({
            amount: z.number().positive(),
            description: z.string().optional(),
            frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']),
            startDate: z.string(),
            type: z.enum(['INCOME', 'EXPENSE', 'SAVING']),
            categoryId: z.number().optional(),
        }))
        .mutation(async (opts) => {
            const context = opts.ctx;
            const input = opts.input;

            return context.recurringService.create(context.user.id, input);
        }),

    // API Xóa quy tắc
    delete: protectedProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async (opts) => {
            const context = opts.ctx;
            const input = opts.input;

            return context.recurringService.delete(context.user.id, input.id);
        }),

    // API Chạy kiểm tra thủ công
    runCheck: protectedProcedure.mutation(async (opts) => {
        const context = opts.ctx;
        return context.recurringService.processDueRules(context.user.id);
    }),
});