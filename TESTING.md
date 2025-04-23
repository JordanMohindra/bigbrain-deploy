The testing thoroughly validates the behavior and UI of key components in the application, including GameCard, LoadingIndicator, and QuestionForm.

For GameCard, tests verify correct rendering for both active and inactive game states, ensuring the right buttons and status texts appear based on the game’s state, and also check that button interactions correctly trigger the provided event handlers.

The LoadingIndicator tests ensure proper rendering with default and custom messages, verify structural and styling details, and handle special characters safely.

For QuestionForm, tests cover different question types (single choice, multiple choice, judgment), validate correct form field population, and simulate user interactions like changing question fields, selecting correct answers, and managing answer lists, confirming that the appropriate callback functions are called.

Not only this, but the UI testing uses Cypress to mimic a user going through a typical cycle of use, to ensure correct functionility of these systems together.

In addition to automated testing, I manually tested the application on the frontend by opening multiple browser windows to simulate different players and sessions. I verified real-time updates by joining the same session from separate windows, ensuring that question transitions, answer selections, and game status changes (like game start and end) reflected correctly across all views. I also tested the behavior of active and inactive games by starting and stopping games in one window and observing immediate updates in the others. This manual testing helped confirm that the polling logic, answer submissions, session ID handling, and navigation flows worked reliably in real-world multi-user scenarios.