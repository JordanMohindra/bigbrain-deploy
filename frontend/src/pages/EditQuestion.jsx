"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { gamesAPI } from "../services/api"
import { toast } from "react-toastify"

// Import components
import LoadingIndicator from "../components/common/loading-indicator"
import QuestionForm from "../components/game/question-form"

const EditQuestion = () => {
  const { gameId, questionId } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [game, setGame] = useState(null)
  const [question, setQuestion] = useState(null)

  useEffect(() => {
    fetchGame()
  }, [gameId, questionId])

  const fetchGame = async () => {
    try {
      setLoading(true)
      const response = await gamesAPI.getGame(gameId)
      const gameData = response.data

      setGame(gameData)

      // Get the specific question
      const questionIndex = Number.parseInt(questionId)
      if (gameData.questions && gameData.questions[questionIndex]) {
        const q = gameData.questions[questionIndex]

        // Format question for editing
        setQuestion({
          text: q.text || "",
          type: q.type || "single",
          duration: q.duration || 30,
          points: q.points || 10,
          media: q.media || "",
          answers: q.answers?.map((answer, _i) => ({
            text: answer,
            isCorrect: q.correctAnswers?.includes(answer) || false,
          })) || [
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
          ],
        })
      } else {
        toast.error("Question not found")
        navigate(`/game/${gameId}`)
      }
    } catch (error) {
      toast.error("Failed to fetch game")
      console.error(error)
      navigate("/")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveQuestion = async () => {
    // Validate question
    if (!question.text.trim()) {
      toast.error("Question text is required")
      return
    }

    // Ensure at least one correct answer for single/multiple choice
    if (question.type !== "judgment" && !question.answers.some((a) => a.isCorrect)) {
      toast.error("At least one correct answer is required")
      return
    }

    // For judgment questions, ensure exactly one answer
    if (question.type === "judgment" && question.answers.length !== 1) {
      toast.error("Judgment questions must have exactly one answer")
      return
    }

    try {
      setSaving(true)

      // Format question for API
      const formattedQuestion = {
        text: question.text,
        type: question.type,
        duration: Number.parseInt(question.duration),
        points: Number.parseInt(question.points),
        answers: question.answers.map((a) => a.text),
        correctAnswers: question.answers.filter((a) => a.isCorrect).map((a) => a.text),
        media: question.media || null,
      }

      // Update the question in the game
      const updatedQuestions = [...game.questions]
      updatedQuestions[Number.parseInt(questionId)] = formattedQuestion

      // Save the game with updated questions
      await gamesAPI.updateGame(gameId, {
        ...game,
        questions: updatedQuestions,
      })

      toast.success("Question saved successfully!")
      navigate(`/game/${gameId}`)
    } catch (error) {
      toast.error("Failed to save question")
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  const handleAddAnswer = () => {
    if (question.answers.length >= 6) {
      toast.error("Maximum 6 answers allowed")
      return
    }

    setQuestion({
      ...question,
      answers: [...question.answers, { text: "", isCorrect: false }],
    })
  }

  const handleRemoveAnswer = (index) => {
    if (question.answers.length <= 2) {
      toast.error("Minimum 2 answers required")
      return
    }

    const updatedAnswers = [...question.answers]
    updatedAnswers.splice(index, 1)

    setQuestion({
      ...question,
      answers: updatedAnswers,
    })
  }

  const handleAnswerChange = (index, field, value) => {
    const updatedAnswers = [...question.answers]

    if (field === "isCorrect" && question.type === "single") {
      // For single choice, only one answer can be correct
      updatedAnswers.forEach((answer, i) => {
        updatedAnswers[i] = { ...answer, isCorrect: i === index ? value : false }
      })
    } else if (field === "isCorrect" && question.type === "judgment") {
      // For judgment, the answer is either correct or incorrect
      updatedAnswers[index] = { ...updatedAnswers[index], isCorrect: value }
    } else {
      updatedAnswers[index] = { ...updatedAnswers[index], [field]: value }
    }

    setQuestion({
      ...question,
      answers: updatedAnswers,
    })
  }

  const handleQuestionTypeChange = (type) => {
    let updatedAnswers = [...question.answers]

    if (type === "judgment") {
      // Judgment questions have only one answer
      updatedAnswers = [{ text: "", isCorrect: false }]
    } else if (type === "single" && question.type !== "single") {
      // For single choice, ensure only one answer is correct
      const correctIndex = updatedAnswers.findIndex((a) => a.isCorrect)
      updatedAnswers = updatedAnswers.map((answer, i) => ({
        ...answer,
        isCorrect: i === (correctIndex >= 0 ? correctIndex : 0),
      }))
    }

    setQuestion({
      ...question,
      type,
      answers: updatedAnswers,
    })
  }

  if (loading) {
    return <LoadingIndicator message="Loading question..." />
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Link to={`/game/${gameId}`} className="text-primary-600 hover:text-primary-700">
            &larr; Back to Game
          </Link>
          <h1 className="text-3xl font-bold">Edit Question</h1>
        </div>
        <button onClick={handleSaveQuestion} disabled={saving} className="btn btn-primary">
          {saving ? "Saving..." : "Save Question"}
        </button>
      </div>

      <QuestionForm
        question={question}
        setQuestion={setQuestion}
        onAddAnswer={handleAddAnswer}
        onRemoveAnswer={handleRemoveAnswer}
        onAnswerChange={handleAnswerChange}
        onQuestionTypeChange={handleQuestionTypeChange}
      />
    </div>
  )
}

export default EditQuestion
