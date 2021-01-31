import {
  Cell,
  CellCoordinates,
  ColorMode,
  GameBoard,
  GameState,
  MoveDirection,
} from '../types/gameTypes'
import { cloneDeep, isEmpty, isEqual, xorWith } from 'lodash'
import EventEmitter from 'events'

export const showPointsOnMoveEvent = new EventEmitter()
export const bounceBoardOnMove = new EventEmitter()

export const createDefaultCell = (position: CellCoordinates): Cell => {
  return {
    position,
    empty: true,
    value: 0,
    bounce: false,
    justInserted: false,
  }
}

export const createCell = (
  position: CellCoordinates,
  value: number,
  bounce = false,
  justInserted = false
): Cell => {
  return {
    position,
    value,
    empty: false,
    bounce,
    justInserted,
  }
}

export const boardGenerator = (): GameBoard => {
  const board = new Array(5).fill([]).map((row) => new Array(5).fill(0))
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      board[row][col] = createDefaultCell({ row: row, column: col })
    }
  }
  return board
}

export const findEmptyCells = (board: GameBoard): Cell[] => {
  const emptyCells: Cell[] = []
  const boardCopy = cloneDeep(board)
  boardCopy.forEach((row) => {
    row.forEach((cell) => {
      if (cell.empty) emptyCells.push(cell)
    })
  })
  return emptyCells
}

export const pickRandomTwoIndiciesInArray = (arr: Cell[]): number[] => {
  const first = Math.floor(Math.random() * arr.length)
  let second = null
  while (second === null) {
    const candidate = Math.floor(Math.random() * arr.length)
    if (candidate !== first) second = candidate
  }
  return [first, second]
}

export const pickRandomTwoOrOneCellCoordinatesToUpdate = (
  emptyCells: Cell[]
): CellCoordinates[] | false => {
  if (!emptyCells.length) return false
  if (emptyCells.length === 1) return [emptyCells[0].position]
  const [first, second] = pickRandomTwoIndiciesInArray(emptyCells)

  return [emptyCells[first].position, emptyCells[second].position]
}

export const insertCellsForNextMove = (state: GameState): GameState => {
  const boardCopy = cloneDeep(state.board)
  const emptyCells = findEmptyCells(boardCopy)
  const coordinatesToInsertNewCellsAt = pickRandomTwoOrOneCellCoordinatesToUpdate(
    emptyCells
  )

  if (!coordinatesToInsertNewCellsAt) {
    const arePossibleMoves = checkForPossibleValidMove(boardCopy)
    if (!arePossibleMoves) return { ...state, playing: false }
  }

  coordinatesToInsertNewCellsAt &&
    coordinatesToInsertNewCellsAt.forEach((coord) => {
      const optionValues = [2, 4]
      const random = Math.floor(Math.random() * 2)
      boardCopy[coord.row][coord.column] = createCell(
        { row: coord.row, column: coord.column },
        optionValues[random],
        false,
        true
      )
    })

  const emptyCellsLength = findEmptyCells(boardCopy).length
  if (!emptyCellsLength) {
    const isValidMove = checkForPossibleValidMove(boardCopy)
    if (!isValidMove) return { ...state, board: boardCopy, playing: false }
  }

  return { ...state, board: boardCopy }
}

const insertTwoInitialCells = (board: GameBoard): GameBoard => {
  const boardCopy = cloneDeep(board)
  const emptyCells = findEmptyCells(boardCopy)
  const coordinatesToInsertNewCellsAt = pickRandomTwoOrOneCellCoordinatesToUpdate(
    emptyCells
  )
  coordinatesToInsertNewCellsAt &&
    coordinatesToInsertNewCellsAt.forEach((coord) => {
      const optionValues = [2, 4, 8]
      const random = Math.floor(Math.random() * 0.75 * 3)
      boardCopy[coord.row][coord.column] = createCell(
        { row: coord.row, column: coord.column },
        optionValues[random],
        false,
        true
      )
    })
  return boardCopy
}

export const getInitialBoard = (): GameBoard => {
  const board = boardGenerator()
  const boardWithTwoCells = insertTwoInitialCells(board)
  return boardWithTwoCells
}

export const handleMove = (
  moveDirection: MoveDirection,
  gameState: GameState
): GameState => {
  if (moveDirection === 'ArrowLeft' || moveDirection === 'ArrowRight') {
    return handleHorizontalMove(moveDirection, gameState)
  }
  return handleVerticalMove(moveDirection, gameState)
}

export const handleMoveAndAdd = (
  moveDirection: MoveDirection,
  gameState: GameState
): GameState => {
  const boardCopy = cloneDeep(gameState.board)
  boardCopy.forEach((row) =>
    row.forEach((cell) => {
      cell.bounce = false
      cell.justInserted = false
    })
  )
  const updatedBoardState: GameState = handleMove(moveDirection, {
    ...gameState,
    board: boardCopy,
  })
  const shouldInsertNewCells = !areBoardsEqual(
    boardCopy,
    updatedBoardState.board
  )

  bounceBoardOnMove.emit('bounceBoard', moveDirection)

  if (shouldInsertNewCells) {
    const updatedState = insertCellsForNextMove({
      ...updatedBoardState,
      board: updatedBoardState.board,
    })

    return updatedState
  } else {
    return { ...updatedBoardState, board: updatedBoardState.board }
  }
}

const areBoardsEqual = (board1: GameBoard, board2: GameBoard): boolean =>
  isEmpty(xorWith(board1, board2, isEqual))

