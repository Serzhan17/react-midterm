export default function StatBar({ label, value, max, display }) {
  const percent = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="statbar">
      <div className="statbar__row">
        <span>{label}</span>
        <strong>{display ?? value}</strong>
      </div>
      <div className="statbar__track">
        <div className="statbar__fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
