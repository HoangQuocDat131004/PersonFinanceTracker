import { z } from 'zod';
import { router, protectedProcedure } from '../trpc/trpc.context';

export const dataRouter = router({

    // API: Lấy dữ liệu để xuất file
    exportTransactions: protectedProcedure.query(async (opts) => {
        const context = opts.ctx;
        return context.dataService.exportTransactions(context.user.id);
    }),

    // API: Nhận dữ liệu để nhập vào DB
    importTransactions: protectedProcedure
        .input(
            z.array(
                z.object({
                    date: z.string(),
                    amount: z.number(),
                    description: z.string().optional(),
                    type: z.enum(['INCOME', 'EXPENSE']),
                    categoryName: z.string(),
                })
            )
        )
        .mutation(async (opts) => {
            const context = opts.ctx;
            const input = opts.input;

            return context.dataService.importTransactions(context.user.id, input);
        }),
});