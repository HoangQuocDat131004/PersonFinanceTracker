"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

type AddBudgetModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void; // Gọi khi lưu thành công để refresh lại list
    defaultMonth: number;  // Tháng mặc định (đang xem)
    defaultYear: number;   // Năm mặc định (đang xem)
};

export function AddBudgetModal({
    isOpen,
    onClose,
    onSuccess,
    defaultMonth,
    defaultYear,
}: AddBudgetModalProps) {
    // 1. LẤY DANH SÁCH DANH MỤC TỪ API
    const { data: categories = [], isLoading: isLoadingCats } = trpc.category.list.useQuery();

    // Lọc ra: chỉ lấy những danh mục là "Chi tiêu" (EXPENSE)
    // Vì ta chỉ lập ngân sách cho việc chi tiêu
    const expenseCategories = categories.filter((c: any) => c.type === "EXPENSE");

    // 2. KHAI BÁO STATE CHO FORM
    const [amount, setAmount] = useState("");
    const [categoryId, setCategoryId] = useState<string>("");

    // State lưu chuỗi "YYYY-MM" để dùng cho ô input chọn tháng
    // Ví dụ: "2024-05"
    const defaultMonthString = `${defaultYear}-${String(defaultMonth).padStart(2, "0")}`;
    const [monthYear, setMonthYear] = useState(defaultMonthString);

    // 3. EFFECT: RESET FORM KHI MỞ MODAL
    // Mỗi khi isOpen thay đổi thành true, ta xóa trắng form
    useEffect(() => {
        if (isOpen === true) {
            setAmount("");
            setCategoryId("");
            // Đặt lại tháng mặc định theo props truyền vào
            setMonthYear(`${defaultYear}-${String(defaultMonth).padStart(2, "0")}`);
        }
    }, [isOpen, defaultMonth, defaultYear]);

    // 4. CẤU HÌNH API LƯU NGÂN SÁCH
    const upsertMutation = trpc.budget.upsert.useMutation({
        onSuccess: () => {
            // Nếu thành công thì gọi hàm onSuccess (để tải lại danh sách)
            onSuccess();
            // Và đóng modal
            onClose();
        },
        onError: (err: any) => {
            alert(err.message);
        },
    });

    // 5. HÀM XỬ LÝ KHI BẤM LƯU
    function handleSubmit(e: React.FormEvent) {
        e.preventDefault(); // Chặn load lại trang

        // Bước 1: Kiểm tra dữ liệu (Validation)
        if (!categoryId) {
            alert("Vui lòng chọn danh mục");
            return;
        }

        const amountNumber = Number(amount);
        if (!amount || amountNumber <= 0) {
            alert("Vui lòng nhập số tiền hợp lệ");
            return;
        }

        // Bước 2: Tách chuỗi "2024-05" thành năm và tháng riêng
        const parts = monthYear.split("-"); // ["2024", "05"]
        const year = Number(parts[0]);
        const month = Number(parts[1]);

        // Bước 3: Gửi dữ liệu lên Server
        upsertMutation.mutate({
            categoryId: Number(categoryId),
            amount: amountNumber,
            month: month,
            year: year,
        });
    }

    // Nếu modal đang đóng thì không vẽ gì cả
    if (isOpen === false) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md border dark:border-gray-700">

                {/* Header Modal */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Thiết Lập Ngân Sách
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form nhập liệu */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Ô chọn Tháng/Năm */}
                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                            Áp dụng cho tháng
                        </label>
                        <input
                            type="month"
                            value={monthYear}
                            onChange={(e) => setMonthYear(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-900 dark:border-gray-600"
                            required
                        />
                    </div>

                    {/* Ô chọn Danh mục */}
                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                            Danh mục chi tiêu
                        </label>
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-900 dark:border-gray-600"
                            disabled={isLoadingCats}
                            required
                        >
                            <option value="">-- Chọn danh mục --</option>
                            {/* Hiển thị danh sách các mục chi tiêu */}
                            {expenseCategories.map((cat: any) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>

                        {/* Thông báo nếu chưa có danh mục nào */}
                        {expenseCategories.length === 0 && !isLoadingCats && (
                            <p className="text-xs text-orange-500 mt-1">
                                * Bạn chưa có danh mục Chi tiêu nào. Hãy tạo trước.
                            </p>
                        )}
                    </div>

                    {/* Ô nhập Số tiền */}
                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                            Hạn mức (VNĐ)
                        </label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-900 dark:border-gray-600 font-bold text-blue-600"
                            placeholder="Ví dụ: 5000000"
                            min="0"
                            required
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            Nếu ngân sách đã tồn tại, số tiền này sẽ ghi đè số cũ.
                        </p>
                    </div>

                    {/* Các nút bấm */}
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
                            // Khóa nút nếu đang gửi dữ liệu hoặc đang tải danh mục
                            disabled={upsertMutation.isPending || isLoadingCats}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-70 flex justify-center items-center"
                        >
                            {upsertMutation.isPending ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                "Lưu Ngân Sách"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}