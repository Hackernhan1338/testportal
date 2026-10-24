<?php
require_once __DIR__.'/lib.php';
$page=(string)($_GET['page']??'home');
if(!preg_match('/^[a-z_]{1,65}$/D',$page)){$page='home';}
try{enforce_client_block();collect_visit($page);}catch(Throwable $ex){error_log('Security/visits: '.$ex->getMessage());}
if($page==='google_start'||$page==='google_callback'){require __DIR__.'/app/services/GoogleAuth.php';if($page==='google_start')google_start();else google_callback();exit;}

if($page==='action'){require __DIR__.'/actions.php';exit;}
if($page==='avatar'){
 $u=require_user();$id=(int)($_GET['id']??0);
 $person=one("SELECT avatar_path FROM users WHERE id=? AND (is_officer=1 OR id=?)",[$id,(int)$u['id']]);
 $f=$person&&$person['avatar_path']?__DIR__.'/storage/uploads/'.basename($person['avatar_path']):null;
 if(!$f||!is_file($f)){http_response_code(404);exit('Không có ảnh');}
 header('Content-Type: '.(new finfo(FILEINFO_MIME_TYPE))->file($f));header('Cache-Control: private, no-store');readfile($f);exit;
}
if($page==='photo'){
 $u=require_user();$id=(int)($_GET['id']??0);
 $s=one('SELECT * FROM submissions WHERE id=?',[$id]);
 if(!$s||($u['role']!=='admin'&&(int)$s['user_id']!==(int)$u['id'])){http_response_code(403);exit('Không có quyền');}
 $file=__DIR__.'/storage/uploads/'.basename((string)$s['image_path']);
 if(!$s['image_path']||!is_file($file)){http_response_code(404);exit('Không tìm thấy ảnh');}
 header('Content-Type: '.(new finfo(FILEINFO_MIME_TYPE))->file($file));header('Cache-Control: private, no-store');readfile($file);exit;
}
if($page==='export'){
 $u=require_admin();must_can($u,'reports');$type=$_GET['type']??'users';$id=(int)($_GET['id']??0);
 if($type==='task_missing')$data=rows("SELECT u.student_id,u.full_name,u.email,u.membership FROM users u WHERE NOT EXISTS (SELECT 1 FROM submissions s WHERE s.user_id=u.id AND s.task_id=? AND s.status='passed') ORDER BY u.student_id",[$id]);
 elseif($type==='attendances')$data=rows('SELECT u.student_id,u.full_name,u.email,a.checked_at,a.method,e.title AS activity FROM attendances a JOIN users u ON u.id=a.user_id JOIN events e ON e.id=a.event_id WHERE a.event_id=? ORDER BY u.student_id',[$id]);
 elseif($type==='submissions')$data=rows('SELECT u.student_id,u.full_name,u.email,t.title AS activity,s.status,s.feedback,s.submitted_at FROM submissions s JOIN users u ON u.id=s.user_id JOIN tasks t ON t.id=s.task_id WHERE s.task_id=? ORDER BY u.student_id',[$id]);
 elseif($type==='task_completed')$data=rows("SELECT DISTINCT u.student_id,u.full_name,u.email,s.reviewed_at FROM submissions s JOIN users u ON u.id=s.user_id WHERE s.task_id=? AND s.status='passed' ORDER BY u.student_id",[$id]);
 else $data=rows('SELECT student_id,class_number,full_name,dob,hometown,gender,ethnic_group,religion,phone,email,personal_email,party_joined_date,joined_date,activity_unit,card_number,membership,transfer_status,class_name,position_title,notes FROM users ORDER BY student_id');
 header('Content-Type: text/csv; charset=UTF-8');header('Content-Disposition: attachment; filename="doan_'.$type.'_'.date('Ymd').'.csv"');echo "\xEF\xBB\xBF";
 $out=fopen('php://output','w');if($data)fputcsv($out,array_keys($data[0]));foreach($data as $record){$record=array_map(fn($x)=>is_string($x)&&preg_match('/^[=+@\-\t\r]/u',$x)?"'".$x:$x,$record);fputcsv($out,$record);}fclose($out);exit;
}
if($page==='ocr_api'){
 $u=require_admin();must_can($u,'ocr');require_once __DIR__.'/app/services/OcrQueue.php';
 header('Content-Type: application/json; charset=UTF-8');header('Cache-Control: no-store');
 $op=(string)($_GET['op']??'state');
 try{
  if($op==='state'){echo json_encode(['stats'=>ocr_stats()]);exit;}
  if($_SERVER['REQUEST_METHOD']!=='POST'){http_response_code(405);throw new RuntimeException('Chỉ chấp nhận POST.');}
  verify_csrf();
  if($op==='queue'){ocr_enqueue_all();log_action((int)$u['id'],'ocr_enqueue_all');echo json_encode(['stats'=>ocr_stats()]);exit;}
  if($op==='run'){if(session_status()===PHP_SESSION_ACTIVE)session_write_close();echo json_encode(ocr_run_next(),JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE);exit;}
  if($op==='retry'){ocr_retry_submission((int)($_POST['id']??0));log_action((int)$u['id'],'ocr_retry','submission='.(int)($_POST['id']??0));echo json_encode(['stats'=>ocr_stats()]);exit;}
  http_response_code(400);throw new RuntimeException('Chức năng OCR không hợp lệ.');
 }catch(Throwable $error){if(http_response_code()===200)http_response_code(400);echo json_encode(['error'=>$error->getMessage()],JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE);exit;}
}
if($page==='qr_token'){
 $u=require_admin();must_can($u,'events');$id=(int)($_GET['id']??0);
 $event=one('SELECT id,start_at,end_at FROM events WHERE id=? AND active=1',[$id]);
 header('Content-Type: application/json');header('Cache-Control: no-store');
 if(!$event||time()<strtotime($event['start_at'])||time()>strtotime($event['end_at'])){http_response_code(404);echo json_encode(['error'=>'Sự kiện chưa diễn ra hoặc đã kết thúc']);exit;}
 $token=qr_payload($id);$expiry=(intdiv(time(),120)+1)*120;
 echo json_encode(['token'=>$token,'expires_in'=>$expiry-time(),'expires_at'=>$expiry,'server_now'=>time(),'url'=>public_url().'?page=scan&event='.$id.'&token='.rawurlencode($token)]);exit;
}
if($page==='scan'&&!me()){$_SESSION['scan_target']='index.php?page=scan&event='.(int)($_GET['event']??0).'&token='.rawurlencode($_GET['token']??'');redirect('login');}
$public=['login','forgot','reset','legal','google_confirm'];$u=in_array($page,$public,true)?me():require_user();
if($u && ($u['must_change']||!$u['pin_hash']) && !in_array($page,['setup','login','forgot','reset','google_confirm','legal'],true))redirect('setup');
if($u && !in_array($page,['setup','login','forgot','reset','accept_terms','legal','google_confirm'],true)) { $terms=active_legal('terms');if($terms && (int)($u['terms_accepted_id']??0)!==(int)$terms['id'])redirect('accept_terms'); }
$adminPages=['admin','admin_users','admin_tasks','admin_submissions','admin_events','admin_notices','admin_elections','admin_rules','admin_user','admin_officers','admin_reports','admin_audit','admin_modules','admin_analytics','admin_security','admin_ocr','admin_qr','admin_health','admin_visits','admin_feedback','admin_terms','admin_smtp','admin_admins','admin_blocks'];
if(in_array($page,$adminPages,true)) { $u=require_admin();$pageCaps=['admin_visits'=>'visits','admin_feedback'=>'feedback','admin_terms'=>'terms','admin_smtp'=>'smtp','admin_admins'=>'admins','admin_blocks'=>'security','admin_security'=>'security','admin_users'=>'users','admin_user'=>'users','admin_officers'=>'users','admin_tasks'=>'tasks','admin_submissions'=>'review','admin_ocr'=>'ocr','admin_events'=>'events','admin_qr'=>'events','admin_elections'=>'elections','admin_notices'=>'notices','admin_reports'=>'reports','admin_analytics'=>'visits','admin_audit'=>'security','admin_rules'=>'rules','admin_modules'=>'modules'];if(isset($pageCaps[$page])&&!admin_can($u,$pageCaps[$page])){http_response_code(403);exit('Không đủ quyền cho phân hệ này.');} }
if($u && $u['role']!=='admin' && !in_array($page,$public,true) && !in_array($page,['setup','home','scan'],true) && !module_enabled($page)) {http_response_code(403);exit('Phân hệ đang được tạm đóng bởi quản trị viên.');}
$notice=$_SESSION['flash']??null;unset($_SESSION['flash']);
function form_open(string $action):void {echo '<form action="index.php?page=action" method="post" enctype="multipart/form-data"><input type="hidden" name="_csrf" value="'.e(csrf()).'"><input type="hidden" name="action" value="'.e($action).'">';}
function inputf(string $label,string $name,string $val='',string $type='text',string $extra=''):void {echo '<label>'.e($label).'<input name="'.e($name).'" type="'.e($type).'" value="'.e($val).'" '.$extra.'></label>';}
function submitf(string $label='Lưu'):void {echo '<button class="btn" type="submit">'.e($label).'</button></form>';}
function title(string $t,string $sub=''):void {echo '<div class="headline"><div><h1>'.e($t).'</h1>'.($sub?'<p>'.e($sub).'</p>':'').'</div></div>';}
function panel(string $title=''):void {echo '<section class="panel">'.($title?'<h2>'.e($title).'</h2>':'');}
function status(string $x):string {return '<span class="status">'.e($x).'</span>';}
?><!DOCTYPE html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Cổng thông tin Đoàn viên</title><link rel="stylesheet" href="assets/css/site.css"><link rel="stylesheet" href="admin/assets/admin.css"><link rel="stylesheet" href="admin/assets/admin-v4.css"><link rel="stylesheet" href="assets/css/portal.css"><link rel="stylesheet" href="assets/css/v7.css"><script src="assets/js/portal.js" defer></script></head><body class="<?=in_array($page,$adminPages,true)?'focus-admin-mode':'focus-user-mode'?>">
<?php if($u && !in_array($page,$public,true)): ?>
<div class="shell <?=in_array($page,$adminPages,true)?'focus-admin-shell':'focus-user-shell'?>"><aside class="sidebar <?=in_array($page,$adminPages,true)?'adminpagentn-sidebar':''?>" id="portal-sidebar"><a class="brand" href="index.php?page=home"><span class="star">★</span><span>PTIT Youth Portal<small>CHI ĐOÀN N26CQCN03-N</small></span></a><nav>
<div class="navlabel">KHÔNG GIAN CÁ NHÂN</div>
<?php foreach(['home'=>['▦','Tổng quan'],'tasks'=>['◎','Nhiệm vụ & minh chứng'],'events'=>['▣','Sự kiện & điểm danh'],'elections'=>['◈','Bầu cử'],'card'=>['▤','Thẻ đoàn viên'],'officers'=>['♙','Cán bộ Đoàn'],'competitions'=>['✦','Cuộc thi đã nộp'],'notifications'=>['✉','Thông báo'],'profile'=>['♧','Hồ sơ cá nhân'],'leaderboard'=>['★','Bảng xếp hạng'],'feedback'=>['✎','Góp ý']] as $slug=>$entry): ?><?php if($u['role']==='admin' || $slug==='home' || module_enabled($slug)): ?><a class="<?= $page===$slug?'active':'' ?>" href="index.php?page=<?=e($slug)?>"><span class="navicon"><?=e($entry[0])?></span><?=e($entry[1])?></a><?php endif; endforeach; ?>
<?php if($u['role']==='admin'):?><div class="navlabel">TRUNG TÂM ĐIỀU HÀNH</div>
<?php foreach(['admin'=>['▦','Dashboard'],'admin_users'=>['♙','Quản lý đoàn viên'],'admin_officers'=>['♜','Cán bộ Đoàn'],'admin_tasks'=>['◎','Giao nhiệm vụ'],'admin_submissions'=>['▤','Duyệt ảnh'],'admin_ocr'=>['⌗','Trung tâm OCR'],'admin_events'=>['▣','Sự kiện & QR'],'admin_elections'=>['◈','Bầu cử'],'admin_notices'=>['✉','Thông báo'],'admin_reports'=>['⇩','Xuất báo cáo'],'admin_analytics'=>['◫','Phân tích'],'admin_audit'=>['⌕','Audit logs'],'admin_security'=>['♢','Bảo mật'],'admin_health'=>['✚','Health & Integration'],'admin_rules'=>['⚙','Bộ kiểm tra ảnh'],'admin_modules'=>['☷','Module Control'],'admin_visits'=>['◫','Web visits'],'admin_feedback'=>['✎','Góp ý'],'admin_terms'=>['▤','Điều khoản'],'admin_smtp'=>['✉','SMTP'],'admin_admins'=>['♛','Quản trị Admin'],'admin_blocks'=>['⊘','Chặn IP / thiết bị']] as $slug=>$entry): ?><?php if(!isset($pageCaps[$slug]) || admin_can($u,$pageCaps[$slug])): ?><a class="<?= $page===$slug?'active':'' ?>" href="index.php?page=<?=e($slug)?>"><span class="navicon"><?=e($entry[0])?></span><?=e($entry[1])?></a><?php endif; endforeach; endif; ?>
</nav><div class="account"><span class="online-dot"></span><b><?=e($u['full_name'])?></b><small><?=e($u['student_id'])?> · <?=e($u['role'])?></small><?php form_open('logout');submitf('Đăng xuất');?><a class="nav-footer-link" href="index.php?page=legal&kind=privacy">Bảo mật</a><a class="nav-footer-link" href="index.php?page=legal&kind=terms">Điều khoản</a></div></aside><main class="main"><header class="top"><div class="top-left"><button class="mobile-toggle" aria-label="Mở menu" type="button" data-toggle-sidebar>☰</button><span><?=in_array($page,$adminPages,true)?'FOCUSBRAIN-STYLE ADMINISTRATION':'KHÔNG GIAN ĐOÀN VIÊN'?></span></div><div class="top-right"><span class="top-account"><?=e($u['full_name'])?></span><span class="pill"><?=e(date('d/m/Y'))?></span></div></header>
<?php else: ?><div class="authwrap"><div class="authbrand">★ <b>Cổng Đoàn viên</b><span>Quản lý công tác Đoàn · PTIT HCM</span></div>
<?php endif; ?>
<?php if($notice):?><div class="alert <?=($notice['kind']==='error'?'bad':'good')?>"><?=e($notice['message'])?></div><?php endif;?>
<?php
define('PORTAL_VIEW_ROUTER', true);
switch($page){
case 'login':require __DIR__.'/user/pages/login.php';break;
case 'forgot':require __DIR__.'/user/pages/forgot.php';break;
case 'reset':require __DIR__.'/user/pages/reset.php';break;
case 'setup':require __DIR__.'/user/pages/setup.php';break;
case 'home':require __DIR__.'/user/pages/home.php';break;
case 'profile':require __DIR__.'/user/pages/profile.php';break;
case 'leaderboard':require __DIR__.'/user/pages/leaderboard.php';break;
case 'feedback':require __DIR__.'/user/pages/feedback.php';break;
case 'legal':require __DIR__.'/user/pages/legal.php';break;
case 'accept_terms':require __DIR__.'/user/pages/accept_terms.php';break;
case 'google_confirm':require __DIR__.'/user/pages/google_confirm.php';break;
case 'competitions':require __DIR__.'/user/pages/competitions.php';break;
case 'tasks':require __DIR__.'/user/pages/tasks.php';break;
case 'events':require __DIR__.'/user/pages/events.php';break;
case 'scan':require __DIR__.'/user/pages/scan.php';break;
case 'card':require __DIR__.'/user/pages/card.php';break;
case 'officers':require __DIR__.'/user/pages/officers.php';break;
case 'notifications':require __DIR__.'/user/pages/notifications.php';break;
case 'elections':require __DIR__.'/user/pages/elections.php';break;
case 'admin':require __DIR__.'/admin/pages/dashboard.php';break;
case 'admin_visits':require __DIR__.'/admin/pages/visits.php';break;
case 'admin_feedback':require __DIR__.'/admin/pages/feedback.php';break;
case 'admin_terms':require __DIR__.'/admin/pages/terms.php';break;
case 'admin_smtp':require __DIR__.'/admin/pages/smtp.php';break;
case 'admin_admins':require __DIR__.'/admin/pages/admins.php';break;
case 'admin_blocks':require __DIR__.'/admin/pages/blocklist.php';break;
case 'admin_users':require __DIR__.'/admin/pages/users.php';break;
case 'admin_user':require __DIR__.'/admin/pages/user.php';break;
case 'admin_reports':require __DIR__.'/admin/pages/reports.php';break;
case 'admin_officers':require __DIR__.'/admin/pages/officers.php';break;
case 'admin_tasks':require __DIR__.'/admin/pages/tasks.php';break;
case 'admin_ocr':require __DIR__.'/admin/pages/ocr.php';break;
case 'admin_health':require __DIR__.'/admin/pages/health.php';break;
case 'admin_submissions':require __DIR__.'/admin/pages/submissions.php';break;
case 'admin_events':require __DIR__.'/admin/pages/events.php';break;
case 'admin_qr':require __DIR__.'/admin/pages/qr.php';break;
case 'admin_notices':require __DIR__.'/admin/pages/notices.php';break;
case 'admin_elections':require __DIR__.'/admin/pages/elections.php';break;
case 'admin_analytics':require __DIR__.'/admin/pages/analytics.php';break;
case 'admin_audit':require __DIR__.'/admin/pages/audit.php';break;
case 'admin_security':require __DIR__.'/admin/pages/security.php';break;
case 'admin_modules':require __DIR__.'/admin/pages/modules.php';break;
case 'admin_rules':require __DIR__.'/admin/pages/rules.php';break;

default: http_response_code(404);title('Không tìm thấy trang');
}
?>
<footer class="portal-footer"><span>© <?=date('Y')?> PTIT Youth Portal · N26CQCN03-N</span> <span><a href="index.php?page=legal&kind=privacy">Chính sách bảo mật</a> · <a href="index.php?page=legal&kind=terms">Điều khoản</a> · <a href="index.php?page=feedback">Góp ý</a></span></footer>
<?php if($u && !in_array($page,$public,true)):?></main></div><?php else:?></div><?php endif;?></body></html>
