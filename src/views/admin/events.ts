import { store } from '../../store';
import { icon } from '../../components/icons';

export function renderAdminEvents(): string {
  const events = store.getEvents();
  const attendances = store.getAttendances();

  return `
    <div class="yp-page-head" style="margin-bottom: 20px;">
      <div>
        <h1 style="font-size: 20px; font-weight: 800; color: var(--yp-navy-850); margin: 0 0 4px;">Quản lý Sự kiện & Lịch hoạt động Chi đoàn</h1>
        <p style="font-size: 12.5px; color: var(--yp-text-muted); margin: 0;">Lên lịch sinh hoạt, chuyên đề học thuật, cấu hình điểm danh và cấp phát mã QR động</p>
      </div>
      <div>
        <button type="button" class="yp-btn yp-btn-primary yp-btn-sm" data-action="open-add-event-modal">
          ${icon('events', 13)}
          Tạo sự kiện mới
        </button>
      </div>
    </div>

    <div class="yp-card">
      <div class="yp-table-wrap">
        <table class="yp-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tiêu đề sự kiện</th>
              <th>Địa điểm</th>
              <th>Thời gian bắt đầu</th>
              <th>Điểm thưởng</th>
              <th>Số lượng điểm danh</th>
              <th>Trạng thái</th>
              <th style="text-align: right;">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            ${events.map(ev => {
              const count = attendances.filter(a => a.event_id === ev.id).length;
              return `
                <tr>
                  <td><span class="yp-mono">#${ev.id}</span></td>
                  <td><strong>${ev.title}</strong></td>
                  <td>${ev.location}</td>
                  <td><span class="yp-mono">${ev.start_at}</span></td>
                  <td><strong style="color: #059669;">+${ev.points} điểm</strong></td>
                  <td>
                    <span class="yp-mono" style="font-weight: 700; color: #1e3a8a;">
                      ${count} / 71
                    </span>
                  </td>
                  <td>
                    <span class="yp-badge ${ev.active ? 'yp-badge-green' : 'yp-badge-gray'}">
                      ${ev.active ? 'Đang diễn ra' : 'Đã kết thúc'}
                    </span>
                  </td>
                  <td style="text-align: right;">
                    <a data-nav="admin_qr" class="yp-btn yp-btn-secondary yp-btn-sm" style="padding: 4px 8px;">
                      ${icon('qr', 12)}
                      Chiếu QR
                    </a>
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
