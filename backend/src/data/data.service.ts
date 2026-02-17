import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DataService {
    constructor(private prisma: PrismaService) { }

    //Xuất dữ liệu
    async exportTransactions(userId: number) {
        const transactions = await this.prisma.transaction.findMany({
            where: { userId: userId },
            include: { category: true },
            orderBy: { date: 'desc' },
        });

        return transactions;
    }

    // Nhập dữ liệu 
    async importTransactions(userId: number, data: any[]) {
        let importedCount = 0;
        await this.prisma.$transaction(async (tx) => {
            for (const item of data) {
                const categoryName = item.categoryName.trim();
                //Check danh mục có tồn tại hay chưa
                let category = await tx.category.findFirst({
                    where: {
                        userId: userId,
                        name: categoryName,
                        type: item.type
                    },
                });
                //Chưa có thì tạo mới
                if (!category) {
                    category = await tx.category.create({
                        data: {
                            userId: userId,
                            name: categoryName,
                            type: item.type
                        },
                    });
                }

                //Tạo giao dịch
                await tx.transaction.create({
                    data: {
                        userId: userId,
                        amount: item.amount,
                        description: item.description || "Nhập từ file CSV",
                        date: new Date(item.date),
                        type: item.type,
                        categoryId: category.id,
                    },
                });

                importedCount++;
            }
        });

        return { success: true, count: importedCount };
    }
}