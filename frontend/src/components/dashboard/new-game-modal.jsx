"use client"

const NewGameModal = ({ showModal, newGameName, setNewGameName, onCancel, onSubmit, creatingGame }) => {
  if (!showModal) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create New Game</h2>

        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label htmlFor="game-name" className="block text-sm font-medium text-gray-700 mb-1">
              Game Name
            </label>
            <input
              id="game-name"
              type="text"
              className="input"
              value={newGameName}
              onChange={(e) => setNewGameName(e.target.value)}
              placeholder="Enter game name"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onCancel} className="btn btn-outline" disabled={creatingGame}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={creatingGame}>
              {creatingGame ? "Creating..." : "Create Game"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NewGameModal
