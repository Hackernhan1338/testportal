/* FocusBrain-style operations: safe batch scheduling + bounded workers. */
(()=>{
 const root=document.getElementById('ocr-console');if(!root)return;
 const csrf=root.dataset.csrf,base='index.php?page=ocr_api',stats=document.getElementById('ocr-stats'),activity=document.getElementById('ocr-activity');
 const enqueue=document.getElementById('ocr-enqueue'),start=document.getElementById('ocr-run'),stop=document.getElementById('ocr-stop');
 let active=false,completed=0,failures=0;
 async function api(op,post=false,extra={}){
  const opts={credentials:'same-origin',cache:'no-store',headers:{Accept:'application/json'}};
  if(post){opts.method='POST';opts.headers['Content-Type']='application/x-www-form-urlencoded;charset=UTF-8';opts.body=new URLSearchParams({_csrf:csrf,...extra}).toString();}
  const r=await fetch(base+'&op='+encodeURIComponent(op),opts);let j;try{j=await r.json();}catch{throw Error('Máy chủ không trả JSON. Kiểm tra PHP error log / migration SQL.');}if(!r.ok)throw Error(j.error||('HTTP '+r.status));return j;
 }
 function render(s){if(!s)return;stats.innerHTML=['queued','processing','done','failed','skipped'].map(k=>`<div class="ops-kpi"><b>${s[k]||0}</b><small>${{queued:'Đang chờ',processing:'Đang xử lý',done:'Đã đọc',failed:'Lỗi',skipped:'Bỏ qua'}[k]}</small></div>`).join('');}
 function log(message){const p=document.createElement('p');p.textContent=new Date().toLocaleTimeString('vi-VN')+' · '+message;activity.prepend(p);while(activity.children.length>25)activity.lastChild.remove();}
 async function readStats(){try{render((await api('state')).stats);}catch(e){log(e.message);}}
 enqueue?.addEventListener('click',async()=>{enqueue.disabled=true;try{const j=await api('queue',true);render(j.stats);log('Đã đưa bài nộp chưa quét vào hàng đợi.');}catch(e){log(e.message);}finally{enqueue.disabled=false;}});
 async function worker(){while(active){try{const j=await api('run',true);render(j.stats);if(!j.processed)break;completed++;if(j.status==='failed'){failures++;log('Bài #'+j.submission_id+': '+j.error);}else log('Bài #'+j.submission_id+': '+j.status);}
  catch(e){log('Lỗi worker: '+e.message);break;}}
 }
 start?.addEventListener('click',async()=>{if(active)return;active=true;completed=failures=0;start.disabled=true;stop.disabled=false;log('Đang xếp các ảnh cần OCR vào hàng đợi.');try{const q=await api('queue',true);render(q.stats);}catch(e){log('Không xếp hàng được: '+e.message);active=false;start.disabled=false;stop.disabled=true;return;}log('Bắt đầu chạy 2 worker song song. Có thể đóng trang, cron vẫn xử lý hàng đợi.');await Promise.all([worker(),worker()]);active=false;start.disabled=false;stop.disabled=true;log(`Kết thúc đợt: ${completed} bài, ${failures} lỗi. Cron tiếp tục xử lý nếu đã cấu hình.`);await readStats();});
 stop?.addEventListener('click',()=>{active=false;stop.disabled=true;log('Đã yêu cầu dừng sau khi hai tác vụ hiện tại kết thúc.');});
 document.addEventListener('click',async event=>{const button=event.target.closest('[data-ocr-retry]');if(!button)return;button.disabled=true;try{const j=await api('retry',true,{id:button.dataset.ocrRetry});render(j.stats);log('Đã yêu cầu quét lại bài #'+button.dataset.ocrRetry);}catch(e){log(e.message);}finally{button.disabled=false;}});
 readStats();setInterval(()=>{if(!document.hidden&&!active)readStats();},12000);
})();
