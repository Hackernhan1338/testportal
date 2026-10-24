<?php
if(!defined('PORTAL_VIEW_ROUTER'))exit;
title('Bảng xếp hạng','Điểm chỉ được cộng khi hoàn thành nhiệm vụ được duyệt hoặc đã tham gia sự kiện.');
$leaders=score_rows(250);$rank=0;
panel('Xếp hạng đoàn viên');echo '<p class="muted">Mỗi nhiệm vụ chỉ tính điểm một lần. Điểm sự kiện chỉ ghi khi điểm danh thành công. Tài khoản có thể ẩn tên trong hồ sơ cá nhân.</p><div class="table-wrap"><table><tr><th>Hạng</th><th>Họ tên</th><th>MSSV</th><th>Nhiệm vụ</th><th>Sự kiện</th><th>Điểm</th></tr>';
foreach($leaders as $leader){$rank++;echo '<tr><td>'.($rank<=3?'🏅 ':'').$rank.'</td><td>'.e($leader['full_name']).'</td><td>'.e($leader['student_id']).'</td><td>'.(int)$leader['tasks_done'].' ('.(int)$leader['task_score'].'đ)</td><td>'.(int)$leader['events_done'].' ('.(int)$leader['event_score'].'đ)</td><td><b>'.(int)$leader['total'].'</b></td></tr>';}
echo '</table></div></section>';
