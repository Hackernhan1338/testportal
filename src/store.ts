import rawStudents from './data/students.json';
import {
  Student,
  Task,
  Submission,
  EventItem,
  Attendance,
  Election,
  Announcement,
  FeedbackTicket,
  AuditLog,
  AccessBlock,
  PortalSettings
} from './types';

const STORAGE_KEYS = {
  STUDENTS: 'yp_students_v8',
  CURRENT_USER: 'yp_current_user_v8',
  TASKS: 'yp_tasks_v8',
  SUBMISSIONS: 'yp_submissions_v8',
  EVENTS: 'yp_events_v8',
  ATTENDANCES: 'yp_attendances_v8',
  ELECTIONS: 'yp_elections_v8',
  NOTICES: 'yp_notices_v8',
  FEEDBACK: 'yp_feedback_v8',
  AUDIT_LOGS: 'yp_audit_v8',
  BLOCKS: 'yp_blocks_v8',
  SETTINGS: 'yp_settings_v8',
  CURRENT_PAGE: 'yp_current_page_v8',
  THEME: 'yp_theme_v8'
};

// Initial state seed
function getInitialStudents(): Student[] {
  return rawStudents.map((s: any) => ({
    ...s,
    phone: s.phone || '090' + Math.floor(1000000 + Math.random() * 9000000),
    personal_email: s.personal_email || `${s.student_id.toLowerCase()}@gmail.com`,
    points: s.student_id === 'N26DCCN185' ? 95 : Math.floor(20 + Math.random() * 65),
    quote_text: s.student_id === 'N26DCCN185' ? 'Đâu cần thanh niên có, việc gì khó có thanh niên.' : 'Rèn đức luyện tài, vươn tầm công nghệ.',
    quote_author: s.student_id === 'N26DCCN185' ? 'Chủ tịch Hồ Chí Minh' : 'Sinh viên PTIT',
    leaderboard_visible: true,
    join_place: s.join_place || 'Trường THPT Chuyên',
    issue_place: s.issue_place || 'BCH Đoàn Học viện Công nghệ Bưu chính Viễn thông',
    activity_unit: s.activity_unit || 'Chi đoàn D26CQCN03-N',
    card_verified_at: s.card_number ? '2026-03-31 09:00:00' : undefined,
    card_verified_by: s.card_number ? 'Bí thư Chi đoàn' : undefined
  }));
}

function getInitialTasks(): Task[] {
  return [
    {
      id: 1,
      title: 'Cập nhật số Thẻ Đoàn viên điện tử',
      description: 'Nhập số thẻ Đoàn viên từ ứng dụng Thanh niên Việt Nam hoặc thẻ cứng để BCH đối chiếu cấp chứng nhận số.',
      category: 'card',
      type: 'photo',
      points: 25,
      due_at: '2026-11-30 23:59:59',
      active: true
    },
    {
      id: 2,
      title: 'Hưởng ứng Ngày hội Thanh niên Sống đẹp 2026',
      description: 'Tham gia hoạt động tình nguyện, vệ sinh giảng đường hoặc hiến máu nhân đạo và nộp ảnh minh chứng.',
      category: 'general',
      type: 'photo',
      points: 20,
      due_at: '2026-11-15 17:00:00',
      active: true
    },
    {
      id: 3,
      title: 'Cuộc thi Tìm hiểu Lịch sử Đoàn TNCS Hồ Chí Minh',
      description: 'Tham gia thi trắc nghiệm trực tuyến trên cổng Thành Đoàn, đạt điểm từ 80/100 trở lên và nộp ảnh chụp kết quả.',
      category: 'competition',
      type: 'photo',
      points: 30,
      due_at: '2026-11-20 20:00:00',
      active: true
    },
    {
      id: 4,
      title: 'Khảo sát Nhu cầu Sinh hoạt Chi đoàn Học kỳ I',
      description: 'Điền phiếu đóng góp ý kiến về các chuyên đề học thuật và kỹ năng mềm mong muốn tổ chức.',
      category: 'general',
      type: 'ack',
      points: 15,
      due_at: '2026-12-05 23:59:59',
      active: true
    }
  ];
}

