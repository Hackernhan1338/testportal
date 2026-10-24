import { store } from '../../store';
import { icon } from '../../components/icons';

export function renderUserSecurity(): string {
  const u = store.getCurrentUser();

  return `
    <div class="yp-page-head" style="margin-bottom: 20px;">
      <div>
        <h1 style="font-size: 20px; font-weight: 800; color: var(--yp-navy-850); margin: 0 0 4px;">Bảo mật tài khoản & Mã PIN</h1>
        <p style="font-size: 12.5px; color: var(--yp-text-muted); margin: 0;">Quản lý mật khẩu truy cập, mã PIN 6 số xác thực giao dịch Đoàn và nhật ký phiên</p>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px;">
      <!-- Đổi mật khẩu -->
      <div class="yp-card">
        <div class="yp-card-head">
          <h3 class="yp-card-title">
            ${icon('lock')}
            Đổi mật khẩu tài khoản
          </h3>
        </div>
        <div class="yp-card-body">
          <form id="change-pass-form" style="display: grid; gap: 14px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 750; color: var(--yp-text-main); margin-bottom: 6px;">
                Mật khẩu hiện tại
              </label>
              <input type="password" required placeholder="Nhập mật khẩu hiện tại..."
                     style="width: 100%; padding: 8px 12px; border: 1px solid var(--yp-border); border-radius: var(--yp-radius-md); font-size: 13px; box-sizing: border-box;" />
            </div>

            <div>
              <label style="display: block; font-size: 12px; font-weight: 750; color: var(--yp-text-main); margin-bottom: 6px;">
                Mật khẩu mới (Tối thiểu 12 ký tự)
              </label>
              <input type="password" minlength="12" required placeholder="Tối thiểu 12 ký tự gồm chữ hoa, số..."
                     style="width: 100%; padding: 8px 12px; border: 1px solid var(--yp-border); border-radius: var(--yp-radius-md); font-size: 13px; box-sizing: border-box;" />
            </div>

            <div>
              <label style="display: block; font-size: 12px; font-weight: 750; color: var(--yp-text-main); margin-bottom: 6px;">
                Xác nhận mật khẩu mới
              </label>
              <input type="password" minlength="12" required placeholder="Nhập lại mật khẩu mới..."
                     style="width: 100%; padding: 8px 12px; border: 1px solid var(--yp-border); border-radius: var(--yp-radius-md); font-size: 13px; box-sizing: border-box;" />
            </div>

            <div style="background: var(--yp-navy-50); border: 1px solid var(--yp-border); border-radius: 6px; padding: 10px; font-size: 11.5px; color: var(--yp-text-muted);">
              ⚠️ <b>Quy định an toàn:</b> Hệ thống cấm sử dụng ngày sinh (ddmmyyyy) làm mật khẩu vĩnh viễn. Mật khẩu phải bảo đảm độ phức tạp để bảo vệ tài khoản.
            </div>

            <div style="display: flex; justify-content: flex-end;">
              <button type="submit" class="yp-btn yp-btn-primary">
                ${icon('check')}
                Cập nhật mật khẩu
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Thiết lập mã PIN 6 số -->
      <div class="yp-card">
        <div class="yp-card-head">
          <h3 class="yp-card-title">
            ${icon('shield')}
            Mã PIN 6 số xác thực
          </h3>
          <span class="yp-badge yp-badge-green">Băm Argon2id / Bcrypt</span>
        </div>
        <div class="yp-card-body">
          <form id="change-pin-form" style="display: grid; gap: 14px;">
            <p style="font-size: 12px; color: var(--yp-text-muted); margin: 0; line-height: 1.5;">
              Mã PIN 6 số dùng để xác nhận các thao tác quan trọng như: biểu quyết bầu cử, cập nhật số thẻ Đoàn viên hoặc yêu cầu cấp lại chứng nhận.
            </p>

            <div>
              <label style="display: block; font-size: 12px; font-weight: 750; color: var(--yp-text-main); margin-bottom: 6px;">
                Mã PIN mới (Đúng 6 chữ số)
              </label>
              <input type="password" maxlength="6" pattern="\\d{6}" required placeholder="••••••" class="yp-mono"
                     style="width: 100%; padding: 8px 12px; border: 1px solid var(--yp-border); border-radius: var(--yp-radius-md); font-size: 18px; letter-spacing: 0.3em; text-align: center; box-sizing: border-box;" />
            </div>

            <div>
              <label style="display: block; font-size: 12px; font-weight: 750; color: var(--yp-text-main); margin-bottom: 6px;">
                Xác nhận mã PIN
              </label>
              <input type="password" maxlength="6" pattern="\\d{6}" required placeholder="••••••" class="yp-mono"
                     style="width: 100%; padding: 8px 12px; border: 1px solid var(--yp-border); border-radius: var(--yp-radius-md); font-size: 18px; letter-spacing: 0.3em; text-align: center; box-sizing: border-box;" />
            </div>

            <div style="display: flex; justify-content: flex-end;">
              <button type="submit" class="yp-btn yp-btn-primary">
                ${icon('check')}
                Lưu mã PIN
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
}
