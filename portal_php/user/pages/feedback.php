<?php
if(!defined('PORTAL_VIEW_ROUTER'))exit;
title('Trung tâm góp ý','Gửi đề xuất hoặc báo lỗi, theo dõi phản hồi từ Ban Chấp hành.');
panel('Gửi góp ý');form_open('feedback_create');inputf('Tiêu đề','subject','','text','required maxlength="190"');echo '<label>Nội dung<textarea name="body" rows="5" required maxlength="5000"></textarea></label>';submitf('Gửi góp ý');echo '</section>';
panel('Góp ý của tôi');foreach(rows('SELECT * FROM feedback_tickets WHERE user_id=? ORDER BY id DESC LIMIT 30',[$u['id']]) as $r){echo '<div class="line"><span><b>'.e($r['subject']).'</b><small>'.e($r['body']).'</small>'.($r['admin_reply']?'<small><b>Phản hồi:</b> '.e($r['admin_reply']).'</small>':'').'</span>'.status($r['status']).'</div>';}echo '</section>';
