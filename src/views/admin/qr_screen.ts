import { store } from '../../store';
import { icon } from '../../components/icons';

export function renderAdminQrScreen(): string {
  const events = store.getEvents().filter(e => e.active);
  const activeEvent = events[0] || { id: 1, title: 'Đại hội Chi đoàn D26CQCN03-N', points: 20 };
  const attendances = store.getAttendances().filter(a => a.event_id === activeEvent.id);

  return `
    <div class="yp-page-head" style="margin-bottom: 20px;">
      <div>
        <h1 style="font-size: 20px; font-weight: 800; color: var(--yp-navy-850); margin: 0 0 4px;">Màn hình Chiếu QR Điểm danh Sự kiện (Động 120s)</h1>
        <p style="font-size: 12.5px; color: var(--yp-text-muted); margin: 0;">Mã QR điểm danh thay đổi tự động sau mỗi 120 giây với chữ ký HMAC chống chụp ảnh chuyển tiếp</p>
      </div>
      <div style="display: flex; gap: 8px;">
        <select id="admin-qr-event-select" style="padding: 6px 12px; font-size: 12px; border: 1px solid var(--yp-border); border-radius: var(--yp-radius-md); background: var(--yp-card); color: var(--yp-text-main);">
          ${events.map(ev => `
            <option value="${ev.id}">${ev.title}</option>
          `).join('')}
        </select>
        <button type="button" class="yp-btn yp-btn-primary yp-btn-sm" onclick="document.documentElement.requestFullscreen?.()">
          Toàn màn hình
        </button>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(320px, 1fr); gap: 24px;">
      <!-- Main Projector QR Box -->
      <div class="yp-card" style="text-align: center; padding: 28px; background: linear-gradient(180deg, var(--yp-card) 0%, var(--yp-navy-50) 100%);">
        <span class="yp-badge yp-badge-green" style="font-size: 11px; padding: 4px 10px; margin-bottom: 12px;">
          ● PHIÊN ĐIỂM DANH ĐANG PHÁT TRỰC TIẾP
        </span>
        <h2 id="proj-event-title" style="font-size: 18px; font-weight: 800; color: var(--yp-navy-850); margin: 0 0 6px;">
          ${activeEvent.title}
        </h2>
        <p style="font-size: 13px; color: var(--yp-text-muted); margin: 0 0 20px;">
          Đoàn viên sử dụng ứng dụng để quét mã hoặc nhập token dưới đây
        </p>

        <!-- Dynamic QR Container -->
        <div style="background: #ffffff; padding: 24px; border-radius: 20px; border: 3px solid #23477f; box-shadow: 0 10px 25px -5px rgba(35, 71, 127, 0.2); display: inline-block; margin-bottom: 20px;">
          <canvas id="projector-qr-canvas" style="width: 260px; height: 260px; margin: 0 auto; display: block;"></canvas>
        </div>

        <!-- 120s Countdown Bar -->
        <div style="max-width: 400px; margin: 0 auto 16px;">
          <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px;">
            <span style="color: var(--yp-text-muted);">Mã sẽ tự động làm mới sau:</span>
            <strong class="yp-mono" id="proj-countdown-text" style="color: #dc2626; font-size: 14px;">120 giây</strong>
          </div>
          <div style="height: 6px; background: #e2e8f0; border-radius: 999px; overflow: hidden;">
            <div id="proj-progress-bar" style="width: 100%; height: 100%; background: #dc2626; transition: width 1s linear;"></div>
          </div>
        </div>

        <div style="background: #ffffff; border: 1px solid var(--yp-border); border-radius: 8px; padding: 10px; max-width: 400px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 11px; color: var(--yp-text-muted);">MÃ TOKEN DỰ PHÒNG:</span>
          <span class="yp-mono" id="proj-token-text" style="font-weight: 800; font-size: 13px; color: #1e3a8a;">HMAC-D26-LIVE</span>
        </div>
      </div>

      <!-- Live Attendee Feed -->
      <div class="yp-card">
        <div class="yp-card-head">
          <h3 class="yp-card-title">
            ${icon('users')}
            Danh sách có mặt thời gian thực (<span id="proj-attendee-count">${attendances.length}</span> / 71)
          </h3>
          <span class="yp-badge yp-badge-green">Tự động cập nhật</span>
        </div>
        <div class="yp-card-body" style="padding: 14px; max-height: 480px; overflow-y: auto;">
          <div id="proj-attendee-list" style="display: grid; gap: 8px;">
            ${attendances.map(a => `
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; border: 1px solid var(--yp-border-light); border-radius: 8px; background: var(--yp-card);">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <div style="width: 28px; height: 28px; border-radius: 50%; background: #22c55e; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700;">
                    ✓
                  </div>
                  <div>
                    <strong style="font-size: 12.5px; color: var(--yp-text-main); display: block;">${a.student_name}</strong>
                    <span class="yp-mono" style="font-size: 10.5px; color: var(--yp-text-muted);">${a.student_id}</span>
                  </div>
                </div>
                <div class="yp-mono" style="font-size: 11px; color: var(--yp-text-muted);">
                  ${a.checked_at.substring(11)}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}
