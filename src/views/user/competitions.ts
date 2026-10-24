import { store } from '../../store';
import { icon } from '../../components/icons';

export function renderUserCompetitions(): string {
  const u = store.getCurrentUser();
  const tasks = store.getTasks().filter(t => t.category === 'competition');
  const submissions = store.getSubmissions().filter(s => s.user_id === u.student_id);

  return `
    <div class="yp-page-head" style="margin-bottom: 20px;">
      <div>
        <h1 style="font-size: 20px; font-weight: 800; color: var(--yp-navy-850); margin: 0 0 4px;">Cuộc thi & Phong trào Thanh niên</h1>
        <p style="font-size: 12.5px; color: var(--yp-text-muted); margin: 0;">Các hội thi học thuật, tìm hiểu lịch sử truyền thống và phong trào thi đua cấp Đoàn trường</p>
      </div>
    </div>

    <div style="display: grid; gap: 16px;">
      ${tasks.map(t => {
        const sub = submissions.find(s => s.task_id === t.id);
        const isPassed = sub?.status === 'passed';

        return `
          <div class="yp-card" style="margin: 0;">
            <div class="yp-card-head">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span class="yp-badge yp-badge-amber">HỘI THI</span>
                <h3 style="font-size: 14px; font-weight: 750; color: var(--yp-text-main); margin: 0;">${t.title}</h3>
              </div>
              <span class="yp-badge ${isPassed ? 'yp-badge-green' : 'yp-badge-blue'}">
                ${isPassed ? '✓ Đã hoàn thành' : 'Đang mở nhận bài'}
              </span>
            </div>
            <div class="yp-card-body">
              <p style="font-size: 13px; color: var(--yp-text-main); margin: 0 0 12px; line-height: 1.5;">${t.description}</p>
              
              <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 10px; border-top: 1px solid var(--yp-border-light); font-size: 12px;">
                <span style="color: var(--yp-text-muted);">Hạn nộp bài: <b class="yp-mono">${t.due_at}</b></span>
                <span style="font-weight: 700; color: #d97706;">Điểm thưởng: +${t.points} điểm</span>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}
