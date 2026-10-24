<?php
if (!defined('PORTAL_VIEW_ROUTER')) { http_response_code(403); exit; }
title('Yêu cầu & cuộc thi','Nộp ảnh minh chứng và theo dõi tiến độ thực hiện.');
 foreach(rows('SELECT * FROM tasks WHERE active=1 ORDER BY id DESC') as $t){panel($t['title']);echo '<p>'.nl2br(e($t['description'])).'</p><div class="muted">Hình thức: '.e($t['type']).' · Nhóm: '.e($t['category']).' · Hạn: '.e($t['due_at']?:'Không giới hạn').'</div>';
  $submitted=rows('SELECT * FROM submissions WHERE task_id=? AND user_id=? ORDER BY id DESC',[$t['id'],$u['id']]);
  foreach($submitted as $s){echo '<div class="line"><span>'.e($s['submitted_at']).' · '.status($s['status']).'<small>'.e($s['feedback']).'</small></span>'.($s['image_path']?'<a href="index.php?page=photo&id='.(int)$s['id'].'" target="_blank" rel="noopener">Ảnh</a>':'').'</div>';}
  form_open('submit');echo '<input type="hidden" name="task_id" value="'.(int)$t['id'].'">';if($t['type']==='photo')inputf('Ảnh minh chứng (JPG/PNG/WEBP, tối đa 5 MB)','photo','','file','accept="image/jpeg,image/png,image/webp" required');submitf($t['type']==='photo'?'Nộp ảnh':'Xác nhận hoàn thành');echo '</section>';
 }
