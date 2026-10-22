import { useEffect, useState } from 'react';
import { getPlayer } from '../api/fakeApi.js';
import { formatValue, positionLabel } from '../utils/format.js';
import Avatar from './Avatar.jsx';
import StatBar from './StatBar.jsx';
import StatusMessage from './StatusMessage.jsx';

// Rendered with key={id} by the parent, so switching players resets this state.
export default function PlayerDetail({ id, refreshKey, onToggleShortlist }) {
  const [player, setPlayer] = useState(null);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let ignore = false; // protects against stale responses / unmounted component
    getPlayer(id)
      .then((data) => {
        if (ignore) return;
        setPlayer(data);
        setError(null);
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      });
    return () => {
      ignore = true;
    };
  }, [id, refreshKey, attempt]);

  if (error) {
    return (
      <StatusMessage
        type="error"
        title="Could not load player"
        message={error}
        actionLabel="Try again"
        onAction={() => {
          setError(null);
          setAttempt((n) => n + 1);
        }}
      />
    );
  }
  if (!player) return <StatusMessage type="loading" title="Loading player…" />;

  const perMatch = (n) => (player.matches ? n / player.matches : 0);

  return (
    <div className="detail">
      <div className="detail__head">
        <Avatar name={player.name} id={player.id} size="lg" />
        <div>
          <h3 className="detail__name">{player.name}</h3>
          <p className="card__club">
            {positionLabel(player.position)} · {player.club}
          </p>
        </div>
      </div>

      <dl className="detail__facts">
        <div><dt>Age</dt><dd>{player.age}</dd></div>
        <div><dt>Country</dt><dd>{player.nationality}</dd></div>
        <div><dt>Foot</dt><dd>{player.foot}</dd></div>
        <div><dt>Market value</dt><dd>{formatValue(player.marketValue)}</dd></div>
        <div><dt>Matches</dt><dd>{player.matches}</dd></div>
        <div><dt>Goals / assists</dt><dd>{player.goals} / {player.assists}</dd></div>
      </dl>

      <StatBar label="Rating" value={player.rating} max={100} />
      <StatBar
        label="Goals per match"
        value={perMatch(player.goals)}
        max={1}
        display={perMatch(player.goals).toFixed(2)}
      />
      <StatBar
        label="Assists per match"
        value={perMatch(player.assists)}
        max={1}
        display={perMatch(player.assists).toFixed(2)}
      />

      <button type="button" className="btn btn--block" onClick={() => onToggleShortlist(player.id)}>
        {player.shortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
      </button>
    </div>
  );
}
