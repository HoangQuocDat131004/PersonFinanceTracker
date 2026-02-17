"use client";

import { formatCurrency, formatDate } from "@/lib/utils";
import { Trash2 } from "lucide-react";

// Định nghĩa kiểu dữ liệu cho một Quy tắc định kỳ
type RecurringRule = {
    id: number;
    amount: number;
    description: string;
    frequency: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
    type: "INCOME" | "EXPENSE" | "SAVING";
    nextRun: Date; // Ngày chạy tiếp theo
    category?: {
        name: string;
    };
};

type Props = {
    rules: RecurringRule[];
    onDelete: (id: number) => void;
};

export function RecurringList({ rules, onDelete }: Props) {

    // Hàm chuyển đổi mã tần suất sang tiếng Việt
    function getFrequencyLabel(frequency: string) {
        switch (frequency) {
            case "DAILY": return "Hàng ngày";
            case "WEEKLY": return "Hàng tuần";
            case "MONTHLY": return "Hàng tháng";
            case "YEARLY": return "Hàng năm";
            default: return frequency;
        }
    }

    // Nếu không có quy tắc nào
    if (rules.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500">
                Chưa có giao dịch định kỳ nào.
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rules.map((rule) => {
                // --- LOGIC MÀU SẮC ---
                let typeLabel = "";
                let typeColorClass = "";

                if (rule.type === 'INCOME') {
                    typeLabel = "THU";
                    typeColorClass = "bg-green-100 text-green-700";
                }
                else if (rule.type === 'SAVING') {
                    typeLabel = "TIẾT KIỆM";
                    typeColorClass = "bg-purple-100 text-purple-700";
                } else {
                    typeLabel = "CHI";
                    typeColorClass = "bg-red-100 text-red-700";
                }

                // Hàm xử lý xóa riêng cho từng thẻ
                function handleDelete() {
                    onDelete(rule.id);
                }

                return (
                    <div key={rule.id} className="p-4 bg-white dark:bg-gray-900 border rounded-xl shadow-sm flex flex-col justify-between">
                        <div>
                            {/* Header thẻ: Loại và Tần suất */}
                            <div className="flex justify-between items-start">
                                <span className={`text-xs font-bold px-2 py-1 rounded ${typeColorClass}`}>
                                    {typeLabel}
                                </span>
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">
                                    {getFrequencyLabel(rule.frequency)}
                                </span>
                            </div>

                            {/* Nội dung chính */}
                            <h3 className="font-bold mt-2 text-lg">
                                {rule.description || "Không tiêu đề"}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {rule.category?.name || "Chưa phân loại"}
                            </p>
                        </div>

                        {/* Footer thẻ: Số tiền và Nút xóa */}
                        <div className="mt-4 pt-4 border-t dark:border-gray-700">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-500">Số tiền:</span>
                                <span className="font-bold">
                                    {formatCurrency(Number(rule.amount))}
                                </span>
                            </div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-sm text-gray-500">Lần lặp lại tới:</span>
                                <span className="text-sm font-medium text-blue-600">
                                    {formatDate(rule.nextRun)}
                                </span>
                            </div>

                            <button
                                onClick={handleDelete}
                                className="w-full flex items-center justify-center gap-2 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                            >
                                <Trash2 className="w-4 h-4" /> Dừng & Xóa
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}