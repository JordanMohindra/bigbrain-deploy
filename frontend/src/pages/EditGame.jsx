"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { gamesAPI } from "../services/api"
import { toast } from "react-toastify"

// Import components
import LoadingIndicator from "../components/common/loading-indicator"
import GameDetailsForm from "../components/game/game-details-form"
import QuestionList from "../components/game/question-list"
import AddQuestionModal from "../components/game/add-question-modal"

const EditGame = () => {
  const { gameId } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [gameName, setGameName] = useState("")
  const [thumbnail, setThumbnail] = useState("")
  const [questions, setQuestions] = useState([])
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false)
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    type: "single",
    duration: 30,
    points: 10,
    answers: [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
  })

  useEffect(() => {
    fetchGame()
  }, [gameId])

  const fetchGame = async () => {
    try {
      setLoading(true)
      const response = await gamesAPI.getGame(gameId)
      const gameData = response.data
      setGameName(gameData.name || "")
      setThumbnail(gameData.thumbnail || "")
      setQuestions(gameData.questions || [])
    } catch (error) {
      toast.error("Failed to fetch game")
      console.error(error)
      navigate("/")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveGame = async () => {
    try {
      setSaving(true)
      const response = await gamesAPI.getGame(gameId)
      const gameData = response.data
      gameData.name = gameName
      gameData.thumbnail = thumbnail
      gameData.questions = questions
      await gamesAPI.updateGame(gameId, gameData)
      toast.success("Game saved successfully!")
    } catch (error) {
      toast.error("Failed to save game")
      console.error(error)
    } finally {
      setSaving(false)
      navigate("/")
    }
  }

  const handleAddQuestion = () => {
    // Validate question
    if (!newQuestion.text.trim()) {
      toast.error("Question text is required")
      return
    }

    // Ensure at least one correct answer for single/multiple choice
    if (newQuestion.type !== "judgment" && !newQuestion.answers.some((a) => a.isCorrect)) {
      toast.error("At least one correct answer is required")
      return
    }

    // For judgment questions, ensure exactly one answer
    if (newQuestion.type === "judgment" && newQuestion.answers.length !== 1) {
      toast.error("Judgment questions must have exactly one answer")
      return
    }

    // Format question for API
    const formattedQuestion = {
      text: newQuestion.text,
      type: newQuestion.type,
      duration: Number.parseInt(newQuestion.duration),
      points: Number.parseInt(newQuestion.points),
      answers: newQuestion.answers.map((a) => a.text),
      correctAnswers: newQuestion.answers.filter((a) => a.isCorrect).map((a) => a.text),
      media: newQuestion.media || null,
    }

    // Add to questions array
    const updatedQuestions = [...questions, formattedQuestion]
    setQuestions(updatedQuestions)

    // Reset form and close modal
    setNewQuestion({
      text: "",
      type: "single",
      duration: 30,
      points: 10,
      answers: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    })
    setShowAddQuestionModal(false)

    // Save game with new question
    try {
      gamesAPI.updateGame(gameId, {
        name: gameName,
        thumbnail,
        questions: updatedQuestions,
      })
      toast.success("Question added successfully!")
    } catch (error) {
      toast.error("Failed to save question")
      console.error(error)
    }
  }

  const handleDeleteQuestion = (index) => {
    if (!window.confirm("Are you sure you want to delete this question?")) {
      return
    }

    const updatedQuestions = [...questions]
    updatedQuestions.splice(index, 1)
    setQuestions(updatedQuestions)

    // Save game with updated questions
    try {
      gamesAPI.updateGame(gameId, {
        name: gameName,
        thumbnail,
        questions: updatedQuestions,
      })
      toast.success("Question deleted successfully!")
    } catch (error) {
      toast.error("Failed to delete question")
      console.error(error)
    }
  }

  const handleAddAnswer = () => {
    if (newQuestion.answers.length >= 6) {
      toast.error("Maximum 6 answers allowed")
      return
    }

    setNewQuestion({
      ...newQuestion,
      answers: [...newQuestion.answers, { text: "", isCorrect: false }],
    })
  }

  const handleRemoveAnswer = (index) => {
    if (newQuestion.answers.length <= 2) {
      toast.error("Minimum 2 answers required")
      return
    }

    const updatedAnswers = [...newQuestion.answers]
    updatedAnswers.splice(index, 1)

    setNewQuestion({
      ...newQuestion,
      answers: updatedAnswers,
    })
  }

  const handleAnswerChange = (index, field, value) => {
    const updatedAnswers = [...newQuestion.answers]

    if (field === "isCorrect" && newQuestion.type === "single") {
      // For single choice, only one answer can be correct
      updatedAnswers.forEach((answer, i) => {
        updatedAnswers[i] = { ...answer, isCorrect: i === index ? value : false }
      })
    } else if (field === "isCorrect" && newQuestion.type === "judgment") {
      // For judgment, the answer is either correct or incorrect
      updatedAnswers[index] = { ...updatedAnswers[index], isCorrect: value }
    } else {
      updatedAnswers[index] = { ...updatedAnswers[index], [field]: value }
    }

    setNewQuestion({
      ...newQuestion,
      answers: updatedAnswers,
    })
  }

  const handleQuestionTypeChange = (type) => {
    let updatedAnswers = [...newQuestion.answers]

    if (type === "judgment") {
      // Judgment questions have only one answer
      updatedAnswers = [{ text: "", isCorrect: false }]
    } else if (type === "single" && newQuestion.type !== "single") {
      // For single choice, ensure only one answer is correct
      const correctIndex = updatedAnswers.findIndex((a) => a.isCorrect)
      updatedAnswers = updatedAnswers.map((answer, i) => ({
        ...answer,
        isCorrect: i === (correctIndex >= 0 ? correctIndex : 0),
      }))
    }

    setNewQuestion({
      ...newQuestion,
      type,
      answers: updatedAnswers,
    })
  }

  if (loading) {
    return <LoadingIndicator message="Loading game..." />
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">Edit Game</h1>
        </div>
        <button onClick={handleSaveGame} disabled={saving} className="btn btn-primary">
          {saving ? "Saving..." : "Save Game"}
        </button>
      </div>

      <GameDetailsForm
        gameName={gameName}
        setGameName={setGameName}
        thumbnail={thumbnail}
        setThumbnail={setThumbnail}
      />

      <QuestionList
        questions={questions}
        gameId={gameId}
        onDeleteQuestion={handleDeleteQuestion}
        onAddQuestion={() => setShowAddQuestionModal(true)}
      />

      <AddQuestionModal
        showModal={showAddQuestionModal}
        newQuestion={newQuestion}
        setNewQuestion={setNewQuestion}
        onCancel={() => setShowAddQuestionModal(false)}
        onAddQuestion={handleAddQuestion}
        onAddAnswer={handleAddAnswer}
        onRemoveAnswer={handleRemoveAnswer}
        onAnswerChange={handleAnswerChange}
        onQuestionTypeChange={handleQuestionTypeChange}
      />
    </div>
  )
}

export default EditGame
