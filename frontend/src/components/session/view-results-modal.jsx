"use client"

import { useNavigate } from "react-router-dom"

const ResultsConfirmationModal = ({ isOpen, onClose, onViewResults }) => {
  const navigate = useNavigate()

  if (!isOpen) return null

  const handleViewResults = () => {
    onViewResults()
    onClose()
  }

  const handleGoHome = () => {
    onClose()
    navigate("/")
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Session Ended</h2>
        <p className="mb-6">Would you like to view the results?</p>

        <div className="flex justify-end gap-2">
          <button onClick={handleGoHome} className="btn btn-outline">
            No, Go Home
          </button>
          <button onClick={handleViewResults} className="btn btn-primary">
            Yes, View Results
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResultsConfirmationModal
