
export type EngineConfig = {
  skillLevel: number
  eloRating?: number
  depth: number
  movetime: number
  threads: number
  hash: number
}

export const DEBUG = true

const log = (...args: any[]) => {
  if (DEBUG) {
    console.log('[AI Client]', ...args)
  }
}

export type MoveResponse = {
  bestmove: string
  ponder?: string
  evaluation?: {
    type: 'cp' | 'mate'
    value: number
    depth: number
    nodes: number
    time: number
    pv: string[]
  }
}

class ChessEngineClient {
  private baseUrl: string

  constructor(baseUrl = 'http://localhost:3001') {
    this.baseUrl = baseUrl
  }

  async health(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/health`)
      return res.ok
    } catch {
      return false
    }
  }

  async init(options: Partial<EngineConfig> = {}): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/engine/init`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        skillLevel: options.skillLevel || 10,
        eloRating: options.eloRating,
        threads: options.threads || 2,
        hash: options.hash || 128,
        engineType: 'stockfish',
      }),
    })
    return await response.json()
  }

  async getMove(
    position: string | null,
    options: {
      depth?: number
      movetime?: number
      skillLevel?: number
      eloRating?: number
      moves?: string[]
    } = {},
  ): Promise<MoveResponse> {
    if (DEBUG) log('Getting move for position', position, 'options', options)
    const body: any = {
      depth: options.depth || 15,
      movetime: options.movetime || 2000,
      skillLevel: options.skillLevel,
      eloRating: options.eloRating,
    }
    if (position) body.position = position
    if (options.moves) body.moves = options.moves

    const response = await fetch(`${this.baseUrl}/api/engine/move`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await response.json()
    if (DEBUG) log('Engine response', data)
    return data
  }

  async quit(): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/api/engine/quit`, {
        method: 'DELETE',
      })
    } catch (e) {
      console.error('Failed to quit engine', e)
    }
  }
}

export const aiClient = new ChessEngineClient()
