const SessionSummary = ({ sessionId, session, results, correctPercentages }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Session Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Session ID:</span>
            <span className="font-medium">{sessionId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <span className="font-medium">Ended</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Questions:</span>
            <span className="font-medium">{session.questions?.length || 0}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Players:</span>
            <span className="font-medium">{results.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Average Score:</span>
            <span className="font-medium">
              {results.length > 0
                ? (
                  results.reduce((sum, player) => {
                    const playerScore = player.answers?.reduce((s, answer) => s + (answer.correct ? 1 : 0), 0) || 0
                    return sum + playerScore
                  }, 0) / results.length
                ).toFixed(1)
                : "0"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Average Correct %:</span>
            <span className="font-medium">
              {correctPercentages.length > 0
                ? (correctPercentages.reduce((sum, pct) => sum + pct, 0) / correctPercentages.length).toFixed(1) + "%"
                : "0%"}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SessionSummary
