// Dev mode is enabled when NEXT_PUBLIC_CHEATS is true OR when running in development mode
export const isDev = process.env.NEXT_PUBLIC_CHEATS === `true` || process.env.NODE_ENV === 'development'

