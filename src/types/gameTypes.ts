export type CellCoordinates = {
  row: number
  column: number
}

export type Cell = {
  value: number
  position: CellCoordinates
  empty: boolean
  bounce: boolean
  justInserted: boolean
}

export type GameBoard = Cell[][]

export type GameState = {
  board: GameBoard
  playing: boolean
  score: number
}

export type ColorMode = 'dark' | 'light'

export type MoveDirection = 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown'

export type ActionType = {
  type: string
  payload: string
}
