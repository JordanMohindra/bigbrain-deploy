const SessionInfo = ({ sessionId, session }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Session Info</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Session ID:</span>
          <span className="font-medium">{sessionId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Status:</span>
          <span className="font-medium">{session.active ? "Active" : "Ended"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Current Question:</span>
          <span className="font-medium">
            {session.position < 0 ? "Not started" : `${session.position + 1} of ${session.questions?.length || 0}`}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Players:</span>
          <span className="font-medium">{session.players?.length || 0}</span>
        </div>
      </div>
    </div>
  )
}

export default SessionInfo
