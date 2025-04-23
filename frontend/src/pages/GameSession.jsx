"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useParams } from "react-router-dom"
import { gamesAPI } from "../services/api"
import { toast } from "react-toastify"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"

// Import components
import LoadingIndicator from "../components/common/loading-indicator"
import SessionNotFound from "../components/session/session-not-found"
import SessionHeader from "../components/session/session-header"
import SessionInfo from "../components/session/session-info"
import CurrentQuestion from "../components/session/current-question"
import PlayersList from "../components/session/players-list"
import SessionSummary from "../components/session/session-summary"
import TopPlayers from "../components/session/top-players"
import AllPlayers from "../components/session/all-players"
import StatisticsCharts from "../components/session/statistics-charts"
import ResultsConfirmationModal from "../components/session/view-results-modal"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const GameSession = () => {
  const { sessionId } = useParams()

  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)

  // Update gameId state to check localStorage first
  const [gameId, setGameId] = useState(() => {
    const savedGameId = localStorage.getItem(`session_gameId_${sessionId}`)
    return savedGameId || null
  })

  // Add this line instead:
  const pollingRef = useRef(null)

  // Update the useState for results to check localStorage first
  const [results, setResults] = useState(() => {
    const savedResults = localStorage.getItem(`session_results_${sessionId}`)
    return savedResults ? JSON.parse(savedResults) : []
  })

  // Update the useState for correctPercentages to check localStorage first
  const [correctPercentages, setCorrectPercentages] = useState(() => {
    const savedPercentages = localStorage.getItem(`session_percentages_${sessionId}`)
    return savedPercentages ? JSON.parse(savedPercentages) : []
  })

  // Update the useState for averageTimes to check localStorage first
  const [averageTimes, setAverageTimes] = useState(() => {
    const savedTimes = localStorage.getItem(`session_times_${sessionId}`)
    return savedTimes ? JSON.parse(savedTimes) : []
  })

  // Results state
  const [resultsLoading, setResultsLoading] = useState(false)

  // Add state for the results confirmation modal
  const [showResultsModal, setShowResultsModal] = useState(false)

  // Modify the setResults function to also save to localStorage
  const updateResults = (newResults) => {
    setResults(newResults)
    localStorage.setItem(`session_results_${sessionId}`, JSON.stringify(newResults))
  }

  // Modify the fetchSessionResults function to use the new updateResults function
  const fetchSessionResults = async () => {
    try {
      setResultsLoading(true)
      const response = await gamesAPI.getSessionResults(sessionId)
      // Correctly access the results array from the response
      const resultsData = response.data.results || []
      updateResults(resultsData)

      // Calculate statistics if we have results and session data
      if (resultsData.length > 0 && session && session.questions?.length > 0) {
        calculateStats(resultsData, session.questions?.length)
      }
    } catch (error) {
      console.error("Failed to fetch session results", error)
      updateResults([])
    } finally {
      setResultsLoading(false)
    }
  }

  // Update the calculateStats function to save to localStorage
  const calculateStats = (results, _numQuestions) => {
    if (!Array.isArray(results) || results.length === 0) {
      setCorrectPercentages([])
      setAverageTimes([])
      localStorage.removeItem(`session_percentages_${sessionId}`)
      localStorage.removeItem(`session_times_${sessionId}`)
      return
    }

    // Calculate percentage of correct answers for each question
    const newCorrectPercentages = []
    const newAverageTimes = []

    for (let i = 0; i < (results[0]?.answers?.length || 0); i++) {
      let correctCount = 0
      let totalResponseTime = 0
      let responseCount = 0

      results.forEach((player) => {
        if (player.answers && player.answers[i]) {
          if (player.answers[i].correct) {
            correctCount++
          }

          if (player.answers[i].answeredAt && player.answers[i].questionStartedAt) {
            const startTime = new Date(player.answers[i].questionStartedAt).getTime()
            const answerTime = new Date(player.answers[i].answeredAt).getTime()
            const responseTime = (answerTime - startTime) / 1000 // in seconds

            totalResponseTime += responseTime
            responseCount++
          }
        }
      })

      const percentage = results.length > 0 ? (correctCount / results.length) * 100 : 0
      newCorrectPercentages.push(percentage)

      const avgTime = responseCount > 0 ? totalResponseTime / responseCount : 0
      newAverageTimes.push(avgTime)
    }

    setCorrectPercentages(newCorrectPercentages)
    setAverageTimes(newAverageTimes)

    // Save to localStorage
    localStorage.setItem(`session_percentages_${sessionId}`, JSON.stringify(newCorrectPercentages))
    localStorage.setItem(`session_times_${sessionId}`, JSON.stringify(newAverageTimes))
  }

  // Update fetchSessionStatus to save session data to localStorage
  const fetchSessionStatus = useCallback(async () => {
    try {
      const response = await gamesAPI.getSessionStatus(sessionId)
      setSession(response.data.results)

      // Save session data to localStorage
      localStorage.setItem(`session_data_${sessionId}`, JSON.stringify(response.data.results))

      // Find the game ID if we don't have it yet
      if (!gameId) {
        const gamesResponse = await gamesAPI.getAllGames()
        const game = gamesResponse.data.games.find((g) => g.active === Number.parseInt(sessionId))
        if (game) {
          setGameId(game.id)
          // Save game ID to localStorage
          localStorage.setItem(`session_gameId_${sessionId}`, game.id)
        }
      }

      // If session is not active, fetch results
      if (!response.data.results.active) {
        if (pollingRef.current) {
          clearInterval(pollingRef.current)
          pollingRef.current = null
        }
        fetchSessionResults()
      }
    } catch (error) {
      console.error("Failed to fetch session status", error)
      toast.error("Failed to fetch session status")
    }
  }, [sessionId, gameId])

  