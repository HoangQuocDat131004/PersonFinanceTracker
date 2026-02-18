"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import superjson from "superjson";
import Cookies from "js-cookie";

export function TRPCProvider({ children }: { children: React.ReactNode }) {
    // KHỞI TẠO QUERY CLIENT (Bộ nhớ đệm)
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                staleTime: 60 * 1000,
            },
        },
    }));

    // TỰ ĐỘNG XÁC ĐỊNH URL CHO BACKEND
    const getBaseUrl = () => {
        // Ưu tiên dùng biến môi trường từ Vercel nếu có
        if (process.env.NEXT_PUBLIC_API_URL) {
            return process.env.NEXT_PUBLIC_API_URL;
        }
        // Nếu không (chạy ở Local), dùng localhost
        return "http://localhost:4000";
    };

    // KHỞI TẠO TRPC CLIENT (Cầu nối gửi request)
    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({
                    // Kết hợp Base URL với endpoint /trpc
                    url: `${getBaseUrl()}/trpc`,
                    transformer: superjson,
                    async headers() {
                        const token = Cookies.get("auth-token");

                        if (token) {
                            return { authorization: `Bearer ${token}` };
                        }
                        return {};
                    },
                }),
            ],
        })
    );

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </trpc.Provider>
    );
}