function getInitialSubmissions(): Submission[] {
  return [
    {
      id: 101,
      user_id: 'N26DCCN185',
      student_name: 'Nguyễn Thiện Nhân',
      task_id: 1,
      task_title: 'Cập nhật số Thẻ Đoàn viên điện tử',
      image_url: '/assets/images/youth_card_sample.jpg',
      status: 'passed',
      feedback: 'Số thẻ 080208062693 đã đối chiếu khớp với sổ đoàn viên.',
      submitted_at: '2026-10-15 10:20:00',
      reviewed_at: '2026-10-15 14:30:00',
      extracted: {
        card_number: '080208062693',
        full_name: 'NGUYỄN THIỆN NHÂN',
        dob: '2008-03-13',
        confidence: 0.98
      }
    },
    {
      id: 102,
      user_id: 'N26DCCN153',
      student_name: 'Lê Thuỳ Duyên',
      task_id: 1,
      task_title: 'Cập nhật số Thẻ Đoàn viên điện tử',
      image_url: '/assets/images/youth_card_sample.jpg',
      status: 'pending',
      feedback: 'Đã nhận số thẻ 080208044192. Chờ cán bộ kiểm tra sổ đoàn.',
      submitted_at: '2026-10-23 09:15:00',
      extracted: {
        card_number: '080208044192',
        full_name: 'LÊ THUỲ DUYÊN',
        dob: '2008-08-05',
        confidence: 0.94
      }
    },
    {
      id: 103,
      user_id: 'N26DCCN144',
      student_name: 'Nguyễn Thành An',
      task_id: 2,
      task_title: 'Hưởng ứng Ngày hội Thanh niên Sống đẹp 2026',
      status: 'passed',
      feedback: 'Đã xác nhận tham gia buổi dọn dẹp phòng máy B2.',
      submitted_at: '2026-10-20 16:00:00',
      reviewed_at: '2026-10-21 08:30:00'
    }
  ];
}

function getInitialEvents(): EventItem[] {
  return [
    {
      id: 1,
      title: 'Đại hội Chi đoàn D26CQCN03-N Nhiệm kỳ 2026 - 2027',
      description: 'Tổng kết công tác Đoàn năm học trước, thảo luận phương hướng và bầu Ban Chấp hành Chi đoàn nhiệm kỳ mới.',
      start_at: '2026-10-24 08:00:00',
      end_at: '2026-10-24 11:30:00',
      points: 20,
      active: true,
      location: 'Hội trường 2A - Học viện CNBCVT Cơ sở Man Thiện'
    },
    {
      id: 2,
      title: 'Chuyên đề: Ứng dụng AI & Kỹ năng Công nghệ trong Học tập',
      description: 'Giao lưu cùng chuyên gia cựu sinh viên PTIT về phương pháp nghiên cứu khoa học và chuẩn bị đồ án chuyên ngành.',
      start_at: '2026-11-05 14:00:00',
      end_at: '2026-11-05 17:00:00',
      points: 15,
      active: true,
      location: 'Phòng Hội thảo B1-03'
    },
    {
      id: 3,
      title: 'Ngày thứ Bảy Tình nguyện vì Giảng đường Xanh',
      description: 'Phong trào tình nguyện phân loại rác thải nhựa và chỉnh trang không gian học tập tại cơ sở đào tạo.',
      start_at: '2026-11-14 07:30:00',
      end_at: '2026-11-14 11:00:00',
      points: 25,
      active: true,
      location: 'Khuôn viên Học viện'
    }
  ];
}

function getInitialAttendances(): Attendance[] {
  return [
    {
      id: 1,
      event_id: 1,
      student_id: 'N26DCCN185',
      student_name: 'Nguyễn Thiện Nhân',
      checked_at: '2026-10-24 07:55:12',
      method: 'qr'
    },
    {
      id: 2,
      event_id: 1,
      student_id: 'N26DCCN144',
      student_name: 'Nguyễn Thành An',
      checked_at: '2026-10-24 08:01:45',
      method: 'qr'
    },
    {
      id: 3,
      event_id: 1,
      student_id: 'N26DCCN150',
      student_name: 'Phạm Trần Công Danh',
      checked_at: '2026-10-24 08:04:10',
      method: 'qr'
    }
  ];
}

