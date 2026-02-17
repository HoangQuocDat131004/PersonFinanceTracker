"use client";

import { useState, useRef } from "react";
import { Upload, FileUp, CheckCircle, Loader2 } from "lucide-react";
import Papa from "papaparse";
import { trpc } from "@/lib/trpc";

export function CSVImport() {
    // 1. KHỞI TẠO STATE & REF
    const fileInputRef = useRef<HTMLInputElement>(null); // Dùng để kích hoạt nút chọn file ẩn
    const [previewData, setPreviewData] = useState<any[]>([]); // Lưu dữ liệu đọc được từ file
    const [isProcessing, setIsProcessing] = useState(false);   // Trạng thái đang đọc file

    // Lấy công cụ utils của tRPC để làm mới dữ liệu (invalidate)
    const utils = trpc.useUtils();

    // 2. CẤU HÌNH API IMPORT (MUTATION)
    const importMutation = trpc.data.importTransactions.useMutation({
        onSuccess: async (data: any) => {
            alert(`Đã nhập thành công ${data.count} giao dịch!`);

            // 🔥 QUAN TRỌNG: Làm mới (Invalidate) dữ liệu toàn bộ ứng dụng
            // Để đảm bảo khi sang trang Sổ cái, Ngân sách... sẽ thấy dữ liệu mới ngay lập tức
            await Promise.all([
                utils.transaction.getLedger.invalidate(),
                utils.category.list.invalidate(),
                utils.budget.list.invalidate(),
                utils.data.exportTransactions.invalidate()
            ]);

            // Reset trạng thái
            setPreviewData([]);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        },
        onError: (err: any) => {
            alert("Lỗi import: " + err.message);
        },
    });

    // 3. HÀM XỬ LÝ KHI NGƯỜI DÙNG CHỌN FILE
    function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsProcessing(true);

        // Sử dụng thư viện PapaParse để đọc file CSV
        Papa.parse(file, {
            header: true,          // File có dòng tiêu đề (Header)
            skipEmptyLines: true,  // Bỏ qua dòng trống
            encoding: "UTF-8",     // Đọc đúng tiếng Việt

            // Hàm chạy khi đọc xong
            complete: (results) => {
                // Ánh xạ (Map) dữ liệu từ file CSV sang chuẩn của API
                const validData = results.data
                    .map((row: any) => {
                        return {
                            // Cột bên trái là tên trường API cần
                            // Cột bên phải là tên cột trong file CSV (Viết hoa chữ cái đầu)
                            date: row.Date || new Date().toISOString(),
                            description: row.Description || "",
                            amount: Number(row.Amount) || 0,

                            // Xử lý loại: Nếu file ghi "Income" -> chuyển thành "INCOME"
                            type: (row.Type?.toUpperCase() === "INCOME" ? "INCOME" : "EXPENSE") as "INCOME" | "EXPENSE",

                            categoryName: row.Category || "Khác",
                        };
                    })
                    // Lọc bỏ những dòng lỗi (số tiền <= 0)
                    .filter((row) => row.amount > 0);

                setPreviewData(validData); // Lưu vào state để hiển thị xem trước
                setIsProcessing(false);    // Tắt loading
            },

            // Hàm chạy nếu đọc lỗi
            error: (err) => {
                alert("Lỗi đọc file: " + err.message);
                setIsProcessing(false);
            }
        });
    }

    // 4. HÀM XỬ LÝ KHI BẤM "XÁC NHẬN IMPORT"
    function handleConfirmImport() {
        if (previewData.length === 0) return;

        // Gọi API gửi dữ liệu lên Server
        importMutation.mutate(previewData);
    }

    // 5. HÀM XỬ LÝ KHI BẤM "HỦY BỎ"
    function handleCancel() {
        setPreviewData([]);
    }

    // 6. HÀM KÍCH HOẠT Ô CHỌN FILE
    function triggerFileInput() {
        fileInputRef.current?.click();
    }

    // --- GIAO DIỆN ---
    return (
        <div className="p-6 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-xl shadow-sm">
            {/* Tiêu đề */}
            <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <FileUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                    <h3 className="font-bold text-lg">Nhập Dữ Liệu (Import)</h3>
                    <p className="text-sm text-gray-500">Nhập giao dịch từ file CSV.</p>
                </div>
            </div>

            {/* Logic hiển thị: Nếu chưa có dữ liệu xem trước -> Hiện nút Upload */}
            {previewData.length === 0 ? (
                <div
                    onClick={triggerFileInput}
                    className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                    {/* Input file ẩn */}
                    <input
                        type="file"
                        accept=".csv"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                    />

                    {/* Hiển thị Loading hoặc Icon Upload */}
                    {isProcessing ? (
                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
                    ) : (
                        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    )}

                    <p className="text-sm text-gray-500">Click để chọn file CSV</p>
                    <p className="text-xs text-gray-400 mt-1">(Cột: Date, Amount, Type, Category...)</p>
                </div>
            ) : (
                // Nếu đã chọn file -> Hiện thông tin xem trước và nút Xác nhận
                <div className="space-y-4">
                    <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <span className="text-blue-700 dark:text-blue-300 font-medium flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Tìm thấy {previewData.length} giao dịch hợp lệ
                        </span>
                        <button
                            onClick={handleCancel}
                            className="text-xs text-red-500 hover:underline"
                        >
                            Hủy bỏ
                        </button>
                    </div>

                    <button
                        onClick={handleConfirmImport}
                        disabled={importMutation.isPending}
                        className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex justify-center items-center gap-2"
                    >
                        {importMutation.isPending ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            "Xác nhận Import"
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}