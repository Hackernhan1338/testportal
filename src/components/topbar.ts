import { store } from '../store';
import { icon } from './icons';

export function renderTopbar(isAdminView: boolean): string {
  const u = store.getCurrentUser();
  const page = store.getCurrentPage();
  const students = store.getStudents();

  const titles: Record<string, string> = {
    home: 'Không gian cá nhân · Tổng quan',
    profile: 'Hồ sơ Đoàn viên chi tiết',
    card: 'Thẻ Đoàn viên điện tử · Xác minh chuẩn BCH',
    notifications: 'Trung tâm thông báo & Chỉ thị',
    tasks: 'Nhiệm vụ & Minh chứng hoạt động',
    events: 'Sự kiện & Hội thảo Chi đoàn',
    scan: 'Quét mã QR Điểm danh sự kiện',
    competitions: 'Cuộc thi & Phong trào Đoàn',
    leaderboard: 'Bảng xếp hạng Đoàn viên tiêu biểu',
    officers: 'Danh sách Cán bộ Đoàn Chi đoàn',
    elections: 'Bầu cử Ban Chấp hành Chi đoàn',
    feedback: 'Hộp thư Góp ý & Nguyện vọng sinh viên',
    security: 'Bảo mật tài khoản & Mã PIN cá nhân',
    legal: 'Quy chế tổ chức & Chính sách bảo mật',
    admin_dashboard: 'Trung tâm Điều hành Quản trị (KPIs)',
    admin_analytics: 'Phân tích Dữ liệu & Báo cáo tổng hợp',
    admin_visits: 'Theo dõi Lưu lượng Web Visits',
    admin_users: 'Quản lý 71 Đoàn viên & Sinh viên',
    admin_cards: 'Xét duyệt & Xác minh Thẻ Đoàn viên',
    admin_officers: 'Quản lý Cán bộ Đoàn & Ban Chấp hành',
    admin_leaderboard: 'Cấu hình & Giám sát Bảng xếp hạng',
    admin_tasks: 'Giao nhiệm vụ & Tiêu chuẩn minh chứng',
    admin_submissions: 'Kiểm duyệt ảnh minh chứng hoạt động',
    admin_ocr: 'Trung tâm Quản trị OCR Thẻ Đoàn',
    admin_events: 'Quản lý Sự kiện & Lịch hoạt động',
    admin_qr: 'Màn hình Chiếu QR Điểm danh động (120s)',
    admin_elections: 'Quản trị Bầu cử & Kết quả kiểm phiếu',
    admin_notices: 'Quản lý Thông báo hệ thống',
    admin_feedback: 'Xử lý Góp ý & Phản hồi sinh viên',
    admin_terms: 'Soạn thảo Điều khoản & Chính sách',
    admin_admins: 'Phân quyền Quản trị viên (RBAC)',
    admin_security: 'Security Center & Audit Logs',
    admin_blocks: 'Danh sách chặn IP & Thiết bị',
    admin_smtp: 'Cấu hình Máy chủ Gửi thư SMTP',
    admin_modules: 'Module Control (Bật/Tắt phân hệ)',
    admin_health: 'Health Center & System Diagnostics'
  };

  const currentTitle = titles[page] || 'PTIT Youth Portal';

  return `
    <header class="sticky top-0 z-30 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between transition-colors">
      <!-- Left side: Mobile Toggle & Breadcrumbs -->
      <div class="flex items-center gap-3">
        <button type="button" class="lg:hidden inline-flex items-center justify-center p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" data-action="toggle-mobile-sidebar" id="yp-mobile-menu-btn" aria-label="Mở Menu">
          ${icon('menu', 18)}
        </button>
        <div>
          <div class="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <span>PTIT Youth Portal</span>
            <span class="text-slate-300 dark:text-slate-600">/</span>
            <span class="font-semibold text-blue-600 dark:text-blue-400">${isAdminView ? 'Administration' : 'Student Space'}</span>
          </div>
          <h2 class="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-tight leading-none mt-0.5">${currentTitle}</h2>
        </div>
      </div>

      <!-- Right side: Quick Switcher, Download ZIP, Theme & Profile -->
      <div class="flex items-center gap-2 sm:gap-3">
        <!-- Download ZIP Button -->
        <a href="/downloads/PTIT_Youth_Portal_FocusBrain_v8.zip" download="PTIT_Youth_Portal_FocusBrain_v8.zip" class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xs transition-colors" title="Tải mã nguồn đầy đủ">
          ${icon('download', 14)}
          <span>Tải ZIP Hostinger</span>
        </a>

        <!-- Switch Student Dropdown -->
        <div class="relative">
          <select id="yp-user-select" class="font-mono text-xs font-medium py-1.5 pl-2.5 pr-7 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 max-w-[150px] sm:max-w-[210px] truncate shadow-xs">
            <optgroup label="Cán bộ Quản trị viên (Super Admin)">
              <option value="N26DCCN185" ${u.student_id === 'N26DCCN185' ? 'selected' : ''}>N26DCCN185 - Nguyễn Thiện Nhân (Admin)</option>
            </optgroup>
            <optgroup label="Đoàn viên Chi đoàn (71 sinh viên D26CQCN03-N)">
              ${students.filter(s => s.student_id !== 'N26DCCN185').map(s => `
                <option value="${s.student_id}" ${u.student_id === s.student_id ? 'selected' : ''}>
                  ${s.student_id} - ${s.full_name} (${s.membership === 'not_joined' ? 'Chưa vào đoàn' : s.position_title})
                </option>
              `).join('')}
            </optgroup>
          </select>
        </div>

        <!-- Mode Toggle Button (Admin vs Student) -->
        ${u.role === 'admin' ? `
          <button type="button" class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg shadow-xs transition-colors ${isAdminView ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'}" data-action="toggle-admin-mode">
            ${isAdminView ? icon('layout', 13) : icon('shield', 13)}
            <span class="hidden md:inline">${isAdminView ? 'Xem Sinh viên' : 'Vào Admin'}</span>
          </button>
        ` : ''}

        <!-- Dark / Light Mode Toggle Button -->
        <button type="button" class="inline-flex items-center justify-center p-2 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xs transition-colors" data-action="toggle-theme" title="Chuyển chế độ sáng/tối">
          ${icon('moon', 15)}
        </button>

        <!-- Current User Avatar Chip -->
        <div class="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700">
          <div class="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center text-xs font-bold shadow-xs">
            ${u.full_name.split(' ').pop()?.charAt(0) || 'U'}
          </div>
          <div class="text-right leading-tight hidden lg:block">
            <span class="text-xs font-bold text-slate-900 dark:text-white block truncate max-w-[120px]">${u.full_name}</span>
            <span class="font-mono text-[10px] text-slate-500 dark:text-slate-400">${u.student_id}</span>
          </div>
        </div>
      </div>
    </header>
  `;
}
