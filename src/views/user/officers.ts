import { store } from '../../store';
import { icon } from '../../components/icons';

export function renderUserOfficers(): string {
  const officers = store.getStudents().filter(s => s.position_title && s.position_title !== 'Đoàn viên');

  return `
    <div class="yp-page-head" style="margin-bottom: 20px;">
      <div>
        <h1 style="font-size: 20px; font-weight: 800; color: var(--yp-navy-850); margin: 0 0 4px;">Danh sách Cán bộ Đoàn Chi đoàn</h1>
        <p style="font-size: 12.5px; color: var(--yp-text-muted); margin: 0;">Ban Chấp hành Chi đoàn D26CQCN03-N · Khóa 2026 - 2027 · Học viện Công nghệ Bưu chính Viễn thông</p>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
      ${officers.map(off => `
        <div class="yp-card" style="margin: 0; padding: 20px; text-align: center;">
          <div style="width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, #1e3a8a 0%, #172554 100%); color: #fff; font-size: 22px; font-weight: 800; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; border: 3px solid #60a5fa; box-shadow: 0 4px 10px rgba(30, 58, 138, 0.2);">
            ${off.full_name.split(' ').pop()?.charAt(0) || 'C'}
          </div>
          <h3 style="font-size: 15px; font-weight: 800; color: var(--yp-text-main); margin: 0 0 4px;">${off.full_name}</h3>
          <span class="yp-badge yp-badge-red" style="margin-bottom: 8px;">${off.position_title}</span>
          <div class="yp-mono" style="font-size: 11.5px; color: var(--yp-text-muted); margin-bottom: 12px;">
            ${off.student_id} · STT ${off.class_number}
          </div>

          <div style="background: var(--yp-navy-50); border-radius: 8px; padding: 10px 12px; font-size: 11.5px; text-align: left; line-height: 1.5; color: var(--yp-text-muted);">
            <div>Email: <b class="yp-mono" style="color: var(--yp-text-main);">${off.email}</b></div>
            <div>Quê quán: <b style="color: var(--yp-text-main);">${off.hometown || 'Chưa cập nhật'}</b></div>
            <div>Sinh hoạt: <b style="color: var(--yp-text-main);">${off.activity_unit || 'Chi đoàn D26CQCN03-N'}</b></div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}
