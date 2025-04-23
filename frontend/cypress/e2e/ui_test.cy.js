/* global describe, it, cy */


// Admin Happy Path UI Test
// This test covers the complete journey of an admin user through the application

describe("Admin User Happy Path", () => {
  // Generate a unique email for testing to avoid conflicts with existing users
  const testEmail = `test-admin-${Date.now()}@example.com`
  const testPassword = "Password123!"
  const testName = "Test Admin"
  const gameName = "Test Quiz Game"
  const updatedGameName = "Updated Quiz Game"

  let sessionId


  it("should register a new admin user successfully", () => {
    // Visit the registration page
    cy.visit("/register")

    // Fill out the registration form
    cy.get('input[name="name"]').type(testName)
    cy.get('input[name="email"]').type(testEmail)
    cy.get('input[name="password"]').type(testPassword)
    cy.get('input[name="confirm-password"]').type(testPassword)

    // Submit the form
    cy.get('button[type="submit"]').click()

    // Verify welcome message or user name is displayed
    cy.contains("Dashboard").should("be.visible")
  })

  it("should create a new game successfully", () => {
    cy.login(testEmail, testPassword);
    // Click the "Create New Game" button
    cy.contains("Create New Game").click()

    // Verify the modal is displayed
    cy.get("input#game-name").should("be.visible")

    // Fill out the game name
    cy.get("input#game-name").type(gameName)

    // Submit the form
    cy.get('button[type="submit"]').click()

    // Verify the game was created by checking for its name on the dashboard
    cy.contains(gameName).should("be.visible")

    // Store the game ID for later use (extract from URL when clicking Edit)
    cy.contains(gameName).parents(".bg-white").find("a").contains("Edit").click()

  })

  it("should update the game thumbnail and name successfully", () => {
    cy.login(testEmail, testPassword);

    // Navigate to the edit game page
    cy.contains('Edit').click()

    // Update the game name
    cy.get("input#game-name").clear().type(updatedGameName)

    // Save the game
    cy.contains("button", "Save Game").click()

    // Verify the updated game name is visible
    cy.contains(updatedGameName).should("be.visible")
  })

  it("should start a game successfully", () => {
    cy.login(testEmail, testPassword);

    // Find the game and click "Start Game"
    cy.contains('Start Game').click()

    // Verify the game status changed to active
    cy.contains(updatedGameName || gameName)
      .parents(".bg-white")
      .contains("Active")
      .should("be.visible")

    // Verify "Stop Game" button is now visible
    cy.contains(updatedGameName || gameName)
      .parents(".bg-white")
      .find("button")
      .contains("Stop Game")
      .should("be.visible")

    // Store the session ID for later use
    cy.contains(updatedGameName || gameName)
      .parents(".bg-white")
      .contains("ID:")
      .invoke("text")
      .then((text) => {
        sessionId = text.replace("ID: ", "").trim()
      })
  })

  it("should end a game successfully", () => {
    cy.login(testEmail, testPassword);

    // Find the game and click "Stop Game"
    cy.contains(updatedGameName || gameName)
      .parents(".bg-white")
      .find("button")
      .contains("Stop Game")
      .click()

    // Handle the confirmation dialog
    cy.on("window:confirm", () => true)

    // Handle the results confirmation dialog
    cy.on("window:confirm", () => false) // Don't navigate to results yet

    // Verify the game status changed to inactive
    cy.contains(updatedGameName || gameName)
      .parents(".bg-white")
      .contains("Inactive")
      .should("be.visible")

    // Verify "Start Game" button is now visible again
    cy.contains(updatedGameName || gameName)
      .parents(".bg-white")
      .find("button")
      .contains("Start Game")
      .should("be.visible")
  })

  it("should load the results page successfully", () => {
    cy.login(testEmail, testPassword);
    // Skip this test if sessionId is not available
    if (!sessionId) {
      cy.log("Getting sessionId from localStorage")
      // Try to get the session ID from localStorage if it wasn't captured earlier
      cy.window().then((win) => {
        // Look for session ID in localStorage (adjust key as needed)
        const keys = Object.keys(win.localStorage)
        const sessionKey = keys.find((key) => key.includes("session_") && key.includes("gameId"))
        if (sessionKey) {
          sessionId = win.localStorage.getItem(sessionKey)
        }
      })
    }

    // Visit the session results page
    cy.visit(`/session/${sessionId}`)

    // Verify the results page loaded successfully
    cy.contains("Session Summary").should("be.visible")

    // Verify that the session status shows as "Ended"
    cy.contains("Status:").parent().contains("Ended").should("be.visible")
  })

