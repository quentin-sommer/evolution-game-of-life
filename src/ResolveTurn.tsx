import greenlet from 'greenlet'

export type GameBoard = number[][]

export const resolveTurn = (gameBoard: GameBoard): GameBoard => {
  const tmp = gameBoard.map(arr => arr.slice())
  for (let i = 0; i < gameBoard.length; i++) {
    for (let j = 0; j < gameBoard.length; j++) {
      // new val
      let count = 0
      // haut droit
      count += (gameBoard[i - 1] !== undefined && gameBoard[i - 1][j + 1]) || 0
      // haut
      count += (gameBoard[i - 1] !== undefined && gameBoard[i - 1][j]) || 0
      // haut gauche
      count += (gameBoard[i - 1] !== undefined && gameBoard[i - 1][j - 1]) || 0
      // gauche
      count += (gameBoard[i] !== undefined && gameBoard[i][j - 1]) || 0
      // bas gauche
      count += (gameBoard[i + 1] !== undefined && gameBoard[i + 1][j - 1]) || 0
      // bas
      count += (gameBoard[i + 1] !== undefined && gameBoard[i + 1][j]) || 0
      // bas droit
      count += (gameBoard[i + 1] !== undefined && gameBoard[i + 1][j + 1]) || 0
      // droit
      count += (gameBoard[i] !== undefined && gameBoard[i][j + 1]) || 0
      if (count > 3) {
        tmp[i][j] = 0
      } else if (count === 3) {
        tmp[i][j] = 1
      } else if (count < 2) {
        tmp[i][j] = 0
      }
    }
  }
  return tmp
}

const resolveXTurn = (gameBoard: GameBoard, x: number): GameBoard => {
  const resolveTurnAsync = (gameBoard2: GameBoard): GameBoard => {
    const tmp = gameBoard2.map(arr => arr.slice())
    for (let i = 0; i < gameBoard2.length; i++) {
      for (let j = 0; j < gameBoard2.length; j++) {
        // new val
        let count = 0
        // haut droit
        count +=
          (gameBoard2[i - 1] !== undefined && gameBoard2[i - 1][j + 1]) || 0
        // haut
        count += (gameBoard2[i - 1] !== undefined && gameBoard2[i - 1][j]) || 0
        // haut gauche
        count +=
          (gameBoard2[i - 1] !== undefined && gameBoard2[i - 1][j - 1]) || 0
        // gauche
        count += (gameBoard2[i] !== undefined && gameBoard2[i][j - 1]) || 0
        // bas gauche
        count +=
          (gameBoard2[i + 1] !== undefined && gameBoard2[i + 1][j - 1]) || 0
        // bas
        count += (gameBoard2[i + 1] !== undefined && gameBoard2[i + 1][j]) || 0
        // bas droit
        count +=
          (gameBoard2[i + 1] !== undefined && gameBoard2[i + 1][j + 1]) || 0
        // droit
        count += (gameBoard2[i] !== undefined && gameBoard2[i][j + 1]) || 0
        if (count > 3) {
          tmp[i][j] = 0
        } else if (count === 3) {
          tmp[i][j] = 1
        } else if (count < 2) {
          tmp[i][j] = 0
        }
      }
    }
    return tmp
  }
  let res = gameBoard
  for (let i = 0; i < x; i++) {
    res = resolveTurnAsync(res)
  }

  return res
}
export const boardScore = (board: GameBoard) => {
  let res = 0
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      res += board[i][j]
    }
  }
  return res
}
export const createTurnResolver = () => resolveTurn
export const createAsyncTurnResolver = () => greenlet(resolveTurn)

export const createAsyncXTurnResolver = (): ((
  board: GameBoard,
  x: number
) => Promise<GameBoard>) => greenlet(resolveXTurn)
