<?php
if(!defined('PORTAL_VIEW_ROUTER'))exit;
panel('Xác minh email sinh viên để liên kết Google');echo '<p class="muted">Google chưa chứng minh email này thuộc Google Workspace của trường. Vui lòng nhập mã OTP đã gửi về email sinh viên.</p>';
form_open('google_confirm');inputf('Mã xác minh 6 số','otp','','text','required pattern="[0-9]{6}" inputmode="numeric" maxlength="6"');submitf('Xác nhận và đăng nhập');echo '</section>';
