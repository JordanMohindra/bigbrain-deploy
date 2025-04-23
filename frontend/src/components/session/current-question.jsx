"use client"

const CurrentQuestion = ({ session, handleAdvanceQuestion, handleEndSession }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
      <h2 className="text-xl font-semibold mb-4">Current Question</h2>
      {session.position >= 0 && session.position < session.questions?.length ? (
        <div>
          <p className="font-medium mb-2">{session.questions[session.position].text}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
            {session.questions[session.position].answers?.map((answer, index) => (
              <div
                key={index}
                className={`p-2 rounded border ${
                  session.answerAvailable && session.questions[session.position].correctAnswers?.includes(answer)
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300"
                }`}
              >
                {answer}
                {session.answerAvailable && session.questions[session.position].correctAnswers?.includes(answer) && (
                  <span className="ml-2 text-green-600 font-medium">(Correct)</span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between items-center">
            <div>
              {session.isoTimeLastQuestionStarted && (
                <div className="text-sm text-gray-600">
                  Started: {new Date(session.isoTimeLastQuestionStarted).toLocaleTimeString()}
                </div>
              )}
              <div className="text-sm text-gray-600">
                {session.position >= 0 &&
                  session.position < session.questions?.length &&
                  `Duration: ${session.questions[session.position].duration} seconds`}
              </div>
            </div>

            <button
              onClick={session.position < session.questions?.length - 1 ? handleAdvanceQuestion : handleEndSession}
              className={`btn ${session.position < session.questions?.length - 1 ? "btn-primary" : "btn-danger"}`}
            >
              {session.position < 0
                ? "Start Quiz"
                : session.position < session.questions?.length - 1
                  ? "Next Question"
                  : "End Quiz"}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-500">
            {session.position < 0 ? 'Quiz has not started yet. Click "Start Quiz" to begin.' : "Quiz has ended."}
          </p>
          {session.position < 0 && (
            <button onClick={handleAdvanceQuestion} className="btn btn-primary mt-4">
              Start Quiz
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default CurrentQuestion
