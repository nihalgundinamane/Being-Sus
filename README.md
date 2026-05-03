# 🕵️ Sus Game

A free, open-source, pass-and-play party game inspired by the classic Imposter Game. Give clues, catch the fake, and have a laugh.

![Sus Game Screenshot](https://via.placeholder.com/800x400/0a0a12/ff3c6e?text=Sus+Game+%F0%9F%95%B5%EF%B8%8F)

---

## ✨ Features

- **40+ categories** — Animals, Food, Pop Culture, Holidays, and more
- **3 difficulty levels** — Easy, Medium, Hard (distinct word pools per level)
- **Fully customizable** — 3–12 players, 1+ imposters, custom player names
- **Hint mode** — Optional category hints for new players
- **Pass & Play** — No accounts, no ads, no internet required after load
- **Responsive** — Works beautifully on phones, tablets, and desktop
- **PWA-ready** — Fast, mobile-first design

---

## 🎮 How to Play

1. **Setup** — Choose number of players, imposters, difficulty, and categories
2. **Pass the phone** — Each player taps the cover screen privately
3. **See your role** — Civilians see the secret word; the Imposter sees nothing
4. **Give clues** — Each player gives exactly one word as a clue
5. **Vote** — Discuss and vote for who you think the Imposter is
6. **Reveal** — See if you caught the Imposter!

---

## 🚀 Getting Started (Local Development)

### Prerequisites

- [Node.js](https://nodejs.org/) v16 or higher
- npm v8 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/sus-game.git
cd sus-game

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at `http://localhost:3000`.

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

---

## 📁 Project Structure

```
sus-game/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── components/
│   │   ├── UI.jsx          # Reusable UI components (Button, Card, Stepper…)
│   │   ├── UI.module.css
│   │   ├── HomeScreen.jsx  # Settings & home page
│   │   ├── HomeScreen.module.css
│   │   ├── GameScreens.jsx # Cover, Role, Vote, Result screens
│   │   └── GameScreens.module.css
│   ├── data/
│   │   └── categories.js   # All word categories and word lists
│   ├── hooks/
│   │   └── useGame.js      # Core game state and logic
│   ├── utils/
│   │   └── helpers.js      # Shuffle, pick, storage utilities
│   ├── App.js              # Root component & screen routing
│   ├── index.js            # React entry point
│   └── index.css           # Global styles & CSS variables
├── package.json
├── README.md
└── HOST.md                 # Deployment guide
```

---

## 🛠 Tech Stack

- **React 18** — UI framework
- **CSS Modules** — Scoped component styles
- **CSS Custom Properties** — Consistent design tokens
- **No external UI libraries** — Fully custom design

---

## 🎨 Design System

| Token | Value | Usage |
|---|---|---|
| `--accent` | `#ff3c6e` | Primary / Imposter |
| `--accent2` | `#00e5b4` | Success / Civilian |
| `--accent3` | `#ffe033` | Secret word highlight |
| `--bg` | `#0a0a12` | Page background |
| `--surface` | `#13131f` | Card background |

---

## 📜 License

MIT License — free to use, modify, and distribute.

---

## 🤝 Contributing

Pull requests welcome! To add new words or categories, edit `src/data/categories.js`.
