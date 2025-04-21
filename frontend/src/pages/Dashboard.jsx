"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { gamesAPI } from "../services/api"
import { toast } from "react-toastify"
import { useAuth } from "../contexts/use-auth"

// Import components
import LoadingIndicator from "../components/common/loading-indicator"
import GameCard from "../components/dashboard/game-card"
import NewGameModal from "../components/dashboard/new-game-modal"
import DeleteGameModal from "../components/dashboard/delete-game-modal"
import EmptyGamesState from "../components/dashboard/empty-games-state"

const Dashboard = () => {
  const { user } = useAuth()
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNewGameModal, setShowNewGameModal] = useState(false)
  const [newGameName, setNewGameName] = useState("")
  const [creatingGame, setCreatingGame] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [gameToDelete, setGameToDelete] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    fetchGames()
  }, [])

  const fetchGames = async () => {
    try {
      setLoading(true)
      const response = await gamesAPI.getAllGames()
      setGames(response.data.games)
    } catch (error) {
      toast.error("Failed to fetch games")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateGame = async (e) => {
    e.preventDefault()
    if (!newGameName.trim()) {
      toast.error("Please enter a game name")
      return
    }
    try {
      setCreatingGame(true)
      // build your new Game object
      const newGame = {
        id: Date.now(), // must match gamesAPI.createGame's ID
        owner: user.email, // from your auth context
        name: newGameName.trim(),
        questions: [],
        AAAA: "",
        BBBB: "",
      }
      // call createGame, which does GET→append→PUT under the hood
      await gamesAPI.createGame(newGame)
      // update local state (we know createGame appended it)
      const updatedGames = [...games, newGame]
      setGames(updatedGames)
      toast.success("Game created successfully!")
      setNewGameName("")
      setShowNewGameModal(false)
    } catch (err) {
      console.error(err)
      toast.error("Failed to create game")
    } finally {
      setCreatingGame(false)
    }
  }

  const confirmDeleteGame = (game) => {
    setGameToDelete(game)
    setShowDeleteModal(true)
  }

  const handleDeleteGame = async () => {
    if (!gameToDelete) return

    try {
      await gamesAPI.deleteGame(gameToDelete.id)
      toast.success("Game deleted successfully!")

      // Remove the game from the list
      setGames(games.filter((game) => game.id !== gameToDelete.id))
      setShowDeleteModal(false)
      setGameToDelete(null)
    } catch (error) {
      toast.error("Failed to delete game")
      console.error(error)
    }
  }

  const handleStartGame = async (gameId) => {
    try {
      const response = await gamesAPI.startGame(gameId)
      const sessionId = response.data.data.sessionId

      const url = `${window.location.origin}/play?session=${sessionId}`
      navigator.clipboard.writeText(url)
      toast.success("Session link copied to clipboard")

      // update your list
      const updatedGames = games.map((g) => (g.id === gameId ? { ...g, active: sessionId } : g))
      setGames(updatedGames)
    } catch (error) {
      toast.error("Failed to start game")
      console.error(error)
    }
  }

  const handleCopySessionId = async (sessionId) => {
    const url = `${window.location.origin}/play?session=${sessionId}`
    navigator.clipboard.writeText(url)
    toast.success("Session link copied to clipboard")
  }

  const handleStopGame = async (gameId, sessionId) => {
    try {
      await gamesAPI.endGame(gameId)
      toast.success("Game stopped successfully!")

      // Update the game in the list
      const updatedGames = games.map((game) => {
        if (game.id === gameId) {
          return {
            ...game,
            active: null,
            oldSessions: [...(game.oldSessions || []), sessionId],
          }
        }
        return game
      })

      setGames(updatedGames)

      // Ask if they want to view results
      if (window.confirm("Would you like to view the results?")) {
        navigate(`/session/${sessionId}`)
      }
    } catch (error) {
      toast.error("Failed to stop game")
      console.error(error)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Game Dashboard</h1>
        <button onClick={() => setShowNewGameModal(true)} className="btn btn-primary">
          Create New Game
        </button>
      </div>

      {loading ? (
        <LoadingIndicator message="Loading games..." />
      ) : games.length === 0 ? (
        <EmptyGamesState onCreateGame={() => setShowNewGameModal(true)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onStartGame={handleStartGame}
              onStopGame={handleStopGame}
              onCopySessionId={handleCopySessionId}
              onDeleteGame={confirmDeleteGame}
            />
          ))}
        </div>
      )}

      <NewGameModal
        showModal={showNewGameModal}
        newGameName={newGameName}
        setNewGameName={setNewGameName}
        onCancel={() => setShowNewGameModal(false)}
        onSubmit={handleCreateGame}
        creatingGame={creatingGame}
      />

      <DeleteGameModal
        showModal={showDeleteModal}
        gameToDelete={gameToDelete}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteGame}
      />
    </div>
  )
}

export default Dashboard