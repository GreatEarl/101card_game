# 🂡 101 Card Game

A modern, responsive web application for playing the **101 Card Game** (Human vs AI), built with **Vue 3**, **Vite**, and **Vanilla CSS**.

---

## 🚀 Quick Start (Yarn)

### 1. Install Dependencies
```bash
yarn install
```

### 2. Development Server
```bash
yarn dev
```
Open `http://localhost:5173/` in your browser.

### 3. Production Build
```bash
yarn build
```

### 4. Preview Build Locally
```bash
yarn preview
```

---

## 🎯 Key Game Mechanics
- **36-Card Deck**: Reshuffled at the start of every round.
- **Blind Opening Card**: Starting player deals their 5th card face-down to open table.
- **Special Action Cards**: 6, 7, 8, Queen (wild), King of Spades (+4), Ace (skip).
- **Exact 101 Target**: Hitting 101 resets score to 0. Exceeding > 101 loses the match!
