# Haday Deal Confirmation

Dự án React + Vite hoàn chỉnh để build và triển khai lên GitHub/Vercel.

## Chức năng đã gộp

- Module **Giao dịch** gồm hai tab nhỏ: **Xác nhận giao dịch** và **Phụ lục chiết khấu**.
- Cả hai tài liệu đều song ngữ Việt – Trung, hiển thị **Bên Bán trước, Bên Mua sau**.
- Module **Dữ liệu sản phẩm** độc lập; sản phẩm trong giao dịch chỉ được chọn từ module này.
- Khi chọn sản phẩm tự điền SKU, tên Trung, đơn vị, đơn giá VND.
- Module **Dữ liệu khách hàng** độc lập; chọn khách hàng tự điền MST, địa chỉ, đại diện, chức vụ, điện thoại, email.
- Module chỉnh sửa thông tin cố định của Bên Bán (Haday Việt Nam).
- Tiền tệ VND; tự tính tiền hàng, chiết khấu, chi phí khác, tiền chưa thuế, VAT, tổng thanh toán và số tiền bằng chữ.
- Nhập dữ liệu từ Excel, xuất Excel, in/lưu PDF A4.
- Dữ liệu chỉnh sửa được lưu trong localStorage của trình duyệt.
- Giao diện có Việt / 中文 / English.

## Chạy trên máy

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Thư mục đầu ra là `dist`.

## Vercel

1. Upload toàn bộ dự án lên GitHub.
2. Import repository vào Vercel.
3. Framework: Vite.
4. Build command: `npm run build`.
5. Output directory: `dist`.

## Lưu ý

Bản này là frontend chạy thật, chưa kết nối Supabase. Dữ liệu hiện được lưu trong trình duyệt. Khi giao diện và quy trình đã được duyệt, có thể kết nối Supabase Auth/Database mà không cần thay đổi cấu trúc module.
