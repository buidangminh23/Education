import { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Bus, Navigation, Clipboard, ArrowRight, Play
} from 'lucide-react';

export default function BusTracker() {
  const { currentRole, selectedStudentId, students, busRoutes, busScanLogs, simulateBusMove, parentRegisterBusRoute } = useContext(AppContext);
  
  const student = students?.find(s => s.id === selectedStudentId) || students?.[0];
  const isStudent = currentRole === 'student';
  const isParent = currentRole === 'parent';
  const isAdmin = currentRole === 'admin' || currentRole === 'teacher';

  const [selectedRouteId, setSelectedRouteId] = useState(busRoutes?.[0]?.id || '');

  const handleRegister = (e) => {
    e.preventDefault();
    if (!student || !selectedRouteId) return;
    parentRegisterBusRoute(student.id, selectedRouteId);
    alert('Đăng ký xe bus đưa đón học sinh thành công!');
  };

  // Find registered route for this student
  const registeredRoute = busRoutes?.find(r => r.studentsRegistered.includes(student?.id));
  const myScanLogs = busScanLogs?.filter(log => log.studentId === student?.id) || [];

  return (
    <div className="glass-panel animate-fade" style={{ maxWidth: 1000, margin: '0 auto', padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8, fontSize: '1.4rem', color: '#1e293b' }}>
          🚌 Hệ Thống Theo Dõi Xe Bus Học Đường
        </h2>
        <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Theo dõi hành trình di chuyển trực quan, quét mã lên xuống và đăng ký tuyến xe học sinh đưa đón.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
        {/* Left Side: Route Map & Simulation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* REGISTERED ROUTE TRACKER MAP */}
          {(isStudent || isParent) && (
            <div className="glass-panel" style={{ padding: 20, background: 'rgba(255,255,255,0.6)' }}>
              <h4 style={{ margin: '0 0 16px 0', fontSize: '1rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Navigation size={18} /> Tuyến xe của con đang theo học
              </h4>

              {registeredRoute ? (
                <div>
                  {/* Route Quick Info Card */}
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 16, 
                    background: '#fff', 
                    padding: 14, 
                    borderRadius: 14, 
                    border: '1px solid rgba(0,0,0,0.04)',
                    marginBottom: 20
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Bus size={20} color="var(--accent-primary)" />
                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Tên Tuyến Xe</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{registeredRoute.name}</div>
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Biển kiểm soát</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{registeredRoute.plateNumber}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Tài xế phụ trách</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{registeredRoute.driverName}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Trạng thái</div>
                      <span className={`badge ${registeredRoute.status === 'driving' ? 'badge-info' : 'badge-success'}`}>
                        {registeredRoute.status === 'driving' ? 'Đang chạy' : 'Đang chờ'}
                      </span>
                    </div>
                  </div>

                  {/* Visual Timeline Map representing Stations */}
                  <div style={{ position: 'relative', padding: '10px 0 30px 0', marginTop: 10 }}>
                    <div style={{ 
                      position: 'absolute', 
                      top: 29, 
                      left: 20, 
                      right: 20, 
                      height: 4, 
                      background: 'rgba(99, 102, 241, 0.15)', 
                      zIndex: 1 
                    }}></div>
                    
                    {/* Running Bus Progress indicator overlay */}
                    <div style={{
                      position: 'absolute',
                      top: 29,
                      left: 20,
                      width: `${(registeredRoute.currentStopIndex / (registeredRoute.stops.length - 1)) * 90}%`,
                      height: 4,
                      background: 'var(--accent-primary)',
                      zIndex: 2,
                      transition: 'width 1s ease-in-out'
                    }}></div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 3 }}>
                      {registeredRoute.stops.map((stop, index) => {
                        const isCurrent = registeredRoute.currentStopIndex === index;
                        const isPassed = registeredRoute.currentStopIndex >= index;
                        
                        return (
                          <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 64, position: 'relative' }}>
                            {/* Stop dot node */}
                            <div 
                              style={{
                                width: 22,
                                height: 22,
                                borderRadius: '50%',
                                background: isCurrent 
                                  ? 'var(--accent-primary)' 
                                  : isPassed 
                                    ? 'rgba(99, 102, 241, 0.3)' 
                                    : '#fff',
                                border: isCurrent 
                                  ? '4px solid #fff' 
                                  : '2.5px solid rgba(99, 102, 241, 0.5)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.5s ease-in-out',
                                boxShadow: isCurrent ? '0 0 10px rgba(99, 102, 241, 0.6)' : 'none'
                              }}
                              className={isCurrent ? 'animate-pulse' : ''}
                            >
                              {isCurrent && <div style={{ width: 8, height: 8, background: '#fff', borderRadius: '50%' }}></div>}
                            </div>
                            
                            {/* Stop Label text */}
                            <div style={{ 
                              marginTop: 8, 
                              fontSize: '0.68rem', 
                              fontWeight: isCurrent ? 700 : 500, 
                              color: isCurrent ? 'var(--accent-primary)' : 'var(--text-secondary)',
                              textAlign: 'center',
                              lineHeight: '1.2',
                              wordWrap: 'break-word',
                              width: 80
                            }}>
                              {stop}
                            </div>

                            {/* Floating Bus Icon over active stop node */}
                            {isCurrent && (
                              <div style={{
                                position: 'absolute',
                                top: -28,
                                background: 'var(--accent-primary)',
                                color: 'white',
                                padding: 4,
                                borderRadius: 6,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 6px rgba(99, 102, 241, 0.2)'
                              }}>
                                <Bus size={12} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '30px 10px', 
                  color: 'var(--text-muted)', 
                  border: '1px dashed rgba(0,0,0,0.06)',
                  borderRadius: 12,
                  fontSize: '0.82rem'
                }}>
                  Con của bạn chưa đăng ký tuyến xe bus học đường nào. 🚌
                </div>
              )}
            </div>
          )}

          {/* BUS ROUTE REGISTRATION SELECTOR */}
          {(isStudent || isParent) && !registeredRoute && (
            <div className="glass-panel" style={{ padding: 20, background: 'rgba(255,255,255,0.6)' }}>
              <h4 style={{ margin: '0 0 14px 0', fontSize: '0.95rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Bus size={18} /> Đăng ký tuyến xe bus đưa đón mới
              </h4>
              <form onSubmit={handleRegister} style={{ display: 'flex', alignItems: 'flex-end', gap: 14 }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Chọn tuyến xe buýt</label>
                  <select
                    value={selectedRouteId}
                    onChange={e => setSelectedRouteId(e.target.value)}
                    className="form-control"
                    style={{ background: 'white', borderColor: '#cbd5e1', color: '#1e293b' }}
                  >
                    {busRoutes?.map(route => (
                      <option key={route.id} value={route.id}>
                        {route.name} - Biển: {route.plateNumber} ({route.stops.length} điểm đón)
                      </option>
                    ))}
                  </select>
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  style={{ height: 42, padding: '0 24px', gap: 6 }}
                >
                  Đăng Ký Ngay <ArrowRight size={14} />
                </button>
              </form>
            </div>
          )}

          {/* ADMIN SIMULATION VIEW */}
          {isAdmin && (
            <div className="glass-panel" style={{ padding: 20, background: 'rgba(255,255,255,0.6)' }}>
              <h4 style={{ margin: '0 0 14px 0', fontSize: '1rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Bus size={18} /> Quản trị và Giả lập Tuyến xe Bus đưa đón toàn trường
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {busRoutes?.map(route => (
                  <div 
                    key={route.id} 
                    style={{ 
                      padding: 16, 
                      borderRadius: 14, 
                      background: '#fff', 
                      border: '1px solid rgba(0,0,0,0.04)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center' 
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{route.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                        BKS: <strong>{route.plateNumber}</strong> | Tài xế: <strong>{route.driverName}</strong>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                        Lộ trình: {route.stops.join(' ➔ ')}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--accent-primary)', fontWeight: 600, marginTop: 4 }}>
                        Trạm hiện tại: <span className="badge badge-info">{route.stops[route.currentStopIndex]}</span> | Học sinh đăng ký: {route.studentsRegistered.length}
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => simulateBusMove(route.id)}
                      className="btn btn-primary"
                      style={{ 
                        padding: '8px 16px', 
                        fontSize: '0.8rem', 
                        gap: 6,
                        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                        border: 'none'
                      }}
                    >
                      <Play size={14} /> Đi chuyển tiếp trạm
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Scan History logs */}
        <div>
          <div className="glass-panel" style={{ padding: 16, background: 'rgba(255,255,255,0.6)', height: '100%', minHeight: 400, display: 'flex', flexDirection: 'column' }}>
            <h4 style={{ margin: '0 0 14px 0', fontSize: '0.9rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Clipboard size={16} /> Lịch sử quét mã đưa đón
            </h4>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 420 }}>
              {myScanLogs.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', padding: '40px 10px' }}>
                  Chưa ghi nhận lịch sử quét thẻ hôm nay.
                </div>
              ) : (
                myScanLogs.map(log => (
                  <div 
                    key={log.id} 
                    style={{ 
                      padding: 10, 
                      borderRadius: 12, 
                      background: '#fff', 
                      border: '1px solid rgba(0,0,0,0.03)',
                      fontSize: '0.78rem' 
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontWeight: 700 }}>
                      <span style={{ color: log.direction === 'boarding' ? '#10b981' : '#ef4444' }}>
                        {log.direction === 'boarding' ? '🟢 LÊN XE' : '🔴 XUỐNG XE'}
                      </span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{log.time}</span>
                    </div>
                    <div style={{ color: 'var(--text-secondary)' }}>Học sinh: {log.studentName}</div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>
                      Trạm đón: {log.stopName}
                    </div>
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
