<?php
if (!defined('PORTAL_VIEW_ROUTER')) { http_response_code(403); exit; }
title('Bầu cử trực tuyến','Phiếu bầu không lưu liên kết trực tiếp giữa người bầu và ứng viên; nhập PIN để xác nhận.');
 foreach(rows('SELECT * FROM elections ORDER BY id DESC') as $el){panel($el['title']);echo '<p>'.e($el['description']).'</p><small>'.e($el['starts_at']).' – '.e($el['ends_at']).' · Bầu tối đa '.e($el['seats']).' người</small>';
  $voted=one('SELECT user_id FROM voters WHERE election_id=? AND user_id=?',[$el['id'],$u['id']]);
  if($voted)echo '<p class="goodtext">✓ Đã bỏ phiếu</p>';
  elseif(strtotime($el['starts_at'])<=time()&&strtotime($el['ends_at'])>=time()){
   form_open('vote');echo '<input type="hidden" name="election_id" value="'.(int)$el['id'].'"><fieldset><legend>Chọn ứng viên</legend>';
   foreach(rows('SELECT c.id,u.full_name,u.student_id FROM candidates c JOIN users u ON u.id=c.user_id WHERE c.election_id=?',[$el['id']]) as $c)echo '<label class="choice"><input type="checkbox" name="candidates[]" value="'.(int)$c['id'].'"> '.e($c['full_name']).' ('.e($c['student_id']).')</label>';
   echo '</fieldset>';inputf('PIN 6 số xác nhận','pin','','password','required minlength="6" maxlength="6"');submitf('Gửi phiếu bầu');
  }else echo '<p class="muted">Chưa mở hoặc đã đóng bầu cử.</p>';echo '</section>';
 }