function getInitialElections(): Election[] {
  return [
    {
      id: 1,
      title: 'Bầu Ban Chấp hành Chi đoàn D26CQCN03-N (Khóa 2026 - 2027)',
      description: 'Bầu chọn 03 đồng chí tiêu biểu đại diện cho 71 đoàn viên, thanh niên lớp D26CQCN03-N.',
      starts_at: '2026-10-24 08:30:00',
      ends_at: '2026-10-24 11:00:00',
      seats: 3,
      active: true,
      candidates: [
        {
          id: 1,
          student_id: 'N26DCCN185',
          full_name: 'Nguyễn Thiện Nhân',
          position: 'Đoàn viên - Đề cử Bí thư Chi đoàn',
          votes: 42
        },
        {
          id: 2,
          student_id: 'N26DCCN153',
          full_name: 'Lê Thuỳ Duyên',
          position: 'Đoàn viên - Đề cử Phó Bí thư Chi đoàn',
          votes: 38
        },
        {
          id: 3,
          student_id: 'N26DCCN150',
          full_name: 'Phạm Trần Công Danh',
          position: 'Đoàn viên - Đề cử Uỷ viên BCH',
          votes: 31
        },
        {
          id: 4,
          student_id: 'N26DCCN144',
          full_name: 'Nguyễn Thành An',
          position: 'Đoàn viên - Đề cử Uỷ viên BCH',
          votes: 27
        }
      ],
      voted_students: ['N26DCCN144', 'N26DCCN146', 'N26DCCN147', 'N26DCCN148']
    }
  ];
}

function getInitialNotices(): Announcement[] {
  return [
    {
      id: 1,
      title: 'Triệu tập Đại hội Chi đoàn D26CQCN03-N sáng ngày 24/10',
      body: 'Kính gửi toàn thể 71 đồng chí sinh viên lớp D26CQCN03-N. Đại hội Chi đoàn nhiệm kỳ mới sẽ diễn ra vào lúc 08h00 tại Hội trường 2A. Đề nghị tất cả đoàn viên mặc áo Thanh niên Việt Nam, thanh niên mặc trang phục lịch sự và mang điện thoại để quét mã điểm danh.',
      kind: 'required',
      created_at: '2026-10-22 09:00:00',
      read_by: ['N26DCCN185', 'N26DCCN153']
    },
    {
      id: 2,
      title: 'Hướng dẫn cập nhật và xác thực số Thẻ Đoàn viên điện tử',
      body: 'Các đồng chí đã có số thẻ vui lòng truy cập mục "Thẻ đoàn viên", nhập chính xác số thẻ để Ban Chấp hành đối chiếu với sổ quản lý. Chỉ bắt buộc nhập số thẻ; các thông tin khác là tuỳ chọn.',
      kind: 'general',
      created_at: '2026-10-18 14:30:00',
      read_by: ['N26DCCN185']
    },
    {
      id: 3,
      title: 'Cảnh báo an toàn thông tin & bảo mật mật khẩu tài khoản',
      body: 'Yêu cầu đoàn viên đã kích hoạt tài khoản đổi mật khẩu phức tạp từ 12 ký tự trở lên và thiết lập mã PIN 6 số. Tuyệt đối không cung cấp thông tin đăng nhập cho người khác.',
      kind: 'security',
      created_at: '2026-10-15 08:00:00',
      read_by: []
    }
  ];
}

function getInitialFeedback(): FeedbackTicket[] {
  return [
    {
      id: 1,
      student_id: 'N26DCCN147',
      student_name: 'Phạm Nguyễn Gia Bảo',
      subject: 'Đề xuất mở rộng thời gian mở điểm danh cho sinh viên ở xa',
      body: 'Do phòng học phân tán, em mong BCH kéo dài thời gian hiển thị mã QR thêm 5 phút trước giờ khai mạc để các bạn không bị lỡ điểm danh.',
      priority: 'normal',
      status: 'resolved',
      admin_reply: 'BCH ghi nhận và đã bổ sung cửa sổ điểm danh linh hoạt 15 phút đầu giờ.',
      created_at: '2026-10-19 11:00:00',
      replied_at: '2026-10-19 15:30:00'
    }
  ];
}

