<?php
if (!defined('PORTAL_VIEW_ROUTER')) { http_response_code(403); exit; }
panel('Đăng nhập bằng email sinh viên');?><p class="muted">Sử dụng địa chỉ dạng n26dccn185@student.ptithcm.edu.vn. Tài khoản mới phải được cán bộ kích hoạt.</p><?php form_open('login');inputf('Email sinh viên','email','','email','required autocomplete="username"');inputf('Mật khẩu','password','','password','required autocomplete="current-password"');submitf('Đăng nhập');echo '<p><a href="index.php?page=forgot">Quên mật khẩu?</a></p></section>';

if(conf('google_client_id')&&conf('google_client_secret')): ?>
<section class="panel google-login"><a class="btn google-btn" href="index.php?page=google_start">Đăng nhập bằng Google</a><p class="muted">Chỉ email sinh viên PTIT đã có hồ sơ mới được phép đăng nhập. Trường hợp không phải Workspace cần xác minh OTP qua email.</p></section>
<?php endif; ?>
