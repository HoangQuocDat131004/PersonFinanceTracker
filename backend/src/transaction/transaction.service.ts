import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionService {
    constructor(private prisma: PrismaService) { }

    //Tạo một giao dịch mới
    async create(userId: number, inputData: any) {
        console.log("Dữ liệu nhận được:", inputData);
        let transactionDate = new Date(inputData.date);

        if (isNaN(transactionDate.getTime())) {
            console.warn("Ngày không hợp lệ, hệ thống sẽ lấy ngày giờ hiện tại.");
            transactionDate = new Date();
        }
        // Lưu vào db
        try {
            const newTransaction = await this.prisma.transaction.create({
                data: {
                    userId: userId,
                    amount: inputData.amount,
                    description: inputData.description || "",
                    type: inputData.type,
                    date: transactionDate,
                    categoryId: inputData.categoryId ?? null,
                },
            });

            return newTransaction;

        } catch (error: any) {
            console.error("Lỗi khi tạo giao dịch:", error);
            throw new BadRequestException("Không thể tạo giao dịch: " + error.message);
        }
    }

    //Lấy danh sách giao dịch
    async getLedger(userId: number, limit: number = 50) {
        const transactions = await this.prisma.transaction.findMany({
            where: {
                userId: userId
            },
            include: {
                category: true
            },
            orderBy: {
                date: 'desc'
            },
            take: limit,
        });

        return transactions;
    }

    //Xóa giao dịch
    async delete(userId: number, transactionId: number) {
        const result = await this.prisma.transaction.deleteMany({
            where: {
                id: transactionId,
                userId: userId
            },
        });

        return result;
    }
}