# 💰 Personal Finance Tracker

## 📌 Giới thiệu dự án
Đây là một ứng dụng web quản lý tài chính cá nhân toàn diện, được tôi thực hiện nhằm mục đích tìm hiểu và thực hành các công nghệ hiện đại trong hệ sinh thái JavaScript/TypeScript. Dự án tập trung vào việc giải quyết bài toán theo dõi chi tiêu, lập ngân sách và quản lý dữ liệu tài chính một cách khoa học.

> **Trạng thái dự án:** Tôi đã hoàn thiện các luồng tính năng cơ bản và đang trong quá trình học hỏi thêm để tối ưu hóa hệ thống.

---

## 🛠 Công nghệ sử dụng (Tech Stack)
Dự án được xây dựng với kiến trúc **Full-stack** hiện đại:

* **Frontend:** Next.js 15, Recharts, TanStack Table.
* **Backend:** NestJS (Node.js framework).
* **API Communication:** tRPC.
* **Database & ORM:** MySQL & Prisma ORM.

---

## ✨ Các tính năng chính
* **Sổ cái (Ledger):** Theo dõi chi tiết mọi giao dịch thu nhập và chi phí.
* **Ngân sách (Budgets):** Thiết lập hạn mức chi tiêu cho từng hạng mục.
* **Quy tắc định kỳ (Recurring rules):** Tự động hóa các giao dịch lặp lại.
* **Xuất/Nhập dữ liệu (CSV):** Quản lý dữ liệu linh hoạt qua file CSV.

---

## 🚀 Hướng dẫn cài đặt và chạy thử
Yêu cầu: Đã cài đặt **Node.js (>=20)** và **MySQL (8.0+)**.

### 1. Cấu hình Backend
Di chuyển vào thư mục backend và cài đặt thư viện:
```bash
cd backend
npm install
```
Tạo file .env trong thư mục backend và dán cấu hình sau:
```bash
DATABASE_URL="mysql://username:password@localhost:3306/finance_db"
```
Khởi tạo database và chạy server:
```bash
npx prisma migrate dev --name init
```
```bash
npm run start:dev
```
### 2. Cấu hình Frontend
Mở một terminal mới, di chuyển vào thư mục frontend và cài đặt:
```bash
cd frontend
npm install
```
Tạo file .env.local trong thư mục frontend và thêm địa chỉ API:
```bash
NEXT_PUBLIC_API_URL="http://localhost:3001"
```
Khởi chạy ứng dụng:
```bash
npm run dev
```
