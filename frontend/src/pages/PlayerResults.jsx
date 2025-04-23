"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { playerAPI } from "../services/api"
import { toast } from "react-toastify"

const PlayerResults = () => {
  const { playerId } = useParams()

  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState([])
  const [totalScore, setTotalScore] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)

  useEffect(() => {
    fetchResults()
  }, [playerId])

  const fetchResults = async () => {
    try {
      setLoading(true)
      const response = await playerAPI.getResults(playerId)
      setResults(response.data)
      console.log("Results:", response.data)

      // Calculate total score
      const score = response.data.reduce((sum, result) => sum + (result.correct ? 1 : 0), 0)
      setTotalScore(score)
      setTotalQuestions(response.data.length)
    } catch (error) {
      console.error("Failed to fetch results", error)
      toast.error("Failed to fetch results")
    } finally {
      setLoading(false)
    }
  }

  // Calculate average response time
  const calculateAverageTime = () => {
    if (results.length === 0) return 0

    let totalTime = 0
    let count = 0

    results.forEach((result) => {
      if (result.answeredAt && result.questionStartedAt) {
        const startTime = new Date(result.questionStartedAt).getTime()
        const answerTime = new Date(result.answeredAt).getTime()
        const responseTime = (answerTime - startTime) / 1000 // in seconds

        totalTime += responseTime
        count++
      }
    })

    return count > 0 ? (totalTime / count).toFixed(1) : 0
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary-500 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading results...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-secondary-700">Your Results</h1>
        <p className="text-gray-600 mt-2">See how you performed in the quiz</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="text-center mb-6">
          <div className="text-5xl font-bold text-secondary-600 mb-2">
            {totalScore} / {totalQuestions}
          </div>
          <p className="text-gray-600">
            You got {totalScore} out of {totalQuestions} questions correct!
          </p>
          <div className="mt-4 h-4 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-secondary-500" style={{ width: `${(totalScore / totalQuestions) * 100}%` }}></div>
          </div>
          <p className="mt-2 text-sm text-gray-500">{((totalScore / totalQuestions) * 100).toFixed(1)}% correct</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-1">Average Response Time</h3>
            <p className="text-2xl font-bold text-secondary-600">{calculateAverageTime()}s</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-1">Questions Answered</h3>
            <p className="text-2xl font-bold text-secondary-600">
              {results.filter((r) => r.answeredAt).length} / {totalQuestions}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Question Breakdown</h2>

        {results.length > 0 ? (
          <div className="space-y-4">
            {results.map((result, index) => {
              // Calculate response time
              let responseTime = null
              if (result.answeredAt && result.questionStartedAt) {
                const startTime = new Date(result.questionStartedAt).getTime()
                const answerTime = new Date(result.answeredAt).getTime()
                responseTime = ((answerTime - startTime) / 1000).toFixed(1) // in seconds
              }

              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    result.correct ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Question {index + 1}</h3>
                      <div className="mt-1 text-sm">
                        {result.answeredAt ? (
                          <div className="flex items-center">
                            <span className={result.correct ? "text-green-600" : "text-red-600"}>
                              {result.correct ? "Correct" : "Incorrect"}
                            </span>
                            {responseTime && (
                              <span className="ml-2 text-gray-500">• Response time: {responseTime}s</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500">Not answered</span>
                        )}
                      </div>
                    </div>
                    <div className={`text-lg font-bold ${result.correct ? "text-green-600" : "text-red-600"}`}>
                      {result.correct ? "+1" : "0"} points
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500">No question data available.</p>
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        <Link to="/play" className="btn bg-secondary-600 hover:bg-secondary-700 text-white">
          Play Another Quiz
        </Link>
      </div>
    </div>
  )
}

export default PlayerResults
