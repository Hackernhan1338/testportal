# Kiến trúc theo FocusBrain v4.8.4

Đã nghiên cứu bộ nguồn FocusBrain do người dùng cung cấp: `admin/includes/layout_top.php`, `admin/assets/admin.css`, `admin/assets/admin-v4.css`, `admin/modules.php`, `admin/audit.php`, `admin/analytics.php`, `admin/security.php`.

## Được áp dụng trực tiếp
- Design tokens và các stylesheet quản trị của FocusBrain (`admin/assets/admin.css`, `admin/assets/admin-v4.css`), kết hợp lớp tương thích với markup Youth Portal (`assets/css/portal.css`).
- Sidebar navy #12213f, nhãn nhóm chức năng, trạng thái active, topbar, dashboard KPI, bảng quản trị, mobile drawer.
- Hệ thống trang user + admin riêng theo nhóm, Module Control bật/tắt hiển thị phân hệ user, Analytics theo dữ liệu thực, Audit logs và Security Center.
- Không sao chép tính năng học tập / bài tập não / âm thanh không liên quan; thay bằng nhiệm vụ, điểm danh, thẻ đoàn viên, bầu cử.

## Những điểm chưa phải tương đương 100%
- Chưa chuyển toàn bộ backend FocusBrain như role-permission fine-grained, CMS CKEditor, backup tự động, kiểm tra sức khỏe hệ thống, scheduler, chia nhiều chi đoàn.
- Không tuyên bố production-ready.
- Trang backend hiện dùng router `index.php?page=...`, không phải mỗi module một tệp PHP riêng như FocusBrain.
- Cần thử nghiệm web/DB/API/SMTP thực tế và security review.

## Update
- Cài mới: import `schema.sql`, rồi `tools/import_71_full_profiles.sql`.
- Nâng cấp từ bản trước: chạy `tools/upgrade_v3.sql` cùng với update schema v2 nếu thiếu.
