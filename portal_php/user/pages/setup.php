<?php
if (!defined('PORTAL_VIEW_ROUTER')) { http_response_code(403); exit; }
title('Bảo vệ tài khoản','Đăng nhập lần đầu: đổi mật khẩu mặc định và tạo PIN để xác nhận phiếu bầu.');panel('Kích hoạt bảo mật');form_open('setup');inputf('Mật khẩu mới (tối thiểu 12 ký tự)','password','','password','required minlength="12"');inputf('Nhập lại mật khẩu','confirm','','password','required');inputf('Mã PIN gồm 6 chữ số','pin','','password','required minlength="6" maxlength="6" pattern="[0-9]{6}"');submitf('Kích hoạt tài khoản');echo '</section>';
