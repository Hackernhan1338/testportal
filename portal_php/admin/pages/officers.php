<?php
if (!defined('PORTAL_VIEW_ROUTER')) { http_response_code(403); exit; }
title('Danh sách cán bộ Đoàn','Quản lý cán bộ bằng cờ hiển thị riêng, tránh nhầm mọi Đoàn viên là cán bộ.');
 foreach(rows('SELECT * FROM users WHERE is_officer=1 ORDER BY full_name') as $person){panel($person['full_name']);echo '<p>'.e($person['student_id']).' · '.e($person['position_title']).'</p><p>'.e($person['biography']).'</p><a href="index.php?page=admin_user&id='.(int)$person['id'].'">Sửa thông tin và ảnh</a></section>';}
 echo '<p class="muted">Chọn một sinh viên trong Quản lý đoàn viên và bật “Hiển thị là cán bộ Đoàn”.</p>';
