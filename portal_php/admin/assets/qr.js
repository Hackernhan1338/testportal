/* V6: local QR rendering, server-synchronised clock, no external QR CDN. */
(()=>{
 const root=document.getElementById('qr-settings');if(!root)return;
 const id=root.dataset.event,box=document.getElementById('qrcode'),counter=document.getElementById('countdown'),status=document.getElementById('qrstatus');
 const link=document.getElementById('qr-fallback');let token='',expiresAt=0,clockOffset=0,inflight=false,timer=null;
 async function refresh(){
  if(inflight)return;inflight=true;
  try{
   const r=await fetch(`index.php?page=qr_token&id=${encodeURIComponent(id)}`,{cache:'no-store',credentials:'same-origin',headers:{Accept:'application/json'}});
   const j=await r.json();if(!r.ok)throw Error(j.error||'Không tạo được QR.');
   clockOffset=j.server_now*1000-Date.now(); expiresAt=(j.expires_at)*1000;
   if(j.token!==token){if(!globalThis.FocusQR)throw Error('Thiếu thư viện QR nội bộ.');FocusQR.render(j.url,box);token=j.token;}
   if(link){link.href=j.url;link.textContent=j.url;} status.textContent='Đang hoạt động · mã đổi sau mỗi 2 phút';
  }catch(err){status.textContent=err.message; if(!token)box.textContent='Chưa thể tạo mã QR. Kiểm tra cấu hình/sự kiện.';}
  finally{inflight=false;}
 }
 function countdown(){const remain=Math.max(0,Math.ceil((expiresAt-Date.now()-clockOffset)/1000));counter.textContent=remain?`Đổi QR sau ${remain} giây`:'Đang đổi mã QR…';if(expiresAt && remain===0)refresh();}
 refresh();timer=setInterval(countdown,1000);setInterval(refresh,10000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
})();
