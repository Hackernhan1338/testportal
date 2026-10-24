<?php
if (!defined('PORTAL_VIEW_ROUTER')) { http_response_code(403); exit; }
panel('Đặt lại mật khẩu');form_open('reset');inputf('Email sinh viên','email','','email','required');inputf('Mã xác minh','otp','','text','required inputmode="numeric"');inputf('Mật khẩu mới (tối thiểu 12 ký tự)','password','','password','required minlength="12"');submitf('Đặt lại mật khẩu');echo '</section>';
