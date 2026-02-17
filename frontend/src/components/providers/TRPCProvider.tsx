"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import superjson from "superjson";
import Cookies from "js-cookie";

export function TRPCProvider({ children }: { children: React.ReactNode }) {
    //KHỞI TẠO QUERY CLIENT (Bộ nhớ đệm)
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                staleTime: 60 * 1000,
            },
        },
    }));

    //KHỞI TẠO TRPC CLIENT (Cầu nối gửi request)
    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({

                    url: "http://localhost:4000/trpc",
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