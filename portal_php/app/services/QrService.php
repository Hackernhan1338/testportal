<?php
/** HMAC QR: 120-second windows, 12-second boundary grace. */
// q2 uses 128-bit HMAC tag; previous window allowed for 12 seconds to avoid QR race at boundary.
function qr_payload(int $eventId, ?int $window=null):string {
 $window??=intdiv(time(),120);$body='q2.'.$eventId.'.'.$window;
 $sig=substr(hash_hmac('sha256',$body,hex2bin((string)conf('app_key')),true),0,16);
 return $body.'.'.rtrim(strtr(base64_encode($sig),'+/','-_'),'=');
}
function validate_qr(string $payload,int $eventId):bool {
 if(strlen($payload)>160)return false;
 if(preg_match('/^q2\.([0-9]+)\.([0-9]+)\.([A-Za-z0-9_-]{22})$/D',$payload,$m)){
  if((int)$m[1]!==$eventId)return false;$window=(int)$m[2];$now=intdiv(time(),120);
  if($window!==$now&&!($window===$now-1 && time()%120<12))return false;
  return hash_equals(qr_payload($eventId,$window),$payload);
 }
 // Still accept legacy tokens only for the current 2-minute window (upgrade compatibility).
 $a=explode(':',$payload);if(count($a)!==3||!ctype_digit($a[0])||!ctype_digit($a[1])||(int)$a[0]!==$eventId)return false;
 if((int)$a[1]!==intdiv(time(),120))return false;
 return hash_equals(hash_hmac('sha256',$a[0].':'.$a[1],hex2bin((string)conf('app_key'))),$a[2]);
}
