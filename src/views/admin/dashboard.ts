import { store } from '../../store';
import { icon } from '../../components/icons';

export function renderAdminDashboard(): string {
  const students = store.getStudents();
  const tasks = store.getTasks().filter(t => t.active);
  const submissions = store.getSubmissions();
  const events = store.getEvents().filter(e => e.active);
  const attendances = store.getAttendances();
  const auditLogs = store.getAuditLogs();
  const settings = store.getSettings();

  // Compute exact real KPIs
  const totalStudents = students.length; // 71
  const totalOfficialMembers = students.filter(s => s.membership === 'member').length;
  const notJoinedMembers = students.filter(s => s.membership === 'not_joined').length;
  const cardsVerified = students.filter(s => s.card_verified_at && s.card_number).length;
  const pendingCards = submissions.filter(s => s.task_id === 1 && s.status === 'pending').length;
  const pendingSubmissions = submissions.filter(s => s.status === 'pending').length;
  const totalAttendances = attendances.length;

  return `
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Dashboard Trung tâm Điều hành</h1>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">Số liệu tổng hợp thời gian thực từ cơ sở dữ liệu 71 sinh viên Chi đoàn D26CQCN03-N</p>
      </div>
      <div class="flex items-center gap-2">
        <button type="button" class="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xs transition-colors" data-action="refresh-data">
          ${icon('refresh', 13)}
          <span>Làm mới số liệu</span>
        </button>
        <a data-nav="admin_qr" class="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer">
          ${icon('qr', 13)}
          <span>Chiếu QR Điểm danh (120s)</span>
        </a>
      </div>
    </div>

    <!-- 8 FocusBrain KPI Cards Grid with Tailwind -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mb-6">
      <!-- KPI 1 -->
      <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:shadow-sm transition-shadow">
        <span class="text-[10.5px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Tổng sinh viên</span>
        <strong class="font-mono text-2xl sm:text-3xl font-black text-slate-900 dark:text-white my-1">${totalStudents}</strong>
        <span class="text-[11px] text-slate-500 dark:text-slate-400">Danh sách gốc D26CQCN03-N</span>
      </div>

      <!-- KPI 2 -->
      <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:shadow-sm transition-shadow">
        <span class="text-[10.5px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Đoàn viên chính thức</span>
        <strong class="font-mono text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 my-1">${totalOfficialMembers}</strong>
        <span class="text-[11px] text-slate-500 dark:text-slate-400">Tỷ lệ: ${Math.round((totalOfficialMembers / totalStudents) * 100)}% sĩ số</span>
      </div>

      <!-- KPI 3 -->
      <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:shadow-sm transition-shadow">
        <span class="text-[10.5px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Chưa vào Đoàn</span>
        <strong class="font-mono text-2xl sm:text-3xl font-black text-amber-500 dark:text-amber-400 my-1">${notJoinedMembers}</strong>
        <span class="text-[11px] text-slate-500 dark:text-slate-400">Thanh niên phấn đấu vào Đoàn</span>
      </div>

      <!-- KPI 4 -->
      <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:shadow-sm transition-shadow">
        <span class="text-[10.5px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Thẻ Đoàn đã duyệt</span>
        <strong class="font-mono text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 my-1">${cardsVerified}</strong>
        <span class="text-[11px] text-slate-500 dark:text-slate-400">Đã cấp chứng nhận số hóa</span>
      </div>

      <!-- KPI 5 -->
      <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:shadow-sm transition-shadow">
        <span class="text-[10.5px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Thẻ chờ đối chiếu</span>
        <strong class="font-mono text-2xl sm:text-3xl font-black text-orange-500 dark:text-orange-400 my-1">${pendingCards}</strong>
        <span class="text-[11px] text-slate-500 dark:text-slate-400">Hồ sơ số thẻ gửi duyệt</span>
      </div>

      <!-- KPI 6 -->
      <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:shadow-sm transition-shadow">
        <span class="text-[10.5px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Nhiệm vụ đang mở</span>
        <strong class="font-mono text-2xl sm:text-3xl font-black text-slate-900 dark:text-white my-1">${tasks.length}</strong>
        <span class="text-[11px] text-slate-500 dark:text-slate-400">${pendingSubmissions} minh chứng chờ duyệt</span>
      </div>

      <!-- KPI 7 -->
      <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:shadow-sm transition-shadow">
        <span class="text-[10.5px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Lượt điểm danh</span>
        <strong class="font-mono text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 my-1">${totalAttendances}</strong>
        <span class="text-[11px] text-slate-500 dark:text-slate-400">${events.length} sự kiện hoạt động</span>
      </div>

      <!-- KPI 8 -->
      <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:shadow-sm transition-shadow">
        <span class="text-[10.5px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Chế độ OCR Thẻ</span>
        <strong class="font-mono text-xl sm:text-2xl font-black text-blue-700 dark:text-blue-300 uppercase my-1">${settings.ocr_mode}</strong>
        <span class="text-[11px] text-slate-500 dark:text-slate-400">Chính sách kiểm tra ảnh</span>
      </div>
    </div>

    <!-- 2 Column Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left 2 Cols: Pending Submissions & Events -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Submissions Queue -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
          <div class="px-5 py-3.5 bg-slate-50/80 dark:bg-slate-850/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h3 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              ${icon('card')}
              Thẻ Đoàn & Minh chứng cần xử lý (${pendingSubmissions})
            </h3>
            <a data-nav="admin_cards" class="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Quản lý thẻ</a>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs divide-y divide-slate-100 dark:divide-slate-800">
              <thead class="bg-slate-50/60 dark:bg-slate-850/60 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th class="px-4 py-3">Sinh viên</th>
                  <th class="px-4 py-3">MSSV</th>
                  <th class="px-4 py-3">Nhiệm vụ</th>
                  <th class="px-4 py-3">Số thẻ / Ghi chú</th>
                  <th class="px-4 py-3">Thời gian</th>
                  <th class="px-4 py-3 text-right">Xử lý</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                ${submissions.filter(s => s.status === 'pending').map(sub => `
                  <tr class="hover:bg-blue-50/30 dark:hover:bg-slate-750 transition-colors">
                    <td class="px-4 py-3 font-bold text-slate-900 dark:text-white">${sub.student_name}</td>
                    <td class="px-4 py-3 font-mono text-slate-600 dark:text-slate-300">${sub.user_id}</td>
                    <td class="px-4 py-3">
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        ${sub.task_title}
                      </span>
                    </td>
                    <td class="px-4 py-3 font-mono font-bold text-blue-700 dark:text-blue-400">
                      ${sub.extracted?.card_number || 'Chờ đối chiếu'}
                    </td>
                    <td class="px-4 py-3 font-mono text-slate-400 text-[11px]">${sub.submitted_at.substring(5, 16)}</td>
                    <td class="px-4 py-3 text-right">
                      <div class="inline-flex gap-1.5">
                        <button type="button" class="px-2.5 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors" data-action="quick-approve-sub" data-student-id="${sub.user_id}">
                          Duyệt
                        </button>
                        <button type="button" class="px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-slate-50 border border-slate-200 dark:border-slate-600 rounded-md transition-colors" data-action="quick-reject-sub" data-student-id="${sub.user_id}">
                          Từ chối
                        </button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
                ${submissions.filter(s => s.status === 'pending').length === 0 ? `
                  <tr>
                    <td colspan="6" class="p-8 text-center text-slate-400">
                      Tuyệt vời! Hiện tại không có bài nộp nào đang chờ duyệt.
                    </td>
                  </tr>
                ` : ''}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Events List -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
          <div class="px-5 py-3.5 bg-slate-50/80 dark:bg-slate-850/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h3 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              ${icon('events')}
              Sự kiện đang diễn ra & Trạng thái điểm danh
            </h3>
            <a data-nav="admin_events" class="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Tất cả sự kiện</a>
          </div>

          <div class="p-5 space-y-3">
            ${events.map(ev => {
              const count = attendances.filter(a => a.event_id === ev.id).length;
              return `
                <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/40 dark:bg-slate-850/40">
                  <div>
                    <strong class="text-sm font-bold text-slate-900 dark:text-white block mb-0.5">${ev.title}</strong>
                    <div class="text-xs text-slate-500 dark:text-slate-400">Địa điểm: ${ev.location} · Bắt đầu: <span class="font-mono text-slate-700 dark:text-slate-300 font-semibold">${ev.start_at}</span></div>
                  </div>
                  <div class="flex items-center gap-4">
                    <div class="text-right">
                      <span class="font-mono text-lg font-black text-emerald-600 dark:text-emerald-400">${count} / 71</span>
                      <span class="text-[10px] text-slate-400 block">có mặt</span>
                    </div>
                    <a data-nav="admin_qr" class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer">
                      ${icon('qr', 13)}
                      Chiếu QR
                    </a>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- Right Column: OCR Quick Switch & Audit Logs -->
      <div class="space-y-6">
        <!-- OCR Switch Card -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-xs">
          <div class="flex items-center justify-between mb-3">
            <strong class="text-xs font-bold text-slate-900 dark:text-white">Cấu hình nhanh OCR Thẻ:</strong>
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase">${settings.ocr_mode}</span>
          </div>

          <div class="grid grid-cols-3 gap-2">
            <button type="button" class="py-1.5 px-2 text-xs font-bold rounded-lg transition-colors ${settings.ocr_mode === 'off' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'}" data-action="set-ocr" data-mode="off">
              Tắt OCR
            </button>
            <button type="button" class="py-1.5 px-2 text-xs font-bold rounded-lg transition-colors ${settings.ocr_mode === 'optional' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'}" data-action="set-ocr" data-mode="optional">
              Tuỳ chọn
            </button>
            <button type="button" class="py-1.5 px-2 text-xs font-bold rounded-lg transition-colors ${settings.ocr_mode === 'required' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'}" data-action="set-ocr" data-mode="required">
              Bắt buộc
            </button>
          </div>
          <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed m-0">
            Khi bật OCR, hệ thống đối chiếu số thẻ; các trường khác để trống không làm trượt duyệt.
          </p>
        </div>

        <!-- Audit Logs Feed -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
          <div class="px-5 py-3.5 bg-slate-50/80 dark:bg-slate-850/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h3 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              ${icon('activity')}
              Nhật ký hệ thống gần đây
            </h3>
            <a data-nav="admin_audit" class="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Xem tất cả</a>
          </div>
          <div class="p-5 space-y-3.5 text-xs">
            ${auditLogs.slice(0, 6).map(log => `
              <div class="border-b border-slate-100 dark:border-slate-700/60 pb-3 last:border-0 last:pb-0">
                <div class="flex items-center justify-between mb-1">
                  <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">${log.action}</span>
                  <span class="font-mono text-[10px] text-slate-400">${log.timestamp.substring(11)}</span>
                </div>
                <strong class="text-slate-900 dark:text-white block font-semibold mb-0.5">${log.details}</strong>
                <span class="text-[10.5px] text-slate-400">Tác tử: ${log.actor} · IP: ${log.ip}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}
