import PlayerCard from './PlayerCard.jsx';

export default function PlayerList({ players, onOpen, onToggleShortlist }) {
  return (
    <div className="grid">
      {players.map((player) => (
        <PlayerCard
          key={player.id}
          player={player}
          onOpen={onOpen}
          onToggleShortlist={onToggleShortlist}
        />
      ))}
    </div>
  );
}
