"use client"

import { Link } from "react-router-dom"

const GameCard = ({ game, onStartGame, onStopGame, onCopySessionId, onDeleteGame }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="h-40 bg-gray-200 relative">
        {game.thumbnail ? (
          <img src={game.thumbnail || "/placeholder.svg"} alt={game.name} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-100">
            <span className="text-gray-400">No thumbnail</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{game.name}</h2>
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-500">{game.questions?.length || 0} questions</span>
          <span className="text-sm text-gray-500">{game.active ? "Active" : "Inactive"}</span>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <Link to={`/game/${game.id}`} className="btn btn-outline flex-1 flex items-center justify-center">
            Edit
          </Link>

          {game.active ? (
            <>
              <button onClick={() => onStopGame(game.id, game.active)} className="btn btn-danger flex-1">
                Stop Game
              </button>

              <div className="w-full mt-2 flex items-center gap-2">
                <Link
                  to={`/session/${game.active}`}
                  className="btn btn-secondary flex-1 flex items-center justify-center"
                >
                  View Session
                </Link>

                <button
                  onClick={() => onCopySessionId(game.active)}
                  className="btn btn-outline px-3 flex items-center justify-center"
                  title="Copy session ID"
                >
                  <span className="truncate max-w-[100px]">ID: {game.active}</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => onStartGame(game.id)}
                className="btn btn-primary flex-1">
                Start Game
              </button>
              <button onClick={() => onDeleteGame(game)} className="btn btn-danger flex-1">
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default GameCard
