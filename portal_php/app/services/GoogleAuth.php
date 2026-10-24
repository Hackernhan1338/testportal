<?php
// Google OAuth 2.0 Authorization Code + server-side ID token verification.
// Used only from index.php after main helpers load.
function google_redirect_uri():string {return rtrim((string)conf('base_url'),'/').'/google-callback.php';}
function google_start():never {
 if(!conf('google_client_id')||!conf('google_client_secret')){flash('Google OAuth chưa được cấu hình.','error');redirect('login');}
 $_SESSION['google_state']=bin2hex(random_bytes(24));$_SESSION['google_nonce']=bin2hex(random_bytes(24));
 $params=['client_id'=>conf('google_client_id'),'redirect_uri'=>google_redirect_uri(),'response_type'=>'code',
  'scope'=>'openid email profile','state'=>$_SESSION['google_state'],'nonce'=>$_SESSION['google_nonce'],
  'access_type'=>'online','prompt'=>'select_account','hd'=>'student.ptithcm.edu.vn'];
 header('Location: https://accounts.google.com/o/oauth2/v2/auth?'.http_build_query($params));exit;
}
function google_callback():never {
 $state=(string)($_GET['state']??'');$expected=(string)($_SESSION['google_state']??'');
 unset($_SESSION['google_state']);
 if(!$expected||!hash_equals($expected,$state)||empty($_GET['code'])){flash('Yêu cầu Google không hợp lệ hoặc hết hạn.','error');redirect('login');}
 $code=(string)$_GET['code'];if(strlen($code)>3000){flash('Mã OAuth bất thường.','error');redirect('login');}
 try {
  if(!function_exists('curl_init'))throw new RuntimeException('Server thiếu PHP cURL.');
  $ch=curl_init('https://oauth2.googleapis.com/token');curl_setopt_array($ch,[CURLOPT_POST=>true,CURLOPT_POSTFIELDS=>http_build_query([
   'code'=>$code,'client_id'=>conf('google_client_id'),'client_secret'=>conf('google_client_secret'),
   'redirect_uri'=>google_redirect_uri(),'grant_type'=>'authorization_code']),CURLOPT_RETURNTRANSFER=>true,
   CURLOPT_CONNECTTIMEOUT=>5,CURLOPT_TIMEOUT=>15]);$json=curl_exec($ch);$http=curl_getinfo($ch,CURLINFO_HTTP_CODE);curl_close($ch);
  $tokens=json_decode((string)$json,true);if($http!==200||empty($tokens['id_token']))throw new RuntimeException('Không đổi được mã Google thành token.');
  if(!is_file(__DIR__.'/../../vendor/autoload.php'))throw new RuntimeException('Chưa cài google/apiclient bằng Composer.');
  require_once __DIR__.'/../../vendor/autoload.php';
  $client=new Google_Client(['client_id'=>(string)conf('google_client_id')]);
  $claims=$client->verifyIdToken((string)$tokens['id_token']);
  if(!is_array($claims)||!hash_equals((string)($_SESSION['google_nonce']??''),(string)($claims['nonce']??'')))throw new RuntimeException('ID token hoặc nonce không hợp lệ.');
  unset($_SESSION['google_nonce']);
  $email=strtolower((string)($claims['email']??''));$sub=(string)($claims['sub']??'');
  if(!validate_student_email($email)||($claims['email_verified']??false)!==true||!$sub)throw new RuntimeException('Cần dùng email sinh viên hợp lệ đã được Google xác minh.');
  $person=one('SELECT * FROM users WHERE email=? AND active=1',[$email]);
  if(!$person)throw new RuntimeException('Email sinh viên chưa được quản trị viên cấp tài khoản.');
  if($person['google_sub'] && !hash_equals((string)$person['google_sub'],$sub))throw new RuntimeException('Email này đã liên kết tài khoản Google khác.');
  $clash=one('SELECT id FROM users WHERE google_sub=? AND id<>?',[$sub,$person['id']]);if($clash)throw new RuntimeException('Google đã được liên kết với hồ sơ khác.');
  // The email suffix by itself does not prove Google Workspace ownership.
  $authoritative=(($claims['hd']??'')==='student.ptithcm.edu.vn');
  if(!$authoritative && !$person['google_sub']){
   if(!limit_check('google_otp|'.$person['id'],3,3600))throw new RuntimeException('Vượt giới hạn mã xác minh.');
   $otp=(string)random_int(100000,999999);
   exec_sql('INSERT INTO google_email_challenges(user_id,token_hash,expires_at) VALUES(?,?,DATE_ADD(NOW(),INTERVAL 10 MINUTE))',[$person['id'],password_hash($otp,PASSWORD_DEFAULT)]);
   $_SESSION['google_pending']=['id'=>(int)$person['id'],'sub'=>$sub,'issued'=>time()];
   send_portal_email($email,'Xác minh liên kết Google','Mã xác nhận liên kết Google: '.$otp."\nCó hiệu lực trong 10 phút.");
   redirect('google_confirm');
  }
  if(!$person['google_sub'])exec_sql('UPDATE users SET google_sub=?,google_linked_at=NOW() WHERE id=?',[$sub,$person['id']]);
  v7_auth_complete((int)$person['id']);
 }catch(Throwable $error){error_log('Google OAuth: '.$error->getMessage());flash($error->getMessage(),'error');redirect('login');}
}
function google_confirm():never {
 $pending=$_SESSION['google_pending']??null;
 if(!$pending||($pending['issued']??0)<time()-600){flash('Phiên xác minh đã hết hạn.','error');redirect('login');}
 verify_csrf();if(!limit_check('google_confirm|'.$pending['id'].'|'.($_SERVER['REMOTE_ADDR']??''),7,900)){flash('Thử quá nhiều.','error');redirect('login');}
 $challenge=one('SELECT * FROM google_email_challenges WHERE user_id=? AND used_at IS NULL AND expires_at>NOW() ORDER BY id DESC LIMIT 1',[$pending['id']]);
 if(!$challenge||$challenge['attempts']>=5||!password_verify((string)($_POST['otp']??''),$challenge['token_hash'])){
  if($challenge)exec_sql('UPDATE google_email_challenges SET attempts=attempts+1 WHERE id=?',[$challenge['id']]);
  flash('OTP không đúng hoặc hết hạn.','error');redirect('google_confirm');
 }
 db()->beginTransaction();try{
 exec_sql('UPDATE google_email_challenges SET used_at=NOW() WHERE id=?',[$challenge['id']]);
 exec_sql('UPDATE users SET google_sub=?,google_linked_at=NOW() WHERE id=? AND (google_sub IS NULL OR google_sub=?)',[$pending['sub'],$pending['id'],$pending['sub']]);db()->commit();
 }catch(Throwable $e){db()->rollBack();flash('Không liên kết được Google.','error');redirect('login');}
 v7_auth_complete((int)$pending['id']);
}
