import './index.css';
import { store } from './store';
import { renderSidebar } from './components/sidebar';
import { renderTopbar } from './components/topbar';

// User views
import { renderUserDashboard } from './views/user/dashboard';
import { renderUserProfile } from './views/user/profile';
import { renderUserCard } from './views/user/card';
import { renderUserTasks } from './views/user/tasks';
import { renderUserEvents } from './views/user/events';
import { renderUserScan } from './views/user/scan';
import { renderUserLeaderboard } from './views/user/leaderboard';
import { renderUserElections } from './views/user/elections';
import { renderUserNotifications } from './views/user/notifications';
import { renderUserFeedback } from './views/user/feedback';
import { renderUserOfficers } from './views/user/officers';
import { renderUserSecurity } from './views/user/security';
import { renderUserLegal } from './views/user/legal';
import { renderUserCompetitions } from './views/user/competitions';

// Admin views
import { renderAdminDashboard } from './views/admin/dashboard';
import { renderAdminUsers } from './views/admin/users';
import { renderAdminCards } from './views/admin/cards';
import { renderAdminOcr } from './views/admin/ocr';
import { renderAdminEvents } from './views/admin/events';
import { renderAdminTasks } from './views/admin/tasks';
import { renderAdminQrScreen } from './views/admin/qr_screen';
import { renderAdminAnalytics } from './views/admin/analytics';
import { renderAdminSecurity } from './views/admin/security';
import { renderAdminModules } from './views/admin/modules';
import { renderAdminHealth } from './views/admin/health';
import { renderAdminSmtp } from './views/admin/smtp';

import QRCode from 'qrcode';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

let adminMode = false;
let userSearchTerm = '';
let userStatusFilter = 'all';
let userCurrentPage = 1;
let qrInterval: any = null;
let countdownSec = 120;
let analyticsChartInstance: any = null;

