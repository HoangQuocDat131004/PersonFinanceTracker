import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// 1. HÀM GỘP CLASS CSS (Dùng cho Tailwind)
// Giúp gộp nhiều class lại với nhau và xử lý xung đột (ví dụ p-4 vs p-2)
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// 2. HÀM ĐỊNH DẠNG TIỀN TỆ (VNĐ)
// Ví dụ: 50000 -> "50.000 ₫"
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(amount);
}


// 3. HÀM ĐỊNH DẠNG NGÀY THÁNG
// Ví dụ: "2024-05-20" -> "20/05/2024"
export function formatDate(date: Date | string): string {
    // Nếu đầu vào là chuỗi thì chuyển thành Date object
    const dateObject = typeof date === "string" ? new Date(date) : date;

    return new Intl.DateTimeFormat("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(dateObject);
}