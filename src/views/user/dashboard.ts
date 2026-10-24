import { store } from '../../store';
import { icon } from '../../components/icons';

export function renderUserDashboard(): string {
  const u = store.getCurrentUser();
  const tasks = store.getTasks().filter(t => t.active);
  const events = store.getEvents().filter(e => e.active);
  const notices = store.getNotices();
  const unreadNotices = notices.filter(n => !n.read_by.includes(u.student_id));
  const submissions = store.getSubmissions().filter(s => s.user_id === u.student_id);
  const myAttendances = store.getAttendances().filter(a => a.student_id === u.student_id);

  // Time-based greeting
  const hour = new Date().getHours();
  let greeting = 'Chào buổi sáng';
  if (hour >= 12 && hour < 18) greeting = 'Chào buổi chiều';
  else if (hour >= 18 || hour < 5) greeting = 'Chào buổi tối';

  // Calculate student leaderboard rank
  const allStudents = [...store.getStudents()].sort((a, b) => (b.points || 0) - (a.points || 0));
  const myRank = allStudents.findIndex(s => s.student_id === u.student_id) + 1;

  return `
    <!-- Hero Banner with Gradient -->
    <div class="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-blue-950 text-white p-6 sm:p-7 shadow-lg border border-slate-800 mb-6 relative overflow-hidden">
      <div class="absolute -right-10 -bottom-10 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div class="flex items-center gap-4 sm:gap-5">
          <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-800 p-0.5 shadow-md shadow-blue-500/20 flex items-center justify-center shrink-0">
            <span class="text-xl sm:text-2xl font-black text-white">${u.full_name.split(' ').pop()?.charAt(0) || 'U'}</span>
          </div>
          <div>
            <div class="text-xs font-bold text-blue-400 uppercase tracking-wider">
              ${greeting}, đồng chí
            </div>
            <h1 class="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
              ${u.full_name}
            </h1>
            <div class="flex items-center gap-2 text-xs text-slate-300 mt-1 flex-wrap">
              <span class="font-mono font-bold text-blue-200">${u.student_id}</span>
              <span>·</span>
              <span>STT ${u.class_number}</span>
              <span>·</span>
              <span>${u.class_name || 'D26CQCN03-N'}</span>
              <span>·</span>
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ${u.membership === 'not_joined' ? 'Chưa vào Đoàn' : u.position_title || 'Đoàn viên'}
              </span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="bg-slate-800/80 backdrop-blur-xs border border-slate-700/80 rounded-xl px-4 py-2.5 text-center min-w-[110px] shadow-xs">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Điểm Rèn Luyện</span>
            <strong class="font-mono text-2xl font-black text-amber-400 leading-tight block mt-0.5">${u.points || 0}</strong>
          </div>
          <div class="bg-slate-800/80 backdrop-blur-xs border border-slate-700/80 rounded-xl px-4 py-2.5 text-center min-w-[110px] shadow-xs">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Xếp Hạng Lớp</span>
            <strong class="font-mono text-2xl font-black text-white leading-tight block mt-0.5">#${myRank}</strong>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Shortcuts Grid -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      <a class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-xs hover:shadow-md hover:border-blue-500 transition-all cursor-pointer group" data-nav="card">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            ${icon('card', 20)}
          </div>
          <div class="truncate">
            <strong class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block truncate">Thẻ Đoàn viên</strong>
            <span class="text-[11px] text-slate-500 dark:text-slate-400">${u.card_number ? 'Đã cấp số thẻ' : 'Cập nhật ngay'}</span>
          </div>
        </div>
      </a>

      <a class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-xs hover:shadow-md hover:border-emerald-500 transition-all cursor-pointer group" data-nav="scan">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            ${icon('scan', 20)}
          </div>
          <div class="truncate">
            <strong class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block truncate">Điểm danh QR</strong>
            <span class="text-[11px] text-slate-500 dark:text-slate-400">Quét mã sự kiện</span>
          </div>
        </div>
      </a>

      <a class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-xs hover:shadow-md hover:border-amber-500 transition-all cursor-pointer group" data-nav="tasks">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            ${icon('tasks', 20)}
          </div>
          <div class="truncate">
            <strong class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block truncate">Nhiệm vụ</strong>
            <span class="text-[11px] text-slate-500 dark:text-slate-400">${tasks.length} hoạt động mở</span>
          </div>
        </div>
      </a>

      <a class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-xs hover:shadow-md hover:border-purple-500 transition-all cursor-pointer group" data-nav="leaderboard">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            ${icon('award', 20)}
          </div>
          <div class="truncate">
            <strong class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block truncate">Bảng xếp hạng</strong>
            <span class="text-[11px] text-slate-500 dark:text-slate-400">Top 71 sinh viên</span>
          </div>
        </div>
      </a>
    </div>

    <!-- 2 Columns Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left 2 Cols: Notices, Tasks & Events -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Urgent Notice Alert -->
        ${unreadNotices.length > 0 ? `
          <div class="rounded-xl border-l-4 border-l-red-600 bg-red-50/70 dark:bg-red-950/30 border border-red-200 dark:border-red-900 p-4 shadow-xs">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                ${icon('bell', 14)}
                Thông báo khẩn từ Chi đoàn (${unreadNotices.length} tin chưa đọc)
              </span>
              <a data-nav="notifications" class="text-xs font-semibold text-red-700 dark:text-red-400 hover:underline cursor-pointer">Xem tất cả →</a>
            </div>
            <strong class="text-sm font-bold text-slate-900 dark:text-white block mb-1">${unreadNotices[0].title}</strong>
            <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed m-0">${unreadNotices[0].body.substring(0, 150)}...</p>
          </div>
        ` : ''}

        <!-- Active Tasks -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
          <div class="px-5 py-3.5 bg-slate-50/80 dark:bg-slate-850/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h3 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              ${icon('tasks')}
              Nhiệm vụ cần thực hiện
            </h3>
            <a data-nav="tasks" class="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Xem tất cả</a>
          </div>

          <div class="p-5 space-y-3">
            ${tasks.map(t => {
              const sub = submissions.find(s => s.task_id === t.id);
              const isPassed = sub?.status === 'passed';
              const isPending = sub?.status === 'pending';

              return `
                <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/40 dark:bg-slate-850/40">
                  <div>
                    <div class="flex items-center gap-2 mb-1.5">
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[9.5px] font-bold ${t.category === 'card' ? 'bg-blue-50 text-blue-700 border border-blue-200' : t.category === 'competition' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-700 border border-slate-200'}">
                        ${t.category.toUpperCase()}
                      </span>
                      <strong class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">${t.title}</strong>
                    </div>
                    <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-2">${t.description}</p>
                    <div class="flex items-center gap-3 text-[11px] text-slate-400">
                      <span>Hạn: <b class="font-mono text-slate-600 dark:text-slate-300">${t.due_at.substring(0, 10)}</b></span>
                      <span>·</span>
                      <span class="text-amber-600 dark:text-amber-400 font-bold">+${t.points} điểm rèn luyện</span>
                    </div>
                  </div>

                  <div class="shrink-0 sm:text-right">
                    ${isPassed ? `
                      <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-300">✓ Đã đạt</span>
                    ` : isPending ? `
                      <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-300">⏳ Chờ duyệt</span>
                    ` : `
                      <a data-nav="tasks" class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer">
                        Nộp minh chứng
                      </a>
                    `}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Upcoming Events -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
          <div class="px-5 py-3.5 bg-slate-50/80 dark:bg-slate-850/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h3 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              ${icon('events')}
              Sự kiện & Hoạt động Chi đoàn
            </h3>
            <a data-nav="events" class="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Xem lịch</a>
          </div>

          <div class="p-5 space-y-3">
            ${events.map(ev => {
              const attended = myAttendances.find(a => a.event_id === ev.id);
              return `
                <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/40 dark:bg-slate-850/40">
                  <div>
                    <strong class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block mb-1">${ev.title}</strong>
                    <div class="text-xs text-slate-500 dark:text-slate-400 mb-1.5">${ev.location}</div>
                    <div class="text-[11px] text-slate-400">
                      Bắt đầu: <span class="font-mono text-slate-600 dark:text-slate-300 font-semibold">${ev.start_at}</span> · Thưởng: <b class="text-emerald-600 dark:text-emerald-400 font-bold">+${ev.points} điểm</b>
                    </div>
                  </div>
                  <div>
                    ${attended ? `
                      <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-300">✓ Đã điểm danh</span>
                    ` : `
                      <a data-nav="scan" class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer">
                        ${icon('scan', 13)}
                        Quét QR
                      </a>
                    `}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- Right Column: Quick Card & Activity History -->
      <div class="space-y-6">
        <!-- Quick Youth Union Card -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
          <div class="px-5 py-3.5 bg-slate-50/80 dark:bg-slate-850/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h3 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              ${icon('card')}
              Thẻ Đoàn viên của tôi
            </h3>
            <a data-nav="card" class="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Xem thẻ đầy đủ</a>
          </div>
          <div class="p-5">
            <div class="rounded-2xl bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 p-5 text-white shadow-md shadow-blue-800/20 mb-4 relative overflow-hidden">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <span class="text-[9px] font-black uppercase tracking-widest text-blue-200 block">TRUNG ƯƠNG ĐOÀN TNCS HỒ CHÍ MINH</span>
                  <span class="text-base font-black uppercase text-red-300 tracking-wider">THẺ ĐOÀN VIÊN</span>
                </div>
                <div class="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-xs text-amber-400">★</div>
              </div>

              <div class="text-sm font-black uppercase tracking-wide mb-3">${u.full_name}</div>
              <div class="flex justify-between items-end text-xs text-blue-100">
                <div>
                  <span class="text-[10px] text-blue-300 block">Số thẻ đoàn:</span>
                  <strong class="font-mono font-bold tracking-wider">${u.card_number || 'Chưa cập nhật'}</strong>
                </div>
                <span class="text-[11px] font-semibold text-blue-200">Chi đoàn ${u.class_name || 'D26CQCN03-N'}</span>
              </div>
            </div>

            <div class="flex items-center justify-between text-xs py-1">
              <span class="text-slate-500 dark:text-slate-400">Trạng thái xác thực:</span>
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${u.card_number ? 'bg-emerald-50 text-emerald-700 border border-emerald-300' : 'bg-amber-50 text-amber-700 border border-amber-300'}">
                ${u.card_number ? 'Đã xác minh' : 'Chờ số thẻ'}
              </span>
            </div>
          </div>
        </div>

        <!-- Activity History -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
          <div class="px-5 py-3.5 bg-slate-50/80 dark:bg-slate-850/80 border-b border-slate-200 dark:border-slate-700">
            <h3 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              ${icon('clock')}
              Lịch sử ghi nhận gần đây
            </h3>
          </div>
          <div class="p-5 space-y-3.5 text-xs">
            <div class="flex items-start gap-3">
              <span class="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
              <div>
                <strong class="text-slate-900 dark:text-white block font-bold">Khởi tạo tài khoản hệ thống</strong>
                <span class="text-slate-500 text-[11px]">Đã đồng bộ hồ sơ sinh viên STT ${u.class_number}</span>
              </div>
            </div>
            ${u.card_number ? `
              <div class="flex items-start gap-3">
                <span class="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
                <div>
                  <strong class="text-slate-900 dark:text-white block font-bold">Đã cấp Thẻ Đoàn số ${u.card_number}</strong>
                  <span class="text-slate-500 text-[11px]">Ban Chấp hành Chi đoàn đã xác nhận</span>
                </div>
              </div>
            ` : ''}
            <div class="flex items-start gap-3">
              <span class="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
              <div>
                <strong class="text-slate-900 dark:text-white block font-bold">Tích lũy ${u.points || 0} điểm rèn luyện</strong>
                <span class="text-slate-500 text-[11px]">Ghi nhận từ phong trào Đoàn và sinh hoạt</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
