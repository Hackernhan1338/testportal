import { store } from '../../store';
import { icon } from '../../components/icons';

export function renderAdminTasks(): string {
  const tasks = store.getTasks();
  const submissions = store.getSubmissions();

  return `
    <div class="yp-page-head" style="margin-bottom: 20px;">
      <div>
        <h1 style="font-size: 20px; font-weight: 800; color: var(--yp-navy-850); margin: 0 0 4px;">Giao nhiệm vụ & Tiêu chuẩn minh chứng</h1>
        <p style="font-size: 12.5px; color: var(--yp-text-muted); margin: 0;">Quản lý danh sách nhiệm vụ phong trào, thiết lập điểm thưởng và yêu cầu nộp ảnh minh chứng</p>
      </div>
    </div>

    <div class="yp-card">
      <div class="yp-table-wrap">
        <table class="yp-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tiêu đề nhiệm vụ</th>
              <th>Phân loại</th>
              <th>Yêu cầu minh chứng</th>
              <th>Hạn chót</th>
              <th>Điểm thưởng</th>
              <th>Số bài đã nộp</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            ${tasks.map(t => {
              const subs = submissions.filter(s => s.task_id === t.id);
              const passedCount = subs.filter(s => s.status === 'passed').length;
              return `
                <tr>
                  <td><span class="yp-mono">#${t.id}</span></td>
                  <td><strong>${t.title}</strong></td>
                  <td>
                    <span class="yp-badge ${t.category === 'card' ? 'yp-badge-blue' : t.category === 'competition' ? 'yp-badge-amber' : 'yp-badge-gray'}">
                      ${t.category.toUpperCase()}
                    </span>
                  </td>
                  <td>${t.type === 'photo' ? 'Ảnh chụp / OCR' : 'Xác nhận biểu mẫu'}</td>
                  <td><span class="yp-mono">${t.due_at.substring(0, 10)}</span></td>
                  <td><strong style="color: #d97706;">+${t.points} điểm</strong></td>
                  <td>
                    <span class="yp-mono">${subs.length} nộp (${passedCount} đạt)</span>
                  </td>
                  <td>
                    <span class="yp-badge ${t.active ? 'yp-badge-green' : 'yp-badge-gray'}">
                      ${t.active ? 'Hoạt động' : 'Tạm dừng'}
                    </span>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
