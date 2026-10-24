<?php
if (!defined('PORTAL_VIEW_ROUTER')) { http_response_code(403); exit; }
title('Chào, '.$u['full_name'],'Không gian quản lý công tác Đoàn, hoạt động và nhiệm vụ của đồng chí.');
 echo '<div class="shortcut-row"><a href="index.php?page=profile">Hồ sơ cá nhân →</a><a href="index.php?page=leaderboard">Bảng xếp hạng →</a><a href="index.php?page=feedback">Góp ý →</a></div>'; 
 $tasks=rows('SELECT * FROM tasks WHERE active=1 ORDER BY id DESC LIMIT 5');$events=rows('SELECT * FROM events ORDER BY start_at DESC LIMIT 4');
 $n=one('SELECT COUNT(*) n FROM submissions WHERE user_id=?',[$u['id']]);$a=one('SELECT COUNT(*) n FROM attendances WHERE user_id=?',[$u['id']]);
 echo '<div class="stats"><article><small>Bài đã nộp</small><strong>'.e($n['n']).'</strong></article><article><small>Sự kiện tham gia</small><strong>'.e($a['n']).'</strong></article><article><small>Tình trạng Đoàn</small><strong>'.e($u['membership']).'</strong></article></div>';
 panel('Việc cần thực hiện');foreach($tasks as $t){echo '<div class="line"><span><b>'.e($t['title']).'</b><small>'.e($t['description']).'</small></span><a href="index.php?page=tasks">Xem yêu cầu →</a></div>';}echo '</section>';
 panel('Thông báo mới');foreach(rows('SELECT * FROM announcements ORDER BY id DESC LIMIT 4') as $n)echo '<div class="line"><span><b>'.e($n['title']).'</b><small>'.e($n['body']).'</small></span>'.status($n['kind']).'</div>';echo '</section>';
