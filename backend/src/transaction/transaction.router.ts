import { TransactionType } from "@prisma/client";
import { protectedProcedure, router } from "src/trpc/trpc.context";
import z from "zod";

export const transactionRouter = router({

    // API Xem sổ cái (Get Ledger)
    getLedger: protectedProcedure
        .query(async (opts) => {
            const context = opts.ctx;
            const userId = context.user.id;
            return context.transactionService.getLedger(userId);
        }),

    // API Thêm dòng mới vào sổ cái
    create: protectedProcedure
        .input(z.object({
            amount: z.number().positive("Số tiền phải lớn hơn 0"),
            description: z.string().optional(),
            date: z.string(),
            type: z.nativeEnum(TransactionType),
            categoryId: z.number().optional(),
        }))
        .mutation(async (opts) => {
            const context = opts.ctx;
            const input = opts.input;
            return context.transactionService.create(context.user.id, input);
        }),

    // API Xóa giao dịch
    delete: protectedProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async (opts) => {
            const context = opts.ctx;
            const input = opts.input;
            return context.transactionService.delete(context.user.id, input.id);
        })
});