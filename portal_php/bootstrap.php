<?php
declare(strict_types=1);
if (session_status() !== PHP_SESSION_ACTIVE) {
 session_name('doan_sid');
 session_set_cookie_params(['lifetime'=>0,'path'=>'/','secure'=>!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off','httponly'=>true,'samesite'=>'Lax']);
 session_start();
}
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: strict-origin-when-cross-origin');
header("Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'");
if (!is_file(__DIR__.'/config.php')) { http_response_code(503); exit('Hãy sao chép config.example.php thành config.php và cấu hình cơ sở dữ liệu.'); }
$cfg=require __DIR__.'/config.php';
date_default_timezone_set((string)($cfg['timezone']??'Asia/Ho_Chi_Minh'));
if (($cfg['require_https']??false) && (empty($_SERVER['HTTPS']) || $_SERVER['HTTPS']==='off') && !(isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO']==='https')) { http_response_code(403); exit('Yêu cầu kết nối HTTPS'); }
if (!preg_match('/^[a-f0-9]{64}$/i', $cfg['app_key']??'')) { http_response_code(503); exit('Chưa cấu hình app_key 64 ký tự hex.'); }
try {$pdo=new PDO('mysql:host='.$cfg['db_host'].';dbname='.$cfg['db_name'].';charset=utf8mb4',$cfg['db_user'],$cfg['db_pass'],[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC,PDO::ATTR_EMULATE_PREPARES=>false]);}catch(Throwable $e){http_response_code(503);exit('Không kết nối được cơ sở dữ liệu.');}
$pdo->exec("SET time_zone = '".date('P')."'");
function db(): PDO {global $pdo;return $pdo;}
function conf(string $key,$default=null){global $cfg;return $cfg[$key]??$default;}
function e($v): string{return htmlspecialchars((string)($v??''),ENT_QUOTES|ENT_SUBSTITUTE,'UTF-8');}
function csrf(): string {return $_SESSION['csrf']??=bin2hex(random_bytes(24));}
function verify_csrf(): void {if(!hash_equals(csrf(),(string)($_POST['_csrf']??''))) throw new RuntimeException('Phiên biểu mẫu không hợp lệ.');}
function me(): ?array {if(empty($_SESSION['uid'])) return null; $q=db()->prepare('SELECT * FROM users WHERE id=? AND active=1');$q->execute([$_SESSION['uid']]);return $q->fetch()?:null;}
function require_user(): array {$u=me();if(!$u){header('Location: index.php?page=login');exit;}return $u;}
function require_admin(): array {$u=require_user();if($u['role']!=='admin'){http_response_code(403);exit('Không có quyền truy cập');}return $u;}
function redirect(string $page): never {header('Location: index.php?page='.rawurlencode($page));exit;}
function flash(string $msg,string $kind='ok'): void {$_SESSION['flash']=['message'=>$msg,'kind'=>$kind];}
function log_action(?int $actor,string $action,string $details=''): void {$q=db()->prepare('INSERT INTO audit_logs(actor_id,action,details) VALUES(?,?,?)');$q->execute([$actor,$action,$details]);}
function limit_check(string $bucket,int $max=6,int $seconds=900): bool {
 $bucket=hash('sha256',$bucket);
 $q=db()->prepare('SELECT * FROM rate_limits WHERE bucket=?');$q->execute([$bucket]);$r=$q->fetch();
 if(!$r || strtotime($r['reset_at'])<time()){$q=db()->prepare('INSERT INTO rate_limits(bucket,count,reset_at) VALUES(?,1,DATE_ADD(NOW(), INTERVAL ? SECOND)) ON DUPLICATE KEY UPDATE count=1,reset_at=DATE_ADD(NOW(), INTERVAL ? SECOND)');$q->execute([$bucket,$seconds,$seconds]);return true;}
 if($r['count']>=$max)return false;
 db()->prepare('UPDATE rate_limits SET count=count+1 WHERE bucket=?')->execute([$bucket]);return true;
}
function student_email(string $mssv):string{return strtolower($mssv).'@student.ptithcm.edu.vn';}
function validate_student_email(string $email):bool{return (bool)preg_match('/^n[0-9]{2}[a-z0-9]{4,20}@student\.ptithcm\.edu\.vn$/i',$email);}
function public_url():string{return rtrim((string)conf('base_url'),'/').'/index.php';}
function upload_image(string $field):string {
 if(!isset($_FILES[$field]) || $_FILES[$field]['error']!==UPLOAD_ERR_OK)throw new RuntimeException('Không thể tải ảnh lên.');
 $f=$_FILES[$field];if($f['size']>5*1024*1024)throw new RuntimeException('Ảnh tối đa 5 MB.');
 $mime=(new finfo(FILEINFO_MIME_TYPE))->file($f['tmp_name']);$ext=['image/jpeg'=>'jpg','image/png'=>'png','image/webp'=>'webp'][$mime]??null;
 if(!$ext || !@getimagesize($f['tmp_name']))throw new RuntimeException('Chỉ nhận ảnh JPG, PNG, WEBP hợp lệ.');
 $file=bin2hex(random_bytes(18)).'.'.$ext;
 $dir=__DIR__.'/storage/uploads';
 if(!is_dir($dir)&&!@mkdir($dir,0750,true)&&!is_dir($dir))throw new RuntimeException('Không thể tạo thư mục lưu ảnh; kiểm tra quyền ghi storage.');
 if(!is_writable($dir))throw new RuntimeException('Thư mục lưu ảnh không có quyền ghi.');
 if(!move_uploaded_file($f['tmp_name'],$dir.'/'.$file))throw new RuntimeException('Không lưu được ảnh.');
 return $file;
}
function safe_time(string $v):string { $d=DateTimeImmutable::createFromFormat('!Y-m-d\TH:i',$v);if(!$d || $d->format('Y-m-d\TH:i')!==$v)throw new RuntimeException('Ngày giờ không hợp lệ.');return $d->format('Y-m-d H:i:s');}
require_once __DIR__.'/app/services/QrService.php';
function require_pin(array $user,string $pin):void {if(!$user['pin_hash'] || !password_verify($pin,$user['pin_hash']))throw new RuntimeException('Mã PIN không đúng.');}
