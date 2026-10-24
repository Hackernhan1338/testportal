<?php
if (!defined('PORTAL_VIEW_ROUTER')) { http_response_code(403); exit; }
title('Phân tích & báo cáo','Dữ liệu thống kê trực tiếp theo trạng thái và hoạt động.');
 $group=rows('SELECT membership,COUNT(*) total FROM users GROUP BY membership ORDER BY total DESC');
 panel('Cơ cấu tình trạng Đoàn');echo '<div class="mini-bars">';$all=max(1,array_sum(array_column($group,'total')));foreach($group as $g){$pct=round(100*$g['total']/$all,1);echo '<div class="mini-bar-row"><span>'.e($g['membership']).'</span><div class="mini-track"><div style="width:'.$pct.'%"></div></div><b>'.(int)$g['total'].'</b></div>';}echo '</div></section>';
 panel('Tỷ lệ hoàn thành nhiệm vụ');foreach(rows('SELECT t.id,t.title,COUNT(DISTINCT CASE WHEN s.status="passed" THEN s.user_id END) completed FROM tasks t LEFT JOIN submissions s ON s.task_id=t.id GROUP BY t.id,t.title ORDER BY t.id DESC LIMIT 20') as $t){echo '<div class="line"><span>'.e($t['title']).'</span><b>'.(int)$t['completed'].' / '.$all.'</b></div>';}echo '</section>';
 panel('Hoạt động gần đây');foreach(rows('SELECT e.title,COUNT(a.id) attended FROM events e LEFT JOIN attendances a ON a.event_id=e.id GROUP BY e.id,e.title ORDER BY e.id DESC LIMIT 20') as $event){echo '<div class="line"><span>'.e($event['title']).'</span><b>'.(int)$event['attended'].' lượt</b></div>';}echo '</section>';
