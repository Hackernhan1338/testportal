<?php
require_once __DIR__.'/lib.php';
if($_SERVER['REQUEST_METHOD']!=='POST')redirect('home');
try {
 verify_csrf();$action=$_POST['action']??'';
 if(in_array($action,['google_confirm','save_profile','change_password','accept_terms','read_notice','feedback_create','feedback_reply','publish_legal','set_admin','save_smtp','test_smtp','add_block','remove_block'],true)){require __DIR__.'/actions_v7.php';exit;}
 if($action==='login'){
  $email=strtolower(trim($_POST['email']??''));$pass=(string)($_POST['password']??'');
  if(!validate_student_email($email))throw new RuntimeException('Chỉ chấp nhận email sinh viên PTIT HCM.');
  if(!limit_check('login|'.($_SERVER['REMOTE_ADDR']??'').$email,7,900))throw new RuntimeException('Thử đăng nhập quá nhiều. Vui lòng thử lại sau.');
  $u=one('SELECT * FROM users WHERE email=? AND active=1',[$email]);
  if(!$u || !$u['pass_hash'] || !password_verify($pass,$u['pass_hash']))throw new RuntimeException('Tài khoản chưa được kích hoạt hoặc mật khẩu không đúng.');
  session_regenerate_id(true);$_SESSION['uid']=(int)$u['id'];log_action((int)$u['id'],'login');if($u['must_change']||!$u['pin_hash'])redirect('setup');
 $termsNow=active_legal('terms');if($termsNow && (int)($u['terms_accepted_id']??0)!==(int)$termsNow['id'])redirect('accept_terms');if(!empty($_SESSION['scan_target'])){$target=$_SESSION['scan_target'];unset($_SESSION['scan_target']);header('Location: '.$target);exit;}redirect('home');
 }
 if($action==='forgot'){
  $email=strtolower(trim($_POST['email']??''));
  if(!limit_check('forgot|'.($_SERVER['REMOTE_ADDR']??'').$email,3,3600))throw new RuntimeException('Đã vượt giới hạn gửi mã.');
  $u=validate_student_email($email)?one('SELECT id,email FROM users WHERE email=? AND active=1',[$email]):null;
  if($u && conf('smtp_host')){
   $code=(string)random_int(100000,999999);$hash=password_hash($code,PASSWORD_DEFAULT);
   exec_sql('INSERT INTO password_resets(user_id,otp_hash,expires_at) VALUES(?,?,DATE_ADD(NOW(), INTERVAL 10 MINUTE))',[$u['id'],$hash]);
   send_reset_email($u['email'],$code);
  }
  flash('Nếu email hợp lệ và đã đăng ký, mã khôi phục sẽ được gửi đến hộp thư sinh viên.');redirect('reset');
 }
 if($action==='reset'){
  $email=strtolower(trim($_POST['email']??''));$otp=trim($_POST['otp']??'');$password=(string)($_POST['password']??'');
  if(strlen($password)<12)throw new RuntimeException('Mật khẩu mới phải từ 12 ký tự.');
  if(!limit_check('reset|'.($_SERVER['REMOTE_ADDR']??'').$email,8,900))throw new RuntimeException('Thử quá nhiều lần.');
  $u=one('SELECT * FROM users WHERE email=? AND active=1',[$email]);
  $r=$u?one('SELECT * FROM password_resets WHERE user_id=? AND consumed=0 AND expires_at>NOW() ORDER BY id DESC LIMIT 1',[$u['id']]):null;
  if(!$r||$r['attempts']>=5||!password_verify($otp,$r['otp_hash'])){
   if($r)exec_sql('UPDATE password_resets SET attempts=attempts+1 WHERE id=?',[$r['id']]);
   throw new RuntimeException('Mã không hợp lệ hoặc đã hết hạn.');
  }
  db()->beginTransaction();
  exec_sql('UPDATE users SET pass_hash=?,must_change=0 WHERE id=?',[password_hash($password,PASSWORD_DEFAULT),$u['id']]);
  exec_sql('UPDATE password_resets SET consumed=1 WHERE user_id=?',[$u['id']]);db()->commit();
  flash('Đã đổi mật khẩu. Vui lòng đăng nhập.');redirect('login');
 }
 if($action==='logout'){$_SESSION=[];session_regenerate_id(true);redirect('login');}
 $u=require_user();
 if($action==='setup'){
  $p=(string)($_POST['password']??'');$pin=(string)($_POST['pin']??'');
  if(strlen($p)<12||!preg_match('/^\d{6}$/',$pin)||$p!==($_POST['confirm']??''))throw new RuntimeException('Mật khẩu tối thiểu 12 ký tự, xác nhận trùng khớp, PIN gồm 6 chữ số.');
  if($u['dob'] && password_verify(date('dmY',strtotime($u['dob'])),$u['pass_hash']) && $p===date('dmY',strtotime($u['dob'])))throw new RuntimeException('Không dùng lại mật khẩu ngày sinh.');
  exec_sql('UPDATE users SET pass_hash=?,pin_hash=?,must_change=0 WHERE id=?',[password_hash($p,PASSWORD_DEFAULT),password_hash($pin,PASSWORD_DEFAULT),$u['id']]);flash('Đã kích hoạt tài khoản.');if(!empty($_SESSION['scan_target'])){$target=$_SESSION['scan_target'];unset($_SESSION['scan_target']);header('Location: '.$target);exit;}redirect('home');
 }
 if($u['must_change']||!$u['pin_hash'])redirect('setup');
 $termsNow=active_legal('terms');if($termsNow && (int)($u['terms_accepted_id']??0)!==(int)$termsNow['id'])redirect('accept_terms');
 if($action==='submit'){
  $task=one('SELECT * FROM tasks WHERE id=? AND active=1',[(int)($_POST['task_id']??0)]);if(!$task)throw new RuntimeException('Yêu cầu không tồn tại.');if($task['due_at'] && strtotime($task['due_at'])<time())throw new RuntimeException('Nhiệm vụ đã hết hạn.');
  $image=null;$status='passed';$feedback='Đã xác nhận yêu cầu.';$extracted=[];
  if($task['type']==='photo'){
   $image=upload_image('photo');if($task['category']==='card'){$status='pending';$feedback='Đã nhận ảnh, đang xếp hàng OCR. Cán bộ sẽ kiểm tra kết quả trước khi kích hoạt thẻ.';} else {$status='pending';$feedback='Đã nhận minh chứng; chờ cán bộ kiểm duyệt.';}
  }
  exec_sql('INSERT INTO submissions(user_id,task_id,image_path,extracted,status,feedback) VALUES(?,?,?,?,?,?)',[$u['id'],$task['id'],$image,json_encode($extracted,JSON_UNESCAPED_UNICODE),$status,$feedback]);
  if($task['type']==='photo' && $task['category']==='card') {require_once __DIR__.'/app/services/OcrQueue.php';ocr_enqueue_submission((int)db()->lastInsertId());}
  log_action((int)$u['id'],'submit','task='.$task['id']);flash('Đã gửi yêu cầu. Trạng thái: '.$status);redirect('tasks');
 }
 if($action==='attendance'){
  $eventId=(int)($_POST['event_id']??0);$event=one('SELECT * FROM events WHERE id=? AND active=1 AND NOW() BETWEEN start_at AND end_at',[$eventId]);
  if(!$event||!validate_qr(trim($_POST['token']??''),$eventId))throw new RuntimeException('QR hết hạn, không hợp lệ hoặc sự kiện đã kết thúc.');
  exec_sql("INSERT IGNORE INTO attendances(event_id,user_id,method) VALUES(?,?,'qr')",[$eventId,$u['id']]);
  flash('Đã ghi nhận điểm danh cho sự kiện: '.$event['title']);redirect('events');
 }
 if($action==='vote'){
  require_pin($u,(string)($_POST['pin']??''));$electionId=(int)($_POST['election_id']??0);$ids=array_unique(array_map('intval',(array)($_POST['candidates']??[])));
  $el=one('SELECT * FROM elections WHERE id=? AND active=1 AND NOW() BETWEEN starts_at AND ends_at',[$electionId]);
  if(!$el||count($ids)<1||count($ids)>(int)$el['seats'])throw new RuntimeException('Phiếu bầu không hợp lệ hoặc đã hết thời gian.');
  $valid=rows('SELECT id FROM candidates WHERE election_id=?',[$electionId]);$allowed=array_map('intval',array_column($valid,'id'));
  foreach($ids as $id)if(!in_array($id,$allowed,true))throw new RuntimeException('Ứng viên không hợp lệ.');
  db()->beginTransaction();
  try {
   exec_sql('INSERT INTO voters(election_id,user_id) VALUES(?,?)',[$electionId,$u['id']]);
   foreach($ids as $id)exec_sql('INSERT INTO ballots(election_id,candidate_id) VALUES(?,?)',[$electionId,$id]);
   db()->commit();
  }catch(Throwable $e){db()->rollBack();throw new RuntimeException('Đồng chí đã bỏ phiếu hoặc giao dịch không thành công.');}
  flash('Đã ghi nhận phiếu bầu.');redirect('elections');
 }
 if($u['role']!=='admin')throw new RuntimeException('Không có quyền quản trị.');
 $actionCaps=['save_user'=>'users','activate_user'=>'users','role'=>'admins','save_task'=>'tasks','review'=>'review','save_event'=>'events','manual_attendance'=>'events','save_notice'=>'notices','save_election'=>'elections','add_candidate'=>'elections','toggle_module'=>'modules','rules'=>'rules'];
 if(isset($actionCaps[$action]))must_can($u,$actionCaps[$action]);
 if($action==='save_user'){
  $id=(int)($_POST['id']??0);$sid=strtoupper(trim($_POST['student_id']??''));$email=student_email($sid);
  if(!validate_student_email($email))throw new RuntimeException('MSSV không đúng định dạng.');
  $name=trim($_POST['full_name']??'');if($name==='')throw new RuntimeException('Họ tên không được trống.');
  $dob=trim($_POST['dob']??'')?:null;$allowed=['member','not_joined','local','pending','transferred','unknown'];$member=$_POST['membership']??'unknown';if(!in_array($member,$allowed,true))throw new RuntimeException('Trạng thái không hợp lệ.');
  if($dob && (!DateTimeImmutable::createFromFormat('!Y-m-d',$dob)))throw new RuntimeException('Ngày sinh không hợp lệ.');
  if($id){exec_sql('UPDATE users SET student_id=?,email=?,full_name=?,dob=?,membership=?,transfer_status=?,class_name=?,position_title=?,notes=?,biography=?,is_officer=?,joined_date=?,activity_unit=? WHERE id=?',[$sid,$email,$name,$dob,$member,$_POST['transfer_status']??'',$_POST['class_name']??'',$_POST['position_title']??'',$_POST['notes']??'',$_POST['biography']??'',isset($_POST['is_officer'])?1:0,($_POST['joined_date']??'')?:null,$_POST['activity_unit']??'',$id]);}
  else {exec_sql('INSERT INTO users(student_id,email,full_name,dob,membership,transfer_status,class_name,position_title,notes,biography,is_officer,joined_date,activity_unit) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)',[$sid,$email,$name,$dob,$member,$_POST['transfer_status']??'',$_POST['class_name']??'',$_POST['position_title']??'',$_POST['notes']??'',$_POST['biography']??'',isset($_POST['is_officer'])?1:0,($_POST['joined_date']??'')?:null,$_POST['activity_unit']??'']);$id=(int)db()->lastInsertId();}
  exec_sql('UPDATE users SET class_number=?,hometown=?,gender=?,ethnic_group=?,religion=?,phone=?,personal_email=?,party_joined_date=? WHERE id=?',[(($_POST['class_number']??'')==='')?null:min(1000,max(1,(int)$_POST['class_number'])),trim((string)($_POST['hometown']??'')),trim((string)($_POST['gender']??'')),trim((string)($_POST['ethnic_group']??'')),trim((string)($_POST['religion']??'')),trim((string)($_POST['phone']??'')),trim((string)($_POST['personal_email']??'')),($_POST['party_joined_date']??'')?:null,$id]);
  if(!empty($_FILES['avatar']['name'])){$file=upload_image('avatar');exec_sql('UPDATE users SET avatar_path=? WHERE id=?',[$file,$id]);}flash('Đã lưu hồ sơ.');redirect('admin_users');
 }
 if($action==='activate_user'){
  $target=one('SELECT * FROM users WHERE id=?',[(int)$_POST['id']]);if(!$target||!$target['dob'])throw new RuntimeException('Phải nhập ngày sinh trước khi cấp mật khẩu ban đầu.');
  $temp=date('dmY',strtotime($target['dob']));
  exec_sql('UPDATE users SET pass_hash=?,pin_hash=NULL,must_change=1 WHERE id=?',[password_hash($temp,PASSWORD_DEFAULT),$target['id']]);
  log_action((int)$u['id'],'activate_user','target='.$target['id']);flash('Đã cấp mật khẩu tạm theo ngày sinh (ddmmyyyy). Yêu cầu đổi ngay lần đầu.');redirect('admin_users');
 }
 if($action==='role'){
  $id=(int)$_POST['id'];if($id===(int)$u['id'])throw new RuntimeException('Không thể tự thay đổi quyền.');
  if(one("SELECT id FROM users WHERE id=? AND admin_level='SUPER_ADMIN'",[$id]))throw new RuntimeException('Quản lý Super Admin chỉ được thực hiện trong trang Quản trị Admin.');
  $role=($_POST['role']??'')==='admin'?'admin':'user';exec_sql('UPDATE users SET role=?,admin_level=? WHERE id=?',[$role,$role==='admin'?'ADMIN':'NONE',$id]);log_action((int)$u['id'],'role','target='.$id.' role='.$role);redirect('admin_users');
 }
 if($action==='save_task'){
  $title=trim($_POST['title']??'');if(!$title)throw new RuntimeException('Thiếu tiêu đề.');
  $type=($_POST['type']??'photo')==='ack'?'ack':'photo';
   $cat=$_POST['category']??'general';if(!in_array($cat,['general','competition','card'],true))throw new RuntimeException('Nhóm yêu cầu không hợp lệ.');exec_sql('INSERT INTO tasks(title,description,type,category,due_at,points) VALUES(?,?,?,?,?,?)',[$title,$_POST['description']??'',$type,$cat,empty($_POST['due_at'])?null:safe_time($_POST['due_at']),min(1000,max(0,(int)($_POST['points']??15)))]);flash('Đã giao nhiệm vụ.');redirect('admin_tasks');
 }
 if($action==='review'){
  $status=$_POST['status']??'';if(!in_array($status,['passed','rejected','needs_review'],true))throw new RuntimeException('Trạng thái không hợp lệ.');
  $submission=one('SELECT s.*,t.category,t.type FROM submissions s JOIN tasks t ON t.id=s.task_id WHERE s.id=?',[(int)$_POST['id']]);if(!$submission)throw new RuntimeException('Không tìm thấy bài nộp.');
  if($status==='passed' && $submission['category']==='card'){
   $fields=json_decode($submission['extracted']??'{}',true)?:[];$r=card_rules();
   foreach($r['required'] as $key)if(empty($fields[$key]))throw new RuntimeException('Ảnh chưa có đủ trường '. $key.'. Không thể xác minh thẻ.');
   $existing=one('SELECT * FROM users WHERE id=?',[$submission['user_id']]);
   if(!empty($existing['dob'])&&($fields['date_of_birth']??'')!==$existing['dob'])throw new RuntimeException('Ngày sinh không khớp.');
   if(mb_strtolower(trim((string)$fields['full_name']))!==mb_strtolower(trim($existing['full_name'])))throw new RuntimeException('Họ tên không khớp, phải xử lý sai khác trước khi duyệt.');
   $number=trim((string)$fields['card_number']);if(!preg_match('/^[0-9A-Za-z-]{6,40}$/',$number))throw new RuntimeException('Số thẻ không hợp lệ.');
   exec_sql('UPDATE users SET card_number=?,joined_date=?,activity_unit=?,card_verified_at=NOW(),card_verified_by=? WHERE id=?',[$number,$fields['join_date']??null,trim((string)($fields['activity_unit']??'')),$u['id'],$submission['user_id']]);
  }
  exec_sql('UPDATE submissions SET status=?,feedback=?,reviewed_at=NOW(),reviewer_id=? WHERE id=?',[$status,trim($_POST['feedback']??''),$u['id'],(int)$_POST['id']]);flash('Đã duyệt bài nộp.');redirect('admin_submissions');
 }
 if($action==='save_event'){
  $start=safe_time($_POST['start_at']??'');$end=safe_time($_POST['end_at']??'');if($end<=$start)throw new RuntimeException('Thời gian kết thúc phải sau bắt đầu.');
  exec_sql('INSERT INTO events(title,description,start_at,end_at,points) VALUES(?,?,?,?,?)',[trim($_POST['title']??''),$_POST['description']??'',$start,$end,min(1000,max(0,(int)($_POST['points']??10)))]);flash('Đã tạo sự kiện.');redirect('admin_events');
 }
 if($action==='manual_attendance'){
  $eid=(int)$_POST['event_id'];$sid=strtoupper(trim($_POST['student_id']??''));$person=one('SELECT id FROM users WHERE student_id=?',[$sid]);if(!$person)throw new RuntimeException('Không tìm thấy MSSV.');
  exec_sql("INSERT IGNORE INTO attendances(event_id,user_id,method) VALUES(?,?,'manual')",[$eid,$person['id']]);log_action((int)$u['id'],'manual_attendance','event='.$eid.' student='.$sid);flash('Đã ghi nhận điểm danh thủ công.');redirect('admin_events');
 }
 if($action==='save_notice'){
  $kind=in_array($_POST['kind']??'',['general','security','required'],true)?$_POST['kind']:'general';
  exec_sql('INSERT INTO announcements(title,body,kind) VALUES(?,?,?)',[trim($_POST['title']??''),trim($_POST['body']??''),$kind]);flash('Đã đăng thông báo.');redirect('admin_notices');
 }
 if($action==='save_election'){
  $start=safe_time($_POST['starts_at']??'');$end=safe_time($_POST['ends_at']??'');$seats=(int)($_POST['seats']??1);if($seats<1||$seats>20||$start>=$end)throw new RuntimeException('Thông tin cuộc bầu cử không hợp lệ.');
  exec_sql('INSERT INTO elections(title,description,starts_at,ends_at,seats) VALUES(?,?,?,?,?)',[trim($_POST['title']??''),$_POST['description']??'',$start,$end,$seats]);flash('Đã tạo cuộc bầu cử.');redirect('admin_elections');
 }
 if($action==='add_candidate'){
  $eid=(int)($_POST['election_id']??0);$person=one('SELECT id FROM users WHERE student_id=?',[strtoupper(trim($_POST['student_id']??''))]);
  if(!$person)throw new RuntimeException('Không tìm thấy ứng viên.');
  exec_sql('INSERT IGNORE INTO candidates(election_id,user_id) VALUES(?,?)',[$eid,$person['id']]);flash('Đã thêm ứng viên.');redirect('admin_elections');
 }
 if($action==='toggle_module'){
  $module=(string)($_POST['module']??'');$allowed=['tasks','events','elections','card','officers','competitions','notifications','profile','leaderboard','feedback'];if(!in_array($module,$allowed,true))throw new RuntimeException('Module không hợp lệ.');
  $enabled=($_POST['enabled']??'')==='1'?1:0;
  exec_sql('INSERT INTO module_settings(module_key,enabled) VALUES(?,?) ON DUPLICATE KEY UPDATE enabled=VALUES(enabled)',[$module,$enabled]);
  log_action((int)$u['id'],'toggle_module',$module.':'.$enabled);flash('Đã cập nhật module.');redirect('admin_modules');
 }
 if($action==='rules'){
  if(!isset($_FILES['rules'])||$_FILES['rules']['error']!==UPLOAD_ERR_OK||$_FILES['rules']['size']>20000)throw new RuntimeException('JSON tối đa 20 KB.');
  $json=file_get_contents($_FILES['rules']['tmp_name']);$v=json_decode($json,true,512,JSON_THROW_ON_ERROR);
  $keys=['full_name','date_of_birth','position','join_date','card_number','activity_unit','join_place','issue_place'];
  if(!isset($v['required'],$v['optional'])||!is_array($v['required'])||!is_array($v['optional'])||array_diff(array_merge($v['required'],$v['optional']),$keys))throw new RuntimeException('Cấu trúc quy tắc không hợp lệ.');
  $requiredCard=['full_name','date_of_birth','position','join_date','card_number','activity_unit'];
  if(array_diff($requiredCard,$v['required']))throw new RuntimeException('Không được bỏ 6 trường thẻ đoàn viên bắt buộc.');
  exec_sql('INSERT INTO verifier_rules(filename,config) VALUES(?,?)',[basename($_FILES['rules']['name']),json_encode($v,JSON_UNESCAPED_UNICODE)]);log_action((int)$u['id'],'rules_update');flash('Đã kích hoạt phiên bản quy tắc kiểm tra mới.');redirect('admin_rules');
 }
 throw new RuntimeException('Hành động không được hỗ trợ.');
}catch(Throwable $ex){if(db()->inTransaction())db()->rollBack();flash($ex->getMessage(),'error'); $ref=parse_url($_SERVER['HTTP_REFERER']??'',PHP_URL_QUERY)?:'';parse_str($ref,$params);$back=$params['page']??'home';if(!preg_match('/^[a-z_]+$/',$back)||$back==='action')$back='home';redirect($back);}
