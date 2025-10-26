# Conway's Game of Life - Angular Implementation

🎮 **Live Demo:** https://conway-game-of-life-ten.vercel.app/

An interactive implementation of Conway's Game of Life built with Angular 20, featuring pattern management and a clean, responsive UI.

## Features

- ▶️ **Play/Pause** - Control the simulation
- 🔄 **Reset** - Generate a new random pattern
- 📚 **Pattern Library** - Browse and load predefined patterns
- 💾 **Publish Patterns** - Save your own patterns to the database
- 📱 **Responsive Design** - Works on desktop of different sizes

## Tech Stack

- **Angular 20** with standalone components
- **Angular Signals** for reactive state management
- **RxJS** for HTTP operations
- **TypeScript 5.9**
- **Backend:** Node.js + NestJS + MongoDB (deployed on Vercel)

## Technical Architecture & Decisions

### Why Angular Signals?

Coming from a React background, I chose Angular Signals over traditional RxJS-based state management because:

- Fine-grained reactivity with automatic dependency tracking
- Simpler mental model compared to complex Observable chains
- Better performance for frequent state updates (game grid updates every 200ms)
- Cleaner syntax similar to React hooks

### Why Standalone Components?

- No NgModule boilerplate - cleaner architecture
- Better tree-shaking and lazy loading
- More intuitive for developers from other frameworks
- Aligns with Angular's modern development direction

### Architecture Highlights

- **Service-based HTTP layer** with centralized error handling
- **Component composition** with input/output signals for parent-child communication
- **Effect hooks** for side effects (loading patterns when modal opens)
- **Separation of concerns** between game logic and UI components

## Game Rules (Conway's Game of Life)

Each cell follows these rules on every "tick":

1. **Underpopulation:** Live cell with < 2 neighbors dies
2. **Survival:** Live cell with 2-3 neighbors survives
3. **Overpopulation:** Live cell with > 3 neighbors dies
4. **Reproduction:** Dead cell with exactly 3 neighbors becomes alive

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   └── patterns/          # Pattern modal component
│   ├── services/
│   │   └── patterns.service.ts # API service for pattern CRUD
│   ├── app.component.ts        # Main game logic
│   └── app.html                # Game grid and controls
└── environments/               # Environment configuration
```

## Local Development

### Prerequisites

- Node.js 18+
- npm or yarn

## API Integration

The app connects to a backend API for pattern management:

- `GET /patterns` - Fetch all saved patterns
- `POST /patterns` - Save a new pattern

Backend repository: [link if available]

## Implementation Notes

- **Grid rendering:** CSS Grid with dynamic columns/rows via CSS custom properties
- **Game loop:** `setInterval` with 200ms tick rate
- **State management:** Signals for reactive grid updates
- **Pattern storage:** Boolean 2D arrays representing cell states

## Future Enhancements

- [ ] Variable grid sizes
- [ ] Adjustable simulation speed
- [ ] Pattern search/filter
- [ ] Pattern voting/likes
- [ ] Step-by-step mode
- [ ] Cell color themes

## License

MIT
