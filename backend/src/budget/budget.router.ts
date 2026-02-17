import { z } from 'zod';
import { router, protectedProcedure } from '../trpc/trpc.context';

export const budgetRouter = router({

    // API Lấy danh sách kèm tiến độ chi tiêu
    list: protectedProcedure
        .input(z.object({
            month: z.number(),
            year: z.number(),
        }))
        .query(async (opts) => {
            const context = opts.ctx;
            const input = opts.input;
            const userId = context.user.id;

            // Gọi Service xử lý
            const result = await context.budgetService.getBudgetsWithUsage(
                userId,
                input.month,
                input.year
            );

            return result;
        }),

    // API Tạo hoặc Sửa ngân sách
    upsert: protectedProcedure
        .input(z.object({
            categoryId: z.number(),
            amount: z.number().positive(),
            month: z.number().min(1).max(12),
            year: z.number(),
        }))
        .mutation(async (opts) => {
            const context = opts.ctx;
            const input = opts.input;

            const result = await context.budgetService.upsertBudget(
                context.user.id,
                input
            );

            return result;
        }),

    // API Xóa ngân sách
    delete: protectedProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async (opts) => {
            const context = opts.ctx;
            const input = opts.input;

            const result = await context.budgetService.deleteBudget(
                context.user.id,
                input.id
            );

            return result;
        }),
});