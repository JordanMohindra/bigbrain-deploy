"use client"

const SessionHeader = ({ isSessionActive, copySessionLink, handleEndSession }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold">Game Session</h1>
      </div>
      <div className="flex gap-2">
        {isSessionActive && (
          <>
            <button onClick={copySessionLink} className="btn btn-outline">
              Copy Join Link
            </button>
            <button onClick={handleEndSession} className="btn btn-danger">
              End Session
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default SessionHeader
