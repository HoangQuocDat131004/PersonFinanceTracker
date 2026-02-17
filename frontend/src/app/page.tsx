"use client";

import Link from "next/link";
import {
  ArrowRight, Wallet, Target, Repeat, FileText, Tags,
  TrendingUp, TrendingDown, DollarSign, Loader2, PiggyBank
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useMemo } from "react";
import { formatCurrency } from "@/lib/utils";
import { BudgetCard } from "@/components/budgets/BudgetCard";

export default function Home() {
  // 1. KHAI BÁO BIẾN (Trong phạm vi Component Home)
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  // 2. GỌI API
  const {
    data: transactions = [],
    isLoading: isLoadingLedger,
    isError
  } = trpc.transaction.getLedger.useQuery(undefined, { retry: false });

  const {
    data: budgets = [],
    isLoading: isLoadingBudget,
    refetch,
  } = trpc.budget.list.useQuery({
    month: currentMonth,
    year: currentYear
  }, { retry: false });

  const deleteBudgetMutation = trpc.budget.delete.useMutation({
    onSuccess: () => refetch()
  });

  // 3. TÍNH TOÁN THỐNG KÊ
  const stats = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    let totalSaving = 0;

    for (const t of transactions) {
      const amountNumber = Number(t.amount);

      if (t.type === "INCOME") {
        totalIncome += amountNumber;
      } else {
        if (t.type === "SAVING") {
          totalSaving += amountNumber;
        } else {
          totalExpense += amountNumber;
        }
      }
    }

    return {
      income: totalIncome,
      expense: totalExpense,
      balance: totalIncome - totalExpense - totalSaving,
      save: totalSaving,
    };
  }, [transactions]);

  // --- RENDER 1: ĐANG TẢI ---
  if (isLoadingLedger || isLoadingBudget) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  // --- RENDER 2: CHƯA ĐĂNG NHẬP ---
  if (isError || transactions === undefined) {
    return <LandingView />;
  }

  // --- RENDER 3: ĐÃ ĐĂNG NHẬP (DASHBOARD) ---
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">

      {/* A. Thống kê tổng quan */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tổng Quan Tài Chính</h1>
          <p className="text-gray-500">Chào mừng trở lại! Dưới đây là tình hình tài chính của bạn.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Card Số Dư */}
          <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium text-blue-100">Số dư hiện tại</span>
              <DollarSign className="w-6 h-6 text-blue-200" />
            </div>
            <div className="text-3xl font-bold">{formatCurrency(stats.balance)}</div>
            <div className="mt-2 text-sm text-blue-100">Tổng tích lũy </div>
          </div>

          {/* Card Thu Nhập */}
          <div className="p-6 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium text-gray-500 dark:text-gray-400">Tổng Thu Nhập</span>
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(stats.income)}
            </div>

          </div>

          {/* Card Chi Tiêu */}
          <div className="p-6 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium text-gray-500 dark:text-gray-400">Tổng Chi Tiêu</span>
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(stats.expense)}
            </div>
          </div>

          {/* Card Tiết Kiệm */}
          <div className="p-6 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium text-gray-500 dark:text-gray-400">Tổng tiết kiệm</span>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <PiggyBank className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(stats.save)}
            </div>
          </div>
        </div>
      </div>

      {/* B. Truy cập nhanh */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Truy cập nhanh</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <QuickLink href="/ledger" icon={Wallet} title="Sổ Cái" desc="Xem lịch sử giao dịch" color="text-blue-600" bg="bg-blue-50 dark:bg-blue-900/20" />
          <QuickLink href="/budgets" icon={Target} title="Ngân Sách" desc="Quản lý hạn mức chi" color="text-purple-600" bg="bg-purple-50 dark:bg-purple-900/20" />
          <QuickLink href="/categories" icon={Tags} title="Danh Mục" desc="Phân loại thu chi" color="text-orange-600" bg="bg-orange-50 dark:bg-orange-900/20" />
          <QuickLink href="/recurring" icon={Repeat} title="Định Kỳ" desc="Giao dịch tự động" color="text-green-600" bg="bg-green-50 dark:bg-green-900/20" />
          <QuickLink href="/import-export" icon={FileText} title="Dữ Liệu" desc="Nhập/Xuất Excel" color="text-gray-600" bg="bg-gray-50 dark:bg-gray-800" />
        </div>
      </div>

      {/* C. Tình hình ngân sách */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Tình hình ngân sách tháng {currentMonth}
          </h2>
          <Link href="/budgets" className="text-sm font-medium text-blue-600 hover:underline">
            Xem tất cả &rarr;
          </Link>
        </div>

        {budgets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgets.map((budget: any) => (
              <BudgetCard
                key={budget.id}
                budget={budget}
                onDelete={(id) => deleteBudgetMutation.mutate({ id })}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed dark:border-gray-700">
            <p className="text-gray-500 mb-2">Bạn chưa thiết lập ngân sách cho tháng này.</p>
            <Link href="/budgets" className="text-blue-600 font-medium hover:underline">
              + Thiết lập ngay
            </Link>
          </div>
        )}
      </div>

    </div >
  );
}

// ==========================================
// COMPONENT CON: GIAO DIỆN CHƯA ĐĂNG NHẬP
// ==========================================
function LandingView() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <div className="space-y-6 max-w-3xl">
        <div className="p-4 bg-blue-100 dark:bg-blue-900/30 w-fit mx-auto rounded-full">
          <Wallet className="w-16 h-16 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Quản lý tài chính <span className="text-blue-600">thông minh</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Theo dõi thu chi, lập ngân sách và đạt được mục tiêu tài chính của bạn một cách dễ dàng.
          Hoàn toàn miễn phí và bảo mật.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link href="/register" className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl">Bắt đầu ngay</Link>
          <Link href="/login" className="px-8 py-3 bg-white text-blue-600 border border-blue-200 rounded-lg font-semibold hover:bg-blue-50 transition">Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}

function QuickLink({ href, icon: Icon, title, desc, color, bg }: any) {
  return (
    <Link href={href} className="group p-5 border dark:border-gray-700 rounded-xl hover:shadow-md transition-all bg-white dark:bg-gray-800 flex flex-col justify-between">
      <div>
        <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{desc}</p>
      </div>
      <div className="mt-4 flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
        Truy cập <ArrowRight className="w-4 h-4 ml-1" />
      </div>
    </Link>
  );
}