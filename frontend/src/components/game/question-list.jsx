"use client"

import { Link } from "react-router-dom"

const QuestionList = ({ questions, gameId, onDeleteQuestion, onAddQuestion }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Questions</h2>
        <button onClick={onAddQuestion} className="btn btn-primary">
          Add Question
        </button>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-2">No questions added yet</p>
          <button onClick={onAddQuestion} className="btn btn-outline">
            Add Your First Question
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question, index) => (
            <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">
                    Question {index + 1}: {question.text}
                  </h3>
                  <div className="mt-1 text-sm text-gray-500">
                    <span className="mr-3">Type: {question.type || "single"}</span>
                    <span className="mr-3">Duration: {question.duration}s</span>
                    <span>Points: {question.points}</span>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700">Answers:</p>
                    <ul className="mt-1 text-sm text-gray-600 list-disc list-inside">
                      {question.answers?.map((answer, answerIndex) => (
                        <li
                          key={answerIndex}
                          className={question.correctAnswers?.includes(answer) ? "text-green-600 font-medium" : ""}
                        >
                          {answer}
                          {question.correctAnswers?.includes(answer) && " (Correct)"}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link to={`/game/${gameId}/question/${index}`} className="btn btn-outline btn-sm">
                    Edit
                  </Link>
                  <button onClick={() => onDeleteQuestion(index)} className="btn btn-danger btn-sm">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default QuestionList
