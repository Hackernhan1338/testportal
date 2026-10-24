<?php
if (!defined('PORTAL_VIEW_ROUTER')) { http_response_code(403); exit; }
title('Sự kiện & điểm danh','QR có hiệu lực theo cửa sổ hai phút, chỉ điểm danh trong thời gian hoạt động.');
 foreach(rows('SELECT e.*,a.checked_at FROM events e LEFT JOIN attendances a ON a.event_id=e.id AND a.user_id=? ORDER BY e.start_at DESC',[$u['id']]) as $ev){panel($ev['title']);echo '<p>'.e($ev['description']).'</p><p class="muted">'.e($ev['start_at']).' – '.e($ev['end_at']).'</p>';echo $ev['checked_at']?'<p class="goodtext">✓ Đã điểm danh lúc '.e($ev['checked_at']).'</p>':'<p>Chưa điểm danh · <a href="index.php?page=scan&event='.(int)$ev['id'].'">Mở máy quét QR</a></p>';echo '</section>';}
