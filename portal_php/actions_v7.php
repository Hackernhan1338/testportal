<?php
// Included by actions.php AFTER CSRF verification. Each action terminates via redirect().
if($action==='google_confirm'){require_once __DIR__.'/app/services/GoogleAuth.php';google_confirm();}
$u=require_user();
if(!in_array($action,['accept_terms','change_password'],true)){$docNow=active_legal('terms');if($docNow && (int)($u['terms_accepted_id']??0)!==(int)$docNow['id'])redirect('accept_terms');}
if($action==='save_profile'){
 $phone=trim((string)($_POST['phone']??''));$personal=strtolower(trim((string)($_POST['personal_email']??'')));
 $quote=trim((string)($_POST['quote_text']??''));$author=trim((string)($_POST['quote_author']??''));
 if(strlen($phone)>32 || ($phone!==''&&!preg_match('/^[+0-9 ().-]{8,32}$/',$phone)))throw new RuntimeException('Số điện thoại không hợp lệ.');
 if($personal!=='' && (!filter_var($personal,FILTER_VALIDATE_EMAIL)||strlen($personal)>191))throw new RuntimeException('Email cá nhân không hợp lệ.');
 if(mb_strlen($quote)>400||mb_strlen($author)>160)throw new RuntimeException('Câu nói hoặc tác giả vượt quá giới hạn.');
 exec_sql('UPDATE users SET phone=?,personal_email=?,quote_text=?,quote_author=?,leaderboard_visible=? WHERE id=?',[$phone,$personal,$quote,$author,isset($_POST['leaderboard_visible'])?1:0,$u['id']]);
 if(!empty($_FILES['avatar']['name'])){$new=upload_image('avatar');exec_sql('UPDATE users SET avatar_path=? WHERE id=?',[$new,$u['id']]);}
 log_action((int)$u['id'],'update_profile');flash('Đã cập nhật hồ sơ cá nhân.');redirect('profile');
}
if($action==='change_password'){
 $old=(string)($_POST['old_password']??'');$new=(string)($_POST['new_password']??'');
 if(strlen($new)<12||strlen($new)>128)throw new RuntimeException('Mật khẩu mới cần từ 12 đến 128 ký tự.');
 if(!$u['pass_hash']||!password_verify($old,$u['pass_hash']))throw new RuntimeException('Mật khẩu hiện tại không đúng.');
 exec_sql('UPDATE users SET pass_hash=?,must_change=0 WHERE id=?',[password_hash($new,PASSWORD_DEFAULT),$u['id']]);
 session_regenerate_id(true);log_action((int)$u['id'],'change_password');flash('Đã đổi mật khẩu.');redirect('profile');
}
if($action==='accept_terms'){
 $doc=active_legal('terms');if(!$doc||(int)$doc['id']!==(int)($_POST['id']??0)||empty($_POST['accept']))throw new RuntimeException('Chưa chấp nhận phiên bản điều khoản hiện hành.');
 exec_sql('UPDATE users SET terms_accepted_id=? WHERE id=?',[$doc['id'],$u['id']]);log_action((int)$u['id'],'accept_terms','version='.$doc['version']);if(!empty($_SESSION['scan_target'])){$dest=$_SESSION['scan_target'];unset($_SESSION['scan_target']);header('Location: '.$dest);exit;}redirect('home');
}
if($action==='read_notice'){
 $id=(int)($_POST['id']??0);if(!one('SELECT id FROM announcements WHERE id=?',[$id]))throw new RuntimeException('Thông báo không tồn tại.');
 exec_sql('INSERT IGNORE INTO notification_reads(announcement_id,user_id) VALUES(?,?)',[$id,$u['id']]);redirect('notifications');
}
if($action==='feedback_create'){
 if(!limit_check('feedback|'.$u['id'],10,86400))throw new RuntimeException('Giới hạn 10 góp ý mỗi ngày.');
 $subject=trim((string)($_POST['subject']??''));$body=trim((string)($_POST['body']??''));
 if(mb_strlen($subject)<4||mb_strlen($subject)>190||mb_strlen($body)<10||mb_strlen($body)>5000)throw new RuntimeException('Tiêu đề 4–190 ký tự, nội dung 10–5000 ký tự.');
 exec_sql('INSERT INTO feedback_tickets(user_id,subject,body) VALUES(?,?,?)',[$u['id'],$subject,$body]);flash('Đã gửi góp ý.');redirect('feedback');
}
// Administrator-only changes, with capability checks in addition to role checks.
if($action==='feedback_reply'){
 must_can($u,'feedback');$id=(int)($_POST['id']??0);$status=(string)($_POST['status']??'');
 if(!in_array($status,['new','processing','resolved'],true))throw new RuntimeException('Trạng thái không hợp lệ.');
 $reply=trim((string)($_POST['reply']??''));if(mb_strlen($reply)<3||mb_strlen($reply)>5000)throw new RuntimeException('Phản hồi 3–5000 ký tự.');
 exec_sql('UPDATE feedback_tickets SET admin_reply=?,status=?,replied_by=?,replied_at=NOW() WHERE id=?',[$reply,$status,$u['id'],$id]);
 log_action((int)$u['id'],'feedback_reply','id='.$id);flash('Đã gửi phản hồi.');redirect('admin_feedback');
}
if($action==='publish_legal'){
 must_can($u,'terms');$type=(string)($_POST['doc_type']??'');$version=trim((string)($_POST['version']??''));$title=trim((string)($_POST['title']??''));$body=trim((string)($_POST['body']??''));
 if(!in_array($type,['terms','privacy'],true)||!preg_match('/^[0-9a-zA-Z._-]{1,30}$/D',$version)||mb_strlen($title)<4||mb_strlen($title)>200||mb_strlen($body)<80||mb_strlen($body)>50000)throw new RuntimeException('Phiên bản hoặc nội dung văn bản không hợp lệ (tối thiểu 80 ký tự).');
 db()->beginTransaction();exec_sql('UPDATE legal_documents SET is_active=0 WHERE doc_type=?',[$type]);exec_sql('INSERT INTO legal_documents(doc_type,version,title,body,published_by) VALUES(?,?,?,?,?)',[$type,$version,$title,$body,$u['id']]);db()->commit();
 log_action((int)$u['id'],'publish_legal',$type.' '.$version);flash('Đã công bố phiên bản mới.');redirect('admin_terms');
}
if($action==='set_admin'){
 must_can($u,'admins');$id=(int)($_POST['id']??0);$level=(string)($_POST['level']??'');
 if(!in_array($level,['NONE','ANALYST','MODERATOR','ADMIN','SUPER_ADMIN'],true))throw new RuntimeException('Cấp quản trị không hợp lệ.');
 if($id===(int)$u['id'])throw new RuntimeException('Không thể tự thay đổi quyền.');
 $target=one('SELECT id,admin_level FROM users WHERE id=? AND active=1',[$id]);if(!$target)throw new RuntimeException('Không tìm thấy tài khoản.');
 if($target['admin_level']==='SUPER_ADMIN' && $level!=='SUPER_ADMIN'){
  $c=one("SELECT COUNT(*) n FROM users WHERE admin_level='SUPER_ADMIN' AND active=1");if((int)$c['n']<=1)throw new RuntimeException('Không được gỡ quyền Super Admin cuối cùng.');
 }
 exec_sql('UPDATE users SET role=?,admin_level=? WHERE id=?',[$level==='NONE'?'user':'admin',$level,$id]);
 log_action((int)$u['id'],'set_admin','target='.$id.' level='.$level);flash('Đã thay đổi quyền.');redirect('admin_admins');
}
if($action==='save_smtp'){
 must_can($u,'smtp');
 foreach(['smtp_host','smtp_port','smtp_user','smtp_from','smtp_from_name'] as $key){$v=trim((string)($_POST[$key]??''));
  if(!$v||strlen($v)>200)throw new RuntimeException('Thiếu '.$key);if($key==='smtp_port'&&(!ctype_digit($v)||!in_array((int)$v,[465,587],true)))throw new RuntimeException('Chỉ cho phép SMTP TLS/STARTTLS 465 hoặc 587.');
  if($key==='smtp_from'&&!filter_var($v,FILTER_VALIDATE_EMAIL))throw new RuntimeException('Email người gửi không hợp lệ.');
  exec_sql('INSERT INTO portal_settings(setting_key,setting_value,updated_by) VALUES(?,?,?) ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value),updated_by=VALUES(updated_by)',[$key,$v,$u['id']]);
 }
 if(!empty($_POST['smtp_password'])){exec_sql('INSERT INTO portal_settings(setting_key,setting_value,updated_by) VALUES(?,?,?) ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value),updated_by=VALUES(updated_by)',
  ['smtp_pass_encrypted',secret_encode((string)$_POST['smtp_password']),$u['id']]);}
 log_action((int)$u['id'],'save_smtp');flash('Đã lưu SMTP, mật khẩu ứng dụng được mã hóa trong CSDL.');redirect('admin_smtp');
}
if($action==='test_smtp'){
 must_can($u,'smtp');$to=strtolower(trim((string)($_POST['to']??'')));
 if(!validate_student_email($to))throw new RuntimeException('Chỉ gửi thử đến email sinh viên hợp lệ.');
 send_portal_email($to,'Kiểm tra SMTP PTIT Youth Portal','Thư kiểm tra cấu hình SMTP. Nếu nhận được, máy chủ gửi thư đang hoạt động.');flash('Đã gửi email thử.');redirect('admin_smtp');
}
if($action==='add_block'){
 must_can($u,'security');$kind=(string)($_POST['kind']??'');$identity=trim((string)($_POST['identity']??''));
 $reason=trim((string)($_POST['reason']??''));if(mb_strlen($reason)<4||mb_strlen($reason)>255)throw new RuntimeException('Lý do 4–255 ký tự.');
 if($kind==='ip_hash'){if(!preg_match('/^[a-f0-9]{64}$/D',$identity))throw new RuntimeException('Mã băm IP không hợp lệ.');$hash=$identity;$kind='ip';}
 elseif($kind==='ip'){if(!filter_var($identity,FILTER_VALIDATE_IP))throw new RuntimeException('IP không hợp lệ.');$hash=hash_hmac('sha256',$identity,hex2bin(conf('app_key')));}
 elseif($kind==='device'){if(!preg_match('/^[a-f0-9]{64}$/D',$identity))throw new RuntimeException('Mã thiết bị phải là băm 64 ký tự hex.');$hash=$identity;}
 else throw new RuntimeException('Loại chặn không hợp lệ.');
 if(($kind==='ip'&&hash_equals($hash,client_ip_hash()))||($kind==='device'&&hash_equals($hash,(string)client_device_hash())))throw new RuntimeException('Không thể tự chặn IP hoặc thiết bị đang đăng nhập.');
 $date=trim((string)($_POST['expires_at']??''));$expires=$date?safe_time($date):null;
 exec_sql('INSERT INTO access_blocks(kind,identity_hash,reason,expires_at,created_by) VALUES(?,?,?,?,?) ON DUPLICATE KEY UPDATE reason=VALUES(reason),expires_at=VALUES(expires_at)',[$kind,$hash,$reason,$expires,$u['id']]);
 log_action((int)$u['id'],'add_block',$kind.' '.$hash);flash('Đã thêm hạn chế.');redirect('admin_blocks');
}
if($action==='remove_block'){
 must_can($u,'security');$id=(int)($_POST['id']??0);exec_sql('DELETE FROM access_blocks WHERE id=?',[$id]);log_action((int)$u['id'],'remove_block','id='.$id);flash('Đã gỡ chặn.');redirect('admin_blocks');
}
throw new RuntimeException('Hành động V7 chưa xác định.');
