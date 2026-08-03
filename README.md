# Haday Deal Confirmation V6

Phiên bản React/Vite build thực tế.

## Nguyên tắc dữ liệu
- Module **Đơn hàng** là nơi duy nhất được nhập/chỉnh sửa dữ liệu.
- **Xác nhận giao dịch** và **Phụ lục chiết khấu** chỉ đọc và liên kết trực tiếp từ đơn hàng, tương tự công thức trong Excel gốc.
- Đã khôi phục: số đơn, ngày đơn, container, phương thức vận chuyển, điều khoản thương mại, cảng đến, thời hạn giao hàng, điều khoản thanh toán, thông tin Bên bán/Bên mua, sản phẩm, chiết khấu, chi phí phát sinh, tiền trước thuế, VAT, tổng gồm thuế.

## Chạy
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```
