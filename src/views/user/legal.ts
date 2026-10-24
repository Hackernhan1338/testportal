import { icon } from '../../components/icons';

export function renderUserLegal(): string {
  return `
    <div class="yp-page-head" style="margin-bottom: 20px;">
      <div>
        <h1 style="font-size: 20px; font-weight: 800; color: var(--yp-navy-850); margin: 0 0 4px;">Quy chế Tổ chức & Chính sách Bảo mật</h1>
        <p style="font-size: 12.5px; color: var(--yp-text-muted); margin: 0;">Phiên bản 4.8.4 · Ban hành áp dụng cho Chi đoàn D26CQCN03-N · PTIT HCM</p>
      </div>
    </div>

    <div style="display: grid; gap: 20px;">
      <!-- Điều khoản sử dụng -->
      <div class="yp-card">
        <div class="yp-card-head">
          <h3 class="yp-card-title">
            ${icon('fileText')}
            I. QUY CHẾ VẬN HÀNH & NGUYÊN TẮC QUẢN LÝ ĐOÀN VIÊN
          </h3>
          <span class="yp-badge yp-badge-blue">Phiên bản 2026.1</span>
        </div>
        <div class="yp-card-body" style="font-size: 13px; color: var(--yp-text-main); line-height: 1.6;">
          <h4 style="font-size: 13.5px; font-weight: 750; color: var(--yp-navy-850); margin: 0 0 6px;">1. Mục đích hệ thống</h4>
          <p style="margin: 0 0 12px;">
            PTIT Youth Portal là cổng thông tin điện tử nội bộ phục vụ công tác quản lý sinh hoạt Đoàn, hỗ trợ theo dõi rèn luyện, số hóa thẻ Đoàn viên, điểm danh sự kiện và tổ chức bầu cử cho 71 sinh viên lớp D26CQCN03-N.
          </p>

          <h4 style="font-size: 13.5px; font-weight: 750; color: var(--yp-navy-850); margin: 0 0 6px;">2. Trách nhiệm của Đoàn viên</h4>
          <p style="margin: 0 0 12px;">
            Đoàn viên có nghĩa vụ cập nhật trung thực số thẻ Đoàn viên, tham gia các buổi sinh hoạt chi đoàn, tự giác điểm danh đúng giờ và chấp hành nguyên tắc bỏ phiếu trung thực, độc lập trong các kỳ Đại hội.
          </p>

          <h4 style="font-size: 13.5px; font-weight: 750; color: var(--yp-navy-850); margin: 0 0 6px;">3. Tuyên bố về tính chính thức</h4>
          <p style="margin: 0;">
            Hệ thống vận hành theo sự ủy quyền và phân công nhiệm vụ của Ban Chấp hành Chi đoàn D26CQCN03-N. Mọi thông tin điện tử là tài liệu số hóa hỗ trợ công tác quản trị, không thay thế con dấu và văn bản gốc do cơ quan Đoàn cấp trên ban hành.
          </p>
        </div>
      </div>

      <!-- Chính sách bảo mật dữ liệu -->
      <div class="yp-card">
        <div class="yp-card-head">
          <h3 class="yp-card-title">
            ${icon('shield')}
            II. CHÍNH SÁCH BẢO VỆ DỮ LIỆU CÁ NHÂN (DATA PRIVACY)
          </h3>
          <span class="yp-badge yp-badge-green">Bảo vệ nghiêm ngặt</span>
        </div>
        <div class="yp-card-body" style="font-size: 13px; color: var(--yp-text-main); line-height: 1.6;">
          <h4 style="font-size: 13.5px; font-weight: 750; color: var(--yp-navy-850); margin: 0 0 6px;">1. Dữ liệu thu thập</h4>
          <p style="margin: 0 0 12px;">
            Hệ thống lưu trữ các trường dữ liệu cần thiết phục vụ quản lý đoàn viên: MSSV, Họ tên, Ngày sinh, Chi đoàn, Chức vụ, Số thẻ, Điểm rèn luyện và lịch sử điểm danh.
          </p>

          <h4 style="font-size: 13.5px; font-weight: 750; color: var(--yp-navy-850); margin: 0 0 6px;">2. Quyền riêng tư đối với Bảng xếp hạng và Tra cứu</h4>
          <p style="margin: 0 0 12px;">
            - Số điện thoại, ngày sinh và email cá nhân tuyệt đối không bao giờ được đưa lên Bảng xếp hạng công khai.<br/>
            - Chức năng quét mã QR thẻ Đoàn viên được kiểm soát chặt chẽ bằng quyền Quản trị viên (RBAC); sinh viên hoặc người ngoài quét mã sẽ bị hệ thống từ chối hiển thị dữ liệu chi tiết.
          </p>

          <h4 style="font-size: 13.5px; font-weight: 750; color: var(--yp-navy-850); margin: 0 0 6px;">3. Bảo mật mật khẩu và phiên đăng nhập</h4>
          <p style="margin: 0;">
            Mọi mật khẩu đều được băm bằng thuật toán Bcrypt / Argon2id có độ phức tạp cao; mã PIN được bảo vệ độc lập. Dữ liệu phiên được mã hóa và tái tạo session ID khi đăng nhập để phòng chống tấn công Session Fixation.
          </p>
        </div>
      </div>
    </div>
  `;
}
