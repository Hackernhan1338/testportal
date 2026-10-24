# PTIT YOUTH PORTAL — FOCUSBRAIN-STYLE V6

**Bản V6:** Xem `UPGRADE_V6.md`, `ARCHITECTURE.md`, `TEST_CHECKLIST.md` trước khi triển khai. QR dùng generator local MIT; OCR chạy nền theo hàng đợi và có quét hàng loạt trong admin; trang Health kiểm tra cấu hình hosting. Source chưa được cập nhật lên domain thật.

Giao diện theo nguyên tắc FocusBrain: ít nhiễu thị giác, dashboard theo nhiệm vụ, điều hướng rõ ràng, phản hồi trạng thái và responsive. **Đây là source bản chức năng mở rộng dành cho thử nghiệm có kiểm soát; chưa qua kiểm thử tải lớn, pentest hoặc thẩm định nghiệp vụ bầu cử.**

## 1. Các phân hệ đã có

- User: đăng nhập email sinh viên, đổi mật khẩu lần đầu, đặt PIN; quên mật khẩu bằng OTP gửi SMTP; bảng điều khiển, thông báo, nhận nhiệm vụ và nộp ảnh, xem tiến độ, xem thẻ thông tin điện tử, danh sách cán bộ Đoàn, lịch sử sự kiện đã điểm danh, quét QR/click liên kết sự kiện, bầu cử nhiều ứng viên.
- Admin: thống kê, danh sách sinh viên và các trạng thái Đoàn, cập nhật hồ sơ (MSSV/ngày sinh/chức vụ/thông tin thẻ/ảnh cán bộ), cấp lại mật khẩu tạm, giao nhiệm vụ, duyệt ảnh, xuất CSV hồ sơ/bài nộp/điểm danh, tạo sự kiện và QR 120 giây, điểm danh thủ công, đăng thông báo, tạo cuộc bầu cử và thêm ứng viên, công bố kết quả sau đóng cuộc bầu cử, tải JSON cấu hình kiểm tra ảnh.
- Nhận dạng: Gemini Vision trích xuất các trường `full_name`, `date_of_birth`, `position`, `join_date`, `card_number`, `activity_unit` (bắt buộc); `join_place`, `issue_place` (không bắt buộc). Nếu chưa có API, job OCR ghi lỗi và bài được chuyển `needs_review` để cán bộ xử lý. Kết quả AI chỉ là gợi ý và cần chính sách hậu kiểm.
- Danh sách mẫu: `tools/seed_students.sql` đã chuyển 71 dòng MSSV từ bảng người dùng cung cấp. **Không có DOB nên chưa tạo mật khẩu cho bất kỳ tài khoản nào.** Không tự suy diễn DOB.

## 2. Yêu cầu máy chủ

- PHP 8.2+ (PDO MySQL, cURL, fileinfo, mbstring, openssl), MySQL 8+/MariaDB hỗ trợ JSON, HTTPS.
- Apache với `.htaccess` hoạt động; nếu dùng Nginx cần **cấu hình chặn `/storage/`, `/tools/`, `config.php`, `*.sql`**. Tốt nhất di chuyển `storage` ra ngoài webroot và điều chỉnh đường dẫn.
- Composer/PHPMailer cho SMTP OTP.
- **QRCode nội bộ** `assets/vendor/qr-local.js` để vẽ QR; BarcodeDetector khi hỗ trợ, `html5-qrcode` trên CDN là phương án phụ. Quét link bằng Camera hệ thống trên điện thoại không cần thư viện này.

## 3. Cài đặt

1. Tạo database `doan_portal`, charset utf8mb4; import `schema.sql`, sau đó import `tools/seed_students.sql`.
2. Chép `config.example.php` thành `config.php`, nhập kết nối DB, `base_url`, `app_key` sinh bằng `php -r "echo bin2hex(random_bytes(32)), PHP_EOL;"`.
3. Bật HTTPS, đảm bảo `storage/uploads` có quyền ghi và không thể truy cập thẳng từ web.
4. Chạy `composer install --no-dev --optimize-autoloader` trong thư mục dự án (hoặc chạy trên máy rồi upload thư mục `vendor`).
5. Thiết lập `smtp_host`, `smtp_port`, `smtp_user`, `smtp_pass`, `smtp_from`. Nếu không cấu hình SMTP, chức năng quên mật khẩu sẽ không gửi được mã.
6. Điền ngày sinh **chính xác từ nguồn được phép sử dụng** cho sinh viên tạo quản trị viên đầu tiên qua DB, hoặc chạy lệnh bên dưới nếu đã có MSSV trong seed:
   `php tools/bootstrap_admin.php N26DCCN185 YYYY-MM-DD`
   (Thay ngày sinh bằng dữ liệu thực được chủ tài khoản xác nhận; không tự sử dụng ngày sinh từ ảnh minh họa.)
