# Feature Test Plan: Global Search Functionality

---

## 1. Feature Component Overview

The Global Search module allows users to scan the store catalog from any page via the header input bar. This document defines the discrete requirements, behavioral rules, and scope classifications used to build our manual test cases, Playwright scripts, and Postman API tests.

---

## 2. Behavioral Specifications (The Rules)

### 2.1 Search Query Inputs

The search engine must accept the following variations to find relevant products:

- **Case-Insesitive Strings:** Searching `macbook`, `MacBook`, or `MACBOOK` must return identical results.
- **Substrings / Partial Matches:** Searching a partial word like `Mac` must successfully return products containing that text (e.g., `MacBook Pro`).
- **Products Codes / Models IDs:** Searching for an exact model string (e.g., `"product 11"`) must return that specific product.

### 2.2 System Search Matching Rules (Discovered via manual Sweep)

- **Space Sensitive Phrase Matching:** The search engine requires exact spacing for alphanumeric product codes. Searching without a space (`product11`) will yield zero results.
- **No Loose Keyword Matching:** Generic words that act as structural labels rather than descriptive keywords (e.g., searching just the word `product`) will return an empty result page.

### 2.3 Interaction Triggers

The search query must execute successfully using either of these two user actions:

- Clicking the **Magnifying Glass icon** button next to the input field.
- Pressing the **Enter key** on the keyboard while typing inside the search field.

### 2.4 Search Results Page (Default Layout)

When matching products are found, the system must display them accordingly to these default UI rules:

- **View Mode:** Products must display in **Grid Mode** by default (not List Mode Mode).
- **Pagination Limit:** A maximum of **20 items** must be displayed per page.

## 3. Browser-Specific Behavior Notes (Out of Scope for Testing)

- **Browser Autocomplete Dropdown:** When the search field is focused while empty, the local browser may overlay a history list of past search keywords. This is native browser caching functionality (`autocomplete="on"` default) and is outside the scope of the application's search engine logic. Automation scripts must account for this to prevent focus-interruption elements.

---

## 4. Manual Test Suite

| Test ID           | Description                                                                           | Preconditions                         | Test Steps                                                                                                                                    | Expected Result                                                                                                                                                                                                                                                                                                                                                                                                                      | Test Type           |
| :---------------- | :------------------------------------------------------------------------------------ | :------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------ |
| **TC_SEARCH_001** | Verify search functionality using a valid keyword via the Magnifying Glass icon.      | User is on the application Home Page. | 1. Click into the search input field.<br>2. Type the valid keyword `'MacBook'`.<br>3. Click the Magnifying Glass icon button.                 | 1. Browser redirects to the Search Results page.<br>2. Relevant MacBook products are displayed in **Grid Mode** by default.<br>3. Maximum of 20 items are visible on the page.                                                                                                                                                                                                                                                       | **Smoke Test**      |
| **TC_SEARCH_002** | Verify search functionality using a valid keyword via the Enter key.                  | User is on the application Home Page. | 1. Click into the search input field.<br>2. Type the valid keyword `'iPhone'`.<br>3. Press the **Enter** key on the keyboard.                 | 1. Browser redirects to the Search Results page.<br>2. Relevant iPhone products are displayed in **Grid Mode** by default.<br>3. Maximum of 20 items are visible on the page.                                                                                                                                                                                                                                                        | **Smoke Test**      |
| **TC_SEARCH_003** | Verify search functionality handles compound product names missing spaces gracefully. | User is on the application Home Page. | 1. Click into the search input field.<br>2. Type the keyword `'product11'`.<br>3. Press the **Enter** key or click the Magnifying Glass icon. | 1. Browser redirects to the Search Results page.<br>2. No products are displayed.<br>3. The message: `"There is no product that matches the search criteria."` is displayed.                                                                                                                                                                                                                                                         | **Regression Test** |
| **TC_SEARCH_004** | Verify case insensitivity of the search functionality.                                | User is on the application Home Page. | 1. Click into the search input field.<br>2. Type the capitalized keyword `'MACBOOK'`.<br>3. Press the **Enter** key on the keyboard.          | 1. Browser redirects to the Search Results page.<br>2. Relevant MacBook products are displayed identically to lowercase results.<br>3. Maximum of 20 items are visible on the page.                                                                                                                                                                                                                                                  | **Regression Test** |
| **TC_SEARCH_005** | Verify edge case handling of whitespace-only queries.                                 | User is on the application Home Page. | 1. Click into the search input field.<br>2. Type a string of empty spaces: `'     '`.<br>3. Press the **Enter** key on the keyboard.          | 1. Browser redirects to the Search Results page.<br>2. The list of products are displayed according to the URL-encoded as `%20%20%20%20%20` 5 spaces.<br>3. _Note on Current System Behavior:_ Due to a known backend bug where search inputs are not trimmed, the system matches the blank spaces against product descriptions. Therefore, products are returned (product count is greater than 0) instead of an empty state error. | **Regression Test** |
