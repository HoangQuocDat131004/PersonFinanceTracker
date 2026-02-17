import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BudgetService {

    constructor(private prisma: PrismaService) { }

    //Chức năng: Tạo mới hoặc Cập nhật Ngân sách (Upsert)
    async upsertBudget(userId: number, input: { categoryId: number; amount: number; month: number; year: number }) {
        // Gọi hàm upsert của Prisma
        const result = await this.prisma.budget.upsert({
            // Điều kiện tìm kiếm
            where: {
                userId_categoryId_month_year: {
                    userId: userId,
                    categoryId: input.categoryId,
                    month: input.month,
                    year: input.year,
                },
            },
            // Nếu tìm thấy -> Cập nhật số tiền mới
            update: {
                amount: input.amount
            },
            // Nếu không tìm thấy -> Tạo mới hoàn toàn
            create: {
                userId: userId,
                categoryId: input.categoryId,
                amount: input.amount,
                month: input.month,
                year: input.year,
            },
        });

        return result;
    }


    // Chức năng: Lấy danh sách ngân sách kèm theo SỐ TIỀN ĐÃ TIÊU
    async getBudgetsWithUsage(userId: number, month: number, year: number) {
        //Lấy danh sách các ngân sách đã thiết lập trong tháng
        const budgets = await this.prisma.budget.findMany({
            where: {
                userId: userId,
                month: month,
                year: year
            },
            include: {
                category: true
            },
        });

        // Tính toán số tiền đã tiêu cho TỪNG ngân sách
        const results: any[] = [];

        for (const budget of budgets) {

            // Tính tổng số tiền từ bảng Transaction
            const totalSpent = await this.prisma.transaction.aggregate({
                _sum: { amount: true }, // Tính tổng cột amount
                where: {
                    userId: userId,
                    categoryId: budget.categoryId,
                    type: 'EXPENSE',
                    date: {
                        gte: new Date(year, month - 1, 1),
                        lt: new Date(year, month, 1),
                    },
                },
            });

            const spentAmount = Number(totalSpent._sum.amount || 0);
            const budgetAmount = Number(budget.amount);

            // Tính phần trăm đã tiêu
            let percentage = 0;
            if (spentAmount > 0) {
                percentage = (spentAmount / budgetAmount) * 100;
            }

            // Dữ liệu trả về
            const budgetWithUsage = {
                ...budget,
                amount: budgetAmount,
                spent: spentAmount,
                remaining: budgetAmount - spentAmount,
                percentage: percentage,
            };
            results.push(budgetWithUsage);
        }

        return results;
    }

    //Xóa ngân sách
    async deleteBudget(userId: number, id: number) {
        const result = await this.prisma.budget.deleteMany({
            where: {
                id: id,
                userId: userId
            },
        });

        return result;
    }
}