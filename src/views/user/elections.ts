import { store } from '../../store';
import { icon } from '../../components/icons';

export function renderUserElections(): string {
  const u = store.getCurrentUser();
  const elections = store.getElections();

  return `
    <div class="yp-page-head" style="margin-bottom: 20px;">
      <div>
        <h1 style="font-size: 20px; font-weight: 800; color: var(--yp-navy-850); margin: 0 0 4px;">Bầu cử Ban Chấp hành Chi đoàn</h1>
        <p style="font-size: 12.5px; color: var(--yp-text-muted); margin: 0;">Bỏ phiếu điện tử bảo mật, ẩn danh và chống gian lận cho kỳ Đại hội Chi đoàn D26CQCN03-N</p>
      </div>
    </div>

    <!-- Security & Secret Ballot Guarantee -->
    <div style="background: var(--yp-navy-50); border: 1px solid var(--yp-border); border-radius: var(--yp-radius-md); padding: 12px 16px; margin-bottom: 20px; font-size: 12px; color: var(--yp-text-muted);">
      <strong style="color: var(--yp-navy-850);">Nguyên tắc bầu cử bí mật (FocusBrain Secret Ballot Protocol):</strong>
      Hệ thống chỉ lưu nhận diện đồng chí đã hoàn thành việc bỏ phiếu trong bảng <code>voters</code> để ngăn chặn việc bỏ phiếu hai lần. Nội dung lá phiếu trong bảng <code>ballots</code> được lưu hoàn toàn ẩn danh, không chứa liên kết khóa ngoại tới danh tính cử tri.
    </div>

    <div style="display: grid; gap: 20px;">
      ${elections.map(el => {
        const hasVoted = el.voted_students.includes(u.student_id);

        return `
          <div class="yp-card">
            <div class="yp-card-head">
              <div>
                <span class="yp-badge ${el.active ? 'yp-badge-green' : 'yp-badge-gray'}" style="margin-bottom: 4px;">
                  ${el.active ? 'ĐANG MỞ BỎ PHIẾU' : 'ĐÃ ĐÓNG BỎ PHIẾU'}
                </span>
                <h3 style="font-size: 15px; font-weight: 800; color: var(--yp-text-main); margin: 2px 0 0;">${el.title}</h3>
              </div>
              <div style="text-align: right;">
                <span style="font-size: 12px; font-weight: 700; color: var(--yp-navy-700);">Số lượng đại biểu cần bầu: <b>${el.seats} đồng chí</b></span>
              </div>
            </div>

            <div class="yp-card-body">
              <p style="font-size: 13px; color: var(--yp-text-main); margin: 0 0 16px; line-height: 1.5;">${el.description}</p>
              
              <div style="margin-bottom: 20px;">
                <strong style="font-size: 13px; color: var(--yp-navy-850); display: block; margin-bottom: 10px;">
                  Danh sách ứng cử viên Ban Chấp hành Chi đoàn:
                </strong>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px;">
                  ${el.candidates.map(c => `
                    <div style="border: 1px solid var(--yp-border); border-radius: var(--yp-radius-md); padding: 14px; background: var(--yp-card); display: flex; flex-direction: column; justify-content: space-between;">
                      <div>
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                          <div style="width: 36px; height: 36px; border-radius: 50%; background: #1e3a8a; color: #fff; font-weight: 800; display: flex; align-items: center; justify-content: center; font-size: 13px;">
                            ${c.full_name.split(' ').pop()?.charAt(0) || 'C'}
                          </div>
                          <div>
                            <strong style="font-size: 13px; color: var(--yp-text-main); display: block;">${c.full_name}</strong>
                            <span class="yp-mono" style="font-size: 11px; color: var(--yp-text-muted);">${c.student_id}</span>
                          </div>
                        </div>
                        <p style="font-size: 11.5px; color: var(--yp-text-muted); margin: 0 0 12px;">${c.position}</p>
                      </div>

                      <div>
                        ${hasVoted ? `
                          <div style="background: var(--yp-navy-50); border-radius: 6px; padding: 6px 10px; font-size: 11px; text-align: center; color: var(--yp-text-muted);">
                            Số phiếu hiện tại: <b class="yp-mono" style="color: var(--yp-navy-850);">${c.votes}</b>
                          </div>
                        ` : `
                          <button type="button" class="yp-btn yp-btn-primary yp-btn-sm" style="width: 100%;" data-action="vote-candidate" data-election-id="${el.id}" data-candidate-id="${c.id}" data-candidate-name="${c.full_name}">
                            ${icon('vote', 13)}
                            Bầu cho ứng viên này
                          </button>
                        `}
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>

              <div style="padding-top: 12px; border-top: 1px solid var(--yp-border-light); display: flex; justify-content: space-between; align-items: center; font-size: 12px;">
                <span style="color: var(--yp-text-muted);">
                  Thời gian: <span class="yp-mono">${el.starts_at}</span> đến <span class="yp-mono">${el.ends_at}</span>
                </span>
                <div>
                  ${hasVoted ? `
                    <span class="yp-badge yp-badge-green" style="font-size: 11px; padding: 5px 10px;">
                      ✓ Đồng chí đã hoàn thành bỏ phiếu
                    </span>
                  ` : `
                    <span class="yp-badge yp-badge-amber" style="font-size: 11px; padding: 5px 10px;">
                      Cử tri chưa thực hiện quyền biểu quyết
                    </span>
                  `}
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}
