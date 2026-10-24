# PTIT Youth Portal V7 – FocusBrain architecture

## Phạm vi
Nâng cấp **từ V6**, giữ nguyên URL `index.php?page=...` và toàn bộ các nhiệm vụ, QR động 120 giây, OCR hàng đợi, bầu cử, cán bộ, thông báo và dữ liệu hiện có. Trang mới: `profile`, `leaderboard`, `feedback`, `legal`, `accept_terms`, `google_confirm`, `admin_visits`, `admin_feedback`, `admin_terms`, `admin_smtp`, `admin_admins`, `admin_blocks`.

## Bước triển khai Hostinger
1. Tạo bản sao lưu DB và `config.php`, `storage/uploads/`. **Không ghi đè ảnh, `config.php` hoặc import lại 71 sinh viên khi nâng cấp website đang chạy.**
2. Import **một lần** `tools/upgrade_v7.sql` vào database V6. Nếu cài mới: `schema.sql`, `tools/upgrade_v6.sql` (nếu schema chưa bao gồm ocr_jobs), `tools/import_71_full_profiles.sql` (nếu được phép xử lý dữ liệu), rồi `tools/upgrade_v7.sql`. Không import lại importer vào DB đang sử dụng. **Để điền chính xác STT 1–71 theo danh sách Excel đã gửi**, có thể import riêng `tools/backfill_class_numbers.sql` SAU migration V7; bản nâng cấp không chứa dữ liệu riêng không kèm script này.
3. Sao chép mã PHP/CSS/JS từ bản V7 vào đúng webroot. Giữ nguyên `app_key` V6, vì QR, IP hash và SMTP secret phụ thuộc vào khóa này.
4. Chạy `composer install --no-dev --optimize-autoloader` bằng SSH/Composer trên hosting (PHP >= 8.2), để cài **PHPMailer** và **google/apiclient**. Không thể xác minh đăng nhập Google nếu thiếu vendor.
5. Cấu hình `config.php`: `google_client_id`, `google_client_secret`, `base_url`, `require_https => true`; SMTP có thể chỉnh qua `admin_smtp` sau khi có Super Admin. Bí mật OAuth/SMTP tuyệt đối không nằm trong thư mục tải xuống công khai hoặc JavaScript.
6. Trong Google Cloud Console tạo OAuth Client **Web application**, Authorized redirect URI **đúng tuyệt đối**: `https://emotionalplaybox4-0.com/google-callback.php`. Cấu hình Consent Screen theo trạng thái ứng dụng, quyền `openid email profile`; nếu app ở Testing thì thêm tài khoản thử nghiệm. Không đặt sai URL, scheme hay trailing slash.
7. **Chỉ một người có thẩm quyền**: cấp quyền SUPER_ADMIN cho admin đã xác minh qua phpMyAdmin sau khi cài migration:
```sql
UPDATE users SET admin_level='SUPER_ADMIN',role='admin'
WHERE student_id='MSSV_CUA_ADMIN_DA_XAC_MINH' AND role='admin';
```
Không tự động cấp quyền cho email hay mật khẩu có sẵn. Kiểm tra không có tài khoản SUPER_ADMIN trái phép.
8. Đăng nhập vào `admin_terms` công bố chính sách bảo mật/điều khoản chính thức, `admin_smtp` cấu hình SMTP và gửi thử, `admin_visits` kiểm tra lượt truy cập, `admin_admins` phân quyền, `admin_blocks` kiểm tra hạn chế.
9. Thiết lập cron riêng `php tools/ocr_worker.php` (đúng như hướng dẫn V6) và `php tools/cleanup_visits.php` mỗi ngày. **Đảm bảo PHP CLI cron chạy đúng PHP version**. Website không tự gửi thư hoặc chạy cron nếu server chưa cấu hình.

## Bảo mật OAuth Google
- Chỉ tài khoản **đã tồn tại** có địa chỉ `nXX...@student.ptithcm.edu.vn` mới được liên kết.
- OAuth 2.0 Authorization Code, `state` chống CSRF, `nonce`, **ID token xác minh chữ ký/issuer/audience/expiry** qua `Google_Client::verifyIdToken()`.
- Email phải được Google xác minh; ràng buộc `google_sub` duy nhất. **Không coi hậu tố email hoặc tham số `hd` truyền vào URL là bằng chứng.** Chỉ claim `hd` có chữ ký bằng đúng `student.ptithcm.edu.vn` mới đại diện cho tổ chức Google Workspace đó.
- Nếu claim `hd` vắng mặt hoặc không khớp: gửi OTP qua email sinh viên đã có trong DB (10 phút, giới hạn số lần). Google Sign-in **không bypass** bước tạo mật khẩu và PIN lần đầu, nếu hồ sơ chưa được khởi tạo.
- Nếu tài khoản sinh viên không được quản trị bởi Google Workspace, OTP/email là thiết yếu. Hệ thống không tự tạo tài khoản mới từ Google.

## Bảng xếp hạng & quyền riêng tư
- Điểm = tổng `tasks.points` của **task có ít nhất một bài passed** + tổng `events.points` của sự kiện đã điểm danh. Không cộng trùng khi nộp lại nhiều lần. Không phải công cụ đánh giá đạo đức, chính trị hay tư cách đoàn viên.
- Sinh viên có thể tắt hiển thị trên bảng xếp hạng; thông tin cá nhân nhạy cảm (điện thoại, quê quán, ngày vào Đảng, email cá nhân) không đưa lên bảng xếp hạng.
- Web Visits lưu IP dạng HMAC-SHA256 có khóa, không lưu IP thô; thiết bị là cookie ngẫu nhiên, không phải nhận dạng phần cứng. Chặn IP động hoặc xóa cookie có thể vượt qua; cần bổ sung tầng WAF/rate limiting tại Hostinger/Cloudflare.
- `trust_cloudflare_country=true` chỉ sử dụng header quốc gia nếu địa chỉ proxy xuất hiện trong `trusted_proxy_ips` cấu hình chính xác. Tương tự, IP khách từ `CF-Connecting-IP` chỉ được dùng với proxy đã tin cậy. **Không đặt whitelist IP rộng/tùy tiện hoặc cho phép kết nối trực tiếp tới origin**.
- Dọn visit logs định kỳ, dùng `visit_retention_days` (mặc định 90 ngày). Bản chính sách bảo mật cần công khai về thu thập, thời hạn lưu, quyền truy cập và liên hệ.

## Trường hồ sơ
`MSSV`, STT lớp, họ tên, ngày sinh, quê quán, giới tính, dân tộc, tôn giáo, điện thoại, email sinh viên, email cá nhân, ngày vào Đảng, ngày vào Đoàn, thẻ Đoàn viên (`NULL` đến khi duyệt), nơi sinh hoạt, chức vụ, avatar, câu nói và tác giả. Dữ liệu từ bảng `student_profile_details` V6 được đưa vào bảng `users` khi chạy migration. Mục nào chưa có trong nguồn là `NULL`, không tự suy đoán.

## Giới hạn kiểm thử
- Kiểm tra cú pháp PHP, QR/HMAC nội bộ được chạy trong sandbox. Chưa thử login Google thật, MySQL, SMTP, Gemini, ảnh quét camera/QR trên hosting hoặc kiểm thử chịu tải; các thao tác đó phải kiểm thử trên staging.
- Cần kiểm thử bầu cử và bảo mật độc lập trước khi dùng cho quy trình bầu cử có tính chính thức.
