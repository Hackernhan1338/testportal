/* QR camera scanner: built-in BarcodeDetector first, external library optional;
 * the native phone camera can also open the QR URL without this page. */
(()=>{
 const container=document.getElementById('scanner'),status=document.getElementById('scan-status');if(!container)return;
 const tokenInput=document.getElementById('qr-token'),eventInput=document.getElementById('event_id');
 let running=false,stream=null,detector=null,frame=0,video=null,html5=null;
 function setStatus(message){if(status)status.textContent=message;}
 function accept(text){
  try{
   const url=new URL(text,location.href);
   if(url.origin!==location.origin)throw Error('QR không thuộc tên miền cổng Đoàn viên này.');
   const eid=url.searchParams.get('event'),token=url.searchParams.get('token');
   if(!eid||!/^[0-9]+$/.test(eid)||!token||token.length>160)throw Error('QR sai định dạng.');
   eventInput.value=eid;tokenInput.value=token;
   setStatus('Đã đọc mã. Nhấn “Xác nhận điểm danh” để hoàn tất.');stop();
  }catch(err){setStatus(err.message||'Mã QR không hợp lệ.');}
 }
 async function stop(){running=false; if(frame)cancelAnimationFrame(frame);if(stream)stream.getTracks().forEach(t=>t.stop());stream=null;if(html5){try{await html5.stop();}catch(_){}html5=null;}if(video)video.remove();video=null;}
 async function scanNative(){
  detector=new BarcodeDetector({formats:['qr_code']});
  stream=await navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:{ideal:'environment'}}});
  video=document.createElement('video');video.setAttribute('playsinline','');video.muted=true;video.autoplay=true;video.srcObject=stream;container.appendChild(video);await video.play();running=true;
  let previous=0;
  async function tick(now){if(!running)return;if(now-previous>180){previous=now;try{const codes=await detector.detect(video);if(codes?.[0]?.rawValue){accept(codes[0].rawValue);return;}}catch(_){} } frame=requestAnimationFrame(tick);}
  frame=requestAnimationFrame(tick);
 }
 async function start(){
  if(!window.isSecureContext){setStatus('Camera yêu cầu HTTPS. Hãy mở liên kết bằng ứng dụng Camera điện thoại hoặc nhập mã thủ công.');return;}
  if(!navigator.mediaDevices?.getUserMedia){setStatus('Trình duyệt không hỗ trợ camera. Có thể dùng Camera điện thoại để mở QR.');return;}
  try{
   if('BarcodeDetector' in window)await scanNative();
   else if(typeof Html5Qrcode!=='undefined'){
    html5=new Html5Qrcode('scanner');await html5.start({facingMode:'environment'},{fps:10,qrbox:{width:240,height:240}},accept,()=>{});
   }else setStatus('Thiếu thư viện quét trên trình duyệt. Hãy dùng Camera điện thoại để mở mã QR trực tiếp.');
  }catch(err){setStatus('Không mở được camera: '+(err.message||err.name)+'. Kiểm tra quyền camera và HTTPS.');}
 }
 const button=document.getElementById('start-scanner');if(button)button.addEventListener('click',()=>{button.disabled=true;start().finally(()=>{button.disabled=false;});});
 const paste=document.getElementById('scan-paste');if(paste)paste.addEventListener('click',()=>accept(tokenInput.value));
 window.addEventListener('pagehide',stop);
 if(new URLSearchParams(location.search).has('token'))setStatus('Đã mở liên kết QR. Nhấn Xác nhận điểm danh, không cần bật camera.');
})();
