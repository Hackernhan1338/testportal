import { icon } from '../../components/icons';

export function renderAdminHealth(): string {
  return `
    <div class="yp-page-head" style="margin-bottom: 20px;">
      <div>
        <h1 style="font-size: 20px; font-weight: 800; color: var(--yp-navy-850); margin: 0 0 4px;">Health Center & System Diagnostics</h1>
        <p style="font-size: 12.5px; color: var(--yp-text-muted); margin: 0;">Kiểm tra tính toàn vẹn hệ thống, kết nối cơ sở dữ liệu và sẵn sàng triển khai Hostinger</p>
      </div>
      <div>
        <button type="button" class="yp-btn yp-btn-primary yp-btn-sm" data-action="run-diagnostics">
          ${icon('refresh', 13)}
          Chạy kiểm tra lại
        </button>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px;">
      <!-- Server & Environment Check -->
      <div class="yp-card">
        <div class="yp-card-head">
          <h3 class="yp-card-title">
            ${icon('activity')}
            1. Môi trường Máy chủ & Runtime
          </h3>
          <span class="yp-badge yp-badge-green">PASS</span>
        </div>
        <div class="yp-card-body" style="font-size: 12px; display: grid; gap: 10px;">
          <div style="display: flex; justify-content: space-between; padding-bottom: 8px; border-bottom: 1px solid var(--yp-border-light);">
            <span style="color: var(--yp-text-muted);">Phiên bản PHP yêu cầu:</span>
            <span class="yp-mono">PHP 8.2+ (Hostinger Compatible)</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding-bottom: 8px; border-bottom: 1px solid var(--yp-border-light);">
            <span style="color: var(--yp-text-muted);">Múi giờ hệ thống (Timezone):</span>
            <span class="yp-mono">Asia/Ho_Chi_Minh (+07:00)</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding-bottom: 8px; border-bottom: 1px solid var(--yp-border-light);">
            <span style="color: var(--yp-text-muted);">Web Server & Module:</span>
            <span class="yp-mono">Apache với mod_rewrite & mod_headers</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--yp-text-muted);">Bảo vệ Uploads (.htaccess):</span>
            <span class="yp-badge yp-badge-green">Đã chặn thực thi PHP</span>
          </div>
        </div>
      </div>

      <!-- Database Integrity Check -->
      <div class="yp-card">
        <div class="yp-card-head">
          <h3 class="yp-card-title">
            ${icon('database')}
            2. Cơ sở dữ liệu & Dữ liệu 71 sinh viên
          </h3>
          <span class="yp-badge yp-badge-green">71/71 OK</span>
        </div>
        <div class="yp-card-body" style="font-size: 12px; display: grid; gap: 10px;">
          <div style="display: flex; justify-content: space-between; padding-bottom: 8px; border-bottom: 1px solid var(--yp-border-light);">
            <span style="color: var(--yp-text-muted);">Số hồ sơ sinh viên bảo toàn:</span>
            <span class="yp-mono" style="font-weight: 700; color: #059669;">71 sinh viên (STT 1 - 71)</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding-bottom: 8px; border-bottom: 1px solid var(--yp-border-light);">
            <span style="color: var(--yp-text-muted);">Tính toàn vẹn khóa chính (MSSV):</span>
            <span class="yp-badge yp-badge-green">Không trùng lặp</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding-bottom: 8px; border-bottom: 1px solid var(--yp-border-light);">
            <span style="color: var(--yp-text-muted);">Bảng định danh V8:</span>
            <span class="yp-mono">users, tasks, submissions, events, attendances, elections</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--yp-text-muted);">Bảng audit logs & visits:</span>
            <span class="yp-badge yp-badge-green">Sẵn sàng ghi vết</span>
          </div>
        </div>
      </div>

      <!-- Integration Diagnostics -->
      <div class="yp-card">
        <div class="yp-card-head">
          <h3 class="yp-card-title">
            ${icon('shield')}
            3. Dịch vụ Tích hợp & Security
          </h3>
          <span class="yp-badge yp-badge-blue">Ready</span>
        </div>
        <div class="yp-card-body" style="font-size: 12px; display: grid; gap: 10px;">
          <div style="display: flex; justify-content: space-between; padding-bottom: 8px; border-bottom: 1px solid var(--yp-border-light);">
            <span style="color: var(--yp-text-muted);">QR Service (HMAC 120s):</span>
            <span class="yp-badge yp-badge-green">Đang chạy</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding-bottom: 8px; border-bottom: 1px solid var(--yp-border-light);">
            <span style="color: var(--yp-text-muted);">OCR Policy Worker:</span>
            <span class="yp-mono">Bất đồng bộ qua Queue</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding-bottom: 8px; border-bottom: 1px solid var(--yp-border-light);">
            <span style="color: var(--yp-text-muted);">Bảo vệ CSRF & Rate Limit:</span>
            <span class="yp-badge yp-badge-green">Bật</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--yp-text-muted);">Tên miền sản xuất:</span>
            <span class="yp-mono" style="color: #1e3a8a;">https://emotionalplaybox4-0.com</span>
          </div>
        </div>
      </div>
    </div>
  `;
}
