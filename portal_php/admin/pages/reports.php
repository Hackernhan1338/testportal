<?php
if (!defined('PORTAL_VIEW_ROUTER')) { http_response_code(403); exit; }
title('Báo cáo & xuất danh sách','Xuất danh sách đủ điều kiện hoặc chưa hoàn thành từng yêu cầu.');
 panel('Tất cả hồ sơ');echo '<a class="btn" href="index.php?page=export&type=users">Xuất 71 hồ sơ và những cập nhật mới</a></section>';
 foreach(rows("SELECT t.*, (SELECT COUNT(DISTINCT s.user_id) FROM submissions s WHERE s.task_id=t.id AND s.status='passed') completed FROM tasks t ORDER BY t.id DESC") as $r){panel($r['title']);echo '<p>Đã hoàn thành: <strong>'.(int)$r['completed'].'</strong></p><p><a href="index.php?page=export&type=task_completed&id='.(int)$r['id'].'">Xuất người đã hoàn thành</a> · <a href="index.php?page=export&type=task_missing&id='.(int)$r['id'].'">Xuất người chưa hoàn thành</a> · <a href="index.php?page=export&type=submissions&id='.(int)$r['id'].'">Xuất mọi lượt nộp</a></p></section>';}
