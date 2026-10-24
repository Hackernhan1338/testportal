import { icon } from '../../components/icons';

export function renderAdminSmtp(): string {
  return `
    <div class="yp-page-head" style="margin-bottom: 20px;">
      <div>
        <h1 style="font-size: 20px; font-weight: 800; color: var(--yp-navy-850); margin: 0 0 4px;">Cấu hình Máy chủ Gửi thư SMTP</h1>
        <p style="font-size: 12.5px; color: var(--yp-text-muted); margin: 0;">Thiết lập dịch vụ gửi email khôi phục mật khẩu, mã OTP và thông báo triệu tập cho sinh viên</p>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(300px, 1fr); gap: 20px;">
      <!-- SMTP Config Form -->
      <div class="yp-card">
        <div class="yp-card-head">
          <h3 class="yp-card-title">
            ${icon('mail')}
            Thông số kết nối SMTP (Gmail / Hostinger Mail)
          </h3>
          <span class="yp-badge yp-badge-green">SSL/TLS</span>
        </div>
        <div class="yp-card-body">
          <form id="smtp-config-form" style="display: grid; gap: 14px;">
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 12px;">
              <div>
                <label style="display: block; font-size: 11.5px; font-weight: 700; color: var(--yp-text-main); margin-bottom: 4px;">SMTP Host</label>
                <input type="text" value="smtp.gmail.com" class="yp-mono"
                       style="width: 100%; padding: 8px 12px; border: 1px solid var(--yp-border); border-radius: var(--yp-radius-md); font-size: 13px; box-sizing: border-box;" />
              </div>
              <div>
                <label style="display: block; font-size: 11.5px; font-weight: 700; color: var(--yp-text-main); margin-bottom: 4px;">Port</label>
                <input type="number" value="587" class="yp-mono"
                       style="width: 100%; padding: 8px 12px; border: 1px solid var(--yp-border); border-radius: var(--yp-radius-md); font-size: 13px; box-sizing: border-box;" />
              </div>
            </div>

            <div>
              <label style="display: block; font-size: 11.5px; font-weight: 700; color: var(--yp-text-main); margin-bottom: 4px;">Tài khoản đăng nhập (Username / Email)</label>
              <input type="text" value="youth-portal@student.ptithcm.edu.vn" class="yp-mono"
                     style="width: 100%; padding: 8px 12px; border: 1px solid var(--yp-border); border-radius: var(--yp-radius-md); font-size: 13px; box-sizing: border-box;" />
            </div>

            <div>
              <label style="display: block; font-size: 11.5px; font-weight: 700; color: var(--yp-text-main); margin-bottom: 4px;">Mật khẩu ứng dụng (App Password)</label>
              <input type="password" value="••••••••••••••••" class="yp-mono"
                     style="width: 100%; padding: 8px 12px; border: 1px solid var(--yp-border); border-radius: var(--yp-radius-md); font-size: 13px; box-sizing: border-box;" />
              <small style="color: var(--yp-text-muted); font-size: 10.5px;">Bảo mật: Mật khẩu SMTP không được lưu trữ công khai trong JavaScript.</small>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div>
                <label style="display: block; font-size: 11.5px; font-weight: 700; color: var(--yp-text-main); margin-bottom: 4px;">Email người gửi (From Email)</label>
                <input type="email" value="youth-portal@ptithcm.edu.vn" class="yp-mono"
                       style="width: 100%; padding: 8px 12px; border: 1px solid var(--yp-border); border-radius: var(--yp-radius-md); font-size: 13px; box-sizing: border-box;" />
              </div>
              <div>
                <label style="display: block; font-size: 11.5px; font-weight: 700; color: var(--yp-text-main); margin-bottom: 4px;">Tên người gửi (From Name)</label>
                <input type="text" value="BCH Chi đoàn D26CQCN03-N"
                       style="width: 100%; padding: 8px 12px; border: 1px solid var(--yp-border); border-radius: var(--yp-radius-md); font-size: 13px; box-sizing: border-box;" />
              </div>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 6px;">
              <button type="submit" class="yp-btn yp-btn-primary">
                ${icon('check')}
                Lưu cấu hình SMTP
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Test Email Sender Box -->
      <div class="yp-card">
        <div class="yp-card-head">
          <h3 class="yp-card-title">
            ${icon('mail')}
            Gửi email thử nghiệm
          </h3>
        </div>
        <div class="yp-card-body">
          <p style="font-size: 12px; color: var(--yp-text-muted); margin: 0 0 14px;">
            Kiểm tra khả năng kết nối cổng 587 và tính sẵn sàng của máy chủ gửi thư tới hòm thư sinh viên.
          </p>

          <form id="smtp-test-form" style="display: grid; gap: 12px;">
            <div>
              <label style="display: block; font-size: 11.5px; font-weight: 700; color: var(--yp-text-main); margin-bottom: 4px;">Email nhận thử nghiệm</label>
              <input type="email" id="test-recipient-email" required placeholder="n26dccn185@student.ptithcm.edu.vn" class="yp-mono"
                     style="width: 100%; padding: 8px 12px; border: 1px solid var(--yp-border); border-radius: var(--yp-radius-md); font-size: 12.5px; box-sizing: border-box;" />
            </div>

            <button type="submit" class="yp-btn yp-btn-secondary" style="width: 100%;">
              ${icon('mail', 13)}
              Gửi email kiểm tra ngay
            </button>
          </form>

          <div id="smtp-test-result" style="display: none; margin-top: 14px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 10px; font-size: 11.5px; color: #166534;">
            ✓ Đã gửi thử nghiệm thành công tới máy chủ SMTP! Hộp thư sẵn sàng nhận OTP.
          </div>
        </div>
      </div>
    </div>
  `;
}
