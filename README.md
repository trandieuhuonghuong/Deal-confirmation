# Haday Việt Nam – Xác nhận giao dịch v4

Các thay đổi trong phiên bản này:

- Bỏ hoàn toàn khu vực chọn dữ liệu tách riêng phía trên biểu mẫu.
- Chọn khách hàng trực tiếp trong bảng xác nhận giao dịch.
- Khi chọn tên công ty, hệ thống tự điền mã khách hàng, mã số thuế và địa chỉ nếu dữ liệu nguồn có sẵn.
- Bỏ phần tiêu đề lặp lại bên trong bản thể hiện: HADAY VIỆT NAM, XÁC NHẬN GIAO DỊCH và số đơn.
- Bỏ các trường Cảng đến, Phương thức vận chuyển và Điều khoản thanh toán khỏi bản thể hiện cuối.
- Trong từng dòng sản phẩm, chọn tên sản phẩm trực tiếp từ danh sách.
- Sau khi chọn sản phẩm, hệ thống tự điền SKU, tên tiếng Trung, đơn vị tính và đơn giá nếu dữ liệu nguồn có sẵn.
- Bỏ cột tên hàng tiếng Anh khỏi bảng sản phẩm và phụ lục.
- Vẫn hỗ trợ thêm dòng, xóa từng dòng, sửa số lượng/đơn giá, tự tính tổng, ba ngôn ngữ, nhập/xuất Excel và in PDF.

## Chạy thử

```bash
npm install
npm run dev
```

## Đưa lên Vercel

Tải toàn bộ thư mục lên GitHub, import repository vào Vercel và chọn Deploy. Vercel sẽ nhận diện Vite tự động.
