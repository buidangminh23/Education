import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Video, 
  MessageSquare, 
  DollarSign, 
  FileText, 
  GraduationCap, 
  Award, 
  HelpCircle,
  LogOut,
  Calendar
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const { currentRole, selectedStudentId, students, logout, userSession } = useContext(AppContext);

  const activeStudent = students.find(s => s.id === selectedStudentId) || students[0];

  const getNavItems = () => {
    switch (currentRole) {
      case 'admin':
        return [
          { id: 'dashboard', label: 'Tổng quan BGH', icon: LayoutDashboard },
          { id: 'students', label: 'Quản lý Học sinh', icon: Users },
          { id: 'teachers', label: 'Quản lý Giáo viên', icon: GraduationCap },
          { id: 'journal', label: 'Sổ đầu bài', icon: BookOpen },
          { id: 'calendar', label: 'Thời khóa biểu', icon: Calendar }
        ];
      case 'teacher':
        return [
          { id: 'dashboard', label: 'Tổng quan lớp học', icon: LayoutDashboard },
          { id: 'journal', label: 'Ghi sổ đầu bài', icon: BookOpen },
          { id: 'qas', label: 'Hỏi đáp phụ huynh', icon: MessageSquare },
          { id: 'meet', label: 'Phòng học EduMeet', icon: Video },
          { id: 'calendar', label: 'Thời khóa biểu', icon: Calendar }
        ];
      case 'student':
        return [
          { id: 'dashboard', label: 'Bảng học tập', icon: LayoutDashboard },
          { id: 'lectures', label: 'Video bài giảng', icon: FileText },
          { id: 'tutor', label: 'Gia sư AI 24/7', icon: HelpCircle },
          { id: 'meet', label: 'Vào lớp EduMeet', icon: Video },
          { id: 'calendar', label: 'Thời khóa biểu', icon: Calendar }
        ];
      case 'parent':
        return [
          { id: 'dashboard', label: 'Bảng điểm của con', icon: Award },
          { id: 'fees', label: 'Đóng học phí', icon: DollarSign },
          { id: 'qas', label: 'Hỏi đáp với GVCN', icon: MessageSquare },
          { id: 'calendar', label: 'Thời khóa biểu', icon: Calendar }
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const getProfileName = () => {
    if (userSession) return userSession.displayName;
    if (currentRole === 'admin') return 'Hiệu trưởng';
    if (currentRole === 'teacher') return 'Thầy Minh Triết';
    if (currentRole === 'student') return activeStudent?.name || 'Học sinh';
    if (currentRole === 'parent') return `PH. ${activeStudent?.parentName}` || 'Phụ huynh';
    return 'Người dùng';
  };

  const getProfileSub = () => {
    if (currentRole === 'admin') return 'Ban Giám Hiệu';
    if (currentRole === 'teacher') return 'Môn Toán - Lớp 12A1';
    if (currentRole === 'student') return `Học sinh - Lớp ${activeStudent?.class}`;
    if (currentRole === 'parent') return `Phụ huynh lớp ${activeStudent?.class}`;
    return 'EduPortal';
  };

  return (
    <aside className="sidebar">
      <div>
        <div className="logo-container">
          <GraduationCap className="logo-icon" size={32} color="#4f46e5" />
          <span className="logo-text">EduPortal</span>
        </div>

        <nav className="nav-links">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div>
        {/* Logout action Button */}
        <div style={{ padding: '0 8px 12px 8px' }}>
          <button 
            onClick={logout} 
            className="btn btn-secondary" 
            style={{ 
              width: '100%', 
              padding: '10px', 
              display: 'flex', 
              gap: '8px',
              color: 'var(--accent-danger)',
              borderColor: 'rgba(185, 28, 28, 0.15)',
              background: 'rgba(185, 28, 28, 0.04)'
            }}
          >
            <LogOut size={16} />
            <span style={{ fontWeight: 600 }}>Đăng xuất</span>
          </button>
        </div>

        <div className="user-profile-widget">
          <div className="avatar" style={{ background: 'linear-gradient(135deg, #818cf8, #4f46e5)' }}>
            {getProfileName().charAt(0).toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {getProfileName()}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {getProfileSub()}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
