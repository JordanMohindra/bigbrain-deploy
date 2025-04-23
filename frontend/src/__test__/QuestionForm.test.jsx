import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import QuestionForm from "../components/game/question-form"

// Mock functions for the component props
const mockSetQuestion = vi.fn()
const mockAddAnswer = vi.fn()
const mockRemoveAnswer = vi.fn()
const mockAnswerChange = vi.fn()
const mockQuestionTypeChange = vi.fn()

describe("QuestionForm Component", () => {
  // Reset mocks before each test
  beforeEach(() => {
    vi.resetAllMocks()
  })

  // Test case 1: Rendering with single choice question
  it("renders a single choice question form correctly", () => {
    const singleChoiceQuestion = {
      text: "What is the capital of France?",
      type: "single",
      duration: 30,
      points: 10,
      media: "",
      answers: [
        { text: "Paris", isCorrect: true },
        { text: "London", isCorrect: false },
        { text: "Berlin", isCorrect: false },
      ],
    }

    render(
      <QuestionForm
        question={singleChoiceQuestion}
        setQuestion={mockSetQuestion}
        onAddAnswer={mockAddAnswer}
        onRemoveAnswer={mockRemoveAnswer}
        onAnswerChange={mockAnswerChange}
        onQuestionTypeChange={mockQuestionTypeChange}
      />,
    )

    // Check if question text is displayed
    expect(screen.getByDisplayValue("What is the capital of France?")).toBeInTheDocument()

    // Check if single choice radio is selected
    const singleChoiceRadio = screen.getByLabelText("Single Choice")
    expect(singleChoiceRadio).toBeChecked()

    // Check if duration and points are displayed correctly
    expect(screen.getByDisplayValue("30")).toBeInTheDocument()
    expect(screen.getByDisplayValue("10")).toBeInTheDocument()

    // Check if answers are displayed correctly
    expect(screen.getByDisplayValue("Paris")).toBeInTheDocument()
    expect(screen.getByDisplayValue("London")).toBeInTheDocument()
    expect(screen.getByDisplayValue("Berlin")).toBeInTheDocument()

    // Check if the correct answer is selected
    const answerInputs = screen.getAllByRole("radio")
    expect(answerInputs[0]).toBeChecked() // Paris should be checked
    expect(answerInputs[1]).not.toBeChecked() // London should not be checked
    expect(answerInputs[2]).not.toBeChecked() // Berlin should not be checked

    // Check if the help text is displayed
    expect(screen.getByText("Select one correct answer")).toBeInTheDocument()
  })

  // Test case 2: Rendering with multiple choice question
  it("renders a multiple choice question form correctly", () => {
    const multipleChoiceQuestion = {
      text: "Which of these are planets?",
      type: "multiple",
      duration: 45,
      points: 20,
      media: "https://example.com/planets.jpg",
      answers: [
        { text: "Earth", isCorrect: true },
        { text: "Jupiter", isCorrect: true },
        { text: "Sun", isCorrect: false },
        { text: "Moon", isCorrect: false },
      ],
    }

    render(
      <QuestionForm
        question={multipleChoiceQuestion}
        setQuestion={mockSetQuestion}
        onAddAnswer={mockAddAnswer}
        onRemoveAnswer={mockRemoveAnswer}
        onAnswerChange={mockAnswerChange}
        onQuestionTypeChange={mockQuestionTypeChange}
      />,
    )

    // Check if question text is displayed
    expect(screen.getByDisplayValue("Which of these are planets?")).toBeInTheDocument()

    // Check if multiple choice radio is selected
    const multipleChoiceRadio = screen.getByLabelText("Multiple Choice")
    expect(multipleChoiceRadio).toBeChecked()

    // Check if duration and points are displayed correctly
    expect(screen.getByDisplayValue("45")).toBeInTheDocument()
    expect(screen.getByDisplayValue("20")).toBeInTheDocument()

    // Check if media URL is displayed
    expect(screen.getByDisplayValue("https://example.com/planets.jpg")).toBeInTheDocument()

    // Check if answers are displayed correctly
    expect(screen.getByDisplayValue("Earth")).toBeInTheDocument()
    expect(screen.getByDisplayValue("Jupiter")).toBeInTheDocument()
    expect(screen.getByDisplayValue("Sun")).toBeInTheDocument()
    expect(screen.getByDisplayValue("Moon")).toBeInTheDocument()

    // Check if the correct answers are selected (checkboxes for multiple choice)
    const checkboxes = screen.getAllByRole("checkbox")
    expect(checkboxes[0]).toBeChecked() // Earth should be checked
    expect(checkboxes[1]).toBeChecked() // Jupiter should be checked
    expect(checkboxes[2]).not.toBeChecked() // Sun should not be checked
    expect(checkboxes[3]).not.toBeChecked() // Moon should not be checked

    // Check if the help text is displayed
    expect(screen.getByText("Select all correct answers")).toBeInTheDocument()
  })

  