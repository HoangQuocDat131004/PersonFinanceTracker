"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";

type AddCategoryModalProps = {
    isOpen: boolean;
    onClose: () => void;
    isLoading: boolean;
    onSave: (data: { name: string; type: "INCOME" | "EXPENSE" | "SAVING" }) => void;
};

export function AddCategoryModal({ isOpen, onClose, isLoading, onSave }: AddCategoryModalProps) {
    // 1. KHỞI TẠO STATE CHO FORM
    const [name, setName] = useState("");

    // Mặc định là Chi Tiêu (EXPENSE)
    const [type, setType] = useState<"INCOME" | "EXPENSE" | "SAVING">("EXPENSE");

    // Nếu modal đóng thì không vẽ gì cả
    if (isOpen === false) {
        return null;
    }

    // 2. CÁC HÀM XỬ LÝ SỰ KIỆN

    // Xử lý khi nhập tên
    function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
        setName(event.target.value);
    }

    // Xử lý khi chọn loại Chi tiêu
    function selectExpense() {
        setType("EXPENSE");
    }

    // Xử lý khi chọn loại Thu nhập
    function selectIncome() {
        setType("INCOME");
    }
    // Xử lý khi chọn loại Tiết kiệm
    function selectSaving() {
        setType("SAVING");
    }

    // Xử lý khi bấm nút Lưu
    function handleSubmit(e: React.FormEvent) {
        e.preventDefault(); // Chặn load lại trang

        // Kiểm tra xem tên có trống không (sau khi xóa khoảng trắng thừa)
        if (name.trim() === "") {
            return; // Nếu trống thì không làm gì cả
        }

        // Gọi hàm lưu ở trang cha
        onSave({
            name: name,
            type: type
        });

        // Reset form sau khi lưu
        setName("");
    }

    // --- PHẦN GIAO DIỆN ---
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-sm border dark:border-gray-700">

                {/* Header Modal */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Thêm Danh Mục</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form Nhập liệu */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Khu vực chọn Loại (Thu/Chi) */}
                    <div className="grid grid-cols-3 gap-3 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <button
                            type="button"
                            onClick={selectExpense}
                            // Nếu đang chọn EXPENSE thì nền trắng, chữ đỏ. Ngược lại chữ xám.
                            className={`py-2 text-sm font-medium rounded-md transition-all ${type === "EXPENSE"
                                ? "bg-white text-red-600 shadow-sm dark:bg-gray-800"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Chi Tiêu
                        </button>
                        <button
                            type="button"
                            onClick={selectIncome}
                            // Nếu đang chọn INCOME thì nền trắng, chữ xanh. Ngược lại chữ xám.
                            className={`py-2 text-sm font-medium rounded-md transition-all ${type === "INCOME"
                                ? "bg-white text-green-600 shadow-sm dark:bg-gray-800"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Thu Nhập
                        </button>
                        <button
                            type="button"
                            onClick={selectSaving}
                            className={`py-2 text-sm font-medium rounded-md transition-all ${type === "SAVING"
                                ? "bg-white text-blue-600 shadow-sm dark:bg-gray-800"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Tiết Kiệm
                        </button>
                    </div>

                    {/* Ô nhập Tên danh mục */}
                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                            Tên danh mục
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={handleNameChange}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-900 dark:border-gray-600"
                            placeholder="Ví dụ: Ăn uống, Lương..."
                            required
                        />
                    </div>

                    {/* Các nút bấm */}
                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-70 flex justify-center"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Lưu"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}