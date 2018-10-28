import React, {Component, RefObject} from 'react'
import {GameBoard} from './ResolveTurn'
import {createTurnResolver} from './ResolveTurn'

const cellSize = 4
const fps = 24
const aliveColor = '#448AFF'
const deadColor = '#282c34'

interface IState {
  board: GameBoard
  onFinish?: any // GameBoard => void;
  turnsToPlay: number
}

class BoardDisplay extends Component<IState, any> {
  public static defaultProps = {
    /* tslint:disable:no-empty */
    onFinish: () => {},
    turnsToPlay: 0,
  }

  private readonly canvasRef: RefObject<HTMLCanvasElement>

  public constructor(props: any) {
    super(props)
    this.canvasRef = React.createRef<HTMLCanvasElement>()
  }
  public componentDidMount() {
    const {board, turnsToPlay} = this.props
    this.updateCanvas(board)
    this.updateLoop(board, turnsToPlay).then(endBoard =>
      this.props.onFinish(endBoard)
    )
  }
  public async updateLoop(
    board: GameBoard,
    turnsToPlay: number
  ): Promise<GameBoard> {
    return new Promise<GameBoard>(resolve => {
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

  public updateCanvas(board: GameBoard) {
    const width = board.length * cellSize
    const canvas = this.canvasRef.current
    if (canvas === null) {
      return
    }
    const ctx = canvas.getContext('2d')
    if (ctx === null) {
      return
    }
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
  public render() {
    const {board} = this.props
    const width = board.length * cellSize
    return <canvas ref={this.canvasRef} width={width} height={width} />
  }
}

export default BoardDisplay
