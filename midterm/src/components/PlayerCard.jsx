import Avatar from './Avatar.jsx';
import { formatValue } from '../utils/format.js';

export default function PlayerCard({ player, onOpen, onToggleShortlist }) {
  return (
    <article className="card">
      <button
        type="button"
        className={`card__star ${player.shortlisted ? 'is-on' : ''}`}
        aria-pressed={player.shortlisted}
        aria-label={
          player.shortlisted
            ? `Remove ${player.name} from shortlist`
            : `Add ${player.name} to shortlist`
        }
        onClick={() => onToggleShortlist(player.id)}
      >
        {player.shortlisted ? '★' : '☆'}
      </button>

      <div className="card__top">
        <Avatar name={player.name} id={player.id} />
        <div>
          <h3 className="card__name">{player.name}</h3>
          <p className="card__club">{player.club}</p>
        </div>
      </div>

      <dl className="card__stats">
        <div>
          <dt>Pos</dt>
          <dd>{player.position}</dd>
        </div>
        <div>
          <dt>Age</dt>
          <dd>{player.age}</dd>
        </div>
        <div>
          <dt>Rating</dt>
          <dd className="card__rating">{player.rating}</dd>
        </div>
        <div>
          <dt>Value</dt>
          <dd>{formatValue(player.marketValue)}</dd>
        </div>
      </dl>

      <button type="button" className="btn btn--block" onClick={() => onOpen(player.id)}>
        View details
      </button>
    </article>
  );
}
