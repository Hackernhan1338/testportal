# Cài đặt trên Hostinger (PHP 8.2+, MySQL)

1. Giải nén package vào thư mục riêng (vd. public_html/doan). Sử dụng HTTPS bắt buộc.
2. Tạo MySQL DB và import `schema.sql`, sau đó `tools/import_71_full_profiles.sql` qua phpMyAdmin. KHÔNG import seed mẫu lần nữa.
3. Copy `config.example.php` thành `config.php`; cấu hình DB, app_key bằng khóa ngẫu nhiên 64 hex, base_url và SMTP.
4. Cài Composer `composer install --no-dev` (nếu Hostinger không có Composer, chạy local và chép vendor/).
5. Bảo đảm `storage/uploads/` tồn tại và có thể ghi; `storage/.htaccess` không cho đọc ảnh công khai. Không expose config.php, tools, SQL, backups.
6. Thiết lập email SMTP sinh viên có quyền gửi thư và kiểm tra OTP. Thiết lập Gemini nếu xử lý ảnh thẻ.
7. Cấp quyền admin thông qua CLI `php tools/bootstrap_admin.php MSSV YYYY-MM-DD` trên máy chủ quản trị (điền DOB chính xác).
8. Mọi người phải thay mật khẩu ngày sinh và đặt PIN lần đầu; khuyến cáo xác nhận email trước khi sử dụng chính thức.
9. Tạo yêu cầu nhóm "Xác minh thẻ Đoàn viên", sau đó duyệt bài nộp để kích hoạt số thẻ (không nhập từ Excel).
10. Kiểm thử trên môi trường riêng trước khi đưa dữ liệu cá nhân thật lên server.
