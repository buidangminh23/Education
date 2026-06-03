import React, { useContext, useState, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  FileText, 
  CreditCard, 
  HelpCircle, 
  CheckCircle, 
  AlertTriangle,
  Signature,
  RotateCcw,
  Send,
  MessageCircle,
  QrCode,
  Calendar,
  Award,
  BookOpen
} from 'lucide-react';

export default function ParentHub() {
  const { 
    selectedStudentId, 
    students, 
    parentQAs, 
    payStudentFee, 
    signParentReport, 
    askParentQuestion,
    submitLeaveRequest,
    leaveRequests,
    teachers,
    conductLogs,
    teacherEvaluations,
    submitTeacherEvaluation,
    assignments,
    submissions,
    attendanceLogs,
    careerTestScores
  } = useContext(AppContext);

  // Active student and parent data
  const student = students.find(s => s.id === selectedStudentId) || students[0];
  const qas = parentQAs.filter(q => q.parentName === student.parentName);
  const studentLeaves = leaveRequests ? leaveRequests.filter(l => l.studentId === student.id) : [];
  const studentConductLogs = conductLogs ? conductLogs.filter(l => l.studentId === student.id) : [];
  const conductScore = 100 + studentConductLogs.reduce((acc, curr) => acc + curr.points, 0);
  const conductGrade = conductScore >= 90 ? 'Tốt' : conductScore >= 70 ? 'Khá' : conductScore >= 50 ? 'Trung bình' : 'Yếu';
  const myEvaluations = teacherEvaluations ? teacherEvaluations.filter(e => e.raterRole === 'parent' && e.raterName === student.parentName) : [];

  const [activeSubTab, setActiveSubTab] = useState('grades'); // grades, fees, qa, leaves, evaluations
  const [showPayModal, setShowPayModal] = useState(null); // fee object if active
  const [qaInput, setQaInput] = useState('');
  const [leaveDate, setLeaveDate] = useState('');
  const [leaveReason, setLeaveReason] = useState('');

  // Teacher Evaluation states
  const [evalTeacherId, setEvalTeacherId] = useState(teachers && teachers.length > 0 ? teachers[0].id : '');
  const [evalRating, setEvalRating] = useState(5);
  const [evalComment, setEvalComment] = useState('');
  
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Calculate GPA
  const grades = Object.values(student.grades);
  const gpa = (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(2);

  // Format currency helper
  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  // Canvas Drawing Methods for parent signature
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#3b82f6'; // Blue signature ink
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const submitSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const signatureDataUrl = canvas.toDataURL();
    
    signParentReport(student.id, signatureDataUrl);
    alert('Đã ký tên xác nhận học bạ của con thành công!');
  };

  const handlePayFee = () => {
    if (!showPayModal) return;
    payStudentFee(student.id, showPayModal.id);
    setShowPayModal(null);
    alert(`Thanh toán thành công số tiền ${formatCurrency(showPayModal.amount)}!`);
  };

  const handleQaSubmit = (e) => {
    e.preventDefault();
    if (!qaInput.trim()) return;
    
    askParentQuestion(student.id, qaInput);
    setQaInput('');
    alert('Câu hỏi đã được gửi đến giáo viên chủ nhiệm!');
  };

  const handleLeaveSubmit = (e) => {
    e.preventDefault();
    if (!leaveDate || !leaveReason.trim()) return;
    
    submitLeaveRequest(student.id, leaveDate, leaveReason);
    setLeaveDate('');
    setLeaveReason('');
    alert('Đã gửi đơn xin nghỉ phép đến giáo viên chủ nhiệm!');
  };

  const handleEvaluationSubmit = (e) => {
    e.preventDefault();
    const finalTeacherId = evalTeacherId || (teachers && teachers.length > 0 ? teachers[0].id : '');
    if (!finalTeacherId || !evalComment.trim()) return;
    
    submitTeacherEvaluation(finalTeacherId, evalRating, evalComment, 'parent', student.parentName);
    setEvalComment('');
    alert('Cảm ơn bạn! Đánh giá chất lượng giảng dạy đã được gửi trực tuyến tới Ban Giám Hiệu.');
  };

  return (
    <div className="animate-fade">
      <div style={{ marginBottom: '24px' }}>
        <h1>Cổng Thông Tin Phụ Huynh</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Họ tên học sinh: <strong>{student.name}</strong> • Lớp: {student.class} • Phụ huynh: {student.parentName} • Điểm rèn luyện: <strong style={{ color: 'var(--accent-secondary)' }}>{conductScore} ({conductGrade})</strong>
        </p>
      </div>

      {/* Sub Tabs */}
      <div className="tabs-container" style={{ overflowX: 'auto', display: 'flex', flexWrap: 'nowrap', gap: '4px', paddingBottom: '6px' }} className="custom-scroll">
        <button onClick={() => setActiveSubTab('grades')} className={`tab-btn ${activeSubTab === 'grades' ? 'active' : ''}`} style={{ whiteSpace: 'nowrap' }}>
          Bảng Điểm & Ký Nhận
        </button>
        <button onClick={() => setActiveSubTab('fees')} className={`tab-btn ${activeSubTab === 'fees' ? 'active' : ''}`} style={{ whiteSpace: 'nowrap' }}>
          Học Phí & Đóng Tiền ({student.feeStatus.filter(f => !f.paid).length})
        </button>
        <button onClick={() => setActiveSubTab('qa')} className={`tab-btn ${activeSubTab === 'qa' ? 'active' : ''}`} style={{ whiteSpace: 'nowrap' }}>
          Hỏi Đáp Chủ Nhiệm ({qas.length})
        </button>
        <button onClick={() => setActiveSubTab('leaves')} className={`tab-btn ${activeSubTab === 'leaves' ? 'active' : ''}`} style={{ whiteSpace: 'nowrap' }}>
          Xin Nghỉ Phép ({studentLeaves.length})
        </button>
        <button onClick={() => setActiveSubTab('attendance')} className={`tab-btn ${activeSubTab === 'attendance' ? 'active' : ''}`} style={{ whiteSpace: 'nowrap' }}>
          Chuyên Cần Của Con
        </button>
        <button onClick={() => setActiveSubTab('ai_guidance')} className={`tab-btn ${activeSubTab === 'ai_guidance' ? 'active' : ''}`} style={{ whiteSpace: 'nowrap' }}>
          Định Hướng AI
        </button>
        <button onClick={() => setActiveSubTab('evaluations')} className={`tab-btn ${activeSubTab === 'evaluations' ? 'active' : ''}`} style={{ whiteSpace: 'nowrap' }}>
          Đánh Giá Giáo Viên ({myEvaluations.length})
        </button>
        <button onClick={() => setActiveSubTab('assignments')} className={`tab-btn ${activeSubTab === 'assignments' ? 'active' : ''}`} style={{ whiteSpace: 'nowrap' }}>
          Xem Bài Tập ({assignments ? assignments.filter(a => a.classTarget === student.class).length : 0})
        </button>
      </div>

      {/* Content panes based on sub-tabs */}
      {activeSubTab === 'grades' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
          {/* Grades Card */}
          <div className="glass-panel">
            <h2 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem' }}>
              <FileText size={18} color="var(--accent-primary)" />
              <span>Học bạ và Kết quả Học tập kì II</span>
            </h2>

            <table className="premium-table" style={{ marginBottom: '24px' }}>
              <thead>
                <tr>
                  <th>Môn Học</th>
                  <th>Điểm Số</th>
                  <th>Nhận Xét Khái Quát</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Toán học</td>
                  <td style={{ fontWeight: 600 }}>{student.grades.Math}</td>
                  <td>Tiếp thu nhanh, tư duy logic khá.</td>
                </tr>
                <tr>
                  <td>Ngữ văn</td>
                  <td style={{ fontWeight: 600 }}>{student.grades.Literature}</td>
                  <td>Cần chăm chỉ rèn luyện kĩ năng viết nghị luận.</td>
                </tr>
                <tr>
                  <td>Vật lý</td>
                  <td style={{ fontWeight: 600 }}>{student.grades.Physics}</td>
                  <td>Làm bài tập đầy đủ, hiểu bài tốt.</td>
                </tr>
                <tr>
                  <td>Tiếng Anh</td>
                  <td style={{ fontWeight: 600 }}>{student.grades.English}</td>
                  <td>Ngữ pháp vững vàng, giao tiếp trôi chảy.</td>
                </tr>
                <tr style={{ background: 'var(--accent-primary-glow)' }}>
                  <td style={{ fontWeight: 700 }}>Điểm trung bình (GPA)</td>
                  <td style={{ fontWeight: 800, color: 'var(--accent-primary)', fontSize: '1.1rem' }}>{gpa}</td>
                  <td style={{ fontWeight: 600 }}>Xếp loại học lực: {gpa >= 8.0 ? 'Giỏi' : 'Khá'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Signature Card */}
          <div className="glass-panel">
            <h2 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem' }}>
              <Signature size={18} color="var(--accent-primary)" />
              <span>Phụ Huynh Ký Xác Nhận Học Bạ</span>
            </h2>

            {student.parentSignature ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '30px 10px', background: 'rgba(16, 185, 129, 0.05)', border: '1px dashed var(--accent-secondary)', borderRadius: '12px' }}>
                <span className="badge badge-success" style={{ marginBottom: '12px', fontSize: '0.9rem', gap: '6px' }}>
                  <CheckCircle size={14} /> Bảng điểm đã được phụ huynh ký xác nhận
                </span>
                <div style={{ padding: '8px', background: '#fff', borderRadius: '8px' }}>
                  <img src={student.parentSignature} alt="Parent Signature" style={{ height: '50px', display: 'block' }} />
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>Người ký: {student.parentName}</span>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  Kính mong phụ huynh ký xác nhận sau khi đã xem xét kĩ kết quả học tập của học sinh.
                </p>

                <div className="signature-box" style={{ width: '100%', height: '160px', marginBottom: '16px' }}>
                  <canvas
                    ref={canvasRef}
                    width={380}
                    height={160}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    style={{ width: '100%', height: '100%', display: 'block' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={clearCanvas} className="btn btn-secondary" style={{ flex: 1, gap: '6px' }}>
                    <RotateCcw size={14} />
                    <span>Vẽ lại</span>
                  </button>
                  <button onClick={submitSignature} className="btn btn-primary" style={{ flex: 1, gap: '6px' }}>
                    <CheckCircle size={14} />
                    <span>Xác nhận ký</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Conduct Logs Section */}
          <div className="glass-panel" style={{ gridColumn: 'span 2', marginTop: '20px' }}>
            <h2 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem' }}>
              <Award size={18} color="var(--accent-secondary)" />
              <span>Nhật ký Rèn luyện & Thi đua của học sinh</span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {studentConductLogs.length === 0 ? (
                <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Chưa có ghi nhận rèn luyện học tập đặc biệt.
                </div>
              ) : (
                studentConductLogs.map(log => (
                  <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255, 255, 255, 0.01)', border: '1px solid var(--border-card)', borderRadius: '8px', fontSize: '0.9rem' }}>
                    <div>
                      <strong style={{ color: log.points > 0 ? 'var(--accent-secondary)' : 'var(--accent-danger)' }}>
                        {log.points > 0 ? `+${log.points}` : log.points} điểm
                      </strong>
                      <span>: {log.reason}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}> (Ghi nhận bởi: {log.teacherName})</span>
                    </div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{log.date}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'fees' && (
        <div className="glass-panel">
          <h2 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem' }}>
            <CreditCard size={18} color="var(--accent-primary)" />
            <span>Học Phí và Các Khoản Chi Phí Đóng Góp</span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {student.feeStatus.map(fee => (
              <div 
                key={fee.id} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: '20px', 
                  borderRadius: 'var(--radius-md)', 
                  background: 'rgba(255,255,255,0.01)', 
                  border: '1px solid var(--border-card)'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{fee.name}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Mã khoản thu: {fee.id} • Hạn nộp: {fee.deadline}</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 700, color: fee.paid ? 'var(--text-primary)' : 'var(--accent-danger)' }}>
                    {formatCurrency(fee.amount)}
                  </span>
                  
                  {fee.paid ? (
                    <span className="badge badge-success" style={{ gap: '4px', padding: '8px 14px' }}>
                      <CheckCircle size={14} /> Đã đóng
                    </span>
                  ) : (
                    <button onClick={() => setShowPayModal(fee)} className="btn btn-danger" style={{ padding: '8px 16px', gap: '6px' }}>
                      <CreditCard size={14} />
                      <span>Nộp tiền ngay</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'qa' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '20px' }}>
          {/* Ask question form */}
          <div className="glass-panel">
            <h2 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem' }}>
              <MessageCircle size={18} color="var(--accent-primary)" />
              <span>Gửi Câu Hỏi Cho GVCN</span>
            </h2>

            <form onSubmit={handleQaSubmit}>
              <div className="form-group">
                <label className="form-label">Câu hỏi hoặc Đóng góp ý kiến</label>
                <textarea 
                  className="form-control" 
                  rows="4" 
                  value={qaInput}
                  onChange={e => setQaInput(e.target.value)}
                  placeholder="Hỏi về tình hình học tập của con, phản ánh bán trú..." 
                  style={{ resize: 'none' }}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', gap: '6px' }}>
                <Send size={14} />
                <span>Gửi ý kiến</span>
              </button>
            </form>
          </div>

          {/* Historical Questions list */}
          <div className="glass-panel">
            <h2 style={{ marginBottom: '16px', fontSize: '1.25rem' }}>Lịch sử trao đổi với giáo viên ({qas.length})</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {qas.length === 0 ? (
                <div style={{ padding: '24px', textCombineUpright: 'center', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Phụ huynh chưa gửi câu hỏi thắc mắc nào.
                </div>
              ) : (
                qas.map(qa => (
                  <div key={qa.id} style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-card)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Gửi ngày: {qa.date}</span>
                      <span className={`badge ${qa.status === 'pending' ? 'badge-warning' : 'badge-success'}`}>
                        {qa.status === 'pending' ? 'Đang đợi trả lời' : 'Đã phản hồi'}
                      </span>
                    </div>

                    <p style={{ fontWeight: 500, fontSize: '0.95rem', marginBottom: '10px' }}>{qa.question}</p>

                    {qa.status === 'resolved' && (
                      <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.05)', borderLeft: '3px solid var(--accent-secondary)', fontSize: '0.9rem' }}>
                        <strong>Giáo viên phản hồi:</strong> {qa.reply}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'leaves' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '20px' }}>
          {/* Submit Leave Request form */}
          <div className="glass-panel">
            <h2 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem' }}>
              <Calendar size={18} color="var(--accent-primary)" />
              <span>Đăng Ký Nghỉ Phép Cho Con</span>
            </h2>

            <form onSubmit={handleLeaveSubmit}>
              <div className="form-group">
                <label className="form-label">Chọn ngày nghỉ</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={leaveDate}
                  onChange={e => setLeaveDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Lý do xin nghỉ</label>
                <textarea 
                  className="form-control" 
                  rows="4" 
                  value={leaveReason}
                  onChange={e => setLeaveReason(e.target.value)}
                  placeholder="Nhập lý do chi tiết (Ví dụ: Cháu bị ốm sốt, gia đình có việc bận đột xuất...)" 
                  style={{ resize: 'none' }}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', gap: '6px' }}>
                <Send size={14} />
                <span>Gửi đơn xin nghỉ</span>
              </button>
            </form>
          </div>

          {/* Historical Leave Requests list */}
          <div className="glass-panel">
            <h2 style={{ marginBottom: '16px', fontSize: '1.25rem' }}>Danh sách đơn xin nghỉ phép ({studentLeaves.length})</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {studentLeaves.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Chưa có đơn xin nghỉ phép nào được tạo.
                </div>
              ) : (
                studentLeaves.map(leave => (
                  <div key={leave.id} style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-card)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Ngày xin nghỉ: {leave.date}</span>
                      <span className={`badge ${
                        leave.status === 'pending' 
                          ? 'badge-warning' 
                          : leave.status === 'approved' 
                          ? 'badge-success' 
                          : 'badge-danger'
                      }`}>
                        {leave.status === 'pending' && 'Đang chờ duyệt'}
                        {leave.status === 'approved' && 'Đã đồng ý'}
                        {leave.status === 'rejected' && 'Từ chối'}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginTop: '8px' }}>
                      <strong>Lý do:</strong> {leave.reason}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'evaluations' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '20px' }}>
          {/* Submit Evaluation form */}
          <div className="glass-panel">
            <h2 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem' }}>
              <BookOpen size={18} color="var(--accent-primary)" />
              <span>Khảo Sát Chất Lượng Giảng Dạy</span>
            </h2>

            <form onSubmit={handleEvaluationSubmit}>
              <div className="form-group">
                <label className="form-label">Chọn Giáo viên giảng dạy</label>
                <select 
                  className="form-control"
                  value={evalTeacherId}
                  onChange={e => setEvalTeacherId(e.target.value)}
                >
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name} ({teacher.subject})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Đánh giá mức độ hài lòng (Số sao)</label>
                <select 
                  className="form-control"
                  value={evalRating}
                  onChange={e => setEvalRating(parseInt(e.target.value))}
                >
                  <option value={5}>⭐⭐⭐⭐⭐ - Rất hài lòng / Xuất sắc</option>
                  <option value={4}>⭐⭐⭐⭐ - Hài lòng / Tốt</option>
                  <option value={3}>⭐⭐⭐ - Bình thường / Đạt yêu cầu</option>
                  <option value={2}>⭐⭐ - Chưa hài lòng / Cần cải tiến</option>
                  <option value={1}>⭐ - Rất không hài lòng</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Nhận xét & Đóng góp ý kiến</label>
                <textarea 
                  className="form-control" 
                  rows="4" 
                  value={evalComment}
                  onChange={e => setEvalComment(e.target.value)}
                  placeholder="Ghi nhận xét của phụ huynh về phương pháp dạy học, thái độ của giáo viên..." 
                  style={{ resize: 'none' }}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', gap: '6px' }}>
                <Send size={14} />
                <span>Gửi đánh giá</span>
              </button>
            </form>
          </div>

          {/* Historical Evaluations list */}
          <div className="glass-panel">
            <h2 style={{ marginBottom: '16px', fontSize: '1.25rem' }}>Nhận xét giáo viên đã gửi ({myEvaluations.length})</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {myEvaluations.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Phụ huynh chưa gửi đánh giá nào trong học kỳ này.
                </div>
              ) : (
                myEvaluations.map(evalItem => (
                  <div key={evalItem.id} style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-card)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <strong>Thầy/Cô: {evalItem.teacherName}</strong>
                      <span style={{ color: '#f59e0b', fontWeight: 600 }}>
                        {'⭐'.repeat(evalItem.rating)}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Gửi ngày: {evalItem.date}</span>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginTop: '8px', fontStyle: 'italic' }}>
                      "{evalItem.comment}"
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'assignments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade">
          <div className="glass-panel">
            <h2 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem' }}>
              <FileText size={18} color="var(--accent-primary)" />
              <span>Tiến độ bài tập về nhà của học sinh {student.name}</span>
            </h2>

            {(() => {
              const childAssignments = assignments ? assignments.filter(a => a.classTarget === student.class) : [];
              if (childAssignments.length === 0) {
                return (
                  <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Hiện không có bài tập nào được giao cho lớp {student.class} của con.
                  </div>
                );
              }
              return (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
                  {childAssignments.map(assignment => {
                    const sub = submissions ? submissions.find(s => s.assignmentId === assignment.id && s.studentId === student.id) : null;
                    const isSubmitted = !!sub;
                    const isGraded = sub && sub.status === 'graded';
                    
                    return (
                      <div 
                        key={assignment.id} 
                        style={{ 
                          padding: '20px', 
                          borderRadius: '16px', 
                          background: 'rgba(255, 255, 255, 0.02)', 
                          border: isGraded ? '1px solid rgba(16, 185, 129, 0.2)' : isSubmitted ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid var(--border-card)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          gap: '12px'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span className="badge badge-info">{assignment.subject} • GV: {assignment.teacherName}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hạn: {assignment.deadline}</span>
                          </div>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '8px 0', color: 'var(--text-primary)' }}>{assignment.title}</h4>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.01)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.01)', margin: '8px 0', whiteSpace: 'pre-line' }}>
                            {assignment.content}
                          </p>
                        </div>

                        <div style={{ borderTop: '1px solid var(--border-card)', paddingTop: '12px', marginTop: '4px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Trạng thái bài làm:</span>
                            {!isSubmitted ? (
                              <span className="badge badge-warning" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-danger)' }}>Chưa nộp</span>
                            ) : sub.status === 'submitted' ? (
                              <span className="badge badge-info" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)' }}>Chờ chấm điểm</span>
                            ) : (
                              <span className="badge badge-success" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-secondary)' }}>Đã chấm</span>
                            )}
                          </div>

                          {sub && (
                            <div style={{ background: 'rgba(0,0,0,0.01)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-card)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                              <div style={{ fontWeight: 600, marginBottom: '4px' }}>Nội dung làm bài:</div>
                              <div style={{ fontStyle: 'italic', marginBottom: '8px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                "{sub.submissionText}"
                              </div>
                              
                              {isGraded && (
                                <div style={{ borderTop: '1px dashed var(--border-card)', paddingTop: '8px', marginTop: '8px' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                                    <span>Điểm số:</span>
                                    <span style={{ color: 'var(--accent-secondary)' }}>{sub.grade} / 10</span>
                                  </div>
                                  {sub.feedback && (
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                      <strong>Thầy cô nhận xét:</strong> "{sub.feedback}"
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {activeSubTab === 'attendance' && (
        <div className="glass-panel animate-fade">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Calendar size={18} color="var(--accent-primary)" />
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Giám sát chuyên cần ra vào của con</h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Thời gian học sinh điểm danh tự động thông qua RFID/quét vân tay ở cổng trường.
          </p>

          <table className="premium-table">
            <thead>
              <tr>
                <th>Ngày</th>
                <th>Giờ Check-in</th>
                <th>Trạng thái</th>
                <th>Địa điểm cổng</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>01/06/2026</td>
                <td style={{ fontWeight: 600 }}>07:12 AM</td>
                <td><span className="badge badge-success">Có mặt</span></td>
                <td>Cổng chính A</td>
              </tr>
              <tr>
                <td>02/06/2026</td>
                <td style={{ fontWeight: 600 }}>07:18 AM</td>
                <td><span className="badge badge-success">Có mặt</span></td>
                <td>Cổng chính A</td>
              </tr>
              {attendanceLogs && attendanceLogs.filter(l => l.studentId === student.id).map(log => (
                <tr key={log.id}>
                  <td>{log.date.split('-').reverse().join('/')}</td>
                  <td style={{ fontWeight: 600 }}>{log.checkInTime} AM</td>
                  <td>
                    <span className={`badge ${log.status === 'present' ? 'badge-success' : log.status === 'late' ? 'badge-danger' : 'badge-secondary'}`}>
                      {log.status === 'present' ? 'Có mặt' : log.status === 'late' ? 'Đi muộn' : 'Vắng học'}
                    </span>
                  </td>
                  <td>Cổng B (Nhận diện Camera)</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeSubTab === 'ai_guidance' && (
        <div className="glass-panel animate-fade">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <Sparkles size={18} color="var(--accent-primary)" />
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Cố vấn Học vụ AI & Hướng nghiệp cho con</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', alignItems: 'start' }}>
            <div>
              <div style={{ padding: '16px', background: 'rgba(99,102,241,0.03)', borderRadius: '12px', border: '1px solid var(--border-card)', marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 12px 0' }}>Biểu đồ tiến độ học tập (Điểm trung bình)</h4>
                
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <svg width="100%" height="150" viewBox="0 0 400 150" style={{ overflow: 'visible' }}>
                    <line x1="50" y1="20" x2="350" y2="20" stroke="#e2e8f0" strokeDasharray="3,3" />
                    <line x1="50" y1="60" x2="350" y2="60" stroke="#e2e8f0" strokeDasharray="3,3" />
                    <line x1="50" y1="100" x2="350" y2="100" stroke="#e2e8f0" strokeDasharray="3,3" />
                    <line x1="50" y1="120" x2="350" y2="120" stroke="#e2e8f0" />
                    
                    <path d="M 80,80 L 160,70 L 240,65 L 320,55" fill="none" stroke="var(--accent-secondary)" strokeWidth="3" />
                    
                    <circle cx="80" cy="80" r="4" fill="#10b981" />
                    <circle cx="160" cy="70" r="4" fill="#10b981" />
                    <circle cx="240" cy="65" r="4" fill="#10b981" />
                    <circle cx="320" cy="55" r="4" fill="#10b981" />
                    
                    <text x="80" y="135" fontSize="9" fill="#94a3b8" textAnchor="middle">Tuần 32</text>
                    <text x="160" y="135" fontSize="9" fill="#94a3b8" textAnchor="middle">Tuần 33</text>
                    <text x="240" y="135" fontSize="9" fill="#94a3b8" textAnchor="middle">Tuần 34</text>
                    <text x="320" y="135" fontSize="9" fill="#94a3b8" textAnchor="middle">Tuần 35</text>
                    
                    <text x="80" y="95" fontSize="9" fontWeight="bold" fill="#334155" textAnchor="middle">7.8</text>
                    <text x="160" y="85" fontSize="9" fontWeight="bold" fill="#334155" textAnchor="middle">8.0</text>
                    <text x="240" y="80" fontSize="9" fontWeight="bold" fill="#334155" textAnchor="middle">8.2</text>
                    <text x="320" y="45" fontSize="9" fontWeight="bold" fill="var(--accent-secondary)" textAnchor="middle">8.5</text>
                  </svg>
                </div>
              </div>

              <div style={{ padding: '16px', border: '1px solid var(--border-card)', borderRadius: '12px' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Điểm dự kiến thi tốt nghiệp THPT của con</h4>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Khối A00 (Toán, Lý, Hóa):</span>
                    <strong style={{ display: 'block', fontSize: '1.25rem', color: 'var(--accent-secondary)' }}>26.5 điểm</strong>
                  </div>
                  <div style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: '20px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Khối D01 (Toán, Văn, Anh):</span>
                    <strong style={{ display: 'block', fontSize: '1.25rem', color: 'var(--accent-primary)' }}>25.3 điểm</strong>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ padding: '16px', background: 'rgba(99,102,241,0.02)', border: '1px solid var(--border-card)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>Định hướng nghề nghiệp phù hợp</h4>
              
              {(() => {
                const userScore = careerTestScores ? careerTestScores.find(c => c.studentId === student.id) : null;
                if (!userScore) {
                  return (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                      <AlertTriangle size={24} color="#f59e0b" style={{ marginBottom: '8px' }} />
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Con em chưa thực hiện bài trắc nghiệm hướng nghiệp RIASEC tại bảng điều khiển học sinh.</p>
                    </div>
                  );
                }
                
                const scoreEntries = Object.entries(userScore).filter(([k]) => k !== 'studentId');
                scoreEntries.sort((a, b) => b[1] - a[1]);
                const topTrait = scoreEntries[0][0];
                
                let adviseText = 'Con em có xu hướng kỹ thuật cao.';
                let careerMatch = 'Kỹ sư cơ điện tử, Lập trình điều khiển.';
                
                if (topTrait === 'I') {
                  adviseText = 'Cháu có tư duy nghiên cứu, tìm tòi và phân tích chiều sâu rất mạnh. Thích khám phá học thuật độc lập.';
                  careerMatch = 'Nhà nghiên cứu khoa học, Khoa học dữ liệu, Chuyên gia AI.';
                } else if (topTrait === 'S') {
                  adviseText = 'Cháu có kỹ năng tương tác xã hội tuyệt vời, thích chia sẻ, truyền thụ kiến thức và chăm sóc mọi người.';
                  careerMatch = 'Giảng viên sư phạm, Nhà tâm lý, Quản trị nguồn nhân lực.';
                } else if (topTrait === 'A') {
                  adviseText = 'Cháu giàu trí tưởng tượng, thiên hướng nghệ thuật, thẩm mỹ nhạy cảm và giàu ý tưởng độc đáo.';
                  careerMatch = 'Nhà thiết kế truyền thông, Đạo diễn, Nhà biên kịch, Copywriter.';
                } else if (topTrait === 'E') {
                  adviseText = 'Cháu năng động, có tố chất quản trị điều phối đội nhóm, giao tiếp thuyết phục tốt và dám chấp nhận thử thách.';
                  careerMatch = 'Quản lý kinh doanh, Khởi nghiệp công nghệ, Chuyên gia đầu tư.';
                } else if (topTrait === 'C') {
                  adviseText = 'Cháu cẩn thận, ngăn nắp, làm việc chặt chẽ với số liệu, hồ sơ và tuân thủ quy trình chuẩn hóa.';
                  careerMatch = 'Kế toán trưởng, Kiểm toán tài chính, Lập kế hoạch phân tích thuế.';
                }

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>
                      <strong>Nhóm nổi trội:</strong> Nhóm {topTrait}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {adviseText}
                    </p>
                    <div style={{ borderTop: '1.5px dashed rgba(0,0,0,0.06)', paddingTop: '8px', marginTop: '6px', fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                      💼 Gợi ý nghề phù hợp: {careerMatch}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Payment simulated Modal */}
      {showPayModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade">
            <h2 style={{ marginBottom: '12px', fontSize: '1.25rem' }}>Thanh Toán Học Phí Trực Tuyến</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '18px' }}>
              Thanh toán khoản thu: <strong>{showPayModal.name}</strong> số tiền <strong>{formatCurrency(showPayModal.amount)}</strong>.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-card)', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <QrCode size={36} color="var(--accent-primary)" />
                <strong style={{ fontSize: '1.1rem' }}>Mã QR Chuyển Khoản Nhanh</strong>
              </div>
              
              {/* Dummy QR Code using a stylized div */}
              <div style={{ width: '130px', height: '130px', background: '#fff', padding: '10px', borderRadius: '8px', position: 'relative', display: 'flex', flexWrap: 'wrap', contentVisibility: 'auto' }}>
                {/* SVG Mock QR Code */}
                <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                  <rect x="0" y="0" width="25" height="25" fill="#000" />
                  <rect x="5" y="5" width="15" height="15" fill="#fff" />
                  <rect x="75" y="0" width="25" height="25" fill="#000" />
                  <rect x="80" y="5" width="15" height="15" fill="#fff" />
                  <rect x="0" y="75" width="25" height="25" fill="#000" />
                  <rect x="5" y="80" width="15" height="15" fill="#fff" />
                  {/* Random pixels */}
                  <rect x="35" y="10" width="10" height="20" fill="#000" />
                  <rect x="50" y="5" width="15" height="10" fill="#000" />
                  <rect x="30" y="45" width="40" height="15" fill="#000" />
                  <rect x="10" y="40" width="15" height="25" fill="#000" />
                  <rect x="40" y="70" width="25" height="25" fill="#000" />
                  <rect x="75" y="40" width="20" height="35" fill="#000" />
                </svg>
              </div>

              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Quét mã QR bằng App Ngân hàng hoặc Ví MoMo/ZaloPay</span>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowPayModal(null)} className="btn btn-secondary" style={{ flex: 1 }}>Hủy bỏ</button>
              <button onClick={handlePayFee} className="btn btn-primary" style={{ flex: 1 }}>Thành toán giả lập</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
