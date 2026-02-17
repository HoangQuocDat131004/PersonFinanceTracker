"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AuthCard } from "./AuthCard";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import Cookies from "js-cookie";
import { useAuth } from "@/components/providers/AuthProvider";

type MessageState = {
    text: string;
    variant: "success" | "error";
};

export function LoginForm() {
    // CÁC BIẾN TRẠNG THÁI (STATE) RIÊNG BIỆT
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState<MessageState | null>(null);

    const router = useRouter();
    const { login } = useAuth(); // Lấy hàm login từ file AuthProvider

    // CẤU HÌNH GỌI API ĐĂNG NHẬP (Sử dụng tRPC)
    const loginMutation = trpc.auth.login.useMutation({
        onSuccess: (responseData) => {
            //Lưu token vào Cookie trình duyệt (để lần sau vào web không phải đăng nhập lại)
            Cookies.set("auth-token", responseData.token, { expires: 7 });

            // Chuẩn bị dữ liệu user để cập nhật vào ứng dụng
            const userInfo = {
                user: {
                    id: String(responseData.user.id),
                    email: responseData.user.email,
                    fullName: responseData.user.name || "User",
                },
                // Khởi tạo các danh sách rỗng (sẽ tải sau)
                transactions: [],
                budgets: [],
                recurringRules: []
            };

            //Báo cho cả ứng dụng biết là "Đã đăng nhập"
            login(userInfo);

            setMessage({
                text: "Đăng nhập thành công! Đang chuyển hướng...",
                variant: "success",
            });

            setTimeout(() => {
                router.push("/");
                router.refresh(); // Tải lại trang để cập nhật thanh menu
            }, 500);
        },

        onError: (error) => {
            setMessage({
                text: error.message || "Email hoặc mật khẩu không đúng.",
                variant: "error",
            });
        }
    });

    // Hàm xử lý khi người dùng nhập Email
    function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        setEmail(value);
    }

    // Hàm xử lý khi người dùng nhập Mật khẩu
    function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        setPassword(value);
    }

    // Hàm xử lý khi bấm nút "Mắt" (Hiện/Ẩn mật khẩu)
    function togglePasswordVisibility() {
        if (showPassword === true) {
            setShowPassword(false);
        } else {
            setShowPassword(true);
        }
    }

    // Hàm xử lý khi bấm nút "Đăng nhập"
    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault(); // Ngăn trình duyệt tải lại trang
        setMessage(null);

        // Gọi API gửi dữ liệu đi
        loginMutation.mutate({
            email: email,
            password: password
        });
    }

    return (
        <AuthCard
            title="Chào mừng quay lại"
            description="Đăng nhập để tiếp tục quản lý tài chính của bạn."
            footer={{
                label: "Chưa có tài khoản?",
                href: "/register",
                linkLabel: "Đăng ký ngay",
            }}
        >
            <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={handleEmailChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                        placeholder="you@example.com"
                        disabled={loginMutation.isPending}
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Mật khẩu</label>
                    </div>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={handlePasswordChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                            placeholder="••••••••"
                            disabled={loginMutation.isPending}
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="text-gray-600 dark:text-gray-400">Ghi nhớ đăng nhập</span>
                    </label>
                    <button type="button" className="font-medium text-blue-600 hover:underline">
                        Quên mật khẩu?
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={loginMutation.isPending}
                    className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                >
                    {loginMutation.isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang xử lý...
                        </>
                    ) : (
                        "Đăng nhập"
                    )}
                </button>

                {message !== null && (
                    <div className={`flex items-center gap-2 rounded-md p-3 text-sm ${message.variant === "success"
                        ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                        }`}>
                        {message.variant === "error" && <AlertCircle className="w-4 h-4" />}
                        {message.text}
                    </div>
                )}
            </form>
        </AuthCard>
    );
}