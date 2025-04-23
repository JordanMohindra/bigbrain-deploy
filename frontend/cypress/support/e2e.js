/* global cy, Cypress */

Cypress.Commands.add("login", (email, password) => {
  cy.visit("/login")
  cy.get('input[type="email"]').type(email)
  cy.get('input[type="password"]').type(password)
  cy.get('button[type="submit"]').click()
  cy.contains("Dashboard").should("be.visible")
})
  
// Command to register a new user
Cypress.Commands.add("register", (name, email, password) => {
  cy.visit("/register")
  cy.get('input[name="name"]').type(name)
  cy.get('input[name="email"]').type(email)
  cy.get('input[name="password"]').type(password)
  cy.get('input[name="confirm-password"]').type(password)
  cy.get('button[type="submit"]').click()
  cy.contains("Dashboard").should("be.visible")
})
  
// Command to create a new game
Cypress.Commands.add("createGame", (gameName) => {
  cy.visit("/dashboard")
  cy.contains("Create New Game").click()
  cy.get('.modal, [role="dialog"]').should("be.visible")
  cy.get("input#game-name").type(gameName)
  cy.contains("button", "Create Game").click()
  cy.contains(gameName).should("be.visible")
})
  
// Command to handle confirmation dialogs
Cypress.Commands.add("confirmDialog", (accept = true) => {
  cy.on("window:confirm", () => accept)
})
  
// Command to wait for API response
Cypress.Commands.add("waitForApi", (route) => {
  cy.intercept(route).as("apiCall")
  cy.wait("@apiCall")
})
  
