import { store } from '../../store';
import { icon } from '../../components/icons';

export function renderAdminOcr(): string {
  const settings = store.getSettings();
  const currentMode = settings.ocr_mode;

  return `
    <div class="yp-page-head" style="margin-bottom: 20px;">
      <div>
        <h1 style="font-size: 20px; font-weight: 800; color: var(--yp-navy-850); margin: 0 0 4px;">Trung tâm Quản trị OCR Thẻ Đoàn</h1>
        <p style="font-size: 12.5px; color: var(--yp-text-muted); margin: 0;">Điều phối chế độ nhận diện ký tự quang học, hàng đợi xử lý nền và kiểm tra tính hợp lệ số thẻ</p>
      </div>
    </div>

    <!-- Mode Selector Card -->
    <div class="yp-card" style="margin-bottom: 20px;">
      <div class="yp-card-head">
        <h3 class="yp-card-title">
          ${icon('scan')}
          1. Thiết lập Chế độ OCR toàn hệ thống
        </h3>
        <span class="yp-badge yp-badge-blue">Đang áp dụng: ${currentMode.toUpperCase()}</span>
      </div>
      <div class="yp-card-body">
        <p style="font-size: 13px; color: var(--yp-text-main); margin: 0 0 16px; line-height: 1.5;">
          Quy tắc nghiệp vụ: Frontend và Backend phải đồng bộ một bộ quy tắc duy nhất. Khi OCR được bật, chỉ bắt buộc OCR nhận diện và đối chiếu <b>Số thẻ Đoàn viên</b>; các trường khác không làm hồ sơ tự động bị đánh trượt vì để trống.
        </p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px;">
          <!-- Mode OFF -->
          <div style="border: 2px solid ${currentMode === 'off' ? '#23477f' : 'var(--yp-border)'}; border-radius: 10px; padding: 16px; background: ${currentMode === 'off' ? 'var(--yp-navy-50)' : 'var(--yp-card)'}; cursor: pointer;"
               data-action="set-ocr" data-mode="off">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <strong style="font-size: 14px; color: var(--yp-text-main);">Chế độ TẮT (Off)</strong>
              ${currentMode === 'off' ? '<span class="yp-badge yp-badge-green">Kích hoạt</span>' : ''}
            </div>
            <p style="font-size: 12px; color: var(--yp-text-muted); margin: 0; line-height: 1.4;">
              Không yêu cầu OCR. Sinh viên chỉ cần nhập số thẻ Đoàn viên bằng tay và gửi cán bộ Chi đoàn đối chiếu sổ.
            </p>
          </div>

          <!-- Mode OPTIONAL -->
          <div style="border: 2px solid ${currentMode === 'optional' ? '#23477f' : 'var(--yp-border)'}; border-radius: 10px; padding: 16px; background: ${currentMode === 'optional' ? 'var(--yp-navy-50)' : 'var(--yp-card)'}; cursor: pointer;"
               data-action="set-ocr" data-mode="optional">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <strong style="font-size: 14px; color: var(--yp-text-main);">Chế độ TUỲ CHỌN (Optional)</strong>
              ${currentMode === 'optional' ? '<span class="yp-badge yp-badge-green">Kích hoạt</span>' : ''}
            </div>
            <p style="font-size: 12px; color: var(--yp-text-muted); margin: 0; line-height: 1.4;">
              Sinh viên có thể tải ảnh chụp thẻ để hệ thống quét OCR tự động điền số thẻ, nhưng không bắt buộc phải có ảnh.
            </p>
          </div>

          <!-- Mode REQUIRED -->
          <div style="border: 2px solid ${currentMode === 'required' ? '#23477f' : 'var(--yp-border)'}; border-radius: 10px; padding: 16px; background: ${currentMode === 'required' ? 'var(--yp-navy-50)' : 'var(--yp-card)'}; cursor: pointer;"
               data-action="set-ocr" data-mode="required">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <strong style="font-size: 14px; color: var(--yp-text-main);">BẮT BUỘC (Required)</strong>
              ${currentMode === 'required' ? '<span class="yp-badge yp-badge-green">Kích hoạt</span>' : ''}
            </div>
            <p style="font-size: 12px; color: var(--yp-text-muted); margin: 0; line-height: 1.4;">
              Bắt buộc tải ảnh thẻ. Engine OCR sẽ quét và đối chiếu số thẻ; hồ sơ chỉ cần số thẻ khớp là đạt.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- OCR Simulator & Test Queue -->
    <div style="display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(320px, 1.2fr); gap: 20px;">
      <!-- OCR Live Test Box -->
      <div class="yp-card">
        <div class="yp-card-head">
          <h3 class="yp-card-title">
            ${icon('activity')}
            2. Thử nghiệm Quét OCR Ảnh Thẻ mẫu
          </h3>
        </div>
        <div class="yp-card-body">
          <div style="display: flex; gap: 14px; align-items: center; margin-bottom: 14px; padding: 12px; border: 1px solid var(--yp-border); border-radius: 8px; background: var(--yp-card-head);">
            <img src="/assets/images/youth_card_sample.jpg" alt="Thẻ Đoàn mẫu" style="width: 100px; height: 65px; object-fit: cover; border-radius: 6px; border: 1px solid #94a3b8;" />
            <div>
              <strong style="font-size: 13px; color: var(--yp-text-main); display: block;">Ảnh Thẻ Đoàn viên NGUYỄN THIỆN NHÂN</strong>
              <span class="yp-mono" style="font-size: 11px; color: var(--yp-text-muted);">Tệp: youth_card_sample.jpg (137 KB)</span>
            </div>
          </div>

          <button type="button" id="run-ocr-test-btn" class="yp-btn yp-btn-primary" style="width: 100%; margin-bottom: 14px;">
            ${icon('scan', 14)}
            Kích hoạt quét thử nghiệm OCR Worker
          </button>

          <div id="ocr-test-result" style="display: none; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 14px; font-size: 12px; color: #166534; line-height: 1.5;">
            <strong>✓ KẾT QUẢ QUÉT OCR THÀNH CÔNG (ĐỘ CHÍNH XÁC: 98.4%):</strong><br/>
            - Trường nhận diện: <b>Số thẻ đoàn viên</b><br/>
            - Giá trị đọc được: <b class="yp-mono" style="font-size: 14px; color: #1e3a8a;">080208062693</b><br/>
            - Họ và tên đối chiếu: <b>NGUYỄN THIỆN NHÂN</b> (Khớp hồ sơ N26DCCN185)<br/>
            - Ngày sinh đọc được: <b>13/03/2008</b> (Khớp hồ sơ)<br/>
            - Đánh giá: <b>HỢP LỆ THEO QUY ĐỊNH BAN CHẤP HÀNH TRUNG ƯƠNG</b>
          </div>
        </div>
      </div>

      <!-- Queue Status & Settings -->
      <div class="yp-card">
        <div class="yp-card-head">
          <h3 class="yp-card-title">
            ${icon('settings')}
            3. Thông số Worker Hàng Đợi (Queue)
          </h3>
        </div>
        <div class="yp-card-body" style="font-size: 12px; display: grid; gap: 10px;">
          <div style="display: flex; justify-content: space-between; padding-bottom: 8px; border-bottom: 1px solid var(--yp-border-light);">
            <span style="color: var(--yp-text-muted);">Trạng thái hàng đợi:</span>
            <span class="yp-badge yp-badge-green">Hoạt động bình thường</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding-bottom: 8px; border-bottom: 1px solid var(--yp-border-light);">
            <span style="color: var(--yp-text-muted);">Tiến trình xử lý:</span>
            <span class="yp-mono">CRON Worker (Mỗi 5 phút)</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding-bottom: 8px; border-bottom: 1px solid var(--yp-border-light);">
            <span style="color: var(--yp-text-muted);">Xử lý đồng bộ / bất đồng bộ:</span>
            <span class="yp-mono">Bất đồng bộ (Chống treo web)</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding-bottom: 8px; border-bottom: 1px solid var(--yp-border-light);">
            <span style="color: var(--yp-text-muted);">Dung lượng ảnh tối đa:</span>
            <span class="yp-mono">8.0 MB (MIME JPEG/PNG/WebP)</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--yp-text-muted);">Engine nhận dạng:</span>
            <span class="yp-mono">JSON Rule Verifier + Tesseract/Gemini</span>
          </div>
        </div>
      </div>
    </div>
  `;
}
