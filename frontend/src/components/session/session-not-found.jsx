import { Link } from "react-router-dom"

const SessionNotFound = () => {
  return (
    <div className="text-center py-8">
      <h2 className="text-2xl font-bold text-gray-700 mb-2">Session Not Found</h2>
      <p className="text-gray-500 mb-4">The session you’re looking for doesn’t exist or has ended.</p>
      <Link to="/" className="btn btn-primary">
        Return to Dashboard
      </Link>
    </div>
  )
}

export default SessionNotFound
