import { store } from '../../store';
import { icon } from '../../components/icons';

export function renderAdminUsers(searchQuery: string = '', statusFilter: string = 'all', pageNum: number = 1): string {
  const allStudents = store.getStudents();
  const PAGE_SIZE = 12;

  // Filter
  const filtered = allStudents.filter(s => {
    const matchSearch = !searchQuery || 
      s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.student_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.hometown && s.hometown.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.card_number && s.card_number.includes(searchQuery));

    const matchStatus = statusFilter === 'all' || s.membership === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const currentPage = Math.max(1, Math.min(pageNum, totalPages));
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return `
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Quản lý 71 Đoàn viên & Sinh viên</h1>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">Danh sách hồ sơ nhân sự đầy đủ của Chi đoàn D26CQCN03-N bảo toàn dữ liệu gốc</p>
      </div>
      <div>
        <button type="button" class="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xs transition-colors" data-action="export-users-csv">
          ${icon('download', 14)}
          <span>Xuất file CSV (Excel)</span>
        </button>
      </div>
    </div>

    <!-- Search & Filter Toolbar with Tailwind -->
    <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 mb-5 shadow-xs flex flex-wrap items-center gap-3">
      <div class="flex-1 min-w-[240px] relative">
        <input type="text" id="user-search-input" value="${searchQuery}" placeholder="Tìm theo Tên, MSSV, Số thẻ, Quê quán..."
               class="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white text-slate-900 dark:text-white" />
        <span class="absolute left-3 top-2.5 text-slate-400 pointer-events-none">
          ${icon('search', 14)}
        </span>
      </div>

      <select id="user-status-filter" class="py-2 px-3 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
        <option value="all" ${statusFilter === 'all' ? 'selected' : ''}>Tất cả trạng thái (${allStudents.length})</option>
        <option value="member" ${statusFilter === 'member' ? 'selected' : ''}>Đoàn viên chính thức</option>
        <option value="not_joined" ${statusFilter === 'not_joined' ? 'selected' : ''}>Chưa vào Đoàn</option>
        <option value="local" ${statusFilter === 'local' ? 'selected' : ''}>Sinh hoạt tại địa phương</option>
        <option value="transferred" ${statusFilter === 'transferred' ? 'selected' : ''}>Chuyển sinh hoạt Đoàn</option>
      </select>

      <span class="text-xs text-slate-500 dark:text-slate-400 ml-auto hidden sm:inline">
        Tìm thấy <b>${filtered.length}</b> / 71 sinh viên
      </span>
    </div>

    <!-- Data Table Card -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden mb-5">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs divide-y divide-slate-100 dark:divide-slate-800">
          <thead class="bg-slate-50/80 dark:bg-slate-850/80 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
            <tr>
              <th class="px-4 py-3 w-12 text-center">STT</th>
              <th class="px-4 py-3">MSSV</th>
              <th class="px-4 py-3">Họ và tên</th>
              <th class="px-4 py-3">Ngày sinh</th>
              <th class="px-4 py-3">Quê quán</th>
              <th class="px-4 py-3">Chức vụ</th>
              <th class="px-4 py-3">Số thẻ Đoàn</th>
              <th class="px-4 py-3">Trạng thái</th>
              <th class="px-4 py-3">Điểm</th>
              <th class="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            ${pageItems.map(s => `
              <tr class="hover:bg-blue-50/30 dark:hover:bg-slate-750 transition-colors">
                <td class="px-4 py-3 text-center font-mono font-bold text-slate-500">${s.class_number}</td>
                <td class="px-4 py-3 font-mono font-bold text-blue-700 dark:text-blue-400">${s.student_id}</td>
                <td class="px-4 py-3 font-bold text-slate-900 dark:text-white">${s.full_name}</td>
                <td class="px-4 py-3 font-mono text-slate-600 dark:text-slate-300">${s.dob ? s.dob.split('-').reverse().join('/') : '—'}</td>
                <td class="px-4 py-3 text-slate-600 dark:text-slate-300">${s.hometown || 'Chưa cập nhật'}</td>
                <td class="px-4 py-3 text-slate-800 dark:text-slate-200">${s.position_title || 'Đoàn viên'}</td>
                <td class="px-4 py-3 font-mono font-bold ${s.card_number ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}">
                  ${s.card_number || 'Chưa có'}
                </td>
                <td class="px-4 py-3">
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${s.membership === 'not_joined' ? 'bg-slate-100 text-slate-600 border border-slate-300' : s.card_verified_at ? 'bg-emerald-50 text-emerald-700 border border-emerald-300' : 'bg-blue-50 text-blue-700 border border-blue-200'}">
                    ${s.membership === 'not_joined' ? 'Chưa vào Đoàn' : s.card_verified_at ? 'Đã duyệt thẻ' : 'Đoàn viên'}
                  </span>
                </td>
                <td class="px-4 py-3 font-mono font-black text-amber-600 dark:text-amber-400">${s.points || 0}</td>
                <td class="px-4 py-3 text-right">
                  <button type="button" class="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 border border-slate-200 dark:border-slate-600 rounded-md transition-colors"
                          data-action="open-edit-student" data-student-id="${s.student_id}">
                    Chi tiết & Sửa
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination Controls -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
      <div>
        Hiển thị trang <b>${currentPage}</b> / <b>${totalPages}</b> (tổng số <b>${filtered.length}</b> kết quả)
      </div>
      <div class="flex items-center gap-2">
        <button type="button" class="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" ${currentPage <= 1 ? 'disabled' : ''} data-action="go-page" data-page="${currentPage - 1}">
          ← Trang trước
        </button>
        <button type="button" class="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" ${currentPage >= totalPages ? 'disabled' : ''} data-action="go-page" data-page="${currentPage + 1}">
          Trang sau →
        </button>
      </div>
    </div>

    <!-- Admin Edit Student Modal -->
    <div id="admin-edit-student-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs" style="display: none;">
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-xl overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h3 id="edit-modal-title" class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            ${icon('user')}
            Chỉnh sửa hồ sơ Đoàn viên (Admin Authority)
          </h3>
          <button type="button" class="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" data-action="close-edit-student-modal">✕</button>
        </div>
        <form id="admin-edit-student-form">
          <input type="hidden" id="admin-edit-sid" />
          <div class="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
            <div>
              <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Mã số sinh viên (MSSV)</label>
              <input type="text" id="admin-edit-mssv" disabled class="font-mono w-full px-3 py-2 text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 font-bold" />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Họ và tên</label>
              <input type="text" id="admin-edit-name" required class="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-bold" />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Ngày sinh (YYYY-MM-DD)</label>
              <input type="date" id="admin-edit-dob" class="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono" />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Tình trạng tổ chức Đoàn</label>
              <select id="admin-edit-membership" class="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-semibold">
                <option value="member">Đoàn viên chính thức</option>
                <option value="not_joined">Chưa vào Đoàn</option>
                <option value="local">Sinh hoạt tại địa phương</option>
                <option value="transferred">Chuyển sinh hoạt Đoàn</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Số thẻ Đoàn viên</label>
              <input type="text" id="admin-edit-card" placeholder="VD: 080208062693" class="font-mono w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-blue-700 dark:text-blue-400 font-bold" />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Chức vụ Chi đoàn</label>
              <input type="text" id="admin-edit-position" placeholder="Đoàn viên / Bí thư /..." class="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white" />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Quê quán</label>
              <input type="text" id="admin-edit-hometown" class="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white" />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Điểm rèn luyện</label>
              <input type="number" id="admin-edit-points" min="0" class="font-mono w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-amber-600 font-bold" />
            </div>
          </div>
          <div class="px-5 py-3 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2">
            <button type="button" class="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors" data-action="close-edit-student-modal">
              Hủy
            </button>
            <button type="submit" class="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors">
              ${icon('check', 13)}
              Lưu thay đổi (Admin)
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}
