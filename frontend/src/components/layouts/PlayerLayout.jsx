import { Outlet } from "react-router-dom"

const PlayerLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-secondary-700 text-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-center">BigBrain Quiz</h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
      </main>

      <footer className="bg-gray-100 border-t">
        <div className="container mx-auto px-4 py-4 text-center text-gray-600">&copy; 2023 BigBrain Quiz App</div>
      </footer>
    </div>
  )
}

export default PlayerLayout
