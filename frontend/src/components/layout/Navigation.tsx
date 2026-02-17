"use client";

import Link from "next/link";
import {
    Home,
    Wallet,
    Target,
    Repeat,
    FileText,
    LogIn,
    UserPlus,
    Menu,
    X,
    LogOut,
    Tags
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "../providers/AuthProvider";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function Navigation() {
    const pathname = usePathname();
    const router = useRouter();
    const { state, isAuthenticated, logout } = useAuth();

    // State cho menu mobile
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Lấy công cụ quản lý cache của React Query
    const queryClient = useQueryClient();

    // Danh sách các trang chức năng
    const menuItems = [
        { href: '/ledger', label: "Sổ cái", icon: Wallet },
        { href: '/budgets', label: "Ngân sách", icon: Target },
        { href: '/categories', label: "Danh mục", icon: Tags },
        { href: '/recurring', label: "Định kỳ", icon: Repeat },
        { href: '/import-export', label: "Dữ liệu", icon: FileText },
    ];

    // Hàm xử lý Đăng Xuất
    function handleLogout() {
        const confirmed = confirm("Bạn có chắc muốn đăng xuất?");
        if (confirmed) {
            // 1. Xóa trạng thái đăng nhập
            logout();

            // 2. Xóa sạch bộ nhớ đệm (Cache) để user sau không thấy dữ liệu cũ
            queryClient.clear();

            // 3. Đóng menu mobile (nếu đang mở)
            setIsMobileMenuOpen(false);

            // 4. Chuyển về trang đăng nhập
            router.push("/login");
            router.refresh();
        }
    }

    // Hàm mở/đóng menu mobile
    function toggleMobileMenu() {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    }

    // Hàm đóng menu mobile (dùng khi click vào link)
    function closeMobileMenu() {
        setIsMobileMenuOpen(false);
    }

    // --- GIAO DIỆN ---
    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-white shadow-sm dark:bg-gray-950 dark:border-gray-800">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">

                    {/* --- LOGO --- */}
                    <Link href="/" className="flex items-center gap-2 text-xl font-bold text-blue-600 dark:text-blue-400">
                        <Wallet className="h-6 w-6" />
                        <span className="hidden sm:inline">PersonFinanceTracker</span>
                    </Link>

                    {/* --- MENU MÁY TÍNH (DESKTOP) --- */}
                    <div className="hidden md:flex items-center space-x-1">
                        {/* Chỉ hiển thị menu khi đã đăng nhập */}
                        {isAuthenticated && menuItems.map((item) => {
                            const Icon = item.icon;
                            // Kiểm tra xem trang hiện tại có khớp link này không (để tô màu)
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                                            : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* --- NÚT ĐĂNG NHẬP / ĐĂNG XUẤT (DESKTOP) --- */}
                    <div className="hidden md:flex items-center gap-4">
                        {isAuthenticated ? (
                            // Nếu đã đăng nhập: Hiện tên user và nút Thoát
                            <div className="flex items-center gap-3">
                                <div className="text-sm text-right hidden lg:block">
                                    <p className="text-gray-500 text-xs">Xin chào,</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {state?.user?.fullName || "User"}
                                    </p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                                    title="Đăng xuất"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span className="hidden lg:inline">Thoát</span>
                                </button>
                            </div>
                        ) : (
                            // Nếu chưa đăng nhập: Hiện nút Đăng nhập & Đăng ký
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/login"
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                                >
                                    Đăng nhập
                                </Link>
                                <Link
                                    href="/register"
                                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm"
                                >
                                    Đăng ký
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* --- NÚT MENU MOBILE (HAMBURGER) --- */}
                    <button
                        className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                        onClick={toggleMobileMenu}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* --- MENU MOBILE (SỔ XUỐNG) --- */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t bg-white px-4 py-4 shadow-lg dark:bg-gray-950 dark:border-gray-800">
                    <div className="flex flex-col space-y-2">

                        {/* Danh sách menu mobile */}
                        {isAuthenticated && menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={closeMobileMenu}
                                    className={cn(
                                        "flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium",
                                        isActive
                                            ? "bg-blue-50 text-blue-700"
                                            : "text-gray-700 hover:bg-gray-100"
                                    )}
                                >
                                    <Icon className="h-5 w-5" />
                                    {item.label}
                                </Link>
                            );
                        })}

                        <div className="my-2 border-t border-gray-100 dark:border-gray-800" />

                        {/* Khu vực Auth Mobile */}
                        {isAuthenticated ? (
                            <div className="space-y-3 pt-2">
                                <div className="px-3 text-sm font-medium text-gray-500">
                                    Tài khoản: <span className="text-gray-900 font-bold">{state?.user?.fullName}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
                                >
                                    <LogOut className="h-5 w-5" />
                                    Đăng xuất
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <Link
                                    href="/login"
                                    onClick={closeMobileMenu}
                                    className="flex items-center justify-center rounded-md border border-gray-300 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    <LogIn className="w-4 h-4 mr-2" /> Đăng nhập
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={closeMobileMenu}
                                    className="flex items-center justify-center rounded-md bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                                >
                                    <UserPlus className="w-4 h-4 mr-2" /> Đăng ký
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}