function getInitialAuditLogs(): AuditLog[] {
  return [
    {
      id: 1,
      actor: 'N26DCCN185 (Super Admin)',
      action: 'BOOTSTRAP_SYSTEM',
      details: 'Khởi tạo hệ thống PTIT Youth Portal theo kiến trúc FocusBrain v4.8.4',
      ip: '127.0.0.1',
      timestamp: '2026-10-23 18:00:00'
    },
    {
      id: 2,
      actor: 'N26DCCN185 (Super Admin)',
      action: 'IMPORT_PROFILES',
      details: 'Nhập và bảo toàn toàn bộ 71 hồ sơ sinh viên Chi đoàn D26CQCN03-N',
      ip: '127.0.0.1',
      timestamp: '2026-10-23 18:05:00'
    },
    {
      id: 3,
      actor: 'N26DCCN185 (Super Admin)',
      action: 'APPROVE_CARD',
      details: 'Xác thực số thẻ Đoàn viên 080208062693',
      ip: '127.0.0.1',
      timestamp: '2026-10-23 18:30:00'
    }
  ];
}

function getInitialBlocks(): AccessBlock[] {
  return [
    {
      id: 1,
      kind: 'ip',
      target: '198.51.100.44',
      reason: 'Quá 10 lần đăng nhập sai liên tiếp',
      created_at: '2026-10-21 14:22:00',
      expires_at: '2026-10-28 14:22:00'
    }
  ];
}

function getInitialSettings(): PortalSettings {
  return {
    ocr_mode: 'optional', // 'off', 'optional', 'required'
    allow_registration: false,
    maintenance_mode: false,
    smtp_host: 'smtp.gmail.com',
    smtp_port: 587,
    smtp_user: 'youth-portal@student.ptithcm.edu.vn',
    modules: {
      home: true,
      profile: true,
      card: true,
      tasks: true,
      events: true,
      competitions: true,
      leaderboard: true,
      elections: true,
      notifications: true,
      officers: true,
      feedback: true,
      legal: true
    }
  };
}

class Store {
  private students: Student[] = [];
  private currentUser: Student | null = null;
  private tasks: Task[] = [];
  private submissions: Submission[] = [];
  private events: EventItem[] = [];
  private attendances: Attendance[] = [];
  private elections: Election[] = [];
  private notices: Announcement[] = [];
  private feedback: FeedbackTicket[] = [];
  private auditLogs: AuditLog[] = [];
  private blocks: AccessBlock[] = [];
  private settings: PortalSettings = getInitialSettings();
  private currentPage: string = 'home';
  private listeners: (() => void)[] = [];

  constructor() {
    this.init();
  }

