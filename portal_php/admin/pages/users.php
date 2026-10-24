<?php
if (!defined('PORTAL_VIEW_ROUTER')) { http_response_code(403); exit; }
title('Quản lý đoàn viên','Danh sách bao gồm cả sinh viên chưa vào Đoàn, sinh hoạt tại địa phương, chuyển sinh hoạt.');echo '<p><a class="btn" href="index.php?page=admin_user">+ Thêm hồ sơ</a> <a href="index.php?page=export&type=users">Xuất CSV</a></p>';
 panel('Hồ sơ sinh viên');echo '<div class="admin-filters"><input data-table-search="student-table" placeholder="Tìm tên hoặc MSSV..." aria-label="Tìm sinh viên"></div><div class="tablewrap"><table id="student-table"><thead><tr><th>MSSV</th><th>Họ tên</th><th>Trạng thái</th><th>Chức vụ</th><th>Tài khoản</th><th>Thao tác</th></tr></thead><tbody>';
 foreach(rows('SELECT * FROM users ORDER BY student_id') as $r){echo '<tr><td>'.e($r['student_id']).'</td><td>'.e($r['full_name']).'</td><td>'.status($r['membership']).'</td><td>'.e($r['position_title']).'</td><td>'.($r['pass_hash']?'Đã cấp':'Chưa cấp').'</td><td><a href="index.php?page=admin_user&id='.(int)$r['id'].'">Sửa</a> ';
  form_open('activate_user');echo '<input type="hidden" name="id" value="'.(int)$r['id'].'"><button class="linkbutton">Cấp lại MK</button></form></td></tr>';}
 echo '</tbody></table></div></section>';
