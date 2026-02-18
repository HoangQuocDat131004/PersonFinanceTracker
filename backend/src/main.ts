import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter } from './trpc/app.router';
import { createContext } from './trpc/trpc.context';

import { AuthService } from './auth/auth.service';
import { PrismaService } from './prisma/prisma.service';
import { CategoryService } from './category/category.service';
import { TransactionService } from './transaction/transaction.service';
import { BudgetService } from './budget/budget.service';
import { RecurringService } from './recurring/recurring.service';
import { DataService } from './data/data.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Cấu hình CORS linh hoạt
  // Khi chạy trên Vercel, link frontend sẽ khác localhost:3000
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:3000',
        process.env.FRONTEND_URL
      ].filter(Boolean);

      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  const authService = app.get(AuthService);
  const prismaService = app.get(PrismaService);
  const categoryService = app.get(CategoryService);
  const transactionService = app.get(TransactionService);
  const budgetService = app.get(BudgetService);
  const recurringService = app.get(RecurringService);
  const dataService = app.get(DataService);

  app.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext: (opts) =>
        createContext({
          ...opts,
          authService,
          prismaService,
          categoryService,
          transactionService,
          budgetService,
          recurringService,
          dataService,
        }),
    }),
  );

  // 2. Sửa lỗi Timed Out: Lấy Port từ môi trường của Render
  const port = process.env.PORT || 4000;

  // 3. QUAN TRỌNG: Lắng nghe trên '0.0.0.0' để Render có thể truy cập
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Server đang chạy trên port: ${port}`);
}

bootstrap();