"use client";

import { Trash2, FolderOpen } from "lucide-react";


type Category = {
    id: number;
    name: string;
    type: string;
};

type CategoryListProps = {
    categories: Category[];
    onDelete: (id: number) => void;
};

export function CategoryList({ categories, onDelete }: CategoryListProps) {

    // Danh sách trống
    if (categories.length === 0) {
        return (
            <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-dashed dark:border-gray-700">
                <div className="flex justify-center mb-3">
                    <FolderOpen className="h-10 w-10 text-gray-300" />
                </div>
                <p className="text-gray-500">Chưa có danh mục nào.</p>
            </div>
        );
    }

    // Có dữ liệu -> Hiển thị dạng lưới (Grid)
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => {
                let colorClass = "";
                let badgeClass = "";
                let typeLabel = "";

                if (cat.type === "INCOME") {
                    colorClass = "bg-green-500";
                    badgeClass = "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
                    typeLabel = "Thu nhập";
                }
                else if (cat.type === "SAVING") {
                    colorClass = "bg-purple-500";
                    badgeClass = "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
                    typeLabel = "Tiết kiệm";
                }
                else {
                    colorClass = "bg-red-500";
                    badgeClass = "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
                    typeLabel = "Chi tiêu";
                }

                // Hàm xử lý xóa 
                function handleDeleteClick() {
                    const confirmMessage = `Bạn có chắc muốn xóa danh mục "${cat.name}"?`;
                    if (confirm(confirmMessage)) {
                        onDelete(cat.id);
                    }
                }

                return (
                    <div
                        key={cat.id}
                        className="group flex items-center justify-between p-4 bg-white dark:bg-gray-900 border rounded-xl hover:shadow-md transition-all dark:border-gray-700"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-10 rounded-full ${colorClass}`} />

                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                    {cat.name}
                                </h3>
                                <span className={`text-xs px-2 py-0.5 rounded ${badgeClass}`}>
                                    {typeLabel}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={handleDeleteClick}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all dark:hover:bg-red-900/20"
                            title="Xóa danh mục"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}