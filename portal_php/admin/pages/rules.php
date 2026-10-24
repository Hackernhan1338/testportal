<?php
if (!defined('PORTAL_VIEW_ROUTER')) { http_response_code(403); exit; }
title('Phiên bản bộ kiểm tra ảnh','Cho phép tải tệp JSON quy tắc, không thực thi mã PHP được tải lên qua website để tránh thực thi mã độc.');panel('Quy tắc đang áp dụng');echo '<pre>'.e(json_encode(card_rules(),JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE)).'</pre></section>';panel('Tải bản quy tắc mới');form_open('rules');inputf('Tệp cấu hình JSON','rules','','file','accept=".json,application/json" required');submitf('Kiểm tra và áp dụng');echo '</section>';
