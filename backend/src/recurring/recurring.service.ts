import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RecurringService {
    constructor(private prisma: PrismaService) { }

    //Tạo một quy tắc định kỳ mới
    async create(userId: number, data: any) {
        const newRule = await this.prisma.recurringRule.create({
            data: {
                userId: userId,
                amount: data.amount,
                description: data.description,
                frequency: data.frequency,
                type: data.type,
                categoryId: data.categoryId,
                startDate: new Date(data.startDate),
                nextRun: new Date(data.startDate),
            },
        });

        return newRule;
    }

    //Lấy danh sách quy tắc của user
    async list(userId: number) {
        const rules = await this.prisma.recurringRule.findMany({
            where: { userId: userId },
            include: { category: true },
            orderBy: { nextRun: 'asc' },
        });

        return rules;
    }

    //Xóa quy tắc
    async delete(userId: number, id: number) {
        const result = await this.prisma.recurringRule.deleteMany({
            where: {
                id: id,
                userId: userId
            },
        });

        return result;
    }

    async processDueRules(userId: number) {
        const now = new Date();

        // Tìm các quy tắc đã đến hạn
        const dueRules = await this.prisma.recurringRule.findMany({
            where: {
                userId: userId,
                isActive: true,
                nextRun: { lte: now },
            },
        });

        let processedCount = 0;

        // Duyệt qua từng quy tắc để xử lý
        for (const rule of dueRules) {

            // Tạo giao dịch mới vào Sổ Cái 
            await this.prisma.transaction.create({
                data: {
                    userId: rule.userId,
                    amount: rule.amount,
                    description: `[Định kỳ] ${rule.description || ''}`,
                    type: rule.type,
                    categoryId: rule.categoryId,
                    date: rule.nextRun,
                },
            });

            // Tính toán ngày chạy tiếp theo 
            const nextDate = new Date(rule.nextRun);

            if (rule.frequency === 'DAILY') {
                nextDate.setDate(nextDate.getDate() + 1);
            }
            else if (rule.frequency === 'WEEKLY') {
                nextDate.setDate(nextDate.getDate() + 7);
            }
            else if (rule.frequency === 'MONTHLY') {
                nextDate.setMonth(nextDate.getMonth() + 1);
            }
            else if (rule.frequency === 'YEARLY') {
                nextDate.setFullYear(nextDate.getFullYear() + 1);
            }

            // Cập nhật lại ngày chạy mới vào Database
            await this.prisma.recurringRule.update({
                where: { id: rule.id },
                data: { nextRun: nextDate },
            });

            processedCount++;
        }

        return { processed: processedCount };
    }
}