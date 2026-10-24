export interface Student {
  student_id: string;
  email: string;
  full_name: string;
  dob: string;
  pass_hash: string;
  must_change: number;
  membership: 'member' | 'not_joined' | 'local' | 'pending' | 'transferred' | 'unknown';
  position_title: string;
  joined_date: string;
  card_number: string;
  card_verified_at?: string;
  card_verified_by?: string;
  class_name: string;
  gender: string;
  hometown: string;
  ethnic_group: string;
  religion: string;
  class_number: number;
  role: 'user' | 'admin';
  admin_level: 'NONE' | 'ANALYST' | 'MODERATOR' | 'ADMIN' | 'SUPER_ADMIN';
  phone?: string;
  personal_email?: string;
  party_joined_date?: string;
  activity_unit?: string;
  join_place?: string;
  issue_place?: string;
  quote_text?: string;
  quote_author?: string;
  avatar_path?: string;
  points?: number;
  leaderboard_visible?: boolean;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  category: 'card' | 'general' | 'competition';
  type: 'photo' | 'ack';
  points: number;
  due_at: string;
  active: boolean;
}

export interface Submission {
  id: number;
  user_id: string;
  student_name: string;
  task_id: number;
  task_title: string;
  image_url?: string;
  status: 'pending' | 'passed' | 'rejected' | 'needs_review';
  feedback: string;
  submitted_at: string;
  reviewed_at?: string;
  extracted?: {
    card_number?: string;
    full_name?: string;
    dob?: string;
    confidence?: number;
  };
}

export interface EventItem {
  id: number;
  title: string;
  description: string;
  start_at: string;
  end_at: string;
  points: number;
  active: boolean;
  location: string;
}

export interface Attendance {
  id: number;
  event_id: number;
  student_id: string;
  student_name: string;
  checked_at: string;
  method: 'qr' | 'manual';
}

export interface Election {
  id: number;
  title: string;
  description: string;
  starts_at: string;
  ends_at: string;
  seats: number;
  active: boolean;
  candidates: {
    id: number;
    student_id: string;
    full_name: string;
    position: string;
    votes: number;
  }[];
  voted_students: string[];
}

export interface Announcement {
  id: number;
  title: string;
  body: string;
  kind: 'general' | 'security' | 'required';
  created_at: string;
  read_by: string[];
}

export interface FeedbackTicket {
  id: number;
  student_id: string;
  student_name: string;
  subject: string;
  body: string;
  priority: 'low' | 'normal' | 'high';
  status: 'new' | 'processing' | 'resolved';
  admin_reply?: string;
  created_at: string;
  replied_at?: string;
}

export interface AuditLog {
  id: number;
  actor: string;
  action: string;
  details: string;
  ip: string;
  timestamp: string;
}

export interface AccessBlock {
  id: number;
  kind: 'ip' | 'device';
  target: string;
  reason: string;
  created_at: string;
  expires_at: string;
}

export interface PortalSettings {
  ocr_mode: 'off' | 'optional' | 'required';
  allow_registration: boolean;
  maintenance_mode: boolean;
  smtp_host: string;
  smtp_port: number;
  smtp_user: string;
  modules: {
    [key: string]: boolean;
  };
}
