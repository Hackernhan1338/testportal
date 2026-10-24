import { store } from '../../store';
import { icon } from '../../components/icons';

export function renderUserTasks(): string {
  const u = store.getCurrentUser();
  const tasks = store.getTasks().filter(t => t.active);
  const submissions = store.getSubmissions().filter(s => s.user_id === u.student_id);

  return `
    <div class="yp-page-head" style="margin-bottom: 20px;">
      <div>
        <h1 style="font-size: 20px; font-weight: 800; color: var(--yp-navy-850); margin: 0 0 4px;">Nhiệm vụ & Minh chứng hoạt động</h1>
        <p style="font-size: 12.5px; color: var(--yp-text-muted); margin: 0;">Hoàn thành nhiệm vụ Chi đoàn giao và nộp ảnh minh chứng để được ghi nhận điểm rèn luyện</p>
      </div>
    </div>

    <!-- Active Tasks List -->
    <div style="display: grid; gap: 16px; margin-bottom: 26px;">
      ${tasks.map(t => {
        const sub = submissions.find(s => s.task_id === t.id);
        const isPassed = sub?.status === 'passed';
        const isPending = sub?.status === 'pending';
        const isRejected = sub?.status === 'rejected';

        return `
          <div class="yp-card" style="margin: 0;">
            <div class="yp-card-head">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span class="yp-badge ${t.category === 'card' ? 'yp-badge-blue' : t.category === 'competition' ? 'yp-badge-amber' : 'yp-badge-gray'}">
                  ${t.category.toUpperCase()}
                </span>
                <h3 style="font-size: 14px; font-weight: 750; color: var(--yp-text-main); margin: 0;">${t.title}</h3>
              </div>
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 12px; font-weight: 700; color: #d97706;">+${t.points} điểm rèn luyện</span>
                ${isPassed ? `
                  <span class="yp-badge yp-badge-green">✓ Đã duyệt</span>
                ` : isPending ? `
                  <span class="yp-badge yp-badge-amber">⏳ Đang chờ duyệt</span>
                ` : isRejected ? `
                  <span class="yp-badge yp-badge-red">✕ Cần nộp lại</span>
                ` : `
                  <span class="yp-badge yp-badge-gray">Chưa hoàn thành</span>
                `}
              </div>
            </div>

            <div class="yp-card-body">
              <p style="font-size: 13px; color: var(--yp-text-main); margin: 0 0 12px; line-height: 1.5;">${t.description}</p>
              
              <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; padding-top: 10px; border-top: 1px solid var(--yp-border-light);">
                <div style="font-size: 11.5px; color: var(--yp-text-muted);">
                  Hạn chót: <span class="yp-mono" style="color: var(--yp-text-main); font-weight: 600;">${t.due_at}</span>
                </div>

                <div>
                  ${isPassed ? `
                    <div style="font-size: 12px; color: #059669; font-weight: 600;">
                      Đã hoàn thành xuất sắc! Cán bộ phê duyệt: "${sub?.feedback}"
                    </div>
                  ` : isPending ? `
                    <div style="font-size: 12px; color: #b45309;">
                      Minh chứng đã gửi lúc <span class="yp-mono">${sub?.submitted_at}</span>. Ban Chấp hành đang kiểm tra.
                    </div>
                  ` : `
                    <button type="button" class="yp-btn yp-btn-primary yp-btn-sm" data-action="open-submit-modal" data-task-id="${t.id}" data-task-title="${t.title}">
                      ${icon('upload', 14)}
                      Nộp ảnh minh chứng
                    </button>
                  `}
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>

    <!-- Modal Nộp Minh Chứng -->
    <div id="submit-proof-modal" class="yp-modal-backdrop" style="display: none;">
      <div class="yp-modal" style="max-width: 520px;">
        <div class="yp-modal-header">
          <h3 id="submit-modal-title" style="margin: 0; font-size: 15px; font-weight: 750; color: var(--yp-navy-850);">Nộp minh chứng hoạt động</h3>
          <button type="button" class="yp-btn yp-btn-secondary yp-btn-sm" data-action="close-submit-modal" style="padding: 4px 8px;">✕</button>
        </div>
        <form id="submit-proof-form">
          <input type="hidden" id="submit-task-id" />
          <div class="yp-modal-body" style="display: grid; gap: 14px;">
            <p style="font-size: 12px; color: var(--yp-text-muted); margin: 0;">
              Vui lòng tải lên hình ảnh minh chứng rõ nét (ảnh chụp thẻ, chứng nhận, kết quả thi hoặc ảnh tham gia hoạt động).
            </p>

            <div>
              <label style="display: block; font-size: 12px; font-weight: 750; color: var(--yp-text-main); margin-bottom: 6px;">
                Chọn tệp ảnh minh chứng (JPG, PNG, WebP)
              </label>
              <input type="file" id="proof-file" accept="image/*" required style="width: 100%; font-size: 12px;" />
            </div>

            <div>
              <label style="display: block; font-size: 12px; font-weight: 750; color: var(--yp-text-main); margin-bottom: 6px;">
                Ghi chú kèm theo (nếu có)
              </label>
              <textarea id="proof-note" rows="3" placeholder="Nhập tóm tắt quá trình tham gia hoặc chi tiết cần lưu ý..."
                        style="width: 100%; padding: 8px 12px; border: 1px solid var(--yp-border); border-radius: var(--yp-radius-md); font-size: 12.5px; box-sizing: border-box;"></textarea>
            </div>
          </div>
          <div class="yp-modal-footer">
            <button type="button" class="yp-btn yp-btn-secondary" data-action="close-submit-modal">Hủy</button>
            <button type="submit" class="yp-btn yp-btn-primary">
              ${icon('check')}
              Gửi minh chứng
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}
