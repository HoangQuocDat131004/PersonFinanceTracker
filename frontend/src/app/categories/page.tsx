"use client";

import { useState } from "react";
import { Plus, Loader2, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { AddCategoryModal } from "@/components/categories/AddCategoryModal";
import { CategoryList } from "@/components/categories/CategoryList";

export default function CategoriesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    // GỌI API LẤY DANH SÁCH DANH MỤC
    const {
        data: categories = [],
        isLoading,
        isError,
        error,
        refetch
    } = trpc.category.list.useQuery();

    // API TẠO MỚI  
    const createMutation = trpc.category.create.useMutation({
        onSuccess: () => {
            refetch();
            setIsModalOpen(false);
        },
        onError: (err: any) => {
            alert("Lỗi khi tạo: " + err.message);
        }
    });

    // API XÓA 
    const deleteMutation = trpc.category.delete.useMutation({
        onSuccess: () => {
            refetch();
        },
        onError: (err: any) => {
            alert("Lỗi khi xóa: " + err.message);
        }
    });

    // Hàm mở modal
    function openModal() {
        setIsModalOpen(true);
    }

    // Hàm đóng modal
    function closeModal() {
        setIsModalOpen(false);
    }

    // Hàm xử lý khi người dùng bấm Lưu ở Modal
    function handleSaveCategory(data: { name: string; type: "INCOME" | "EXPENSE" }) {
        createMutation.mutate(data);
    }

    // Hàm xử lý khi người dùng bấm Xóa ở danh sách
    function handleDeleteCategory(id: number) {
        deleteMutation.mutate({ id: id });
    }

    // Đang tải dữ liệu
    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    // Có lỗi xảy ra
    if (isError) {
        return (
            <div className="p-6 text-center text-red-600 bg-red-50 rounded-xl border border-red-200">
                <AlertCircle className="h-10 w-10 mx-auto mb-2" />
                <p>Không thể tải dữ liệu: {error.message}</p>
            </div>
        );
    }

    // Hiển thị dữ liệu 
    return (
        <div className="space-y-6">
            {/* Header: Tiêu đề và nút Thêm */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Danh Mục</h1>
                    <p className="text-gray-500 text-sm">Quản lý các loại thu chi của bạn</p>
                </div>

                <button
                    onClick={openModal}
                    className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Thêm Danh Mục
                </button>
            </div>

            {/* Component Danh sách Category */}
            <CategoryList
                categories={categories}
                onDelete={handleDeleteCategory}
            />

            {/* Component Modal Thêm Mới */}
            <AddCategoryModal
                isOpen={isModalOpen}
                onClose={closeModal}
                isLoading={createMutation.isPending}
                onSave={handleSaveCategory}
            />
        </div>
    );
}