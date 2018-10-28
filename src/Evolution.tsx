import sampleSize from 'lodash.samplesize'
import {GameBoard} from './ResolveTurn'
import {boardScore, createTurnResolver} from './ResolveTurn'

export const tournamentSelection = (boards: GameBoard[], size: number = 3) => {
  if (size > boards.length) {
    throw new Error(
      'Tournament selection size is bigger than the size of the population'
    )
  }
  const elems = sampleSize(boards, size)
    .map(board => ({board, score: boardScore(board)}))
    .sort((a, b) => Number(a.score < b.score))

  return elems[0]
}
