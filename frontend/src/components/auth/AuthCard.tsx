"use client";

import Link from "next/link";
import { ReactNode } from "react";

type AuthCardProps = {
    title: string;
    description: string;
    children: ReactNode;
    footer: {
        label: string;
        href: string;
        linkLabel: string;
    }
}

export function AuthCard({ title, description, children, footer }: AuthCardProps) {
    return (
        <div className="w-full max-w-md space-y-6 rounded-2xl border bg-white/80 p-8 shadow-lg backdrop-blur">
            {/* Phần Đầu (Header) */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-semibold">
                    {title}
                </h1>
                <p className="text-sm text-gray-600">
                    {description}
                </p>
            </div>

            {/* Phần Nội Dung (Form) */}
            <div>
                {children}
            </div>

            {/* Phần Chân (Footer) */}
            <p className="text-center text-sm text-gray-600">
                {footer.label}{" "}
                <Link href={footer.href} className="font-medium text-blue-600 hover:underline">
                    {footer.linkLabel}
                </Link>
            </p>
        </div>
    );
}