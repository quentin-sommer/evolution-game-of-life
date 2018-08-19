// @flow

import type {GameBoard} from './ResolveTurn'
import {createTurnResolver, boardScore} from './ResolveTurn'
import sampleSize from 'lodash.samplesize'

export const tournamentSelection = (boards: Array<GameBoard>, size: number = 3) => {
  if (size > boards.length) {
    throw new Error('Tournament selection size is bigger than the size of the population')
  }
  const elems = sampleSize(boards, size)
    .map(board => ({board, score: boardScore(board)}))
    .sort((a, b) => a.score < b.score)

  return elems[0]
}
