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

  // Test case 3: Rendering with judgment question
  it("renders a judgment question form correctly", () => {
    const judgmentQuestion = {
      text: "The Earth is flat.",
      type: "judgment",
      duration: 15,
      points: 5,
      media: "",
      answers: [{ text: "False", isCorrect: true }],
    }

    render(
      <QuestionForm
        question={judgmentQuestion}
        setQuestion={mockSetQuestion}
        onAddAnswer={mockAddAnswer}
        onRemoveAnswer={mockRemoveAnswer}
        onAnswerChange={mockAnswerChange}
        onQuestionTypeChange={mockQuestionTypeChange}
      />,
    )

    // Check if question text is displayed
    expect(screen.getByDisplayValue("The Earth is flat.")).toBeInTheDocument()

    // Check if judgment radio is selected
    const judgmentRadio = screen.getByLabelText("Judgment")
    expect(judgmentRadio).toBeChecked()

    // Check if duration and points are displayed correctly
    expect(screen.getByDisplayValue("15")).toBeInTheDocument()
    expect(screen.getByDisplayValue("5")).toBeInTheDocument()

    // Check if answer is displayed correctly
    expect(screen.getByDisplayValue("False")).toBeInTheDocument()

    // Check if the correct answer is selected
    const answerInput = screen.getByRole("radio", { name: "" })
    expect(answerInput).toBeChecked()

    // Check if the help text is displayed
    expect(screen.getByText("Set whether the statement is true or false")).toBeInTheDocument()

    // For judgment questions, there should be no "Add Answer" button
    expect(screen.queryByText("+ Add Answer")).not.toBeInTheDocument()
  })

  // Test case 4: Testing user interactions - changing question type
  it("calls onQuestionTypeChange when question type is changed", async () => {
    const question = {
      text: "Test Question",
      type: "single",
      duration: 30,
      points: 10,
      media: "",
      answers: [
        { text: "Answer 1", isCorrect: true },
        { text: "Answer 2", isCorrect: false },
      ],
    }

    render(
      <QuestionForm
        question={question}
        setQuestion={mockSetQuestion}
        onAddAnswer={mockAddAnswer}
        onRemoveAnswer={mockRemoveAnswer}
        onAnswerChange={mockAnswerChange}
        onQuestionTypeChange={mockQuestionTypeChange}
      />,
    )

    // Change question type to multiple choice
    await fireEvent.click(screen.getByLabelText("Multiple Choice"))
    expect(mockQuestionTypeChange).toHaveBeenCalledWith("multiple")

    // Change question type to judgment
    await fireEvent.click(screen.getByLabelText("Judgment"))
    expect(mockQuestionTypeChange).toHaveBeenCalledWith("judgment")
  })

  // Test case 5: Testing user interactions - changing question text and other fields
  it("calls setQuestion when question fields are changed", async () => {
    const question = {
      text: "Original Question",
      type: "single",
      duration: 30,
      points: 10,
      media: "",
      answers: [
        { text: "Answer 1", isCorrect: true },
        { text: "Answer 2", isCorrect: false },
      ],
    }

    render(
      <QuestionForm
        question={question}
        setQuestion={mockSetQuestion}
        onAddAnswer={mockAddAnswer}
        onRemoveAnswer={mockRemoveAnswer}
        onAnswerChange={mockAnswerChange}
        onQuestionTypeChange={mockQuestionTypeChange}
      />,
    )

    // Change question text
    const questionTextInput = screen.getByDisplayValue("Original Question")
    await fireEvent.change(questionTextInput, { target: { value: "Updated Question" } })
    expect(mockSetQuestion).toHaveBeenCalledWith({
      ...question,
      text: "Updated Question",
    })

    // Change duration
    const durationInput = screen.getByDisplayValue("30")
    await fireEvent.change(durationInput, { target: { value: "45" } })
    expect(mockSetQuestion).toHaveBeenCalledWith({
      ...question,
      duration: "45",
    })

    // Change points
    const pointsInput = screen.getByDisplayValue("10")
    await fireEvent.change(pointsInput, { target: { value: "20" } })
    expect(mockSetQuestion).toHaveBeenCalledWith({
      ...question,
      points: "20",
    })

    // Change media URL
    const mediaInput = screen.getByPlaceholderText("Enter YouTube URL or image URL")
    await fireEvent.change(mediaInput, { target: { value: "https://example.com/image.jpg" } })
    expect(mockSetQuestion).toHaveBeenCalledWith({
      ...question,
      media: "https://example.com/image.jpg",
    })
  })

  // Test case 6: Testing answer interactions
  it("calls the correct functions when interacting with answers", async () => {
    const question = {
      text: "Test Question",
      type: "multiple",
      duration: 30,
      points: 10,
      media: "",
      answers: [
        { text: "Answer 1", isCorrect: true },
        { text: "Answer 2", isCorrect: false },
        { text: "Answer 3", isCorrect: false },
      ],
    }

    render(
      <QuestionForm
        question={question}
        setQuestion={mockSetQuestion}
        onAddAnswer={mockAddAnswer}
        onRemoveAnswer={mockRemoveAnswer}
        onAnswerChange={mockAnswerChange}
        onQuestionTypeChange={mockQuestionTypeChange}
      />,
    )

    // Click "Add Answer" button
    await fireEvent.click(screen.getByText("+ Add Answer"))
    expect(mockAddAnswer).toHaveBeenCalled()

    // Change an answer text
    const answerInputs = screen.getAllByPlaceholderText(/Answer \d/)
    await fireEvent.change(answerInputs[1], { target: { value: "New Answer Text" } })
    expect(mockAnswerChange).toHaveBeenCalledWith(1, "text", "New Answer Text")

    // Toggle an answer's correctness
    const checkboxes = screen.getAllByRole("checkbox")
    await fireEvent.click(checkboxes[1]) // Click the second checkbox
    expect(mockAnswerChange).toHaveBeenCalledWith(1, "isCorrect", true)

    // Click "Remove" button for an answer
    const removeButtons = screen.getAllByText("Remove")
    await fireEvent.click(removeButtons[1]) // Remove the second answer
    expect(mockRemoveAnswer).toHaveBeenCalledWith(1)
  })
})
