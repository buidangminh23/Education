import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Login from './components/Login';
import PrincipalDashboard from './components/PrincipalDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import ClassJournal from './components/ClassJournal';
import ParentHub from './components/ParentHub';
import StudentDashboard from './components/StudentDashboard';
import AITutor from './components/AITutor';
import VideoLectures from './components/VideoLectures';
import EduMeet from './components/EduMeet';
import SchoolCalendar from './components/SchoolCalendar';
import { Users, GraduationCap, ShieldCheck, Mail, Phone } from 'lucide-react';

function App() {
  const { currentRole, userSession } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Reset tab on role switch
  useEffect(() => {
    setActiveTab('dashboard');
  }, [currentRole]);

  // If no active session, render the beautiful Login Portal
  if (!userSession) {
    return <Login />;
  }

  // Main page content router
  const renderTabContent = () => {
    if (activeTab === 'calendar') {
      return <SchoolCalendar />;
    }

    // 1. BAN GIÁM HIỆU
    if (currentRole === 'admin') {
      switch (activeTab) {
        case 'dashboard':
          return <PrincipalDashboard />;
        case 'students':
          return <AdminStudentManager />;
        case 'teachers':
          return <AdminTeacherManager />;
        case 'journal':
          return <ClassJournal />;
        default:
          return <PrincipalDashboard />;
      }
    }
    
    // 2. GIÁO VIÊN
    if (currentRole === 'teacher') {
      switch (activeTab) {
        case 'dashboard':
          return <TeacherDashboard />;
        case 'journal':
          return <ClassJournal />;
        case 'qas':
          return <TeacherDashboard />;
        case 'meet':
          return <EduMeet />;
        default:
          return <TeacherDashboard />;
      }
    }

    // 3. HỌC SINH
    if (currentRole === 'student') {
      switch (activeTab) {
        case 'dashboard':
          return <StudentDashboard setActiveTab={setActiveTab} />;
        case 'lectures':
          return <VideoLectures />;
        case 'tutor':
          return <AITutor />;
        case 'meet':
          return <EduMeet />;
        default:
          return <StudentDashboard setActiveTab={setActiveTab} />;
      }
    }

    // 4. PHỤ HUYNH
    if (currentRole === 'parent') {
      return <ParentHub />;
    }

    return <div>Không tìm thấy nội dung.</div>;
  };

  return (
    <div className="app-container">
      {/* Navigation Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="main-content">
        {/* Header / Navbar */}
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* Main Content Viewport */}
        <main className="content-pane">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
}

