export function PlayerDisplay({ players }) {
  return (
    <div className="flex flex-col p-3 text-white border rounded-lg">
      <div className="text-lg font-bold">Spieler</div>
      {players.map((e) => (
        <div key={e}>{e.split("#")[0]}</div>
      ))}
    </div>
  );
}
