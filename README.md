# 🧩 Sudoku 50

A polished 50-level Sudoku web game built with React and TypeScript, featuring a custom Sudoku engine, progressive difficulty, hints, pencil notes, undo, achievements, procedural sound effects, themes, and persistent local progress.

> Solve one board at a time. Clear your mind. 🧩

---

## ✨ Features

### 🎮 Gameplay
- 50 handcrafted Sudoku levels
- 5 difficulty stages:
  - Easy: Levels 1–10
  - Medium: Levels 11–20
  - Hard: Levels 21–30
  - Expert: Levels 31–40
  - Master: Levels 41–50
- Progressive level unlocking
- Cell selection and highlighting
- Keyboard support
- Number pad
- Pencil notes
- Automatic candidate-note removal
- Erase functionality
- Undo system
- Smart hints

### ⏱️ Game System
- Live game timer
- Mistake tracking
- 3-mistake Game Over system
- Level completion validation
- Star ratings
- Accuracy tracking
- Best-time tracking
- Pause and resume
- Restart puzzle

### 🏆 Achievements

Seven achievements can be unlocked:

| Achievement | Requirement |
|---|---|
| First Step | Complete Level 1 |
| Getting Started | Complete 5 unique levels |
| Flawless | Complete a level with 0 mistakes |
| No Help Needed | Complete a level without using hints |
| Speed Solver | Complete a level in under 180 seconds |
| Halfway There | Complete 25 unique levels |
| Sudoku Master | Complete all 50 levels |

### 🔊 Procedural Audio
Uses the Web Audio API to generate sounds without external audio files.

- Cell selection
- Digit entry
- Pencil notes
- Mistakes
- Victory melody

Audio can be enabled or disabled from Settings.

### 🎨 Themes & Accessibility
- Light theme
- Dark theme
- System theme
- Gentle Warm contrast
- High Contrast mode
- Distinct styling for:
  - Given numbers
  - Player-entered numbers
  - Pencil notes
  - Errors
  - Selected cells
  - Related cells

### 💾 Persistent Progress

Player data is stored locally using browser `localStorage`.

Persisted data includes:

- Unlocked levels
- Completed levels
- Star ratings
- Best times
- Active game state
- Achievements
- Game settings

No backend or database is required.

---

## 🛠️ Tech Stack

- **React**
- **TypeScript**
- **Vite**
- **CSS**
- **Web Audio API**
- **localStorage**

---

## 🧠 Sudoku Engine

The project includes a custom Sudoku engine with:

- Backtracking solver
- Solution validation
- Unique-solution checking
- Candidate generation
- Conflict detection
- Smart hint generation
- Deterministic puzzle data
- 50 validated Sudoku boards

The game validates player input against the authoritative solution matrix rather than relying only on row, column, or block conflicts.

---

## 📁 Project Structure

```text
src/
├── components/
│   ├── GameControls.tsx
│   ├── LevelCompletionModal.tsx
│   ├── NumberPad.tsx
│   ├── PauseModal.tsx
│   └── SudokuBoard.tsx
│
├── data/
│   ├── mockSudoku.ts
│   └── sudokuLevels.ts
│
├── hooks/
│   └── useSudokuGame.ts
│
├── screens/
│   ├── AchievementsScreen.tsx
│   ├── GameScreen.tsx
│   ├── HomeScreen.tsx
│   ├── LevelCompleteScreen.tsx
│   ├── LevelSelectScreen.tsx
│   ├── PauseScreen.tsx
│   └── SettingsScreen.tsx
│
├── types/
│   └── sudoku.ts
│
└── utils/
    ├── achievementsEngine.ts
    ├── settingsStorage.ts
    ├── soundEngine.ts
    ├── storage.ts
    ├── sudokuEngine.ts
    ├── theme.ts
    └── validateBugFixes.ts
