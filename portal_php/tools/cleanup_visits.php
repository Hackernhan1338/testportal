<?php
// Cron-only visit retention: php tools/cleanup_visits.php
if(PHP_SAPI!=='cli'){http_response_code(403);exit;}
require dirname(__DIR__).'/lib.php';
$days=max(7,min(365,(int)(conf('visit_retention_days',90))));
$st=db()->prepare('DELETE FROM visit_logs WHERE visited_at < NOW() - INTERVAL ? DAY');
$st->execute([$days]);
echo 'Deleted: '.$st->rowCount().' older than '.$days.' days'.PHP_EOL;
