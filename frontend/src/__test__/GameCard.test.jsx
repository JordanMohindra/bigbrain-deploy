import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { BrowserRouter } from "react-router-dom"
import GameCard from "../components/dashboard/game-card"

// Mock functions for the component props
const mockStartGame = vi.fn()
const mockStopGame = vi.fn()
const mockCopySessionId = vi.fn()
const mockDeleteGame = vi.fn()

// Helper function to render the component with router context
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>)
}

describe("GameCard Component", () => {
  // Test case 1: Rendering an inactive game
  it("renders an inactive game correctly", () => {
    const inactiveGame = {
      id: "123",
      name: "Test Game",
      questions: [{ text: "Question 1" }, { text: "Question 2" }],
      active: null,
      thumbnail: "https://example.com/image.jpg",
    }

    renderWithRouter(
      <GameCard
        game={inactiveGame}
        onStartGame={mockStartGame}
        onStopGame={mockStopGame}
        onCopySessionId={mockCopySessionId}
        onDeleteGame={mockDeleteGame}
      />,
    )

    // Check if game name is displayed
    expect(screen.getByText("Test Game")).toBeInTheDocument()

    // Check if question count is displayed
    expect(screen.getByText("2 questions")).toBeInTheDocument()

    // Check if status is displayed
    expect(screen.getByText("Inactive")).toBeInTheDocument()

    // Check if the correct buttons are displayed for inactive game
    expect(screen.getByText("Edit")).toBeInTheDocument()
    expect(screen.getByText("Start Game")).toBeInTheDocument()
    expect(screen.getByText("Delete")).toBeInTheDocument()

    // Verify that active game buttons are not displayed
    expect(screen.queryByText("Stop Game")).not.toBeInTheDocument()
    expect(screen.queryByText("View Session")).not.toBeInTheDocument()
  })

  // Test case 2: Rendering an active game
  it("renders an active game correctly", () => {
    const activeGame = {
      id: "123",
      name: "Active Game",
      questions: [{ text: "Question 1" }],
      active: "session-456",
      thumbnail: null, // Testing with no thumbnail
    }

    renderWithRouter(
      <GameCard
        game={activeGame}
        onStartGame={mockStartGame}
        onStopGame={mockStopGame}
        onCopySessionId={mockCopySessionId}
        onDeleteGame={mockDeleteGame}
      />,
    )

    // Check if game name is displayed
    expect(screen.getByText("Active Game")).toBeInTheDocument()

    // Check if question count is displayed
    expect(screen.getByText("1 questions")).toBeInTheDocument()

    // Check if status is displayed
    expect(screen.getByText("Active")).toBeInTheDocument()

    // Check if the correct buttons are displayed for active game
    expect(screen.getByText("Edit")).toBeInTheDocument()
    expect(screen.getByText("Stop Game")).toBeInTheDocument()
    expect(screen.getByText("View Session")).toBeInTheDocument()
    expect(screen.getByText("ID: session-456")).toBeInTheDocument()

    // Verify that inactive game buttons are not displayed
    expect(screen.queryByText("Start Game")).not.toBeInTheDocument()
    expect(screen.queryByText("Delete")).not.toBeInTheDocument()

    // Check if "No thumbnail" is displayed when thumbnail is null
    expect(screen.getByText("No thumbnail")).toBeInTheDocument()
  })

  // Test case 3: Testing button interactions
  it("calls the correct functions when buttons are clicked", async () => {
    const testGame = {
      id: "123",
      name: "Test Game",
      questions: [{ text: "Question 1" }],
      active: null,
      thumbnail: "https://example.com/image.jpg",
    }

    renderWithRouter(
      <GameCard
        game={testGame}
        onStartGame={mockStartGame}
        onStopGame={mockStopGame}
        onCopySessionId={mockCopySessionId}
        onDeleteGame={mockDeleteGame}
      />,
    )

    // Click the Start Game button
    await fireEvent.click(screen.getByText("Start Game"))
    expect(mockStartGame).toHaveBeenCalledWith("123")

    // Click the Delete button
    await fireEvent.click(screen.getByText("Delete"))
    expect(mockDeleteGame).toHaveBeenCalledWith(testGame)
  })

  // Test case 4: Testing active game button interactions
  it("calls the correct functions when active game buttons are clicked", async () => {
    const activeGame = {
      id: "123",
      name: "Active Game",
      questions: [{ text: "Question 1" }],
      active: "session-456",
      thumbnail: "https://example.com/image.jpg",
    }

    renderWithRouter(
      <GameCard
        game={activeGame}
        onStartGame={mockStartGame}
        onStopGame={mockStopGame}
        onCopySessionId={mockCopySessionId}
        onDeleteGame={mockDeleteGame}
      />,
    )

    // Click the Stop Game button
    await fireEvent.click(screen.getByText("Stop Game"))
    expect(mockStopGame).toHaveBeenCalledWith("123", "session-456")

    // Click the Copy Session ID button
    await fireEvent.click(screen.getByText("ID: session-456"))
    expect(mockCopySessionId).toHaveBeenCalledWith("session-456")
  })
})
