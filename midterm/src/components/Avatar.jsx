import { getInitials } from '../utils/format.js';

export default function Avatar({ name, id, size = 'md' }) {
  // stable colour per player, derived from id
  const hue = (id * 47) % 360;
  return (
    <span
      className={`avatar avatar--${size}`}
      style={{ background: `hsl(${hue} 35% 32%)` }}
      aria-hidden="true"
    >
      {getInitials(name)}
    </span>
  );
}
