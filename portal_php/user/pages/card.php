<?php
if (!defined('PORTAL_VIEW_ROUTER')) { http_response_code(403); exit; }
title('Thẻ Đoàn viên điện tử · Chi đoàn D26CQCN03-N');

$ocrMode = conf('ocr_mode') ?? 'optional';
$isApproved = !empty($u['card_number']) && !empty($u['card_verified_at']);
$isPending = !empty($u['card_number']) && empty($u['card_verified_at']);
$hasNotJoined = $u['membership'] === 'not_joined';
?>

<div class="yp-page-head" style="margin-bottom: 20px;">
  <div>
    <h1 style="font-size: 20px; font-weight: 800; color: var(--yp-navy-850); margin: 0 0 4px;">Thẻ Đoàn viên điện tử</h1>
    <p style="font-size: 12.5px; color: var(--yp-text-muted); margin: 0;">Mẫu thẻ số hóa chuẩn Trung ương Đoàn TNCS Hồ Chí Minh dành cho Đoàn viên PTIT HCM</p>
  </div>
  <div style="display: flex; gap: 8px;">
    <button type="button" class="yp-btn yp-btn-secondary" onclick="window.print()">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
      In thẻ điện tử
    </button>
    <button type="button" class="yp-btn yp-btn-primary" onclick="toggleQrVerifyModal()">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
      Mã QR Tra cứu & Xác minh
    </button>
  </div>
</div>

<?php if ($hasNotJoined): ?>
  <div class="yp-card" style="border-left: 4px solid var(--yp-gold-500); padding: 16px; margin-bottom: 20px;">
    <strong style="color: #b45309; font-size: 14px;">Thông tin tổ chức: Chưa kết nạp Đoàn</strong>
    <p style="font-size: 12.5px; color: var(--yp-text-muted); margin: 6px 0 0;">
      Hồ sơ ghi nhận đồng chí chưa vào Đoàn. Đây là trạng thái bình thường đối với thanh niên đang trong diện cảm tình Đoàn hoặc phấn đấu kết nạp. Đồng chí không bắt buộc phải có số thẻ Đoàn viên.
    </p>
  </div>
<?php endif; ?>