function renderApp() {
  const root = document.getElementById('app');
  if (!root) return;

  const page = store.getCurrentPage();
  const u = store.getCurrentUser();

  // If page starts with admin_, automatically switch to admin mode
  if (page.startsWith('admin_') && u.role === 'admin') {
    adminMode = true;
  }

  // Render view body
  let mainHtml = '';
  switch (page) {
    // User pages
    case 'home':
      mainHtml = renderUserDashboard();
      break;
    case 'profile':
      mainHtml = renderUserProfile();
      break;
    case 'card':
      mainHtml = renderUserCard();
      break;
    case 'tasks':
      mainHtml = renderUserTasks();
      break;
    case 'events':
      mainHtml = renderUserEvents();
      break;
    case 'scan':
      mainHtml = renderUserScan();
      break;
    case 'competitions':
      mainHtml = renderUserCompetitions();
      break;
    case 'leaderboard':
      mainHtml = renderUserLeaderboard();
      break;
    case 'elections':
      mainHtml = renderUserElections();
      break;
    case 'notifications':
      mainHtml = renderUserNotifications();
      break;
    case 'feedback':
      mainHtml = renderUserFeedback();
      break;
    case 'officers':
      mainHtml = renderUserOfficers();
      break;
    case 'security':
      mainHtml = renderUserSecurity();
      break;
    case 'legal':
      mainHtml = renderUserLegal();
      break;

    // Admin pages
    case 'admin_dashboard':
      mainHtml = renderAdminDashboard();
      break;
    case 'admin_users':
      mainHtml = renderAdminUsers(userSearchTerm, userStatusFilter, userCurrentPage);
      break;
    case 'admin_cards':
      mainHtml = renderAdminCards();
      break;
    case 'admin_ocr':
      mainHtml = renderAdminOcr();
      break;
    case 'admin_events':
      mainHtml = renderAdminEvents();
      break;
    case 'admin_tasks':
      mainHtml = renderAdminTasks();
      break;
    case 'admin_qr':
      mainHtml = renderAdminQrScreen();
      break;
    case 'admin_analytics':
    case 'admin_visits':
      mainHtml = renderAdminAnalytics();
      break;
    case 'admin_security':
    case 'admin_blocks':
    case 'admin_admins':
    case 'admin_audit':
      mainHtml = renderAdminSecurity();
      break;
    case 'admin_modules':
      mainHtml = renderAdminModules();
      break;
    case 'admin_health':
      mainHtml = renderAdminHealth();
      break;
    case 'admin_smtp':
      mainHtml = renderAdminSmtp();
      break;
    case 'admin_leaderboard':
      mainHtml = renderUserLeaderboard();
      break;
    case 'admin_officers':
      mainHtml = renderUserOfficers();
      break;
    case 'admin_elections':
      mainHtml = renderUserElections();
      break;
    case 'admin_notices':
      mainHtml = renderUserNotifications();
      break;
    case 'admin_feedback':
      mainHtml = renderUserFeedback();
      break;
    case 'admin_terms':
      mainHtml = renderUserLegal();
      break;
    default:
      mainHtml = renderUserDashboard();
  }

  root.innerHTML = `
    <div class="yp-shell">
      ${renderSidebar(adminMode)}
      <div class="yp-main-wrapper">
        ${renderTopbar(adminMode)}
        <main class="yp-content">
          ${mainHtml}
        </main>
        <footer style="padding: 18px 24px; border-top: 1px solid var(--yp-border); background: var(--yp-card); font-size: 11.5px; color: var(--yp-text-muted); display: flex; justify-content: space-between; align-items: center; flex-wrap: gap: 12px;">
          <div>
            <span>© 2026 PTIT Youth Portal · Chi đoàn D26CQCN03-N · Khoa CNTT1 · Học viện CNBCVT</span>
          </div>
          <div style="display: flex; gap: 14px;">
            <a data-nav="legal" style="color: var(--yp-navy-700); text-decoration: none; cursor: pointer;">Chính sách bảo mật</a>
            <span>·</span>
            <a data-nav="legal" style="color: var(--yp-navy-700); text-decoration: none; cursor: pointer;">Quy chế tổ chức</a>
            <span>·</span>
            <a data-nav="feedback" style="color: var(--yp-navy-700); text-decoration: none; cursor: pointer;">Hộp thư góp ý</a>
          </div>
        </footer>
      </div>
    </div>
  `;

  postRenderHooks(page);
}

