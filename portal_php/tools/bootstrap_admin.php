<?php
// CLI ONLY: php tools/bootstrap_admin.php N26DCCN185 2008-03-13
if(PHP_SAPI!=='cli'){http_response_code(403);exit;}
require dirname(__DIR__).'/lib.php';
$sid=strtoupper($argv[1]??'');$dob=$argv[2]??'';
if(!validate_student_email(student_email($sid))||!DateTimeImmutable::createFromFormat('!Y-m-d',$dob)){exit("Cú pháp: php tools/bootstrap_admin.php N26DCCN185 2008-03-13\n");}
$user=one('SELECT * FROM users WHERE student_id=?',[$sid]);
if(!$user){exit("MSSV chưa có trong cơ sở dữ liệu. Nhập seed trước.\n");}
exec_sql('UPDATE users SET dob=?,pass_hash=?,must_change=1,role=? WHERE id=?',[$dob,password_hash(date('dmY',strtotime($dob)),PASSWORD_DEFAULT),'admin',$user['id']]);echo "Đã thiết lập quản trị viên; bắt buộc đổi mật khẩu sau đăng nhập.\n";
