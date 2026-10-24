<?php
if (!defined('PORTAL_VIEW_ROUTER')) {http_response_code(403);exit;}
require_admin();
title('Health & Integration','Kiểm tra nhanh nguyên nhân QR và OCR lỗi trên hosting — không hiển thị khóa API hay mật khẩu.');
$expectedHost=parse_url((string)conf('base_url'),PHP_URL_HOST);
$currentHost=preg_replace('/:\d+$/','',$_SERVER['HTTP_HOST']??'');
$checks=[
 ['HTTPS đang bật',!empty($_SERVER['HTTPS'])&&$_SERVER['HTTPS']!=='off' || ($_SERVER['HTTP_X_FORWARDED_PROTO']??'')==='https','Trình duyệt chỉ cho phép camera trong ngữ cảnh HTTPS.'],
 ['Tên miền base_url khớp',is_string($expectedHost)&&strcasecmp((string)$expectedHost,$currentHost)===0,'URL QR phải cùng tên miền với trang đăng nhập.'],
 ['Thư viện QR nội bộ',is_file(__DIR__.'/../../assets/vendor/qr-local.js'),'Không cần CDN để tạo QR.'],
 ['PHP cURL',extension_loaded('curl'),'Bắt buộc để gọi Gemini API.'],
 ['PHP mbstring',extension_loaded('mbstring'),'Dùng để so khớp tên tiếng Việt.'],
 ['PHP fileinfo',extension_loaded('fileinfo'),'Kiểm tra ảnh upload.'],
 ['PHP GD (tối ưu ảnh)',extension_loaded('gd'),'Nếu chưa có, OCR vẫn chạy nhưng ảnh gốc có thể chậm hơn.'],
 ['Kho ảnh có quyền ghi',is_dir(__DIR__.'/../../storage/uploads')&&is_writable(__DIR__.'/../../storage/uploads'),'Chmod đúng quyền, không nên dùng 777.'],
 ['Đã cấu hình Gemini API',trim((string)conf('gemini_api_key'))!=='','Thiếu khóa thì các bài OCR ghi lỗi thay vì treo.'],
 ['Đã cấu hình SMTP',trim((string)conf('smtp_host'))!=='','Cần cho quên mật khẩu.']
];
try {$ok=(bool)one("SELECT id FROM ocr_jobs ORDER BY id DESC LIMIT 1");$dbOkay=true;}catch(Throwable $ex){$dbOkay=false;}
$checks[]=['Đã import SQL hàng đợi OCR',$dbOkay,'Cần chạy tools/upgrade_v6.sql trước khi quét hàng loạt.'];
panel('Tình trạng môi trường');echo '<div class="tablewrap"><table><thead><tr><th>Hạng mục</th><th>Kết quả</th><th>Ghi chú</th></tr></thead><tbody>';
foreach($checks as [$name,$good,$help])echo '<tr><td>'.e($name).'</td><td><span class="status">'.($good?'✓ OK':'! Kiểm tra').'</span></td><td>'.e($help).'</td></tr>';
echo '</tbody></table></div></section>';
panel('Chẩn đoán QR');echo '<div class="line"><b>URL khai báo</b><span>'.e((string)conf('base_url')).'</span></div><div class="line"><b>URL truy cập</b><span>'.e($currentHost).'</span></div><div class="line"><b>Giờ máy chủ PHP</b><span>'.e(date('Y-m-d H:i:s P')).'</span></div><div class="line"><b>Giờ MySQL</b><span>'.e(one('SELECT NOW() as dt')['dt']??'Không đọc được').'</span></div><p class="muted">Hãy kiểm tra sự kiện đang trong thời gian diễn ra. Đồng hồ điện thoại và máy chủ cần đồng bộ. QR cũ hết hạn sau hai phút, có thêm 12 giây dung sai tại ranh giới.</p></section>';
panel('Kiểm tra trực quan QR nội bộ');echo '<div id="health-qr" class="qrcenter"></div><p class="muted" id="health-result">Đang dựng mã thử…</p></section>';
echo '<script src="assets/vendor/qr-local.js" defer></script><script src="admin/assets/health.js" defer></script>';
