"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { playerAPI } from "../services/api"
import { toast } from "react-toastify"

// Import components
import LoadingIndicator from "../components/common/loading-indicator"
import QuestionDisplay from "../components/game/question-display"
import AnswerOptions from "../components/game/answer-options"
import AnswerFeedback from "../components/game/answer-feedback"
import WaitingScreen from "../components/game/waiting-screen"

const PlayGame = () => {
  const { sessionId, playerId } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [question, setQuestion] = useState(null)
  const [selectedAnswers, setSelectedAnswers] = useState([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState([])
  const [isCorrect, setIsCorrect] = useState(false)
  const [answerSubmitted, setAnswerSubmitted] = useState(false)

  // Refs to store current state and prevent unnecessary re-renders
  const questionRef = useRef(null)
  const selectedAnswersRef = useRef([])
  const timeLeftRef = useRef(0)
  const showResultsRef = useRef(false)
  const correctAnswersRef = useRef([])
  const isCorrectRef = useRef(false)
  const answerSubmittedRef = useRef(false)
  const lastQuestionIdRef = useRef(null)

  const timerRef = useRef(null)
  const pollingRef = useRef(null)
  const isPollingRef = useRef(false)

  // Keep refs in sync with state
  useEffect(() => {
    questionRef.current = question
    selectedAnswersRef.current = selectedAnswers
    timeLeftRef.current = timeLeft
    showResultsRef.current = showResults
    correctAnswersRef.current = correctAnswers
    isCorrectRef.current = isCorrect
    answerSubmittedRef.current = answerSubmitted
  }, [question, selectedAnswers, timeLeft, showResults, correctAnswers, isCorrect, answerSubmitted])

  // Clean up all intervals when component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [])

  // Initial fetch and start constant polling
  useEffect(() => {
    fetchCurrentQuestion()

    // Start constant background polling
    startBackgroundPolling()

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
      }
    }
  }, [sessionId, playerId])

  // Start background polling that doesn't affect the UI unless necessary
  const startBackgroundPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current)
    }

    pollingRef.current = setInterval(() => {
      if (!isPollingRef.current) {
        isPollingRef.current = true
        checkForChangesInBackground().finally(() => {
          isPollingRef.current = false
        })
      }
    }, 2000)
  }

  // Check for changes without updating UI unless necessary
  const checkForChangesInBackground = async () => {
    try {
      const didEnd = await checkIfGameEnded()
      if (didEnd) {
        // checkIfGameEnded should handle navigation to results
        return
      }
      const response = await playerAPI.getQuestion(playerId)

      // Case 1: Game ended - no question available
      if (!response.data || !response.data.question) {
        const statusResponse = await playerAPI.getStatus(playerId)
        if (!statusResponse.data.started) {
          console.log("Game has ended, navigating to results")
          navigate(`/session/${sessionId}/player/${playerId}/results`)
          return
        }
      }

      // Case 2: New question available
      if (response.data && response.data.question) {
        const newQuestionId = response.data.question.text + (response.data.question.isoTimeLastQuestionStarted || "")

        // If this is a different question than what we have
        if (lastQuestionIdRef.current !== newQuestionId) {
          console.log("New question detected, updating UI")
          lastQuestionIdRef.current = newQuestionId
          handleNewQuestion(response.data)
          return
        }

        // Case 3: Same question, but time has run out and we need to show results
        if (
          timeLeftRef.current === 0 &&
          !showResultsRef.current &&
          questionRef.current &&
          questionRef.current.question
        ) {
          checkForAnswers()
        }
      }
    } catch (error) {
      console.error("Game Ended or Bad Connection:", error)
      navigate(`/play/session/${sessionId}/player/${playerId}/results`)
    }
  }

  // Handle a new question without losing state
  const handleNewQuestion = (data) => {
    // Reset answer-related state for the new question
    setSelectedAnswers([])
    setShowResults(false)
    setCorrectAnswers([])
    setIsCorrect(false)
    setAnswerSubmitted(false)

    // Update the question
    setQuestion(data)

    // Calculate and set timer
    if (data.question && data.question.isoTimeLastQuestionStarted) {
      const startTime = new Date(data.question.isoTimeLastQuestionStarted)
      const currentTime = new Date()
      const elapsedSeconds = Math.floor((currentTime - startTime) / 1000)
      const duration = data.question.duration || 30
      const remaining = Math.max(0, duration - elapsedSeconds)

      setTimeLeft(remaining)

      // Start timer if there's time left
      if (remaining > 0) {
        startTimer(remaining)
      } else {
        // Time already up, check for answers
        checkForAnswers()
      }
    }
  }

  const fetchCurrentQuestion = async () => {
    try {
      setLoading(true)
      const response = await playerAPI.getQuestion(playerId)

      if (response.data && response.data.question) {
        console.log("Question fetched:", response.data.question.text)

        // Generate a question ID for tracking
        const questionId = response.data.question.text + (response.data.question.isoTimeLastQuestionStarted || "")

        lastQuestionIdRef.current = questionId
        handleNewQuestion(response.data)
      } else {
        // No question available
        setQuestion(null)

        // Check if game has ended
        checkIfGameEnded()
      }
    } catch (error) {
      console.error("Failed to fetch question", error)
      toast.error("Failed to fetch question")

      // Check if game has ended
      checkIfGameEnded()
    } finally {
      setLoading(false)
    }
  }

  const checkIfGameEnded = async () => {
    const statusResponse = await playerAPI.getStatus(playerId)
    console.log("Game status:", statusResponse.data)
    if (!statusResponse) {
      console.log("Game has ended, navigating to results")
      // Game has ended, navigate to results
      navigate(`/play/session/${sessionId}/player/${playerId}/results`)
    }
  }

  const startTimer = (seconds) => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    setTimeLeft(seconds)

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current)
          checkForAnswers()
          return 0
        }
        return prevTime - 1
      })
    }, 1000)
  }

  const checkForAnswers = async () => {
    try {
      const response = await playerAPI.getAnswer(playerId)

      if (response.data && response.data.answerIds) {
        setCorrectAnswers(response.data.answerIds)
        setShowResults(true)

        // Check if player's answer was correct
        const isCorrect = arraysEqual(selectedAnswersRef.current.sort(), response.data.answerIds.sort())
        setIsCorrect(isCorrect)
      }
    } catch (error) {
      console.error("Failed to get answer", error)
    }
  }

  const handleAnswerSelect = (answer) => {
    if (timeLeft === 0) return // Don't allow changes after time is up

    let newSelectedAnswers

    if (question.question.type === "multiple") {
      // For multiple choice, toggle the answer
      if (selectedAnswers.includes(answer)) {
        newSelectedAnswers = selectedAnswers.filter((a) => a !== answer)
      } else {
        newSelectedAnswers = [...selectedAnswers, answer]
      }
    } else {
      // For single choice or judgment, select only this answer
      newSelectedAnswers = [answer]
    }

    // Update state
    setSelectedAnswers(newSelectedAnswers)

    // Submit answer to server - even if already submitted
    submitAnswer(newSelectedAnswers)
  }

  const submitAnswer = async (answers) => {
    try {
      await playerAPI.submitAnswer(playerId, answers)
      setAnswerSubmitted(true)

      // Only show toast on first submission or when changing answer
      if (!answerSubmitted) {
        toast.success("Answer submitted!")
      } else {
        toast.info("Answer updated!")
      }
    } catch (error) {
      console.error("Failed to submit answer", error)
      toast.error("Failed to submit answer")
    }
  }

  // Helper function to compare arrays
  const arraysEqual = (a, b) => {
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false
    }
    return true
  }

  if (loading && !question) {
    return <LoadingIndicator />
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        {question && question.question ? (
          <>
            <QuestionDisplay question={question.question} timeLeft={timeLeft} />

            <AnswerOptions
              question={question.question}
              selectedAnswers={selectedAnswers}
              timeLeft={timeLeft}
              showResults={showResults}
              correctAnswers={correctAnswers}
              onAnswerSelect={handleAnswerSelect}
            />

            <AnswerFeedback
              answerSubmitted={answerSubmitted}
              showResults={showResults}
              timeLeft={timeLeft}
              isCorrect={isCorrect}
            />
          </>
        ) : (
          <WaitingScreen />
        )}
      </div>
    </div>
  )
}

export default PlayGame
