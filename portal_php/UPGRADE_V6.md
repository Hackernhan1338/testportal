# V6 — SỬA QR + OCR HÀNG LOẠT + CẤU TRÚC FOCUSBRAIN

Phạm vi: website tại `https://emotionalplaybox4-0.com/index.php?page=login`. **Gói này chỉ là mã nguồn nâng cấp. Không có quyền truy cập Hostinger/database nên chưa cập nhật website đang hoạt động.**

## Cập nhật từ V5 (KHÔNG import lại toàn bộ dữ liệu sinh viên)

1. Sao lưu **database**, thư mục `storage/uploads/`, tệp `config.php`, thiết lập `.htaccess` đang dùng và chụp lại danh sách sự kiện đang hoạt động.
2. Đưa trang vào chế độ bảo trì, tải file source V6 lên đúng webroot nơi có `index.php` (đường dẫn đang dùng theo URL thực tế là gốc domain). **Giữ nguyên `config.php` và thư mục uploads đã có**. Không upload `config.example.php` đè lên `config.php`.
3. Trong phpMyAdmin, import duy nhất `tools/upgrade_v6.sql` vào database hiện tại. **Không** chạy lại seed 71 sinh viên hoặc `schema.sql` để tránh thao tác thừa với dữ liệu thật.
4. Kiểm tra `config.php`: `base_url` phải là `https://emotionalplaybox4-0.com` (không có `/index.php`), `timezone` = `Asia/Ho_Chi_Minh`, `app_key` phải **giữ nguyên** để QR HMAC nhất quán. Điền `gemini_api_key`, `gemini_model` (ví dụ `gemini-2.5-flash`), cấu hình SMTP nếu cần.
5. Mở `index.php?page=admin_health` sau đăng nhập admin để kiểm tra HTTPS, tên miền, SQL, PHP cURL, GD, mbstring, quyền ghi uploads. Kiểm tra QR thử được vẽ trong mục Health.
6. Tạo một **sự kiện thử nghiệm đang diễn ra** (thời gian dùng múi giờ Việt Nam) ở trang `admin_events`, rồi mở `index.php?page=admin_qr&id=ID`. Kiểm tra đếm ngược, QR xoay, liên kết dự phòng và quét bằng ứng dụng Camera trên điện thoại đã đăng nhập.
7. Vào `index.php?page=admin_ocr`, nhấn **Xếp hàng** rồi **Quét hàng loạt**. Admin cũng có nút **Quét lại** ở từng bài nộp. Nếu admin đóng trang, các job trong SQL vẫn còn nhưng **chỉ tiếp tục tự chạy nếu đã thiết lập cron**.
8. Trên hosting hỗ trợ cron CLI: thiết lập mỗi phút (đường dẫn phải thay bằng đường dẫn thực tế) `php /home/ACCOUNT/domains/emotionalplaybox4-0.com/public_html/tools/ocr_worker.php 3`.
9. Sau kiểm tra, mở lại website cho thành viên; theo dõi lỗi PHP trong log và lỗi OCR trong bảng `ocr_jobs`.

## Sửa lỗi QR

- Mã được sinh trong trình duyệt bằng thư viện JS MIT **đóng gói sẵn** `assets/vendor/qr-local.js` (không cần CDN `qrcode.min.js`).
- Backend `app/services/QrService.php` cấp token rút gọn có HMAC 128 bit; xoay theo cửa sổ 120 giây. Dung sai 12 giây với cửa sổ cũ để tránh lỗi người dùng quét vào đúng giây chuyển QR.
- `qr_token` trả thêm đồng hồ máy chủ và thời điểm hết hạn; JS làm mới QR mỗi 10 giây và cập nhật đồng hồ mỗi giây (tránh fetch mỗi giây).
- Khi quét QR bằng Camera điện thoại, QR mở URL đăng nhập/điểm danh; sau xác thực người dùng nhấn xác nhận. Mỗi người tối đa một lần điểm danh/sự kiện, backend xác minh HMAC và thời gian hoạt động.
- Trang scan có **BarcodeDetector** nếu trình duyệt hỗ trợ; thư viện `html5-qrcode` từ CDN chỉ là phương án dự phòng. Trên Safari nếu không mở được camera trong web, **dùng Camera hệ thống của điện thoại để mở URL từ QR**. Cần HTTPS để camera web hoạt động.
- Một mã hợp lệ bị chụp/gửi cho người khác vẫn có thể bị quét trong hạn. Chống điểm danh hộ hoàn toàn đòi hỏi kiểm tra hiện diện bổ sung, không được tuyên bố là đã giải quyết.

