# Website Xác nhận giao dịch Haday Việt Nam

Ứng dụng React/Vite đọc trực tiếp mẫu Excel gốc, hiển thị hai bản thể hiện, cho phép chỉnh sửa dữ liệu gốc theo quyền và in/lưu PDF.

## Chạy trên máy
```bash
npm install
npm run dev
```

## Đưa lên GitHub
1. Tạo repository mới trên GitHub.
2. Tải toàn bộ nội dung thư mục này lên repository.
3. Commit và push lên nhánh `main`.

## Đưa lên Vercel
1. Đăng nhập Vercel bằng GitHub.
2. Chọn **Add New → Project**.
3. Import repository vừa tạo.
4. Framework Preset: **Vite**.
5. Build Command: `npm run build`.
6. Output Directory: `dist`.
7. Bấm **Deploy**.

## Phân quyền hiện tại
Đây là bản chạy thử phía trình duyệt với ba chế độ: Quản trị viên, Nhân viên nhập liệu, Chỉ xem. Để phân quyền bảo mật thực tế, cần kết nối Supabase Auth và cơ sở dữ liệu.

## File mẫu
File `public/mau-xac-nhan-giao-dich.xlsx` là dữ liệu nguồn được tải mặc định.
