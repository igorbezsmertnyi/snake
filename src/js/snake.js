import updateScore from './updateScore'
import saveScore from './savaScore'
import getResults from './getResults'

export default class Snake {
  constructor() {
    this.GRID_SIZE = 20
    this.FPS = 10
    this.INTERVAL = 1000 / this.FPS
    this.AREA_WIDTH
    this.AREA_HEIGHT

    this.area
    this.ctx
    this.now
    this.delta

    this.area
    this.ctx

    this.now
    this.delta

    this.then = Date.now()
    this.crashed = false
    this.started = false
    this.preview = true
    this.score = 0

    this.snake = {
      x: 100,
      y: 100,
      dx: 1,
      dy: 0,
      tail: [],
      startLength: 4
    }

    this.food = {
      x: 260,
      y: 100
    }

    this.loop = this.loop.bind(this)
  }

  init() {
    this.area = document.getElementById('area')
    this.ctx = this.area.getContext('2d')

    this.AREA_WIDTH = this.calcAreaSize
    this.AREA_HEIGHT = this.calcAreaSize

    this.area.width = this.AREA_WIDTH
    this.area.height = this.AREA_HEIGHT

    this.fillArea()
    this.startScreen()
  }

  start() {
    this.started = true
    this.crashed = false
    this.preview = false

    this.initialValue()
    this.changeDirectionListener()
    this.createSnake(4)
    this.loop()
  }

  pause() {
    this.started = false
  }

  resume() {
    this.started = true
  }

  loop() {
    if (this.crashed) return

    requestAnimationFrame(this.loop)

    if (!this.started && !this.preview) return

    this.now = Date.now()
    this.delta = this.now - this.then

    if (this.delta > this.INTERVAL) {
      this.then = this.now - (this.delta % this.INTERVAL)

      this.fillArea()

      if (this.preview) {
        this.autoChangeDirection()
      }

      this.moveSnake()
      this.drawSnake()

      if (!this.preview) {
        this.drawFood()
        this.checkSnakeLocation()
      }
    }
  }

  createSnake(size) {
    [ ...Array(size).keys() ].forEach((_, index) => {
      const coordinates = [ this.snake.x - (this.GRID_SIZE * index), this.snake.y, this.GRID_SIZE, this.GRID_SIZE ]

      this.ctx.lineWidth = 3
      this.ctx.fillStyle = 'green'
      this.ctx.strokeStyle = '#39ff14'
      this.ctx.fillRect( ...coordinates )
      this.ctx.strokeRect( ...coordinates )
      
      this.snake.tail.push({ x: this.snake.x - (this.GRID_SIZE * index), y: this.snake.y })
    })
  }

  moveSnake() {
    this.snake.x += this.GRID_SIZE * this.snake.dx
    this.snake.y += this.GRID_SIZE * this.snake.dy

    this.snake.tail.unshift({ x: this.snake.x, y: this.snake.y })

    if (this.snake.tail.length > this.snake.startLength) {
      this.snake.tail.pop()
    }
  }

  drawSnake() {
    this.snake.tail.forEach(item => {
      this.ctx.lineWidth = 3
      this.ctx.fillStyle = 'green'
      this.ctx.strokeStyle = '#39ff14'
      this.ctx.fillRect(item.x, item.y, this.GRID_SIZE, this.GRID_SIZE)
      this.ctx.strokeRect(item.x, item.y, this.GRID_SIZE, this.GRID_SIZE)
    })
  }

  drawFood() {
    this.ctx.lineWidth = 1
    this.ctx.fillStyle = 'red'
    this.ctx.strokeStyle = 'darkred'
    this.ctx.fillRect(this.food.x, this.food.y, this.GRID_SIZE, this.GRID_SIZE)
    this.ctx.strokeRect(this.food.x, this.food.y, this.GRID_SIZE, this.GRID_SIZE)
  }

  checkSnakeLocation() {
    if (this.snake.x === 0 || this.snake.x === (this.AREA_WIDTH - this.GRID_SIZE) ||
        this.snake.y === 0 || this.snake.y === (this.AREA_HEIGHT - this.GRID_SIZE)) {
      this.crashed = true

      saveScore(this.score)
      getResults()
    }

    this.snake.tail.slice(1, this.snake.tail.length).forEach(item => {
      if (this.snake.tail[0].x === item.x &&
          this.snake.tail[0].y === item.y) {
        this.crashed = true

        saveScore(this.score)
        getResults()
      }
    })

    if (this.snake.x === this.food.x && this.snake.y === this.food.y) {
      this.snake.tail.push({ x: this.food.x, y: this.food.y })

      this.food.x = this.newFoodPosition('x')
      this.food.y = this.newFoodPosition('y')

      updateScore(this.score += 10)
    }
  }

  newFoodPosition(postiionFor) {
    const coorList = this.snake.tail.map(t => t[postiionFor])
    let pos = this.randomPosition(this.GRID_SIZE, this.AREA_WIDTH - 2 * this.GRID_SIZE)

    while (coorList.includes(pos)) {
      pos = this.randomPosition(this.GRID_SIZE, this.AREA_WIDTH - 2 * this.GRID_SIZE)
    }

    return pos
  }

  changeDirectionListener() {
    window.addEventListener('keydown', ({ keyCode }) => {
      if (keyCode === 37 && this.snake.dx !== 1) {
        this.snake.dx = -1
        this.snake.dy = 0
      }

      if (keyCode === 38 && this.snake.dy !== 1) {
        this.snake.dx = 0
        this.snake.dy = -1
      }

      if (keyCode === 39 && this.snake.dx !== -1) {
        this.snake.dx = 1
        this.snake.dy = 0
      }

      if (keyCode === 40 && this.snake.dy !== -1) {
        this.snake.dx = 0
        this.snake.dy = 1
      }
    })
  }

  startScreen() {
    this.snake.x = this.GRID_SIZE
    this.snake.y = this.GRID_SIZE

    this.createSnake(24)
    this.loop()
  }

  autoChangeDirection() {
    const cels = this.calcAreaSize

    if (this.snake.x === Math.abs(cels - 2 * this.GRID_SIZE) && this.snake.dy === 0) {
      this.snake.dx = 0
      this.snake.dy = 1
    }

    if (this.snake.y === Math.abs(cels - 2 * this.GRID_SIZE) && this.snake.dy === 1) {
      this.snake.dx = -1
      this.snake.dy = 0
    }

    if (this.snake.x === this.GRID_SIZE && this.snake.dx === -1) {
      this.snake.dx = 0
      this.snake.dy = -1
    }

    if (this.snake.y === this.GRID_SIZE && this.snake.dy === -1) {
      this.snake.dx = 1
      this.snake.dy = 0
    }
  }

  fillArea() {
    this.ctx.lineWidth = 26
    this.ctx.strokeStyle = '#4666FF'
    this.ctx.fillStyle = '#000'
    this.ctx.fillRect(0, 0, this.AREA_WIDTH, this.AREA_HEIGHT)
    this.ctx.strokeRect(0, 0, this.AREA_WIDTH, this.AREA_HEIGHT)
  }

  initialValue() {
    this.snake = {
      x: 100,
      y: 100,
      dx: 1,
      dy: 0,
      tail: [],
      startLength: 4
    }

    this.food = {
      x: 260,
      y: 100
    }
  }

  randomPosition(min, max) {
    return Math.round((Math.random() * (max - min) + min) / this.GRID_SIZE) * this.GRID_SIZE
  }

  get calcAreaSize() {
    return Math.floor(window.innerHeight / this.GRID_SIZE) * this.GRID_SIZE
  }
}
