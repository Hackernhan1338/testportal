<?php
if(!defined('PORTAL_VIEW_ROUTER'))exit;
$unread=one('SELECT COUNT(*) n FROM announcements a LEFT JOIN notification_reads nr ON nr.announcement_id=a.id AND nr.user_id=? WHERE nr.announcement_id IS NULL',[$u['id']]);
title('Trung tâm thông báo','Các nội dung phải làm, hoạt động, cảnh báo bảo mật và tin chung · '.(int)$unread['n'].' chưa đọc.');
foreach(rows('SELECT a.*,nr.read_at FROM announcements a LEFT JOIN notification_reads nr ON nr.announcement_id=a.id AND nr.user_id=? ORDER BY a.id DESC LIMIT 100',[$u['id']]) as $a){panel($a['title']);echo '<p class="muted">'.e($a['created_at']).' · '.e($a['kind']).' · '.($a['read_at']?'Đã đọc':'Chưa đọc').'</p><div>'.nl2br(e($a['body'])).'</div>';if(!$a['read_at']){form_open('read_notice');echo '<input type="hidden" name="id" value="'.(int)$a['id'].'">';submitf('Đánh dấu đã đọc');}echo '</section>';}
