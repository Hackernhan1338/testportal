<?php
if (!defined('PORTAL_VIEW_ROUTER')) { http_response_code(403); exit; }
title('Trung tâm điều hành','Thống kê công tác Đoàn theo dữ liệu thực.');$total=one('SELECT COUNT(*) c FROM users');$member=one("SELECT COUNT(*) c FROM users WHERE membership='member'");$att=one('SELECT COUNT(*) c FROM attendances');$sub=one('SELECT COUNT(*) c FROM submissions');echo '<div class="stats">';foreach([['Hồ sơ',$total['c']],['Đoàn viên',$member['c']],['Lượt điểm danh',$att['c']],['Bài nộp',$sub['c']]] as $v)echo '<article><small>'.e($v[0]).'</small><strong>'.e($v[1]).'</strong></article>';echo '</div>';panel('Xuất dữ liệu');echo '<p><a class="btn" href="index.php?page=export&type=users">Xuất toàn bộ danh sách CSV</a></p></section>';

?><?php if(admin_can($u,'visits')):?>
<div class="shortcut-row"><a href="index.php?page=admin_visits">Web Visits →</a><?php if(admin_can($u,'feedback')):?><a href="index.php?page=admin_feedback">Góp ý →</a><?php endif;?><?php if(admin_can($u,'terms')):?><a href="index.php?page=admin_terms">Quản lý điều khoản →</a><?php endif;?><?php if(admin_can($u,'admins')):?><a href="index.php?page=admin_admins">Quản trị Admin →</a><?php endif;?></div>
<?php endif;?>
