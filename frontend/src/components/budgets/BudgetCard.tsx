"use client";

import { formatCurrency } from "@/lib/utils";
import { Trash2, AlertTriangle } from "lucide-react";

// Định nghĩa kiểu dữ liệu cho Budget
type Budget = {
    id: number;
    amount: number;     // Hạn mức
    spent: number;      // Đã tiêu
    percentage: number; // Phần trăm đã tiêu
    remaining: number;  // Số tiền còn lại
    category: {
        name: string;
    };
};

type BudgetCardProps = {
    budget: Budget;
    onDelete: (id: number) => void;
};

export function BudgetCard({ budget, onDelete }: BudgetCardProps) {
    // Mặc định là màu xanh lá
    let progressColor = "bg-green-600";
    let progressBg = "bg-green-100 dark:bg-green-900/30";

    // Nếu đã tiêu quá 100% 
    if (budget.percentage >= 100) {
        progressColor = "bg-red-600";
        progressBg = "bg-red-100 dark:bg-red-900/30";
    }
    // Nếu đã tiêu trên 85%
    else if (budget.percentage > 85) {
        progressColor = "bg-orange-500";
        progressBg = "bg-orange-100 dark:bg-orange-900/30";
    }

    // Kiểm tra xem có bị âm tiền không 
    const isOverBudget = budget.remaining < 0;

    // Độ rộng thanh tiến độ
    const progressBarWidth = Math.min(budget.percentage, 100);

    // HÀM XỬ LÝ XÓA
    function handleDelete() {
        if (confirm("Bạn có chắc muốn xóa ngân sách này?")) {
            onDelete(budget.id);
        }
    }

    return (
        <div className="p-5 bg-white dark:bg-gray-900 border rounded-xl shadow-sm hover:shadow-md transition-all dark:border-gray-700 flex flex-col justify-between h-full">
            <div>
                {/* Header Card: Tên danh mục và Nút xóa */}
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate max-w-[150px]" title={budget.category.name}>
                            {budget.category.name}
                        </h3>
                        <p className="text-xs text-gray-500 font-medium">
                            Hạn mức: {formatCurrency(budget.amount)}
                        </p>
                    </div>
                    <button
                        onClick={handleDelete}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors dark:hover:bg-red-900/20"
                        title="Xóa ngân sách"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>

                {/* Thông số: Đã tiêu và Phần trăm */}
                <div className="flex justify-between text-sm mb-2 font-medium">
                    <span className={isOverBudget ? "text-red-600 font-bold" : "text-gray-700 dark:text-gray-300"}>
                        {formatCurrency(budget.spent)}
                    </span>
                    <span className={isOverBudget ? "text-red-600" : "text-gray-500"}>
                        {Math.round(budget.percentage)}%
                    </span>
                </div>

                {/* Thanh tiến độ (Progress Bar) */}
                <div className={`w-full rounded-full h-3 ${progressBg} overflow-hidden`}>
                    <div
                        className={`h-3 rounded-full ${progressColor} transition-all duration-500 ease-out`}
                        style={{ width: `${progressBarWidth}%` }}
                    ></div>
                </div>
            </div>

            {/* Thông báo tình trạng (Footer Card) */}
            {isOverBudget ? (
                // Vượt quá ngân sách -> Hiện cảnh báo đỏ
                <div className="mt-4 flex items-center gap-2 text-xs text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg font-medium">
                    <AlertTriangle className="w-4 h-4" />
                    {/* Math.abs để lấy số dương (bỏ dấu trừ) */}
                    <span>Vượt ngân sách {formatCurrency(Math.abs(budget.remaining))}</span>
                </div>
            ) : (
                // Còn dư -> Hiện số tiền còn lại
                <div className="mt-4 text-xs text-gray-500 text-right">
                    Còn lại: <span className="font-semibold text-green-600">{formatCurrency(budget.remaining)}</span>
                </div>
            )}
        </div>
    );
}