<?php
if (!defined('PORTAL_VIEW_ROUTER')) { http_response_code(403); exit; }
/** FocusBrain-style dedicated admin module. Loaded by authenticated front controller. */
require_admin();require_once __DIR__.'/../../app/services/OcrQueue.php';
$stats=ocr_stats();
title('Trung tâm OCR · Quét ảnh hàng loạt','Tải ảnh không còn chờ AI. Admin đưa ảnh vào hàng đợi, xử lý tối đa hai yêu cầu song song trong trình duyệt hoặc bằng CLI cron.');
echo '<div class="ops-stats" id="ocr-stats">';foreach(['queued'=>'Đang chờ','processing'=>'Đang xử lý','done'=>'Đã đọc','failed'=>'Lỗi','skipped'=>'Bỏ qua'] as $key=>$label){echo '<div class="ops-kpi"><b>'.(int)$stats[$key].'</b><small>'.e($label).'</small></div>';}echo '</div>';
panel('Điều phối kiểm tra ảnh');
echo '<p class="muted">AI chỉ trích xuất dữ liệu; không tự động xác minh thẻ. Người có quyền quản trị phải duyệt số thẻ trước khi ghi vào hồ sơ. Nếu đóng trình duyệt, các mục đã xếp hàng vẫn còn và cron có thể tiếp tục.</p>';
echo '<div class="ops-toolbar" id="ocr-console" data-csrf="'.e(csrf()).'"><button id="ocr-enqueue" class="btn" type="button">① Xếp hàng toàn bộ ảnh chưa quét</button><button id="ocr-run" class="btn" type="button">② Quét hàng loạt (2 luồng)</button><button id="ocr-stop" class="btn secondary" type="button" disabled>Dừng sau bài hiện tại</button></div>';
echo '<div id="ocr-activity" class="ops-activity" aria-live="polite"></div><p class="muted">Khuyến nghị cài cron: <code>php /home/.../public_html/tools/ocr_worker.php 3</code> mỗi phút. Thiếu Gemini API, sai model hoặc hết quota sẽ được báo lỗi thay vì xử lý treo.</p></section>';
panel('Nhật ký OCR gần đây');
echo '<div class="tablewrap"><table><thead><tr><th>ID</th><th>MSSV</th><th>Người nộp</th><th>Nội dung</th><th>OCR</th><th>Số lần thử</th><th>Kết quả / lỗi</th><th>Hồ sơ</th></tr></thead><tbody>';
foreach(rows("SELECT j.*,u.student_id,u.full_name,t.title,s.status AS submitted_status
 FROM ocr_jobs j JOIN submissions s ON s.id=j.submission_id JOIN users u ON u.id=s.user_id JOIN tasks t ON t.id=s.task_id ORDER BY j.id DESC LIMIT 100") as $job){
 echo '<tr><td>'.(int)$job['submission_id'].'</td><td>'.e($job['student_id']).'</td><td>'.e($job['full_name']).'</td><td>'.e($job['title']).'</td><td>'.status($job['status']).'</td><td>'.(int)$job['attempts'].'</td><td>'.e($job['last_error']?:$job['submitted_status']).'</td><td><a href="index.php?page=photo&id='.(int)$job['submission_id'].'" target="_blank" rel="noopener">Ảnh</a> · <a href="index.php?page=admin_submissions">Duyệt</a> <button type="button" class="linkbutton" data-ocr-retry="'.(int)$job['submission_id'].'">Quét lại</button></td></tr>';
}
echo '</tbody></table></div></section>';
echo '<script src="admin/assets/ocr.js" defer></script>';