// Sub-component: Student profile table for Admin/BGH view
function AdminStudentManager() {
  const { students, addStudent } = useContext(AppContext);
  const [showAdd, setShowAdd] = useState(false);
  const [newStd, setNewStd] = useState({ name: '', class: '12A1', parentName: '', parentPhone: '' });
  
  // Filter states
  const [selectedGrade, setSelectedGrade] = useState('All'); // All, 12, 11, 10
  const [selectedClass, setSelectedClass] = useState('All'); // All, 12A1, 12A2, 11A1, 10A1

  // Handle grade change and auto-adjust class filter
  const handleGradeChange = (grade) => {
    setSelectedGrade(grade);
    setSelectedClass('All'); // Reset class selection when grade changes
  };

  // Get classes list based on selected grade
  const getClassOptions = () => {
    if (selectedGrade === '12') return ['12A1', '12A2'];
    if (selectedGrade === '11') return ['11A1'];
    if (selectedGrade === '10') return ['10A1'];
    return ['12A1', '12A2', '11A1', '10A1']; // for 'All'
  };

  const filteredStudents = students.filter(s => {
    const matchGrade = selectedGrade === 'All' || s.grade === selectedGrade;
    const matchClass = selectedClass === 'All' || s.class === selectedClass;
    return matchGrade && matchClass;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newStd.name.trim()) return;
    addStudent(newStd);
    setShowAdd(false);
    setNewStd({ name: '', class: '12A1', parentName: '', parentPhone: '' });
    alert('Đã tiếp nhận hồ sơ học sinh mới!');
  };

  return (
    <div className="glass-panel animate-fade">
      {/* Roster Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h3>Hồ Sơ Học Sinh Toàn Trường ({students.length})</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Danh sách học sinh chính quy trực thuộc hệ thống đào tạo.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn btn-primary">Thêm Học Sinh Mới</button>
      </div>

      {/* Grade and Class Filters */}
      <div style={{ 
        background: 'rgba(79, 70, 229, 0.03)', 
        border: '1px solid rgba(79, 70, 229, 0.08)',
        borderRadius: '14px', 
        padding: '16px', 
        marginBottom: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {/* Grade Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', width: '90px' }}>Chọn Khối:</span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['All', '12', '11', '10'].map(grade => (
              <button
                key={grade}
                onClick={() => handleGradeChange(grade)}
                className={`btn ${selectedGrade === grade ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '20px' }}
              >
                {grade === 'All' ? 'Tất cả Khối' : `Khối ${grade}`}
              </button>
            ))}
          </div>
        </div>

        {/* Class Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', width: '90px' }}>Chọn Lớp:</span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedClass('All')}
              className={`btn ${selectedClass === 'All' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '20px' }}
            >
              Tất cả Lớp
            </button>
            {getClassOptions().map(cls => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={`btn ${selectedClass === cls ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '20px' }}
              >
                Lớp {cls}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="premium-table">
          <thead>
            <tr>
              <th>Mã HS</th>
              <th>Ảnh</th>
              <th>Họ và Tên</th>
              <th>Khối</th>
              <th>Lớp</th>
              <th>Phụ Huynh</th>
              <th>Số điện thoại</th>
              <th>Điểm TB học kì</th>
              <th>Trạng thái học phí</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                  Không tìm thấy học sinh nào thuộc bộ lọc hiện tại.
                </td>
              </tr>
            ) : (
              filteredStudents.map(s => {
                const grades = Object.values(s.grades);
                const avg = (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(2);
                const unpaidCount = s.feeStatus.filter(f => !f.paid).length;
                return (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{s.id}</td>
                    <td>
                      <img 
                        src={s.avatarUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80'} 
                        alt={s.name} 
                        style={{ 
                          width: '38px', 
                          height: '38px', 
                          borderRadius: '50%', 
                          objectFit: 'cover', 
                          border: '2px solid rgba(79, 70, 229, 0.1)'
                        }} 
                      />
                    </td>
                    <td style={{ fontWeight: 600 }}>{s.name}</td>
                    <td><span className="badge badge-info">Khối {s.grade}</span></td>
                    <td><span className="badge badge-success">Lớp {s.class}</span></td>
                    <td>{s.parentName}</td>
                    <td><span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}><Phone size={12} /> {s.parentPhone}</span></td>
                    <td style={{ fontWeight: 700, color: avg >= 8 ? 'var(--accent-secondary)' : 'var(--text-primary)' }}>{avg}</td>
                    <td>
                      {unpaidCount === 0 ? (
                        <span className="badge badge-success">Đã hoàn thành</span>
                      ) : (
                        <span className="badge badge-danger">Còn nợ {unpaidCount} khoản</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade" style={{ background: 'white' }}>
            <h3 style={{ marginBottom: '16px' }}>Tiếp Nhận Học Sinh Mới</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Họ và Tên Học Sinh</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={newStd.name}
                  onChange={e => setNewStd({...newStd, name: e.target.value})}
                  placeholder="Lê Văn B" 
                  required 
                  style={{ background: 'white', borderColor: '#cbd5e1', color: '#1e293b' }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Xếp lớp</label>
                <select 
                  className="form-control"
                  value={newStd.class}
                  onChange={e => setNewStd({...newStd, class: e.target.value})}
                  style={{ background: 'white', borderColor: '#cbd5e1', color: '#1e293b' }}
                >
                  <option value="12A1">Lớp 12A1 (Khối 12)</option>
                  <option value="12A2">Lớp 12A2 (Khối 12)</option>
                  <option value="11A1">Lớp 11A1 (Khối 11)</option>
                  <option value="10A1">Lớp 10A1 (Khối 10)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Họ Tên Phụ Huynh</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={newStd.parentName}
                  onChange={e => setNewStd({...newStd, parentName: e.target.value})}
                  placeholder="Lê Văn A" 
                  required 
                  style={{ background: 'white', borderColor: '#cbd5e1', color: '#1e293b' }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Số điện thoại liên hệ</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={newStd.parentPhone}
                  onChange={e => setNewStd({...newStd, parentPhone: e.target.value})}
                  placeholder="09xxxxxxxx" 
                  required 
                  style={{ background: 'white', borderColor: '#cbd5e1', color: '#1e293b' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="button" onClick={() => setShowAdd(false)} className="btn btn-secondary" style={{ flex: 1 }}>Hủy</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Lưu hồ sơ</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-component: Teacher manager wrapper for Admin/BGH view (reuses list from dashboard)
function AdminTeacherManager() {
  const { teachers } = useContext(AppContext);

  // Filter states
  const [selectedGrade, setSelectedGrade] = useState('All'); // All, 12, 11, 10
  const [selectedClass, setSelectedClass] = useState('All'); // All, 12A1, 12A2, 11A1, 10A1

  // Handle grade change and auto-adjust class filter
  const handleGradeChange = (grade) => {
    setSelectedGrade(grade);
    setSelectedClass('All'); // Reset class selection when grade changes
  };

  // Get classes list based on selected grade
  const getClassOptions = () => {
    if (selectedGrade === '12') return ['12A1', '12A2'];
    if (selectedGrade === '11') return ['11A1'];
    if (selectedGrade === '10') return ['10A1'];
    return ['12A1', '12A2', '11A1', '10A1']; // for 'All'
  };

  const filteredTeachers = teachers.filter(t => {
    if (!t.classJoined) {
      return selectedGrade === 'All' && selectedClass === 'All';
    }
    const teacherGrade = t.classJoined.substring(0, 2);
    const matchGrade = selectedGrade === 'All' || teacherGrade === selectedGrade;
    const matchClass = selectedClass === 'All' || t.classJoined === selectedClass;
    return matchGrade && matchClass;
  });

  return (
    <div className="glass-panel animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h3>Danh sách Hội đồng Sư phạm ({teachers.length})</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Xem chi tiết thông tin nhân sự giáo viên các bộ môn.</p>
        </div>
      </div>

      {/* Grade and Class Filters */}
      <div style={{ 
        background: 'rgba(79, 70, 229, 0.03)', 
        border: '1px solid rgba(79, 70, 229, 0.08)',
        borderRadius: '14px', 
        padding: '16px', 
        marginBottom: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {/* Grade Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', width: '90px' }}>Chọn Khối:</span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['All', '12', '11', '10'].map(grade => (
              <button
                key={grade}
                onClick={() => handleGradeChange(grade)}
                className={`btn ${selectedGrade === grade ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '20px' }}
              >
                {grade === 'All' ? 'Tất cả Khối' : `Khối ${grade}`}
              </button>
            ))}
          </div>
        </div>

        {/* Class Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', width: '90px' }}>Chủ nhiệm Lớp:</span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedClass('All')}
              className={`btn ${selectedClass === 'All' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '20px' }}
            >
              Tất cả Lớp
            </button>
            {getClassOptions().map(cls => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={`btn ${selectedClass === cls ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '20px' }}
              >
                Lớp {cls}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="premium-table">
          <thead>
            <tr>
              <th>Mã GV</th>
              <th>Ảnh</th>
              <th>Họ và Tên</th>
              <th>Môn phụ trách</th>
              <th>Hòm thư liên hệ</th>
              <th>Số điện thoại</th>
              <th>Lớp chủ nhiệm</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeachers.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                  Không tìm thấy giáo viên nào chủ nhiệm bộ lọc này.
                </td>
              </tr>
            ) : (
              filteredTeachers.map(t => (
                <tr key={t.id}>
                  <td style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{t.id}</td>
                  <td>
                    <img 
                      src={t.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80'} 
                      alt={t.name} 
                      style={{ 
                        width: '38px', 
                        height: '38px', 
                        borderRadius: '50%', 
                        objectFit: 'cover', 
                        border: '2px solid rgba(79, 70, 229, 0.1)'
                      }} 
                    />
                  </td>
                  <td style={{ fontWeight: 600 }}>{t.name}</td>
                  <td><span className="badge badge-info">{t.subject}</span></td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}><Mail size={12} /> {t.email}</span>
                  </td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}><Phone size={12} /> {t.phone}</span>
                  </td>
                  <td><span className="badge badge-success">{t.classJoined || 'Tự do'}</span></td>
                  <td>
                    <span className="badge badge-success" style={{ gap: '2px' }}>
                      <ShieldCheck size={12} /> Đang công tác
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
