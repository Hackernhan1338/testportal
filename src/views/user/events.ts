import { store } from '../../store';
import { icon } from '../../components/icons';

export function renderUserEvents(): string {
  const u = store.getCurrentUser();
  const events = store.getEvents().filter(e => e.active);
  const attendances = store.getAttendances().filter(a => a.student_id === u.student_id);

  return `
    <div class="yp-page-head" style="margin-bottom: 20px;">
      <div>
        <h1 style="font-size: 20px; font-weight: 800; color: var(--yp-navy-850); margin: 0 0 4px;">Sự kiện & Hội thảo Chi đoàn</h1>
        <p style="font-size: 12.5px; color: var(--yp-text-muted); margin: 0;">Theo dõi các chương trình sinh hoạt định kỳ, chuyên đề học thuật và điểm danh bằng mã QR</p>
      </div>
      <div>
        <a data-nav="scan" class="yp-btn yp-btn-primary">
          ${icon('scan')}
          Mở máy quét QR Điểm danh
        </a>
      </div>
    </div>

    <div style="display: grid; gap: 16px;">
      ${events.map(ev => {
        const isAttended = attendances.some(a => a.event_id === ev.id);
        const myAtt = attendances.find(a => a.event_id === ev.id);

        return `
          <div class="yp-card" style="margin: 0;">
            <div class="yp-card-head">
              <h3 style="font-size: 14px; font-weight: 750; color: var(--yp-text-main); margin: 0;">${ev.title}</h3>
              <div>
                ${isAttended ? `
                  <span class="yp-badge yp-badge-green">✓ Đã điểm danh (+${ev.points} điểm)</span>
                ` : `
                  <span class="yp-badge yp-badge-amber">Chưa điểm danh</span>
                `}
              </div>
            </div>
            <div class="yp-card-body">
              <p style="font-size: 13px; color: var(--yp-text-main); margin: 0 0 14px; line-height: 1.5;">${ev.description}</p>
              
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; font-size: 12px; background: var(--yp-navy-50); border: 1px solid var(--yp-border); border-radius: var(--yp-radius-md); padding: 12px 14px; margin-bottom: 14px;">
                <div>
                  <span style="color: var(--yp-text-muted); display: block; font-size: 10.5px; text-transform: uppercase; font-weight: 700;">Địa điểm tổ chức</span>
                  <strong style="color: var(--yp-text-main);">${ev.location}</strong>
                </div>
                <div>
                  <span style="color: var(--yp-text-muted); display: block; font-size: 10.5px; text-transform: uppercase; font-weight: 700;">Thời gian bắt đầu</span>
                  <span class="yp-mono" style="color: var(--yp-text-main); font-weight: 600;">${ev.start_at}</span>
                </div>
                <div>
                  <span style="color: var(--yp-text-muted); display: block; font-size: 10.5px; text-transform: uppercase; font-weight: 700;">Điểm rèn luyện thưởng</span>
                  <strong style="color: #059669;">+${ev.points} điểm</strong>
                </div>
              </div>

              <div style="display: flex; justify-content: flex-end; align-items: center; gap: 10px;">
                ${isAttended ? `
                  <span style="font-size: 11.5px; color: var(--yp-text-muted);">
                    Điểm danh lúc: <b class="yp-mono">${myAtt?.checked_at}</b> (Phương thức: ${myAtt?.method.toUpperCase()})
                  </span>
                ` : `
                  <a data-nav="scan" class="yp-btn yp-btn-primary yp-btn-sm">
                    ${icon('scan', 13)}
                    Điểm danh sự kiện này
                  </a>
                `}
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}
