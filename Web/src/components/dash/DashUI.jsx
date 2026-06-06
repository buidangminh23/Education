import { TrendingUp } from 'lucide-react';

export function Stat({ icon: Icon, color, val, label, sub, trend, delay = '' }) {
  return (
    <div className={`card stat animate ${delay}`}>
      <div className="stat-top">
        <div className={`chip-ico bg-${color} t-${color}`}><Icon size={22} /></div>
        {trend != null && (
          <span className="stat-trend" style={{ color: trend >= 0 ? 'var(--lime)' : 'var(--coral)' }}>
            <TrendingUp size={14} style={{ transform: trend >= 0 ? 'none' : 'scaleY(-1)' }} /> {trend > 0 ? `+${trend}` : trend}
          </span>
        )}
      </div>
      <div>
        <div className="stat-val">{val}</div>
        <div className="stat-label" style={{ marginTop: 4 }}>{label}</div>
      </div>
      <div className="muted" style={{ fontSize: '0.8rem' }}>{sub}</div>
    </div>
  );
}

export function SectionCard({ title, icon: Icon, action, delay = '', children }) {
  return (
    <div className={`card animate ${delay}`}>
      <div className="card-head">
        <div className="card-title">{Icon && <Icon size={19} className="t-accent" />} {title}</div>
        {action}
      </div>
      {children}
    </div>
  );
}

export function Pill({ color = 'blue', dot, children }) {
  return (
    <span className={`pill bg-${color} t-${color}`}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: 99, background: 'currentColor' }} />}
      {children}
    </span>
  );
}

export function Bar({ value, color, max = 10 }) {
  return <div className="bar"><i style={{ width: `${Math.min(100, (value / max) * 100)}%`, background: `var(--${color})` }} /></div>;
}

const AV_COLORS = ['blue', 'mint', 'violet', 'orange', 'pink', 'amber'];

export function Avatar({ src, name = '', size = 42, color }) {
  if (src) {
    return <img className="avatar" src={src} alt={name} style={{ width: size, height: size }} loading="lazy" />;
  }
  const c = color || AV_COLORS[(name.charCodeAt(0) || 0) % AV_COLORS.length];
  return (
    <div className="avatar-txt" style={{ width: size, height: size, background: `var(--${c})`, fontSize: size * 0.4 }}>
      {(name.trim().split(' ').pop() || '?')[0]}
    </div>
  );
}
