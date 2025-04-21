"use client"

const AddQuestionModal = ({
  showModal,
  newQuestion,
  setNewQuestion,
  onCancel,
  onAddQuestion,
  onAddAnswer,
  onRemoveAnswer,
  onAnswerChange,
  onQuestionTypeChange,
}) => {
  if (!showModal) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Add New Question</h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="question-text" className="block text-sm font-medium text-gray-700 mb-1">
              Question Text
            </label>
            <input
              id="question-text"
              type="text"
              className="input"
              value={newQuestion.text}
              onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
              placeholder="Enter question text"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="question-type"
                  checked={newQuestion.type === "single"}
                  onChange={() => onQuestionTypeChange("single")}
                  className="mr-2"
                />
                Single Choice
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="question-type"
                  checked={newQuestion.type === "multiple"}
                  onChange={() => onQuestionTypeChange("multiple")}
                  className="mr-2"
                />
                Multiple Choice
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="question-type"
                  checked={newQuestion.type === "judgment"}
                  onChange={() => onQuestionTypeChange("judgment")}
                  className="mr-2"
                />
                Judgment
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="question-duration" className="block text-sm font-medium text-gray-700 mb-1">
                Time Limit (seconds)
              </label>
              <input
                id="question-duration"
                type="number"
                min="5"
                max="300"
                className="input"
                value={newQuestion.duration}
                onChange={(e) => setNewQuestion({ ...newQuestion, duration: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="question-points" className="block text-sm font-medium text-gray-700 mb-1">
                Points
              </label>
              <input
                id="question-points"
                type="number"
                min="1"
                max="100"
                className="input"
                value={newQuestion.points}
                onChange={(e) => setNewQuestion({ ...newQuestion, points: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label htmlFor="question-media" className="block text-sm font-medium text-gray-700 mb-1">
              Media URL (Optional)
            </label>
            <input
              id="question-media"
              type="text"
              className="input"
              value={newQuestion.media || ""}
              onChange={(e) => setNewQuestion({ ...newQuestion, media: e.target.value })}
              placeholder="Enter YouTube URL or image URL"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Answers {newQuestion.type === "judgment" ? "(True/False)" : ""}
              </label>
              {newQuestion.type !== "judgment" && (
                <button type="button" onClick={onAddAnswer} className="text-sm text-primary-600 hover:text-primary-700">
                  + Add Answer
                </button>
              )}
            </div>

            <div className="space-y-2">
              {newQuestion.answers.map((answer, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type={newQuestion.type === "multiple" ? "checkbox" : "radio"}
                    name="correct-answer"
                    checked={answer.isCorrect}
                    onChange={(e) => onAnswerChange(index, "isCorrect", e.target.checked)}
                    className="mr-2"
                  />
                  <input
                    type="text"
                    className="input flex-grow"
                    value={answer.text}
                    onChange={(e) => onAnswerChange(index, "text", e.target.value)}
                    placeholder={`Answer ${index + 1}`}
                  />
                  {newQuestion.type !== "judgment" && newQuestion.answers.length > 2 && (
                    <button
                      type="button"
                      onClick={() => onRemoveAnswer(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            <p className="text-sm text-gray-500 mt-2">
              {newQuestion.type === "single"
                ? "Select one correct answer"
                : newQuestion.type === "multiple"
                  ? "Select all correct answers"
                  : "Set whether the statement is true or false"}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button type="button" onClick={onCancel} className="btn btn-outline">
            Cancel
          </button>
          <button type="button" onClick={onAddQuestion} className="btn btn-primary">
            Add Question
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddQuestionModal
