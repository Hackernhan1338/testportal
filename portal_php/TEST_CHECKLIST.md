# Checklist trước khi mở cho đoàn viên

- [ ] Sao lưu bản V5 và database, không xóa `config.php` / `storage/uploads`.
- [ ] Import `tools/upgrade_v6.sql`, không xóa bảng `users`, `submissions`, `attendances`.
- [ ] Đúng `base_url=https://emotionalplaybox4-0.com`, HTTPS bật, timezone Việt Nam và đồng hồ server đồng bộ NTP.
- [ ] `index.php?page=admin_health`: QR nội bộ, DB OCR, cURL, mbstring, quyền ghi ảnh đều báo OK.
- [ ] QR sự kiện đang diễn ra hiển thị hình hợp lệ, mã thay đổi sau 120 giây, URL cùng domain.
- [ ] Android Chrome/điện thoại iOS: Camera hệ thống mở link, chưa login chuyển login rồi trở lại trang xác nhận.
- [ ] QR hết hạn bị từ chối; QR sửa token bị từ chối; người đã điểm danh không tạo lượt trùng.
- [ ] Một ảnh thẻ JPG/PNG/WEBP được nộp và phản hồi ngay, OCR chạy **riêng**, không treo ở trang nộp.
- [ ] Admin `admin_ocr`: chọn xếp hàng, kiểm tra 2 lượt đồng thời, dừng/tiếp tục, lịch sử lỗi.
- [ ] Cron làm việc khi admin đóng trang, không xử lý hai lần cùng một job.
- [ ] Ảnh đủ 6 trường hiện trạng thái **cần duyệt**, không tự sinh số thẻ ở `users`.
- [ ] Admin xác minh thủ công mới cập nhật số thẻ; trường nơi vào Đoàn/nơi cấp thẻ không bắt buộc.
- [ ] `gemini_api_key` sai/quota hết trả trạng thái failed hoặc retry, không treo yêu cầu.
- [ ] Bầu cử, thông báo, xuất CSV, danh sách cán bộ hoạt động như bản V5 sau khi tách file.
- [ ] Kiểm tra file ảnh không truy cập được qua `/storage/uploads/`, admin không công khai SQL.
