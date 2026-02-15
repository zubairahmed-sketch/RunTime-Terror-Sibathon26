# BattleBrains

## Overview

BattleBrains is a multiplayer web-based educational platform that gamifies the learning experience by transforming quizzes into competitive team-based battles. Designed for students aged 8–14, it combines real-time multiplayer gameplay with engaging educational content, utilizing modern web technologies to deliver a seamless, responsive experience.

## Features

### Game Modes

BattleBrains offers three distinct game modes to engage learners:

| Mode | Description | Win Condition |
|------|-------------|---------------|
| **Tug-of-War** | Compete in a rope-pulling mechanic where correct answers pull opponents toward the mud pit | Drag opponent past the center line |
| **Rocket Rush Race** | Race to space with fuel-based progression powered by correct answers | First team to reach the finish line |
| **Catapult Castle Clash** | Strategic castle defense and attack where correct answers launch projectiles | Reduce opponent castle HP to zero |

### Core Capabilities

- **Real-time multiplayer support** — local split-keyboard or online room-based gameplay
- **Touch-optimized interface** — fully compatible with tablets and interactive displays
- **Dynamic gameplay mechanics** — 30–60 second rounds with power-up systems (Double, Freeze, Shield)
- **Curated question bank** — 40 STEM-focused questions covering arithmetic, algebra, and scientific concepts
- **Performance optimized** — 60 FPS capability on standard computing devices
- **Programmatically generated assets** — zero external file dependencies
- **Session management** — room codes and leaderboard tracking

## Getting Started

### Prerequisites

- Node.js v18 or later
- npm (Node Package Manager)
- A modern web browser with WebSocket support

### Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd Battle_Brains
npm run install-all
```

### Running the Application

Start both the server and client in development mode:

```bash
npm run dev
```

- **Server** will be available at `http://localhost:3000`
- **Client** will be available at `http://localhost:5173`

### Playing BattleBrains

1. Navigate to `http://localhost:5173` in your web browser
2. Enter player name and select desired game mode
3. Create a new room or join an existing room using a room code
4. Invite another player to join the same room
5. Initiate the battle when both players are ready

## Controls

### Keyboard Input (Local Two-Player Mode)

| Action | Team A | Team B |
|--------|--------|--------|
| Select Option 1 | Q | U |
| Select Option 2 | W | I |
| Select Option 3 | E | O |
| Select Option 4 | R | P |
| Activate Power-Up | T | Y |

### Touch and Mouse Input

- Tap any answer option to select it
- Tap power-up indicators on the screen to activate them

## Project Architecture

```
Battle_Brains/
├── package.json                   # Root package configuration
├── README.md                       # Project documentation
├── server/                         # Backend application
│   ├── index.js                    # Express and Socket.IO server
│   ├── package.json                # Server dependencies
│   └── game/
│       ├── GameRoom.js             # Room management and game state
│       ├── QuizEngine.js           # Question management and delivery
│       ├── PowerUps.js             # Power-up mechanics and effects
│       └── questions.json          # Question bank (40 questions)
│   └── utils/
│       └── roomCodes.js            # Room code generation
├── client/                         # Frontend application
│   ├── package.json                # Client dependencies
│   ├── vite.config.js              # Vite build configuration
│   ├── index.html                  # Entry point
│   └── src/
│       ├── main.js                 # Game initialization
│       ├── config.js               # Application constants
│       ├── network/
│       │   └── SocketManager.js    # WebSocket client
│       ├── scenes/
│       │   ├── BootScene.js        # Asset initialization
│       │   ├── LobbyScene.js       # Room UI
│       │   ├── TugOfWarScene.js    # Tug-of-War game implementation
│       │   ├── RocketRushScene.js  # Rocket Rush game implementation
│       │   ├── CatapultClashScene.js # Catapult Clash game implementation
│       │   └── WinScene.js         # Victory screen
│       └── ui/
│           ├── QuestionOverlay.js  # Question display component
│           ├── HUD.js              # Head-up display
│           └── PowerUpBar.js       # Power-up management UI
```

## Power-Up System

Each player begins with one of each power-up. Strategic use of power-ups is crucial for victory:

| Power-Up | Effect |
|----------|--------|
| **Double** | Immediately applies the effect of a correct answer twice |
| **Freeze** | Temporarily disables opponent team for 5 seconds; their answers are not counted during this period |
| **Shield** | Blocks the next adverse effect triggered by opponent's correct answer |

## Technology Stack

| Component | Technology |
|-----------|-----------|
| **Game Engine** | Phaser 3.80 with Arcade Physics |
| **Frontend Build Tool** | Vite 5 |
| **Real-time Communication** | Socket.IO 4 |
| **Backend Framework** | Node.js with Express |
| **Asset Management** | Programmatically generated (no external files) |
| **Deployment Target** | Cloud platforms (Vercel, Render, Railway, Glitch) |

## Deployment

### Building for Production

```bash
npm run build
```

This command builds the client application into the `client/dist/` directory.

### Deploying to Cloud Platforms

Start the server with the built client:

```bash
npm start
```

The server will serve the built client application from `client/dist/`. Configure the `PORT` environment variable as needed for your deployment platform.

## License

This project is released under the MIT License. See LICENSE file for details.

## Support

For issues, feature requests, or contributions, please refer to the project repository.
