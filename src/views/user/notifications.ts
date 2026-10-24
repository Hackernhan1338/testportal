import { store } from '../../store';
import { icon } from '../../components/icons';

export function renderUserNotifications(): string {
  const u = store.getCurrentUser();
  const notices = store.getNotices();

  return `
    <div class="yp-page-head" style="margin-bottom: 20px;">
      <div>
        <h1 style="font-size: 20px; font-weight: 800; color: var(--yp-navy-850); margin: 0 0 4px;">Trung tâm thông báo Chi đoàn</h1>
        <p style="font-size: 12.5px; color: var(--yp-text-muted); margin: 0;">Các quyết định, thông báo triệu tập, hướng dẫn và cảnh báo bảo mật từ Ban Chấp hành</p>
      </div>
      <div>
        <button type="button" class="yp-btn yp-btn-secondary yp-btn-sm" data-action="mark-all-read">
          ${icon('check', 13)}
          Đánh dấu tất cả đã đọc
        </button>
      </div>
    </div>

    <div style="display: grid; gap: 14px;">
      ${notices.map(n => {
        const isRead = n.read_by.includes(u.student_id);
        const badgeClass = n.kind === 'required' ? 'yp-badge-red' : n.kind === 'security' ? 'yp-badge-amber' : 'yp-badge-blue';
        const badgeLabel = n.kind === 'required' ? 'BẮT BUỘC' : n.kind === 'security' ? 'AN TOÀN BẢO MẬT' : 'THÔNG BÁO CHUNG';

        return `
          <div class="yp-card" style="margin: 0; border-left: 4px solid ${n.kind === 'required' ? 'var(--yp-red-600)' : n.kind === 'security' ? 'var(--yp-gold-500)' : 'var(--yp-navy-700)'};">
            <div class="yp-card-head" style="background: ${isRead ? 'var(--yp-card-head)' : 'var(--yp-navy-50)'};">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="yp-badge ${badgeClass}">${badgeLabel}</span>
                <h3 style="font-size: 14px; font-weight: 750; color: var(--yp-text-main); margin: 0;">${n.title}</h3>
              </div>
              <div style="display: flex; align-items: center; gap: 10px;">
                <span class="yp-mono" style="font-size: 11px; color: var(--yp-text-muted);">${n.created_at}</span>
                ${isRead ? `
                  <span style="font-size: 11px; color: var(--yp-text-muted);">Đã đọc</span>
                ` : `
                  <button type="button" class="yp-btn yp-btn-primary yp-btn-sm" data-action="mark-read" data-notice-id="${n.id}">
                    Đọc xong
                  </button>
                `}
              </div>
            </div>
            <div class="yp-card-body" style="font-size: 13px; color: var(--yp-text-main); line-height: 1.6;">
              ${n.body}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}