7. Đăng nhập với email `n26dccn185@student.ptithcm.edu.vn` và mật khẩu tạm là DOB ở định dạng `ddmmyyyy`; hệ thống bắt đổi ngay và đặt PIN 6 số.
8. Vào Quản trị > Danh sách đoàn viên > Sửa, nhập DOB cho từng hồ sơ được phép và cấp mật khẩu tạm. Khuyến nghị triển khai thực tế **thay mật khẩu ngày sinh bằng liên kết kích hoạt qua email có hạn**, vì ngày sinh dễ bị lộ/đoán.
9. Muốn bật AI: nhập `gemini_api_key`, kiểm tra quyền xử lý dữ liệu cá nhân và chính sách lưu giữ; test ảnh bằng tài khoản thử.

## 4. Kiểm tra tính đầy đủ của ảnh

Chỉ kiểm tra sự hiện diện của sáu trường bắt buộc và cảnh báo khi sai khớp họ tên/ngày sinh. AI **không** xác minh ảnh là thẻ thật, không bảo đảm OCR chính xác, không xác nhận người gửi là chủ thẻ, và không tự xác thực hồ sơ với hệ thống Đoàn.

Có thể cập nhật quy tắc bằng cách upload `default.json` chỉnh sửa ở Quản trị > Bộ kiểm tra ảnh. **Không chấp nhận upload file PHP hoặc ZIP để thực thi trực tiếp** vì đó là khả năng thực thi mã tùy ý trên server. Nếu nâng cấp engine kiểm tra ảnh, phải review code, ký bản phát hành và triển khai qua quy trình quản trị máy chủ riêng.

## 5. QR động & hạn chế

- Admin mở `Quản lý điểm danh` > `Hiển thị QR`; server ký mã theo sự kiện và `floor(epoch/120)`. QR được làm mới trong 2 phút.
- User đăng nhập mở liên kết từ QR hoặc quét trong `Sự kiện & điểm danh`; backend xác minh chữ ký HMAC, đúng sự kiện, đúng cửa sổ 2 phút, sự kiện đang diễn ra và chỉ cho một bản ghi/sự kiện/người.
- **QR không có khả năng chống chuyển tiếp hình ảnh thời gian thực**. Để chống điểm danh hộ: xác minh hiện diện tại cửa, GPS phù hợp luật/quyền riêng tư, nonce cá nhân, hoặc tổ chức xác thực bổ sung. Server và màn hình admin phải đồng bộ thời gian.

## 6. Các điểm cần hoàn thiện trước sản xuất

- Security review/pentest, CSP không dựa CDN, bảo vệ brute force phân tán, MFA, captcha/rate limit nâng cao, quản lý phiên/thiết bị, xác minh email và kích hoạt qua token.
- Cấp quyền admin dạng vai trò chi tiết (Super Admin, BCH, bí thư, quản trị nội dung), nhật ký audit đầy đủ, cấu hình thu hồi/khóa tài khoản, quy trình duyệt phân cấp.
- Workflow nộp ảnh **đã có hàng đợi OCR**; vẫn cần hạn chế số lượt, xóa ảnh theo lịch và giám sát chi phí API, đánh giá chống prompt injection trong ảnh.
- Bộ lọc các trạng thái, nhiều chi đoàn/lớp, import CSV thông minh, kiểm tra dữ liệu trùng/sai.
- Công khai ngày sinh cán bộ Đoàn cần có căn cứ và sự đồng ý; hạn chế quyền xem dữ liệu nhạy cảm, đặc biệt ảnh thẻ và DOB.
- Bầu cử hiện là **thử nghiệm nội bộ**: cần quy chế bầu cử hợp lệ, điều kiện cử tri, phương án chống ép buộc/mua phiếu, kiểm toán độc lập, chống lỗi giao dịch và đảm bảo bí mật phiếu thực sự trước dùng chính thức. Hệ thống không lưu `voter_id` trong bảng `ballots`, nhưng audit/thời gian có thể gây suy luận nên chưa được coi là hệ thống bỏ phiếu mật mã học.
- Cần thêm bài test tự động/integration test và đánh giá UX trên thiết bị thực.

