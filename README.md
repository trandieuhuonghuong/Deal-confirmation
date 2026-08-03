# Haday Việt Nam — Xác nhận giao dịch v3

Phiên bản chạy thử đã tổng hợp các yêu cầu mới:

- Giao diện và khoảng cách được tối ưu để hiển thị như một bản xác nhận giao dịch thông thường.
- Ba ngôn ngữ: Tiếng Việt, 中文（简体） và English.
- Bỏ phần các dòng cố định từ 7 đến 23.
- Danh sách sản phẩm hỗ trợ chọn sản phẩm, thêm dòng trống, sửa và xóa từng dòng.
- Tự tính thành tiền và tổng cộng.
- Khách hàng, địa chỉ, điều khoản thanh toán và sản phẩm được chọn ngay tại trường tương ứng.
- Dữ liệu tham khảo không còn hiển thị thành tab riêng.
- Quản lý dữ liệu gốc trong cửa sổ riêng, có phân quyền chỉnh sửa.
- Nhập Excel, tải Excel và In/Lưu PDF.

## Chạy thử

```bash
npm install
npm run dev
```

Mở địa chỉ do Vite hiển thị, thường là `http://localhost:5173`.

## GitHub và Vercel

1. Giải nén file ZIP.
2. Tải toàn bộ nội dung lên GitHub.
3. Import repository vào Vercel.
4. Framework Preset: Vite.
5. Build Command: `npm run build`.
6. Output Directory: `dist`.

## Lưu ý

Đây là bản chạy thử phía trình duyệt. Phân quyền chưa kết nối Supabase Auth và dữ liệu chỉnh sửa chưa lưu vào cơ sở dữ liệu máy chủ.
