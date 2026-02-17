"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Loader2, Plus, TrendingUp, Calendar } from "lucide-react";
import { BudgetCard } from "@/components/budgets/BudgetCard";
import { AddBudgetModal } from "@/components/budgets/AddBudgetModal";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function BudgetPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedYear, setSelectedYear] = useState(currentYear);

    //GỌI API LẤY DANH SÁCH NGÂN SÁCH
    const {
        data: budgets = [],
        isLoading,
        refetch
    } = trpc.budget.list.useQuery({
        month: selectedMonth,
        year: selectedYear
    });

    // Cấu hình API xóa ngân sách
    const deleteMutation = trpc.budget.delete.useMutation({
        onSuccess: () => {
            refetch();
        }
    });

    // XỬ LÝ DỮ LIỆU CHO BIỂU ĐỒ
    const chartData = budgets.map((budget: any) => {
        return {
            name: budget.category.name,
            "Hạn mức": Number(budget.amount),
            "Thực tế": budget.spent
        };
    });

    // 4. CÁC HÀM XỬ LÝ SỰ KIỆN (HANDLERS)

    // Hàm xử lý khi người dùng chọn tháng trên ô input
    function handleDateChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value; // Giá trị có dạng "2024-12"

        if (value) {
            // Tách chuỗi thành năm và tháng
            const parts = value.split('-'); // ["2024", "12"]
            const year = Number(parts[0]);
            const month = Number(parts[1]);

            setSelectedYear(year);
            setSelectedMonth(month);
        }
    }

    // Hàm xử lý mở modal
    function openModal() {
        setIsModalOpen(true);
    }

    // Hàm xử lý đóng modal
    function closeModal() {
        setIsModalOpen(false);
    }

    // Hàm xử lý khi thêm thành công
    function handleSuccess() {
        refetch(); // Tải lại dữ liệu
    }

    const monthInputValue = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* Header: Tiêu đề và bộ lọc */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ngân Sách</h1>
                    <p className="text-gray-500 mt-1">
                        Kiểm soát chi tiêu tháng {selectedMonth}/{selectedYear}
                    </p>
                </div>

                <div className="flex flex-wrap gap-3 items-center">
                    {/* Ô chọn tháng */}
                    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border dark:border-gray-700 px-3 py-2 rounded-lg shadow-sm">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <input
                            type="month"
                            value={monthInputValue}
                            onChange={handleDateChange} // Gọi hàm xử lý ở trên
                            className="bg-transparent border-none focus:ring-0 text-sm font-medium"
                        />
                    </div>

                    {/* Nút Thêm Mới */}
                    <button
                        onClick={openModal}
                        className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-sm font-medium"
                    >
                        <Plus className="w-5 h-5" /> Thiết lập
                    </button>
                </div>
            </div>

            {/* Phần Biểu Đồ (Chỉ hiện nếu có dữ liệu) */}
            {budgets.length > 0 && (
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border dark:border-gray-700 shadow-sm">
                    <h3 className="font-bold mb-6 flex items-center gap-2 text-lg">
                        <TrendingUp className="w-5 h-5 text-blue-500" /> Biểu đồ so sánh
                    </h3>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} dy={10} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Bar dataKey="Hạn mức" fill="#d6bfbfff" radius={[4, 4, 0, 0]} barSize={40} />
                                <Bar dataKey="Thực tế" fill="#46d666ff" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* Phần Danh sách Ngân sách (Dạng lưới) */}
            <div>
                <h3 className="font-bold text-xl mb-4 text-gray-800 dark:text-gray-200">Chi tiết theo danh mục</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Lặp qua từng ngân sách để vẽ thẻ Card */}
                    {budgets.map((budget: any) => (
                        <BudgetCard
                            key={budget.id}
                            budget={budget}
                            onDelete={(id) => deleteMutation.mutate({ id })}
                        />
                    ))}

                    {/* Nếu không có ngân sách nào thì hiện thông báo */}
                    {budgets.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
                            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-3">
                                <TrendingUp className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium">Chưa có ngân sách nào cho tháng này.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Thêm Ngân sách (Chỉ hiện khi isModalOpen = true) */}
            {isModalOpen && (
                <AddBudgetModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onSuccess={handleSuccess}
                    defaultMonth={selectedMonth}
                    defaultYear={selectedYear}
                />
            )}
        </div>
    );
}