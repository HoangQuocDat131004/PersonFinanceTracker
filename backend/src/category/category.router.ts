import { TransactionType } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { router, publicProcedure, protectedProcedure } from '../trpc/trpc.context';
import { z } from 'zod';

export const categoryRouter = router({

    // API: Lấy danh sách
    list: publicProcedure.query(async (opts) => {
        const context = opts.ctx;

        // Nếu chưa đăng nhập thì báo lỗi
        if (!context.user) {
            throw new TRPCError({ code: 'UNAUTHORIZED', message: "Bạn chưa đăng nhập" });
        }
        // Gọi Service lấy danh sách
        return context.categoryService.getAll(context.user.id);
    }),

    // API: Tạo mới
    create: publicProcedure
        .input(z.object({
            name: z.string().min(1, "Tên không được để trống"),
            type: z.nativeEnum(TransactionType),
        }))
        .mutation(async (opts) => {
            const context = opts.ctx;
            const input = opts.input;

            if (!context.user) {
                throw new TRPCError({ code: 'UNAUTHORIZED' });
            }

            return context.categoryService.create(context.user.id, input);
        }),

    // API: Xóa
    delete: publicProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async (opts) => {
            const context = opts.ctx;
            const input = opts.input;

            if (!context.user) {
                throw new TRPCError({ code: 'UNAUTHORIZED' });
            }

            return context.categoryService.delete(context.user.id, input.id);
        }),
});