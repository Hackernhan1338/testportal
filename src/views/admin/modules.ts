import { store } from '../../store';
import { icon } from '../../components/icons';

export function renderAdminModules(): string {
  const settings = store.getSettings();
  const modules = [
    { key: 'card', name: 'Thẻ Đoàn viên điện tử', desc: 'Cho phép đoàn viên xem và đăng ký số thẻ' },
    { key: 'tasks', name: 'Nhiệm vụ & Minh chứng', desc: 'Quản lý bài nộp hoạt động và tích điểm' },
    { key: 'events', name: 'Sự kiện & Hội thảo', desc: 'Hiển thị danh sách hoạt động và lịch chi đoàn' },
    { key: 'scan', name: 'Quét QR Điểm danh', desc: 'Mở chức năng quét camera điểm danh sự kiện' },
    { key: 'leaderboard', name: 'Bảng xếp hạng Đoàn viên', desc: 'Bảng vinh danh top sinh viên tích cực' },
    { key: 'elections', name: 'Bầu cử Ban Chấp hành', desc: 'Module bỏ phiếu điện tử cho Đại hội' },
    { key: 'competitions', name: 'Cuộc thi & Hội thi', desc: 'Các phong trào thi đua cấp trường' },
    { key: 'notifications', name: 'Trung tâm thông báo', desc: 'Gửi chỉ thị và thông báo triệu tập' },
    { key: 'feedback', name: 'Hộp thư Góp ý', desc: 'Tiếp nhận nguyện vọng và ý kiến đóng góp' }
  ];

  return `
    <div class="yp-page-head" style="margin-bottom: 20px;">
      <div>
        <h1 style="font-size: 20px; font-weight: 800; color: var(--yp-navy-850); margin: 0 0 4px;">Module Control (Kiểm soát phân hệ)</h1>
        <p style="font-size: 12.5px; color: var(--yp-text-muted); margin: 0;">Bật hoặc tắt linh hoạt các phân hệ chức năng hiển thị cho sinh viên mà không cần sửa code</p>
      </div>
    </div>

    <div class="yp-card">
      <div class="yp-card-head">
        <h3 class="yp-card-title">
          ${icon('settings')}
          Danh sách phân hệ chức năng hệ thống
        </h3>
        <span class="yp-badge yp-badge-blue">Cập nhật tức thời</span>
      </div>
      <div class="yp-table-wrap">
        <table class="yp-table">
          <thead>
            <tr>
              <th>Tên phân hệ</th>
              <th>Mô tả chức năng</th>
              <th>Khóa hệ thống (Key)</th>
              <th style="text-align: right;">Trạng thái bật/tắt</th>
            </tr>
          </thead>
          <tbody>
            ${modules.map(m => {
              const isEnabled = settings.modules[m.key] !== false;
              return `
                <tr>
                  <td><strong>${m.name}</strong></td>
                  <td style="color: var(--yp-text-muted);">${m.desc}</td>
                  <td><span class="yp-mono">${m.key}</span></td>
                  <td style="text-align: right;">
                    <button type="button" class="yp-btn ${isEnabled ? 'yp-btn-primary' : 'yp-btn-secondary'} yp-btn-sm"
                            data-action="toggle-module" data-key="${m.key}">
                      ${isEnabled ? '✓ Đang Bật' : '✕ Đang Tắt'}
                    </button>
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
