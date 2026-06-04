import { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Zap, Beaker, Play, History, Info, HelpCircle
} from 'lucide-react';

const BUBBLES_DATA = [
  { left: '20%', size: 6, delay: '0.2s', duration: '1.8s' },
  { left: '45%', size: 4, delay: '0.5s', duration: '2.2s' },
  { left: '70%', size: 8, delay: '0s', duration: '1.5s' },
  { left: '30%', size: 5, delay: '0.8s', duration: '2.0s' },
  { left: '60%', size: 7, delay: '0.3s', duration: '1.7s' },
  { left: '15%', size: 4, delay: '1.2s', duration: '2.5s' },
  { left: '80%', size: 5, delay: '0.6s', duration: '1.9s' },
  { left: '50%', size: 9, delay: '1.0s', duration: '2.1s' }
];

export default function WebLab() {
  const { selectedStudentId, students, labSimulations, runPhysicsRLC, runChemistryReaction } = useContext(AppContext);
  const student = students?.find(s => s.id === selectedStudentId) || students?.[0];

  const [activeSubTab, setActiveSubTab] = useState('physics'); // physics, chemistry
  
  // Physics State
  const [R, setR] = useState(100);
  const [L, setL] = useState(250); // mH
  const [C, setC] = useState(50);  // uF
  const [physicsResult, setPhysicsResult] = useState(null);
  const [waveOffset, setWaveOffset] = useState(0);

  // Chemistry State
  const [chemicalA, setChemicalA] = useState('HCl');
  const [chemicalB, setChemicalB] = useState('NaOH');
  const [chemistryResult, setChemistryResult] = useState(null);
  const [reactionActive, setReactionActive] = useState(false);
  const [liquidColor, setLiquidColor] = useState('rgba(255,255,255,0.8)');
  const [showBubbles, setShowBubbles] = useState(false);
  const [showPrecipitate, setShowPrecipitate] = useState(false);

  // Animation frame loop for waves
  useEffect(() => {
    let frameId;
    if (activeSubTab === 'physics' && physicsResult) {
      const animate = () => {
        setWaveOffset(prev => (prev + 0.1) % (2 * Math.PI));
        frameId = requestAnimationFrame(animate);
      };
      frameId = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(frameId);
  }, [activeSubTab, physicsResult]);

  const handleRunPhysics = () => {
    if (!student) return;
    const res = runPhysicsRLC(student.id, R, L, C);
    setPhysicsResult(res.result);
  };

  const handleRunChemistry = () => {
    if (!student) return;
    setReactionActive(true);
    setShowBubbles(false);
    setShowPrecipitate(false);
    
    // Initial mixing state
    setLiquidColor('rgba(226, 232, 240, 0.6)'); 

    setTimeout(() => {
      const res = runChemistryReaction(student.id, chemicalA, chemicalB);
      setChemistryResult(res.result);
      setReactionActive(false);

      // Apply reaction physical appearance
      const colorMap = {
        '#10b981': 'rgba(16, 185, 129, 0.4)', // green
        '#0ea5e9': 'rgba(14, 165, 233, 0.4)', // blue
        '#b91c1c': 'rgba(185, 28, 28, 0.7)',  // red
        '#f59e0b': 'rgba(245, 158, 11, 0.3)', // orange
      };
      
      const targetColor = colorMap[res.result.color] || 'rgba(203, 213, 225, 0.5)';
      setLiquidColor(targetColor);

      if (res.result.equation.includes('CO₂')) {
        setShowBubbles(true);
      }
      if (res.result.equation.includes('Cu(OH)₂')) {
        setShowPrecipitate(true);
      }
    }, 1500); // 1.5s beaker mix simulation
  };

  // Get simulations matching this student
  const mySimulations = labSimulations?.filter(sim => sim.studentId === student?.id) || [];

  return (
    <div className="glass-panel animate-fade" style={{ maxWidth: 1000, margin: '0 auto', padding: '24px' }}>
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8, fontSize: '1.4rem', color: '#1e293b' }}>
            🧪 Phòng Thí Nghiệm Học Vụ Ảo
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Không gian thực hành mô phỏng kỹ thuật số mạch RLC và phản ứng hóa học trực quan tương tác.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 4, background: 'rgba(99,102,241,0.06)', padding: 4, borderRadius: 12 }}>
          <button 
            onClick={() => setActiveSubTab('physics')}
            className={`btn ${activeSubTab === 'physics' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '6px 16px', fontSize: '0.8rem', borderRadius: 10, border: 'none' }}
          >
            <Zap size={14} style={{ marginRight: 6 }} /> Dao động RLC
          </button>
          <button 
            onClick={() => setActiveSubTab('chemistry')}
            className={`btn ${activeSubTab === 'chemistry' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '6px 16px', fontSize: '0.8rem', borderRadius: 10, border: 'none' }}
          >
            <Beaker size={14} style={{ marginRight: 6 }} /> Phản ứng Hóa học
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
        {/* Left Interactive Lab Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* 1. PHYSICS RLC LAB */}
          {activeSubTab === 'physics' && (
            <div className="glass-panel" style={{ padding: 20, background: 'rgba(255,255,255,0.6)' }}>
              <h4 style={{ margin: '0 0 16px 0', fontSize: '1rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Zap size={18} /> Thiết kế mạch xoay chiều R-L-C nối tiếp
              </h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                {/* Sliders */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>
                      <span>Điện trở R</span>
                      <span style={{ color: 'var(--accent-primary)' }}>{R} Ω</span>
                    </div>
                    <input 
                      type="range" min="10" max="500" step="10" 
                      value={R} onChange={e => setR(parseInt(e.target.value))}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>
                      <span>Độ tự cảm L</span>
                      <span style={{ color: 'var(--accent-primary)' }}>{L} mH</span>
                    </div>
                    <input 
                      type="range" min="10" max="1000" step="10" 
                      value={L} onChange={e => setL(parseInt(e.target.value))}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>
                      <span>Điện dung C</span>
                      <span style={{ color: 'var(--accent-primary)' }}>{C} µF</span>
                    </div>
                    <input 
                      type="range" min="1" max="200" step="1" 
                      value={C} onChange={e => setC(parseInt(e.target.value))}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <button 
                    onClick={handleRunPhysics}
                    className="btn btn-primary"
                    style={{ marginTop: 10, width: '100%', height: 40, gap: 8 }}
                  >
                    <Play size={16} /> Chạy mô phỏng dao động
                  </button>
                </div>

                {/* Circuit SVG Diagram with animations */}
                <div style={{ 
                  border: '1px dashed rgba(99,102,241,0.2)', 
                  borderRadius: 16, 
                  background: 'rgba(255,255,255,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 10,
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <svg width="240" height="150" viewBox="0 0 240 150">
                    {/* Wire Path */}
                    <path d="M 20 75 L 20 20 L 220 20 L 220 75 M 220 75 L 220 130 L 20 130 L 20 75" fill="none" stroke="#94a3b8" strokeWidth="3" />
                    
                    {/* AC Source symbol */}
                    <circle cx="20" cy="75" r="14" fill="#fff" stroke="var(--accent-primary)" strokeWidth="3" />
                    <path d="M 12 75 Q 16 67 20 75 T 28 75" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5" />
                    <text x="38" y="80" fontSize="10" fontWeight="bold" fill="var(--text-secondary)">u(t)</text>
                    
                    {/* Resistor R */}
                    <rect x="70" y="10" width="40" height="20" fill="#fff" stroke="#f59e0b" strokeWidth="3" rx="2" />
                    <text x="86" y="24" fontSize="10" fontWeight="bold" fill="#f59e0b">R</text>

                    {/* Inductor L */}
                    <path d="M 130 20 Q 135 10 140 20 Q 145 10 150 20 Q 155 10 160 20 Q 165 10 170 20" fill="none" stroke="#10b981" strokeWidth="3" />
                    <text x="146" y="38" fontSize="10" fontWeight="bold" fill="#10b981">L</text>

                    {/* Capacitor C */}
                    <path d="M 220 55 L 220 95 M 210 65 L 210 85 M 230 65 L 230 85" fill="none" stroke="#0ea5e9" strokeWidth="3" />
                    <text x="235" y="80" fontSize="10" fontWeight="bold" fill="#0ea5e9">C</text>

                    {/* Animated current particles flowing along wire */}
                    {physicsResult && (
                      <circle cx={20 + 200 * Math.abs(Math.sin(waveOffset))} cy="20" r="4" fill="#6366f1" className="animate-pulse">
                        <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1s" repeatCount="indefinite" />
                      </circle>
                    )}
                  </svg>
                </div>
              </div>

              {/* Sine Wave chart canvas using inline SVG */}
              {physicsResult ? (
                <div style={{ marginTop: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 10 }}>
                    <Info size={14} color="var(--accent-primary)" /> Đồ thị dao động áp u(t) và dòng i(t) tại tần số cộng hưởng:
                  </div>

                  <div style={{ background: '#0f172a', padding: '16px', borderRadius: '16px', border: '1px solid #1e293b' }}>
                    <svg width="100%" height="120" viewBox="0 0 500 100" preserveAspectRatio="none">
                      {/* Grid Lines */}
                      <line x1="0" y1="50" x2="500" y2="50" stroke="#334155" strokeWidth="1" strokeDasharray="4" />
                      
                      {/* Voltage Wave (Red) */}
                      <path d={
                        Array.from({ length: 100 }, (_, i) => {
                          const x = (i / 100) * 500;
                          const y = 50 + 35 * Math.sin((i / 10) + waveOffset);
                          return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                        }).join(' ')
                      } fill="none" stroke="#ef4444" strokeWidth="2.5" />

                      {/* Current Wave (Blue - In Phase since it is at resonance) */}
                      <path d={
                        Array.from({ length: 100 }, (_, i) => {
                          const x = (i / 100) * 500;
                          const y = 50 + 30 * Math.sin((i / 10) + waveOffset); // in phase
                          return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                        }).join(' ')
                      } fill="none" stroke="#38bdf8" strokeWidth="2" />
                    </svg>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 8, fontSize: '0.7rem' }}>
                      <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ display: 'inline-block', width: 8, height: 8, background: '#ef4444', borderRadius: '50%' }}></span> Điện áp nguồn u(t)
                      </span>
                      <span style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ display: 'inline-block', width: 8, height: 8, background: '#38bdf8', borderRadius: '50%' }}></span> Dòng điện trong mạch i(t)
                      </span>
                    </div>
                  </div>

                  {/* Calculations Details Card */}
                  <div style={{ 
                    marginTop: 16, 
                    padding: 16, 
                    background: 'rgba(99,102,241,0.04)', 
                    border: '1px solid rgba(99,102,241,0.1)', 
                    borderRadius: 12,
                    fontSize: '0.85rem' 
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, textAlign: 'center', marginBottom: 12 }}>
                      <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Tần số cộng hưởng</div>
                        <div style={{ fontWeight: 700, color: 'var(--accent-primary)', fontSize: '1rem' }}>{physicsResult.fRes} Hz</div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Cảm kháng XL</div>
                        <div style={{ fontWeight: 700, color: 'var(--accent-secondary)', fontSize: '1rem' }}>{physicsResult.XL} Ω</div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Dung kháng XC</div>
                        <div style={{ fontWeight: 700, color: 'var(--accent-info)', fontSize: '1rem' }}>{physicsResult.XC} Ω</div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Trở kháng mạch Z</div>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>{physicsResult.Z} Ω</div>
                      </div>
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: '1.4', background: '#fff', padding: 12, borderRadius: 8, border: '1px solid rgba(0,0,0,0.03)' }}>
                      <strong>Nhận xét:</strong> {physicsResult.summary}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ 
                  marginTop: 16, 
                  padding: '32px 16px', 
                  textAlign: 'center', 
                  color: 'var(--text-muted)', 
                  border: '1px dashed rgba(0,0,0,0.08)',
                  borderRadius: 12 
                }}>
                  <HelpCircle size={32} style={{ opacity: 0.5, margin: '0 auto 8px auto' }} />
                  Nhấn nút "Chạy mô phỏng" ở trên để giải mạch RLC và tạo sóng dao động.
                </div>
              )}
            </div>
          )}

          {/* 2. CHEMISTRY REACTION LAB */}
          {activeSubTab === 'chemistry' && (
            <div className="glass-panel" style={{ padding: 20, background: 'rgba(255,255,255,0.6)' }}>
              <h4 style={{ margin: '0 0 16px 0', fontSize: '1rem', color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Beaker size={18} /> Tiến hành phối trộn hóa chất phản ứng
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: 24 }}>
                {/* Inputs & Mixing buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.8rem' }}>Dung dịch A</label>
                      <select 
                        className="form-control" 
                        value={chemicalA} 
                        onChange={e => setChemicalA(e.target.value)}
                        style={{ background: 'white', borderColor: '#cbd5e1', color: '#1e293b' }}
                      >
                        <option value="HCl">HCl (Axit Clohydric)</option>
                        <option value="CuSO4">CuSO₄ (Đồng(II) sunfat)</option>
                        <option value="FeCl3">FeCl₃ (Sắt(III) clorua)</option>
                        <option value="Na2CO3">Na₂CO₃ (Natri cacbonat)</option>
                      </select>
                    </div>

                    <div>
                      <label className="form-label" style={{ fontSize: '0.8rem' }}>Dung dịch B</label>
                      <select 
                        className="form-control" 
                        value={chemicalB} 
                        onChange={e => setChemicalB(e.target.value)}
                        style={{ background: 'white', borderColor: '#cbd5e1', color: '#1e293b' }}
                      >
                        <option value="NaOH">NaOH (Natri hiđrôxit)</option>
                        <option value="KSCN">KSCN (Kali thiosianat)</option>
                        <option value="HCl">HCl (Axit Clohydric)</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    onClick={handleRunChemistry}
                    disabled={reactionActive}
                    className="btn btn-primary"
                    style={{ 
                      marginTop: 10, 
                      width: '100%', 
                      height: 40, 
                      gap: 8, 
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      border: 'none',
                      boxShadow: '0 4px 12px -3px rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    {reactionActive ? 'Đang thực hiện phản ứng...' : 'Trộn hóa chất & Xem hiện tượng'}
                  </button>

                  {/* Chemistry Reaction Formula Details */}
                  {chemistryResult && !reactionActive && (
                    <div style={{ 
                      marginTop: 10, 
                      padding: 16, 
                      background: 'rgba(16, 185, 129, 0.04)', 
                      border: '1px solid rgba(16, 185, 129, 0.1)', 
                      borderRadius: 12 
                    }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 2 }}>Phương trình phản ứng:</div>
                      <div style={{ 
                        fontFamily: 'monospace', 
                        fontWeight: 700, 
                        fontSize: '1rem', 
                        color: '#065f46', 
                        background: '#fff', 
                        padding: '6px 12px', 
                        borderRadius: 6,
                        border: '1px solid rgba(16, 185, 129, 0.15)',
                        marginBottom: 10
                      }}>{chemistryResult.equation}</div>
                      <div style={{ fontSize: '0.8rem', lineHeight: '1.4', color: 'var(--text-secondary)' }}>
                        <strong>Hiện tượng:</strong> {chemistryResult.phenomenon}
                      </div>
                    </div>
                  )}
                </div>

                {/* Beaker Graphics representation with custom liquid animations */}
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center', 
                  justifyContent: 'center',
                  background: 'rgba(255,255,255,0.4)',
                  border: '1px solid rgba(0,0,0,0.05)',
                  borderRadius: 16,
                  padding: '20px 10px',
                  position: 'relative'
                }}>
                  {/* Beaker Body */}
                  <div style={{
                    width: 110,
                    height: 130,
                    border: '4px solid #475569',
                    borderTop: 'none',
                    borderRadius: '0 0 16px 16px',
                    position: 'relative',
                    overflow: 'hidden',
                    background: 'rgba(255,255,255,0.1)'
                  }}>
                    {/* Lip left */}
                    <div style={{ position: 'absolute', top: 0, left: -4, width: 8, height: 4, background: '#475569', borderRadius: 4 }}></div>
                    {/* Lip right */}
                    <div style={{ position: 'absolute', top: 0, right: -4, width: 8, height: 4, background: '#475569', borderRadius: 4 }}></div>

                    {/* Liquid fill */}
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: reactionActive ? '40%' : chemistryResult ? '60%' : '20%',
                      background: liquidColor,
                      transition: 'all 1.5s ease-in-out',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {/* Bubbles animation for gas CO2 */}
                      {showBubbles && !reactionActive && (
                        <div className="gas-bubbles" style={{ position: 'absolute', width: '100%', height: '100%', overflow: 'hidden' }}>
                          {BUBBLES_DATA.map((bubble, i) => (
                            <span 
                              key={i} 
                              style={{
                                position: 'absolute',
                                bottom: 0,
                                left: bubble.left,
                                width: bubble.size,
                                height: bubble.size,
                                background: 'rgba(255,255,255,0.8)',
                                borderRadius: '50%',
                                animationDelay: bubble.delay,
                                animation: `gasRise ${bubble.duration} infinite linear`
                              }}
                            />
                          ))}
                        </div>
                      )}


                      {/* Precipitate layer at the bottom of beaker */}
                      {showPrecipitate && !reactionActive && (
                        <div style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          width: '100%',
                          height: '25%',
                          background: 'rgba(14, 165, 233, 0.8)',
                          borderRadius: '0 0 12px 12px',
                          borderTop: '2px solid rgba(255,255,255,0.3)',
                          animation: 'pulse 2s infinite'
                        }}></div>
                      )}
                    </div>

                    {/* Mixing vortex animation during reaction */}
                    {reactionActive && (
                      <div style={{
                        position: 'absolute',
                        top: '40%',
                        left: '42%',
                        width: 16,
                        height: 40,
                        border: '3px dashed #64748b',
                        borderTop: 'none',
                        borderBottom: 'none',
                        borderRadius: '50%',
                        animation: 'spin 0.4s infinite linear'
                      }}></div>
                    )}
                  </div>
                  <div style={{ marginTop: 10, fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Cốc dung dịch</div>
                  
                  {/* Bubble animation styles in a tag */}
                  <style dangerouslySetInnerHTML={{__html: `
                    @keyframes gasRise {
                      0% { bottom: 0; opacity: 1; transform: scale(0.8); }
                      100% { bottom: 85%; opacity: 0; transform: scale(1.3); }
                    }
                  `}} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Simulations History Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="glass-panel" style={{ padding: 16, background: 'rgba(255,255,255,0.6)', height: '100%', minHeight: 400, display: 'flex', flexDirection: 'column' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <History size={16} /> Nhật ký thí nghiệm
            </h4>
            
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 420 }}>
              {mySimulations.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', padding: '40px 10px' }}>
                  Chưa thực hiện thí nghiệm nào trong phiên này.
                </div>
              ) : (
                mySimulations.map(sim => (
                  <div 
                    key={sim.id} 
                    style={{ 
                      padding: 10, 
                      borderRadius: 12, 
                      background: '#fff', 
                      border: '1px solid rgba(0,0,0,0.04)',
                      fontSize: '0.78rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontWeight: 700 }}>
                      <span style={{ color: sim.type === 'physics' ? 'var(--accent-primary)' : 'var(--accent-secondary)' }}>
                        {sim.type === 'physics' ? '⚡ Lý: RLC' : '🧪 Hóa: Trộn'}
                      </span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{sim.date}</span>
                    </div>
                    {sim.type === 'physics' ? (
                      <div>
                        <div style={{ color: 'var(--text-secondary)' }}>
                          Thông số: R={sim.params.R}Ω, L={sim.params.L}mH, C={sim.params.C}µF
                        </div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>
                          f0 = {sim.result.fRes} Hz
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ color: 'var(--text-secondary)' }}>
                          Chất: {sim.params.chemicalA} + {sim.params.chemicalB}
                        </div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: 2, fontFamily: 'monospace' }}>
                          {sim.result.equation}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
