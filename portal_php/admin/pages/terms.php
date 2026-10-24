<?php
if(!defined('PORTAL_VIEW_ROUTER'))exit;must_can($u,'terms');
title('Điều khoản & bảo mật','Biên tập các phiên bản điều khoản và chính sách bảo vệ dữ liệu.');
panel('Công bố phiên bản mới');form_open('publish_legal');echo '<label>Loại tài liệu<select name="doc_type"><option value="terms">Điều khoản</option><option value="privacy">Chính sách bảo mật</option></select></label>';inputf('Phiên bản','version','1.0','text','required maxlength="30"');inputf('Tiêu đề','title','','text','required maxlength="200"');echo '<label>Nội dung<textarea name="body" rows="13" required maxlength="50000"></textarea></label>';submitf('Công bố phiên bản');echo '</section>';
panel('Lịch sử');foreach(rows('SELECT * FROM legal_documents ORDER BY id DESC LIMIT 30') as $d)echo '<div class="line"><span><b>'.e($d['title']).'</b><small>'.e($d['doc_type']).' · '.e($d['version']).' · '.e($d['created_at']).'</small></span>'.status($d['is_active']?'Có hiệu lực':'Lưu trữ').'</div>';echo '</section>';
