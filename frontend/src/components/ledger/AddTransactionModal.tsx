"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

// Định nghĩa kiểu Props nhận vào
type AddTransactionModalProps = {
    isOpen: boolean;
    onClose: () => void;
    isLoading?: boolean;
    // Hàm onSave nhận vào 1 object dữ liệu
    onSave: (data: {
        date: string;
        description: string;
        amount: number;
        type: "INCOME" | "EXPENSE" | "SAVING";
        categoryId?: number;
    }) => void;
};

export function AddTransactionModal({
    isOpen,
    onClose,
    onSave,
    isLoading = false,
}: AddTransactionModalProps) {
    // 1. LẤY DANH SÁCH DANH MỤC
    const { data: categories } = trpc.category.list.useQuery();

    // 2. KHỞI TẠO CÁC STATE RIÊNG BIỆT
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState(""); // Dùng string cho input để dễ nhập
    const [type, setType] = useState<"INCOME" | "EXPENSE" | "SAVING">("EXPENSE");
    const [categoryId, setCategoryId] = useState<number | undefined>(undefined);

    // 3. EFFECT: RESET FORM KHI MỞ MODAL
    useEffect(() => {
        if (isOpen) {
            // Lấy ngày hôm nay dạng YYYY-MM-DD
            const today = new Date().toISOString().split("T")[0];

            setDate(today);
            setDescription("");
            setAmount("");
            setType("EXPENSE");
            setCategoryId(undefined);
        }
    }, [isOpen]);

    // 4. CÁC HÀM XỬ LÝ SỰ KIỆN

    function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
        setAmount(e.target.value);
    }

    function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
        setDate(e.target.value);
    }

    function handleDescriptionChange(e: React.ChangeEvent<HTMLInputElement>) {
        setDescription(e.target.value);
    }

    function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setCategoryId(Number(e.target.value));
    }

    function selectExpense() {
        setType("EXPENSE");
        setCategoryId(undefined); // Reset danh mục khi đổi loại
    }

    function selectIncome() {
        setType("INCOME");
        setCategoryId(undefined);
    }
    function selectSaving() {
        setType("SAVING");
        setCategoryId(undefined);
    }
    function handleSubmit(e: React.FormEvent) {
        e.preventDefault(); // Chặn load lại trang

        // Validate số tiền
        const amountNumber = Number(amount);
        if (!amount || amountNumber <= 0) {
            alert("Vui lòng nhập số tiền hợp lệ");
            return;
        }

        // Validate ngày
        if (!date) {
            alert("Vui lòng chọn ngày giao dịch");
            return;
        }

        // Gọi hàm lưu ở trang cha
        onSave({
            date: date,
            description: description,
            amount: amountNumber,
            type: type,
            categoryId: categoryId,
        });
    }

    // Nếu modal đóng thì không vẽ gì
    if (!isOpen) return null;

    // Lọc danh mục theo loại (Thu/Chi)
    const filteredCategories = categories?.filter((c: any) => c.type === type) || [];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md border dark:border-gray-700">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Thêm Giao Dịch</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Chọn Loại Giao Dịch */}
                    <div className="grid grid-cols-3 gap-3 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <button
                            type="button"
                            onClick={selectExpense}
                            className={`py-2 text-sm font-medium rounded-md transition-all ${type === "EXPENSE"
                                ? "bg-white text-red-600 shadow-sm dark:bg-gray-800"
                                : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                                }`}
                        >
                            Chi Tiêu
                        </button>
                        <button
                            type="button"
                            onClick={selectIncome}
                            className={`py-2 text-sm font-medium rounded-md transition-all ${type === "INCOME"
                                ? "bg-white text-green-600 shadow-sm dark:bg-gray-800"
                                : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                                }`}
                        >
                            Thu Nhập
                        </button>
                        <button
                            type="button"
                            onClick={selectSaving}
                            className={`py-2 text-sm font-medium rounded-md transition-all ${type === "SAVING"
                                ? "bg-white text-blue-600 shadow-sm dark:bg-gray-800"
                                : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                                }`}
                        >
                            Tiết Kiệm
                        </button>
                    </div>

                    {/* Nhập Số Tiền */}
                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                            Số tiền
                        </label>
                        <input
                            type="number"
                            value={amount}
                            onChange={handleAmountChange}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-900 dark:border-gray-600"
                            placeholder="0"
                            min="0"
                            required
                        />
                    </div>

                    {/* Chọn Danh Mục */}
                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                            Danh mục
                        </label>
                        <select
                            value={categoryId || ""}
                            onChange={handleCategoryChange}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-900 dark:border-gray-600"
                        >
                            <option value="">-- Chọn danh mục --</option>
                            {filteredCategories.map((cat: any) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>

                        {filteredCategories.length === 0 && (
                            <p className="text-xs text-orange-500 mt-1">
                                * Chưa có danh mục nào cho loại này.
                            </p>
                        )}
                    </div>

                    {/* Ngày & Mô tả */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                                Ngày
                            </label>
                            <input
                                type="date"
                                value={date}
                                onChange={handleDateChange}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-900 dark:border-gray-600"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                                Mô tả
                            </label>
                            <input
                                type="text"
                                value={description}
                                onChange={handleDescriptionChange}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-900 dark:border-gray-600"
                                placeholder="Ăn sáng, Lương..."
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex space-x-3 pt-4 border-t dark:border-gray-700 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center transition-colors"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Lưu"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}