# Haday Việt Nam – Bản web V5 chạy thử

## Các thay đổi chính

- Module **Giao dịch** gồm 2 tab nhỏ:
  - Xác nhận giao dịch
  - Phụ lục chiết khấu
- Module **Dữ liệu sản phẩm** độc lập.
- Sản phẩm trong giao dịch chỉ được chọn từ Dữ liệu sản phẩm; không nhập tên sản phẩm thủ công.
- Khi chọn sản phẩm, hệ thống tự điền SKU, tên Trung, đơn vị và đơn giá VND.
- Thông tin Bên bán luôn hiển thị trước Bên mua.
- Xác nhận giao dịch và phụ lục đều là bản song ngữ Việt – Trung.
- Phụ lục dùng chung dữ liệu khách hàng, số đơn, ngày, số tiền và chiết khấu của Xác nhận giao dịch.
- Tiền tệ dùng VND.
- Có tổng tiền hàng, chiết khấu, chi phí phát sinh, tiền chưa thuế, VAT, tổng tiền gồm thuế và số tiền bằng chữ.
- Có module Khách hàng, Bên bán, Điều khoản thanh toán và phân quyền giao diện.

## Chạy thử

Mở trực tiếp `index.html`, hoặc chạy:

```bash
python -m http.server 8080
```

Sau đó mở `http://localhost:8080`.

## Đưa lên GitHub / Vercel

1. Giải nén ZIP.
2. Tải toàn bộ file lên repository GitHub.
3. Import repository vào Vercel.
4. Framework Preset: **Other**.
5. Không cần Build Command; Output Directory để `.`.

## Lưu ý

Đây là bản giao diện chạy thử, dữ liệu được giữ trong bộ nhớ trình duyệt. Phân quyền chưa phải bảo mật máy chủ và chưa kết nối Supabase.
