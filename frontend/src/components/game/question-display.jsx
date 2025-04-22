const QuestionDisplay = ({ question, timeLeft }) => {
  // Function to determine if the media is an image
  const isImage = (url) => {
    if (!url) return false

    // Check if it's an image by file extension
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp"]
    return imageExtensions.some((ext) => url.toLowerCase().endsWith(ext))
  }

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-secondary-700">Question</h1>
        <div className={`text-lg font-bold ${timeLeft > 10 ? "text-green-600" : "text-red-600"}`}>
          Time: {timeLeft}s
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{question.text}</h2>

        {question.media && (
          <div className="my-4">
            {isImage(question.media) ? (
              <img
                src={question.media || "/placeholder.svg"}
                alt="Question media"
                className="max-w-full h-auto rounded"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = "/placeholder.svg?height=200&width=400"
                }}
              />
            ) : (
              <div className="p-4 border rounded bg-gray-50 dark:bg-gray-800">
                <p className="mb-2 text-sm text-gray-600 dark:text-gray-300">External Link:</p>
                <a
                  href={question.media}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline break-all"
                >
                  {question.media}
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default QuestionDisplay
