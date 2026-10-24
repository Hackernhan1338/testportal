import { store } from '../../store';
import { icon } from '../../components/icons';

export function renderUserCard(): string {
  const u = store.getCurrentUser();
  const settings = store.getSettings();
  const submissions = store.getSubmissions();
  const cardSub = submissions.find(s => s.user_id === u.student_id && s.task_id === 1);
  const isApproved = !!u.card_number && (cardSub?.status === 'passed' || !!u.card_verified_at);
  const isPending = !!u.card_number && (!cardSub || cardSub.status === 'pending');
  const hasNotJoined = u.membership === 'not_joined';

  return `
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Thẻ Đoàn viên điện tử</h1>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">Mẫu thẻ số hóa chuẩn Trung ương Đoàn TNCS Hồ Chí Minh dành cho Chi đoàn D26CQCN03-N</p>
      </div>
      <div class="flex items-center gap-2">
        <button type="button" class="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xs transition-colors" onclick="window.print()">
          ${icon('fileText', 14)}
          <span>In thẻ điện tử</span>
        </button>
        <button type="button" class="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors" data-action="open-card-qr-modal">
          ${icon('qr', 14)}
          <span>Mã QR Xác minh thẻ</span>
        </button>
      </div>
    </div>

    ${hasNotJoined ? `
      <div class="rounded-xl border-l-4 border-l-amber-500 bg-amber-50/70 dark:bg-amber-950/30 p-4 border border-amber-200 dark:border-amber-900 mb-6 shadow-xs">
        <div class="flex items-start gap-3">
          <span class="text-amber-600 dark:text-amber-400 mt-0.5">${icon('alertCircle', 18)}</span>
          <div>
            <strong class="text-sm font-bold text-amber-900 dark:text-amber-300 block mb-0.5">Thông tin tổ chức: Chưa kết nạp Đoàn</strong>
            <p class="text-xs text-amber-800 dark:text-amber-400/90 leading-relaxed m-0">
              Hồ sơ ghi nhận đồng chí chưa vào Đoàn (thuộc diện thanh niên đang sinh hoạt và phấn đấu kết nạp). Đồng chí <b>không bắt buộc phải có số thẻ Đoàn viên</b> và không bị tính là lỗi hồ sơ.
            </p>
          </div>
        </div>
      </div>
    ` : ''}

    <!-- THIẾT KẾ THẺ ĐOÀN VIÊN CHUẨN BAN CHẤP HÀNH TRUNG ƯƠNG ĐOÀN (TAILWIND REPLICA) -->
    <div class="max-w-2xl mx-auto rounded-3xl bg-gradient-to-br from-white via-blue-50/40 to-blue-100/30 dark:from-slate-850 dark:via-slate-800 dark:to-blue-950/40 p-6 sm:p-8 border-[3.5px] border-blue-600 shadow-xl shadow-blue-900/10 relative overflow-hidden backdrop-blur-sm mb-8 transition-all">
      <!-- Watermark Backdrop Flag -->
      <div class="absolute -right-8 -bottom-8 w-64 h-64 opacity-5 pointer-events-none select-none">
        <svg viewBox="0 0 100 100" fill="currentColor" class="w-full h-full text-blue-900">
          <circle cx="50" cy="50" r="46"/>
        </svg>
      </div>

      <!-- Header Section -->
      <div class="text-center border-b-2 border-slate-200 dark:border-slate-700 pb-3 mb-6">
        <div class="flex justify-center items-center gap-2 mb-2">
          <!-- Huy hiệu Đoàn TNCS Hồ Chí Minh -->
          <svg width="40" height="40" viewBox="0 0 100 100" fill="none" class="drop-shadow-sm">
            <circle cx="50" cy="50" r="48" fill="#c92a2a"/>
            <circle cx="50" cy="50" r="42" fill="#ffffff"/>
            <circle cx="50" cy="50" r="37" fill="#15803d"/>
            <path d="M50 16 L59 34 L78 34 L63 45 L69 63 L50 51 L31 63 L37 45 L22 34 L41 34 Z" fill="#fbbf24"/>
            <circle cx="50" cy="50" r="14" fill="#dc2626"/>
            <path d="M50 42 L52 47 L57 47 L53 50 L55 55 L50 52 L45 55 L47 50 L43 47 L48 47 Z" fill="#fbbf24"/>
          </svg>
        </div>
        <div class="text-[11px] sm:text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
          TRUNG ƯƠNG ĐOÀN TNCS HỒ CHÍ MINH
        </div>
        <div class="text-2xl sm:text-3xl font-black uppercase tracking-wider text-red-600 dark:text-red-500 mt-1">
          THẺ ĐOÀN VIÊN
        </div>
      </div>

      <!-- Card Body Content: 2 Columns on desktop -->
      <div class="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-6 items-center">
        <!-- Left: Badge Avatar Box & Authority -->
        <div class="flex flex-col items-center text-center">
          <div class="w-36 h-36 rounded-2xl bg-gradient-to-b from-blue-600 via-blue-700 to-blue-900 p-1.5 shadow-md shadow-blue-600/30 flex items-center justify-center relative overflow-hidden">
            ${u.avatar_path ? `
              <img class="w-full h-full object-cover rounded-xl" src="${u.avatar_path}" alt="${u.full_name}" />
            ` : `
              <div class="w-full h-full rounded-xl bg-gradient-to-b from-blue-700 to-blue-950 flex flex-col items-center justify-center p-3 text-center">
                <div class="bg-blue-800/80 border border-blue-400/60 rounded-lg px-2 py-1.5 mb-2 w-full shadow-xs">
                  <span class="text-[8.5px] font-black tracking-wider text-white block uppercase">THANH NIÊN VIỆT NAM</span>
                  <span class="text-amber-400 text-sm leading-none">★</span>
                </div>
                <span class="text-[10px] text-blue-200 font-semibold">Ảnh Đoàn viên</span>
              </div>
            `}
          </div>

          <div class="text-[9.5px] font-extrabold text-slate-600 dark:text-slate-400 uppercase tracking-tight mt-3 leading-snug">
            BAN CHẤP HÀNH TRUNG ƯƠNG<br/>ĐOÀN TNCS HỒ CHÍ MINH
          </div>

          <div class="mt-2 text-center">
            <span class="text-[10px] text-slate-500 dark:text-slate-400 font-semibold block">Số thẻ đoàn viên:</span>
            <span class="font-mono text-sm sm:text-base font-extrabold text-blue-700 dark:text-blue-400 tracking-wider">
              ${u.card_number || 'CHƯA CẤP'}
            </span>
          </div>
        </div>

        <!-- Right: Information Fields -->
        <div class="space-y-2.5 text-xs sm:text-sm">
          <div class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 pb-1.5 border-b border-slate-200/60 dark:border-slate-700/60">
            <span class="font-semibold text-slate-500 dark:text-slate-400 min-w-[130px]">Họ và tên:</span>
            <strong class="text-sm sm:text-base font-extrabold uppercase text-slate-900 dark:text-white tracking-wide">${u.full_name}</strong>
          </div>

          <div class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 pb-1.5 border-b border-slate-200/60 dark:border-slate-700/60">
            <span class="font-semibold text-slate-500 dark:text-slate-400 min-w-[130px]">Ngày sinh:</span>
            <span class="font-mono font-bold text-slate-800 dark:text-slate-200">${u.dob ? u.dob.split('-').reverse().join('/') : 'Chưa cập nhật'}</span>
          </div>

          <div class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 pb-1.5 border-b border-slate-200/60 dark:border-slate-700/60">
            <span class="font-semibold text-slate-500 dark:text-slate-400 min-w-[130px]">Chức vụ:</span>
            <span class="font-bold text-slate-800 dark:text-slate-200">${u.position_title || 'Đoàn viên'}</span>
          </div>

          <div class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 pb-1.5 border-b border-slate-200/60 dark:border-slate-700/60">
            <span class="font-semibold text-slate-500 dark:text-slate-400 min-w-[130px]">Ngày vào đoàn:</span>
            <span class="font-mono font-bold text-slate-800 dark:text-slate-200">${u.joined_date ? u.joined_date.split('-').reverse().join('/') : 'Chưa ghi nhận'}</span>
          </div>

          <div class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 pb-1.5 border-b border-slate-200/60 dark:border-slate-700/60">
            <span class="font-semibold text-slate-500 dark:text-slate-400 min-w-[130px]">Nơi vào Đoàn:</span>
            <span class="text-slate-800 dark:text-slate-200 font-medium">${u.join_place || 'Trường THPT / Cơ sở Đoàn địa phương'}</span>
          </div>

          <div class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 pb-1.5 border-b border-slate-200/60 dark:border-slate-700/60">
            <span class="font-semibold text-slate-500 dark:text-slate-400 min-w-[130px]">Nơi cấp thẻ:</span>
            <span class="text-slate-800 dark:text-slate-200 font-medium">${u.issue_place || 'BCH Đoàn Học viện Công nghệ Bưu chính Viễn thông'}</span>
          </div>

          <div class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 pb-1.5 border-b border-slate-200/60 dark:border-slate-700/60">
            <span class="font-semibold text-slate-500 dark:text-slate-400 min-w-[130px]">Nơi sinh hoạt đoàn:</span>
            <span class="font-bold text-blue-700 dark:text-blue-400">${u.activity_unit || (u.class_name ? `Chi đoàn ${u.class_name}` : 'Chi đoàn D26CQCN03-N')}</span>
          </div>

          <div class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 pt-1">
            <span class="font-semibold text-slate-500 dark:text-slate-400 min-w-[130px]">Trạng thái xác minh:</span>
            <div>
              ${isApproved ? `
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  ✓ Hợp lệ · Đã xác minh chính thức
                </span>
              ` : isPending ? `
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  ⏳ Đang chờ cán bộ đối chiếu
                </span>
              ` : `
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700">
                  Chưa cập nhật số thẻ
                </span>
              `}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- BIỂU MẪU CẬP NHẬT THẺ ĐOÀN VIÊN (CHỈ BẮT BUỘC SỐ THẺ) -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden mb-6">
      <div class="px-5 py-3.5 bg-slate-50/80 dark:bg-slate-850/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <h3 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          ${icon('card')}
          Cập nhật thông tin & Đăng ký xác thực Thẻ Đoàn viên
        </h3>
        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
          Chế độ OCR: ${settings.ocr_mode.toUpperCase()}
        </span>
      </div>

      <div class="p-6">
        <div class="rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900 p-4 mb-6 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <strong class="font-bold text-blue-950 dark:text-blue-200 block mb-1">Quy định thẩm định thẻ:</strong>
          <ul class="list-disc list-inside space-y-1">
            <li><b>Chỉ bắt buộc nhập Số thẻ Đoàn viên</b> (gồm 8-16 chữ số được cấp bởi Trung ương Đoàn).</li>
            <li>Các trường Ngày vào Đoàn, Nơi vào Đoàn, Nơi cấp thẻ, Nơi sinh hoạt và Ảnh thẻ là <b>hoàn toàn không bắt buộc</b>.</li>
            ${settings.ocr_mode === 'required' ? `
              <li>Hệ thống đang bật chế độ <b>Bắt buộc tải ảnh và quét OCR</b>. Quét OCR chỉ đối chiếu số thẻ; các trường khác để trống không làm trượt duyệt.</li>
            ` : settings.ocr_mode === 'optional' ? `
              <li>Chế độ OCR đang ở mức <b>Tuỳ chọn</b>: Đoàn viên có thể tải ảnh để hệ thống hỗ trợ đọc số thẻ hoặc tự nhập bằng tay.</li>
            ` : `
              <li>Chế độ OCR hiện đang <b>Tắt</b>: Đoàn viên chỉ cần nhập số thẻ và gửi cán bộ chi đoàn đối chiếu sổ.</li>
            `}
          </ul>
        </div>

        <form id="card-update-form" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div>
            <label class="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              Số thẻ Đoàn viên <span class="text-red-500">* (Bắt buộc)</span>
            </label>
            <input type="text" id="card-num-input" value="${u.card_number || ''}" required placeholder="VD: 080208062693" class="font-mono w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs" />
            <span class="text-[11px] text-slate-400 mt-1 block">Nhập dãy số in trên thẻ Đoàn cứng hoặc ứng dụng Thanh niên Việt Nam.</span>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              Ngày vào Đoàn (Không bắt buộc)
            </label>
            <input type="date" id="card-date-input" value="${u.joined_date || ''}" class="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs" />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              Nơi vào Đoàn (Không bắt buộc)
            </label>
            <input type="text" id="card-place-input" value="${u.join_place || ''}" placeholder="VD: THPT Chuyên..." class="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs" />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              Nơi cấp thẻ (Không bắt buộc)
            </label>
            <input type="text" id="card-issue-input" value="${u.issue_place || ''}" placeholder="VD: BCH Đoàn Học viện..." class="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs" />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              Nơi sinh hoạt Đoàn (Không bắt buộc)
            </label>
            <input type="text" id="card-unit-input" value="${u.activity_unit || 'Chi đoàn D26CQCN03-N'}" class="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs" />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              Ảnh chụp thẻ ${settings.ocr_mode === 'required' ? '<span class="text-red-500">* (Bắt buộc theo OCR)</span>' : '(Tuỳ chọn)'}
            </label>
            <input type="file" id="card-file-input" accept="image/*" class="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-slate-700 dark:file:text-slate-200 cursor-pointer" />
          </div>

          <div class="col-span-full flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-700/60">
            <button type="submit" class="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors">
              ${icon('check', 14)}
              Lưu thông tin & Gửi xét duyệt
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL QR TRA CỨU & XÁC MINH (CHỈ ADMIN MỚI ĐƯỢC XEM KẾT QUẢ) -->
    <div id="card-qr-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs" style="display: none;">
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-md overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h3 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            ${icon('qr')}
            Mã QR Xác minh Thẻ Đoàn viên
          </h3>
          <button type="button" class="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" data-action="close-card-qr-modal">✕</button>
        </div>

        <div class="p-6 text-center">
          <div class="bg-white p-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-600 inline-block mb-4 shadow-xs">
            <canvas id="card-qr-code" class="w-48 h-48 mx-auto block"></canvas>
          </div>

          <div class="font-mono text-xs font-bold text-blue-700 dark:text-blue-400 mb-1">
            SIGN: PTIT-${u.student_id}-${(u.card_number || '000').slice(-6)}
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Mã QR mã hóa chữ ký điện tử liên kết với Đoàn viên <b>${u.full_name} (${u.student_id})</b>.
          </p>

          <div class="rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 p-3.5 text-left text-xs text-rose-800 dark:text-rose-300 leading-relaxed mb-4">
            <strong>BẢO MẬT & PHÂN QUYỀN TRUY CẬP:</strong><br/>
            Chế độ quét mã QR xem thông tin Đoàn viên <b>chỉ dành riêng cho Quản trị viên / Cán bộ Đoàn</b>. Người dùng thông thường hoặc sinh viên khác khi quét sẽ bị hệ thống từ chối truy cập.
          </div>

          <!-- Interactive Test Scan Section -->
          <div class="rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 p-4 text-left">
            <div class="flex items-center justify-between mb-2">
              <strong class="text-xs font-bold text-slate-800 dark:text-slate-200">Mô phỏng máy quét QR thẻ:</strong>
              <button type="button" id="simulate-scan-btn" class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors">
                ${icon('scan', 12)}
                Quét mã này ngay
              </button>
            </div>
            <div id="scan-result-box" class="text-xs mt-3" style="display: none;"></div>
          </div>
        </div>

        <div class="px-5 py-3 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-700 flex justify-end">
          <button type="button" class="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xs transition-colors" data-action="close-card-qr-modal">
            Đóng
          </button>
        </div>
      </div>
    </div>
  `;
}
