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
  //Khởi tạo ứng dụng NestJS từ AppModule
  const app = await NestFactory.create(AppModule);

  // Cấu hình CORS (Cho phép Frontend gọi API)
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // Lấy các Service đã khởi tạo để đưa vào tRPC Context
  const authService = app.get(AuthService);
  const prismaService = app.get(PrismaService);
  const categoryService = app.get(CategoryService);
  const transactionService = app.get(TransactionService);
  const budgetService = app.get(BudgetService);
  const recurringService = app.get(RecurringService);
  const dataService = app.get(DataService);

  // Cấu hình tRPC Middleware
  // Mọi request gửi đến '/trpc' sẽ do tRPC xử lý
  app.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
      router: appRouter,

      // Tạo context cho mỗi request
      createContext: (opts) =>
        createContext({
          ...opts,
          // Truyền các service vào để các Router con có thể sử dụng
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

  // Khởi chạy Server
  await app.listen(4000);
  console.log(`🚀 Server đang chạy tại: http://localhost:4000`);
}

bootstrap();