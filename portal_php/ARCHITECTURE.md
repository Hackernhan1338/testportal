# Kiến trúc FocusBrain → PTIT Youth Portal V6

Bản gốc FocusBrain v4.8.4 chia `admin/*.php`, `admin/includes/layout_top.php`, `assets/css/`, `assets/js/`, `api/`, `sql/` và nhiều màn hình user riêng. Phiên bản V6 không sao chép chức năng học tập, mà áp dụng cách **tách phần hiển thị, logic nghiệp vụ, vận hành và tài nguyên tĩnh**.

```text
index.php                   Front controller, route GET, shell UI, CSRF/ACL check
bootstrap.php               DB config, session, security, upload, helper HMAC import
actions.php                 Form POST từ admin và user
lib.php                     Gemini / SMTP / query helper
config.example.php          Mẫu thiết lập (config.php bí mật, không đóng gói)
app/services/QrService.php  Sinh/kiểm tra mã điểm danh HMAC
app/services/OcrQueue.php  Enqueue, atomic claim, xử lý OCR, trạng thái
admin/index.php             Alias /admin/ như FocusBrain
admin/pages/*.php           Dashboard và từng trang admin tách riêng
admin/assets/*              CSS/JS chuyên biệt QR/OCR/health
user/pages/*.php            Trang cá nhân, sự kiện, thẻ, nộp ảnh, bầu cử
assets/css/*                CSS giao diện chung / responsive
assets/js/*                 JS phổ thông, quét bằng camera
assets/vendor/qr-local.js   QR generator MIT offline
storage/uploads/            Ảnh riêng tư: Apache/Nginx chặn truy cập trực tiếp
tools/upgrade_v6.sql        Migration OCR queue
tools/ocr_worker.php        Worker cron PHP CLI
tests/*                     Bài test QR
```

## Các lớp giao diện

- **User Workspace**: việc cần làm, lịch sử nộp, thông báo, sự kiện, thẻ số, bầu cử, cán bộ Đoàn.
- **Admin Operations**: thanh bên xanh navy, KPI rõ ràng, module control, bảo mật, OCR console, phân tích, audit, health; CSS từ bản thiết kế FocusBrain đã cung cấp và tùy biến nghiệp vụ.
- **Các module tách trang**: template PHP chỉ được gọi từ front controller, không được truy cập trực tiếp; `admin/*.php` là URL alias bảo vệ bởi phiên admin.

## Luồng sự kiện/QR

```text
admin tạo sự kiện -> QR token HMAC 120 giây + URL -> QR local JS
 -> user dùng Camera/BarcodeDetector -> URL `/index.php?page=scan...`
 -> đăng nhập (nếu chưa) -> xác nhận -> POST CSRF
 -> kiểm tra event active + thời gian + chữ ký -> UNIQUE(event_id,user_id)
```

## Luồng OCR

```text
user tải ảnh -> fileinfo/getimagesize/upload -> submissions + ocr_jobs
 -> admin enqueue-all HOẶC cron -> claim lease -> Gemini (timeout 20s)
 -> update `extracted`, `feedback`, `status=needs_review`
 -> admin xem ảnh và kết quả -> duyệt hoặc từ chối
 -> cập nhật card_number chỉ sau duyệt đủ 6 trường
```

**Ghi chú:** Tách file không đồng nghĩa có đủ mọi tính năng FocusBrain. V6 vẫn dùng `index.php` làm front controller cho URL tương thích V5; các module được tách ra nhưng chưa phải full MVC framework. Các nghiệp vụ bầu cử/quyền riêng tư cần đánh giá riêng trước khi áp dụng chính thức.
