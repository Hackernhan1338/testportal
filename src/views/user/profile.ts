import { store } from '../../store';
import { icon } from '../../components/icons';

export function renderUserProfile(): string {
  const u = store.getCurrentUser();
  const allStudents = [...store.getStudents()].sort((a, b) => (b.points || 0) - (a.points || 0));
  const myRank = allStudents.findIndex(s => s.student_id === u.student_id) + 1;

  const quoteText = u.quote_text || 'Đâu cần thanh niên có, việc gì khó có thanh niên.';
  const quoteAuthor = u.quote_author || 'Chủ tịch Hồ Chí Minh';

  return `
    <!-- Top Hero Banner: Profile Cover, Avatar & Prominent Quote -->
    <div class="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white shadow-xl border border-slate-800 mb-8 transition-all">
      <!-- Decorative Glows & Patterns -->
      <div class="absolute -right-16 -top-16 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute left-1/3 -bottom-16 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <!-- Top Cover Strip -->
      <div class="h-28 sm:h-36 bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 relative px-6 flex items-end justify-between pb-3">
        <div class="flex items-center gap-2 text-xs font-bold text-blue-200 uppercase tracking-widest">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Hồ sơ Đoàn viên điện tử · Chi đoàn D26CQCN03-N</span>
        </div>
        <button type="button" class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 rounded-lg transition-colors cursor-pointer" data-action="open-avatar-modal">
          ${icon('upload', 13)}
          <span>Đổi ảnh đại diện</span>
        </button>
      </div>

      <!-- Main Profile Header Body -->
      <div class="px-6 sm:px-8 pb-8 pt-0 relative z-10">
        <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6 -mt-14 sm:-mt-16 mb-6">
          <!-- Avatar + Identity Info -->
          <div class="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
            <!-- Avatar Frame -->
            <div class="relative group">
              <div class="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-b from-blue-500 via-blue-700 to-indigo-950 p-1 shadow-2xl shadow-blue-900/50 ring-4 ring-slate-900 overflow-hidden flex items-center justify-center">
                ${u.avatar_path ? `
                  <img src="${u.avatar_path}" alt="${u.full_name}" class="w-full h-full object-cover rounded-xl" id="profile-avatar-img" />
                ` : `
                  <div class="w-full h-full rounded-xl bg-gradient-to-br from-blue-700 to-indigo-900 flex flex-col items-center justify-center text-white p-2">
                    <span class="text-3xl sm:text-4xl font-black">${u.full_name.split(' ').pop()?.charAt(0) || 'U'}</span>
                    <span class="text-[9px] text-blue-200 uppercase tracking-wider font-bold mt-1">Đoàn viên</span>
                  </div>
                `}
              </div>
              <button type="button" class="absolute bottom-1 right-1 p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md border border-white/30 transition-transform group-hover:scale-110 cursor-pointer" data-action="open-avatar-modal" title="Thay đổi ảnh đại diện">
                ${icon('upload', 14)}
              </button>
            </div>

            <!-- Identity Details -->
            <div class="space-y-1">
              <div class="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h1 class="text-2xl sm:text-3xl font-black text-white tracking-tight">${u.full_name}</h1>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold ${u.membership === 'not_joined' ? 'bg-slate-700 text-slate-300' : 'bg-red-600/30 text-red-300 border border-red-500/30'}">
                  ${u.membership === 'not_joined' ? 'Chưa vào Đoàn' : u.position_title || 'Đoàn viên'}
                </span>
              </div>
              <div class="flex items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm text-slate-300 flex-wrap">
                <span class="font-mono font-bold text-blue-300">${u.student_id}</span>
                <span>·</span>
                <span>STT ${u.class_number}</span>
                <span>·</span>
                <span>${u.class_name || 'D26CQCN03-N'}</span>
                <span>·</span>
                <span class="text-slate-400">Khoa CNTT1 · PTIT HCM</span>
              </div>
            </div>
          </div>

          <!-- 4 Quick Metric Pills -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full lg:w-auto">
            <div class="bg-slate-800/80 backdrop-blur-xs border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-center shadow-xs">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Điểm Rèn Luyện</span>
              <strong class="font-mono text-xl sm:text-2xl font-black text-amber-400 block mt-0.5">${u.points || 0}</strong>
            </div>
            <div class="bg-slate-800/80 backdrop-blur-xs border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-center shadow-xs">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Hạng Chi Đoàn</span>
              <strong class="font-mono text-xl sm:text-2xl font-black text-white block mt-0.5">#${myRank}</strong>
            </div>
            <div class="bg-slate-800/80 backdrop-blur-xs border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-center shadow-xs">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Số Thẻ Đoàn</span>
              <strong class="font-mono text-xs sm:text-sm font-extrabold text-blue-300 block mt-1.5 truncate">${u.card_number || 'Chờ cấp'}</strong>
            </div>
            <div class="bg-slate-800/80 backdrop-blur-xs border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-center shadow-xs">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Vào Đoàn</span>
              <strong class="font-mono text-xs sm:text-sm font-extrabold text-emerald-400 block mt-1.5">${u.joined_date ? u.joined_date.split('-').reverse().join('/') : 'Chưa có'}</strong>
            </div>
          </div>
        </div>

        <!-- PROMINENT QUOTE BANNER ON TOP (CÂU NÓI TRÊN ĐẦU THEO FOCUSBRAIN) -->
        <div class="rounded-2xl bg-gradient-to-r from-blue-950/70 via-indigo-950/60 to-slate-900/80 border border-blue-500/30 p-4 sm:p-5 relative shadow-inner backdrop-blur-md">
          <div class="flex items-start gap-3.5">
            <span class="text-3xl sm:text-4xl leading-none text-amber-400 select-none font-serif opacity-80">“</span>
            <div class="flex-1">
              <p class="text-sm sm:text-base font-medium italic text-blue-50 leading-relaxed m-0" id="hero-quote-text">
                ${quoteText}
              </p>
              <div class="flex items-center justify-between mt-2 pt-2 border-t border-blue-500/20">
                <span class="text-xs font-semibold text-amber-300" id="hero-quote-author">
                  — ${quoteAuthor}
                </span>
                <button type="button" class="text-xs font-bold text-blue-300 hover:text-white inline-flex items-center gap-1 cursor-pointer transition-colors" data-action="scroll-to-quote">
                  ${icon('award', 13)}
                  <span>Chỉnh sửa châm ngôn</span>
                </button>
              </div>
            </div>
            <span class="text-3xl sm:text-4xl leading-none text-amber-400 select-none font-serif opacity-80 self-end">”</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Security Warning & Authority Notice -->
    <div class="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/70 dark:bg-blue-950/30 p-4 mb-8 text-xs text-blue-900 dark:text-blue-300 leading-relaxed shadow-xs flex items-start gap-3">
      <span class="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">${icon('shield', 18)}</span>
      <div>
        <strong class="font-bold block text-blue-950 dark:text-blue-200 mb-0.5">Phân quyền bảo mật dữ liệu hồ sơ:</strong>
        Các trường định danh do Nhà trường và Đoàn cấp gồm <b>Mã số sinh viên (MSSV)</b>, <b>Ngày sinh</b>, <b>Tình trạng tổ chức</b> và <b>Số thẻ Đoàn</b> được bảo vệ nghiêm ngặt, chỉ Quản trị viên / Cán bộ Đoàn mới được duyệt thay đổi. Sinh viên được toàn quyền cập nhật thông tin liên hệ, cá nhân hóa châm ngôn sống và ảnh đại diện.
      </div>
    </div>

    <!-- Profile Edit Form Grid -->
    <form id="profile-edit-form" class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Card 1: Thông tin cơ bản (Định danh) -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
          <div class="px-5 py-3.5 bg-slate-50/80 dark:bg-slate-850/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h3 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              ${icon('user')}
              1. Thông tin Định danh cơ bản
            </h3>
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
              Admin Verified
            </span>
          </div>

          <div class="p-5 space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Họ và tên đầy đủ</label>
              <input type="text" value="${u.full_name}" disabled
                     class="w-full px-3.5 py-2 text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-bold" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Mã số sinh viên (MSSV)</label>
                <input type="text" value="${u.student_id}" disabled
                       class="font-mono w-full px-3.5 py-2 text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-blue-700 dark:text-blue-400 font-bold" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">STT trong danh sách</label>
                <input type="text" value="STT ${u.class_number}" disabled
                       class="font-mono w-full px-3.5 py-2 text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-bold" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Ngày sinh</label>
                <input type="text" value="${u.dob ? u.dob.split('-').reverse().join('/') : 'Chưa cập nhật'}" disabled
                       class="font-mono w-full px-3.5 py-2 text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-bold" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Giới tính</label>
                <input type="text" value="${u.gender || 'Nam'}" disabled
                       class="w-full px-3.5 py-2 text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-semibold" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">Quê quán / Tỉnh thành</label>
                <input type="text" id="prof-hometown" value="${u.hometown || ''}" placeholder="Nhập quê quán..."
                       class="w-full px-3.5 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 dark:text-slate-200" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Dân tộc / Tôn giáo</label>
                <input type="text" value="${u.ethnic_group || 'Kinh'} / ${u.religion || 'Không'}" disabled
                       class="w-full px-3.5 py-2 text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-semibold" />
              </div>
            </div>
          </div>
        </div>

        <!-- Card 2: Thông tin Đoàn - Đảng -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
          <div class="px-5 py-3.5 bg-slate-50/80 dark:bg-slate-850/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h3 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              ${icon('shield')}
              2. Thông tin Tổ chức Đoàn - Đảng
            </h3>
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Chi đoàn D26CQCN03-N
            </span>
          </div>

          <div class="p-5 space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Tình trạng tổ chức</label>
                <input type="text" value="${u.membership === 'not_joined' ? 'Chưa vào đoàn' : 'Đoàn viên chính thức'}" disabled
                       class="w-full px-3.5 py-2 text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-bold" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Chức vụ Chi đoàn</label>
                <input type="text" value="${u.position_title || 'Đoàn viên'}" disabled
                       class="w-full px-3.5 py-2 text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-blue-700 dark:text-blue-400 font-bold" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Số thẻ Đoàn viên</label>
                <input type="text" value="${u.card_number || 'Chưa cấp số thẻ'}" disabled
                       class="font-mono w-full px-3.5 py-2 text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-blue-700 dark:text-blue-400 font-black tracking-wide" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Ngày vào Đoàn</label>
                <input type="text" value="${u.joined_date ? u.joined_date.split('-').reverse().join('/') : 'Chưa ghi nhận'}" disabled
                       class="font-mono w-full px-3.5 py-2 text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-bold" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Nơi sinh hoạt Đoàn</label>
              <input type="text" value="${u.activity_unit || 'Chi đoàn D26CQCN03-N'}" disabled
                     class="w-full px-3.5 py-2 text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-semibold" />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Ngày kết nạp Đảng (nếu có)</label>
              <input type="text" value="${u.party_joined_date || 'Chưa kết nạp Đảng'}" disabled
                     class="w-full px-3.5 py-2 text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-400" />
            </div>
          </div>
        </div>

        <!-- Card 3: Thông tin liên hệ & Quyền riêng tư -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
          <div class="px-5 py-3.5 bg-slate-50/80 dark:bg-slate-850/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h3 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              ${icon('mail')}
              3. Thông tin Liên hệ & Bảo mật
            </h3>
          </div>

          <div class="p-5 space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Email sinh viên Học viện</label>
              <input type="email" value="${u.email}" disabled
                     class="font-mono w-full px-3.5 py-2 text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-medium" />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">Số điện thoại liên lạc</label>
              <input type="tel" id="prof-phone" value="${u.phone || ''}" placeholder="VD: 0901234567"
                     class="font-mono w-full px-3.5 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 dark:text-slate-200" />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">Email cá nhân dự phòng</label>
              <input type="email" id="prof-email" value="${u.personal_email || ''}" placeholder="VD: email@gmail.com"
                     class="font-mono w-full px-3.5 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 dark:text-slate-200" />
            </div>

            <div class="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 p-3 text-xs text-amber-900 dark:text-amber-300 leading-relaxed">
              🔒 <b>Cam kết bảo vệ quyền riêng tư:</b> Số điện thoại và Email cá nhân được bảo vệ nghiêm ngặt, <b>không bao giờ hiển thị công khai trên Bảng xếp hạng</b> hoặc với người dùng khác.
            </div>
          </div>
        </div>

        <!-- Card 4: Cá nhân hóa (Avatar & Châm ngôn sống) -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden" id="section-quote-edit">
          <div class="px-5 py-3.5 bg-slate-50/80 dark:bg-slate-850/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h3 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              ${icon('award')}
              4. Cá nhân hóa & Châm ngôn sống
            </h3>
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
              FocusBrain Profile
            </span>
          </div>

          <div class="p-5 space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">Câu nói yêu thích / Châm ngôn sống</label>
              <textarea id="prof-quote" rows="3" placeholder="Nhập câu nói truyền cảm hứng..."
                        class="w-full px-3.5 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 dark:text-slate-200 leading-relaxed">${quoteText}</textarea>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">Tác giả câu nói</label>
              <input type="text" id="prof-quote-author" value="${quoteAuthor}" placeholder="VD: Chủ tịch Hồ Chí Minh"
                     class="w-full px-3.5 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 dark:text-slate-200" />
            </div>

            <div class="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
              <div>
                <strong class="text-xs font-bold text-slate-900 dark:text-white block">Hiển thị trên Bảng xếp hạng</strong>
                <span class="text-[11px] text-slate-500 dark:text-slate-400">Cho phép tên và điểm của đồng chí xuất hiện trên bảng vinh danh</span>
              </div>
              <input type="checkbox" id="prof-lb-visible" ${u.leaderboard_visible !== false ? 'checked' : ''}
                     class="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer" />
            </div>

            <div class="flex justify-end pt-2">
              <button type="submit" class="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer">
                ${icon('check', 14)}
                Lưu toàn bộ thay đổi
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>

    <!-- Modal Chọn / Đổi Avatar Đoàn viên -->
    <div id="avatar-picker-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs" style="display: none;">
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-md overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h3 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            ${icon('user')}
            Chọn ảnh đại diện Đoàn viên
          </h3>
          <button type="button" class="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer" data-action="close-avatar-modal">✕</button>
        </div>

        <div class="p-6 space-y-5">
          <div>
            <label class="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">Tải ảnh chân dung từ thiết bị</label>
            <input type="file" id="avatar-file-input" accept="image/*" class="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">Hoặc chọn avatar Đoàn viên tiêu biểu</label>
            <div class="grid grid-cols-4 gap-3 text-center">
              <div class="p-2 border-2 border-blue-500 rounded-xl cursor-pointer hover:scale-105 transition-transform bg-blue-50/50" data-action="pick-avatar-preset" data-avatar-url="/assets/images/youth_card_sample.jpg">
                <img src="/assets/images/youth_card_sample.jpg" class="w-12 h-12 object-cover rounded-lg mx-auto" />
                <span class="text-[10px] font-bold text-blue-700 block mt-1">Ảnh thẻ</span>
              </div>
              <div class="p-2 border border-slate-200 rounded-xl cursor-pointer hover:scale-105 transition-transform bg-slate-50" data-action="pick-avatar-gradient" data-gradient="1">
                <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center text-white font-bold text-lg mx-auto">
                  ${u.full_name.charAt(0)}
                </div>
                <span class="text-[10px] text-slate-600 block mt-1">Xanh Đoàn</span>
              </div>
              <div class="p-2 border border-slate-200 rounded-xl cursor-pointer hover:scale-105 transition-transform bg-slate-50" data-action="pick-avatar-gradient" data-gradient="2">
                <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center text-white font-bold text-lg mx-auto">
                  ★
                </div>
                <span class="text-[10px] text-slate-600 block mt-1">Cờ đỏ</span>
              </div>
              <div class="p-2 border border-slate-200 rounded-xl cursor-pointer hover:scale-105 transition-transform bg-slate-50" data-action="pick-avatar-gradient" data-gradient="3">
                <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white font-bold text-lg mx-auto">
                  🌿
                </div>
                <span class="text-[10px] text-slate-600 block mt-1">Tình nguyện</span>
              </div>
            </div>
          </div>
        </div>

        <div class="px-5 py-3 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-700 flex justify-end">
          <button type="button" class="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer" data-action="close-avatar-modal">
            Đóng
          </button>
        </div>
      </div>
    </div>
  `;
}