## Sửa chậm OCR và quét hàng loạt

- User **chỉ tải ảnh lên và được phản hồi ngay**; tác vụ OCR vào bảng `ocr_jobs` thay vì gọi API ngay trong `POST /action`.
- Admin quản lý queue, số bài chờ/đang chạy/đã đọc/lỗi, đưa toàn bộ ảnh thẻ chưa trích xuất vào queue và thực thi tối đa hai lượt OCR đồng thời từ trình duyệt.
- Worker `tools/ocr_worker.php` CLI xử lý theo lô để chạy bằng cron, có lease và retry, tránh cùng một ảnh bị hai worker nhận đồng thời. AJAX gọi OCR giải phóng session lock sau xác thực để hai worker trên cùng một trình duyệt không bị PHP session tuần tự hóa.
- `lib.php` nén ảnh nếu máy chủ có GD (giảm chiều dài tối đa xuống 1600 px, JPEG chất lượng 78), giới hạn connect 4 giây, tổng HTTP AI tối đa 20 giây mỗi ảnh. Không bảo đảm API luôn trả kết quả trong 20 giây; lỗi ghi vào queue và cần người duyệt.
- `gemini-2.5-flash` có thể dùng `thinkingBudget=0` theo tài liệu Gemini để giảm xử lý ngoài nhu cầu trích xuất. Nếu đổi sang model không hỗ trợ, mã không gửi `thinkingBudget` trừ khi tên model thuộc nhóm tương thích.
- AI **chỉ đọc 6 trường bắt buộc** gồm `full_name`, `date_of_birth`, `position`, `join_date`, `card_number`, `activity_unit`; `join_place`, `issue_place` là tùy chọn. Không tự cấp số thẻ, admin kiểm tra rồi duyệt mới cập nhật `users.card_number`.
- Queue chỉ tự nhận dạng ảnh nhiệm vụ `category='card'`. Ảnh cuộc thi/nhiệm vụ khác duy trì chế độ duyệt riêng, không gán nhầm trường thẻ Đoàn cho ảnh cuộc thi.

## Nguy cơ và điều kiện vận hành

- Quản trị đang dùng xác thực đơn giản `role='admin'`; chưa có phân quyền chi tiết như FocusBrain gốc. Không coi bản này đã đạt chuẩn an toàn sản xuất hoặc bầu cử chính thức.
- Luồng Gemini cần API key có quota, Internet outbound và dữ liệu cá nhân ảnh thẻ được phép xử lý với dịch vụ bên thứ ba. Phải có thông báo quyền riêng tư và thời gian xóa ảnh.
- **Không** cung cấp tệp `.sql`, dữ liệu ngày sinh, `config.php` hay ảnh thẻ trong thư mục công khai; `tools`/`app`/`storage`/`admin/pages`/`user/pages` đều cần được chặn truy cập trực tiếp.
- Không có MySQL, SMTP, Gemini thực tế và quyền deploy trong môi trường tạo gói nên test live phụ thuộc cấu hình hosting.

## Kiểm tra tĩnh đã thực hiện

- Lint PHP toàn bộ file trong gói, kiểm tra JS bằng Node, kiểm thử HMAC tạo/sửa/hết hạn (`php tests/qr_token_test.php`).
- Tạo QR matrix từ thư viện MIT local và giải mã bằng OpenCV khi đóng gói (QR kiểm thử đúng URL).
- Chưa kiểm thử quét camera và OCR với thiết bị/khóa API thực tế.
