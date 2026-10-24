<?php
if(!defined('PORTAL_VIEW_ROUTER'))exit;
$kind=($_GET['kind']??'terms')==='privacy'?'privacy':'terms';$doc=active_legal($kind);
title($doc['title']??($kind==='terms'?'Điều khoản sử dụng':'Chính sách bảo mật'),'Tài liệu công khai, có phiên bản và thời gian hiệu lực.');
panel('Nội dung '.($kind==='terms'?'điều khoản':'bảo mật'));if(!$doc)echo '<p>Quản trị viên chưa công bố văn bản. Hệ thống cần có văn bản chính thức trước khi đưa vào vận hành.</p>';else echo '<p class="muted">Phiên bản '.e($doc['version']).' · '.e($doc['created_at']).'</p><div class="legal-body">'.nl2br(e($doc['body'])).'</div>';echo '</section>';
