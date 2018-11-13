import Snake from './snake'

export default () => {
  const startBtn = document.getElementById('startButton')
  const newGameBtn = document.getElementById('newGameButton')
  const pauseBtn = document.getElementById('pauseButton')
  const resumeBtn = document.getElementById('resumeButton')
  const startScreen = document.getElementById('startScreen')
  // const scoreList = document.getElementById('scoreListButton')
  const snake = new Snake()

  const switchButtons = switches => {
    [startBtn, newGameBtn, pauseBtn, resumeBtn, startScreen].forEach((item, index) => {
      if (switches[index]) {
        item.classList.remove('hide')
      } else {
        item.classList.add('hide')
        item.classList.remove('controlls__btn--active')
      }
    })
  }

  snake.init()

  startBtn.addEventListener('click', () => {
    snake.start()
    switchButtons([0, 1, 1, 0, 0])

    startScreen.classList.add('hide')
  })

  newGameBtn.addEventListener('click', () => {
    snake.start()

    switchButtons([0, 1, 1, 0, 0])
  })

  pauseBtn.addEventListener('click', () => {
    snake.pause()
    switchButtons([0, 1, 0, 1, 1])
    resumeBtn.classList.add('controlls__btn--active')
  })

  resumeBtn.addEventListener('click', () => {
    snake.resume()
    switchButtons([0, 1, 1, 0, 0])
  })
}
