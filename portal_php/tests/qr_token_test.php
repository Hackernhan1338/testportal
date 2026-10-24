<?php
// Run: php tests/qr_token_test.php (does not require MySQL or HTTP)
declare(strict_types=1);
const KEY = 'f0e1d2c3b4a5968778695a4b3c2d1e0ff0e1d2c3b4a5968778695a4b3c2d1e0f';
function conf(string $key):string {return KEY;}
require dirname(__DIR__).'/app/services/QrService.php';
$token=qr_payload(123);
if(!validate_qr($token,123))throw new RuntimeException('Valid token failed.');
if(validate_qr($token,124))throw new RuntimeException('Wrong event accepted.');
if(validate_qr($token.'A',123))throw new RuntimeException('Tampered token accepted.');
if(validate_qr(qr_payload(123,intdiv(time(),120)-2),123))throw new RuntimeException('Expired token accepted.');
if(strlen($token)>65)throw new RuntimeException('QR too long.');
echo "QR HMAC test passed: ".$token.PHP_EOL;
