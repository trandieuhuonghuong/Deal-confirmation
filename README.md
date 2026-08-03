# Haday Deal Confirmation V6.1

Phiên bản này được đối chiếu lại với sheet `成交确认书` trong file Excel gốc.

## Nguyên tắc dữ liệu

- Chỉ nhập và chỉnh sửa trong module **Đơn hàng / 产品订单**.
- **Xác nhận giao dịch** và **Phụ lục** là bản chỉ đọc, liên kết trực tiếp từ đơn hàng.
- Dữ liệu sản phẩm và khách hàng được quản lý trong module riêng.

## Nội dung đã bổ sung lại vào Xác nhận giao dịch

- Tiêu đề, số đơn, ngày và nơi ký song ngữ.
- Thông tin đầy đủ Bên bán trước và Bên mua sau.
- Câu dẫn mua bán sản phẩm.
- Container, phương thức vận chuyển, điều khoản thương mại và cảng đến.
- Mục 1: Thông tin sản phẩm.
- Các khoản (6)–(11): tiền hàng, chiết khấu, chi phí phát sinh, tiền chưa thuế, VAT, tổng gồm thuế.
- Mục 2: địa điểm giao hàng, người liên hệ, số điện thoại, thời hạn giao hàng.
- Mục 3: nội dung thanh toán đầy đủ bằng tiếng Trung và tiếng Việt.
- Mục 4: tài khoản ngân hàng của Bên bán.
- Mục 5: đầy đủ bốn điều khoản khác song ngữ.
- Mục 6: ghi chú hóa đơn và thuế suất song ngữ.
- Khu vực ký tên theo thứ tự Bên bán trước, Bên mua sau.

## Chạy dự án

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Thư mục đầu ra: `dist`.

> Môi trường tạo tệp không truy cập được gói `@vitejs/plugin-react` từ registry nội bộ, vì vậy lệnh build cần chạy trên máy của bạn, GitHub Actions hoặc Vercel với npm công khai.


## Cập nhật V6.2
- Sheet Phụ lục chiết khấu được dựng lại theo vùng in C1:I66 của file Excel gốc.
- Tiêu đề, số, ngày, nơi ký, thông tin Bên bán/Bên mua và bảng 7 dòng chiết khấu khớp cấu trúc Excel.
- Sáu loại chiết khấu được nhập tại module Đơn hàng; tổng chiết khấu tự động liên kết sang Xác nhận giao dịch và Phụ lục.
- Phụ lục là bản chỉ đọc.


## Cập nhật V6.3
- Bỏ bảng Container / vận chuyển / điều khoản thương mại / cảng đến khỏi bản thể hiện Xác nhận giao dịch.
- Phụ lục hiển thị Bên bán và Bên mua theo hai cột trái–phải.
- Số tiền bằng chữ hiển thị đầy đủ bằng tiếng Việt và tiếng Trung.
