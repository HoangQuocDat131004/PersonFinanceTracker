import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TRPCProvider } from "@/components/providers/TRPCProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Navigation } from "@/components/layout/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Finance Tracker",
  description: "Quản lý tài chính cá nhân thông minh",
};

// RootLayout là khung xương chung cho toàn bộ trang web
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 min-h-screen flex flex-col`}>
        {/* 1. Bọc TRPCProvider để dùng API */}
        <TRPCProvider>
          {/* 2. Bọc AuthProvider để quản lý đăng nhập */}
          <AuthProvider>

            {/* Thanh điều hướng luôn hiển thị ở trên cùng */}
            <Navigation />

            {/* Nội dung chính của từng trang sẽ nằm ở đây */}
            <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>

          </AuthProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}