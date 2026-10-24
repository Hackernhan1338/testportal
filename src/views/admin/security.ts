import { store } from '../../store';
import { icon } from '../../components/icons';

export function renderAdminSecurity(): string {
  const auditLogs = store.getAuditLogs();
  const blocks = store.getBlocks();
  const students = store.getStudents();
  const admins = students.filter(s => s.role === 'admin' || s.admin_level !== 'NONE');

  return `
    <div class="yp-page-head" style="margin-bottom: 20px;">
      <div>
        <h1 style="font-size: 20px; font-weight: 800; color: var(--yp-navy-850); margin: 0 0 4px;">Admin Security Center</h1>
        <p style="font-size: 12.5px; color: var(--yp-text-muted); margin: 0;">Kiểm soát phân quyền RBAC, nhật ký audit toàn hệ thống và chính sách chặn IP / thiết bị</p>
      </div>
      <div>
        <button type="button" class="yp-btn yp-btn-primary yp-btn-sm" data-action="open-add-block-modal">
          ${icon('slash', 13)}
          Thêm chặn IP / Thiết bị mới
        </button>
      </div>
    </div>

    <!-- Security KPI Overview -->
    <div class="yp-kpi-grid">
      <div class="yp-kpi-card">
        <span class="yp-kpi-label">Quản trị viên (RBAC)</span>
        <strong class="yp-kpi-value">${admins.length}</strong>
        <span class="yp-kpi-sub">Super Admin & Cán bộ phụ trách</span>
      </div>

      <div class="yp-kpi-card">
        <span class="yp-kpi-label">Nhật ký Audit Logs</span>
        <strong class="yp-kpi-value" style="color: #2563eb;">${auditLogs.length}</strong>
        <span class="yp-kpi-sub">Bảo toàn dấu vết tác vụ</span>
      </div>

      <div class="yp-kpi-card">
        <span class="yp-kpi-label">IP / Thiết bị đang chặn</span>
        <strong class="yp-kpi-value" style="color: #dc2626;">${blocks.length}</strong>
        <span class="yp-kpi-sub">Ngăn chặn brute-force tự động</span>
      </div>

      <div class="yp-kpi-card">
        <span class="yp-kpi-label">Thuật toán băm mật khẩu</span>
        <strong class="yp-kpi-value" style="font-size: 18px; color: #059669;">Bcrypt / Argon2id</strong>
        <span class="yp-kpi-sub">PIN băm riêng biệt 6 số</span>
      </div>
    </div>

    <!-- 2 Columns: Admin RBAC & Blocklist -->
    <div style="display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(320px, 1.2fr); gap: 20px; margin-bottom: 20px;">
      <!-- RBAC Admins Table -->
      <div class="yp-card">
        <div class="yp-card-head">
          <h3 class="yp-card-title">
            ${icon('users')}
            Danh sách Quản trị viên & Phân quyền (RBAC)
          </h3>
        </div>
        <div class="yp-table-wrap">
          <table class="yp-table">
            <thead>
              <tr>
                <th>Cán bộ quản trị</th>
                <th>MSSV</th>
                <th>Cấp bậc</th>
                <th>Phân quyền hành động</th>
              </tr>
            </thead>
            <tbody>
              ${admins.map(adm => `
                <tr>
                  <td><strong>${adm.full_name}</strong></td>
                  <td><span class="yp-mono">${adm.student_id}</span></td>
                  <td>
                    <span class="yp-badge ${adm.admin_level === 'SUPER_ADMIN' ? 'yp-badge-red' : 'yp-badge-blue'}">
                      ${adm.admin_level}
                    </span>
                  </td>
                  <td style="font-size: 11px; color: var(--yp-text-muted);">
                    ${adm.admin_level === 'SUPER_ADMIN' ? 'Toàn quyền cấu hình, duyệt thẻ, phân quyền' : 'Xem thống kê, duyệt minh chứng cơ bản'}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Blocklist Table -->
      <div class="yp-card">
        <div class="yp-card-head">
          <h3 class="yp-card-title">
            ${icon('slash')}
            Danh sách Chặn IP / Thiết bị (${blocks.length})
          </h3>
        </div>
        <div class="yp-table-wrap">
          <table class="yp-table">
            <thead>
              <tr>
                <th>Loại</th>
                <th>Mục tiêu (IP / Token Hash)</th>
                <th>Lý do chặn</th>
                <th>Hết hạn</th>
                <th style="text-align: right;">Gỡ chặn</th>
              </tr>
            </thead>
            <tbody>
              ${blocks.map(b => `
                <tr>
                  <td><span class="yp-badge yp-badge-red">${b.kind.toUpperCase()}</span></td>
                  <td><span class="yp-mono">${b.target}</span></td>
                  <td>${b.reason}</td>
                  <td><span class="yp-mono" style="font-size: 10.5px;">${b.expires_at.substring(0, 10)}</span></td>
                  <td style="text-align: right;">
                    <button type="button" class="yp-btn yp-btn-secondary yp-btn-sm" style="padding: 4px 8px; font-size: 11px;"
                            data-action="unblock-target" data-block-id="${b.id}">
                      Gỡ
                    </button>
                  </td>
                </tr>
              `).join('')}
              ${blocks.length === 0 ? `
                <tr>
                  <td colspan="5" style="padding: 20px; text-align: center; color: var(--yp-text-muted);">
                    Hiện không có IP hoặc thiết bị nào trong danh sách chặn.
                  </td>
                </tr>
              ` : ''}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Full Audit Logs Table -->
    <div class="yp-card">
      <div class="yp-card-head">
        <h3 class="yp-card-title">
          ${icon('activity')}
          Nhật ký Audit Logs chi tiết (Toàn vẹn hệ thống)
        </h3>
        <span class="yp-badge yp-badge-gray">Audit Trails</span>
      </div>
      <div class="yp-table-wrap">
        <table class="yp-table">
          <thead>
            <tr>
              <th style="width: 140px;">Thời gian</th>
              <th>Tác tử (Actor)</th>
              <th>Hành động (Action)</th>
              <th>Chi tiết thao tác</th>
              <th>Địa chỉ IP</th>
            </tr>
          </thead>
          <tbody>
            ${auditLogs.map(log => `
              <tr>
                <td><span class="yp-mono" style="font-size: 11px;">${log.timestamp}</span></td>
                <td><strong>${log.actor}</strong></td>
                <td><span class="yp-badge yp-badge-blue">${log.action}</span></td>
                <td>${log.details}</td>
                <td><span class="yp-mono">${log.ip}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add Block Modal -->
    <div id="add-block-modal" class="yp-modal-backdrop" style="display: none;">
      <div class="yp-modal" style="max-width: 480px;">
        <div class="yp-modal-header">
          <h3 style="margin: 0; font-size: 15px; font-weight: 750; color: var(--yp-navy-850);">Chặn IP hoặc Thiết bị mới</h3>
          <button type="button" class="yp-btn yp-btn-secondary yp-btn-sm" data-action="close-add-block-modal" style="padding: 4px 8px;">✕</button>
        </div>
        <form id="add-block-form">
          <div class="yp-modal-body" style="display: grid; gap: 14px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 750; color: var(--yp-text-main); margin-bottom: 6px;">
                Phân loại mục tiêu
              </label>
              <select id="block-kind" style="width: 100%; padding: 8px 12px; border: 1px solid var(--yp-border); border-radius: var(--yp-radius-md); font-size: 13px; background: var(--yp-card); color: var(--yp-text-main);">
                <option value="ip">Địa chỉ IP</option>
                <option value="device">Token thiết bị (Cookie Hash)</option>
              </select>
            </div>

            <div>
              <label style="display: block; font-size: 12px; font-weight: 750; color: var(--yp-text-main); margin-bottom: 6px;">
                Giá trị IP hoặc Device Token
              </label>
              <input type="text" id="block-target" required placeholder="VD: 203.0.113.195" class="yp-mono"
                     style="width: 100%; padding: 8px 12px; border: 1px solid var(--yp-border); border-radius: var(--yp-radius-md); font-size: 13px; box-sizing: border-box;" />
            </div>

            <div>
              <label style="display: block; font-size: 12px; font-weight: 750; color: var(--yp-text-main); margin-bottom: 6px;">
                Lý do chặn
              </label>
              <input type="text" id="block-reason" required placeholder="VD: Gửi request bất thường, nghi ngờ dò mật khẩu..."
                     style="width: 100%; padding: 8px 12px; border: 1px solid var(--yp-border); border-radius: var(--yp-radius-md); font-size: 13px; box-sizing: border-box;" />
            </div>
          </div>
          <div class="yp-modal-footer">
            <button type="button" class="yp-btn yp-btn-secondary" data-action="close-add-block-modal">Hủy</button>
            <button type="submit" class="yp-btn yp-btn-primary">
              ${icon('slash', 13)}
              Thực hiện Chặn
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}
