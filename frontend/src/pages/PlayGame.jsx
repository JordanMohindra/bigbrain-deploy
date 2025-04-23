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
