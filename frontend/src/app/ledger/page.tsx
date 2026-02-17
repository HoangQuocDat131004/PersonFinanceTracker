"use client";

import { useMemo, useState } from "react";
import { LedgerTable } from "@/components/ledger/LedgerTable";
import { AddTransactionModal } from "@/components/ledger/AddTransactionModal";
import { Plus, Loader2, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function LedgerPage() {
    // KHỞI TẠO STATE quản lý việc đóng/mở Modal thêm mới
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [filter, setFilter] = useState<"all" | "income" | "expense" | "saving">("all");

    //GỌI API LẤY DANH SÁCH GIAO DỊCH
    const {
        data: transactions = [],
        isLoading,
        isError,
        error,
        refetch
    } = trpc.transaction.getLedger.useQuery();

    //CẤU HÌNH API TẠO MỚI (MUTATION)
    const createMutation = trpc.transaction.create.useMutation({
        onSuccess: () => {
            refetch();
            setIsAddModalOpen(false);
        },
        onError: (err: any) => {
            alert("Lỗi: " + err.message);
        }
    });

    // LOGIC LỌC DỮ LIỆU (FILTER)
    // useMemo giúp ghi nhớ kết quả, chỉ tính toán lại khi 'transactions' hoặc 'filter' thay đổi
    const filteredTransactions = useMemo(() => {
        if (filter === "all") {
            return transactions;
        }

        return transactions.filter((t: any) => {
            return t.type === filter.toUpperCase();
        });
    }, [transactions, filter]);


    function openModal() {
        setIsAddModalOpen(true);
    }

    function closeModal() {
        setIsAddModalOpen(false);
    }

    // Hàm xử lý khi bấm nút Filter
    function selectFilterAll() { setFilter("all"); }
    function selectFilterIncome() { setFilter("income"); }
    function selectFilterExpense() { setFilter("expense"); }
    function selectFilterSaving() { setFilter("saving"); }

    // Hàm xử lý khi người dùng bấm LƯU ở Modal
    function handleSaveTransaction(data: any) {
        // Gọi API tạo mới
        createMutation.mutate({
            amount: Number(data.amount),
            description: data.description,

            date: new Date(data.date).toISOString(),
            type: data.type,
            categoryId: data.categoryId,
        });
    }

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    // Nếu có lỗi
    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-red-600 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-red-100">
                <AlertCircle className="w-12 h-12 mb-4" />
                <p className="text-lg font-medium">Không thể tải dữ liệu</p>
                <p className="text-sm text-gray-500">{error.message}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Header: Tiêu đề và Bộ lọc */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                        Sổ Cái
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Quản lý chi tiết lịch sử thu chi của bạn
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Các nút bộ lọc */}
                    <div className="flex p-1 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 shadow-sm">
                        <button
                            onClick={selectFilterAll}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${filter === "all"
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200"
                                : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700"
                                }`}
                        >
                            Tất cả
                        </button>
                        <button
                            onClick={selectFilterIncome}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${filter === "income"
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200"
                                : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700"
                                }`}
                        >
                            Thu nhập
                        </button>
                        <button
                            onClick={selectFilterExpense}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${filter === "expense"
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200"
                                : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700"
                                }`}
                        >
                            Chi tiêu
                        </button>
                        <button
                            onClick={selectFilterSaving}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${filter === "saving"
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200"
                                : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700"
                                }`}
                        >
                            Tiết kiệm
                        </button>
                    </div>

                    {/* Nút Thêm Mới */}
                    <button
                        onClick={openModal}
                        className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-sm font-medium"
                    >
                        <Plus className="w-5 h-5" />
                        <span className="hidden sm:inline">Thêm Mới</span>
                    </button>
                </div>
            </div>

            {/* Bảng dữ liệu (Ledger Table) */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden">
                <LedgerTable transactions={filteredTransactions} />
            </div>

            {/* Modal Thêm Mới */}
            {isAddModalOpen && (
                <AddTransactionModal
                    isOpen={isAddModalOpen}
                    onClose={closeModal}
                    isLoading={createMutation.isPending}
                    onSave={handleSaveTransaction}
                />
            )}
        </div>
    );
}