  private init() {
    // Load students
    const savedStudents = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (savedStudents) {
      try {
        this.students = JSON.parse(savedStudents);
      } catch (e) {
        this.students = getInitialStudents();
      }
    } else {
      this.students = getInitialStudents();
      this.save(STORAGE_KEYS.STUDENTS, this.students);
    }

    // Default current user: Nguyễn Thiện Nhân (N26DCCN185)
    const savedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        this.currentUser = this.students.find(s => s.student_id === parsed.student_id) || this.students[0];
      } catch (e) {
        this.currentUser = this.students.find(s => s.student_id === 'N26DCCN185') || this.students[0];
      }
    } else {
      this.currentUser = this.students.find(s => s.student_id === 'N26DCCN185') || this.students[0];
      this.save(STORAGE_KEYS.CURRENT_USER, this.currentUser);
    }

    this.tasks = this.loadOrInit(STORAGE_KEYS.TASKS, getInitialTasks);
    this.submissions = this.loadOrInit(STORAGE_KEYS.SUBMISSIONS, getInitialSubmissions);
    this.events = this.loadOrInit(STORAGE_KEYS.EVENTS, getInitialEvents);
    this.attendances = this.loadOrInit(STORAGE_KEYS.ATTENDANCES, getInitialAttendances);
    this.elections = this.loadOrInit(STORAGE_KEYS.ELECTIONS, getInitialElections);
    this.notices = this.loadOrInit(STORAGE_KEYS.NOTICES, getInitialNotices);
    this.feedback = this.loadOrInit(STORAGE_KEYS.FEEDBACK, getInitialFeedback);
    this.auditLogs = this.loadOrInit(STORAGE_KEYS.AUDIT_LOGS, getInitialAuditLogs);
    this.blocks = this.loadOrInit(STORAGE_KEYS.BLOCKS, getInitialBlocks);
    this.settings = this.loadOrInit(STORAGE_KEYS.SETTINGS, getInitialSettings);

    const savedPage = localStorage.getItem(STORAGE_KEYS.CURRENT_PAGE);
    if (savedPage) this.currentPage = savedPage;

    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  private loadOrInit<T>(key: string, initializer: () => T): T {
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        const val = initializer();
        this.save(key, val);
        return val;
      }
    }
    const val = initializer();
    this.save(key, val);
    return val;
  }

  private save(key: string, val: any) {
    localStorage.setItem(key, JSON.stringify(val));
  }

  public subscribe(fn: () => void) {
    this.listeners.push(fn);
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  // Getters
  public getStudents(): Student[] {
    return this.students;
  }

  public getCurrentUser(): Student {
    return this.currentUser || this.students[0];
  }

  public getTasks(): Task[] {
    return this.tasks;
  }

  public getSubmissions(): Submission[] {
    return this.submissions;
  }

  public getEvents(): EventItem[] {
    return this.events;
  }

  public getAttendances(): Attendance[] {
    return this.attendances;
  }

  public getElections(): Election[] {
    return this.elections;
  }

  public getNotices(): Announcement[] {
    return this.notices;
  }

  public getFeedback(): FeedbackTicket[] {
    return this.feedback;
  }

  public getAuditLogs(): AuditLog[] {
    return this.auditLogs;
  }

  public getBlocks(): AccessBlock[] {
    return this.blocks;
  }

  public getSettings(): PortalSettings {
    return this.settings;
  }

  public getCurrentPage(): string {
    return this.currentPage;
  }

  // Setters & Actions
  public setCurrentPage(page: string) {
    this.currentPage = page;
    localStorage.setItem(STORAGE_KEYS.CURRENT_PAGE, page);
    this.notify();
  }

  public switchUser(student_id: string) {
    const target = this.students.find(s => s.student_id === student_id);
    if (target) {
      this.currentUser = target;
      this.save(STORAGE_KEYS.CURRENT_USER, target);
      this.logAction(target.student_id, 'SWITCH_ACCOUNT', `Chuyển sang tài khoản ${target.full_name} (${target.student_id})`);
      this.notify();
    }
  }

  public toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(STORAGE_KEYS.THEME, next);
    this.notify();
  }

  public logAction(actor: string, action: string, details: string) {
    const newLog: AuditLog = {
      id: Date.now(),
      actor,
      action,
      details,
      ip: '127.0.0.1',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    this.auditLogs.unshift(newLog);
    this.save(STORAGE_KEYS.AUDIT_LOGS, this.auditLogs);
  }

  public updateCard(cardNumber: string, joinedDate?: string, joinPlace?: string, issuePlace?: string, activityUnit?: string) {
    if (!this.currentUser) return;
    this.currentUser.card_number = cardNumber;
    if (joinedDate) this.currentUser.joined_date = joinedDate;
    if (joinPlace) this.currentUser.join_place = joinPlace;
    if (issuePlace) this.currentUser.issue_place = issuePlace;
    if (activityUnit) this.currentUser.activity_unit = activityUnit;
    
    // Create submission record for card
    const existingSub = this.submissions.find(s => s.user_id === this.currentUser!.student_id && s.task_id === 1);
    if (existingSub) {
      existingSub.status = 'pending';
      existingSub.feedback = 'Số thẻ đã cập nhật, chờ cán bộ chi đoàn đối chiếu và phê duyệt.';
      existingSub.submitted_at = new Date().toISOString().replace('T', ' ').substring(0, 19);
    } else {
      this.submissions.unshift({
        id: Date.now(),
        user_id: this.currentUser.student_id,
        student_name: this.currentUser.full_name,
        task_id: 1,
        task_title: 'Cập nhật số Thẻ Đoàn viên điện tử',
        status: 'pending',
        feedback: 'Đã nhận số thẻ ' + cardNumber + ', chờ kiểm duyệt.',
        submitted_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
        extracted: {
          card_number: cardNumber,
          full_name: this.currentUser.full_name,
          confidence: 0.95
        }
      });
    }

    // Save
    const idx = this.students.findIndex(s => s.student_id === this.currentUser!.student_id);
    if (idx !== -1) this.students[idx] = { ...this.currentUser };
    this.save(STORAGE_KEYS.STUDENTS, this.students);
    this.save(STORAGE_KEYS.SUBMISSIONS, this.submissions);
    this.logAction(this.currentUser.student_id, 'UPDATE_CARD', `Cập nhật số thẻ: ${cardNumber}`);
    this.notify();
  }

  public approveCard(student_id: string, reviewer: string) {
    const student = this.students.find(s => s.student_id === student_id);
    if (student) {
      student.card_verified_at = new Date().toISOString().replace('T', ' ').substring(0, 19);
      student.card_verified_by = reviewer;
      student.points = (student.points || 0) + 25;
      
      const sub = this.submissions.find(s => s.user_id === student_id && s.task_id === 1);
      if (sub) {
        sub.status = 'passed';
        sub.feedback = 'Số thẻ hợp lệ, đã xác nhận và cộng 25 điểm hoạt động.';
        sub.reviewed_at = new Date().toISOString().replace('T', ' ').substring(0, 19);
      }
      this.save(STORAGE_KEYS.STUDENTS, this.students);
      this.save(STORAGE_KEYS.SUBMISSIONS, this.submissions);
      this.logAction(reviewer, 'APPROVE_CARD', `Duyệt xác thực thẻ cho sinh viên ${student.full_name} (${student_id})`);
      this.notify();
    }
  }

  public rejectCard(student_id: string, reviewer: string, reason: string) {
    const student = this.students.find(s => s.student_id === student_id);
    if (student) {
      const sub = this.submissions.find(s => s.user_id === student_id && s.task_id === 1);
      if (sub) {
        sub.status = 'rejected';
        sub.feedback = reason || 'Số thẻ không trùng khớp với sổ Đoàn viên lưu tại cơ sở.';
        sub.reviewed_at = new Date().toISOString().replace('T', ' ').substring(0, 19);
      }
      this.save(STORAGE_KEYS.SUBMISSIONS, this.submissions);
      this.logAction(reviewer, 'REJECT_CARD', `Từ chối thẻ sinh viên ${student.full_name} (${student_id}): ${reason}`);
      this.notify();
    }
  }

  public setOcrMode(mode: 'off' | 'optional' | 'required') {
    this.settings.ocr_mode = mode;
    this.save(STORAGE_KEYS.SETTINGS, this.settings);
    this.logAction(this.currentUser?.student_id || 'ADMIN', 'SET_OCR_MODE', `Thiết lập chế độ OCR sang: ${mode.toUpperCase()}`);
    this.notify();
  }

  public checkInAttendance(eventId: number, studentId: string, method: 'qr' | 'manual' = 'qr'): { success: boolean; message: string } {
    const already = this.attendances.find(a => a.event_id === eventId && a.student_id === studentId);
    if (already) {
      return { success: false, message: 'Đồng chí đã điểm danh sự kiện này rồi (chống ghi nhận trùng).' };
    }
    const student = this.students.find(s => s.student_id === studentId);
    const event = this.events.find(e => e.id === eventId);
    if (!student || !event) {
      return { success: false, message: 'Thông tin sinh viên hoặc sự kiện không hợp lệ.' };
    }

    const newAtt: Attendance = {
      id: Date.now(),
      event_id: eventId,
      student_id: studentId,
      student_name: student.full_name,
      checked_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      method
    };

    this.attendances.unshift(newAtt);
    student.points = (student.points || 0) + event.points;
    this.save(STORAGE_KEYS.ATTENDANCES, this.attendances);
    this.save(STORAGE_KEYS.STUDENTS, this.students);
    this.logAction(studentId, 'EVENT_ATTENDANCE', `Điểm danh thành công sự kiện "${event.title}" (+${event.points} điểm)`);
    this.notify();
    return { success: true, message: `Điểm danh thành công! Đã cộng +${event.points} điểm hoạt động.` };
  }

  public voteElection(electionId: number, candidateId: number): { success: boolean; message: string } {
    const election = this.elections.find(e => e.id === electionId);
    if (!election) return { success: false, message: 'Bầu cử không tồn tại.' };
    if (election.voted_students.includes(this.currentUser!.student_id)) {
      return { success: false, message: 'Đồng chí đã hoàn thành bỏ phiếu cho kỳ bầu cử này rồi.' };
    }

    const cand = election.candidates.find(c => c.id === candidateId);
    if (!cand) return { success: false, message: 'Ứng viên không hợp lệ.' };

    cand.votes++;
    election.voted_students.push(this.currentUser!.student_id);
    this.save(STORAGE_KEYS.ELECTIONS, this.elections);
    this.logAction(this.currentUser!.student_id, 'CAST_BALLOT', `Bỏ phiếu bầu cử ID ${electionId} (Ẩn danh bảo mật)`);
    this.notify();
    return { success: true, message: 'Bỏ phiếu thành công! Cảm ơn đồng chí đã thực hiện quyền cử tri.' };
  }

  public submitFeedback(subject: string, body: string, priority: 'low' | 'normal' | 'high') {
    const newTicket: FeedbackTicket = {
      id: Date.now(),
      student_id: this.currentUser!.student_id,
      student_name: this.currentUser!.full_name,
      subject,
      body,
      priority,
      status: 'new',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    this.feedback.unshift(newTicket);
    this.save(STORAGE_KEYS.FEEDBACK, this.feedback);
    this.logAction(this.currentUser!.student_id, 'SUBMIT_FEEDBACK', `Gửi góp ý: ${subject}`);
    this.notify();
  }

  public replyFeedback(id: number, reply: string) {
    const t = this.feedback.find(f => f.id === id);
    if (t) {
      t.admin_reply = reply;
      t.status = 'resolved';
      t.replied_at = new Date().toISOString().replace('T', ' ').substring(0, 19);
      this.save(STORAGE_KEYS.FEEDBACK, this.feedback);
      this.logAction(this.currentUser!.student_id, 'REPLY_FEEDBACK', `Phản hồi góp ý #${id}`);
      this.notify();
    }
  }

  public addBlock(kind: 'ip' | 'device', target: string, reason: string) {
    const newBlock: AccessBlock = {
      id: Date.now(),
      kind,
      target,
      reason,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      expires_at: new Date(Date.now() + 7 * 86400000).toISOString().replace('T', ' ').substring(0, 19)
    };
    this.blocks.unshift(newBlock);
    this.save(STORAGE_KEYS.BLOCKS, this.blocks);
    this.logAction(this.currentUser!.student_id, 'ADD_BLOCK', `Chặn ${kind.toUpperCase()}: ${target} - ${reason}`);
    this.notify();
  }

  public removeBlock(id: number) {
    this.blocks = this.blocks.filter(b => b.id !== id);
    this.save(STORAGE_KEYS.BLOCKS, this.blocks);
    this.logAction(this.currentUser!.student_id, 'REMOVE_BLOCK', `Hủy chặn #${id}`);
    this.notify();
  }

  public updateStudent(updated: Partial<Student> & { student_id: string }) {
    const idx = this.students.findIndex(s => s.student_id === updated.student_id);
    if (idx !== -1) {
      this.students[idx] = { ...this.students[idx], ...updated };
      if (this.currentUser?.student_id === updated.student_id) {
        this.currentUser = { ...this.students[idx] };
        this.save(STORAGE_KEYS.CURRENT_USER, this.currentUser);
      }
      this.save(STORAGE_KEYS.STUDENTS, this.students);
      this.notify();
    }
  }
}

export const store = new Store();
