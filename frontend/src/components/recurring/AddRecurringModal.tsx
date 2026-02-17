"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

// Định nghĩa kiểu dữ liệu form
type RecurringFormData = {
    amount: number | string;
    description: string;
    frequency: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
    type: "INCOME" | "EXPENSE" | "SAVING";
    startDate: string;
    categoryId?: number;
};

type AddRecurringModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: RecurringFormData) => void;
    isLoading?: boolean;
};

export function AddRecurringModal({
    isOpen,
    onClose,
    onSave,
    isLoading = false,
}: AddRecurringModalProps) {
    // 1. LẤY DANH SÁCH DANH MỤC
    const { data: categories = [] } = trpc.category.list.useQuery();

    // 2. KHỞI TẠO STATE RIÊNG BIỆT
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [frequency, setFrequency] = useState<"DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY">("MONTHLY");
    const [type, setType] = useState<"INCOME" | "EXPENSE" | "SAVING">("EXPENSE");
    const [startDate, setStartDate] = useState("");
    const [categoryId, setCategoryId] = useState<number | undefined>(undefined);

    // 3. EFFECT: RESET FORM KHI MỞ MODAL
    useEffect(() => {
        if (isOpen) {
            // Lấy ngày hôm nay: YYYY-MM-DD
            const today = new Date().toISOString().split("T")[0];

            setAmount("");
            setDescription("");
            setFrequency("MONTHLY");
            setType("EXPENSE");
            setStartDate(today);
            setCategoryId(undefined);
        }
    }, [isOpen]);

    // 4. CÁC HÀM XỬ LÝ SỰ KIỆN

    function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
        setAmount(e.target.value);
    }

    function handleDescriptionChange(e: React.ChangeEvent<HTMLInputElement>) {
        setDescription(e.target.value);
    }

    function handleStartDateChange(e: React.ChangeEvent<HTMLInputElement>) {
        setStartDate(e.target.value);
    }

    function handleFrequencyChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setFrequency(e.target.value as any);
    }

    function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setCategoryId(Number(e.target.value));
    }

    function selectExpense() {
        setType("EXPENSE");
        setCategoryId(undefined); // Reset danh mục
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
        e.preventDefault();

        // Kiểm tra số tiền
        const amountNumber = Number(amount);
        if (!amount || amountNumber <= 0) {
            alert("Vui lòng nhập số tiền hợp lệ");
            return;
        }

        // Gửi dữ liệu
        onSave({
            amount: amountNumber,
            description: description,
            frequency: frequency,
            type: type,
            startDate: startDate,
            categoryId: categoryId,
        });
    }

    // Nếu modal đóng thì không vẽ gì
    if (!isOpen) return null;

    // Lọc danh mục theo loại đang chọn
    const filteredCategories = categories.filter((c: any) => c.type === type);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md border dark:border-gray-700 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Thêm Giao Dịch Định Kỳ
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* --- LOẠI GIAO DỊCH (Tabs) --- */}
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
                                ? "bg-white text-purple-600 shadow-sm dark:bg-gray-800"
                                : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                                }`}
                        >
                            Tiết kiệm
                        </button>
                    </div>

                    {/* --- TẦN SUẤT --- */}
                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                            Tần suất lặp lại
                        </label>
                        <select
                            value={frequency}
                            onChange={handleFrequencyChange}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-900 dark:border-gray-600"
                        >
                            <option value="DAILY">Hàng ngày</option>
                            <option value="WEEKLY">Hàng tuần</option>
                            <option value="MONTHLY">Hàng tháng</option>
                            <option value="YEARLY">Hàng năm</option>
                        </select>
                    </div>

                    {/* --- SỐ TIỀN --- */}
                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                            Số tiền (VNĐ)
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

                    {/* --- DANH MỤC --- */}
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
                    </div>

                    {/* --- NGÀY BẮT ĐẦU & MÔ TẢ --- */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                                Bắt đầu từ
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={handleStartDateChange}
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
                                placeholder="Tiền nhà, Netflix..."
                            />
                        </div>
                    </div>

                    {/* --- BUTTONS --- */}
                    <div className="flex space-x-3 pt-4 border-t dark:border-gray-700 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-70 flex justify-center items-center"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Lưu quy tắc"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}