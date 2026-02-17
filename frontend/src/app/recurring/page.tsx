"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Plus, Loader2, RefreshCw } from "lucide-react";
import { AddRecurringModal } from "@/components/recurring/AddRecurringModal";
import { RecurringList } from "@/components/recurring/RecurringList";

export default function RecurringPage() {
    // 1. STATE & API
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Lấy danh sách quy tắc
    const { data: rules = [], isLoading, refetch } = trpc.recurring.list.useQuery();

    // API Tạo mới
    const createMutation = trpc.recurring.create.useMutation({
        onSuccess: () => {
            refetch(); // Tải lại danh sách
            setIsModalOpen(false); // Đóng modal
        }
    });

    // API Xóa
    const deleteMutation = trpc.recurring.delete.useMutation({
        onSuccess: () => {
            refetch();
        }
    });

    // API Chạy kiểm tra (Lazy Trigger)
    // Nút này bấm để hệ thống kiểm tra xem có giao dịch nào đến hạn không
    const runCheckMutation = trpc.recurring.runCheck.useMutation({
        onSuccess: (data: any) => {
            alert(`Đã xử lý ${data.processed} giao dịch.`);
            refetch(); // Cập nhật lại ngày chạy tiếp theo
        }
    });

    // 2. CÁC HÀM XỬ LÝ SỰ KIỆN

    function openModal() {
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
    }

    // Hàm xử lý khi bấm nút "Lưu quy tắc" trong Modal
    function handleCreateRule(data: any) {
        createMutation.mutate(data);
    }

    // Hàm xử lý khi bấm nút "Dừng & Xóa" ở danh sách
    function handleDeleteRule(id: number) {
        if (confirm("Bạn có chắc muốn xóa quy tắc này?")) {
            deleteMutation.mutate({ id });
        }
    }

    // Hàm xử lý khi bấm nút "Kiểm tra ngay"
    function handleRunCheck() {
        runCheckMutation.mutate();
    }

    // --- GIAO DIỆN ---

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Header: Tiêu đề và nút bấm */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Giao Dịch Định Kỳ
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Tự động hóa các khoản chi phí lặp lại (tiền nhà, lương...)
                    </p>
                </div>

                <div className="flex gap-3">
                    {/* Nút Kiểm Tra Thủ Công */}
                    <button
                        onClick={handleRunCheck}
                        disabled={runCheckMutation.isPending}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm"
                    >
                        {runCheckMutation.isPending ? (
                            <Loader2 className="animate-spin w-5 h-5" />
                        ) : (
                            <RefreshCw className="w-5 h-5" />
                        )}
                        <span className="hidden sm:inline">Kiểm tra ngay</span>
                    </button>

                    {/* Nút Thêm Mới */}
                    <button
                        onClick={openModal}
                        className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-sm font-medium"
                    >
                        <Plus className="w-5 h-5" /> Thêm Mới
                    </button>
                </div>
            </div>

            {/* Danh sách các quy tắc */}
            <div className="min-h-[400px]">
                <RecurringList
                    rules={rules}
                    onDelete={handleDeleteRule}
                />
            </div>

            {/* Modal Thêm Mới */}
            {isModalOpen && (
                <AddRecurringModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onSave={handleCreateRule}
                    isLoading={createMutation.isPending}
                />
            )}
        </div>
    );
}