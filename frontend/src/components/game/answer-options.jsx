"use client"

const AnswerOptions = ({ question, selectedAnswers, timeLeft, showResults, correctAnswers, onAnswerSelect }) => {
  return (
    <div className="space-y-3">
      {question.answers?.map((answer, index) => (
        <button
          key={index}
          onClick={() => onAnswerSelect(answer)}
          disabled={timeLeft === 0 && showResults} // Only disable when showing results
          className={`w-full p-3 rounded-lg border text-left transition-colors ${
            selectedAnswers.includes(answer)
              ? "bg-secondary-100 border-secondary-500"
              : "bg-white border-gray-300 hover:bg-gray-50"
          } ${
            showResults
              ? correctAnswers.includes(answer)
                ? "bg-green-100 border-green-500"
                : selectedAnswers.includes(answer) && !correctAnswers.includes(answer)
                  ? "bg-red-100 border-red-500"
                  : ""
              : ""
          }`}
        >
          <div className="flex items-center">
            <div
              className={`w-6 h-6 flex items-center justify-center rounded-full mr-3 ${
                selectedAnswers.includes(answer) ? "bg-secondary-500 text-white" : "bg-gray-200"
              }`}
            >
              {String.fromCharCode(65 + index)}
            </div>
            <span>{answer}</span>

            {showResults && correctAnswers.includes(answer) && <span className="ml-auto text-green-600">✓</span>}

            {showResults && selectedAnswers.includes(answer) && !correctAnswers.includes(answer) && (
              <span className="ml-auto text-red-600">✗</span>
            )}
          </div>
        </button>
      ))}
    </div>
  )
}

export default AnswerOptions
