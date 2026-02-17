import { z } from 'zod';
import { router, publicProcedure } from '../trpc/trpc.context';

export const authRouter = router({

    // API: Đăng ký tài khoản
    register: publicProcedure
        .input(z.object({
            email: z.string().email("Email không hợp lệ"),
            password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
            fullName: z.string().min(2, "Họ tên quá ngắn")
        }))
        .mutation(async (opts) => {
            const input = opts.input; // Dữ liệu từ Frontend gửi lên
            const ctx = opts.ctx;     // Context chứa các Service

            const result = await ctx.authService.register({
                email: input.email,
                pass: input.password,
                fullname: input.fullName
            });

            return result;
        }),

    // API: Đăng nhập
    login: publicProcedure
        .input(z.object({
            email: z.string().email(),
            password: z.string(),
        }))
        .mutation(async (opts) => {
            const input = opts.input;
            const ctx = opts.ctx;

            const result = await ctx.authService.login({
                email: input.email,
                pass: input.password
            });

            return result;
        }),
});