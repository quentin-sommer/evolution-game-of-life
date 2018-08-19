// @flow
import type {GameBoard} from './ResolveTurn'
import React, {Component} from 'react'
import {
  createTurnResolver,
  boardScore,
  createAsyncTurnResolver,
  createAsyncXTurnResolver,
} from './ResolveTurn'
import BoardDisplay from './BoardDisplay'
import {tournamentSelection} from './Evolution'

const perfStart = str => console.time(str)
const perfEnd = str => console.timeEnd(str)

const printBoard = (board: GameBoard): void => {
  let str = ''
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      if (j + 1 === board.length) {
        str += `${board[i][j]}`
      } else {
        str += `${board[i][j]},`
      }
    }
    str += '\n'
  }
  console.log(str)
}

const createRandomXbyXDispotition = (
  width: number,
  lifeProbability: number = 0.5
): GameBoard =>
  new Array(width)
    .fill(0)
    .map(val =>
      new Array(width).fill(0).map(() => (Math.random() < lifeProbability ? 1 : 0))
    )

const placeDispositionInsidePlayground = (
  disposition: GameBoard,
  playgroundWidth: number,
  fillValue: number = 0
) => {
  const tmp = disposition.map(arr => arr.slice())

  if (disposition.length > playgroundWidth) {
    throw new Error('playgroundWidth must be bigger than disposition width')
  }
  let missing = playgroundWidth - disposition.length
  if (missing % 2 !== 0) {
    missing += 1
  }

  for (let i = 0; i < tmp.length; i++) {
    for (let j = 0; j < missing / 2; j++) {
      tmp[i].unshift(fillValue)
      tmp[i].push(fillValue)
    }
  }
  for (let i = 0; i < missing / 2; i++) {
    tmp.unshift(new Array(tmp.length + missing).fill(fillValue))
    tmp.push(new Array(tmp.length + missing).fill(fillValue))
  }
  return tmp
}

const playXTurns = async (board: GameBoard, x: number) => {
  let tmp = board
  for (let i = 0; i < x; i++) {
    tmp = await createTurnResolver()(tmp)
  }
  return tmp
}

const resolvePopulation = async (boards: Array<GameBoard>, turnsToPlay: number) => {
  return Promise.all(
    boards.map(async board => await createAsyncXTurnResolver()(board, turnsToPlay))
  )
}

type GameBoardState = Array<{start: GameBoard, result: GameBoard}>
class App extends Component<
  null,
  {
    boardSize: number,
    seedSize: number,
    boards: GameBoardState,
  }
> {
  state = {
    boardSize: 130,
    seedSize: 10,
    boards: [],
  }
  playTurn() {}
  startGame = async () => {
    const boards: GameBoardState = []
    const turnsToPlay = 200
    const resolves = []
    for (let i = 0; i < 10; i++) {
      const start = placeDispositionInsidePlayground(
        createRandomXbyXDispotition(this.state.seedSize),
        this.state.boardSize
      )
      boards.push({start, result: []})
    }
    perfStart('resolving')
    const resolved = await resolvePopulation(boards.map(b => b.start), turnsToPlay)
    perfEnd('resolving')
    perfStart('scoring')
    console.log('resolved', resolved.map(b => boardScore(b)))
    perfEnd('scoring')
    const boardsWithResolved = boards.map((b, index) => ({...b, result: resolved[index]}))
    this.setState({boards: boardsWithResolved})
  }
  componentDidMount() {
    this.startGame()
  }
  render() {
    const {boards} = this.state
    return (
      <div>
        <h1>Conway's game of life - Evolution</h1>
        {boards.map((b, idx) => (
          <div key={idx}>
            {boardScore(b.start)} - {boardScore(b.result)}
            <div>
              <BoardDisplay board={b.start} />-
              <BoardDisplay board={b.result} />
            </div>
          </div>
        ))}
      </div>
    )
  }
}

export default App
