<?php
if (!defined('PORTAL_VIEW_ROUTER')) { http_response_code(403); exit; }
panel('Lấy lại mật khẩu');echo '<p class="muted">Mã 6 chữ số sẽ gửi đến email sinh viên đã đăng ký.</p>';form_open('forgot');inputf('Email sinh viên','email','','email','required');submitf('Gửi mã');echo '<p><a href="index.php?page=reset">Tôi đã có mã</a></p></section>';