<!-- THIẾT KẾ THẺ ĐOÀN VIÊN CHUẨN TRUNG ƯƠNG ĐOÀN (NHẬN DIỆN FOCUS & V8) -->
<div class="yp-card-youth">
  <div class="yp-card-header">
    <div style="display: flex; justify-content: center; align-items: center; gap: 10px; margin-bottom: 4px;">
      <!-- Huy hiệu Đoàn SVG -->
      <svg width="34" height="34" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="46" fill="#c92a2a"/>
        <circle cx="50" cy="50" r="41" fill="#ffffff"/>
        <circle cx="50" cy="50" r="37" fill="#15803d"/>
        <path d="M50 18 L58 35 L76 35 L62 46 L67 63 L50 52 L33 63 L38 46 L24 35 L42 35 Z" fill="#fbbf24"/>
      </svg>
    </div>
    <div class="yp-card-subhead">TRUNG ƯƠNG ĐOÀN TNCS HỒ CHÍ MINH</div>
    <div class="yp-card-title-main">THẺ ĐOÀN VIÊN</div>
  </div>

  <div class="yp-card-content">
    <div class="yp-card-avatar-box">
      <div class="yp-card-avatar-frame">
        <?php if (!empty($u['avatar_path'])): ?>
          <img class="yp-card-avatar-img" src="index.php?page=avatar&id=<?= (int)$u['id'] ?>" alt="<?= e($u['full_name']) ?>" />
        <?php else: ?>
          <div style="text-align: center; color: white;">
            <div style="background: #1e3a8a; border: 2px solid #60a5fa; border-radius: 8px; padding: 8px 12px; margin-bottom: 6px;">
              <span style="font-size: 9px; font-weight: 800; letter-spacing: 0.05em; display: block;">THANH NIÊN VIỆT NAM</span>
              <span style="font-size: 16px; color: #fbbf24;">★</span>
            </div>
            <span style="font-size: 10px; opacity: 0.85;">Ảnh hồ sơ</span>
          </div>
        <?php endif; ?>
      </div>
      <div class="yp-card-authority">
        BAN CHẤP HÀNH TRUNG ƯƠNG<br/>ĐOÀN TNCS HỒ CHÍ MINH
      </div>
      <div class="yp-card-number-box">
        Số thẻ đoàn viên:<br/>
        <span style="color: #1e3a8a; font-size: 14px; font-weight: 800;">
          <?= !empty($u['card_number']) ? e($u['card_number']) : 'Chưa cấp số thẻ' ?>
        </span>
      </div>
    </div>

    <div class="yp-card-fields">
      <div class="yp-card-row">
        <span class="yp-card-label">Họ và tên:</span>
        <span class="yp-card-val" style="text-transform: uppercase; color: #1e293b;"><?= e($u['full_name']) ?></span>
      </div>
      <div class="yp-card-row">
        <span class="yp-card-label">Ngày sinh:</span>
        <span class="yp-card-val"><?= !empty($u['dob']) ? date('d/m/Y', strtotime($u['dob'])) : 'Chưa cập nhật' ?></span>
      </div>
      <div class="yp-card-row">
        <span class="yp-card-label">Chức vụ:</span>
        <span class="yp-card-val"><?= e($u['position_title'] ?: 'Đoàn viên') ?></span>
      </div>
      <div class="yp-card-row">
        <span class="yp-card-label">Ngày vào Đoàn:</span>
        <span class="yp-card-val"><?= !empty($u['joined_date']) ? date('d/m/Y', strtotime($u['joined_date'])) : 'Chưa ghi nhận' ?></span>
      </div>
      <div class="yp-card-row">
        <span class="yp-card-label">Nơi vào Đoàn:</span>
        <span class="yp-card-val"><?= e($u['join_place'] ?? 'Trường THPT / Cơ sở Đoàn địa phương') ?></span>
      </div>
      <div class="yp-card-row">
        <span class="yp-card-label">Nơi cấp thẻ:</span>
        <span class="yp-card-val"><?= e($u['issue_place'] ?? 'BCH Đoàn Học viện Công nghệ Bưu chính Viễn thông') ?></span>
      </div>
      <div class="yp-card-row">
        <span class="yp-card-label">Nơi sinh hoạt đoàn:</span>
        <span class="yp-card-val" style="color: #1d4ed8; font-weight: 700;">
          <?= e($u['activity_unit'] ?: ($u['class_name'] ? 'Chi đoàn ' . $u['class_name'] : 'Chi đoàn D26CQCN03-N')) ?>
        </span>
      </div>
      <div class="yp-card-row" style="margin-top: 6px;">
        <span class="yp-card-label">Trạng thái xác thực:</span>
        <span class="yp-card-val">
          <?php if ($isApproved): ?>
            <span class="yp-badge yp-badge-green">✓ Đã xác minh chính thức</span>
          <?php elseif ($isPending): ?>
            <span class="yp-badge yp-badge-amber">⏳ Đang chờ cán bộ duyệt</span>
          <?php else: ?>
            <span class="yp-badge yp-badge-gray">Chưa cập nhật số thẻ</span>
          <?php endif; ?>
        </span>
      </div>
    </div>
  </div>
</div>

