<?php
if (!defined('PORTAL_VIEW_ROUTER')) { http_response_code(403); exit; }
require_admin();$ev=one('SELECT * FROM events WHERE id=?',[(int)($_GET['id']??0)]);if(!$ev){echo '<p>Không tìm thấy.</p>';return;}
 title('QR · '.$ev['title'],'Tự thay mã mỗi 120 giây. Mã QR được vẽ bằng thư viện nội bộ; không cần CDN.');panel('Mã dành cho người tham gia');echo '<div class="qrcenter"><div id="qrcode"></div><h2 id="countdown">Đang tải…</h2><p id="qrstatus" class="muted"></p><p class="muted">Liên kết dự phòng: <a id="qr-fallback" href="#" target="_blank" rel="noopener">Đang khởi tạo...</a></p></div></section><div data-event="'.(int)$ev['id'].'" id="qr-settings"></div><script src="assets/vendor/qr-local.js" defer></script><script src="admin/assets/qr.js" defer></script>';
