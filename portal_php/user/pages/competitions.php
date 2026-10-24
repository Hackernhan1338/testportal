<?php
if (!defined('PORTAL_VIEW_ROUTER')) { http_response_code(403); exit; }
title('Cuộc thi & minh chứng đã nộp','Theo dõi ảnh dự thi và tình trạng được xác nhận.');
 foreach(rows("SELECT s.*,t.title FROM submissions s JOIN tasks t ON t.id=s.task_id WHERE s.user_id=? AND t.category='competition' ORDER BY s.id DESC",[$u['id']]) as $v){panel($v['title']);echo status($v['status']).'<p>'.e($v['submitted_at']).'</p><p>'.e($v['feedback']).'</p>'.($v['image_path']?'<a href="index.php?page=photo&id='.(int)$v['id'].'">Xem ảnh dự thi</a>':'').'</section>';}
