# Feature Test Plan: User Authentication

---

## 1. Feature Component Overview

The User Authentication module manages secure user sessions, controls access to private routes (Account Profile and Settings), and ensures user data - such as saved shopping basket states — persists across sessions. This document outlines the technical requirements, boundaries, and test coverage implemented across our manual scenarios, E2E Playwright suite, and API integration tests.

---

## 2. Behavioral Specifications (The Rules)

### 2.1 Identity Verification (Username/Email)

- **Input Matching:** The email input field must accept the exact, valid email address associated with a registered user account.
- **Case Insensitivity:** Email authentication must be case-insensitive (e.g., `User@Email.com` and `user@email.com` must both be recognized as the same account).

### 2.2 Credential Validation (Password)

- **Character Sensitivity:** The password field must remain strictly case-sensitive and match the exact string criteria established during account registration.
- **Masked Input:** To protect user privacy, characters entered into the password field must be masked by default (`type="password"`).

### 2.3 Form Submission, Interaction Triggers and Error Handling

- **Submission Engagement:** The "Login" button remains enabled at all times, regardless of whether the input fields are populated.
- **Execution Actions:** The authentication process is triggered by clicking the **Login button**.
- **Authentication Failure:** If the input fields are left blank, or if the provided credentials do not match an active record, the system must block redirection and display the following inline alert text:
  > `Warning: No match for E-Mail Address and/or Password.`
- **Post-Authentication Routing:** The application must redirect the browser to the `/account` page only upon receiving a successful `HTTP 200` response from the authentication endpoint.

### 2.4 Account State & Basket Persistence

- **Profile State Synchronization:** Upon successful authentication, the application must fetch and restore the user's specific account configurations—including contact information, preferences, and saved addresses — exactly as they were left at the end of the previous authenticated session.
- **Persistent Basket Restoration:** The shopping basket must synchronize automatically with the authenticated user's server-side record.
  - **Additions:** Any products added during a previous session must be present in the cart layout.
  - **Deletions:** Any products removed during a previous session must be absent from the layout.
  - **Quantities:** Product counts must match the exact numerical state saved prior to the last logout or session termination.

## 3. Browser-Specific Behavior Notes (Out of Scope for Testing)

The following behaviors are governed entirely by local browser engine configurations and user settings, and are explicitly excluded from the testing scope:

- **Native Credential Management:** The appearance, positioning, and behavior of native browser prompts offering to save, update, or auto-fill emails and passwords.

---

## 4. Manual Test Suite

| Test ID         | Description                                               | Preconditions                                                                                                                                        | Test Steps                                                                                                                                                                                                                                                                                                                | Expected Result                                                                                                                                                                                         | Test Type       |
| :-------------- | :-------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :-------------- |
| **TC_AUTH_001** | Verify successful authentication using valid credentials. | User is on the application Home Page.                                                                                                                | 1. Click the **My Account** dropdown menu located in the page header.<br> 2. Select the **Login** option from the dropdown menu list.<br>3.Enter a valid, registered email address into the **Email** input field.<br>4. Enter the matching password into the **Password** input field.<br>5. Click the **Login** button. | 1. Browser successfully redirects to the `/account page`.<br>2. Server responds with an `HTTP 200` status.<br>                                                                                          | Smoke test      |
| **TC_AUTH_002** | Verify authentication failure with blank input fields.    | User is on the application Home Page.                                                                                                                | 1. Click the **My Account** dropdown menu located in the page header.<br> 2. Select the **Login** option from the dropdown menu list.<br>3.Leave the Email and Password fields completely empty.<br>4. Click the **Login** button.                                                                                        | 1. Browser redirection is blocked.<br>2. Server responds with an `HTTP 200` status.<br>3.The inline warning message is displayed: `Warning: No match for E-Mail Address and/or Password.`               | Smoke test      |
| **TC_AUTH_003** | Verify that the **Password** field masks user input.      | User is on the application Home Page.                                                                                                                | 1. Click the **My Account** dropdown menu located in the page header.<br>2.Type a standard string (e.g., `Password123`) into the **Password** field.<br>3. Inspect the visible text within the field.                                                                                                                     | 1. Every character typed into the **Password** field is instantly masked by the UI (displayed as dots/bullets).<br>2. The raw text remains hidden.                                                      | Regression test |
| **TC_AUTH_004** | Verify authentication failure with invalid credentials.   | User is on the application Home Page.                                                                                                                | 1. Click the **My Account** dropdown menu located in the page header.<br>2.Select the **Login** option from the dropdown menu list. <br>3. Enter an unregistered email address.<br>4.Enter an incorrect password.<br>5. Click the **Login** button.                                                                       | 1. Browser redirection is blocked.<br>2. The exact inline warning message is displayed: `Warning: No match for E-Mail Address and/or Password. `.                                                       | Regression test |
| **TC_AUTH_005** | Verify user profile state synchronization upon login.     | A valid user account exists with pre-configured settings (e.g., phone, address) saved from a previous session. User is on the application Home Page. | 1. Click the **My Account** dropdown menu located in the page header.<br>2.Select the **Login** option from the dropdown menu list. <br>3. Enter valid credentials and click the Login button.<br>4.Navigate directly to the account profile/settings layout.<br>                                                         | 1. The account configurations match the exact historical state saved at the end of the previous authenticated session.                                                                                  | Regression test |
| **TC_AUTH_006** | Verify shopping basket persistence across sessions.       | An account exists that previously had Item A added to the cart and Item B deleted from the cart. User is logged out on the Login Page.               | 1. Click the **My Account** dropdown menu located in the page header.<br>2.Select the **Login** option from the dropdown menu list. <br>3. Enter valid credentials and click the Login button.<br>4.Navigate directly to the shopping basket view.<br>5. Inspect Item A, Item B, and the navigation item counter.         | 1. Item A is present in the cart layout.<br>2. Item B is completely absent from the layout.<br> 3. The total item count badge matches the exact numerical quantity left behind in the previous session. | Regression test |
