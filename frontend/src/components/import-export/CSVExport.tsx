"use client";

import { trpc } from "@/lib/trpc";
import { Download, Loader2 } from "lucide-react";
import Papa from "papaparse";

export function CSVExport() {
    // 1. CẤU HÌNH API LẤY DỮ LIỆU
    // enabled: false nghĩa là chưa gọi API ngay khi vào trang, chỉ gọi khi bấm nút
    const { refetch, isFetching } = trpc.data.exportTransactions.useQuery(undefined, {
        enabled: false,
    });

    // 2. HÀM XỬ LÝ KHI BẤM NÚT "TẢI XUỐNG"
    async function handleExport() {
        // Bước 1: Gọi API để lấy dữ liệu mới nhất từ Server
        const result = await refetch();
        const transactions = result.data;

        // Nếu không có dữ liệu hoặc mảng rỗng thì báo lỗi
        if (!transactions || transactions.length === 0) {
            alert("Không có dữ liệu để xuất.");
            return;
        }

        // Bước 2: Chuẩn hóa dữ liệu cho file CSV (Data Mapping)
        // Biến đổi dữ liệu từ dạng JSON của Server sang dạng bảng cho Excel
        const csvData = transactions.map((t: any) => {
            return {
                Date: new Date(t.date).toISOString().split("T")[0], // Chỉ lấy ngày: "2024-05-20"
                Description: t.description,
                Amount: Number(t.amount),
                Type: t.type,
                Category: t.category?.name || "Khác", // Nếu không có tên danh mục thì ghi là "Khác"
            };
        });

        // Bước 3: Chuyển đổi mảng object thành chuỗi CSV (dùng thư viện PapaParse)
        const csvString = Papa.unparse(csvData);

        // Bước 4: Tạo file ảo (Blob) để tải xuống
        // 🔥 QUAN TRỌNG: Thêm "\uFEFF" vào đầu file để Excel nhận diện đây là file UTF-8 (Tiếng Việt)
        // Nếu thiếu cái này, mở bằng Excel sẽ bị lỗi font chữ
        const blob = new Blob(["\uFEFF" + csvString], { type: "text/csv;charset=utf-8;" });

        // Bước 5: Tạo đường link ảo và tự động bấm vào để tải
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a"); // Tạo thẻ <a> ẩn
        link.href = url;

        // Đặt tên file có kèm ngày tháng
        const today = new Date().toISOString().split('T')[0];
        link.setAttribute("download", `finance_export_${today}.csv`);

        document.body.appendChild(link);
        link.click(); // Tự động click
        document.body.removeChild(link); // Xóa thẻ <a> sau khi xong
    }

    // --- GIAO DIỆN ---
    return (
        <div className="p-6 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-xl shadow-sm">
            <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Download className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <h3 className="font-bold text-lg">Xuất Dữ Liệu (Export)</h3>
                    <p className="text-sm text-gray-500">
                        Tải về toàn bộ lịch sử giao dịch (Hỗ trợ tiếng Việt).
                    </p>
                </div>
            </div>

            <button
                onClick={handleExport}
                disabled={isFetching} // Khóa nút khi đang tải
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-70"
            >
                {/* Nếu đang tải thì hiện vòng quay, ngược lại hiện chữ */}
                {isFetching ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                    "Tải xuống CSV"
                )}
            </button>
        </div>
    );
}