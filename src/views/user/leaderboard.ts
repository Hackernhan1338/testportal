import { store } from '../../store';
import { icon } from '../../components/icons';

export function renderUserLeaderboard(): string {
  const students = store.getStudents();
  const sorted = [...students]
    .filter(s => s.leaderboard_visible !== false)
    .sort((a, b) => (b.points || 0) - (a.points || 0));

  return `
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Bảng xếp hạng Đoàn viên tiêu biểu</h1>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">Vinh danh thành tích tham gia phong trào, hoàn thành nhiệm vụ và điểm danh sự kiện của Chi đoàn D26CQCN03-N</p>
      </div>
      <div>
        <select id="lb-time-filter" class="py-2 px-3 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-xs">
          <option value="semester">Học kỳ I (2026 - 2027)</option>
          <option value="month">Tháng 10/2026</option>
          <option value="year">Toàn khóa học</option>
        </select>
      </div>
    </div>

    <!-- Privacy Compliance Note with Tailwind -->
    <div class="rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 p-3.5 mb-6 text-xs text-blue-900 dark:text-blue-300 flex items-center gap-2.5 shadow-xs">
      <span class="text-blue-600 dark:text-blue-400 shrink-0">${icon('shield', 16)}</span>
      <p class="m-0 leading-relaxed">
        <b>Cam kết bảo mật dữ liệu sinh viên:</b> Bảng xếp hạng chỉ hiển thị Họ tên, MSSV, chức vụ và tổng điểm rèn luyện. <b>Tuyệt đối không công khai số điện thoại, ngày sinh và email cá nhân</b>.
      </p>
    </div>

    <!-- Top 3 Podium Cards with Tailwind -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      ${sorted.slice(0, 3).map((st, idx) => {
        const medalBorder = idx === 0 ? 'border-amber-400' : idx === 1 ? 'border-slate-300' : 'border-amber-600';
        const medalBadge = idx === 0 ? 'bg-amber-100 text-amber-800 border-amber-300' : idx === 1 ? 'bg-slate-100 text-slate-700 border-slate-300' : 'bg-amber-50 text-amber-900 border-amber-400';
        const medalTitle = idx === 0 ? '★ HẠNG NHẤT' : idx === 1 ? '★ HẠNG NHÌ' : '★ HẠNG BA';

        return `
          <div class="bg-white dark:bg-slate-800 rounded-2xl border-t-4 ${medalBorder} border-x border-b border-slate-200 dark:border-slate-700 p-5 text-center shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black border ${medalBadge} mb-3 uppercase tracking-wider">
              ${medalTitle}
            </span>
            <div class="w-14 h-14 rounded-full bg-slate-900 text-white font-black text-lg flex items-center justify-center mx-auto mb-2.5 border-2 ${medalBorder} shadow-sm">
              ${st.full_name.split(' ').pop()?.charAt(0) || 'U'}
            </div>
            <strong class="text-sm font-extrabold text-slate-900 dark:text-white block truncate mb-0.5">${st.full_name}</strong>
            <span class="font-mono text-xs text-slate-400 block mb-2">${st.student_id} · STT ${st.class_number}</span>
            <div class="font-mono text-2xl font-black text-blue-700 dark:text-blue-400 mb-2">
              ${st.points || 0} <span class="text-xs font-semibold text-slate-400">điểm</span>
            </div>
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              ${st.position_title || 'Đoàn viên'}
            </span>
          </div>
        `;
      }).join('')}
    </div>

    <!-- Full Leaderboard Table with Tailwind -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
      <div class="px-5 py-3.5 bg-slate-50/80 dark:bg-slate-850/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <h3 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          ${icon('award')}
          Danh sách xếp hạng toàn Chi đoàn (71 sinh viên)
        </h3>
        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
          Cập nhật tự động
        </span>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs divide-y divide-slate-100 dark:divide-slate-800">
          <thead class="bg-slate-50/60 dark:bg-slate-850/60 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
            <tr>
              <th class="px-4 py-3 w-16 text-center">Hạng</th>
              <th class="px-4 py-3">Đoàn viên / Sinh viên</th>
              <th class="px-4 py-3">MSSV</th>
              <th class="px-4 py-3">STT Lớp</th>
              <th class="px-4 py-3">Chức vụ / Tình trạng</th>
              <th class="px-4 py-3">Huy hiệu thi đua</th>
              <th class="px-4 py-3 text-right">Tổng điểm</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            ${sorted.map((st, i) => {
              const rank = i + 1;
              const isOfficer = st.position_title && st.position_title !== 'Đoàn viên';
              return `
                <tr class="hover:bg-blue-50/30 dark:hover:bg-slate-750 transition-colors">
                  <td class="px-4 py-3 text-center">
                    <span class="font-mono font-black text-xs ${rank === 1 ? 'text-amber-500 font-extrabold text-sm' : rank <= 3 ? 'text-blue-600' : 'text-slate-400'}">
                      #${rank}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-2.5">
                      <div class="w-7 h-7 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        ${st.full_name.split(' ').pop()?.charAt(0) || 'U'}
                      </div>
                      <strong class="text-xs font-bold text-slate-900 dark:text-white">${st.full_name}</strong>
                    </div>
                  </td>
                  <td class="px-4 py-3 font-mono text-slate-600 dark:text-slate-300 font-medium">${st.student_id}</td>
                  <td class="px-4 py-3 font-mono text-slate-500">STT ${st.class_number}</td>
                  <td class="px-4 py-3">
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${st.membership === 'not_joined' ? 'bg-slate-100 text-slate-600 border border-slate-200' : isOfficer ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}">
                      ${st.membership === 'not_joined' ? 'Chưa vào đoàn' : st.position_title || 'Đoàn viên'}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    ${rank <= 5 ? `
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">★ Đoàn viên Tiên phong</span>
                    ` : rank <= 20 ? `
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Tích cực</span>
                    ` : `
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-50 text-slate-600 border border-slate-200">Đạt chuẩn</span>
                    `}
                  </td>
                  <td class="px-4 py-3 text-right">
                    <span class="font-mono text-sm font-black text-blue-700 dark:text-blue-400">
                      ${st.points || 0}
                    </span>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
