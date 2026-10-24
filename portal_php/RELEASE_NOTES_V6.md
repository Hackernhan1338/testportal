# RELEASE V6 · 23/10/2026

## Đã sửa và bổ sung vào mã nguồn

1. **QR:** thư viện QR đóng gói nội bộ (MIT, không lệ thuộc CDN khi vẽ), ký HMAC token ngắn, đổi đúng cửa sổ 120 giây, dung sai 12 giây khi chuyển cửa sổ, báo thời gian máy chủ, liên kết dự phòng.
2. **Scanner:** dùng BarcodeDetector nếu có hỗ trợ, html5-qrcode CDN dự phòng, hỗ trợ dùng Camera hệ thống trên smartphone mở link URL rồi xác nhận trong trình duyệt; hướng dẫn lỗi HTTPS/quyền camera.
3. **OCR:** chuyển AI ra khỏi request upload; tác vụ đưa vào `ocr_jobs`. Quét toàn bộ ảnh thẻ chưa xử lý hoặc quét lại từng bài từ admin. Hai worker từ trình duyệt và một worker CLI cron. Kiểm soát thời gian chờ API, lỗi, lease, retry.
4. **Ảnh:** tự tạo thư mục `storage/uploads` an toàn khi thiếu; đính kèm `.htaccess` từ đầu.
5. **Cấu trúc FocusBrain:** tách riêng admin/pages, user/pages, app/services, admin/assets, assets/css và assets/js; đường dẫn cũ `index.php?page=...` vẫn được dùng. Admin Health tương tự module vận hành của FocusBrain.
6. **Dữ liệu:** không chỉnh sửa/xóa 71 hồ sơ; `users.card_number` giữ nguyên `NULL` đến khi duyệt ảnh. Migration chỉ thêm `ocr_jobs`.

## Đã thực hiện kiểm tra tĩnh

- PHP syntax check với `php -l` cho tất cả PHP.
- JavaScript syntax check Node.js cho các JS.
- Unit test `tests/qr_token_test.php`: token hợp lệ, sự kiện khác bị từ chối, sửa token bị từ chối, mã cũ bị từ chối.
- `tests/qr_matrix_test.js`: tạo ma trận mã QR nội bộ. Mã ví dụ được render thành hình và giải mã lại thành công bằng OpenCV trong môi trường biên soạn.

## Chưa thể xác minh

- Luồng QR camera trên điện thoại tại website đang chạy (chưa deploy).
- OCR Gemini với API key/quota và ảnh thực tế của website.
- Migrations MySQL trên DB thật, SMTP, bầu cử & các luồng phụ thuộc hosting.

**Không công bố đây là hotfix đã chạy trên production.** Trước vận hành, phải triển khai trên bản sao staging có đầy đủ MySQL, HTTPS, SMTP/API và kiểm thử checklist.
