"use client";

import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useReducer,
    type ReactNode,
} from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";


type User = {
    id: string;
    fullName: string;
    email: string;
};

type Transaction = { id: string; userId: string; date: Date; description: string; amount: number; type: "income" | "expense"; category: string; };
type Budget = { id: string; userId: string; category: string; limit: number; spent: number; period: "monthly" | "yearly"; };
type RecurringRule = { id: string; userId: string; description: string; amount: number; type: "income" | "expense"; category: string; frequency: "daily" | "weekly" | "monthly" | "yearly"; nextDate: Date; isActive: boolean; };

// State tổng của ứng dụng: Chứa User và các danh sách dữ liệu
type AuthState = {
    user: User;
    transactions: Transaction[];
    budgets: Budget[];
    recurringRules: RecurringRule[];
};

// Các hành động có thể làm thay đổi State
type AuthAction =
    | { type: "LOGIN"; payload: AuthState } // Hành động Đăng nhập (kèm dữ liệu mới)
    | { type: "LOGOUT" }                    // Hành động Đăng xuất 
    | { type: "ADD_TRANSACTION"; payload: Transaction }
    | { type: "ADD_BUDGET"; payload: Budget }
    | { type: "ADD_RECURRING_RULE"; payload: RecurringRule };

const STORAGE_KEY = "finance-tracker-auth";
const AuthContext = createContext<any>(undefined);

//HÀM REDUCER: Hàm này nhận vào State cũ + Hành động, trả về State mới
const authReducer = (currentState: AuthState | null, action: AuthAction): AuthState | null => {
    let newState: AuthState | null = null;

    // Kiểm tra xem hành động là gì
    if (action.type === "LOGIN") {
        //State mới chính là dữ liệu người dùng gửi vào
        newState = action.payload;
    }
    else if (action.type === "LOGOUT") {
        // State mới là null (trống rỗng)
        newState = null;
    }
    else if (action.type === "ADD_TRANSACTION") {
        // Copy state cũ, thêm giao dịch mới vào mảng
        if (currentState) {
            newState = {
                ...currentState,
                transactions: [...currentState.transactions, action.payload]
            };
        }
    }
    // ... Các trường hợp ADD_BUDGET, ADD_RECURRING_RULE tương tự ...
    else {
        // Mặc định giữ nguyên state cũ
        return currentState;
    }

    // Tự động lưu State mới xuống LocalStorage 
    if (typeof window !== "undefined") {
        if (newState !== null) {
            // Chuyển dữ liệu thành chuỗi JSON và lưu lại
            const dataToSave = JSON.stringify({
                ...newState,
                transactions: newState.transactions.map(t => ({ ...t, date: t.date.toISOString() })),
                recurringRules: newState.recurringRules.map(r => ({ ...r, nextDate: r.nextDate.toISOString() })),
            });
            window.localStorage.setItem(STORAGE_KEY, dataToSave);
        } else {
            //Đăng xuất thì xóa khỏi LocalStorage
            window.localStorage.removeItem(STORAGE_KEY);
        }
    }

    return newState;
};

// PROVIDER COMPONENT
export function AuthProvider({ children }: { children: ReactNode }) {
    // Khởi tạo state quản lý xác thực
    const [state, dispatch] = useReducer(authReducer, null);

    // Hàm này chạy 1 lần khi tải trang (F5) để khôi phục đăng nhập
    useEffect(() => {
        const token = Cookies.get("auth-token");
        const storedData = window.localStorage.getItem(STORAGE_KEY);

        //Có Token và có dữ liệu trong máy
        if (token && storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                // Khôi phục lại kiểu Date (vì trong JSON nó là chuỗi)
                const restoredState = {
                    ...parsedData,
                    transactions: parsedData.transactions.map((t: any) => ({ ...t, date: new Date(t.date) })),
                    recurringRules: parsedData.recurringRules.map((r: any) => ({ ...r, nextDate: new Date(r.nextDate) })),
                };
                // Gửi lệnh LOGIN nội bộ
                dispatch({ type: "LOGIN", payload: restoredState });
            } catch (e) {

            }
        }
        //Có Token nhưng mất dữ liệu trong máy
        else if (token && !storedData) {
            try {
                const decoded: any = jwtDecode(token);
                if (decoded.userId) {
                    const baseState: AuthState = {
                        user: { id: decoded.userId, email: decoded.email, fullName: decoded.name || "User" },
                        transactions: [],
                        budgets: [],
                        recurringRules: [],
                    };
                    dispatch({ type: "LOGIN", payload: baseState });
                }
            } catch (error) {
                Cookies.remove("auth-token");
            }
        }
        // Không có Token
        else if (!token) {
            dispatch({ type: "LOGOUT" });
        }
    }, []);

    // Các hàm tiện ích để gọi từ bên ngoài
    const login = (payload: any) => {
        const cleanData = {
            user: payload.user,
            transactions: (payload.transactions || []).map((t: any) => ({ ...t, date: new Date(t.date) })),
            budgets: payload.budgets || [],
            recurringRules: (payload.recurringRules || []).map((r: any) => ({ ...r, nextDate: new Date(r.nextDate) })),
        };
        dispatch({ type: "LOGIN", payload: cleanData });
    };

    const logout = () => {
        Cookies.remove("auth-token");
        dispatch({ type: "LOGOUT" });
    };

    // Đóng gói các hàm và dữ liệu để chia sẻ cho các component con
    const value = useMemo(() => ({
        state,
        isAuthenticated: (state !== null), // Có state nghĩa là đã đăng nhập
        login,
        logout,
        // (Bạn có thể thêm các hàm addTransaction... vào đây tương tự như code cũ nếu cần)
    }), [state]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook để các file khác sử dụng
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth phải được dùng bên trong AuthProvider");
    }
    return context;
}