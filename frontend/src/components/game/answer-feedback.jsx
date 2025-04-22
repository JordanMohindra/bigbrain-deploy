const AnswerFeedback = ({ answerSubmitted, showResults, timeLeft, isCorrect }) => {
  if (answerSubmitted && !showResults && timeLeft > 0) {
    return (
      <div className="mt-6 p-4 bg-blue-100 rounded-lg">
        <h3 className="font-bold text-lg mb-2">Answer Submitted</h3>
        <p>Your answer has been recorded. You can still change your answer until the timer ends.</p>
      </div>
    )
  }

  if (showResults) {
    return (
      <div className={`mt-6 p-4 rounded-lg ${isCorrect ? "bg-green-100" : "bg-red-100"}`}>
        <h3 className="font-bold text-lg mb-2">{isCorrect ? "Correct!" : "Incorrect!"}</h3>
        <p>
          {isCorrect
            ? "Great job! You got the right answer."
            : "Sorry, that's not right. The correct answer is highlighted above."}
        </p>
        <p className="mt-2 text-sm text-gray-600">Waiting for the host to advance to the next question...</p>
      </div>
    )
  }

  return null
}

export default AnswerFeedback
