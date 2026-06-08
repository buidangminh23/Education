import { Users, ClipboardList, BarChart3, CheckCircle, Star, ChevronRight, Calendar, Edit3, Plus, X, Phone } from 'lucide-react';
import { Stat, SectionCard, Pill, Bar, Avatar } from './DashUI';
import { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';

const AV = (n) => `https://i.pravatar.cc/120?img=${n}`;

const CLASSES = [
  { name: '10A2', students: 42, avgGrade: 8.1, attendance: 97, pending: 12, color: 'blue' },
  { name: '10A5', students: 40, avgGrade: 7.6, attendance: 95, pending: 8, color: 'violet' },
  { name: '11A1', students: 44, avgGrade: 8.4, attendance: 99, pending: 23, color: 'mint' },
];

const TO_GRADE = [
  { student: 'Lê Hoàng Nam', cls: '10A2', task: 'Bài tập chương 3', avatar: AV(33) },
  { student: 'Phạm Thuý Vy', cls: '11A1', task: 'Kiểm tra 15 phút', avatar: AV(48) },
  { student: 'Đỗ Gia Bảo', cls: '10A5', task: 'Bài tập chương 3', avatar: AV(15) },
  { student: 'Vũ Khánh Linh', cls: '10A2', task: 'Đề cương ôn tập', avatar: AV(20) },
];

const SCHEDULE = [
  { time: '07:50', cls: '10A2', topic: 'Hàm số bậc hai', color: 'blue' },
  { time: '09:45', cls: '11A1', topic: 'Tổ hợp – xác suất', color: 'mint' },
  { time: '14:00', cls: '10A5', topic: 'Ôn tập chương 3', color: 'violet' },
];

export default function TeacherOverview({ teacherName, onEnterGradesClick, onAssignHomeworkClick, onViewAssignmentsClick }) {
  const { students } = useContext(AppContext);
  const [selectedClassDetail, setSelectedClassDetail] = useState(null);

  const honorMatch = teacherName && teacherName.match(/^(Thầy|Cô)/i);
  const honor = honorMatch && honorMatch[1].toLowerCase() === 'thầy' ? 'Thầy' : 'Cô';
  const shortName = teacherName ? teacherName.replace(/^(Thầy|Cô)\s+/i, '').split(' ').pop() : 'Hoa';

  const getClassStudents = (className) => {
    const fromContext = students.filter(s => s.class === className);
    if (fromContext.length > 0) return fromContext;
    
    // Generate mock students for classes with no seed data
    return [
      { id: `HS-${className}-001`, name: 'Nguyễn Văn Minh', avgGrade: 8.2, attendance: 98, parentPhone: '0912345678', avatarUrl: AV(10) },
      { id: `HS-${className}-002`, name: 'Trần Thị Thu Hà', avgGrade: 7.9, attendance: 96, parentPhone: '0987654321', avatarUrl: AV(12) },
      { id: `HS-${className}-003`, name: 'Lê Hoàng Hải', avgGrade: 8.5, attendance: 99, parentPhone: '0901234567', avatarUrl: AV(14) },
      { id: `HS-${className}-004`, name: 'Phạm Minh Hằng', avgGrade: 7.2, attendance: 94, parentPhone: '0934567890', avatarUrl: AV(16) },
      { id: `HS-${className}-005`, name: 'Đỗ Tuấn Kiệt', avgGrade: 8.7, attendance: 97, parentPhone: '0978901234', avatarUrl: AV(18) }
    ].map(s => ({
      ...s,
      class: className,
      grades: { Math: s.avgGrade, Literature: s.avgGrade - 0.5, Physics: s.avgGrade + 0.3, English: s.avgGrade }
    }));
  };

  return (
    <>
      <div>
        <div className="page-head">
        <div>
          <h2 className="page-title">Chào {honor.toLowerCase()} {shortName} {honor === 'Thầy' ? '🌟' : '🌷'}</h2>
          <p className="page-sub">{honor} đang phụ trách <b style={{ color: 'var(--accent-ink)' }}>3 lớp</b> · <b style={{ color: 'var(--accent-ink)' }}>43 bài</b> cần chấm hôm nay.</p>
        </div>
        <div className="flex gap-12">
          <button className="btn btn-ghost" onClick={onEnterGradesClick}><Edit3 size={17} /> Nhập điểm</button>
          <button className="btn btn-primary" onClick={onAssignHomeworkClick}><Plus size={18} /> Giao bài tập</button>
        </div>
      </div>

      <div className="ds-grid cols-4" style={{ marginBottom: 20 }}>
        <Stat icon={Users} color="mint" val="126" label="Tổng học sinh" sub="3 lớp phụ trách" delay="d1" />
        <Stat icon={ClipboardList} color="orange" val="43" label="Bài cần chấm" sub="Ưu tiên hôm nay" delay="d2" />
        <Stat icon={BarChart3} color="blue" val="8.0" label="GPA trung bình" sub="Cả 3 lớp" trend={0.2} delay="d3" />
        <Stat icon={CheckCircle} color="violet" val="97%" label="Chuyên cần" sub="Tuần này" trend={0.5} delay="d4" />
      </div>

      <div className="ds-grid" style={{ gridTemplateColumns: '1.5fr 1fr' }}>
        <div className="col" style={{ gap: 20 }}>
          <SectionCard title="Lớp của tôi" icon={Users} delay="d2" action={<button onClick={() => setSelectedClassDetail(CLASSES[0])} className="btn btn-soft btn-sm">Quản lý lớp</button>}>
            <div className="col" style={{ gap: 12 }}>
              {CLASSES.map((c) => (
                <div key={c.name} className="flex items-center gap-16" style={{ padding: 14, border: '1px solid var(--line)', borderRadius: 'var(--r-md)', cursor: 'pointer' }} onClick={() => setSelectedClassDetail(c)}>
                  <div className={`chip-ico bg-${c.color} t-${c.color}`} style={{ width: 52, height: 52, fontFamily: 'Fredoka', fontWeight: 600, fontSize: '1.05rem' }}>{c.name}</div>
                  <div style={{ flex: 1 }}>
                    <div className="flex between items-center">
                      <span style={{ fontWeight: 800, fontSize: '1rem' }}>Lớp {c.name}</span>
                      {c.pending > 0 && <Pill color="orange">{c.pending} bài chờ chấm</Pill>}
                    </div>
                    <div className="flex gap-16 muted" style={{ fontSize: '0.8rem', fontWeight: 600, marginTop: 8 }}>
                      <span className="flex items-center gap-6"><Users size={14} /> {c.students} HS</span>
                      <span className="flex items-center gap-6"><Star size={14} /> GPA {c.avgGrade}</span>
                      <span className="flex items-center gap-6"><CheckCircle size={14} /> {c.attendance}% chuyên cần</span>
                    </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setSelectedClassDetail(c); }} className="icon-btn" aria-label={`Chi tiết lớp ${c.name}`}><ChevronRight size={18} /></button>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="So sánh điểm trung bình các lớp" icon={BarChart3} delay="d3">
            <div className="col" style={{ gap: 18, paddingTop: 4 }}>
              {CLASSES.map((c) => (
                <div key={c.name}>
                  <div className="flex between" style={{ marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>Lớp {c.name}</span>
                    <span className={`t-${c.color}`} style={{ fontWeight: 800 }}>{c.avgGrade}</span>
                  </div>
                  <Bar value={c.avgGrade} color={c.color} />
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="col" style={{ gap: 20 }}>
          <SectionCard title="Hàng đợi chấm bài" icon={ClipboardList} delay="d3" action={<Pill color="orange">43</Pill>}>
            <div className="col" style={{ gap: 6 }}>
              {TO_GRADE.map((g, i) => (
                <div className="row" key={i}>
                  <Avatar src={g.avatar} name={g.student} size={42} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.86rem' }}>{g.student}</div>
                    <div className="muted" style={{ fontSize: '0.78rem' }}>{g.task} · Lớp {g.cls}</div>
                  </div>
                  <button onClick={onViewAssignmentsClick} className="btn btn-soft btn-sm">Chấm</button>
                </div>
              ))}
            </div>
            <button onClick={onViewAssignmentsClick} className="btn btn-ghost btn-sm" style={{ width: '100%', marginTop: 10 }}>Xem tất cả 43 bài</button>
          </SectionCard>

          <SectionCard title="Lịch dạy hôm nay" icon={Calendar} delay="d4">
            <div className="col" style={{ gap: 8 }}>
              {SCHEDULE.map((p, i) => (
                <div className="tt-period" key={i} style={{ borderLeftColor: `var(--${p.color})` }}>
                  <span style={{ fontWeight: 800, fontSize: '0.9rem', minWidth: 48 }}>{p.time}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Lớp {p.cls}</div>
                    <div className="muted" style={{ fontSize: '0.78rem' }}>{p.topic}</div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
      {/* Dynamic Class Details Modal */}
      {selectedClassDetail && (() => {
        const currentClass = selectedClassDetail;
        const classStudentsData = getClassStudents(currentClass.name);
        
        return (
          <div style={{ position: 'fixed', inset: 0, zIndex: 6000, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <div className="glass-panel animate-fade" style={{ background: '#fff', borderRadius: 24, padding: 24, maxWidth: 650, width: '100%', boxShadow: '0 32px 80px rgba(0,0,0,0.25)', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: '1.4rem' }}>🏫</span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#1e293b' }}>
                      Quản lý chi tiết: Lớp {currentClass.name}
                    </h3>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Xem hồ sơ học sinh, điểm trung bình môn và chuyên cần lớp</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <select 
                    value={currentClass.name} 
                    onChange={(e) => {
                      const found = CLASSES.find(c => c.name === e.target.value);
                      if (found) setSelectedClassDetail(found);
                    }}
                    style={{ fontSize: '0.8rem', padding: '4px 8px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.15)', background: '#fff', fontWeight: 600, color: '#4f46e5' }}
                  >
                    {CLASSES.map(c => (
                      <option key={c.name} value={c.name}>Lớp {c.name}</option>
                    ))}
                  </select>
                  <button onClick={() => setSelectedClassDetail(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} aria-label="Đóng"><X size={18} /></button>
                </div>
              </div>

              {/* Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                <div style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.1)', borderRadius: 14, padding: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#4f46e5' }}>{currentClass.students}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Tổng số học sinh</div>
                </div>
                <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.1)', borderRadius: 14, padding: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>{currentClass.avgGrade}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Điểm GPA Lớp</div>
                </div>
                <div style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.1)', borderRadius: 14, padding: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b' }}>{currentClass.attendance}%</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Tỷ lệ chuyên cần</div>
                </div>
              </div>

              {/* Students Table */}
              <div>
                <h4 style={{ margin: '8px 0 10px', fontSize: '0.9rem', fontWeight: 700, color: '#334155' }}>
                  Sĩ số học sinh ({classStudentsData.length})
                </h4>
                <div style={{ maxHeight: 220, overflowY: 'auto', border: '1px solid rgba(0,0,0,0.05)', borderRadius: 12 }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                        <th style={{ padding: '8px 12px', fontWeight: 600 }}>Mã HS</th>
                        <th style={{ padding: '8px 12px', fontWeight: 600 }}>Học sinh</th>
                        <th style={{ padding: '8px 12px', fontWeight: 600, textAlign: 'center' }}>GPA</th>
                        <th style={{ padding: '8px 12px', fontWeight: 600, textAlign: 'center' }}>Chuyên cần</th>
                        <th style={{ padding: '8px 12px', fontWeight: 600, textAlign: 'center' }}>Liên lạc</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classStudentsData.map((std, idx) => (
                        <tr key={idx} style={{ borderBottom: idx < classStudentsData.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}>
                          <td style={{ padding: '8px 12px', fontFamily: 'monospace', fontWeight: 600, color: '#4f46e5' }}>{std.id}</td>
                          <td style={{ padding: '8px 12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700 }}>
                              <img src={std.avatarUrl || AV(idx + 10)} alt="" style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }} />
                              <span>{std.name}</span>
                            </div>
                          </td>
                          <td style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 700, color: '#10b981' }}>{std.avgGrade || std.grades?.Math || '8.0'}</td>
                          <td style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 600 }}>{std.attendance || '97'}%</td>
                          <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                            <a href={`tel:${std.parentPhone || '0900000000'}`} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: '50%', background: 'rgba(79,70,229,0.08)', color: '#4f46e5', border: 'none', cursor: 'pointer' }} title="Gọi điện cho phụ huynh">
                              <Phone size={11} />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Footer actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: 14, marginTop: 4 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button 
                    onClick={() => {
                      onAssignHomeworkClick();
                      setSelectedClassDetail(null);
                    }} 
                    className="btn btn-primary" 
                    style={{ padding: '8px 14px', fontSize: '0.78rem', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    <Plus size={14} /> Giao bài tập
                  </button>
                  <button 
                    onClick={() => {
                      onEnterGradesClick();
                      setSelectedClassDetail(null);
                    }} 
                    className="btn btn-secondary" 
                    style={{ padding: '8px 14px', fontSize: '0.78rem', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    <Edit3 size={14} /> Nhập điểm nhanh
                  </button>
                </div>
                <button onClick={() => setSelectedClassDetail(null)} className="btn btn-secondary" style={{ padding: '8px 18px', fontSize: '0.78rem', borderRadius: 8 }}>
                  Đóng
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
}
