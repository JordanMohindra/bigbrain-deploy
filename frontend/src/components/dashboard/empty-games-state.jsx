"use client"

const EmptyGamesState = ({ onCreateGame }) => {
  return (
    <div className="text-center py-12 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold text-gray-700 mb-2">No Games Found</h2>
      <p className="text-gray-500 mb-4">Create your first game to get started!</p>
      <button onClick={onCreateGame} className="btn btn-primary">
        Create Game
      </button>
    </div>
  )
}

export default EmptyGamesState