<!-- BIỂU MẪU CẬP NHẬT SỐ THẺ ĐOÀN VIÊN (CHỈ BẮT BUỘC SỐ THẺ) -->
<div class="yp-card">
  <div class="yp-card-head">
    <h3 class="yp-card-title">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
      Cập nhật & Đăng ký xác minh Thẻ Đoàn viên
    </h3>
    <span class="yp-badge yp-badge-blue">Quy định OCR: <?= strtoupper($ocrMode) ?></span>
  </div>
  <div class="yp-card-body">
    <div style="background: var(--yp-navy-50); border: 1px solid var(--yp-border); border-radius: var(--yp-radius-md); padding: 12px 14px; margin-bottom: 16px; font-size: 12px; color: var(--yp-text-muted);">
      <strong style="color: var(--yp-navy-850);">Quy tắc nghiệp vụ:</strong>
      <ul style="margin: 4px 0 0 18px; padding: 0; line-height: 1.5;">
        <li><b>Chỉ bắt buộc nhập Số thẻ Đoàn viên</b> (gồm 8-16 chữ số được cấp bởi Trung ương Đoàn).</li>
        <li>Các thông tin như Ngày vào Đoàn, Nơi vào Đoàn, Nơi cấp thẻ và Ảnh thẻ là <b>không bắt buộc</b>.</li>
        <?php if ($ocrMode === 'required'): ?>
          <li>Hệ thống đang bật chế độ <b>Bắt buộc tải ảnh và quét OCR</b>. Ảnh chỉ dùng để đối chiếu số thẻ; các trường khác để trống không làm trượt duyệt.</li>
        <?php elseif ($ocrMode === 'optional'): ?>
          <li>Chế độ OCR đang ở mức <b>Tuỳ chọn</b>: Đoàn viên có thể tải ảnh để hệ thống hỗ trợ đọc tự động hoặc tự nhập số thẻ bằng tay.</li>
        <?php else: ?>
          <li>Chế độ OCR hiện đang <b>Tắt</b>: Đoàn viên chỉ cần nhập số thẻ và gửi cán bộ chi đoàn xét duyệt.</li>
        <?php endif; ?>
      </ul>
    </div>

    <form method="POST" action="index.php?page=action" enctype="multipart/form-data">
      <input type="hidden" name="csrf_token" value="<?= e(csrf_token()) ?>" />
      <input type="hidden" name="action" value="submit_card" />

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; margin-bottom: 16px;">
        <div>
          <label style="display: block; font-size: 12px; font-weight: 700; color: var(--yp-text-main); margin-bottom: 6px;">
            Số thẻ Đoàn viên <span style="color: var(--yp-red-600);">* (Bắt buộc)</span>
          </label>
          <input type="text" name="card_number" value="<?= e($u['card_number'] ?? '') ?>" required
                 placeholder="VD: 080208062693" class="yp-mono"
                 style="width: 100%; padding: 8px 12px; border: 1px solid var(--yp-border); border-radius: var(--yp-radius-md); font-size: 13px; box-sizing: border-box;" />
          <small style="color: var(--yp-text-muted); font-size: 11px;">Nhập dãy số in trên thẻ Đoàn viên cứng hoặc ứng dụng Thanh niên Việt Nam.</small>
        </div>

        <div>
          <label style="display: block; font-size: 12px; font-weight: 700; color: var(--yp-text-main); margin-bottom: 6px;">
            Ngày vào Đoàn (Không bắt buộc)
          </label>
          <input type="date" name="joined_date" value="<?= e($u['joined_date'] ?? '') ?>"
                 style="width: 100%; padding: 8px 12px; border: 1px solid var(--yp-border); border-radius: var(--yp-radius-md); font-size: 13px; box-sizing: border-box;" />
        </div>

        <div>
          <label style="display: block; font-size: 12px; font-weight: 700; color: var(--yp-text-main); margin-bottom: 6px;">
            Nơi vào Đoàn (Không bắt buộc)
          </label>
          <input type="text" name="join_place" value="<?= e($u['join_place'] ?? '') ?>"
                 placeholder="VD: Trường THPT Chuyên..."
                 style="width: 100%; padding: 8px 12px; border: 1px solid var(--yp-border); border-radius: var(--yp-radius-md); font-size: 13px; box-sizing: border-box;" />
        </div>

        <div>
          <label style="display: block; font-size: 12px; font-weight: 700; color: var(--yp-text-main); margin-bottom: 6px;">
            Nơi cấp thẻ (Không bắt buộc)
          </label>
          <input type="text" name="issue_place" value="<?= e($u['issue_place'] ?? '') ?>"
                 placeholder="VD: Quận Đoàn / Ban Thường vụ Tỉnh Đoàn..."
                 style="width: 100%; padding: 8px 12px; border: 1px solid var(--yp-border); border-radius: var(--yp-radius-md); font-size: 13px; box-sizing: border-box;" />
        </div>

        <div>
          <label style="display: block; font-size: 12px; font-weight: 700; color: var(--yp-text-main); margin-bottom: 6px;">
            Nơi sinh hoạt Đoàn (Không bắt buộc)
          </label>
          <input type="text" name="activity_unit" value="<?= e($u['activity_unit'] ?: 'Chi đoàn D26CQCN03-N') ?>"
                 style="width: 100%; padding: 8px 12px; border: 1px solid var(--yp-border); border-radius: var(--yp-radius-md); font-size: 13px; box-sizing: border-box;" />
        </div>

        <div>
          <label style="display: block; font-size: 12px; font-weight: 700; color: var(--yp-text-main); margin-bottom: 6px;">
            Ảnh chụp thẻ Đoàn viên <?= $ocrMode === 'required' ? '<span style="color:var(--yp-red-600);">* (Bắt buộc theo cấu hình OCR)</span>' : '(Không bắt buộc)' ?>
          </label>
          <input type="file" name="card_photo" accept="image/*" <?= $ocrMode === 'required' ? 'required' : '' ?>
                 style="width: 100%; font-size: 12px; padding: 6px 0;" />
        </div>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 10px;">
        <button type="submit" class="yp-btn yp-btn-primary">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          Lưu thông tin & Gửi xét duyệt
        </button>
      </div>
    </form>
  </div>
