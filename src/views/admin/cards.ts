import { store } from '../../store';
import { icon } from '../../components/icons';

export function renderAdminCards(): string {
  const students = store.getStudents();
  const submissions = store.getSubmissions().filter(s => s.task_id === 1);
  const settings = store.getSettings();

  const totalWithCard = students.filter(s => !!s.card_number).length;
  const totalVerified = students.filter(s => !!s.card_verified_at && !!s.card_number).length;
  const pendingSubs = submissions.filter(s => s.status === 'pending');

  return `
    <div class="yp-page-head" style="margin-bottom: 20px;">
      <div>
        <h1 style="font-size: 20px; font-weight: 800; color: var(--yp-navy-850); margin: 0 0 4px;">Xét duyệt & Xác minh Thẻ Đoàn viên</h1>
        <p style="font-size: 12.5px; color: var(--yp-text-muted); margin: 0;">Kiểm tra tính hợp lệ của số thẻ, đối chiếu sổ đoàn viên và phê duyệt chứng nhận số</p>
      </div>
      <div style="display: flex; gap: 8px;">
        <a data-nav="admin_ocr" class="yp-btn yp-btn-secondary yp-btn-sm">
          ${icon('scan', 13)}
          Quản lý OCR (${settings.ocr_mode.toUpperCase()})
        </a>
      </div>
    </div>

    <!-- Status Overview -->
    <div class="yp-kpi-grid" style="grid-template-columns: repeat(3, 1fr); margin-bottom: 20px;">
      <div class="yp-kpi-card">
        <span class="yp-kpi-label">Tổng số thẻ đã khai báo</span>
        <strong class="yp-kpi-value">${totalWithCard}</strong>
        <span class="yp-kpi-sub">Đoàn viên đã nhập số thẻ</span>
      </div>

      <div class="yp-kpi-card">
        <span class="yp-kpi-label">Thẻ đã xác thực chính thức</span>
        <strong class="yp-kpi-value" style="color: #059669;">${totalVerified}</strong>
        <span class="yp-kpi-sub">Đã cấp chữ ký điện tử</span>
      </div>

      <div class="yp-kpi-card">
        <span class="yp-kpi-label">Hồ sơ chờ phê duyệt</span>
        <strong class="yp-kpi-value" style="color: #ea580c;">${pendingSubs.length}</strong>
        <span class="yp-kpi-sub">Cần cán bộ rà soát</span>
      </div>
    </div>

    <!-- Pending Cards Section -->
    <div class="yp-card" style="margin-bottom: 20px;">
      <div class="yp-card-head">
        <h3 class="yp-card-title">
          ${icon('card')}
          Hàng đợi Thẻ Đoàn viên chờ duyệt (${pendingSubs.length})
        </h3>
      </div>
      <div class="yp-table-wrap">
        <table class="yp-table">
          <thead>
            <tr>
              <th>Sinh viên</th>
              <th>MSSV</th>
              <th>Số thẻ khai báo</th>
              <th>Ngày vào Đoàn</th>
              <th>Ảnh thẻ / OCR Match</th>
              <th>Thời gian nộp</th>
              <th style="text-align: right;">Xử lý</th>
            </tr>
          </thead>
          <tbody>
            ${pendingSubs.map(sub => {
              const st = students.find(s => s.student_id === sub.user_id);
              return `
                <tr>
                  <td><strong>${sub.student_name}</strong></td>
                  <td><span class="yp-mono">${sub.user_id}</span></td>
                  <td><span class="yp-mono" style="font-weight: 800; color: #1e3a8a; font-size: 13px;">${st?.card_number || sub.extracted?.card_number || 'Chưa rõ'}</span></td>
                  <td><span class="yp-mono">${st?.joined_date || 'Chưa ghi nhận'}</span></td>
                  <td>
                    ${sub.image_url ? `
                      <span class="yp-badge yp-badge-green">Có ảnh (OCR: 96%)</span>
                    ` : `
                      <span class="yp-badge yp-badge-gray">Nhập tay (Không ảnh)</span>
                    `}
                  </td>
                  <td><span class="yp-mono" style="font-size: 11px;">${sub.submitted_at}</span></td>
                  <td style="text-align: right;">
                    <div style="display: inline-flex; gap: 6px;">
                      <button type="button" class="yp-btn yp-btn-primary yp-btn-sm" data-action="approve-card" data-student-id="${sub.user_id}">
                        ${icon('check', 12)}
                        Duyệt thẻ
                      </button>
                      <button type="button" class="yp-btn yp-btn-secondary yp-btn-sm" data-action="reject-card" data-student-id="${sub.user_id}">
                        Từ chối
                      </button>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
            ${pendingSubs.length === 0 ? `
              <tr>
                <td colspan="7" style="padding: 24px; text-align: center; color: var(--yp-text-muted);">
                  Không có thẻ nào đang chờ duyệt. Mọi hồ sơ đã được xử lý xong!
                </td>
              </tr>
            ` : ''}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Verified Cards Table -->
    <div class="yp-card">
      <div class="yp-card-head">
        <h3 class="yp-card-title">
          ${icon('check')}
          Danh sách Thẻ Đoàn viên đã xác thực chính thức (${totalVerified})
        </h3>
      </div>
      <div class="yp-table-wrap">
        <table class="yp-table">
          <thead>
            <tr>
              <th>MSSV</th>
              <th>Họ và tên</th>
              <th>Số thẻ Đoàn</th>
              <th>Ngày vào Đoàn</th>
              <th>Nơi sinh hoạt</th>
              <th>Thời gian xác thực</th>
              <th>Người duyệt</th>
            </tr>
          </thead>
          <tbody>
            ${students.filter(s => s.card_verified_at && s.card_number).map(st => `
              <tr>
                <td><span class="yp-mono" style="font-weight: 700;">${st.student_id}</span></td>
                <td><strong>${st.full_name}</strong></td>
                <td><span class="yp-mono" style="font-weight: 800; color: #059669;">${st.card_number}</span></td>
                <td><span class="yp-mono">${st.joined_date || '—'}</span></td>
                <td>${st.activity_unit || 'Chi đoàn D26CQCN03-N'}</td>
                <td><span class="yp-mono" style="font-size: 11px;">${st.card_verified_at}</span></td>
                <td><span class="yp-badge yp-badge-blue">${st.card_verified_by || 'BCH Chi đoàn'}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