## 7. Tệp chính

- `index.php`: điều hướng, view user/admin, xuất file CSV, hiển thị ảnh có kiểm soát.
- `actions.php`: xử lý biểu mẫu, phân quyền, CSRF, OTP, bầu cử, điểm danh.
- `lib.php`: kiểm tra AI, gửi SMTP, helpers.
- `bootstrap.php`: PDO, session, bảo vệ HTTP, HMAC, upload.
- `schema.sql`: database.
- `tools/seed_students.sql`: nhập các hồ sơ từ dữ liệu ban đầu, không chứa DOB.
- `assets/css/site.css`, `assets/js/scan.js`, `admin/assets/qr.js`: giao diện & QR.


## 8. Bản mở rộng FocusBrain-style

- Import `tools/import_71_full_profiles.sql` sau `schema.sql` để nạp 71 người thật từ Excel, với 64 ngày sinh, số thẻ NULL. Mật khẩu ngày sinh ddmmyyyy băm bcrypt. **Không công khai SQL**, vì chứa dữ liệu sinh viên.
- Nếu cập nhật trên DB bản MVP: chạy `tools/upgrade_v2.sql` trước khi deploy code mới. Nếu cài mới, `schema.sql` đã có các cột mở rộng, không chạy bản upgrade.
- Mục `admin_reports` xuất người đã hoàn thành/chưa hoàn thành theo yêu cầu, `admin_officers` quản lý danh sách cán bộ với trường `is_officer`. Cuộc thi là một nhóm nhiệm vụ riêng.
- `category=card` dùng AI qua queue để đọc thẻ; `competition` và `general` chỉ đợi xét duyệt ảnh, không ép ảnh cuộc thi phải là thẻ Đoàn viên.
- Số thẻ được để NULL khi import, chỉ cập nhật sau khi admin duyệt bài nộp nhóm `card` đủ trường và đối chiếu hồ sơ.
- Quy tắc kiểm tra tải lên là JSON dữ liệu, không chấp nhận PHP/ZIP thực thi. Mọi nâng cấp mã PHP phải triển khai qua quy trình code review trên hosting.
- **Chưa kiểm thử bằng cơ sở dữ liệu live, SMTP live, Gemini live hoặc quy trình bầu cử pháp lý**. Phải có test, rà soát quyền riêng tư và bảo mật trước vận hành.


## V6: Nâng cấp QR/OCR/kiến trúc

- `admin/pages/*.php` / `user/pages/*.php` thay cho khối switch dài trong `index.php` (giữ URL cũ).
- `admin/pages/ocr.php` điều phối quét hàng loạt; `app/services/OcrQueue.php` và `tools/ocr_worker.php` cho worker nền.
- `admin/pages/health.php`: kiểm tra camera/QR, timezone, PDO, cURL, GD, SMTP, Gemini và migrations.
- `app/services/QrService.php` và `assets/vendor/qr-local.js`: mã HMAC 2 phút, trình tạo QR JS local.
- **Nâng cấp V5:** chỉ import `tools/upgrade_v6.sql`, không import lại danh sách 71 sinh viên. Phải sao lưu `config.php`, thư mục ảnh, database.
- Đã có lint PHP/JS và unit test QR; chưa xác nhận hoạt động trên máy chủ thực tế.


## V7 – FocusBrain full portal experience

- Hồ sơ cá nhân đầy đủ; avatar, quote/author, điểm và quyền riêng tư.
- Điểm xếp hạng theo task passed và attendance duy nhất.
- Notification reads, feedback tickets, phiên bản terms/privacy.
- Web visits (HMAC IP, device-cookie, country khi trusted proxy, biểu đồ 14 ngày), chặn IP/device.
- Admin RBAC: ANALYST, MODERATOR, ADMIN, SUPER_ADMIN; SMTP, Terms, Admin users.
- Đăng nhập Google Authorization Code/OIDC, liên kết email sinh viên đã có; OTP đối với non-Workspace.
- Migration: **tools/upgrade_v7.sql** (chạy một lần SAU khi nhập dữ liệu V6).
- Tài liệu chính: **UPGRADE_V7.md**, **V7_TEST_CHECKLIST.md**.

- File `tools/backfill_class_numbers.sql` (chỉ trong bản full source có dữ liệu) cập nhật STT 1–71 đúng theo cột STT của bảng Excel, không thay đổi thẻ Đoàn viên.