</div>

<!-- MODAL QR TRA CỨU & XÁC MINH (CHỈ ADMIN MỚI ĐƯỢC XEM KẾT QUẢ) -->
<div id="yp-qr-modal" class="yp-modal-backdrop" style="display: none;">
  <div class="yp-modal" style="max-width: 480px;">
    <div class="yp-modal-header">
      <h3 style="margin: 0; font-size: 15px; font-weight: 700; color: var(--yp-navy-850);">Mã QR Xác minh Thẻ Đoàn viên</h3>
      <button type="button" onclick="toggleQrVerifyModal()" style="border: none; background: transparent; cursor: pointer; font-size: 18px;">✕</button>
    </div>
    <div class="yp-modal-body" style="text-align: center;">
      <div style="background: #ffffff; padding: 18px; border: 2px dashed #cbd5e1; border-radius: 14px; display: inline-block; margin-bottom: 14px;">
        <!-- QR Code Placeholder or Canvas -->
        <div id="card-qr-canvas" style="width: 200px; height: 200px; margin: 0 auto; display: flex; align-items: center; justify-content: center; background: #f8fafc;">
          <svg width="180" height="180" viewBox="0 0 24 24" fill="none" stroke="#1e293b" stroke-width="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><line x1="7" y1="17" x2="7" y2="17.01"/><line x1="17" y1="7" x2="17" y2="7.01"/></svg>
        </div>
      </div>
      <div style="font-family: var(--yp-font-mono); font-size: 13px; font-weight: 700; color: #1e3a8a; margin-bottom: 6px;">
        TOKEN: <?= strtoupper(substr(hash_hmac('sha256', (string)$u['id'].($u['card_number']??''), conf('app.secret')??'secret'), 0, 16)) ?>
      </div>
      <p style="font-size: 12px; color: var(--yp-text-muted); margin: 0 0 16px;">
        Mã QR chứa chữ ký điện tử nội bộ liên kết với hồ sơ sinh viên <b><?= e($u['student_id']) ?></b>.
      </p>

      <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 12px; font-size: 11.5px; color: #991b1b; text-align: left; line-height: 1.4;">
        <strong>BẢO MẬT & PHÂN QUYỀN TRUY CẬP:</strong><br/>
        Chỉ có <b>Quản trị viên / Cán bộ Đoàn</b> mới có quyền quét mã QR này để tra cứu thông tin chi tiết và xác thực tính hợp lệ của thẻ. Người dùng thông thường hoặc tài khoản sinh viên khác khi quét sẽ bị hệ thống từ chối truy cập.
      </div>
    </div>
    <div class="yp-modal-footer">
      <button type="button" class="yp-btn yp-btn-secondary" onclick="toggleQrVerifyModal()">Đóng</button>
      <a href="index.php?page=scan_card&token=<?= rawurlencode(hash_hmac('sha256', (string)$u['id'].($u['card_number']??''), conf('app.secret')??'secret')) ?>&sid=<?= e($u['student_id']) ?>" class="yp-btn yp-btn-primary" target="_blank">
        Thử nghiệm Quét (Admin View)
      </a>
    </div>
  </div>
</div>

<script>
function toggleQrVerifyModal() {
  const m = document.getElementById('yp-qr-modal');
  if (m) m.style.display = m.style.display === 'none' ? 'flex' : 'none';
}
</script>
