<?php
if (!defined('PORTAL_VIEW_ROUTER')) { http_response_code(403); exit; }
title('Quản lý thông báo');panel('Thông báo mới');form_open('save_notice');inputf('Tiêu đề','title','','text','required');echo '<label>Nội dung<textarea name="body" required></textarea></label><label>Loại<select name="kind"><option value="general">Chung</option><option value="required">Việc cần làm</option><option value="security">Bảo mật</option></select></label>';submitf('Đăng thông báo');echo '</section>';
