import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

// Portrait Placeholders using professional Unsplash faces
const initialTeachers = [
  { 
    id: 'T01', 
    name: 'Nguyễn Minh Triết', 
    subject: 'Toán học', 
    email: 'triet.nm@school.edu.vn', 
    phone: '0901234567', 
    classJoined: '12A1',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'
  },
  { 
    id: 'T02', 
    name: 'Trần Thị Hồng Vân', 
    subject: 'Ngữ văn', 
    email: 'van.tth@school.edu.vn', 
    phone: '0912345678', 
    classJoined: '12A2',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  { 
    id: 'T03', 
    name: 'Phạm Đức Duy', 
    subject: 'Vật lý', 
    email: 'duy.pd@school.edu.vn', 
    phone: '0923456789', 
    classJoined: '11A1',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  { 
    id: 'T04', 
    name: 'Lê Thu Hà', 
    subject: 'Tiếng Anh', 
    email: 'ha.lt@school.edu.vn', 
    phone: '0934567890', 
    classJoined: '10A1',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  }
];

const initialStudents = [
  { 
    id: 'HS001', 
    name: 'Nguyễn Hoàng Nam', 
    class: '12A1', 
    grade: '12',
    parentName: 'Nguyễn Văn Hùng', 
    parentPhone: '0987654321',
    grades: { Math: 8.5, Literature: 7.8, Physics: 9.0, English: 8.2 },
    feeStatus: [
      { id: 'F01', name: 'Học phí tháng 6/2026', amount: 2500000, paid: false, deadline: '2026-06-15' },
      { id: 'F02', name: 'Tiền ăn bán trú tháng 6/2026', amount: 950000, paid: false, deadline: '2026-06-15' },
      { id: 'F03', name: 'Quỹ hội phụ huynh năm học', amount: 300000, paid: true, deadline: '2026-06-05' }
    ],
    parentSignature: null,
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
  },
  { 
    id: 'HS002', 
    name: 'Lê Mai Chi', 
    class: '12A1', 
    grade: '12',
    parentName: 'Lê Minh Tuấn', 
    parentPhone: '0976543210',
    grades: { Math: 9.5, Literature: 9.0, Physics: 8.5, English: 9.8 },
    feeStatus: [
      { id: 'F01', name: 'Học phí tháng 6/2026', amount: 2500000, paid: true, deadline: '2026-06-15' },
      { id: 'F02', name: 'Tiền ăn bán trú tháng 6/2026', amount: 950000, paid: true, deadline: '2026-06-15' },
      { id: 'F03', name: 'Quỹ hội phụ huynh năm học', amount: 300000, paid: true, deadline: '2026-06-05' }
    ],
    parentSignature: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="30"><path d="M10 20 C 30 10, 40 10, 90 20" stroke="blue" fill="transparent"/></svg>',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  },
  { 
    id: 'HS003', 
    name: 'Phan Minh Triết', 
    class: '12A1', 
    grade: '12',
    parentName: 'Phan Quốc Bảo', 
    parentPhone: '0965432109',
    grades: { Math: 7.2, Literature: 8.0, Physics: 6.8, English: 7.5 },
    feeStatus: [
      { id: 'F01', name: 'Học phí tháng 6/2026', amount: 2500000, paid: false, deadline: '2026-06-15' },
      { id: 'F02', name: 'Tiền ăn bán trú tháng 6/2026', amount: 950000, paid: true, deadline: '2026-06-15' },
      { id: 'F03', name: 'Quỹ hội phụ huynh năm học', amount: 300000, paid: false, deadline: '2026-06-05' }
    ],
    parentSignature: null,
    avatarUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80'
  },
  { 
    id: 'HS004', 
    name: 'Lê Minh Đăng', 
    class: '12A2', 
    grade: '12',
    parentName: 'Lê Văn Tuấn', 
    parentPhone: '0956789123',
    grades: { Math: 8.0, Literature: 8.2, Physics: 7.5, English: 8.0 },
    feeStatus: [
      { id: 'F01', name: 'Học phí tháng 6/2026', amount: 2500000, paid: true, deadline: '2026-06-15' },
      { id: 'F02', name: 'Tiền ăn bán trú tháng 6/2026', amount: 950000, paid: false, deadline: '2026-06-15' }
    ],
    parentSignature: null,
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'
  },
  { 
    id: 'HS005', 
    name: 'Trần Thị Hương', 
    class: '11A1', 
    grade: '11',
    parentName: 'Trần Đại Nghĩa', 
    parentPhone: '0912345111',
    grades: { Math: 8.8, Literature: 8.5, Physics: 8.0, English: 9.0 },
    feeStatus: [
      { id: 'F01', name: 'Học phí tháng 6/2026', amount: 2500000, paid: false, deadline: '2026-06-15' }
    ],
    parentSignature: null,
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80'
  },
  { 
    id: 'HS006', 
    name: 'Phạm Tuấn Anh', 
    class: '10A1', 
    grade: '10',
    parentName: 'Phạm Văn Nam', 
    parentPhone: '0912345000',
    grades: { Math: 6.5, Literature: 7.0, Physics: 7.2, English: 6.8 },
    feeStatus: [
      { id: 'F01', name: 'Học phí tháng 6/2026', amount: 2500000, paid: true, deadline: '2026-06-15' }
    ],
    parentSignature: null,
    avatarUrl: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=150&auto=format&fit=crop&q=80'
  }
];

const initialAnnouncements = [
  { id: 'A01', date: '2026-06-02', sender: 'Ban Giám Hiệu', title: 'Kế hoạch thi học kỳ 2 bổ sung và tổng kết năm học', content: 'Ban giám hiệu thông báo kế hoạch ôn tập và kiểm tra bổ sung cho khối 10, 11, 12 bắt đầu từ ngày 08/06. Đề nghị các giáo viên bộ môn lên đề cương chi tiết.' },
  { id: 'A02', date: '2026-06-01', sender: 'GVCN Lớp 12A1', title: 'Thông báo nộp các khoản phí tháng 6 và hoàn thiện hồ sơ thi tốt nghiệp', content: 'Kính gửi quý phụ huynh lớp 12A1, đề nghị phụ huynh kiểm tra các khoản học phí chưa đóng và hoàn tất trước ngày 15/06 để nhà trường chuẩn bị thủ tục thi tốt nghiệp.' }
];

const initialJournalEntries = [
  { id: 'J01', date: '2026-06-01', week: 35, day: 'Thứ Hai', period: 1, subject: 'Toán học', teacher: 'Nguyễn Minh Triết', content: 'Khảo sát và vẽ đồ thị hàm số (Luyện đề số 5)', rating: 'A', comment: 'Lớp trật tự, xây dựng bài tốt. Khen ngợi em Nam phát biểu giải bài khó.', signed: true, signature: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="20"><text x="5" y="15" fill="purple">Triet</text></svg>', class: '12A1' },
  { id: 'J02', date: '2026-06-01', week: 35, day: 'Thứ Hai', period: 2, subject: 'Ngữ văn', teacher: 'Trần Thị Hồng Vân', content: 'Phân tích nhân vật Mị trong Vợ Chồng A Phủ', rating: 'A', comment: 'Lớp ghi chép bài đầy đủ. Có chuẩn bị bài trước.', signed: true, signature: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="20"><text x="5" y="15" fill="purple">Van</text></svg>', class: '12A1' },
  { id: 'J03', date: '2026-06-02', week: 35, day: 'Thứ Ba', period: 3, subject: 'Vật lý', teacher: 'Phạm Đức Duy', content: 'Bài tập dòng điện xoay chiều có RLC thay đổi', rating: 'B', comment: 'Lớp còn vài bạn ngủ gật trong giờ (Nam, Triết). Mức độ tiếp thu bài khá.', signed: true, signature: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="20"><text x="5" y="15" fill="purple">Duy</text></svg>', class: '12A1' }
];

const initialParentQAs = [
  { id: 'Q01', studentName: 'Nguyễn Hoàng Nam', parentName: 'Nguyễn Văn Hùng', question: 'Cô ơi, điểm Ngữ văn kiểm tra 1 tiết vừa rồi của cháu Nam thế nào ạ? Cháu bảo chưa có điểm.', reply: 'Chào anh, bài kiểm tra 1 tiết của Nam vừa rồi đạt 7.8 điểm. Cháu làm bài khá tốt tuy nhiên phần phân tích thơ còn hơi sơ sài. Tôi sẽ gửi bài kiểm tra cho cháu mang về nhé.', status: 'resolved', date: '2026-06-02' },
  { id: 'Q02', studentName: 'Phan Minh Triết', parentName: 'Phan Quốc Bảo', question: 'Mấy hôm nay cháu Triết ở lớp có tập trung học không thầy? Tôi thấy về nhà cháu mải chơi điện thoại quá.', reply: '', status: 'pending', date: '2026-06-03' }
];

const initialVideoLessons = [
  { id: 'V01', title: 'Ôn tập chuyên đề Tích Phân & Ứng Dụng (Toán 12)', subject: 'Toán học', teacher: 'Thầy Nguyễn Minh Triết', duration: '45 phút', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', thumbnail: '⚡' },
  { id: 'V02', title: 'Phân tích giá trị nhân đạo tác phẩm "Vợ nhặt" (Văn 12)', subject: 'Ngữ văn', teacher: 'Cô Trần Thị Hồng Vân', duration: '50 phút', videoUrl: 'https://www.w3schools.com/html/movie.mp4', thumbnail: '📖' },
  { id: 'V03', title: 'Lý thuyết hạt nhân nguyên tử & Phóng xạ (Vật lý 12)', subject: 'Vật lý', teacher: 'Thầy Phạm Đức Duy', duration: '40 phút', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', thumbnail: '⚛️' }
];

const initialTutorChat = [
  { sender: 'tutor', text: 'Xin chào! Mình là Gia sư AI 24/7. Hôm nay bạn cần trợ giúp giải quyết bài toán, câu hỏi khoa học hay bài văn nào? Cứ nhập đề bài vào đây nhé! 📝' }
];

// NEW DATA: Absent / Leave Requests
const initialLeaveRequests = [
  { id: 'L01', studentId: 'HS001', studentName: 'Nguyễn Hoàng Nam', class: '12A1', parentName: 'Nguyễn Văn Hùng', date: '2026-06-04', reason: 'Cháu bị sốt xuất huyết phải nhập viện truyền dịch truyền theo dõi.', status: 'pending' }
];

// NEW DATA: Lesson plans submitted by teachers
const initialLessonPlans = [
  { id: 'LP01', teacherName: 'Nguyễn Minh Triết', subject: 'Toán học', title: 'Giáo án Ôn tập Tích phân từng phần nâng cao lớp 12', date: '2026-06-02', status: 'pending', feedback: '' },
  { id: 'LP02', teacherName: 'Trần Thị Hồng Vân', subject: 'Ngữ văn', title: 'Giáo án Phân tích tác phẩm Chiếc Thuyền Ngoài Xa', date: '2026-05-28', status: 'approved', feedback: 'Nội dung rất chi tiết, hình ảnh minh họa sinh động.' }
];

// NEW DATA: Homework assignments
const initialAssignments = [
  { id: 'A01', teacherId: 'T01', teacherName: 'Nguyễn Minh Triết', subject: 'Toán học', classTarget: '12A1', title: 'Luyện đề thi tốt nghiệp THPT số 6', content: 'Hãy giải toàn bộ đề thi thử số 6 đính kèm trong tệp học liệu môn Toán. Chú ý các câu hỏi từ 40 đến 50 về phương trình hàm số và hình học không gian. Trình bày chi tiết lời giải ra giấy hoặc soạn thảo văn bản.', deadline: '2026-06-10', dateCreated: '2026-06-03' },
  { id: 'A02', teacherId: 'T02', teacherName: 'Trần Thị Hồng Vân', subject: 'Ngữ văn', classTarget: '12A1', title: 'Nghị luận xã hội về tinh thần tự học', content: 'Viết bài văn nghị luận ngắn khoảng 200 từ trình bày suy nghĩ của em về tầm quan trọng của tinh thần tự học đối với học sinh cuối cấp THPT.', deadline: '2026-06-08', dateCreated: '2026-06-02' }
];

// NEW DATA: Homework submissions
const initialSubmissions = [
  { id: 'S01', assignmentId: 'A02', studentId: 'HS001', studentName: 'Nguyễn Hoàng Nam', class: '12A1', submissionText: 'Tinh thần tự học là yếu tố then chốt quyết định sự thành bại của mỗi học sinh, đặc biệt là học sinh cuối cấp THPT. Tự học giúp chúng ta làm chủ kiến thức, ghi nhớ sâu sắc hơn và không bị thụ động trước những kỳ thi cam go. Đối với bản thân em, em thường dành 2 tiếng mỗi tối tự làm đề và tự đối chiếu đáp án.', submittedAt: '2026-06-03', status: 'graded', grade: 8.5, feedback: 'Bài viết lập luận tốt, liên hệ thực tế sinh động. Cần trau chuốt thêm các từ ngữ diễn đạt.' },
  { id: 'S02', assignmentId: 'A01', studentId: 'HS002', studentName: 'Lê Mai Chi', class: '12A1', submissionText: 'Em gửi thầy lời giải chi tiết cho 50 câu trắc nghiệm đề số 6. Riêng câu 48 và 50 em có làm thêm 2 cách giải khác bằng phương pháp tọa độ hóa để tối ưu thời gian làm bài trắc nghiệm...', submittedAt: '2026-06-03', status: 'submitted', grade: null, feedback: '' }
];

// NEW DATA: Attendance logs for RFID/Check-in simulation
const initialAttendance = [
  { id: 'AT01', studentId: 'HS001', studentName: 'Nguyễn Hoàng Nam', status: 'present', checkInTime: '07:12', date: '2026-06-01' },
  { id: 'AT02', studentId: 'HS001', studentName: 'Nguyễn Hoàng Nam', status: 'present', checkInTime: '07:18', date: '2026-06-02' },
  { id: 'AT03', studentId: 'HS001', studentName: 'Nguyễn Hoàng Nam', status: 'present', checkInTime: '07:15', date: '2026-06-03' },
  { id: 'AT04', studentId: 'HS002', studentName: 'Lê Mai Chi', status: 'present', checkInTime: '07:05', date: '2026-06-03' },
  { id: 'AT05', studentId: 'HS003', studentName: 'Phan Minh Triết', status: 'late', checkInTime: '07:35', date: '2026-06-03' }
];

// NEW DATA: Clubs and events lists
const initialClubs = [
  { id: 'C-ROB', name: 'CLB Robotics & AI', membersCount: 15, budgetExpected: 15000000, budgetApproved: 12000000, status: 'active', desc: 'Nghiên cứu chế tạo robot, tham gia Robocon và ứng dụng trí tuệ nhân tạo.' },
  { id: 'C-ART', name: 'CLB Mỹ thuật & Truyền thông', membersCount: 22, budgetExpected: 8000000, budgetApproved: 8000000, status: 'active', desc: 'Sáng tạo nghệ thuật, vẽ tranh tường cổ động và chụp ảnh sự kiện trường.' },
  { id: 'C-ENG', name: 'CLB Tranh biện Tiếng Anh', membersCount: 18, budgetExpected: 5000000, budgetApproved: 0, status: 'pending', desc: 'Rèn luyện khả năng nói, tư duy phản biện và tham gia các giải đấu hùng biện.' },
  { id: 'C-SPO', name: 'CLB Bóng đá học sinh', membersCount: 30, budgetExpected: 12000000, budgetApproved: 10000000, status: 'active', desc: 'Tập luyện bóng đá hàng tuần và tổ chức giải bóng đá thường niên toàn trường.' }
];

// NEW DATA: Club applications
const initialClubApps = [
  { id: 'CA01', studentId: 'HS002', studentName: 'Lê Mai Chi', clubId: 'C-ROB', clubName: 'CLB Robotics & AI', status: 'approved', introduction: 'Em rất đam mê tự động hóa và lập trình vi điều khiển.' },
  { id: 'CA02', studentId: 'HS001', studentName: 'Nguyễn Hoàng Nam', clubId: 'C-ENG', clubName: 'CLB Tranh biện Tiếng Anh', status: 'pending', introduction: 'Em muốn cải thiện khả năng nói trước đám đông và kỹ năng phản biện xã hội.' }
];

// NEW DATA: Learning resources
const initialResources = [
  { id: 'R01', subject: 'Toán học', title: 'Chuyên đề Tích phân lượng giác nâng cao (PDF)', fileType: 'pdf', teacherName: 'Nguyễn Minh Triết', dateUploaded: '2026-06-01' },
  { id: 'R02', subject: 'Ngữ văn', title: 'Tổng hợp sơ đồ tư duy phân tích Vợ Nhặt (PPTX)', fileType: 'pptx', teacherName: 'Trần Thị Hồng Vân', dateUploaded: '2026-06-02' }
];

// NEW DATA: Flashcards
const initialFlashcards = [
  { id: 'FC01', studentId: 'HS001', front: 'Công thức Tích phân từng phần', back: '∫u dv = u*v - ∫v du\nMẹo đặt u: Nhất lô, nhì đa, tam lượng, tứ mũ.' },
  { id: 'FC02', studentId: 'HS001', front: 'Định luật ôm cho toàn mạch', back: 'I = E / (R + r)\nE: Suất điện động, R: Điện trở ngoài, r: Điện trở trong.' },
  { id: 'FC03', studentId: 'HS001', front: 'Trạng thái Mị trong "Vợ chồng A Phủ"', back: 'Mị bị đè nén, chai sạm ("lùi lũi như con rùa nuôi trong xó cửa"). Nhưng ẩn chứa sức sống tiềm tàng.' }
];

// NEW DATA: RIASEC Career Scores presets
const initialCareerScores = [
  { studentId: 'HS001', R: 4, I: 9, A: 7, S: 8, E: 5, C: 3 }
];

// Presets of avatar lists for new members
const teacherAvatars = [
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1548142813-c348350df52b?w=150&auto=format&fit=crop&q=80'
];

const studentAvatars = [
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80'
];

export const AppProvider = ({ children }) => {
  const [theme] = useState('light');
  
  const [userSession, setUserSession] = useState(() => {
    const saved = localStorage.getItem('userSession');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentRole, setCurrentRole] = useState(() => {
    const savedSession = localStorage.getItem('userSession');
    return savedSession ? JSON.parse(savedSession).role : '';
  });
  
  const [selectedStudentId, setSelectedStudentId] = useState('HS001');

  const [teachers, setTeachers] = useState(() => {
    const saved = localStorage.getItem('teachers');
    return saved ? JSON.parse(saved) : initialTeachers;
  });

  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('students');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [announcements, setAnnouncements] = useState(() => {
    const saved = localStorage.getItem('announcements');
    return saved ? JSON.parse(saved) : initialAnnouncements;
  });

  const [journalEntries, setJournalEntries] = useState(() => {
    const saved = localStorage.getItem('journalEntries');
    return saved ? JSON.parse(saved) : initialJournalEntries;
  });

  const [parentQAs, setParentQAs] = useState(() => {
    const saved = localStorage.getItem('parentQAs');
    return saved ? JSON.parse(saved) : initialParentQAs;
  });

  const [tutorChat, setTutorChat] = useState(() => {
    const saved = localStorage.getItem('tutorChat');
    return saved ? JSON.parse(saved) : initialTutorChat;
  });

  // NEW STATES: Leaves & Lesson plans
  const [leaveRequests, setLeaveRequests] = useState(() => {
    const saved = localStorage.getItem('leaveRequests');
    return saved ? JSON.parse(saved) : initialLeaveRequests;
  });

  const [lessonPlans, setLessonPlans] = useState(() => {
    const saved = localStorage.getItem('lessonPlans');
    return saved ? JSON.parse(saved) : initialLessonPlans;
  });

  const [conductLogs, setConductLogs] = useState(() => {
    const saved = localStorage.getItem('conductLogs');
    return saved ? JSON.parse(saved) : [
      { id: 'C01', studentId: 'HS001', studentName: 'Nguyễn Hoàng Nam', class: '12A1', points: 10, reason: 'Hăng hái phát biểu xây dựng bài học môn Toán', date: '2026-06-01', teacherName: 'Nguyễn Minh Triết' },
      { id: 'C02', studentId: 'HS003', studentName: 'Phan Minh Triết', class: '12A1', points: -5, reason: 'Nói chuyện riêng trong tiết Vật lý', date: '2026-06-02', teacherName: 'Phạm Đức Duy' }
    ];
  });

  const [teacherEvaluations, setTeacherEvaluations] = useState(() => {
    const saved = localStorage.getItem('teacherEvaluations');
    return saved ? JSON.parse(saved) : [
      { id: 'E01', teacherId: 'T01', teacherName: 'Nguyễn Minh Triết', raterRole: 'student', raterName: 'Nguyễn Hoàng Nam', rating: 5, comment: 'Thầy Triết giảng Toán rất dễ hiểu, nhiệt tình hướng dẫn bài tập nâng cao cho lớp học.', date: '2026-06-02' },
      { id: 'E02', teacherId: 'T02', teacherName: 'Trần Thị Hồng Vân', raterRole: 'parent', raterName: 'Nguyễn Văn Hùng', rating: 4, comment: 'Cô giảng Văn sâu sắc, giúp các cháu tiếp thu tốt bài viết nghị luận xã hội.', date: '2026-06-01' }
    ];
  });

  const [assignments, setAssignments] = useState(() => {
    const saved = localStorage.getItem('assignments');
    return saved ? JSON.parse(saved) : initialAssignments;
  });

  const [submissions, setSubmissions] = useState(() => {
    const saved = localStorage.getItem('submissions');
    return saved ? JSON.parse(saved) : initialSubmissions;
  });

  const [attendanceLogs, setAttendanceLogs] = useState(() => {
    const saved = localStorage.getItem('attendanceLogs');
    return saved ? JSON.parse(saved) : initialAttendance;
  });

  const [clubs, setClubs] = useState(() => {
    const saved = localStorage.getItem('clubs');
    return saved ? JSON.parse(saved) : initialClubs;
  });

  const [clubApplications, setClubApplications] = useState(() => {
    const saved = localStorage.getItem('clubApplications');
    return saved ? JSON.parse(saved) : initialClubApps;
  });

  const [learningResources, setLearningResources] = useState(() => {
    const saved = localStorage.getItem('learningResources');
    return saved ? JSON.parse(saved) : initialResources;
  });

  const [flashcards, setFlashcards] = useState(() => {
    const saved = localStorage.getItem('flashcards');
    return saved ? JSON.parse(saved) : initialFlashcards;
  });

  const [careerTestScores, setCareerTestScores] = useState(() => {
    const saved = localStorage.getItem('careerTestScores');
    return saved ? JSON.parse(saved) : initialCareerScores;
  });

  // Sync html attribute for theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  useEffect(() => {
    if (userSession) {
      localStorage.setItem('userSession', JSON.stringify(userSession));
    } else {
      localStorage.removeItem('userSession');
    }
  }, [userSession]);

  useEffect(() => {
    localStorage.setItem('teachers', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
  }, [journalEntries]);

  useEffect(() => {
    localStorage.setItem('parentQAs', JSON.stringify(parentQAs));
  }, [parentQAs]);

  useEffect(() => {
    localStorage.setItem('tutorChat', JSON.stringify(tutorChat));
  }, [tutorChat]);

  // Sync leaves & lesson plans
  useEffect(() => {
    localStorage.setItem('leaveRequests', JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  useEffect(() => {
    localStorage.setItem('lessonPlans', JSON.stringify(lessonPlans));
  }, [lessonPlans]);

  useEffect(() => {
    localStorage.setItem('conductLogs', JSON.stringify(conductLogs));
  }, [conductLogs]);

  useEffect(() => {
    localStorage.setItem('teacherEvaluations', JSON.stringify(teacherEvaluations));
  }, [teacherEvaluations]);

  useEffect(() => {
    localStorage.setItem('assignments', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('attendanceLogs', JSON.stringify(attendanceLogs));
  }, [attendanceLogs]);

  useEffect(() => {
    localStorage.setItem('clubs', JSON.stringify(clubs));
  }, [clubs]);

  useEffect(() => {
    localStorage.setItem('clubApplications', JSON.stringify(clubApplications));
  }, [clubApplications]);

  useEffect(() => {
    localStorage.setItem('learningResources', JSON.stringify(learningResources));
  }, [learningResources]);

  useEffect(() => {
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
  }, [flashcards]);

  useEffect(() => {
    localStorage.setItem('careerTestScores', JSON.stringify(careerTestScores));
  }, [careerTestScores]);

  // Actions
  const logout = () => {
    localStorage.removeItem('userSession');
    setUserSession(null);
    setCurrentRole('');
    window.location.reload();
  };

  const addStudent = (student) => {
    const randAvatar = studentAvatars[Math.floor(Math.random() * studentAvatars.length)];
    const grade = student.class ? student.class.substring(0, 2) : '12';

    setStudents(prev => [
      ...prev,
      {
        ...student,
        id: `HS${String(prev.length + 1).padStart(3, '0')}`,
        grade,
        grades: student.grades || { Math: 0, Literature: 0, Physics: 0, English: 0 },
        feeStatus: [
          { id: 'F01', name: 'Học phí tháng 6/2026', amount: 2500000, paid: false, deadline: '2026-06-15' },
          { id: 'F02', name: 'Tiền ăn bán trú tháng 6/2026', amount: 950000, paid: false, deadline: '2026-06-15' },
          { id: 'F03', name: 'Quỹ hội phụ huynh năm học', amount: 300000, paid: false, deadline: '2026-06-05' }
        ],
        parentSignature: null,
        avatarUrl: randAvatar
      }
    ]);
  };

  const editStudentGrades = (studentId, subject, grade) => {
    setStudents(prev => prev.map(std => {
      if (std.id === studentId) {
        return {
          ...std,
          grades: {
            ...std.grades,
            [subject]: parseFloat(grade)
          }
        };
      }
      return std;
    }));
  };

  const addTeacher = (teacher) => {
    const randAvatar = teacherAvatars[Math.floor(Math.random() * teacherAvatars.length)];
    setTeachers(prev => [
      ...prev,
      { 
        ...teacher, 
        id: `T${String(prev.length + 1).padStart(2, '0')}`,
        avatarUrl: randAvatar
      }
    ]);
  };

  const addAnnouncement = (title, content, sender) => {
    setAnnouncements(prev => [
      {
        id: `A${String(prev.length + 1).padStart(2, '0')}`,
        date: new Date().toISOString().split('T')[0],
        sender,
        title,
        content
      },
      ...prev
    ]);
  };

  const addJournalEntry = (entry) => {
    setJournalEntries(prev => [
      ...prev,
      {
        ...entry,
        id: `J${String(prev.length + 1).padStart(2, '0')}`,
        date: new Date().toISOString().split('T')[0],
        signed: false,
        signature: null
      }
    ]);
  };

  const signJournalEntry = (id, signatureDataUrl) => {
    setJournalEntries(prev => prev.map(entry => {
      if (entry.id === id) {
        return { ...entry, signed: true, signature: signatureDataUrl };
      }
      return entry;
    }));
  };

  const signParentReport = (studentId, signatureDataUrl) => {
    setStudents(prev => prev.map(std => {
      if (std.id === studentId) {
        return { ...std, parentSignature: signatureDataUrl };
      }
      return std;
    }));
  };

  const payStudentFee = (studentId, feeId) => {
    setStudents(prev => prev.map(std => {
      if (std.id === studentId) {
        return {
          ...std,
          feeStatus: std.feeStatus.map(fee => {
            if (fee.id === feeId) {
              return { ...fee, paid: true };
            }
            return fee;
          })
        };
      }
      return std;
    }));
  };

  const createFeeItem = (feeName, amount, classTarget, deadline) => {
    setStudents(prev => prev.map(std => {
      const match = classTarget === 'All' || std.class === classTarget;
      if (match) {
        const hasFee = std.feeStatus.some(f => f.name.toLowerCase() === feeName.toLowerCase());
        if (!hasFee) {
          return {
            ...std,
            feeStatus: [
              ...std.feeStatus,
              {
                id: `F${String(Date.now()).slice(-4)}`,
                name: feeName,
                amount: parseFloat(amount),
                paid: false,
                deadline
              }
            ]
          };
        }
      }
      return std;
    }));
  };

  const askParentQuestion = (studentId, question) => {
    const student = students.find(s => s.id === studentId);
    setParentQAs(prev => [
      ...prev,
      {
        id: `Q${String(prev.length + 1).padStart(2, '0')}`,
        studentName: student.name,
        parentName: student.parentName,
        question,
        reply: '',
        status: 'pending',
        date: new Date().toISOString().split('T')[0]
      }
    ]);
  };

  const answerParentQuestion = (qaId, reply) => {
    setParentQAs(prev => prev.map(qa => {
      if (qa.id === qaId) {
        return { ...qa, reply, status: 'resolved' };
      }
      return qa;
    }));
  };

  // NEW ACTION: Submit Leave Request
  const submitLeaveRequest = (studentId, date, reason) => {
    const student = students.find(s => s.id === studentId);
    setLeaveRequests(prev => [
      ...prev,
      {
        id: `L${String(Date.now()).slice(-4)}`,
        studentId,
        studentName: student.name,
        class: student.class,
        parentName: student.parentName,
        date,
        reason,
        status: 'pending'
      }
    ]);
  };

  // NEW ACTION: Approve Leave Request
  const approveLeaveRequest = (requestId, status) => {
    setLeaveRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return { ...req, status };
      }
      return req;
    }));
  };

  // NEW ACTION: Submit Lesson Plan
  const submitLessonPlan = (teacherName, subject, title) => {
    setLessonPlans(prev => [
      ...prev,
      {
        id: `LP${String(Date.now()).slice(-4)}`,
        teacherName,
        subject,
        title,
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        feedback: ''
      }
    ]);
  };

  // NEW ACTION: Review Lesson Plan (Approve/Reject + Feedback)
  const reviewLessonPlan = (planId, status, feedback) => {
    setLessonPlans(prev => prev.map(plan => {
      if (plan.id === planId) {
        return { ...plan, status, feedback };
      }
      return plan;
    }));
  };

  const addConductLog = (studentId, points, reason, teacherName) => {
    const student = students.find(s => s.id === studentId);
    setConductLogs(prev => [
      ...prev,
      {
        id: `C${String(Date.now()).slice(-4)}`,
        studentId,
        studentName: student.name,
        class: student.class,
        points: parseInt(points),
        reason,
        date: new Date().toISOString().split('T')[0],
        teacherName
      }
    ]);
  };

  const submitTeacherEvaluation = (teacherId, rating, comment, raterRole, raterName) => {
    const teacher = teachers.find(t => t.id === teacherId);
    setTeacherEvaluations(prev => [
      ...prev,
      {
        id: `E${String(Date.now()).slice(-4)}`,
        teacherId,
        teacherName: teacher.name,
        raterRole,
        raterName,
        rating: parseInt(rating),
        comment,
        date: new Date().toISOString().split('T')[0]
      }
    ]);
  };

  const createAssignment = (teacherId, teacherName, subject, classTarget, title, content, deadline) => {
    setAssignments(prev => [
      ...prev,
      {
        id: `A${String(Date.now()).slice(-4)}`,
        teacherId,
        teacherName,
        subject,
        classTarget,
        title,
        content,
        deadline,
        dateCreated: new Date().toISOString().split('T')[0]
      }
    ]);
  };

  const submitAssignment = (assignmentId, studentId, submissionText) => {
    const student = students.find(s => s.id === studentId);
    setSubmissions(prev => {
      const exists = prev.some(sub => sub.assignmentId === assignmentId && sub.studentId === studentId);
      if (exists) {
        return prev.map(sub => {
          if (sub.assignmentId === assignmentId && sub.studentId === studentId) {
            return {
              ...sub,
              submissionText,
              submittedAt: new Date().toISOString().split('T')[0],
              status: 'submitted',
              grade: null,
              feedback: ''
            };
          }
          return sub;
        });
      }
      return [
        ...prev,
        {
          id: `S${String(Date.now()).slice(-4)}`,
          assignmentId,
          studentId,
          studentName: student.name,
          class: student.class,
          submissionText,
          submittedAt: new Date().toISOString().split('T')[0],
          status: 'submitted',
          grade: null,
          feedback: ''
        }
      ];
    });
  };

  const gradeSubmission = (submissionId, grade, feedback) => {
    setSubmissions(prev => prev.map(sub => {
      if (sub.id === submissionId) {
        return {
          ...sub,
          grade: parseFloat(grade),
          feedback,
          status: 'graded'
        };
      }
      return sub;
    }));
  };

  const sendTutorMessage = (text) => {
    const userMsg = { sender: 'user', text };
    setTutorChat(prev => [...prev, userMsg]);

    setTimeout(() => {
      let replyText = 'Mình chưa rõ câu hỏi lắm, bạn có thể đưa thêm chi tiết về bài tập được không?';
      const normalized = text.toLowerCase();
      
      if (normalized.includes('toán') || normalized.includes('phương trình') || normalized.includes('tích phân')) {
        replyText = `### 📐 Giải đáp môn Toán học:\n\nĐể giải bài tập về Tích phân lớp 12, bạn cần ghi nhớ phương pháp **Tích phân từng phần**:\n$$\\int u \\, dv = u \\cdot v - \\int v \\, du$$\n\n**Mẹo nhỏ đặt u:** *"Nhất lô, nhì đa, tam lượng, tứ mũ"*. \n\n*Ví dụ:* Với $\\int x \\ln(x) \\, dx$, ta đặt $u = \\ln(x)$ và $dv = x \\, dx$. Cần gia sư giải chi tiết bài toán cụ thể nào không, nhắn đề bài cho mình nhé!`;
      } else if (normalized.includes('văn') || normalized.includes('phân tích') || normalized.includes('vợ nhặt') || normalized.includes('vợ chồng a phủ')) {
        replyText = `### 📖 Gợi ý làm văn môn Ngữ Văn:\n\nKhi làm bài phân tích tác phẩm **"Vợ chồng A Phủ"** (Tô Hoài), bạn cần chú ý triển khai các luận điểm cốt lõi sau:\n\n1. **Sự thống trị tàn bạo của thế lực phong kiến miền núi** (Nhà thống lý Pá Tra dìm cuộc đời Mị và A Phủ vào kiếp nô lệ, áp bức bằng thần quyền và cường quyền).\n2. **Sức sống tiềm tàng mạnh mẽ của Mị** (Mặc dù bị tê liệt tinh thần, Mị vẫn khát khao tự do trong đêm tình mùa xuân và hành động cởi trói cứu A Phủ, cứu chính mình).\n3. **Giá trị hiện thực và giá trị nhân đạo sâu sắc**.\n\nHãy lập dàn ý chi tiết từng bước để bài viết có chiều sâu bạn nhé!`;
      } else if (normalized.includes('lý') || normalized.includes('vật lý') || normalized.includes('xoay chiều') || normalized.includes('rlc')) {
        replyText = `### ⚛️ Giải đáp môn Vật lý:\n\nĐối với mạch điện xoay chiều RLC nối tiếp, công thức tính **Tổng trở** toàn mạch là:\n$$Z = \\sqrt{R^2 + (Z_L - Z_C)^2}$$\n\n- Khi có cộng hưởng điện ($Z_L = Z_C$), tổng trở cực tiểu $Z_{min} = R$, dòng điện trong mạch đạt cực đại $I_{max} = U/R$.\n- Độ lệch pha giữa u và i: $\\tan \\varphi = \\frac{Z_L - Z_C}{R}$.\n\nBạn hãy kiểm tra xem bài toán có đang xảy ra cộng hưởng không nhé!`;
      } else if (normalized.includes('hóa') || normalized.includes('phản ứng') || normalized.includes('kim loại')) {
        replyText = `### 🧪 Hỗ trợ học tập môn Hóa học:\n\nPhương trình phản ứng tổng quát của kim loại kiềm tác dụng với nước:\n$$2\\text{M} + 2\\text{H}_2\\text{O} \\rightarrow 2\\text{MOH} + \\text{H}_2\\uparrow$$\n\n- Các kim loại hoạt động hóa học mạnh nhóm IA (Na, K, Li...) phản ứng mãnh liệt tỏa nhiều nhiệt, sinh khí Hydro phản ứng cháy nổ trong không khí.\n- Dung dịch thu được làm quỳ tím hóa xanh (môi trường kiềm).`;
      } else {
        replyText = `### 🤖 Gia sư AI 24/7 phản hồi:\n\nChào bạn, mình đã ghi nhận câu hỏi. Để giúp bạn học tốt nhất, bạn có thể gửi đề bài cụ thể (chép nguyên văn đề bài hoặc công thức) được không? \n\nMình có thể hỗ trợ các môn học cấp THPT như **Toán, Lý, Hóa, Văn, Anh**. Rất vui được đồng hành cùng bạn!`;
      }

      setTutorChat(prev => [...prev, { sender: 'tutor', text: replyText }]);
    }, 1200);
  };

  // Actions for RFID Điểm Danh
  const logAttendance = (studentId, status, checkInTime) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    setAttendanceLogs(prev => [
      ...prev,
      {
        id: `AT${String(Date.now()).slice(-4)}`,
        studentId,
        studentName: student.name,
        status,
        checkInTime,
        date: '2026-06-03' // Mock today date
      }
    ]);
  };

  // Actions for Câu Lạc Bộ
  const submitClubApplication = (studentId, clubId, introduction) => {
    const student = students.find(s => s.id === studentId);
    const club = clubs.find(c => c.id === clubId);
    if (!student || !club) return;
    setClubApplications(prev => [
      ...prev,
      {
        id: `CA${String(Date.now()).slice(-4)}`,
        studentId,
        studentName: student.name,
        clubId,
        clubName: club.name,
        status: 'pending',
        introduction
      }
    ]);
  };

  const reviewClubApplication = (applicationId, status) => {
    setClubApplications(prev => prev.map(app => {
      if (app.id === applicationId) {
        if (status === 'approved') {
          setClubs(cPrev => cPrev.map(c => {
            if (c.id === app.clubId) {
              return { ...c, membersCount: c.membersCount + 1 };
            }
            return c;
          }));
        }
        return { ...app, status };
      }
      return app;
    }));
  };

  const approveClubBudget = (clubId, budgetApproved) => {
    setClubs(prev => prev.map(c => {
      if (c.id === clubId) {
        return { ...c, budgetApproved: parseFloat(budgetApproved), status: 'active' };
      }
      return c;
    }));
  };

  // Actions for Học Liệu
  const uploadResource = (subject, title, fileType, teacherName) => {
    setLearningResources(prev => [
      ...prev,
      {
        id: `R${String(Date.now()).slice(-4)}`,
        subject,
        title,
        fileType,
        teacherName,
        dateUploaded: '2026-06-03'
      }
    ]);
  };

  // Actions for Flashcards
  const createFlashcard = (studentId, front, back) => {
    setFlashcards(prev => [
      ...prev,
      {
        id: `FC${String(Date.now()).slice(-4)}`,
        studentId,
        front,
        back
      }
    ]);
  };

  const deleteFlashcard = (flashcardId) => {
    setFlashcards(prev => prev.filter(fc => fc.id !== flashcardId));
  };

  // Actions for Career Tests
  const saveCareerTest = (studentId, scoreRiasec) => {
    setCareerTestScores(prev => {
      const exists = prev.some(s => s.studentId === studentId);
      if (exists) {
        return prev.map(s => s.studentId === studentId ? { ...s, ...scoreRiasec } : s);
      }
      return [...prev, { studentId, ...scoreRiasec }];
    });
  };

  return (
    <AppContext.Provider value={{
      theme,
      userSession,
      setUserSession,
      currentRole,
      setCurrentRole,
      selectedStudentId,
      setSelectedStudentId,
      teachers,
      students,
      announcements,
      journalEntries,
      parentQAs,
      tutorChat,
      videoLessons: initialVideoLessons,
      leaveRequests,
      lessonPlans,
      conductLogs,
      teacherEvaluations,
      assignments,
      submissions,
      attendanceLogs,
      clubs,
      clubApplications,
      learningResources,
      flashcards,
      careerTestScores,
      logout,
      addStudent,
      editStudentGrades,
      addTeacher,
      addAnnouncement,
      addJournalEntry,
      signJournalEntry,
      signParentReport,
      payStudentFee,
      createFeeItem,
      askParentQuestion,
      answerParentQuestion,
      submitLeaveRequest,
      approveLeaveRequest,
      submitLessonPlan,
      reviewLessonPlan,
      addConductLog,
      submitTeacherEvaluation,
      createAssignment,
      submitAssignment,
      gradeSubmission,
      sendTutorMessage,
      logAttendance,
      submitClubApplication,
      reviewClubApplication,
      approveClubBudget,
      uploadResource,
      createFlashcard,
      deleteFlashcard,
      saveCareerTest
    }}>
      {children}
    </AppContext.Provider>
  );
};