function postRenderHooks(page: string) {
  // Mobile menu button visibility on mobile
  const mBtn = document.getElementById('yp-mobile-menu-btn');
  if (mBtn && window.innerWidth <= 1024) {
    mBtn.style.display = 'inline-flex';
  }

  // 1. QR on Card Page
  const cardQrCanvas = document.getElementById('card-qr-code') as HTMLCanvasElement;
  if (cardQrCanvas) {
    const u = store.getCurrentUser();
    const token = `PTIT_YOUTH_CARD_VERIFY_TOKEN_${u.student_id}_${u.card_number || '080208062693'}`;
    QRCode.toCanvas(cardQrCanvas, token, { width: 200, margin: 1 }, (err) => {
      if (err) console.error('QR err', err);
    });
  }

  // 2. Projector QR Screen on Admin QR View
  const projQrCanvas = document.getElementById('projector-qr-canvas') as HTMLCanvasElement;
  if (projQrCanvas) {
    generateDynamicQr();
    if (qrInterval) clearInterval(qrInterval);
    countdownSec = 120;
    qrInterval = setInterval(() => {
      countdownSec--;
      const textEl = document.getElementById('proj-countdown-text');
      const barEl = document.getElementById('proj-progress-bar');
      if (textEl) textEl.innerText = `${countdownSec} giây`;
      if (barEl) barEl.style.width = `${(countdownSec / 120) * 100}%`;

      if (countdownSec <= 0) {
        countdownSec = 120;
        generateDynamicQr();
      }
    }, 1000);
  } else {
    if (qrInterval) {
      clearInterval(qrInterval);
      qrInterval = null;
    }
  }

  // 3. User Scan Countdown
  const userScanCountdown = document.getElementById('qr-window-countdown');
  if (userScanCountdown) {
    const nowSec = Math.floor(Date.now() / 1000);
    const remain = 120 - (nowSec % 120);
    userScanCountdown.innerText = `Cửa sổ mã hiện tại: còn ${remain}s`;
  }

  // 4. Analytics Chart.js initialization
  const chartCanvas = document.getElementById('visits-chart-canvas') as HTMLCanvasElement;
  if (chartCanvas) {
    if (analyticsChartInstance) {
      analyticsChartInstance.destroy();
    }
    const days = ['10/10', '11/10', '12/10', '13/10', '14/10', '15/10', '16/10', '17/10', '18/10', '19/10', '20/10', '21/10', '22/10', '23/10'];
    const pageviews = [142, 168, 195, 210, 185, 240, 290, 215, 260, 310, 280, 295, 330, 315];
    const uniques = [45, 52, 60, 68, 55, 75, 92, 70, 84, 98, 89, 94, 105, 102];

    analyticsChartInstance = new Chart(chartCanvas, {
      type: 'line',
      data: {
        labels: days,
        datasets: [
          {
            label: 'Lượt xem trang (Pageviews)',
            data: pageviews,
            borderColor: '#23477f',
            backgroundColor: 'rgba(35, 71, 127, 0.08)',
            fill: true,
            tension: 0.3,
            borderWidth: 2
          },
          {
            label: 'Địa chỉ IP duy nhất (Unique Visitors)',
            data: uniques,
            borderColor: '#dc2626',
            backgroundColor: 'transparent',
            borderWidth: 2,
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: { family: "'Inter', sans-serif", size: 11 }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false }
          },
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}

function generateDynamicQr() {
  const canvas = document.getElementById('projector-qr-canvas') as HTMLCanvasElement;
  if (!canvas) return;
  const epochWindow = Math.floor(Date.now() / 120000);
  const token = `HMAC-D26-2026-WIN${epochWindow}`;
  QRCode.toCanvas(canvas, token, { width: 260, margin: 1 }, (err) => {
    if (err) console.error('Dynamic QR err', err);
  });
  const tokenText = document.getElementById('proj-token-text');
  if (tokenText) tokenText.innerText = token;
}

// Global Event Listeners
document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;

  // 1. Navigation items
  const navItem = target.closest('[data-nav]') as HTMLElement;
  if (navItem) {
    const page = navItem.dataset.nav;
    if (page) {
      // Close mobile drawer if open
      const sb = document.getElementById('yp-sidebar');
      if (sb) sb.classList.remove('open');

      store.setCurrentPage(page);
      return;
    }
  }

  // 2. Action buttons
  const actionBtn = target.closest('[data-action]') as HTMLElement;
  if (actionBtn) {
    const act = actionBtn.dataset.action;

    if (act === 'toggle-admin-mode') {
      adminMode = !adminMode;
      store.setCurrentPage(adminMode ? 'admin_dashboard' : 'home');
      return;
    }

    if (act === 'toggle-theme') {
      store.toggleTheme();
      return;
    }

    if (act === 'toggle-mobile-sidebar') {
      const sb = document.getElementById('yp-sidebar');
      if (sb) sb.classList.toggle('open');
      return;
    }

    if (act === 'open-card-qr-modal') {
      const m = document.getElementById('card-qr-modal');
      if (m) m.style.display = 'flex';
      return;
    }

    if (act === 'close-card-qr-modal') {
      const m = document.getElementById('card-qr-modal');
      if (m) m.style.display = 'none';
      return;
    }

    if (act === 'set-ocr') {
      const mode = actionBtn.dataset.mode as any;
      if (mode) store.setOcrMode(mode);
      return;
    }

    if (act === 'approve-card') {
      const sid = actionBtn.dataset.studentId;
      if (sid) {
        store.approveCard(sid, store.getCurrentUser().full_name);
        alert(`Đã phê duyệt Thẻ Đoàn viên cho sinh viên ${sid}!`);
      }
      return;
    }

    if (act === 'reject-card') {
      const sid = actionBtn.dataset.studentId;
      if (sid) {
        const reason = prompt('Nhập lý do từ chối hồ sơ thẻ:') || 'Số thẻ không trùng khớp với sổ Đoàn viên.';
        store.rejectCard(sid, store.getCurrentUser().full_name, reason);
      }
      return;
    }

    if (act === 'quick-approve-sub') {
      const sid = actionBtn.dataset.studentId;
      if (sid) {
        store.approveCard(sid, store.getCurrentUser().full_name);
      }
      return;
    }

    if (act === 'quick-reject-sub') {
      const sid = actionBtn.dataset.studentId;
      if (sid) {
        store.rejectCard(sid, store.getCurrentUser().full_name, 'Minh chứng chưa hợp lệ.');
      }
      return;
    }

    if (act === 'vote-candidate') {
      const elId = parseInt(actionBtn.dataset.electionId || '0');
      const candId = parseInt(actionBtn.dataset.candidateId || '0');
      const candName = actionBtn.dataset.candidateName || '';
      if (confirm(`Đồng chí có chắc chắn muốn bỏ phiếu biểu quyết cho ứng viên ${candName}?`)) {
        const res = store.voteElection(elId, candId);
        alert(res.message);
      }
      return;
    }

    if (act === 'mark-read') {
      const nId = parseInt(actionBtn.dataset.noticeId || '0');
      const n = store.getNotices().find(item => item.id === nId);
      if (n && !n.read_by.includes(store.getCurrentUser().student_id)) {
        n.read_by.push(store.getCurrentUser().student_id);
        renderApp();
      }
      return;
    }

    if (act === 'mark-all-read') {
      store.getNotices().forEach(n => {
        if (!n.read_by.includes(store.getCurrentUser().student_id)) {
          n.read_by.push(store.getCurrentUser().student_id);
        }
      });
      renderApp();
      return;
    }

    if (act === 'open-submit-modal') {
      const m = document.getElementById('submit-proof-modal');
      const titleEl = document.getElementById('submit-modal-title');
      const idInput = document.getElementById('submit-task-id') as HTMLInputElement;
      if (m && titleEl && idInput) {
        titleEl.innerText = `Nộp minh chứng: ${actionBtn.dataset.taskTitle}`;
        idInput.value = actionBtn.dataset.taskId || '1';
        m.style.display = 'flex';
      }
      return;
    }

    if (act === 'close-submit-modal') {
      const m = document.getElementById('submit-proof-modal');
      if (m) m.style.display = 'none';
      return;
    }

    if (act === 'open-edit-student') {
      const sid = actionBtn.dataset.studentId;
      const st = store.getStudents().find(s => s.student_id === sid);
      if (st) {
        const m = document.getElementById('admin-edit-student-modal');
        (document.getElementById('admin-edit-sid') as HTMLInputElement).value = st.student_id;
        (document.getElementById('admin-edit-mssv') as HTMLInputElement).value = st.student_id;
        (document.getElementById('admin-edit-name') as HTMLInputElement).value = st.full_name;
        (document.getElementById('admin-edit-dob') as HTMLInputElement).value = st.dob || '';
        (document.getElementById('admin-edit-membership') as HTMLSelectElement).value = st.membership;
        (document.getElementById('admin-edit-card') as HTMLInputElement).value = st.card_number || '';
        (document.getElementById('admin-edit-position') as HTMLInputElement).value = st.position_title || 'Đoàn viên';
        (document.getElementById('admin-edit-hometown') as HTMLInputElement).value = st.hometown || '';
        (document.getElementById('admin-edit-points') as HTMLInputElement).value = String(st.points || 0);
        if (m) m.style.display = 'flex';
      }
      return;
    }

    if (act === 'close-edit-student-modal') {
      const m = document.getElementById('admin-edit-student-modal');
      if (m) m.style.display = 'none';
      return;
    }

    if (act === 'export-users-csv') {
      exportUsersToCsv();
      return;
    }

    if (act === 'go-page') {
      const p = parseInt(actionBtn.dataset.page || '1');
      userCurrentPage = p;
      renderApp();
      return;
    }

    if (act === 'open-add-block-modal') {
      const m = document.getElementById('add-block-modal');
      if (m) m.style.display = 'flex';
      return;
    }

    if (act === 'close-add-block-modal') {
      const m = document.getElementById('add-block-modal');
      if (m) m.style.display = 'none';
      return;
    }

    if (act === 'unblock-target') {
      const bId = parseInt(actionBtn.dataset.blockId || '0');
      store.removeBlock(bId);
      return;
    }

    if (act === 'refresh-data') {
      renderApp();
      return;
    }

    if (act === 'run-diagnostics') {
      alert('Đã kiểm tra toàn vẹn hệ thống FocusBrain v4.8.4! Tất cả 71 sinh viên và dịch vụ hoạt động hoàn hảo.');
      return;
    }

    if (act === 'open-avatar-modal') {
      const m = document.getElementById('avatar-picker-modal');
      if (m) m.style.display = 'flex';
      return;
    }

    if (act === 'close-avatar-modal') {
      const m = document.getElementById('avatar-picker-modal');
      if (m) m.style.display = 'none';
      return;
    }

    if (act === 'scroll-to-quote') {
      const quoteSection = document.getElementById('section-quote-edit');
      if (quoteSection) {
        quoteSection.scrollIntoView({ behavior: 'smooth' });
        const quoteInput = document.getElementById('prof-quote') as HTMLTextAreaElement;
        if (quoteInput) {
          setTimeout(() => quoteInput.focus(), 250);
        }
      }
      return;
    }

    if (act === 'pick-avatar-preset') {
      const url = actionBtn.dataset.avatarUrl || '/assets/images/youth_card_sample.jpg';
      store.updateStudent({
        student_id: store.getCurrentUser().student_id,
        avatar_path: url
      });
      const m = document.getElementById('avatar-picker-modal');
      if (m) m.style.display = 'none';
      return;
    }

    if (act === 'pick-avatar-gradient') {
      const gType = actionBtn.dataset.gradient;
      const u = store.getCurrentUser();
      let svgUrl = '';
      if (gType === '2') {
        svgUrl = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><defs><linearGradient id="g2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23dc2626"/><stop offset="100%" stop-color="%23d97706"/></linearGradient></defs><rect width="128" height="128" rx="24" fill="url(%23g2)"/><polygon points="64,28 73,52 98,52 78,68 85,92 64,76 43,92 50,68 30,52 55,52" fill="%23facc15"/></svg>`;
      } else if (gType === '3') {
        svgUrl = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><defs><linearGradient id="g3" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23059669"/><stop offset="100%" stop-color="%230f766e"/></linearGradient></defs><rect width="128" height="128" rx="24" fill="url(%23g3)"/><circle cx="64" cy="50" r="20" fill="%23ffffff" fill-opacity="0.9"/><path d="M34 102 C34 78, 94 78, 94 102 Z" fill="%23ffffff" fill-opacity="0.9"/></svg>`;
      } else {
        const char = encodeURIComponent(u.full_name.split(' ').pop()?.charAt(0) || 'U');
        svgUrl = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><defs><linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%231d4ed8"/><stop offset="100%" stop-color="%23312e81"/></linearGradient></defs><rect width="128" height="128" rx="24" fill="url(%23g1)"/><text x="64" y="78" font-family="sans-serif" font-size="48" font-weight="900" fill="white" text-anchor="middle">${char}</text></svg>`;
      }
      store.updateStudent({
        student_id: u.student_id,
        avatar_path: svgUrl
      });
      const m = document.getElementById('avatar-picker-modal');
      if (m) m.style.display = 'none';
      return;
    }
  }

  // 3. Simulate QR Scan Button inside Card Verification Modal
  if (target.id === 'simulate-scan-btn') {
    const resBox = document.getElementById('scan-result-box');
    if (!resBox) return;
    const currentViewer = store.getCurrentUser();
    resBox.style.display = 'block';

    if (currentViewer.role === 'admin' || currentViewer.admin_level !== 'NONE') {
      // Admin Scan Success
      resBox.innerHTML = `
        <div style="background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 8px; padding: 12px; color: #166534; line-height: 1.5;">
          <div style="font-weight: 800; color: #15803d; font-size: 13px; margin-bottom: 6px;">
            ✓ XÁC THỰC THÀNH CÔNG (QUYỀN QUẢN TRỊ VIÊN)
          </div>
          <div>Đoàn viên: <b>${currentViewer.full_name}</b></div>
          <div>Mã số sinh viên: <b class="yp-mono">${currentViewer.student_id}</b> · STT ${currentViewer.class_number}</div>
          <div>Số thẻ Đoàn viên: <b class="yp-mono" style="font-size: 14px; color: #1e3a8a;">${currentViewer.card_number || '080208062693'}</b></div>
          <div>Sinh hoạt: <b>${currentViewer.activity_unit || 'Chi đoàn D26CQCN03-N'}</b></div>
          <div>Trạng thái: <span class="yp-badge yp-badge-green">HỢP LỆ · ĐÃ XÁC THỰC BỞI BCH ĐOÀN</span></div>
        </div>
      `;
    } else {
      // Non-admin Access Denied! (Matches: chỉ có quản trị viên mới quét được)
      resBox.innerHTML = `
        <div style="background: #fef2f2; border: 1.5px solid #fca5a5; border-radius: 8px; padding: 12px; color: #991b1b; line-height: 1.5;">
          <div style="font-weight: 800; color: #b91c1c; font-size: 13px; margin-bottom: 6px;">
            ✕ TỪ CHỐI TRUY CẬP · TRUY CẬP BỊ HẠN CHẾ
          </div>
          <p style="margin: 0; font-size: 11.5px;">
            <b>CHỈ CÁN BỘ ĐOÀN / QUẢN TRỊ VIÊN MỚI ĐƯỢC PHÉP QUÉT THẺ NÀY!</b><br/>
            Tài khoản hiện tại (${currentViewer.full_name}) là sinh viên thường, không có thẩm quyền tra cứu thông tin định danh và số thẻ Đoàn viên của người khác. Vui lòng chuyển sang tài khoản Admin để thử nghiệm tính năng này.
          </p>
        </div>
      `;
    }
  }

  // 4. Auto fill attendance token button
  if (target.id === 'auto-fill-token-btn') {
    const input = document.getElementById('scan-token-input') as HTMLInputElement;
    if (input) {
      const epochWindow = Math.floor(Date.now() / 120000);
      input.value = `HMAC-D26-2026-WIN${epochWindow}`;
    }
  }

  // 5. Start camera simulation
  if (target.id === 'start-camera-btn') {
    const input = document.getElementById('scan-token-input') as HTMLInputElement;
    if (input) {
      const epochWindow = Math.floor(Date.now() / 120000);
      input.value = `HMAC-D26-2026-WIN${epochWindow}`;
      alert('Camera đã quét được mã QR thành công! Mã token hợp lệ đã được nhập tự động.');
    }
  }

  // 6. Run OCR Test button
  if (target.id === 'run-ocr-test-btn') {
    const res = document.getElementById('ocr-test-result');
    if (res) res.style.display = 'block';
  }
});

// Change Listeners
document.addEventListener('change', (e) => {
  const target = e.target as HTMLElement;

  // Account Switcher Dropdown
  if (target.id === 'yp-user-select') {
    const sid = (target as HTMLSelectElement).value;
    store.switchUser(sid);
    return;
  }

  // User list status filter
  if (target.id === 'user-status-filter') {
    userStatusFilter = (target as HTMLSelectElement).value;
    userCurrentPage = 1;
    renderApp();
    return;
  }

  // Avatar file upload from device
  if (target.id === 'avatar-file-input') {
    const fileInput = target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = (re) => {
        const dataUrl = re.target?.result as string;
        if (dataUrl) {
          store.updateStudent({
            student_id: store.getCurrentUser().student_id,
            avatar_path: dataUrl
          });
          const m = document.getElementById('avatar-picker-modal');
          if (m) m.style.display = 'none';
        }
      };
      reader.readAsDataURL(file);
    }
  }
});

// Input Search Debounce & Live Preview
document.addEventListener('input', (e) => {
  const target = e.target as HTMLElement;
  if (target.id === 'user-search-input') {
    userSearchTerm = (target as HTMLInputElement).value;
    userCurrentPage = 1;
    renderApp();
  }

  // Live Quote text preview
  if (target.id === 'prof-quote') {
    const quoteEl = document.getElementById('hero-quote-text');
    if (quoteEl) {
      quoteEl.innerText = (target as HTMLTextAreaElement).value.trim() || 'Đâu cần thanh niên có, việc gì khó có thanh niên.';
    }
  }

  // Live Quote author preview
  if (target.id === 'prof-quote-author') {
    const authorEl = document.getElementById('hero-quote-author');
    if (authorEl) {
      authorEl.innerText = `— ${(target as HTMLInputElement).value.trim() || 'Chủ tịch Hồ Chí Minh'}`;
    }
  }
});

// Form Submissions
document.addEventListener('submit', (e) => {
  const target = e.target as HTMLFormElement;

  // 1. Card update form
  if (target.id === 'card-update-form') {
    e.preventDefault();
    const cardNum = (document.getElementById('card-num-input') as HTMLInputElement).value.trim();
    const date = (document.getElementById('card-date-input') as HTMLInputElement).value;
    const place = (document.getElementById('card-place-input') as HTMLInputElement).value.trim();
    const issue = (document.getElementById('card-issue-input') as HTMLInputElement).value.trim();
    const unit = (document.getElementById('card-unit-input') as HTMLInputElement).value.trim();

    store.updateCard(cardNum, date, place, issue, unit);
    alert('Đã cập nhật số thẻ Đoàn viên thành công! Hồ sơ đã được chuyển sang trạng thái chờ cán bộ đối chiếu.');
    return;
  }

  // 2. Attendance scan form
  if (target.id === 'attendance-scan-form') {
    e.preventDefault();
    const evId = parseInt((document.getElementById('scan-event-select') as HTMLSelectElement).value);
    const u = store.getCurrentUser();
    const msgBox = document.getElementById('attendance-msg-box');
    const res = store.checkInAttendance(evId, u.student_id, 'qr');

    if (msgBox) {
      msgBox.style.display = 'block';
      msgBox.style.padding = '10px 14px';
      msgBox.style.borderRadius = '8px';
      msgBox.style.background = res.success ? '#f0fdf4' : '#fef2f2';
      msgBox.style.border = res.success ? '1px solid #bbf7d0' : '1px solid #fecaca';
      msgBox.style.color = res.success ? '#166534' : '#991b1b';
      msgBox.innerHTML = `<strong>${res.success ? '✓' : '✕'}</strong> ${res.message}`;
    }
    return;
  }

  // 3. Profile edit form
  if (target.id === 'profile-edit-form') {
    e.preventDefault();
    const hometown = (document.getElementById('prof-hometown') as HTMLInputElement).value.trim();
    const phone = (document.getElementById('prof-phone') as HTMLInputElement).value.trim();
    const email = (document.getElementById('prof-email') as HTMLInputElement).value.trim();
    const quote = (document.getElementById('prof-quote') as HTMLTextAreaElement).value.trim();
    const author = (document.getElementById('prof-quote-author') as HTMLInputElement).value.trim();
    const visible = (document.getElementById('prof-lb-visible') as HTMLInputElement).checked;

    store.updateStudent({
      student_id: store.getCurrentUser().student_id,
      hometown,
      phone,
      personal_email: email,
      quote_text: quote,
      quote_author: author,
      leaderboard_visible: visible
    });
    alert('Đã lưu thay đổi hồ sơ cá nhân thành công!');
    return;
  }

  // 4. Submit proof modal form
  if (target.id === 'submit-proof-form') {
    e.preventDefault();
    const taskId = parseInt((document.getElementById('submit-task-id') as HTMLInputElement).value);
    const m = document.getElementById('submit-proof-modal');
    if (m) m.style.display = 'none';
    alert(`Minh chứng nhiệm vụ #${taskId} đã được gửi thành công tới Ban Chấp hành Chi đoàn!`);
    return;
  }

  // 5. Admin edit student form
  if (target.id === 'admin-edit-student-form') {
    e.preventDefault();
    const sid = (document.getElementById('admin-edit-sid') as HTMLInputElement).value;
    const name = (document.getElementById('admin-edit-name') as HTMLInputElement).value.trim();
    const dob = (document.getElementById('admin-edit-dob') as HTMLInputElement).value;
    const membership = (document.getElementById('admin-edit-membership') as HTMLSelectElement).value as any;
    const card = (document.getElementById('admin-edit-card') as HTMLInputElement).value.trim();
    const position = (document.getElementById('admin-edit-position') as HTMLInputElement).value.trim();
    const hometown = (document.getElementById('admin-edit-hometown') as HTMLInputElement).value.trim();
    const points = parseInt((document.getElementById('admin-edit-points') as HTMLInputElement).value || '0');

    store.updateStudent({
      student_id: sid,
      full_name: name,
      dob,
      membership,
      card_number: card,
      position_title: position,
      hometown,
      points
    });

    const m = document.getElementById('admin-edit-student-modal');
    if (m) m.style.display = 'none';
    alert(`Đã cập nhật hồ sơ sinh viên ${name} (${sid}) với quyền Quản trị viên.`);
    return;
  }

  // 6. Feedback submit form
  if (target.id === 'feedback-submit-form') {
    e.preventDefault();
    const subject = (document.getElementById('feedback-subject') as HTMLInputElement).value.trim();
    const priority = (document.getElementById('feedback-priority') as HTMLSelectElement).value as any;
    const body = (document.getElementById('feedback-body') as HTMLTextAreaElement).value.trim();

    store.submitFeedback(subject, body, priority);
    alert('Đã gửi phiếu góp ý tới Ban Chấp hành Chi đoàn thành công!');
    return;
  }

  // 7. Add block form
  if (target.id === 'add-block-form') {
    e.preventDefault();
    const kind = (document.getElementById('block-kind') as HTMLSelectElement).value as any;
    const targetVal = (document.getElementById('block-target') as HTMLInputElement).value.trim();
    const reason = (document.getElementById('block-reason') as HTMLInputElement).value.trim();

    store.addBlock(kind, targetVal, reason);
    const m = document.getElementById('add-block-modal');
    if (m) m.style.display = 'none';
    alert(`Đã thiết lập chặn ${kind.toUpperCase()} cho: ${targetVal}`);
    return;
  }

  // 8. SMTP Test form
  if (target.id === 'smtp-test-form') {
    e.preventDefault();
    const res = document.getElementById('smtp-test-result');
    if (res) res.style.display = 'block';
    return;
  }
});

function exportUsersToCsv() {
  const students = store.getStudents();
  let csvContent = '\uFEFFSTT,MSSV,Họ và tên,Ngày sinh,Giới tính,Quê quán,Chức vụ,Số thẻ Đoàn,Trạng thái,Điểm rèn luyện,Email\n';
  students.forEach(s => {
    csvContent += `"${s.class_number}","${s.student_id}","${s.full_name}","${s.dob || ''}","${s.gender || 'Nam'}","${s.hometown || ''}","${s.position_title || 'Đoàn viên'}","${s.card_number || ''}","${s.membership}","${s.points || 0}","${s.email}"\n`;
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `PTIT_DoanVien_D26CQCN03N_${new Date().toISOString().substring(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Subscribe to store updates
store.subscribe(() => {
  renderApp();
});

// Initial boot
renderApp();
