<?php
/** OCR queue: bounded HTTP work; no AI invocation on image-upload requests. */
declare(strict_types=1);
require_once dirname(__DIR__,2).'/lib.php';

function ocr_enqueue_submission(int $submissionId):void {
 exec_sql("INSERT INTO ocr_jobs(submission_id,status) VALUES(?,'queued') ON DUPLICATE KEY UPDATE
 status=IF(status IN('failed','skipped'),'queued',status),
 last_error=IF(status IN('failed','skipped'),NULL,last_error)",[$submissionId]);
}
function ocr_enqueue_all():int {
 // Include past uploads that never got an OCR result; unique key makes repeated queueing safe.
 $sql="INSERT INTO ocr_jobs(submission_id,status)
 SELECT s.id,'queued' FROM submissions s JOIN tasks t ON t.id=s.task_id
 LEFT JOIN ocr_jobs j ON j.submission_id=s.id
 WHERE t.category='card' AND s.image_path IS NOT NULL AND s.status NOT IN('passed','rejected')
 AND (s.extracted IS NULL OR JSON_LENGTH(s.extracted)=0)
 AND (j.id IS NULL OR j.status IN('failed','skipped'))
 ON DUPLICATE KEY UPDATE attempts=0,
 status=IF(ocr_jobs.status IN('failed','skipped'),'queued',ocr_jobs.status),
 next_attempt_at=NULL,last_error=NULL";
 db()->exec($sql);return db()->query("SELECT COUNT(*) FROM ocr_jobs WHERE status='queued'")->fetchColumn();
}
function ocr_retry_submission(int $submissionId):void {
 $s=one("SELECT s.id FROM submissions s JOIN tasks t ON t.id=s.task_id WHERE s.id=? AND t.category='card' AND s.image_path IS NOT NULL AND s.status NOT IN('passed','rejected')",[$submissionId]);
 if(!$s)throw new RuntimeException('Không thể quét lại ảnh không tồn tại hoặc đã duyệt/từ chối.');
 $job=one('SELECT status FROM ocr_jobs WHERE submission_id=?',[$submissionId]);
 if($job&&$job['status']==='processing')throw new RuntimeException('Ảnh hiện đang được OCR xử lý.');
 exec_sql("INSERT INTO ocr_jobs(submission_id,status,attempts) VALUES(?,'queued',0)
  ON DUPLICATE KEY UPDATE status='queued',attempts=0,lease_token=NULL,last_error=NULL,next_attempt_at=NULL",[$submissionId]);
}
function ocr_stats():array {
 $stats=['queued'=>0,'processing'=>0,'done'=>0,'failed'=>0,'skipped'=>0,'total'=>0];
 foreach(rows('SELECT status,COUNT(*) AS n FROM ocr_jobs GROUP BY status') as $r){$stats[$r['status']]=(int)$r['n'];$stats['total']+=(int)$r['n'];}
 return $stats;
}
function ocr_claim_next():?array {
 // Recover interrupted work only after a long lease; avoid two processes claiming the same job.
 db()->exec("UPDATE ocr_jobs SET status='queued',lease_token=NULL,next_attempt_at=NOW() WHERE status='processing' AND claimed_at < DATE_SUB(NOW(),INTERVAL 3 MINUTE)");
 $lease=bin2hex(random_bytes(16));
 $q=db()->prepare("UPDATE ocr_jobs SET status='processing',lease_token=?,attempts=attempts+1,claimed_at=NOW(),last_error=NULL
 WHERE status='queued' AND (next_attempt_at IS NULL OR next_attempt_at<=NOW()) ORDER BY id LIMIT 1");
 $q->execute([$lease]);if($q->rowCount()!==1)return null;
 return one("SELECT j.*,s.image_path,s.user_id,s.status AS submission_status,u.full_name,u.dob,u.student_id
 FROM ocr_jobs j JOIN submissions s ON s.id=j.submission_id JOIN users u ON u.id=s.user_id WHERE j.lease_token=?",[$lease]);
}
function ocr_run_next():array {
 $job=ocr_claim_next();if(!$job)return ['processed'=>false,'message'=>'Hàng đợi đã hết hoặc đang chờ lần thử lại.','stats'=>ocr_stats()];
 $id=(int)$job['id'];$lease=$job['lease_token'];$status='done';$error=null;$result=null;
 try{
  if($job['submission_status']==='passed'){ $status='skipped';$error='Ảnh đã được quản trị viên duyệt.'; }
  elseif(empty($job['image_path'])){ $status='skipped';$error='Bài nộp không có ảnh.'; }
  else{
   $path=dirname(__DIR__,2).'/storage/uploads/'.basename($job['image_path']);
   if(!is_file($path))throw new RuntimeException('Không tìm thấy ảnh trên máy chủ.');
   if(!conf('gemini_api_key'))throw new RuntimeException('Chưa thiết lập gemini_api_key trong config.php');
   $result=check_photo_ai($path,$job);
   if(empty($result['fields']))throw new RuntimeException($result['feedback']?:'AI chưa trích xuất được dữ liệu.');
  }
 }catch(Throwable $e){$error=mb_substr($e->getMessage(),0,500);$status='failed';}
 db()->beginTransaction();
 try{
  // Lease ownership prevents overwritten results after worker recovery.
  $active=one('SELECT id FROM ocr_jobs WHERE id=? AND lease_token=? AND status=\'processing\' FOR UPDATE',[$id,$lease]);
  if($active){
   if($result){exec_sql("UPDATE submissions SET extracted=?,status=IF(status='passed',status,'needs_review'),feedback=IF(status='passed',feedback,?) WHERE id=?",[
    json_encode($result['fields'],JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE),$result['feedback'],(int)$job['submission_id']]);}
   if($status==='failed'){
    exec_sql("UPDATE submissions SET status=IF(status='passed',status,'needs_review'), feedback=IF(status='passed',feedback,?) WHERE id=?",[
      'OCR chưa xử lý được: '.$error.'. Chờ cán bộ kiểm tra ảnh hoặc quét lại.',(int)$job['submission_id']]);
   }
   $retry=$status==='failed' && (int)$job['attempts']<2 && !str_contains((string)$error,'gemini_api_key');
   $final=$retry?'queued':$status;
   exec_sql("UPDATE ocr_jobs SET status=?,last_error=?,lease_token=NULL,processed_at=IF(?='done',NOW(),processed_at),next_attempt_at=IF(?='queued',DATE_ADD(NOW(),INTERVAL 45 SECOND),NULL) WHERE id=? AND lease_token=?",[$final,$error,$status,$final,$id,$lease]);
  }
  db()->commit();
 }catch(Throwable $e){db()->rollBack();throw $e;}
 return ['processed'=>true,'id'=>$id,'submission_id'=>(int)$job['submission_id'],'status'=>$status,'error'=>$error,'stats'=>ocr_stats()];
}
