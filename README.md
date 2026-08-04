# Haday Deal Confirmation V7

Bản cập nhật này bổ sung đầy đủ dữ liệu từ file **Điều khoản thanh toán.xlsx** vào tab **Dữ liệu gốc → Điều khoản thanh toán**.

## Nội dung chính

- 16 mẫu điều khoản thanh toán song ngữ Việt – Trung, kèm nội dung tiếng Anh khi có.
- Phân nhóm: thanh toán trước/giao sau, thanh toán trước RDC, bán chịu.
- Trong module Đơn hàng, trường Điều khoản thanh toán là danh sách lựa chọn lấy trực tiếp từ Dữ liệu gốc.
- Khi chọn một điều khoản, nội dung tiếng Việt và tiếng Trung được tự động điền vào đơn hàng và liên kết sang Xác nhận giao dịch.
- Có thể nhập lại file `Điều khoản thanh toán.xlsx` bằng nút Nhập Excel.
- Sửa hàm chuyển số tiền sang chữ tiếng Việt cho Xác nhận giao dịch và Phụ lục chiết khấu.

## Chạy dự án

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```


## Cập nhật V7.1
- Module Đơn hàng có hai tab: Đơn hàng và Danh sách đơn hàng.
- Tạo mới sẽ lưu vào danh sách tự động qua localStorage.
- Danh sách cho phép tìm kiếm, mở chỉnh sửa và xóa từng đơn.
- Khối số đơn/ngày/nơi ký của Xác nhận và Phụ lục được canh phải, lùi vào theo mép bảng nội dung.