const handleHorizontalMove = (
  moveDirection: MoveDirection,
  state: GameState
): GameState => {
  const newBoard: Cell[][] = []
  const boardCopy = cloneDeep(state.board)

  const currentScoreToSeeDiff = state.score
  let currentScore = state.score

  for (let i = 0; i < 5; i++) {
    let row = boardCopy[i]
    const notEmptyCells = row.filter((cell) => !cell.empty)
    const emptyCells = row.filter((cell) => cell.empty)

    if (moveDirection === 'ArrowLeft') {
      for (let j = 0; j < notEmptyCells.length - 1; j++) {
        if (
          notEmptyCells[j + 1] &&
          notEmptyCells[j].value === notEmptyCells[j + 1].value
        ) {
          notEmptyCells[j].value *= 2
          notEmptyCells[j].bounce = true
          currentScore += notEmptyCells[j].value
          notEmptyCells[j + 1].value = 0
          notEmptyCells[j + 1].empty = true
          j++
        }
      }
    } else {
      for (let j = notEmptyCells.length - 1; j >= 0; j--) {
        if (
          notEmptyCells[j - 1] &&
          notEmptyCells[j].value === notEmptyCells[j - 1].value
        ) {
          notEmptyCells[j].value *= 2
          notEmptyCells[j].bounce = true
          currentScore += notEmptyCells[j].value
          notEmptyCells[j - 1].value = 0
          notEmptyCells[j - 1].empty = true
          j--
        }
      }
    }
    const secondFiltered = notEmptyCells.filter((cell) => {
      if (cell.empty) {
        emptyCells.push(cell)
        return false
      }
      return true
    })

    const newRow =
      moveDirection === 'ArrowLeft'
        ? [...secondFiltered, ...emptyCells]
        : [...emptyCells, ...secondFiltered]
    newBoard.push(newRow)
  }
  const newBoardWithUpdatedPositions = mapNewCoordinates(newBoard)

  const pointsAddedPerMove = currentScore - currentScoreToSeeDiff
  showPointsOnMoveEvent.emit('pointsEarned', pointsAddedPerMove)

  return { ...state, board: newBoardWithUpdatedPositions, score: currentScore }
}

const mapNewCoordinates = (board: GameBoard): GameBoard => {
  return board.map((row, rowIdx) => {
    const mappedNewPositions = row.map((cell, idx) => {
      const position = { row: rowIdx, column: idx }
      return cell.empty
        ? createDefaultCell(position)
        : createCell(position, cell.value, cell.bounce)
    })
    return mappedNewPositions
  })
}

const handleVerticalMove = (
  moveDirection: MoveDirection,
  state: GameState
): GameState => {
  const boardCopy = cloneDeep(state.board)
  const revertedBoard: GameBoard = revertBoardToHorizontal(boardCopy)
  let stateWithModifiedBoard
  if (moveDirection === 'ArrowDown') {
    stateWithModifiedBoard = handleHorizontalMove('ArrowRight', {
      ...state,
      board: revertedBoard,
    })
  } else {
    stateWithModifiedBoard = handleHorizontalMove('ArrowLeft', {
      ...state,
      board: revertedBoard,
    })
  }
  const revertedBackToVertical = revertBoardToVertical(
    stateWithModifiedBoard.board
  )
  const withUpdatedPositions = mapNewCoordinates(revertedBackToVertical)
  return { ...stateWithModifiedBoard, board: withUpdatedPositions }
}

const revertBoardToHorizontal = (board: GameBoard): GameBoard => {
  const newBoard: Cell[][] = []
  const boardCopy = cloneDeep(board)
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (!newBoard[j]) newBoard[j] = []
      newBoard[j].push(boardCopy[i][j])
    }
  }
  return newBoard
}

const revertBoardToVertical = (board: GameBoard): GameBoard => {
  const newBoard: Cell[][] = []
  const boardCopy = cloneDeep(board)
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (!newBoard[i]) newBoard[i] = []
      newBoard[i].push(boardCopy[j][i])
    }
  }
  return newBoard
}

const checkForPossibleValidMove = (board: GameBoard): boolean => {
  //check horizontally
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 4; j++) {
      if (!board[i][j].empty && board[i][j].value === board[i][j + 1].value)
        return true
    }
  }

  //check verically
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 4; j++) {
      if (!board[j][i].empty && board[j][i].value === board[j + 1][i].value)
        return true
    }
  }
  return false
}

export const cellColorDecider = (
  value: number,
  colorMode: ColorMode
): string => {
  if (colorMode === 'light') {
    switch (value) {
      case 0:
        return '#468faf'
      case 2:
        return 'yellow.100'
      case 4:
        return 'orange.200'
      case 8:
        return 'orange.400'
      case 16:
        return 'red.300'
      case 32:
        return 'red.500'
      case 64:
        return 'teal.300'
      case 128:
        return 'green.400'
      case 256:
        return 'blue.400'
      case 512:
        return 'purple.500'
      case 1024:
        return 'cyan.700'
      case 2048:
        return 'pink.600'
      case 4096:
        return 'purple.700'
      default:
        return 'purple.700'
    }
  } else {
    switch (value) {
      case 0:
        return 'gray.700'
      case 2:
        return 'gray.500'
      case 4:
        return 'orange.700'
      case 8:
        return 'red.500'
      case 16:
        return 'green.700'
      case 32:
        return 'green.500'
      case 64:
        return 'blue.700'
      case 128:
        return 'blue.500'
      case 256:
        return 'purple.500'
      case 512:
        return 'pink.700'
      case 1024:
        return 'pink.500'
      case 2048:
        return 'purple.500'
      case 4096:
        return 'gray.900'
      default:
        return 'gray.900'
    }
  }
}
