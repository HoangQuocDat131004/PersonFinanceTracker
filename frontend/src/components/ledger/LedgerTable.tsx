"use client";

import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender,
    type ColumnDef,
    type SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowUpDown, ArrowUp, ArrowDown, PiggyBankIcon } from "lucide-react";

type Transaction = {
    id: number;
    date: Date;
    description: string | null;
    amount: number;
    type: string;
    category?: {
        name: string;
        id: number;
    } | null;
};

type LedgerTableProps = {
    transactions: Transaction[];
};

export function LedgerTable({ transactions }: LedgerTableProps) {
    // State quản lý việc sắp xếp
    const [sorting, setSorting] = useState<SortingState>([
        { id: "date", desc: true }, // Mặc định sắp xếp theo ngày giảm dần
    ]);

    // ĐỊNH NGHĨA CÁC CỘT (COLUMNS)
    const columns: ColumnDef<Transaction>[] = [
        // CỘT 1: NGÀY
        {
            accessorKey: "date",
            // Tiêu đề cột (có nút sắp xếp)
            header: ({ column }) => {
                return (
                    <button
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="flex items-center space-x-2 hover:text-blue-600 font-medium"
                    >
                        <span>Ngày</span>
                        <ArrowUpDown className="w-4 h-4" />
                    </button>
                );
            },
            // Nội dung ô
            cell: ({ row }) => {
                return <span className="text-gray-600 dark:text-gray-300">{formatDate(row.original.date)}</span>;
            },
        },
        // CỘT 2: MÔ TẢ
        {
            accessorKey: "description",
            header: "Mô tả",
            cell: ({ row }) => {
                return (
                    <div className="font-medium text-gray-900 dark:text-white">
                        {row.original.description || "Không có mô tả"}
                    </div>
                );
            },
        },
        // CỘT 3: DANH MỤC
        {
            id: "category",
            header: "Danh mục",
            accessorFn: (row) => row.category?.name, // Giúp sắp xếp theo tên danh mục
            cell: ({ row }) => {
                const categoryName = row.original.category?.name || "Chưa phân loại";
                const isSavings = categoryName.toLowerCase().includes("tiết kiệm") || categoryName.toLowerCase().includes("save");
                return (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                        ${isSavings
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                        }`}>
                        {categoryName}
                    </span>
                );
            },
        },
        // CỘT 4: SỐ TIỀN
        {
            accessorKey: "amount",
            header: ({ column }) => {
                return (
                    <button
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="flex items-center space-x-2 hover:text-blue-600 font-medium ml-auto"
                    >
                        <span>Số tiền</span>
                        <ArrowUpDown className="w-4 h-4" />
                    </button>
                );
            },
            cell: ({ row }) => {
                const amount = Number(row.original.amount);
                const type = row.original.type;
                // Logic hiển thị màu và icon
                let colorClass = "";
                let Icon = null;

                if (type === "INCOME") {
                    colorClass = "text-green-600 dark:text-green-400";
                    Icon = ArrowUp;
                }
                else if (type === "SAVING") {
                    colorClass = "text-purple-600 dark:text-purple-400";
                    Icon = PiggyBankIcon;
                }
                else {
                    colorClass = "text-red-600 dark:text-red-400";
                    Icon = ArrowDown;
                }

                return (
                    <div className={`font-semibold flex items-center justify-end space-x-1 ${colorClass}`} >
                        {Icon && <Icon className="w-4 h-4" />}
                        <span>{formatCurrency(amount)}</span>
                    </div >
                );
            },
        },
    ];

    // KHỞI TẠO BẢNG (TanStack Table)
    const table = useReactTable({
        data: transactions,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        state: {
            sorting,
        },
    });

    return (
        <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-900 dark:border-gray-700 shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full">
                    {/* Phần Đầu Bảng (Thead) */}
                    <thead className="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>

                    {/* Phần Thân Bảng (Tbody) */}
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {table.getRowModel().rows.map((row) => (
                            <tr
                                key={row.id}
                                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Hiển thị khi không có dữ liệu */}
            {transactions.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-2">Chưa có giao dịch nào</div>
                    <p className="text-sm text-gray-500">
                        Nhấn nút "Thêm Giao Dịch" để bắt đầu ghi chép.
                    </p>
                </div>
            )}
        </div>
    );
}