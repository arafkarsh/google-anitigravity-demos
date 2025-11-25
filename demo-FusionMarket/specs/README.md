# Stock Market Analysis

The application should provide an intuitive, responsive, and interactive interface for discovering, tracking, and comparing publicly listed companies. The following features define the minimum viable experience, with several optional enhancements to improve usability and performance.

## 1. Intelligent Stock Search

- A unified search box with real-time autocomplete suggestions for tickers and company names (e.g., Microsoft, Apple, Alphabet, Oracle).
- Suggestions should appear as the user types, powered by a public market-data API.

## 2. Search Result Summary Panel

- Display selected stock search results directly beneath the search bar.
- Each entry must include:
    - Company name and ticker symbol
    - Current market price
    - Short-term price trend indicator
    - A brief company overview sourced from publicly available data

## 3. Interactive 3×5 Stock Grid

- Users can add any searched stock to a 5×5 grid of visual widgets (max 25 stocks).
- Each grid widget must display:
    - Stock name and ticker symbol (header)
    - A mini line chart showing recent price movement
    - The current stock price in a prominent, large font
    - Year-over-Year (YoY) trend indicator (Up/Down)
- Once added, the stock should disappear from the search result list.
- Widgets must support smooth animation when added, removed, or rearranged.

## 4. Clear Search Results

- A dedicated button should allow the user to clear the search results area instantly.

## 5. Integrated Chat Assistant

- A persistent right-hand panel hosts a conversational assistant.
- The assistant can discuss stocks, financial narratives, company histories, and market news sourced from publicly available information.
- No personal financial advice should be generated.

## 6. Stock Widget Management

- Each widget in the 5×5 grid must include a remove option.
- Removing a stock should update local storage and refresh grid layout in real time.

## 7. Local Storage Persistence

- All added stock widgets should automatically persist via local storage.
- On page reload, the user's personalized 5×5 grid must be restored.

## 8. Zoom & Detailed Stock Panel

- Each stock widget features a "Zoom" or "Expand" icon.
- Selecting this opens a detailed stock panel to the right of the grid.
- The detail panel includes:
    - A larger interactive stock chart
    - Key financial metrics (market cap, volume, P/E, etc.)
    - Recent news headlines
    - Company profile summary

## 9. Collapsible Grid

- The main 5×5 grid should be collapsible toward the left, giving more screen real estate to comparison views or the chat assistant.
- Collapse/expand transitions should be smooth and non-disruptive.

## 10. Multi-Stock Comparison (Up to 3 Stocks)

- The detail panel should support stacking up to three stock detail cards vertically.
- Each card includes:
    - A large chart
    - Key metrics
    - Snapshot summary
- This view enables side-by-side comparison without leaving the main dashboard.

## 11. Enhancements for a Better User Experience

- Dark/Light mode toggle for better accessibility.
- Keyboard shortcuts for fast searching and grid navigation.
- Drag-and-drop grid rearrangement for user-defined layout.
- Historical comparison mode (switch between 1D, 5D, 1M, 6M, YTD, 1Y, 5Y).
- AI-generated summaries of company performance trends using public information.
- Watchlist heatmap mode where grid widgets shift colors based on % change.

