import { store } from '../../store';
import { icon } from '../../components/icons';

export function renderUserScan(): string {
  const events = store.getEvents().filter(e => e.active);
  const u = store.getCurrentUser();
  const attendances = store.getAttendances().filter(a => a.student_id === u.student_id);

  return `
    <div class="yp-page-head" style="margin-bottom: 20px;">
      <div>
        <h1 style="font-size: 20px; font-weight: 800; color: var(--yp-navy-850); margin: 0 0 4px;">Quét mã QR Điểm danh sự kiện</h1>
        <p style="font-size: 12.5px; color: var(--yp-text-muted); margin: 0;">Sử dụng camera hoặc nhập mã token động được chiếu tại hội trường để xác nhận tham dự</p>
      </div>
    </div>

    <!-- Security Info Banner -->
    <div style="background: var(--yp-navy-50); border: 1px solid var(--yp-border); border-radius: var(--yp-radius-md); padding: 12px 16px; margin-bottom: 20px; font-size: 12px; color: var(--yp-text-muted);">
      <strong style="color: var(--yp-navy-850);">Cơ chế bảo mật QR động (FocusBrain QR Engine):</strong>
      Mã QR điểm danh thay đổi tự động mỗi <b>120 giây</b> với chữ ký HMAC-SHA256 phía máy chủ. Hệ thống tự động phát hiện và chặn các trường hợp chụp màn hình gửi lại sau khi mã hết hạn và ngăn chặn điểm danh trùng.
    </div>

    <div style="display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(320px, 1fr); gap: 20px;">
      <!-- Scanner / Code Input Form -->
      <div class="yp-card">
        <div class="yp-card-head">
          <h3 class="yp-card-title">
            ${icon('scan')}
            Xác nhận điểm danh
          </h3>
          <span class="yp-badge yp-badge-green">HMAC Active</span>
        </div>
        <div class="yp-card-body">
          <form id="attendance-scan-form" style="display: grid; gap: 16px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 750; color: var(--yp-text-main); margin-bottom: 6px;">
                Chọn sự kiện đang diễn ra
              </label>
              <select id="scan-event-select" style="width: 100%; padding: 8px 12px; border: 1px solid var(--yp-border); border-radius: var(--yp-radius-md); font-size: 13px; background: var(--yp-card); color: var(--yp-text-main);">
                ${events.map(ev => `
                  <option value="${ev.id}">${ev.title} (${ev.points} điểm)</option>
                `).join('')}
              </select>
            </div>

            <!-- Camera Scanner Box Simulation -->
            <div style="border: 2px dashed #94a3b8; border-radius: 12px; padding: 24px; text-align: center; background: #0f172a; color: #ffffff;">
              <div style="width: 80px; height: 80px; border: 2px solid #3b82f6; border-radius: 12px; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; position: relative;">
                <div style="width: 100%; height: 2px; background: #ef4444; position: absolute; animation: scanLine 2s infinite ease-in-out;"></div>
                ${icon('qr', 40, 'text-blue-400')}
              </div>
              <strong style="font-size: 13px; display: block; margin-bottom: 4px;">Khung nhận diện mã QR</strong>
              <p style="font-size: 11px; color: #94a3b8; margin: 0 0 12px;">Hướng camera về phía màn hình máy chiếu tại hội trường</p>
              <button type="button" id="start-camera-btn" class="yp-btn yp-btn-primary yp-btn-sm">
                ${icon('scan', 13)}
                Bật Camera quét trực tiếp
              </button>
            </div>

            <!-- Manual Token Input (Fallback) -->
            <div>
              <label style="display: block; font-size: 12px; font-weight: 750; color: var(--yp-text-main); margin-bottom: 6px;">
                Hoặc nhập mã Token điểm danh hiển thị dưới QR
              </label>
              <div style="display: flex; gap: 8px;">
                <input type="text" id="scan-token-input" placeholder="VD: HMAC-D26-2026-XXXX" class="yp-mono"
                       style="flex: 1; padding: 8px 12px; border: 1px solid var(--yp-border); border-radius: var(--yp-radius-md); font-size: 13px; box-sizing: border-box;" />
                <button type="button" id="auto-fill-token-btn" class="yp-btn yp-btn-secondary yp-btn-sm" title="Tự động lấy token hợp lệ từ server">
                  Lấy mã hợp lệ
                </button>
              </div>
            </div>

            <!-- Live Window Counter -->
            <div style="display: flex; align-items: center; justify-content: space-between; background: var(--yp-navy-50); border: 1px solid var(--yp-border); border-radius: 8px; padding: 10px 14px; font-size: 12px;">
              <span style="color: var(--yp-text-muted);">Cửa sổ thời gian hiện tại:</span>
              <span class="yp-mono" style="color: #059669; font-weight: 800;" id="qr-window-countdown">Hết hạn trong: 78s</span>
            </div>

            <button type="submit" class="yp-btn yp-btn-primary" style="padding: 10px;">
              ${icon('check')}
              Xác nhận Điểm danh
            </button>
          </form>

          <div id="attendance-msg-box" style="margin-top: 14px; font-size: 12.5px; display: none;"></div>
        </div>
      </div>

      <!-- Attendance History -->
      <div class="yp-card">
        <div class="yp-card-head">
          <h3 class="yp-card-title">
            ${icon('clock')}
            Lịch sử sự kiện đã tham gia
          </h3>
          <span class="yp-badge yp-badge-blue">${attendances.length} lượt</span>
        </div>
        <div class="yp-card-body" style="padding: 12px;">
          ${attendances.length > 0 ? `
            <div style="display: grid; gap: 10px;">
              ${attendances.map(att => {
                const ev = events.find(e => e.id === att.event_id);
                return `
                  <div style="border: 1px solid var(--yp-border); border-radius: 8px; padding: 12px; font-size: 12px; background: var(--yp-card);">
                    <strong style="color: var(--yp-text-main); display: block; margin-bottom: 2px;">${ev?.title || 'Sự kiện Chi đoàn'}</strong>
                    <div style="display: flex; justify-content: space-between; color: var(--yp-text-muted); font-size: 11px;">
                      <span class="yp-mono">${att.checked_at}</span>
                      <span class="yp-badge yp-badge-green">+${ev?.points || 15} điểm</span>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          ` : `
            <div style="padding: 30px; text-align: center; color: var(--yp-text-muted); font-size: 12px;">
              Đồng chí chưa tham gia sự kiện nào. Hãy quét mã tại các buổi sinh hoạt chi đoàn để nhận điểm rèn luyện!
            </div>
          `}
        </div>
      </div>
    </div>

    <style>
      @keyframes scanLine {
        0%, 100% { top: 0%; opacity: 0.8; }
        50% { top: 96%; opacity: 0.8; }
      }
    </style>
  `;
}
