const WaitingScreen = () => {
  return (
    <div className="text-center py-8">
      <h2 className="text-xl font-bold text-gray-700 mb-2">Waiting for the next question</h2>
      <p className="text-gray-500">The host will advance to the next question soon.</p>
      <div className="mt-4">
        <div className="animate-pulse flex space-x-4 justify-center">
          <div className="h-3 w-3 bg-secondary-500 rounded-full"></div>
          <div className="h-3 w-3 bg-secondary-500 rounded-full"></div>
          <div className="h-3 w-3 bg-secondary-500 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}

export default WaitingScreen
