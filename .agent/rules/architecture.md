# Architecture & State Rules

- **State Management**: Use Zustand stores in `src/state/`.
- **Logic Separation**: Keep chess rules and move validation in `src/logic/`. This logic should remain pure TypeScript and framework-agnostic.
- **3D Components**: Rendering and animations use React Three Fiber (R3F) and `react-spring`.
