<?php
/** CLI cron entry point: php /absolute/path/tools/ocr_worker.php 5 */
declare(strict_types=1);
if(PHP_SAPI!=='cli'){http_response_code(403);exit;}
require_once dirname(__DIR__).'/app/services/OcrQueue.php';
$max=max(1,min(8,(int)($argv[1]??3)));
for($i=0;$i<$max;$i++){
 $r=ocr_run_next();if(!$r['processed'])break;
 echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE).'\n';
}
