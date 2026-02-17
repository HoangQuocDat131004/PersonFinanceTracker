"use client";

import { CSVExport } from "@/components/import-export/CSVExport";
import { CSVImport } from "@/components/import-export/CSVImport";

export default function ImportExportPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Nhập & Xuất Dữ Liệu
                </h1>
                <p className="text-gray-500">
                    Quản lý dữ liệu của bạn thông qua định dạng CSV.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <CSVExport />
                <CSVImport />
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700">
                <h3 className="font-bold mb-2">Quy định file CSV Import:</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <li>
                        <strong>Date:</strong> Định dạng YYYY-MM-DD (VD: 2024-05-20)
                    </li>
                    <li>
                        <strong>Amount:</strong> Số tiền (chỉ nhập số dương, hệ thống tự hiểu dựa vào Type)
                    </li>
                    <li>
                        <strong>Type:</strong> Phải là "INCOME" (Thu) hoặc "EXPENSE" (Chi)
                    </li>
                    <li>
                        <strong>Category:</strong> Tên danh mục (Ví dụ: Ăn uống). Nếu chưa có hệ thống sẽ tự tạo mới.
                    </li>
                    <li>
                        <strong>Description:</strong> (Tùy chọn) Mô tả chi tiết.
                    </li>
                </ul>
            </div>
        </div>
    );
}