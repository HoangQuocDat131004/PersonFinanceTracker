import { Injectable } from '@nestjs/common';
import { TransactionType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoryService {
    constructor(private prisma: PrismaService) { }

    // Lấy tất cả danh mục của user
    async getAll(userId: number) {
        const categories = await this.prisma.category.findMany({
            where: { userId: userId },
            orderBy: { name: 'asc' },
        });

        return categories;
    }

    // Tạo danh mục mới
    async create(userId: number, data: { name: string; type: TransactionType }) {
        const newCategory = await this.prisma.category.create({
            data: {
                userId: userId,
                name: data.name,
                type: data.type,
            },
        });

        return newCategory;
    }

    // Xóa danh mục
    async delete(userId: number, categoryId: number) {
        //Kiểm tra xem danh mục có tồn tại và thuộc về user này không
        const category = await this.prisma.category.findFirst({
            where: {
                id: categoryId,
                userId: userId
            }
        });

        if (!category) {
            throw new Error("Không tìm thấy danh mục hoặc bạn không có quyền xóa.");
        }

        // Thực hiện xóa
        const deleted = await this.prisma.category.delete({
            where: { id: categoryId },
        });

        return deleted;
    }
}