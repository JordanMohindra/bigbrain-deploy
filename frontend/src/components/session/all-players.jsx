const AllPlayers = ({ results }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">All Players</h2>
      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-80 overflow-y-auto">
          {results.map((player, index) => {
            const score = player.answers?.reduce((sum, answer) => sum + (answer.correct ? 1 : 0), 0) || 0
            return (
              <div key={index} className="p-3 border rounded-lg bg-gray-50">
                <div className="font-medium">{player.name}</div>
                <div className="text-sm text-gray-600">
                  Score: {score}/{player.answers?.length || 0}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-500">No player data available.</p>
        </div>
      )}
    </div>
  )
}

export default AllPlayers
