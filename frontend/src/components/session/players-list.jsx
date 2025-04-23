const PlayersList = ({ players }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Players</h2>
      {players?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {players.map((player, index) => (
            <div key={index} className="p-3 border rounded-lg bg-gray-50">
              {player}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-500">No players have joined yet.</p>
          <p className="text-sm text-gray-400 mt-2">Share the session link to invite players.</p>
        </div>
      )}
    </div>
  )
}

export default PlayersList
