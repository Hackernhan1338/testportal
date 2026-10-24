import { store } from '../store';
import { icon } from './icons';

export function renderSidebar(isAdminView: boolean): string {
  const u = store.getCurrentUser();
  const page = store.getCurrentPage();
  const notices = store.getNotices();
  const unreadCount = notices.filter(n => !n.read_by.includes(u.student_id)).length;
  const submissions = store.getSubmissions();
  const pendingSubmissions = submissions.filter(s => s.status === 'pending').length;

  if (isAdminView) {
    return `
      <aside class="yp-sidebar w-64 bg-slate-900 text-slate-200 flex flex-col shrink-0 sticky top-0 h-screen z-40 border-r border-slate-800 shadow-xl transition-transform duration-200" id="yp-sidebar">
        <!-- Brand Header -->
        <div class="h-16 px-4 flex items-center gap-3 border-b border-slate-800/80 bg-slate-950/40">
          <div class="w-9 h-9 rounded-xl bg-red-600 text-white font-black text-sm flex items-center justify-center shadow-md shadow-red-600/30">
            P
          </div>
          <div class="leading-tight">
            <strong class="text-sm font-extrabold text-white tracking-wide block">PTIT YOUTH ADMIN</strong>
            <span class="text-[10px] font-medium text-slate-400 block tracking-tight">FocusBrain v4.8.4 Architecture</span>
          </div>
        </div>

        <!-- Navigation Scroll Area -->
        <div class="flex-1 overflow-y-auto px-2.5 py-3 space-y-0.5 scrollbar-thin scrollbar-thumb-slate-800">
          <div class="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider px-3 pt-3 pb-1">TỔNG QUAN</div>
          <a class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${page === 'admin_dashboard' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-800/70'}" data-nav="admin_dashboard">
            <span class="w-4 h-4 flex items-center justify-center opacity-85">${icon('layout')}</span>
            <span>Dashboard Quản trị</span>
          </a>
          <a class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${page === 'admin_analytics' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-800/70'}" data-nav="admin_analytics">
            <span class="w-4 h-4 flex items-center justify-center opacity-85">${icon('barChart')}</span>
            <span>Analytics & Báo cáo</span>
          </a>
          <a class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${page === 'admin_visits' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-800/70'}" data-nav="admin_visits">
            <span class="w-4 h-4 flex items-center justify-center opacity-85">${icon('activity')}</span>
            <span>Web Visits Monitor</span>
          </a>

          <div class="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider px-3 pt-4 pb-1">ĐOÀN VIÊN (71 HỒ SƠ)</div>
          <a class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${page === 'admin_users' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-800/70'}" data-nav="admin_users">
            <span class="w-4 h-4 flex items-center justify-center opacity-85">${icon('users')}</span>
            <span>Danh sách sinh viên</span>
            <span class="ml-auto inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">71</span>
          </a>
          <a class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${page === 'admin_cards' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-800/70'}" data-nav="admin_cards">
            <span class="w-4 h-4 flex items-center justify-center opacity-85">${icon('card')}</span>
            <span>Xác minh Thẻ Đoàn</span>
            ${pendingSubmissions > 0 ? `<span class="ml-auto inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">${pendingSubmissions}</span>` : ''}
          </a>
          <a class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${page === 'admin_officers' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-800/70'}" data-nav="admin_officers">
            <span class="w-4 h-4 flex items-center justify-center opacity-85">${icon('user')}</span>
            <span>Cán bộ Đoàn Chi đoàn</span>
          </a>
          <a class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${page === 'admin_leaderboard' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-800/70'}" data-nav="admin_leaderboard">
            <span class="w-4 h-4 flex items-center justify-center opacity-85">${icon('award')}</span>
            <span>Bảng xếp hạng điểm</span>
          </a>

          <div class="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider px-3 pt-4 pb-1">HOẠT ĐỘNG & ĐIỂM DANH</div>
          <a class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${page === 'admin_tasks' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-800/70'}" data-nav="admin_tasks">
            <span class="w-4 h-4 flex items-center justify-center opacity-85">${icon('tasks')}</span>
            <span>Giao nhiệm vụ</span>
          </a>
          <a class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${page === 'admin_submissions' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-800/70'}" data-nav="admin_submissions">
            <span class="w-4 h-4 flex items-center justify-center opacity-85">${icon('fileText')}</span>
            <span>Duyệt ảnh minh chứng</span>
            ${pendingSubmissions > 0 ? `<span class="ml-auto inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">${pendingSubmissions}</span>` : ''}
          </a>
          <a class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${page === 'admin_ocr' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-800/70'}" data-nav="admin_ocr">
            <span class="w-4 h-4 flex items-center justify-center opacity-85">${icon('scan')}</span>
            <span>Trung tâm OCR Thẻ</span>
            <span class="ml-auto inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-slate-800 text-slate-300 border border-slate-700 uppercase">${store.getSettings().ocr_mode}</span>
          </a>
          <a class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${page === 'admin_events' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-800/70'}" data-nav="admin_events">
            <span class="w-4 h-4 flex items-center justify-center opacity-85">${icon('events')}</span>
            <span>Sự kiện & Hội thảo</span>
          </a>
          <a class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${page === 'admin_qr' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-800/70'}" data-nav="admin_qr">
            <span class="w-4 h-4 flex items-center justify-center opacity-85">${icon('qr')}</span>
            <span>Chiếu QR Điểm danh</span>
            <span class="ml-auto inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Live</span>
          </a>
          <a class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${page === 'admin_elections' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-800/70'}" data-nav="admin_elections">
            <span class="w-4 h-4 flex items-center justify-center opacity-85">${icon('vote')}</span>
            <span>Bầu cử Chi đoàn</span>
          </a>

          <div class="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider px-3 pt-4 pb-1">TRUYỀN THÔNG</div>
          <a class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${page === 'admin_notices' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-800/70'}" data-nav="admin_notices">
            <span class="w-4 h-4 flex items-center justify-center opacity-85">${icon('bell')}</span>
            <span>Thông báo điều hành</span>
          </a>
          <a class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${page === 'admin_feedback' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-800/70'}" data-nav="admin_feedback">
            <span class="w-4 h-4 flex items-center justify-center opacity-85">${icon('message')}</span>
            <span>Góp ý sinh viên</span>
          </a>
          <a class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${page === 'admin_terms' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-800/70'}" data-nav="admin_terms">
            <span class="w-4 h-4 flex items-center justify-center opacity-85">${icon('fileText')}</span>
            <span>Điều khoản & Nội dung</span>
          </a>

          <div class="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider px-3 pt-4 pb-1">VẬN HÀNH & BẢO MẬT</div>
          <a class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${page === 'admin_admins' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-800/70'}" data-nav="admin_admins">
            <span class="w-4 h-4 flex items-center justify-center opacity-85">${icon('users')}</span>
            <span>Quản trị Admin (RBAC)</span>
          </a>
          <a class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${page === 'admin_security' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-800/70'}" data-nav="admin_security">
            <span class="w-4 h-4 flex items-center justify-center opacity-85">${icon('shield')}</span>
            <span>Trung tâm Bảo mật</span>
          </a>
          <a class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${page === 'admin_blocks' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-800/70'}" data-nav="admin_blocks">
            <span class="w-4 h-4 flex items-center justify-center opacity-85">${icon('slash')}</span>
            <span>Chặn IP & Thiết bị</span>
          </a>
          <a class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${page === 'admin_smtp' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-800/70'}" data-nav="admin_smtp">
            <span class="w-4 h-4 flex items-center justify-center opacity-85">${icon('mail')}</span>
            <span>Cấu hình SMTP Mail</span>
          </a>
          <a class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${page === 'admin_modules' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-800/70'}" data-nav="admin_modules">
            <span class="w-4 h-4 flex items-center justify-center opacity-85">${icon('settings')}</span>
            <span>Module Control</span>
          </a>
          <a class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${page === 'admin_health' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-800/70'}" data-nav="admin_health">
            <span class="w-4 h-4 flex items-center justify-center opacity-85">${icon('heartPulse')}</span>
            <span>Health & Diagnostics</span>
          </a>
        </div>

        <!-- Sidebar Footer -->
        <div class="p-3 border-t border-slate-800 bg-slate-950/60">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span class="text-xs font-bold text-white truncate max-w-[130px]">${u.full_name}</span>
            </div>
            <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[9.5px] font-extrabold bg-red-600/30 text-red-300 border border-red-500/30">${u.admin_level || 'ADMIN'}</span>
          </div>
          <button type="button" class="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors" data-action="toggle-admin-mode">
            Chuyển về Không gian Đoàn viên
          </button>
        </div>
      </aside>
    `;
  }

  // User Workspace Sidebar
  return `
    <aside class="yp-sidebar w-64 bg-slate-900 text-slate-200 flex flex-col shrink-0 sticky top-0 h-screen z-40 border-r border-slate-800 shadow-xl transition-transform duration-200" id="yp-sidebar">
      <!-- Brand Header -->
      <div class="h-16 px-4 flex items-center gap-3 border-b border-slate-800/80 bg-slate-950/40">
        <div class="w-9 h-9 rounded-xl bg-blue-700 text-white font-black text-base flex items-center justify-center shadow-md shadow-blue-700/30">
          ★
        </div>
        <div class="leading-tight">
          <strong class="text-sm font-extrabold text-white tracking-wide block">CỔNG ĐOÀN VIÊN</strong>
          <span class="text-[10px] font-medium text-slate-400 block tracking-tight">Chi đoàn D26CQCN03-N</span>
        </div>
      </div>

      <!-- Navigation Scroll Area -->
      <div class="flex-1 overflow-y-auto px-2.5 py-3 space-y-0.5 scrollbar-thin scrollbar-thumb-slate-800">
        <div class="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider px-3 pt-3 pb-1">WORKSPACE CÁ NHÂN</div>
        <a class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${page === 'home' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-800/70'}" data-nav="home">
          <span class="w-4 h-4 flex items-center justify-center opacity-85">${icon('layout')}</span>
          <span>Tổng quan cá nhân</span>
        </a>
        <a class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${page === 'profile' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-800/70'}" data-nav="profile">
          <span class="w-4 h-4 flex items-center justify-center opacity-85">${icon('user')}</span>
          <span>Hồ sơ Đoàn viên</span>
        </a>
        <a class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${page === 'card' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-800/70'}" data-nav="card">
          <span class="w-4 h-4 flex items-center justify-center opacity-85">${icon('card')}</span>
          <span>Thẻ Đoàn viên điện tử</span>
          ${u.card_number ? '<span class="ml-auto inline-flex items-center px-1.5 py-0.5 rounded-full text-[9.5px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Đã có thẻ</span>' : '<span class="ml-auto inline-flex items-center px-1.5 py-0.5 rounded-full text-[9.5px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">Cần số thẻ</span>'}
        </a>
        <a class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${page === 'notifications' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-800/70'}" data-nav="notifications">
          <span class="w-4 h-4 flex items-center justify-center opacity-85">${icon('bell')}</span>
          <span>Trung tâm thông báo</span>
          ${unreadCount > 0 ? `<span class="ml-auto inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">${unreadCount}</span>` : ''}
        </a>

        <div class="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider px-3 pt-4 pb-1">HOẠT ĐỘNG & PHONG TRÀO</div>
        <a class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${page === 'tasks' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-800/70'}" data-nav="tasks">
          <span class="w-4 h-4 flex items-center justify-center opacity-85">${icon('tasks')}</span>
          <span>Nhiệm vụ & Minh chứng</span>
        </a>
        <a class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${page === 'events' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-800/70'}" data-nav="events">
          <span class="w-4 h-4 flex items-center justify-center opacity-85">${icon('events')}</span>
          <span>Sự kiện & Hội thảo</span>
        </a>
        <a class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${page === 'scan' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-800/70'}" data-nav="scan">
          <span class="w-4 h-4 flex items-center justify-center opacity-85">${icon('scan')}</span>
          <span>Quét QR Điểm danh</span>
        </a>
        <a class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${page === 'competitions' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-800/70'}" data-nav="competitions">
          <span class="w-4 h-4 flex items-center justify-center opacity-85">${icon('trophy')}</span>
          <span>Cuộc thi đã tham gia</span>
        </a>
        <a class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${page === 'leaderboard' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-800/70'}" data-nav="leaderboard">
          <span class="w-4 h-4 flex items-center justify-center opacity-85">${icon('award')}</span>
          <span>Bảng xếp hạng Đoàn viên</span>
        </a>
        <a class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${page === 'officers' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-800/70'}" data-nav="officers">
          <span class="w-4 h-4 flex items-center justify-center opacity-85">${icon('users')}</span>
          <span>Cán bộ Đoàn Chi đoàn</span>
        </a>
        <a class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${page === 'elections' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-800/70'}" data-nav="elections">
          <span class="w-4 h-4 flex items-center justify-center opacity-85">${icon('vote')}</span>
          <span>Bầu cử Ban Chấp hành</span>
        </a>

        <div class="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider px-3 pt-4 pb-1">TƯƠNG TÁC & BẢO MẬT</div>
        <a class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${page === 'feedback' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-800/70'}" data-nav="feedback">
          <span class="w-4 h-4 flex items-center justify-center opacity-85">${icon('message')}</span>
          <span>Góp ý xây dựng Chi đoàn</span>
        </a>
        <a class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${page === 'security' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-800/70'}" data-nav="security">
          <span class="w-4 h-4 flex items-center justify-center opacity-85">${icon('lock')}</span>
          <span>Bảo mật & Mã PIN</span>
        </a>
        <a class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${page === 'legal' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-800/70'}" data-nav="legal">
          <span class="w-4 h-4 flex items-center justify-center opacity-85">${icon('fileText')}</span>
          <span>Điều khoản & Bảo mật</span>
        </a>
      </div>

      <!-- Sidebar Footer -->
      <div class="p-3 border-t border-slate-800 bg-slate-950/60">
        <div class="flex items-center justify-between mb-2">
          <div class="truncate">
            <strong class="text-xs font-bold text-white block truncate">${u.full_name}</strong>
            <span class="font-mono text-[10px] text-slate-400">${u.student_id} · STT ${u.class_number}</span>
          </div>
          <span class="shrink-0 ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            ${u.position_title || 'Đoàn viên'}
          </span>
        </div>
        ${u.role === 'admin' ? `
          <button type="button" class="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors" data-action="toggle-admin-mode">
            Chuyển sang Trung tâm Quản trị
          </button>
        ` : ''}
      </div>
    </aside>
  `;
}
