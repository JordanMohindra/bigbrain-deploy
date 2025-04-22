"use client"

const GameDetailsForm = ({ gameName, setGameName, thumbnail, setThumbnail }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Game Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="game-name" className="block text-sm font-medium text-gray-700 mb-1">
            Game Name
          </label>
          <input
            id="game-name"
            type="text"
            className="input"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            placeholder="Enter game name"
          />
        </div>

        <div>
          <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-1">
            Thumbnail
          </label>
          <div className="flex flex-col gap-2">
            <input
              id="thumbnail-url"
              type="text"
              className="input"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              placeholder="Enter thumbnail URL"
            />
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Or upload a file:</span>
              <input
                id="thumbnail-file"
                type="file"
                accept="image/*"
                className="text-sm text-gray-500"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0]
                    const reader = new FileReader()
                    reader.onloadend = () => {
                      setThumbnail(reader.result)
                    }
                    reader.readAsDataURL(file)
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {thumbnail && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-1">Thumbnail Preview</p>
          <div className="h-40 w-full md:w-1/2 bg-gray-100 rounded overflow-hidden">
            <img
              src={thumbnail || "/placeholder.svg"}
              alt="Thumbnail preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = "/placeholder.svg?height=160&width=320"
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default GameDetailsForm
