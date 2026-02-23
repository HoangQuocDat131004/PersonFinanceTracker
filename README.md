💰 Personal Finance Tracker
📌 Giới thiệu dự án
Đây là một ứng dụng web quản lý tài chính cá nhân toàn diện, được tôi thực hiện nhằm mục đích tìm hiểu và thực hành các công nghệ hiện đại trong hệ sinh thái JavaScript/TypeScript. Dự án tập trung vào việc giải quyết bài toán theo dõi chi tiêu, lập ngân sách và quản lý dữ liệu tài chính một cách khoa học.

Trạng thái dự án: Tôi đã hoàn thiện các luồng tính năng cơ bản và đang trong quá trình học hỏi thêm để tối ưu hóa hệ thống.

🛠 Công nghệ sử dụng (Tech Stack)
Dự án được xây dựng với kiến trúc Full-stack hiện đại:

Frontend: Next.js 15, Recharts (vẽ biểu đồ), TanStack Table (quản lý bảng dữ liệu).

Backend: NestJS (Node.js framework).

API Communication: tRPC (giúp đảm bảo kiểu dữ liệu đồng nhất giữa Client và Server).

Database & ORM: MySQL & Prisma ORM.

✨ Các tính năng chính
Dưới đây là những tính năng tôi đã thực hiện trong dự án:

Sổ cái (Ledger): Theo dõi chi tiết mọi giao dịch thu nhập và chi phí.

Ngân sách (Budgets): Thiết lập hạn mức chi tiêu cho từng hạng mục để kiểm soát tài chính.

Quy tắc định kỳ (Recurring rules): Tự động hóa các giao dịch lặp lại hàng tháng.

Xuất/Nhập dữ liệu (CSV Import/Export): Hỗ trợ chuyển đổi dữ liệu linh hoạt với file CSV.

🚀 Hướng dẫn cài đặt và chạy thử
Để khởi động dự án trên môi trường Local, bạn cần cài đặt Node.js (>=20) và MySQL (8.0+).

1. Cấu hình Backend
Truy cập thư mục backend: cd backend

Cài đặt các thư viện: npm install

Tạo file .env và cấu hình biến môi trường:

Đoạn mã
DATABASE_URL="mysql://username:password@localhost:3306/finance_db"
Đồng bộ hóa cơ sở dữ liệu với Prisma:
npx prisma migrate dev --name init

Khởi chạy server: npm run start:dev (Server sẽ chạy tại cổng 3001).

2. Cấu hình Frontend
Truy cập thư mục frontend: cd frontend

Cài đặt các thư viện: npm install

Tạo file .env.local và thêm địa chỉ API:

Đoạn mã
NEXT_PUBLIC_API_URL="http://localhost:3001"
Khởi chạy ứng dụng: npm run dev (Ứng dụng sẽ chạy tại http://localhost:3000).

📈 Những gì tôi đã học được
Thông qua việc thực hiện dự án này, tôi đã bước đầu làm quen và biết cách:

Xây dựng ứng dụng Full-stack với sự kết hợp giữa Next.js và NestJS.

Sử dụng Prisma để quản lý cơ sở dữ liệu MySQL một cách hiệu quả thay vì viết truy vấn SQL thuần.

Cách tổ chức và hiển thị dữ liệu phức tạp thông qua TanStack Table và biểu đồ Recharts.

Hiểu về cơ chế truyền tải dữ liệu an toàn (Typesafe) với tRPC.
