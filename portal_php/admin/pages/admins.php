<?php
if(!defined('PORTAL_VIEW_ROUTER'))exit;must_can($u,'admins');
title('Quản trị nhân sự Admin','Phân quyền theo 4 cấp độ giống mô hình FocusBrain; mọi thay đổi đều có audit log.');
panel('Danh sách quản trị');echo '<div class="table-wrap"><table><tr><th>MSSV</th><th>Họ tên</th><th>Email</th><th>Quyền</th><th>Thao tác</th></tr>';
foreach(rows('SELECT id,student_id,full_name,email,role,admin_level FROM users WHERE role="admin" OR admin_level<>"NONE" ORDER BY admin_level DESC,student_id') as $r){echo '<tr><td>'.e($r['student_id']).'</td><td>'.e($r['full_name']).'</td><td>'.e($r['email']).'</td><td>'.e($r['admin_level']).'</td><td>';
if($r['id']!=$u['id']){form_open('set_admin');echo '<input type="hidden" name="id" value="'.(int)$r['id'].'"><select name="level">';foreach(['NONE','ANALYST','MODERATOR','ADMIN','SUPER_ADMIN'] as $level)echo '<option value="'.$level.'" '.($level===$r['admin_level']?'selected':'').'>'.$level.'</option>';echo '</select>';submitf('Cập nhật');}else echo '<small>Tài khoản hiện tại</small>';echo '</td></tr>';}
echo '</table></div></section>';
panel('Thêm quản trị viên');form_open('set_admin');inputf('ID tài khoản (xem trong quản lý đoàn viên)','id','','number','required min="1"');echo '<label>Quyền<select name="level"><option>ANALYST</option><option>MODERATOR</option><option>ADMIN</option><option>SUPER_ADMIN</option></select></label>';submitf('Cấp quyền');echo '</section>';
