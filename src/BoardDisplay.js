// @flow
import type {GameBoard} from './ResolveTurn'
import React, {Component} from 'react'
import {createTurnResolver} from './ResolveTurn'

const cellSize = 4
const fps = 24
const aliveColor = '#448AFF'
const deadColor = '#282c34'

class BoardDisplay extends Component<
  {board: GameBoard, turnsToPlay: number, onFinish: GameBoard => void},
  {}
> {
  async updateLoop(board: GameBoard, turnsToPlay: number): Promise<GameBoard> {
    return new Promise(resolve => {
      if (turnsToPlay === 0) {
        return resolve(board)
      }
      setTimeout(() => {
        const newBoard = createTurnResolver()(board)
        this.updateCanvas(newBoard)
        return resolve(this.updateLoop(newBoard, turnsToPlay - 1))
      }, 1000 / fps)
    })
  }

  componentDidMount() {
    const {board, turnsToPlay} = this.props
    this.updateCanvas(board)
    this.updateLoop(board, turnsToPlay).then(endBoard => this.props.onFinish(endBoard))
  }

  updateCanvas(board: GameBoard) {
    const width = board.length * cellSize
    const ctx = this.refs.canvas.getContext('2d')
    ctx.fillStyle = deadColor
    ctx.fillRect(0, 0, width, width)
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board.length; j++) {
        const cell = board[i][j]
        ctx.fillStyle = cell === 1 ? aliveColor : deadColor
        ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize)
      }
    }
  }
  render() {
    const {board} = this.props
    const width = board.length * cellSize
    return <canvas ref="canvas" width={width} height={width} />
  }
  static defaultProps = {
    turnsToPlay: 0,
    onFinish: () => {},
  }
}

export default BoardDisplay
