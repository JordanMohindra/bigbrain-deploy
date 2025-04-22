const LoadingIndicator = ({ message = "Loading..." }) => {
  return (
    <div className="text-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary-500 mx-auto"></div>
      <p className="mt-2 text-gray-600">{message}</p>
    </div>
  )
}

export default LoadingIndicator
