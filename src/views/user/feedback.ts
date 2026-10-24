import { store } from '../../store';
import { icon } from '../../components/icons';

export function renderUserFeedback(): string {
  const u = store.getCurrentUser();
  const feedbackList = store.getFeedback().filter(f => f.student_id === u.student_id);

  return `
    <div class="yp-page-head" style="margin-bottom: 20px;">
      <div>
        <h1 style="font-size: 20px; font-weight: 800; color: var(--yp-navy-850); margin: 0 0 4px;">Góp ý & Nguyện vọng Đoàn viên</h1>
        <p style="font-size: 12.5px; color: var(--yp-text-muted); margin: 0;">Gửi ý kiến đóng góp xây dựng Chi đoàn, đề xuất hoạt động hoặc phản ánh khó khăn</p>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(320px, 1.5fr); gap: 20px;">
      <!-- Form Góp ý -->
      <div class="yp-card">
        <div class="yp-card-head">
          <h3 class="yp-card-title">
            ${icon('message')}
            Gửi phiếu góp ý mới
          </h3>
        </div>
        <div class="yp-card-body">
          <form id="feedback-submit-form" style="display: grid; gap: 14px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 750; color: var(--yp-text-main); margin-bottom: 6px;">
                Chủ đề góp ý
              </label>
              <input type="text" id="feedback-subject" required placeholder="VD: Đề xuất tổ chức workshop kỹ năng Git & GitHub..."
                     style="width: 100%; padding: 8px 12px; border: 1px solid var(--yp-border); border-radius: var(--yp-radius-md); font-size: 13px; box-sizing: border-box;" />
            </div>

            <div>
              <label style="display: block; font-size: 12px; font-weight: 750; color: var(--yp-text-main); margin-bottom: 6px;">
                Mức độ ưu tiên
              </label>
              <select id="feedback-priority" style="width: 100%; padding: 8px 12px; border: 1px solid var(--yp-border); border-radius: var(--yp-radius-md); font-size: 13px; background: var(--yp-card); color: var(--yp-text-main);">
                <option value="normal">Bình thường (Đề xuất ý tưởng)</option>
                <option value="low">Tham khảo (Góp ý định kỳ)</option>
                <option value="high">Cần giải quyết sớm (Khó khăn, vướng mắc)</option>
              </select>
            </div>

            <div>
              <label style="display: block; font-size: 12px; font-weight: 750; color: var(--yp-text-main); margin-bottom: 6px;">
                Nội dung chi tiết
              </label>
              <textarea id="feedback-body" rows="5" required placeholder="Trình bày cụ thể nội dung đề xuất hoặc vấn đề cần Ban Chấp hành hỗ trợ..."
                        style="width: 100%; padding: 8px 12px; border: 1px solid var(--yp-border); border-radius: var(--yp-radius-md); font-size: 12.5px; box-sizing: border-box;"></textarea>
            </div>

            <div style="display: flex; justify-content: flex-end;">
              <button type="submit" class="yp-btn yp-btn-primary">
                ${icon('check')}
                Gửi góp ý tới BCH
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Lịch sử Góp ý -->
      <div class="yp-card">
        <div class="yp-card-head">
          <h3 class="yp-card-title">
            ${icon('clock')}
            Lịch sử phiếu đã gửi (${feedbackList.length})
          </h3>
        </div>
        <div class="yp-card-body" style="padding: 14px;">
          ${feedbackList.length > 0 ? `
            <div style="display: grid; gap: 12px;">
              ${feedbackList.map(f => `
                <div style="border: 1px solid var(--yp-border); border-radius: 8px; padding: 14px; background: var(--yp-card);">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
                    <strong style="font-size: 13px; color: var(--yp-text-main);">${f.subject}</strong>
                    <span class="yp-badge ${f.status === 'resolved' ? 'yp-badge-green' : f.status === 'processing' ? 'yp-badge-blue' : 'yp-badge-amber'}">
                      ${f.status === 'resolved' ? 'Đã phản hồi' : f.status === 'processing' ? 'Đang xử lý' : 'Chờ tiếp nhận'}
                    </span>
                  </div>
                  <p style="font-size: 12px; color: var(--yp-text-muted); margin: 0 0 10px; line-height: 1.4;">${f.body}</p>
                  
                  ${f.admin_reply ? `
                    <div style="background: var(--yp-navy-50); border-left: 3px solid var(--yp-navy-700); padding: 10px 12px; border-radius: 4px; font-size: 12px;">
                      <strong style="color: var(--yp-navy-850); display: block; margin-bottom: 2px;">Phản hồi từ Ban Chấp hành Chi đoàn:</strong>
                      <span style="color: var(--yp-text-main);">${f.admin_reply}</span>
                      <div class="yp-mono" style="font-size: 10px; color: var(--yp-text-muted); margin-top: 4px;">Trả lời lúc: ${f.replied_at}</div>
                    </div>
                  ` : `
                    <div style="font-size: 11px; color: var(--yp-text-muted);">
                      Gửi lúc: <span class="yp-mono">${f.created_at}</span>
                    </div>
                  `}
                </div>
              `).join('')}
            </div>
          ` : `
            <div style="padding: 40px 20px; text-align: center; color: var(--yp-text-muted); font-size: 12px;">
              Đồng chí chưa có phiếu góp ý nào. Hãy gửi ý kiến đóng góp bất cứ lúc nào!
            </div>
          `}
        </div>
      </div>
    </div>
  `;
}
