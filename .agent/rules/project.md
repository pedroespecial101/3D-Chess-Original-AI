---
trigger: always_on
---

# 3D Chess Project Rules

## Development Server
- The dev server runs on **port 3010 (hardcoded in package.json)
- Start with: `npm run dev`
- Access at: http://localhost:3010?mode=debug - the debug switch bypasses the startup screen and enters AI Mode with Debug panel switched on

## Dev Mode
- Use AI Mode with 'Debug Mode' switched on in the start screen to enter dev mode. Using http://localhost:3010?mode=debug as the URL does this automatically
- This enables the Debug Settings panel and dev features
- The Debug button (bottom right) toggles the Debug Settings panel

## AI Opponent
- AI always plays the opposite side to the human player
- Uses external UCI chess engine API
- Debug logging available via DEBUG switch

## Documentation
- Always update `changelog.md` with any changes (most recent at top)
- Always update `README.md` for significant feature changes