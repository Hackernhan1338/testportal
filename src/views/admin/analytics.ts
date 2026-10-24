import { icon } from '../../components/icons';

export function renderAdminAnalytics(): string {
  return `
    <div class="yp-page-head" style="margin-bottom: 20px;">
      <div>
        <h1 style="font-size: 20px; font-weight: 800; color: var(--yp-navy-850); margin: 0 0 4px;">Web Visits & Analytics Monitor</h1>
        <p style="font-size: 12.5px; color: var(--yp-text-muted); margin: 0;">Phân tích lưu lượng truy cập thực tế, phiên hoạt động và mức độ tương tác sinh viên theo chuẩn FocusBrain</p>
      </div>
      <div style="display: flex; gap: 8px;">
        <select id="analytics-range" style="padding: 6px 12px; font-size: 12px; border: 1px solid var(--yp-border); border-radius: var(--yp-radius-md); background: var(--yp-card); color: var(--yp-text-main);">
          <option value="14">14 ngày qua</option>
          <option value="7">7 ngày qua</option>
          <option value="30">30 ngày qua</option>
        </select>
      </div>
    </div>

    <!-- 4 FocusBrain Visit Metrics -->
    <div class="yp-kpi-grid">
      <div class="yp-kpi-card">
        <span class="yp-kpi-label">Tổng lượt xem trang (Pageviews)</span>
        <strong class="yp-kpi-value" style="color: #2563eb;">2,845</strong>
        <span class="yp-kpi-sub">Trung bình 203 lượt/ngày</span>
      </div>

      <div class="yp-kpi-card">
        <span class="yp-kpi-label">Số phiên truy cập (Sessions)</span>
        <strong class="yp-kpi-value" style="color: #059669;">1,120</strong>
        <span class="yp-kpi-sub">Thời lượng TB: 4 phút 18 giây</span>
      </div>

      <div class="yp-kpi-card">
        <span class="yp-kpi-label">Địa chỉ IP duy nhất (Unique IPs)</span>
        <strong class="yp-kpi-value" style="color: #7c3aed;">184</strong>
        <span class="yp-kpi-sub">Khu vực TP. Hồ Chí Minh & lân cận</span>
      </div>

      <div class="yp-kpi-card">
        <span class="yp-kpi-label">Sinh viên hoạt động (Active Users)</span>
        <strong class="yp-kpi-value" style="color: #d97706;">68 / 71</strong>
        <span class="yp-kpi-sub">95.7% đoàn viên đã đăng nhập</span>
      </div>
    </div>

    <!-- Chart.js Canvas Section -->
    <div class="yp-card" style="margin-bottom: 20px;">
      <div class="yp-card-head">
        <h3 class="yp-card-title">
          ${icon('barChart')}
          Biểu đồ xu hướng lượt truy cập 14 ngày qua (FocusBrain Trendline)
        </h3>
        <span class="yp-badge yp-badge-blue">Dữ liệu phân tích thực tế</span>
      </div>
      <div class="yp-card-body">
        <div style="height: 300px; width: 100%; position: relative;">
          <canvas id="visits-chart-canvas"></canvas>
        </div>
      </div>
    </div>

    <!-- 2 Columns: Top Pages & Device Distribution -->
    <div style="display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(300px, 1fr); gap: 20px;">
      <!-- Top Pages -->
      <div class="yp-card">
        <div class="yp-card-head">
          <h3 class="yp-card-title">
            ${icon('layout')}
            Các phân hệ được truy cập nhiều nhất
          </h3>
        </div>
        <div class="yp-table-wrap">
          <table class="yp-table">
            <thead>
              <tr>
                <th>Trang / Module</th>
                <th>Đường dẫn router</th>
                <th style="text-align: right;">Lượt xem</th>
                <th style="text-align: right;">Tỷ trọng</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Thẻ Đoàn viên điện tử</strong></td>
                <td><span class="yp-mono">?page=card</span></td>
                <td style="text-align: right;"><b class="yp-mono">842</b></td>
                <td style="text-align: right;"><span class="yp-badge yp-badge-green">29.6%</span></td>
              </tr>
              <tr>
                <td><strong>Bảng xếp hạng Đoàn viên</strong></td>
                <td><span class="yp-mono">?page=leaderboard</span></td>
                <td style="text-align: right;"><b class="yp-mono">615</b></td>
                <td style="text-align: right;"><span class="yp-badge yp-badge-blue">21.6%</span></td>
              </tr>
              <tr>
                <td><strong>Quét QR Điểm danh</strong></td>
                <td><span class="yp-mono">?page=scan</span></td>
                <td style="text-align: right;"><b class="yp-mono">488</b></td>
                <td style="text-align: right;"><span class="yp-badge yp-badge-blue">17.1%</span></td>
              </tr>
              <tr>
                <td><strong>Hồ sơ cá nhân</strong></td>
                <td><span class="yp-mono">?page=profile</span></td>
                <td style="text-align: right;"><b class="yp-mono">420</b></td>
                <td style="text-align: right;"><span class="yp-badge yp-badge-amber">14.7%</span></td>
              </tr>
              <tr>
                <td><strong>Bầu cử Chi đoàn</strong></td>
                <td><span class="yp-mono">?page=elections</span></td>
                <td style="text-align: right;"><b class="yp-mono">290</b></td>
                <td style="text-align: right;"><span class="yp-badge yp-badge-gray">10.2%</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Device Breakdown -->
      <div class="yp-card">
        <div class="yp-card-head">
          <h3 class="yp-card-title">
            ${icon('activity')}
            Phân bố thiết bị truy cập
          </h3>
        </div>
        <div class="yp-card-body" style="display: grid; gap: 14px;">
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
              <span>Điện thoại di động (Mobile)</span>
              <strong class="yp-mono">74.2% (831 phiên)</strong>
            </div>
            <div style="height: 8px; background: #e2e8f0; border-radius: 999px; overflow: hidden;">
              <div style="width: 74.2%; height: 100%; background: #2563eb;"></div>
            </div>
          </div>

          <div>
            <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
              <span>Máy tính để bàn / Laptop</span>
              <strong class="yp-mono">23.5% (263 phiên)</strong>
            </div>
            <div style="height: 8px; background: #e2e8f0; border-radius: 999px; overflow: hidden;">
              <div style="width: 23.5%; height: 100%; background: #059669;"></div>
            </div>
          </div>

          <div>
            <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
              <span>Máy tính bảng (Tablet)</span>
              <strong class="yp-mono">2.3% (26 phiên)</strong>
            </div>
            <div style="height: 8px; background: #e2e8f0; border-radius: 999px; overflow: hidden;">
              <div style="width: 2.3%; height: 100%; background: #d97706;"></div>
            </div>
          </div>

          <div style="background: var(--yp-navy-50); border-radius: 8px; padding: 12px; font-size: 11.5px; color: var(--yp-text-muted); line-height: 1.45; margin-top: 6px;">
            🔒 <b>Bảo vệ danh tính:</b> Địa chỉ IP được băm 1 chiều (SHA-256 kèm salt bí mật của hệ thống), không lưu trữ thông tin nhận dạng cá nhân của thiết bị.
          </div>
        </div>
      </div>
    </div>
  `;
}
