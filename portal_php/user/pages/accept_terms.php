<?php
if(!defined('PORTAL_VIEW_ROUTER'))exit;
$d=active_legal('terms');title('Xác nhận điều khoản','Vui lòng đọc và đồng ý trước khi tiếp tục.');
if(!$d){panel();echo '<p>Chưa cấu hình điều khoản, quản trị viên cần xuất bản.</p></section>';}
else{panel($d['title']);echo '<p>Phiên bản '.e($d['version']).'</p><div class="legal-body">'.nl2br(e($d['body'])).'</div>';form_open('accept_terms');echo '<input type="hidden" name="id" value="'.(int)$d['id'].'"><label class="choice"><input type="checkbox" name="accept" required> Tôi đã đọc và đồng ý điều khoản</label>';submitf('Đồng ý và tiếp tục');echo '</section>';}
