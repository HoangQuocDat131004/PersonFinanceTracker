"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthCard } from "./AuthCard";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { trpc } from "../../lib/trpc";

type MessageState = {
    text: string;
    variant: "success" | "error";
};

export function RegisterForm() {
    // 1. KHAI BÁO BIẾN (STATE) RIÊNG BIỆT
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState<MessageState | null>(null);

    const router = useRouter();

    //CẤU HÌNH API ĐĂNG KÝ
    const registerMutation = trpc.auth.register.useMutation({
        onSuccess: (data) => {
            setMessage({
                text: data.message,
                variant: "success",
            });

            setFullName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");

            setTimeout(() => {
                router.push("/login");
            }, 800);
        },
        onError: (error) => {
            setMessage({
                text: error.message || "Đăng ký thất bại, vui lòng thử lại.",
                variant: "error",
            });
        },
        onSettled: () => {
            setIsSubmitting(false);
        }
    });

    //HÀM XỬ LÝ KHI BẤM NÚT ĐĂNG KÝ
    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault(); // Chặn load lại trang
        setIsSubmitting(true);
        setMessage(null);

        if (password !== confirmPassword) {
            setMessage({
                text: "Mật khẩu xác nhận không trùng khớp.",
                variant: "error",
            });
            setIsSubmitting(false);
            return;
        }

        // Gọi API đăng ký
        registerMutation.mutate({
            fullName: fullName,
            email: email,
            password: password,
        });
    }

    return (
        <AuthCard
            title="Tạo tài khoản"
            description="Đăng ký để bắt đầu theo dõi ngân sách cá nhân."
            footer={{
                label: "Đã có tài khoản?",
                href: "/login",
                linkLabel: "Đăng nhập",
            }}
        >
            <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Họ tên */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Họ và tên</label>
                    <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full rounded-lg border px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900"
                        placeholder="Nguyễn Văn A"
                    />
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-lg border px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900"
                        placeholder="you@example.com"
                    />
                </div>

                {/* Mật khẩu */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Mật khẩu</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg border px-4 py-2 pr-10 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900"
                            placeholder="Tối thiểu 6 ký tự"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                {/* Xác nhận mật khẩu */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Xác nhận mật khẩu</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full rounded-lg border px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900"
                        placeholder="Nhập lại mật khẩu"
                    />
                </div>

                {/* Checkbox điều khoản */}
                <label className="flex items-center space-x-2 text-sm">
                    <input type="checkbox" required className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-gray-600 dark:text-gray-400">Tôi đồng ý với điều khoản sử dụng</span>
                </label>

                {/* Nút Đăng ký */}
                <button
                    type="submit"
                    disabled={isSubmitting || registerMutation.isPending}
                    className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                >
                    {(isSubmitting || registerMutation.isPending) ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang tạo tài khoản...
                        </>
                    ) : (
                        "Đăng ký"
                    )}
                </button>

                {/* Thông báo lỗi */}
                {message && (
                    <p className={`rounded-md p-3 text-sm ${message.variant === "success"
                        ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                        }`}
                    >
                        {message.text}
                    </p>
                )}
            </form>
        </AuthCard>
    );
}