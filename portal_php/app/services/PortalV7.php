<?php
declare(strict_types=1);
// The helper functions are called only after bootstrap has created a PDO connection.
function pref(string $key,?string $default=null):?string {
 static $memo=[]; if(array_key_exists($key,$memo)) return $memo[$key];
 try {$v=db()->prepare('SELECT setting_value FROM portal_settings WHERE setting_key=?');$v->execute([$key]);$s=$v->fetchColumn();}
 catch(Throwable $e){$s=false;}
 return $memo[$key]=$s===false?($default??conf($key)):((string)$s);
}
function secret_encode(string $plaintext):string {
 $iv=random_bytes(12); $tag=''; $key=hash('sha256',hex2bin(conf('app_key')),true);
 $cipher=openssl_encrypt($plaintext,'aes-256-gcm',$key,OPENSSL_RAW_DATA,$iv,$tag);
 if($cipher===false)throw new RuntimeException('Lỗi mã hóa cài đặt.');return 'gcm:'.base64_encode($iv.$tag.$cipher);
}
function secret_decode(?string $cipher):string {
 if(!$cipher)return '';if(!str_starts_with($cipher,'gcm:'))return '';
 $raw=base64_decode(substr($cipher,4),true);if($raw===false||strlen($raw)<29)return '';
 $key=hash('sha256',hex2bin(conf('app_key')),true);
 return openssl_decrypt(substr($raw,28),'aes-256-gcm',$key,OPENSSL_RAW_DATA,substr($raw,0,12),substr($raw,12,16))?:'';
}
function admin_level(array $u):string {return (string)($u['admin_level']??'NONE');}
function admin_can(array $u,string $what):bool {
 if(($u['role']??'user')!=='admin')return false;
 $level=admin_level($u);
 $map=['ANALYST'=>['visits','reports'], 'MODERATOR'=>['visits','reports','feedback','notices','review','events'],
 'ADMIN'=>['visits','reports','feedback','notices','review','events','users','tasks','elections','rules','modules','ocr'],
 'SUPER_ADMIN'=>['visits','reports','feedback','notices','review','events','users','tasks','elections','rules','modules','ocr','admins','smtp','terms','security']];
 return in_array($what,$map[$level]??[],true);
}
function must_can(array $u,string $what):void{if(!admin_can($u,$what))throw new RuntimeException('Không đủ quyền: '.$what);}
function visitor_ip():string {
 $remote=(string)($_SERVER['REMOTE_ADDR']??'unknown');$trusted=conf('trusted_proxy_ips',[]);
 if(is_array($trusted)&&in_array($remote,$trusted,true)){
  $cf=(string)($_SERVER['HTTP_CF_CONNECTING_IP']??'');
  if(filter_var($cf,FILTER_VALIDATE_IP))return $cf;
 }
 return $remote;
}
function client_ip_hash():string{return hash_hmac('sha256',visitor_ip(),hex2bin(conf('app_key')));}
function client_device_hash():?string {
 $cookie=(string)($_COOKIE['ptity_device']??'');
 if(!preg_match('/^[a-f0-9]{48}$/D',$cookie)){
  $cookie=bin2hex(random_bytes(24));$_COOKIE['ptity_device']=$cookie;setcookie('ptity_device',$cookie,['expires'=>time()+31536000,'path'=>'/','secure'=>!empty($_SERVER['HTTPS'])&&$_SERVER['HTTPS']!=='off','httponly'=>true,'samesite'=>'Lax']);
 }
 return hash_hmac('sha256',$cookie,hex2bin(conf('app_key')));
}
function enforce_client_block():void {
 $ip=client_ip_hash();$device=client_device_hash();
 // Expiry applies to both IP and device blocks.
 $s=db()->prepare('SELECT id FROM access_blocks WHERE ((kind=? AND identity_hash=?) OR (kind=? AND identity_hash=?)) AND (expires_at IS NULL OR expires_at>NOW()) LIMIT 1');
 $s->execute(['ip',$ip,'device',$device]);if($s->fetch()) {http_response_code(403);exit('Truy cập đã bị giới hạn. Liên hệ quản trị viên nếu cần hỗ trợ.');}
}
function collect_visit(string $page):void {
 if(!preg_match('/^[a-z_]{1,65}$/D',$page))return;
 $country='XX';if(conf('trust_cloudflare_country',false)&&in_array((string)($_SERVER['REMOTE_ADDR']??''),conf('trusted_proxy_ips',[]),true)){
  $c=(string)($_SERVER['HTTP_CF_IPCOUNTRY']??'XX');if(preg_match('/^[A-Z]{2}$/D',$c))$country=$c;
 }
 try { $s=db()->prepare('INSERT INTO visit_logs(ip_hash,device_hash,country,page,visitor_user_id) VALUES(?,?,?,?,?)');
 $s->execute([client_ip_hash(),client_device_hash(),$country,$page,$_SESSION['uid']??null]);}catch(Throwable $e){error_log('visit_log: '.$e->getMessage());}
}
function active_legal(string $kind):?array {
 $s=db()->prepare('SELECT * FROM legal_documents WHERE doc_type=? AND is_active=1 ORDER BY id DESC LIMIT 1');$s->execute([$kind]);return $s->fetch()?:null;
}
function score_rows(int $limit=100):array {
 // Each approved task counts once, and each attendance counts once. No manually editable score.
 $sql="SELECT u.id,u.full_name,u.student_id,u.avatar_path,u.class_number,
 COALESCE(ts.total,0) task_score,COALESCE(ev.total,0) event_score,
 COALESCE(ts.completed,0) tasks_done,COALESCE(ev.attended,0) events_done,
 COALESCE(ts.total,0)+COALESCE(ev.total,0) AS total
 FROM users u
 LEFT JOIN (SELECT s.user_id,SUM(t.points) total,COUNT(*) completed FROM (SELECT DISTINCT user_id,task_id FROM submissions WHERE status='passed') s JOIN tasks t ON t.id=s.task_id GROUP BY s.user_id) ts ON ts.user_id=u.id
 LEFT JOIN (SELECT a.user_id,SUM(e.points) total,COUNT(*) attended FROM attendances a JOIN events e ON e.id=a.event_id GROUP BY a.user_id) ev ON ev.user_id=u.id
 WHERE u.active=1 AND u.leaderboard_visible=1 ORDER BY total DESC,events_done DESC,student_id ASC LIMIT ".max(1,min(500,$limit));
 return db()->query($sql)->fetchAll();
}
function send_portal_email(string $to,string $subject,string $body):void {
 if(!filter_var($to,FILTER_VALIDATE_EMAIL))throw new RuntimeException('Email không hợp lệ.');
 $autoload=__DIR__.'/../../vendor/autoload.php';if(!is_file($autoload))throw new RuntimeException('Thiếu thư viện PHPMailer.');
 require_once $autoload;
 $m=new PHPMailer\PHPMailer\PHPMailer(true);$m->isSMTP();$m->Host=(string)pref('smtp_host');
 $m->Port=(int)pref('smtp_port','587');$m->SMTPAuth=true;$m->Username=(string)pref('smtp_user');
 $m->Password=secret_decode(pref('smtp_pass_encrypted'))?:conf('smtp_pass','');
 $m->SMTPSecure=$m->Port===465?PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS:PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
 $m->CharSet='UTF-8';$m->setFrom((string)pref('smtp_from'),(string)pref('smtp_from_name','Cổng Đoàn viên'));
 $m->addAddress($to);$m->Subject=$subject;$m->Body=$body;$m->send();
}
function v7_auth_complete(int $id):never {
 session_regenerate_id(true);$_SESSION['uid']=$id;unset($_SESSION['google_state'],$_SESSION['google_nonce'],$_SESSION['google_pending']);
 log_action($id,'google_login');$u=me();if($u && ($u['must_change']||!$u['pin_hash']))redirect('setup');redirect('home');
}
