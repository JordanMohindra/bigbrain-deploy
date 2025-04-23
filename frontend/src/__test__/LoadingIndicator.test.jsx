import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import LoadingIndicator from "../components/common/loading-indicator"

describe("LoadingIndicator Component", () => {
  // Test case 1: Rendering with default props
  it("renders with default message", () => {
    const { container } = render(<LoadingIndicator />)

    // find the spinner via its CSS class
    const spinner = container.querySelector(".animate-spin")
    expect(spinner).toBeInTheDocument()
    expect(spinner).toHaveClass("animate-spin")

    // Check if the default message is displayed
    expect(screen.getByText("Loading...")).toBeInTheDocument()
  })

  // Test case 2: Rendering with custom message
  it("renders with custom message", () => {
    const { container } = render(<LoadingIndicator message="Custom loading message" />)

    const spinner = container.querySelector(".animate-spin")
    expect(spinner).toBeInTheDocument()

    // Check if the custom message is displayed
    expect(screen.getByText("Custom loading message")).toBeInTheDocument()
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument()
  })

  // Test case 3: Checking the structure and styling
  it("has the correct structure and styling", () => {
    const { container } = render(<LoadingIndicator message="Testing structure" />)

    // Check the container structure
    const containerDiv = screen.getByText("Testing structure").parentElement
    expect(containerDiv).toHaveClass("text-center", "py-8")

    // Check the spinner styling
    const spinner = container.querySelector(".animate-spin")
    expect(spinner).toHaveClass(
      "animate-spin",
      "rounded-full",
      "h-12",
      "w-12",
      "border-t-2",
      "border-b-2",
      "border-secondary-500",
      "mx-auto"
    )

    // Check the message styling
    const message = screen.getByText("Testing structure")
    expect(message).toHaveClass("mt-2", "text-gray-600")
  })

  // Test case 4: Testing with special characters in message
  it("handles special characters in message correctly", () => {
    const specialMessage = "Loading... <script>alert('test')</script> & other symbols!"
    const { container } = render(<LoadingIndicator message={specialMessage} />)

    const spinner = container.querySelector(".animate-spin")
    expect(spinner).toBeInTheDocument()

    // Check if the message with special characters is displayed correctly
    expect(screen.getByText(specialMessage)).toBeInTheDocument()
  })
})
