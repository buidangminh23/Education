import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Award, 
  BookOpen, 
  HelpCircle, 
  Calendar, 
  ArrowRight,
  Sparkles,
  Send,
  Star,
  Users,
  CheckCircle,
  FileText,
  UserCheck,
  Brain,
  Trash2,
  Plus,
  Compass,
  AlertCircle,
  Clock,
  ChevronRight,
  Smile,
  Heart
} from 'lucide-react';

export default function StudentDashboard({ setActiveTab }) {
  const { 
    selectedStudentId, 
    students, 
    tutorChat,
    teachers,
    conductLogs,
    teacherEvaluations,
    submitTeacherEvaluation,
    assignments,
    submissions,
    submitAssignment,
    attendanceLogs,
    clubs,
    clubApplications,
    submitClubApplication,
    learningResources,
    flashcards,
    createFlashcard,
    deleteFlashcard,
    careerTestScores,
    saveCareerTest
  } = useContext(AppContext);

  const [subTab, setSubTab] = useState('overview'); 
  // overview, conduct, evaluations, assignments, ai_advisor, attendance, clubs, library, counseling

  const [submissionTexts, setSubmissionTexts] = useState({}); // assignmentId -> text
  const student = students.find(s => s.id === selectedStudentId) || students[0];

  // Calculate GPA
  const subjectGrades = student.grades;
  const gradesArray = Object.values(subjectGrades);
  const gpa = (gradesArray.reduce((a, b) => a + b, 0) / gradesArray.length).toFixed(2);

  // AI Tutor questions count
  const tutorMsgCount = tutorChat.filter(m => m.sender === 'user').length;

  // Conduct points
  const studentConductLogs = conductLogs ? conductLogs.filter(l => l.studentId === student.id) : [];
  const conductScore = 100 + studentConductLogs.reduce((acc, curr) => acc + curr.points, 0);
  const conductGrade = conductScore >= 90 ? 'Tốt' : conductScore >= 70 ? 'Khá' : conductScore >= 50 ? 'Trung bình' : 'Yếu';
  
  // Rater Evaluations
  const myEvaluations = teacherEvaluations ? teacherEvaluations.filter(e => e.raterRole === 'student' && e.raterName === student.name) : [];

  // Form states
  const [evalTeacherId, setEvalTeacherId] = useState(teachers && teachers.length > 0 ? teachers[0].id : '');
  const [evalRating, setEvalRating] = useState(5);
  const [evalComment, setEvalComment] = useState('');

  // Part 6 States: CLB application
  const [selectedClubId, setSelectedClubId] = useState(clubs && clubs.length > 0 ? clubs[0].id : '');
  const [clubAppIntro, setClubAppIntro] = useState('');

  // Part 6 States: Flashcard creator
  const [newFlashcardFront, setNewFlashcardFront] = useState('');
  const [newFlashcardBack, setNewFlashcardBack] = useState('');
  const [flippedCards, setFlippedCards] = useState({}); // cardId -> boolean

  // Part 6 States: Quizzes trắc nghiệm
  const [activeQuizStep, setActiveQuizStep] = useState(0); // 0: start, 1: questions, 2: score
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizScore, setQuizScore] = useState(0);

  // Part 6 States: RIASEC Test Questionnaire
  const [riasecAnswers, setRiasecAnswers] = useState({ R: 3, I: 3, A: 3, S: 3, E: 3, C: 3 });
  const [hasCompletedRiasec, setHasCompletedRiasec] = useState(() => {
    return careerTestScores ? careerTestScores.some(s => s.studentId === student.id) : false;
  });

  // Part 6 States: Counseling chat box
  const [counselorInput, setCounselorInput] = useState('');
  const [counselorHistory, setCounselorHistory] = useState([
    { sender: 'counselor', text: 'Chào em, thầy là chuyên gia tư vấn tâm lý học đường. Kỳ thi tốt nghiệp sắp tới chắc hẳn đem lại nhiều lo lắng. Em có muốn chia sẻ những áp lực hiện tại hoặc khúc mắc về định hướng nghề nghiệp không? Thầy luôn ở đây lắng nghe và hỗ trợ em.' }
  ]);

  const handleEvaluationSubmit = (e) => {
    e.preventDefault();
    const finalTeacherId = evalTeacherId || (teachers && teachers.length > 0 ? teachers[0].id : '');
    if (!finalTeacherId || !evalComment.trim()) return;

    submitTeacherEvaluation(finalTeacherId, evalRating, evalComment, 'student', student.name);
    setEvalComment('');
    alert('Cảm ơn ý kiến của bạn! Đánh giá chất lượng giảng dạy đã được gửi trực tuyến tới Ban Giám Hiệu.');
  };

  const handleSubSubmit = (assignmentId) => {
    const text = submissionTexts[assignmentId];
    if (!text || !text.trim()) {
      alert('Vui lòng nhập nội dung câu trả lời/bài làm trước khi nộp!');
      return;
    }
    submitAssignment(assignmentId, student.id, text);
    setSubmissionTexts(prev => ({ ...prev, [assignmentId]: '' }));
    alert('Đã nộp bài làm thành công! Hệ thống sẽ cập nhật trạng thái chấm điểm của giáo viên bộ môn.');
  };

  const handleClubApply = (e) => {
    e.preventDefault();
    if (!clubAppIntro.trim()) return;
    submitClubApplication(student.id, selectedClubId, clubAppIntro);
    setClubAppIntro('');
    alert('Đã nộp đơn ứng tuyển CLB thành công! Ban giám hiệu sẽ rà soát đơn duyệt sớm nhất.');
  };

  const handleAddFlashcard = (e) => {
    e.preventDefault();
    if (!newFlashcardFront.trim() || !newFlashcardBack.trim()) return;
    createFlashcard(student.id, newFlashcardFront, newFlashcardBack);
    setNewFlashcardFront('');
    setNewFlashcardBack('');
    alert('Đã lưu thẻ Flashcard mới!');
  };

  // Toggle flashcard flip
  const toggleFlip = (id) => {
    setFlippedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Static Quiz questions mapping
  const quizQuestions = [
    { id: 1, q: 'Tích phân xác định ∫[0, 1] x dx có giá trị bằng:', a: '1/2', b: '1', c: '2', d: '0', ans: 'a' },
    { id: 2, q: 'Hiện tượng cộng hưởng xảy ra trong mạch RLC nối tiếp khi:', a: 'ZL > ZC', b: 'ZL < ZC', c: 'ZL = ZC', d: 'R = ZL', ans: 'c' },
    { id: 3, q: 'Tác giả của tác phẩm truyện ngắn danh tiếng "Vợ nhặt" là ai?', a: 'Tô Hoài', b: 'Kim Lân', c: 'Nam Cao', d: 'Nguyễn Tuân', ans: 'b' },
    { id: 4, q: 'Trong tiếng Anh, từ nào mang ý nghĩa là "người hướng dẫn/cố vấn"?', a: 'Mentor', b: 'Classmate', c: 'Principal', d: 'Schoolyard', ans: 'a' },
    { id: 5, q: 'Biểu thức tính tổng trở Z của mạch RLC nối tiếp là:', a: 'Z = R + ZL + ZC', b: 'Z = R + ZL - ZC', c: 'Z = sqrt(R² + (ZL - ZC)²)', d: 'Z = R² + (ZL - ZC)²', ans: 'c' }
  ];

  const handleQuizSubmit = () => {
    let score = 0;
    quizQuestions.forEach(q => {
      if (selectedAnswers[q.id] === q.ans) {
        score++;
      }
    });
    setQuizScore(score);
    setActiveQuizStep(2);
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setQuizScore(0);
    setActiveQuizStep(1);
  };

  // RIASEC scoring calculations & SVG Radar polygon generator
  const handleRiasecSave = () => {
    saveCareerTest(student.id, riasecAnswers);
    setHasCompletedRiasec(true);
    alert('Đã lưu kết quả khảo sát RIASEC thành công!');
  };

  // Get student's RIASEC scores from local state or context database
  const getRiasecScores = () => {
    const contextScore = careerTestScores ? careerTestScores.find(s => s.studentId === student.id) : null;
    return contextScore || riasecAnswers;
  };

  const getRiasecText = (scores) => {
    // Find top personality types
    const entries = Object.entries(scores).filter(([k]) => k !== 'studentId');
    entries.sort((a, b) => b[1] - a[1]);
    const topTrait = entries[0][0];

    switch (topTrait) {
      case 'R': return { name: 'R - Kỹ thuật (Realistic)', desc: 'Thích làm việc với máy móc, công cụ, bản vẽ kỹ thuật. Phù hợp các khối ngành Kỹ sư, Lập trình điều khiển, Robotics.', jobs: 'Kỹ sư cơ điện tử, Kỹ sư phần mềm, Kiến trúc sư, Chuyên gia tự động hóa.' };
      case 'I': return { name: 'I - Nghiên cứu (Investigative)', desc: 'Thích quan sát, tìm tòi, suy luận logic để giải quyết vấn đề toán/lý/hóa học. Thích làm việc độc lập nghiên cứu.', jobs: 'Nhà khoa học dữ liệu, Nhà nghiên cứu toán học, Lập trình viên AI, Bác sĩ học thuật.' };
      case 'A': return { name: 'A - Nghệ thuật (Artistic)', desc: 'Thích tự do sáng tạo nghệ thuật, giàu trí tưởng tượng, cảm xúc nhạy bén và kỹ năng biểu đạt cao.', jobs: 'Nhà thiết kế đồ họa, Biên kịch phim, Đạo diễn nghệ thuật, Nhà báo tự do.' };
      case 'S': return { name: 'S - Xã hội (Social)', desc: 'Thích hỗ trợ, đào tạo, giao lưu và chăm sóc những người xung quanh. Có tinh thần đồng đội cao.', jobs: 'Giảng viên sư phạm, Nhà tâm lý học, Quản trị nhân sự, Chuyên viên công tác xã hội.' };
      case 'E': return { name: 'E - Quản lý (Enterprising)', desc: 'Thích dẫn dắt đội ngũ, quản lý kế hoạch dự án, có khả năng đàm phán thuyết phục tốt và ham học hỏi.', jobs: 'Quản lý dự án start-up, Giám đốc tài chính, Chuyên viên marketing, Luật sư đàm phán.' };
      case 'C': return { name: 'C - Nghiệp vụ (Conventional)', desc: 'Thích tính toán số liệu, lập bảng kiểm soát, ngăn nắp và thực thi chính xác các quy trình kế toán.', jobs: 'Kế toán trưởng, Kiểm toán viên nhà nước, Chuyên viên thống kê thuế, Quản trị cơ sở dữ liệu.' };
      default: return { name: 'Hài hòa', desc: 'Sở hữu nhiều phẩm chất tính cách nghề nghiệp cân bằng.', jobs: 'Nhiều lĩnh vực đa dạng.' };
    }
  };

  const currentScores = getRiasecScores();
  const riasecInfo = getRiasecText(currentScores);

  // Generate radar points for SVG (Radar Graph)
  const getRadarPointsPath = (scores) => {
    const center = 150;
    const maxVal = 5;
    const radarRadius = 100;
    const axes = [
      { k: 'R', angle: 0 },
      { k: 'I', angle: Math.PI / 3 },
      { k: 'A', angle: (2 * Math.PI) / 3 },
      { k: 'S', angle: Math.PI },
      { k: 'E', angle: (4 * Math.PI) / 3 },
      { k: 'C', angle: (5 * Math.PI) / 3 }
    ];

    const points = axes.map(axis => {
      const score = scores[axis.k] || 3;
      const length = (score / maxVal) * radarRadius;
      const x = center + length * Math.sin(axis.angle);
      const y = center - length * Math.cos(axis.angle);
      return `${x},${y}`;
    });

    return points.join(' ');
  };

  // AI Counselor automatic text response simulator
  const handleCounselorSend = (e) => {
    e.preventDefault();
    if (!counselorInput.trim()) return;

    const userMsg = { sender: 'user', text: counselorInput };
    setCounselorHistory(prev => [...prev, userMsg]);
    setCounselorInput('');

    setTimeout(() => {
      let reply = 'Thầy luôn sẵn sàng đồng hành cùng em. Em hãy cố gắng phân chia thời gian biểu học tập và nghỉ ngơi hợp lý nhé!';
      const txt = counselorInput.toLowerCase();

      if (txt.includes('áp lực') || txt.includes('lo lắng') || txt.includes('stress') || txt.includes('mệt')) {
        reply = 'Thầy rất thông cảm với em. Áp lực thi cử là điều hầu như học sinh cuối cấp nào cũng gặp phải. Em hãy nhớ rằng, một bộ óc minh mẫn cần có những khoảng nghỉ ngơi. Đừng ngần ngại dành ra 15-20 phút nghe nhạc hoặc đi bộ sau mỗi 2 tiếng tự học nhé. Em đang làm rất tốt rồi!';
      } else if (txt.includes('riasec') || txt.includes('chọn ngành') || txt.includes('hướng nghiệp') || txt.includes('nghề')) {
        reply = `Kết quả trắc nghiệm RIASEC của em cho thấy xu hướng vượt trội ở nhóm **${riasecInfo.name}**. Đây là cơ sở khoa học để em tham khảo các ngành liên quan đến: *${riasecInfo.jobs}*. Em có muốn hỏi sâu hơn về ngành nghề cụ thể nào trong nhóm này không?`;
      } else if (txt.includes('toán') || txt.includes('lý') || txt.includes('văn')) {
        reply = 'Đối với các môn thi tốt nghiệp chính yếu, em có thể tận dụng thêm Kho Học liệu bài giảng của trường ở mục Học liệu để tải sơ đồ tư duy hoặc nhờ Gia sư AI giải đáp tức thì các bài tập khó nhé.';
      }

      setCounselorHistory(prev => [...prev, { sender: 'counselor', text: reply }]);
    }, 1200);
  };

  const myAssignments = assignments ? assignments.filter(a => a.classTarget === student.class) : [];
  const myAttendance = attendanceLogs ? attendanceLogs.filter(l => l.studentId === student.id) : [];
  const myClubsApps = clubApplications ? clubApplications.filter(a => a.studentId === student.id) : [];

  return (
    <div className="animate-fade">
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1>Chào mừng trở lại, {student.name}! 🚀</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Lớp {student.class} • Điểm rèn luyện: <strong style={{ color: 'var(--accent-secondary)' }}>{conductScore} ({conductGrade})</strong>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', padding: '8px 16px', background: 'var(--accent-primary-glow)', border: '1px solid rgba(139, 92, 246, 0.15)', borderRadius: '99px' }}>
          <Sparkles size={16} color="var(--accent-primary)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-primary)' }}>Chế độ học tập tích cực</span>
        </div>
      </div>

      {/* Sub Tabs Container */}
      <div className="tabs-container" style={{ marginBottom: '24px', overflowX: 'auto', display: 'flex', flexWrap: 'nowrap', gap: '4px', paddingBottom: '6px' }} className="custom-scroll">
        <button onClick={() => setSubTab('overview')} className={`tab-btn ${subTab === 'overview' ? 'active' : ''}`} style={{ whiteSpace: 'nowrap' }}>
          Tổng Quan Học Tập
        </button>
        <button onClick={() => setSubTab('ai_advisor')} className={`tab-btn ${subTab === 'ai_advisor' ? 'active' : ''}`} style={{ whiteSpace: 'nowrap' }}>
          Tư vấn Học tập AI
        </button>
        <button onClick={() => setSubTab('attendance')} className={`tab-btn ${subTab === 'attendance' ? 'active' : ''}`} style={{ whiteSpace: 'nowrap' }}>
          Điểm Danh Chuyên Cần
        </button>
        <button onClick={() => setSubTab('conduct')} className={`tab-btn ${subTab === 'conduct' ? 'active' : ''}`} style={{ whiteSpace: 'nowrap' }}>
          Rèn Luyện ({studentConductLogs.length})
        </button>
        <button onClick={() => setSubTab('assignments')} className={`tab-btn ${subTab === 'assignments' ? 'active' : ''}`} style={{ whiteSpace: 'nowrap' }}>
          Bài Tập Về Nhà ({myAssignments.length})
        </button>
        <button onClick={() => setSubTab('library')} className={`tab-btn ${subTab === 'library' ? 'active' : ''}`} style={{ whiteSpace: 'nowrap' }}>
          Học Liệu & Flashcards
        </button>
        <button onClick={() => setSubTab('clubs')} className={`tab-btn ${subTab === 'clubs' ? 'active' : ''}`} style={{ whiteSpace: 'nowrap' }}>
          Câu Lạc Bộ
        </button>
        <button onClick={() => setSubTab('counseling')} className={`tab-btn ${subTab === 'counseling' ? 'active' : ''}`} style={{ whiteSpace: 'nowrap' }}>
          Tư Vấn & Hướng Nghiệp
        </button>
        <button onClick={() => setSubTab('evaluations')} className={`tab-btn ${subTab === 'evaluations' ? 'active' : ''}`} style={{ whiteSpace: 'nowrap' }}>
          Khảo Sát Giáo Viên ({myEvaluations.length})
        </button>
      </div>

      {/* OVERVIEW TAB */}
      {subTab === 'overview' && (
        <div className="animate-fade">
          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            <div className="glass-panel stat-card">
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>ĐIỂM TRUNG BÌNH HỌC KỲ</span>
                <div style={{ fontSize: '2rem', marginTop: '6px', color: 'var(--accent-primary)', fontWeight: 'bold' }}>{gpa}/10</div>
              </div>
              <div className="stat-icon"><Award size={24} /></div>
            </div>

            <div className="glass-panel stat-card">
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>TỶ LỆ CHUYÊN CẦN THÁNG 6</span>
                <div style={{ fontSize: '2rem', marginTop: '6px', fontWeight: 'bold' }}>
                  {myAttendance.length > 0 ? `${Math.round((myAttendance.filter(l => l.status !== 'absent').length / 3) * 100)}%` : '100%'}
                </div>
              </div>
              <div className="stat-icon" style={{ color: 'var(--accent-secondary)', background: 'var(--accent-secondary-glow)' }}><UserCheck size={24} /></div>
            </div>

            <div className="glass-panel stat-card">
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>BÀI GIẢNG ĐÃ XEM</span>
                <div style={{ fontSize: '2rem', marginTop: '6px', fontWeight: 'bold' }}>3 video</div>
              </div>
              <div className="stat-icon" style={{ color: 'var(--accent-info)', background: 'var(--accent-primary-glow)' }}><BookOpen size={24} /></div>
            </div>

            <div className="glass-panel stat-card">
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>TRAO ĐỔI VỚI GIA SƯ AI</span>
                <div style={{ fontSize: '2rem', marginTop: '6px', fontWeight: 'bold' }}>{tutorMsgCount} câu hỏi</div>
              </div>
              <div className="stat-icon" style={{ color: 'var(--accent-warning)', background: 'rgba(245, 158, 11, 0.1)' }}><HelpCircle size={24} /></div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', marginBottom: '30px' }}>
            {/* Weekly Timetable preview */}
            <div className="glass-panel">
              <h2 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem' }}>
                <Calendar size={18} color="var(--accent-primary)" />
                <span>Thời khóa biểu hôm nay</span>
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { time: '07:30 - 08:15', sub: 'Toán học', room: 'Phòng 402', t: 'Thầy Triết' },
                  { time: '08:25 - 09:10', sub: 'Ngữ văn', room: 'Phòng 402', t: 'Cô Vân' },
                  { time: '09:20 - 10:05', sub: 'Vật lý', room: 'Phòng thực hành Lý', t: 'Thầy Duy' },
                  { time: '10:20 - 11:05', sub: 'Tiếng Anh', room: 'Phòng 402', t: 'Cô Hà' }
                ].map((slot, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-card)', borderRadius: '8px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>{slot.time}</span>
                    <div style={{ flex: 1, paddingLeft: '24px' }}>
                      <div style={{ fontWeight: 600 }}>{slot.sub}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{slot.t}</div>
                    </div>
                    <span className="badge badge-info">{slot.room}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Academic profile progress */}
            <div className="glass-panel">
              <h2 style={{ marginBottom: '16px', fontSize: '1.25rem' }}>Chi tiết kết quả môn học</h2>
              
              <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {Object.keys(subjectGrades).map(sub => {
                  const score = subjectGrades[sub];
                  const getSubjectName = (key) => {
                    if (key === 'Math') return 'Toán học';
                    if (key === 'Literature') return 'Ngữ văn';
                    if (key === 'Physics') return 'Vật lý';
                    if (key === 'English') return 'Tiếng Anh';
                    return key;
                  };

                  return (
                    <div key={sub}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 500 }}>{getSubjectName(sub)}</span>
                        <strong style={{ color: score >= 8.5 ? 'var(--accent-secondary)' : 'var(--text-primary)' }}>{score} / 10</strong>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '99px', overflow: 'hidden' }}>
                        <div style={{ 
                          width: `${score * 10}%`, 
                          height: '100%', 
                          background: score >= 8.5 ? 'linear-gradient(to right, var(--accent-secondary), #34d399)' : 'linear-gradient(to right, var(--accent-primary), #c084fc)',
                          borderRadius: '99px' 
                        }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick shortcuts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            <div className="glass-panel glass-panel-hover" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('tutor')}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Sparkles size={16} color="var(--accent-primary)" />
                <span>Gia sư AI 24/7</span>
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                Hỏi đáp giải bài tập Toán, Lý, Hóa, Văn, Anh trực tuyến bất cứ lúc nào.
              </p>
              <span style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                Vào phòng gia sư <ArrowRight size={14} />
              </span>
            </div>

            <div className="glass-panel glass-panel-hover" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('lectures')}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <BookOpen size={16} color="var(--accent-secondary)" />
                <span>Thư viện bài giảng số</span>
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                Hệ thống video giảng dạy trực quan, ôn luyện chuyên đề thi THPT Quốc gia.
              </p>
              <span style={{ fontSize: '0.85rem', color: 'var(--accent-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                Mở thư viện video <ArrowRight size={14} />
              </span>
            </div>

            <div className="glass-panel glass-panel-hover" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('meet')}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <BookOpen size={16} color="var(--accent-info)" />
                <span>Phòng học trực tuyến EduMeet</span>
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                Tham gia phòng họp video học trực tuyến cùng thầy cô và bạn bè.
              </p>
              <span style={{ fontSize: '0.85rem', color: 'var(--accent-info)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                Vào phòng họp ngay <ArrowRight size={14} />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* AI STUDY ADVISOR TAB (PART 6) */}
      {subTab === 'ai_advisor' && (
        <div className="glass-panel animate-fade">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <Brain size={22} color="var(--accent-primary)" />
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Học vụ AI & Định hướng Lộ trình</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', alignItems: 'start' }}>
            
            {/* SVG Learning Progress chart */}
            <div>
              <div style={{ padding: '16px', background: 'rgba(79, 70, 229, 0.02)', border: '1px solid rgba(79, 70, 229, 0.08)', borderRadius: '12px', marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '0.95rem' }}>Biểu đồ tiến độ học tập kì II</h4>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <svg width="100%" height="200" viewBox="0 0 400 200" style={{ overflow: 'visible' }}>
                    {/* Gridlines */}
                    <line x1="50" y1="30" x2="350" y2="30" stroke="#f1f5f9" strokeDasharray="3,3" />
                    <line x1="50" y1="70" x2="350" y2="70" stroke="#f1f5f9" strokeDasharray="3,3" />
                    <line x1="50" y1="110" x2="350" y2="110" stroke="#f1f5f9" strokeDasharray="3,3" />
                    <line x1="50" y1="150" x2="350" y2="150" stroke="#f1f5f9" strokeDasharray="3,3" />
                    
                    {/* Axes */}
                    <line x1="50" y1="30" x2="50" y2="170" stroke="#cbd5e1" />
                    <line x1="50" y1="170" x2="350" y2="170" stroke="#cbd5e1" />
                    
                    {/* Y Labels (grades) */}
                    <text x="35" y="35" fontSize="10" fill="#94a3b8" textAnchor="end">10.0</text>
                    <text x="35" y="75" fontSize="10" fill="#94a3b8" textAnchor="end">8.0</text>
                    <text x="35" y="115" fontSize="10" fill="#94a3b8" textAnchor="end">6.0</text>
                    <text x="35" y="155" fontSize="10" fill="#94a3b8" textAnchor="end">4.0</text>
                    
                    {/* Data Line Path */}
                    {/* T32: 7.8 (y=74), T33: 8.0 (y=70), T34: 8.2 (y=66), T35: 8.5 (y=60) */}
                    <path
                      d="M 80,78 L 160,70 L 240,66 L 320,60"
                      fill="none"
                      stroke="url(#gradient-line)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    {/* Nodes */}
                    <circle cx="80" cy="78" r="5" fill="#818cf8" stroke="white" strokeWidth="1.5" />
                    <circle cx="160" cy="70" r="5" fill="#6366f1" stroke="white" strokeWidth="1.5" />
                    <circle cx="240" cy="66" r="5" fill="#4f46e5" stroke="white" strokeWidth="1.5" />
                    <circle cx="320" cy="60" r="5" fill="#3b82f6" stroke="white" strokeWidth="1.5" />

                    {/* Nodes text grades */}
                    <text x="80" y="93" fontSize="10" fontWeight="600" fill="#475569" textAnchor="middle">7.8</text>
                    <text x="160" y="85" fontSize="10" fontWeight="600" fill="#475569" textAnchor="middle">8.0</text>
                    <text x="240" y="81" fontSize="10" fontWeight="600" fill="#475569" textAnchor="middle">8.2</text>
                    <text x="320" y="48" fontSize="10" fontWeight="700" fill="var(--accent-secondary)" textAnchor="middle">8.5</text>

                    {/* X Labels (weeks) */}
                    <text x="80" y="185" fontSize="10" fill="#94a3b8" textAnchor="middle">Tuần 32</text>
                    <text x="160" y="185" fontSize="10" fill="#94a3b8" textAnchor="middle">Tuần 33</text>
                    <text x="240" y="185" fontSize="10" fill="#94a3b8" textAnchor="middle">Tuần 34</text>
                    <text x="320" y="185" fontSize="10" fill="#94a3b8" textAnchor="middle">Tuần 35</text>

                    <defs>
                      <linearGradient id="gradient-line" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#818cf8" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              {/* Graduation mock AI prediction */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ padding: '16px', border: '1px solid var(--border-card)', borderRadius: '12px' }}>
                  <h5 style={{ margin: '0 0 10px 0', color: 'var(--text-secondary)' }}>Tổ hợp xét tuyển A00</h5>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>26.5</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ 30 điểm (Dự đoán)</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Toán: 8.8 • Lý: 9.2 • Hóa: 8.5</p>
                </div>

                <div style={{ padding: '16px', border: '1px solid var(--border-card)', borderRadius: '12px' }}>
                  <h5 style={{ margin: '0 0 10px 0', color: 'var(--text-secondary)' }}>Tổ hợp xét tuyển D01</h5>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-primary)' }}>25.3</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ 30 điểm (Dự đoán)</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Toán: 8.8 • Văn: 8.0 • Anh: 8.5</p>
                </div>
              </div>
            </div>

            {/* AI Recommendation panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ padding: '16px', background: 'rgba(99, 102, 241, 0.04)', border: '1px solid rgba(99, 102, 241, 0.1)', borderRadius: '12px' }}>
                <h4 style={{ margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem' }}>
                  <Sparkles size={16} color="var(--accent-primary)" />
                  <span>Định hướng của cố vấn học tập AI</span>
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>
                    <strong>Môn Toán học:</strong> Em đang tiến bộ rất vững vàng ở chuyên đề Hàm số và Tích phân. Tuy nhiên cần chú ý rà soát phần hình học không gian (đặc biệt các dạng toán tọa độ hóa Oxyz).
                  </div>
                  <div style={{ fontSize: '0.85rem', lineHeight: 1.5, borderTop: '1px dashed rgba(0,0,0,0.08)', paddingTop: '10px' }}>
                    <strong>Môn Vật lý:</strong> Kết quả dự đoán đạt 9.2đ, đây là thế mạnh của em. Nên tập trung làm các đề thi thử tổng hợp để rèn tốc độ làm câu trắc nghiệm khó.
                  </div>
                  <div style={{ fontSize: '0.85rem', lineHeight: 1.5, borderTop: '1px dashed rgba(0,0,0,0.08)', paddingTop: '10px' }}>
                    <strong>Môn Ngữ văn:</strong> Điểm số 7.8-8.0 ổn định, bài viết nghị luận có kết cấu tốt nhưng cần rèn luyện thêm liên hệ thực tế xã hội để tạo dấu ấn sâu sắc hơn.
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ATTENDANCE TAB (PART 6) */}
      {subTab === 'attendance' && (
        <div className="glass-panel animate-fade">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={20} color="var(--accent-secondary)" />
              <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Nhật ký điểm danh chuyên cần</h2>
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Lớp học: <strong>{student.class}</strong></span>
          </div>

          {/* Quick numbers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <div style={{ padding: '16px', background: '#ecfdf5', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#047857' }}>{myAttendance.filter(l => l.status === 'present').length + 3}</div>
              <div style={{ fontSize: '0.8rem', color: '#047857', fontWeight: 600 }}>Ngày đi học đúng giờ</div>
            </div>
            <div style={{ padding: '16px', background: '#fffbeb', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#b45309' }}>{myAttendance.filter(l => l.status === 'late').length}</div>
              <div style={{ fontSize: '0.8rem', color: '#b45309', fontWeight: 600 }}>Ngày đi học muộn</div>
            </div>
            <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#64748b' }}>{myAttendance.filter(l => l.status === 'absent').length}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Ngày xin phép nghỉ</div>
            </div>
          </div>

          <table className="premium-table">
            <thead>
              <tr>
                <th>Ngày tháng</th>
                <th>Giờ Check-in</th>
                <th>Cổng trường</th>
                <th>Trạng thái chuyên cần</th>
                <th>Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>01/06/2026</td>
                <td style={{ fontWeight: 600 }}>07:12 AM</td>
                <td>Cổng A (Quét thẻ)</td>
                <td><span className="badge badge-success">Có mặt</span></td>
                <td style={{ color: 'var(--text-muted)' }}>Đúng giờ chào cờ</td>
              </tr>
              <tr>
                <td>02/06/2026</td>
                <td style={{ fontWeight: 600 }}>07:18 AM</td>
                <td>Cổng A (Quét thẻ)</td>
                <td><span className="badge badge-success">Có mặt</span></td>
                <td style={{ color: 'var(--text-muted)' }}>Đúng giờ học</td>
              </tr>
              {myAttendance.map((log) => (
                <tr key={log.id}>
                  <td>{log.date.split('-').reverse().join('/')}</td>
                  <td style={{ fontWeight: 600 }}>{log.checkInTime} AM</td>
                  <td>Cổng B (Nhận diện camera)</td>
                  <td>
                    <span className={`badge ${log.status === 'present' ? 'badge-success' : log.status === 'late' ? 'badge-danger' : 'badge-secondary'}`}>
                      {log.status === 'present' ? 'Có mặt' : log.status === 'late' ? 'Đi muộn' : 'Nghỉ học'}
                    </span>
                  </td>
                  <td>{log.status === 'late' ? 'Đi muộn sau 07:30' : 'Đã ghi nhận điểm danh'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CONDUCT TAB */}
      {subTab === 'conduct' && (
        <div className="glass-panel animate-fade">
          <h2 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem' }}>
            <Award size={18} color="var(--accent-secondary)" />
            <span>Điểm Rèn Luyện & Thi Đua Lớp {student.class}</span>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '30px', alignItems: 'center', marginBottom: '30px' }}>
            <div style={{ textAlign: 'center', padding: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-card)', borderRadius: '16px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>ĐIỂM HIỆN TẠI</span>
              <h2 style={{ fontSize: '3rem', margin: '8px 0', color: 'var(--accent-secondary)' }}>{conductScore}</h2>
              <span className="badge badge-success" style={{ fontSize: '0.85rem', padding: '6px 14px' }}>Xếp loại: {conductGrade}</span>
            </div>
            
            <div style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              <strong>Quy chế điểm rèn luyện:</strong>
              <ul>
                <li>Điểm khởi điểm mặc định đầu học kì là 100 điểm.</li>
                <li>Học sinh được cộng điểm thưởng (+5, +10) khi có thành tích thi đua, hăng hái phát biểu xây dựng bài học hoặc tích cực tham gia phong trào CLB.</li>
                <li>Học sinh bị trừ điểm (-5, -10) khi vi phạm nội quy, đi muộn hoặc làm việc riêng trong giờ học.</li>
                <li>Xếp loại rèn luyện: Xuất sắc & Tốt (từ 90 điểm trở lên), Khá (từ 70-89 điểm), Trung bình (50-69 điểm).</li>
              </ul>
            </div>
          </div>

          <h4 style={{ marginBottom: '14px', fontWeight: 700 }}>Nhật ký thi đua học đường</h4>
          <table className="premium-table">
            <thead>
              <tr>
                <th>Ngày ghi nhận</th>
                <th>Nội dung rèn luyện</th>
                <th>Điểm cộng/trừ</th>
                <th>Giáo viên ghi nhận</th>
              </tr>
            </thead>
            <tbody>
              {studentConductLogs.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>Không có lịch sử cộng/trừ điểm rèn luyện nào.</td>
                </tr>
              ) : (
                studentConductLogs.map(log => (
                  <tr key={log.id}>
                    <td>{log.date}</td>
                    <td style={{ fontWeight: 600 }}>{log.reason}</td>
                    <td>
                      <span className={`badge ${log.points > 0 ? 'badge-success' : 'badge-danger'}`} style={{ fontWeight: 700 }}>
                        {log.points > 0 ? `+${log.points}` : log.points} điểm
                      </span>
                    </td>
                    <td>{log.teacherName}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ASSIGNMENTS TAB */}
      {subTab === 'assignments' && (
        <div className="animate-fade">
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>Danh sách Bài Tập Về Nhà được giao</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Hãy hoàn thành đúng hạn các bài tập tự luận/trắc nghiệm từ giáo viên bộ môn.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {myAssignments.length === 0 ? (
              <div className="glass-panel" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                Chưa có bài tập nào được giao cho lớp {student.class}.
              </div>
            ) : (
              myAssignments.map(assignment => {
                const sub = submissions.find(s => s.assignmentId === assignment.id && s.studentId === student.id);
                const isSubmitted = !!sub;
                const isGraded = isSubmitted && sub.status === 'graded';
                const score = isGraded ? sub.grade : null;
                const feedback = isGraded ? sub.feedback : '';
                const subText = submissionTexts[assignment.id] || '';

                return (
                  <div
                    key={assignment.id}
                    style={{
                      padding: '20px', 
                      borderRadius: '16px', 
                      background: 'white', 
                      border: isGraded ? '1.5px solid rgba(16, 185, 129, 0.25)' : isSubmitted ? '1.5px solid rgba(59, 130, 246, 0.25)' : '1px solid var(--border-card)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.01)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '12px'
                    }}
                    className="animate-fade"
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span className="badge badge-info">{assignment.subject} • {assignment.teacherName}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hạn: {assignment.deadline}</span>
                      </div>

                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '8px 0', color: 'var(--text-primary)' }}>
                        {assignment.title}
                      </h4>

                      <p style={{ 
                        fontSize: '0.88rem', 
                        color: 'var(--text-secondary)', 
                        background: 'rgba(0,0,0,0.01)', 
                        padding: '10px', 
                        borderRadius: '8px', 
                        border: '1px solid rgba(0,0,0,0.02)',
                        margin: '8px 0 16px 0', 
                        whiteSpace: 'pre-line' 
                      }}>
                        {assignment.content}
                      </p>

                      {/* Submission status & Details */}
                      {isGraded ? (
                        <div style={{ marginTop: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.15)', marginBottom: '8px' }}>
                            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>{score}</span>
                            <div style={{ fontSize: '0.8rem' }}>
                              <div style={{ fontWeight: 700, color: 'var(--accent-secondary)' }}>Đã chấm điểm (thang 10)</div>
                              <div style={{ color: 'var(--text-muted)' }}>Bài nộp hoàn thành thành công</div>
                            </div>
                          </div>
                          {feedback && (
                            <p style={{ fontSize: '0.85rem', padding: '8px 12px', background: 'rgba(0, 0, 0, 0.01)', borderLeft: '3px solid var(--accent-secondary)', borderRadius: '0 8px 8px 0', fontStyle: 'italic', margin: '4px 0', color: 'var(--text-secondary)' }}>
                              <strong>Lời phê:</strong> "{feedback}"
                            </p>
                          )}
                        </div>
                      ) : isSubmitted ? (
                        <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.15)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: 'var(--accent-primary)', marginBottom: '4px' }}>
                            <span>Đã nộp bài làm</span>
                            <span>{sub.submittedAt}</span>
                          </div>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Đang chờ thầy/cô xem xét chấm điểm...</span>
                        </div>
                      ) : (
                        <div style={{ marginTop: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--accent-danger)', fontWeight: 600, marginBottom: '6px' }}>
                            <span>🔴 Chưa nộp bài làm</span>
                          </div>
                          <textarea
                            className="form-control"
                            rows="3"
                            placeholder="Nhập nội dung bài giải hoặc văn bản nộp bài..."
                            value={subText}
                            onChange={e => setSubmissionTexts(prev => ({ ...prev, [assignment.id]: e.target.value }))}
                            style={{ fontSize: '0.85rem', resize: 'none', background: 'white', borderColor: 'var(--border-card)', color: '#1e293b' }}
                          />
                          <button
                            type="button"
                            onClick={() => handleSubSubmit(assignment.id)}
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '8px 0', fontSize: '0.85rem', marginTop: '8px' }}
                          >
                            Nộp bài tập trực tuyến
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* DIGITAL LIBRARY & FLASHCARDS (PART 6) */}
      {subTab === 'library' && (
        <div className="glass-panel animate-fade" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', alignItems: 'start' }}>
          
          {/* Digital resources & Quiz section */}
          <div>
            <h2 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem' }}>
              <BookOpen size={18} color="var(--accent-primary)" />
              <span>Học liệu số & Ôn tập ôn thi</span>
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {learningResources && learningResources.map((res) => (
                <div key={res.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: '#f8fafc', borderRadius: '10px', border: '1px solid var(--border-card)' }}>
                  <div>
                    <span className="badge badge-info" style={{ fontSize: '0.65rem', marginBottom: '4px' }}>{res.subject}</span>
                    <h5 style={{ margin: 0, fontWeight: 700 }}>{res.title}</h5>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Đăng bởi: {res.teacherName} • Ngày {res.dateUploaded.split('-').reverse().join('/')}</span>
                  </div>
                  <button onClick={() => alert('Bắt đầu tải tài liệu về máy...')} className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '8px' }}>
                    Tải về
                  </button>
                </div>
              ))}
            </div>

            {/* Quick Practice Quiz Card */}
            <div style={{ padding: '18px', background: 'rgba(99, 102, 241, 0.03)', border: '1px solid rgba(99, 102, 241, 0.08)', borderRadius: '12px' }}>
              <h4 style={{ margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Brain size={18} color="var(--accent-primary)" />
                <span>Trắc nghiệm nhanh ôn luyện 5 câu</span>
              </h4>

              {activeQuizStep === 0 && (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                    Hãy kiểm tra nhanh kiến thức Toán học, Vật lý và Ngữ văn để rèn luyện tư duy làm bài trắc nghiệm.
                  </p>
                  <button onClick={() => setActiveQuizStep(1)} className="btn btn-primary">
                    Bắt đầu làm bài
                  </button>
                </div>
              )}

              {activeQuizStep === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {quizQuestions.map((q) => (
                    <div key={q.id} style={{ borderBottom: '1px dashed #e2e8f0', paddingBottom: '12px' }}>
                      <p style={{ margin: '0 0 8px 0', fontSize: '0.88rem', fontWeight: 600 }}>Câu {q.id}: {q.q}</p>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        {[
                          { key: 'a', label: q.a },
                          { key: 'b', label: q.b },
                          { key: 'c', label: q.c },
                          { key: 'd', label: q.d }
                        ].map((opt) => (
                          <button
                            key={opt.key}
                            onClick={() => setSelectedAnswers(prev => ({ ...prev, [q.id]: opt.key }))}
                            className="btn"
                            style={{
                              padding: '6px 12px',
                              fontSize: '0.8rem',
                              textAlign: 'left',
                              borderRadius: '8px',
                              border: selectedAnswers[q.id] === opt.key ? '1.5px solid var(--accent-primary)' : '1px solid #cbd5e1',
                              background: selectedAnswers[q.id] === opt.key ? 'rgba(99, 102, 241, 0.05)' : 'white',
                              color: '#334155'
                            }}
                          >
                            <strong>{opt.key.toUpperCase()}.</strong> {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button onClick={handleQuizSubmit} className="btn btn-primary" style={{ marginTop: '10px' }}>
                    Nộp bài trắc nghiệm
                  </button>
                </div>
              )}

              {activeQuizStep === 2 && (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <span className="badge badge-success" style={{ fontSize: '1.5rem', padding: '10px 24px', borderRadius: '30px', marginBottom: '14px' }}>
                    Kết quả: {quizScore}/5 câu đúng
                  </span>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                    {quizScore === 5 ? '🎉 Xuất sắc! Em đã trả lời đúng tất cả câu hỏi.' : quizScore >= 3 ? 'Khá tốt! Hãy cố gắng ôn luyện thêm để đạt điểm tuyệt đối.' : 'Em cần ôn tập thêm học liệu ở trên nhé.'}
                  </p>
                  <button onClick={handleResetQuiz} className="btn btn-secondary" style={{ marginTop: '12px' }}>
                    Làm lại bài trắc nghiệm
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Flashcard 3D section */}
          <div>
            <h2 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem' }}>
              <Sparkles size={18} color="var(--accent-secondary)" />
              <span>Học tập bằng Flashcards ({flashcards ? flashcards.filter(f => f.studentId === student.id).length : 0})</span>
            </h2>

            {/* Create flashcard form */}
            <form onSubmit={handleAddFlashcard} style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-card)', marginBottom: '20px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Mặt trước (Câu hỏi/Công thức)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={newFlashcardFront} 
                  onChange={e => setNewFlashcardFront(e.target.value)} 
                  placeholder="Ví dụ: Định luật bảo toàn động lượng" 
                  required 
                  style={{ fontSize: '0.8rem', background: 'white', borderColor: '#e2e8f0', color: '#1e293b' }}
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Mặt sau (Đáp án/Giải nghĩa)</label>
                <textarea 
                  className="form-control" 
                  rows="2"
                  value={newFlashcardBack} 
                  onChange={e => setNewFlashcardBack(e.target.value)} 
                  placeholder="Ví dụ: p = m * v (vectơ tổng động lượng bảo toàn)" 
                  required 
                  style={{ fontSize: '0.8rem', resize: 'none', background: 'white', borderColor: '#e2e8f0', color: '#1e293b' }}
                />
              </div>
              <button type="submit" className="btn btn-secondary" style={{ display: 'flex', gap: '4px', justifyContent: 'center', alignItems: 'center', padding: '8px', fontSize: '0.8rem' }}>
                <Plus size={14} /> Thêm thẻ học
              </button>
            </form>

            {/* Flashcard list display */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {flashcards && flashcards.filter(f => f.studentId === student.id).map((fc) => {
                const isFlipped = !!flippedCards[fc.id];
                return (
                  <div
                    key={fc.id}
                    onClick={() => toggleFlip(fc.id)}
                    style={{
                      height: '110px',
                      perspective: '1000px',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                  >
                    <div style={{
                      width: '100%',
                      height: '100%',
                      position: 'relative',
                      transformStyle: 'preserve-3d',
                      transition: 'transform 0.5s',
                      transform: isFlipped ? 'rotateY(180deg)' : 'none'
                    }}>
                      {/* FRONT CARD FACE */}
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        backfaceVisibility: 'hidden',
                        background: 'linear-gradient(135deg, #fefefe, #f1f5f9)',
                        border: '1.5px solid var(--border-card)',
                        borderRadius: '12px',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.02)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>CÂU HỎI (MẶT TRƯỚC)</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteFlashcard(fc.id);
                            }}
                            style={{ background: 'none', border: 'none', color: 'var(--accent-danger)', cursor: 'pointer' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', textAlign: 'center' }}>
                          {fc.front}
                        </p>
                        <span style={{ fontSize: '0.68rem', color: 'var(--accent-primary)', alignSelf: 'center', fontWeight: 600 }}>Nhấp để xem đáp án ↺</span>
                      </div>

                      {/* BACK CARD FACE */}
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                        border: '1.5px solid rgba(59, 130, 246, 0.2)',
                        borderRadius: '12px',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.02)'
                      }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', fontWeight: 700 }}>ĐÁP ÁN (MẶT SAU)</span>
                        <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: '#1e3a8a', textAlign: 'center', whiteSpace: 'pre-line' }}>
                          {fc.back}
                        </p>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', alignSelf: 'center' }}>Nhấp để xem câu hỏi ↺</span>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* CLUBS HUB TAB (PART 6) */}
      {subTab === 'clubs' && (
        <div className="glass-panel animate-fade">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <Users size={20} color="var(--accent-primary)" />
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Câu Lạc Bộ Học Sinh</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>
            
            {/* List of Clubs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {clubs && clubs.map((club) => (
                <div key={club.id} style={{ padding: '16px', border: '1px solid var(--border-card)', borderRadius: '12px', background: 'white' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h4 style={{ margin: 0, fontWeight: 700, color: 'var(--text-primary)' }}>{club.name}</h4>
                    <span className={`badge ${club.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                      {club.status === 'active' ? 'Đang hoạt động' : 'Đang chờ duyệt'}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 12px 0', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {club.desc}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>Thành viên: <strong>{club.membersCount} học sinh</strong></span>
                    <span>Ngân sách năm học: <strong>{club.budgetApproved > 0 ? `${club.budgetApproved.toLocaleString()} VNĐ` : 'Chờ duyệt'}</strong></span>
                  </div>
                </div>
              ))}
            </div>

            {/* Application Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ padding: '18px', background: 'rgba(99, 102, 241, 0.02)', border: '1px solid var(--border-card)', borderRadius: '12px' }}>
                <h4 style={{ margin: '0 0 14px 0', fontSize: '0.95rem' }}>Đăng ký tham gia Câu Lạc Bộ</h4>
                
                <form onSubmit={handleClubApply} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Chọn CLB muốn ứng tuyển</label>
                    <select 
                      className="form-control"
                      value={selectedClubId}
                      onChange={e => setSelectedClubId(e.target.value)}
                      style={{ background: 'white', borderColor: '#cbd5e1', color: '#1e293b' }}
                    >
                      {clubs && clubs.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Giới thiệu bản thân & Lý do ứng tuyển</label>
                    <textarea 
                      className="form-control"
                      rows="4"
                      value={clubAppIntro}
                      onChange={e => setClubAppIntro(e.target.value)}
                      placeholder="Hãy giới thiệu ngắn về sở thích và nguyện vọng đóng góp CLB của em..."
                      required
                      style={{ background: 'white', borderColor: '#cbd5e1', color: '#1e293b', fontSize: '0.85rem' }}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                    Nộp đơn đăng ký CLB
                  </button>
                </form>
              </div>

              {/* History of applications */}
              <div style={{ padding: '16px', border: '1px solid var(--border-card)', borderRadius: '12px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem' }}>Lịch sử đăng ký CLB</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {myClubsApps.length === 0 ? (
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', textAlignment: 'center' }}>Chưa nộp đơn CLB nào.</p>
                  ) : (
                    myClubsApps.map(app => (
                      <div key={app.id} style={{ padding: '10px', background: '#f8fafc', borderRadius: '8px', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong style={{ display: 'block' }}>{app.clubName}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lý do: {app.introduction.slice(0, 20)}...</span>
                        </div>
                        <span className={`badge ${app.status === 'approved' ? 'badge-success' : app.status === 'rejected' ? 'badge-danger' : 'badge-info'}`}>
                          {app.status === 'approved' ? 'Đã nhận' : app.status === 'rejected' ? 'Từ chối' : 'Chờ duyệt'}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* COUNSELING & CAREER GUIDANCE TAB (PART 6) */}
      {subTab === 'counseling' && (
        <div className="glass-panel animate-fade" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', alignItems: 'start' }}>
          
          {/* RIASEC Career psychometric questionnaire */}
          <div>
            <h2 style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem' }}>
              <Compass size={18} color="var(--accent-primary)" />
              <span>Khảo sát tính cách Hướng nghiệp RIASEC</span>
            </h2>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Hãy chấm điểm từ 1 (Không thích) đến 5 (Rất thích) cho các nhóm câu hỏi bên dưới để khám phá thế mạnh tính cách nghề nghiệp.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {[
                { k: 'R', label: 'R (Realistic): Thích kỹ thuật, lắp ráp, chế tạo robot, sửa chữa linh kiện.' },
                { k: 'I', label: 'I (Investigative): Thích giải toán khó, nghiên cứu khoa học, khám phá công nghệ mới.' },
                { k: 'A', label: 'A (Artistic): Thích thiết kế đồ họa, sáng tạo nội dung, hội họa hoặc biểu diễn nghệ thuật.' },
                { k: 'S', label: 'S (Social): Thích hỗ trợ mọi người, chia sẻ kỹ năng học tập, làm việc nhóm tích cực.' },
                { k: 'E', label: 'E (Enterprising): Thích quản lý đội ngũ, lên kế hoạch kinh doanh, dẫn dắt câu lạc bộ.' },
                { k: 'C', label: 'C (Conventional): Thích tổng hợp thống kê số liệu, làm việc ngăn nắp với sổ sách kế toán.' }
              ].map(q => (
                <div key={q.k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#f8fafc', borderRadius: '10px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 500, flex: 1, paddingRight: '12px' }}>{q.label}</span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {[1, 2, 3, 4, 5].map(v => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setRiasecAnswers(prev => ({ ...prev, [q.k]: v }))}
                        className="btn"
                        style={{
                          width: '28px',
                          height: '28px',
                          padding: 0,
                          fontSize: '0.8rem',
                          borderRadius: '50%',
                          border: riasecAnswers[q.k] === v ? '1.5px solid var(--accent-primary)' : '1px solid #cbd5e1',
                          background: riasecAnswers[q.k] === v ? 'var(--accent-primary)' : 'white',
                          color: riasecAnswers[q.k] === v ? 'white' : '#475569'
                        }}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button onClick={handleRiasecSave} className="btn btn-primary" style={{ width: '100%', marginBottom: '24px' }}>
              Lưu kết quả khảo sát RIASEC
            </button>

            {hasCompletedRiasec && (
              <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '20px', padding: '16px', background: 'rgba(99, 102, 241, 0.03)', border: '1px solid rgba(99, 102, 241, 0.08)', borderRadius: '12px', alignItems: 'center' }}>
                {/* SVG Radar network polygon chart */}
                <div>
                  <svg width="140" height="140" viewBox="0 0 300 300" style={{ overflow: 'visible' }}>
                    {/* Background hexagons */}
                    <polygon points="150,50 236,100 236,200 150,250 64,200 64,100" fill="none" stroke="#e2e8f0" strokeWidth="2" />
                    <polygon points="150,100 193,125 193,175 150,200 107,175 107,125" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                    
                    {/* Axes lines */}
                    <line x1="150" y1="150" x2="150" y2="50" stroke="#cbd5e1" />
                    <line x1="150" y1="150" x2="236" y2="100" stroke="#cbd5e1" />
                    <line x1="150" y1="150" x2="236" y2="200" stroke="#cbd5e1" />
                    <line x1="150" y1="150" x2="150" y2="250" stroke="#cbd5e1" />
                    <line x1="150" y1="150" x2="64" y2="200" stroke="#cbd5e1" />
                    <line x1="150" y1="150" x2="64" y2="100" stroke="#cbd5e1" />

                    {/* Labels */}
                    <text x="150" y="35" fontSize="16" fontWeight="bold" fill="#64748b" textAnchor="middle">R</text>
                    <text x="250" y="95" fontSize="16" fontWeight="bold" fill="#64748b">I</text>
                    <text x="250" y="215" fontSize="16" fontWeight="bold" fill="#64748b">A</text>
                    <text x="150" y="275" fontSize="16" fontWeight="bold" fill="#64748b" textAnchor="middle">S</text>
                    <text x="45" y="215" fontSize="16" fontWeight="bold" fill="#64748b" textAnchor="end">E</text>
                    <text x="45" y="95" fontSize="16" fontWeight="bold" fill="#64748b" textAnchor="end">C</text>

                    {/* Value Polygon */}
                    <polygon
                      points={getRadarPointsPath(currentScores)}
                      fill="rgba(99, 102, 241, 0.4)"
                      stroke="var(--accent-primary)"
                      strokeWidth="3.5"
                    />
                  </svg>
                </div>

                {/* Score mapping profile description */}
                <div>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {riasecInfo.name}
                  </h4>
                  <p style={{ margin: '0 0 10px 0', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {riasecInfo.desc}
                  </p>
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                    🛠️ Phù hợp: {riasecInfo.jobs}
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* AI School counselor friendly chatbot simulator */}
          <div>
            <h2 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem' }}>
              <Smile size={18} color="var(--accent-secondary)" />
              <span>Chuyên gia tư vấn học đường</span>
            </h2>

            <div style={{ 
              height: '350px', 
              border: '1px solid var(--border-card)', 
              borderRadius: '16px', 
              background: '#f8fafc',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}>
              
              {/* Chat history */}
              <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }} className="custom-scroll">
                {counselorHistory.map((m, idx) => (
                  <div 
                    key={idx} 
                    style={{
                      alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '80%',
                      padding: '12px 16px',
                      borderRadius: '14px',
                      fontSize: '0.88rem',
                      lineHeight: 1.5,
                      background: m.sender === 'user' ? 'var(--accent-primary)' : 'white',
                      color: m.sender === 'user' ? 'white' : '#1e293b',
                      border: m.sender === 'user' ? 'none' : '1px solid var(--border-card)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.01)',
                      whiteSpace: 'pre-line'
                    }}
                  >
                    {m.text}
                  </div>
                ))}
              </div>

              {/* Chat Input panel */}
              <form onSubmit={handleCounselorSend} style={{ display: 'flex', borderTop: '1px solid var(--border-card)', background: 'white', padding: '10px' }}>
                <input
                  type="text"
                  value={counselorInput}
                  onChange={e => setCounselorInput(e.target.value)}
                  placeholder="Chia sẻ lo lắng hoặc nhắn 'riasec' để hướng nghiệp..."
                  className="form-control"
                  style={{ flex: 1, fontSize: '0.85rem', background: '#f1f5f9', border: 'none', borderRadius: '10px', color: '#1e293b' }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '8px 12px', minWidth: 0, borderRadius: '10px', marginLeft: '6px' }}>
                  <Send size={16} />
                </button>
              </form>

            </div>
          </div>

        </div>
      )}

      {/* SURVEY & EVALUATIONS TAB */}
      {subTab === 'evaluations' && (
        <div className="glass-panel animate-fade" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', alignItems: 'start' }}>
          {/* Survey Submission form */}
          <div>
            <h2 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem' }}>
              <Star size={18} color="var(--accent-primary)" />
              <span>Khảo sát Chất lượng Giảng dạy kì II</span>
            </h2>
            
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Ý kiến phản hồi từ học sinh sẽ giúp các thầy cô nâng cao chất lượng bài học bộ môn. Đơn khảo sát sẽ được bảo mật và gửi trực tiếp tới Ban Giám Hiệu.
            </p>

            <form onSubmit={handleEvaluationSubmit}>
              <div className="form-group">
                <label className="form-label">Chọn Giáo viên bộ môn</label>
                <select 
                  className="form-control"
                  value={evalTeacherId}
                  onChange={e => setEvalTeacherId(e.target.value)}
                  style={{ background: 'white', borderColor: '#cbd5e1', color: '#1e293b' }}
                >
                  {teachers && teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.subject})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Đánh giá sao chất lượng bài giảng (1 - 5 sao)</label>
                <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setEvalRating(star)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                      <Star 
                        size={28} 
                        fill={evalRating >= star ? '#eab308' : 'none'} 
                        color={evalRating >= star ? '#eab308' : '#cbd5e1'} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Nhận xét chi tiết (Ưu điểm, Góp ý phương pháp dạy...)</label>
                <textarea 
                  className="form-control"
                  rows="4"
                  placeholder="Em muốn đóng góp ý kiến về việc giảng giải lý thuyết, giao bài tập về nhà hoặc không khí học tập trên lớp..."
                  value={evalComment}
                  onChange={e => setEvalComment(e.target.value)}
                  required
                  style={{ background: 'white', borderColor: '#cbd5e1', color: '#1e293b', fontSize: '0.85rem' }}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                Gửi đơn khảo sát chất lượng giảng dạy
              </button>
            </form>
          </div>

          {/* Evaluations submitted history */}
          <div>
            <h2 style={{ marginBottom: '16px', fontSize: '1.25rem' }}>Lịch sử đánh giá ({myEvaluations.length})</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {myEvaluations.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '20px' }}>
                  Em chưa gửi phiếu đánh giá nào trong kì học này.
                </p>
              ) : (
                myEvaluations.map(item => (
                  <div key={item.id} style={{ padding: '14px', border: '1px solid var(--border-card)', borderRadius: '12px', background: 'rgba(255,255,255,0.01)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <strong style={{ fontSize: '0.9rem' }}>{item.teacherName}</strong>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star 
                            key={s} 
                            size={12} 
                            fill={item.rating >= s ? '#eab308' : 'none'} 
                            color={item.rating >= s ? '#eab308' : '#cbd5e1'} 
                          />
                        ))}
                      </div>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.4 }}>
                      "{item.comment}"
                    </p>
                    <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>{item.date}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
