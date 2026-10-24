<?php
if(!defined('PORTAL_VIEW_ROUTER'))exit;must_can($u,'visits');
title('Website Visits','Thống kê IP duy nhất (băm HMAC), lượt xem, quốc gia và thiết bị truy cập.');
$stats=one('SELECT COUNT(*) views,COUNT(DISTINCT ip_hash) unique_ips,COUNT(DISTINCT device_hash) devices,COUNT(DISTINCT visitor_user_id) users FROM visit_logs WHERE visited_at>=NOW()-INTERVAL 30 DAY');
echo '<div class="ops-stats">';foreach(['Lượt truy cập'=>['views'],'IP duy nhất'=>['unique_ips'],'Thiết bị ước lượng'=>['devices'],'Sinh viên truy cập'=>['users']] as $label=>$field)echo '<div class="ops-kpi"><b>'.(int)($stats[$field[0]]??0).'</b><small>'.e($label).' / 30 ngày</small></div>';echo '</div>';
$days=rows('SELECT DATE(visited_at) day,COUNT(*) views,COUNT(DISTINCT ip_hash) visitors FROM visit_logs WHERE visited_at>=CURDATE()-INTERVAL 13 DAY GROUP BY DATE(visited_at) ORDER BY day');
panel('Biểu đồ 14 ngày');$max=max(1,...array_map('intval',array_column($days,'views')));echo '<div class="mini-bars">';foreach($days as $d)echo '<div class="mini-bar-row"><span>'.e($d['day']).'</span><div class="mini-track"><div style="width:'.round($d['views']/$max*100).'%"></div></div><b>'.(int)$d['views'].'</b></div>';echo '</div></section>';
panel('Quốc gia');foreach(rows('SELECT country,COUNT(*) views,COUNT(DISTINCT ip_hash) unique_ips FROM visit_logs GROUP BY country ORDER BY views DESC LIMIT 25') as $r)echo '<div class="line"><b>'.e($r['country']).'</b><span>'.(int)$r['views'].' lượt · '.(int)$r['unique_ips'].' IP</span></div>';echo '<p class="muted">Quốc gia chỉ xác định khi bật trust_cloudflare_country và website đi qua Cloudflare đáng tin cậy. XX = chưa xác định.</p></section>';
panel('Trang phổ biến');foreach(rows('SELECT page,COUNT(*) views FROM visit_logs WHERE visited_at>=NOW()-INTERVAL 30 DAY GROUP BY page ORDER BY views DESC LIMIT 20') as $r)echo '<div class="line"><b>'.e($r['page']).'</b><span>'.(int)$r['views'].' lượt</span></div>';echo '</section>';

panel('Lượt truy cập gần đây · chặn trực tiếp');
echo '<p class="muted">Mã băm IP/thiết bị không tiết lộ địa chỉ thực. Nút chặn sẽ ngăn cookie tương ứng hoặc IP hiện tại; người dùng có thể đổi IP/xóa cookie.</p><div class="table-wrap"><table><tr><th>Thời gian</th><th>Trang</th><th>IP (hash)</th><th>Thiết bị (hash)</th><th>Thao tác</th></tr>';
foreach(rows('SELECT * FROM visit_logs ORDER BY id DESC LIMIT 30') as $v){echo '<tr><td>'.e($v['visited_at']).'</td><td>'.e($v['page']).'</td><td><code>'.e(substr($v['ip_hash'],0,15)).'…</code></td><td><code>'.e(substr($v['device_hash'],0,15)).'…</code></td><td>';
if(admin_can($u,'security')){
 form_open('add_block');echo '<input type="hidden" name="kind" value="ip_hash"><input type="hidden" name="identity" value="'.e($v['ip_hash']).'"><input type="hidden" name="reason" value="Chặn từ Web Visits"><button class="btn" type="submit">Chặn IP</button></form>';
 if($v['device_hash']){form_open('add_block');echo '<input type="hidden" name="kind" value="device"><input type="hidden" name="identity" value="'.e($v['device_hash']).'"><input type="hidden" name="reason" value="Chặn thiết bị từ Web Visits"><button class="btn secondary" type="submit">Chặn thiết bị</button></form>';}
}
echo '</td></tr>';}echo '</table></div></section>';
