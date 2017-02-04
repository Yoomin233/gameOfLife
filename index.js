// define tools func...
let $ = document.querySelector.bind(document)
// canvas settings...
let canvas = $('canvas')
let ctx = canvas.getContext('2d')
canvas.width = canvas.height = window.innerWidth
ctx.fillStyle = 'black'

// some const...
let options = {
  MAINTAIN_VALUE: 2,
  REBORN_VALUE: 3,
  EVOLVE_TIME: 200
}
let data = {
  generation: 0
}

let father = {
  init (xCount, yCount) {
    // record dimension info
    this.count = {
      xCount,
      yCount
    }
    // each cell's dimension
    this.cellDimension = window.innerWidth / this.count.xCount
    // init cell status
    for (let i = 0; i < yCount; i++) {
      this.status[i] = []
      this.nextStatus[i] = []
      for (let j = 0; j < xCount; j++) {
        this.status[i][j] = false
        this.nextStatus[i][j] = false
      }
    }
  },
  changeStatus (...rest) {
    this.init(this.count.xCount, this.count.yCount)
    let halfWay = Math.floor(this.count.xCount / 2)
    let numArr = []
    rest.forEach((arr) => {
      let [i, j] = arr
      numArr.push(i)
      numArr.push(j)
    })
    let diff = Math.max(...numArr) - Math.min(...numArr)
    rest.forEach((arr) => {
      let [i, j] = arr
      this.status[i - diff + halfWay + 5][j - diff + halfWay + 5] = true
    })
    setTimeout(this.start.bind(this), 1000)
  },
  updateCanvas () {
    ctx.clearRect(0, 0, window.innerWidth, window.innerWidth)
    for (let i = 0; i < this.count.yCount; i++) {
      for (let j = 0; j < this.count.xCount; j++) {
        if (this.status[i][j]) {
          ctx.fillRect(this.cellDimension * j, this.cellDimension * i, this.cellDimension, this.cellDimension)
        }
      }
    }
  },
  evolve () {
    for (let i = 0; i < this.count.yCount; i++) {
      for (let j = 0; j < this.count.xCount; j++) {
        let neighbors = null
        let st = this.status
        // first row
        if (i === 0) {
          // first column
          if (j === 0) {
            neighbors = [st[i][j + 1], st[i + 1][j], st[i + 1][j + 1]]
          // last column
          } else if (j === this.count.xCount - 1) {
            neighbors = [st[i][j - 1], st[i + 1][j - 1], st[i + 1][j]]
          // others
          } else {
            neighbors = [st[i][j - 1], st[i][j + 1], st[i + 1][j - 1], st[i + 1][j], st[i + 1][j + 1]]
          }
        // last row
        } else if (i === this.count.yCount - 1) {
          // first column
          if (j === 0) {
            neighbors = [st[i - 1][j], st[i - 1][j + 1], st[i][j + 1]]
          } else if (j === this.count.xCount - 1) {
            neighbors = [st[i - 1][j - 1], st[i - 1][j], st[i][j - 1]]
          } else {
            neighbors = [st[i - 1][j - 1], st[i - 1][j], st[i - 1][j + 1], st[i][j - 1], st[i][j + 1]]
          }
        // others
        } else {
          if (j === 0) {
            neighbors = [st[i - 1][j], st[i - 1][j + 1], st[i][j + 1], st[i + 1][j], st[i + 1][j + 1]]
          } else if (j === this.count.xCount - 1) {
            neighbors = [st[i - 1][j - 1], st[i - 1][j], st[i][j - 1], st[i + 1][j - 1], st[i + 1][j]]
          } else {
            // debugger
            neighbors = [st[i - 1][j - 1], st[i - 1][j], st[i - 1][j + 1], st[i][j - 1], st[i][j + 1], st[i + 1][j - 1], st[i + 1][j], st[i + 1][j + 1]]
          }
        }
        // judge this cell live or die in NEXT circle
        // debugger
        this.judge(i, j, neighbors)
      }
    }
    // update status
    // debugger
    this.updateStatus()
    this.updateCanvas()
    // draw canvas
  },
  judge (i, j, neighbors) {
    let last = this.status[i][j]
    let livingNeighborsCount = neighbors.reduce((a, b) => {
      return a + b
    })
    if (last) {
      if (livingNeighborsCount < 2) {
        this.nextStatus[i][j] = false
      } else if (livingNeighborsCount === 2 || livingNeighborsCount === 3) {
        this.nextStatus[i][j] = last
      } else if (livingNeighborsCount > 3) {
        this.nextStatus[i][j] = false
      }
    } else {
      if (livingNeighborsCount === 3) {
        this.nextStatus[i][j] = true
      }
    }
  },
  updateStatus () {
    let livingCells = 0
    for (let i = 0; i < this.count.yCount; i++) {
      for (let j = 0; j < this.count.xCount; j++) {
        this.status[i][j] = this.nextStatus[i][j]
        if (this.status[i][j]) {
          livingCells++
        }
      }
    }
    data.generation ++
    $('p.generation').textContent = 'Generation: ' + data.generation
    $('p.livingCells').textContent = 'Living cells count: ' + livingCells
    if (!livingCells) {
      this.pause()
      $('p.generation').textContent = 'dead end!'
    }
  },
  start () {
    clearTimeout(this.timer)
    this.timer = setInterval(this.evolve.bind(this), options.EVOLVE_TIME)
  },
  pause () {
    clearTimeout(this.timer)
  }
}
let son = Object.create(father)
son.status = []
son.nextStatus = []
son.count = son.cellDimension = null
son.init(30, 30)
// bind listeners
$('button.start').addEventListener('click', (e) => {
  son.start()
})
$('button.pause').addEventListener('click', (e) => {
  son.pause()
})
$('button.clear').addEventListener('click', (e) => {
  son.pause()
  son.init(son.count.xCount, son.count.yCount)
  son.updateCanvas()
})
$('input.evolveTime').addEventListener('change', (e) => {
  options.EVOLVE_TIME = Number(e.target.value)
})
$('select#size').addEventListener('change', (e) => {
  let val = Number(e.target.value)
  son.pause()
  son.init(val, val)
  son.updateCanvas()
})
$('select#size').value = '30'
$('select#mode').addEventListener('change', (e) => {
  son.pause()
  data.generation = 0
  switch (Number(e.target.value)) {
    case 0:
      son.init(son.count.xCount, son.count.yCount)
      canvas.addEventListener('touchstart', (e) => {
        touchHandler(e)
      })
      break
    case 1:
      son.changeStatus([1, 2], [2, 4], [3, 1], [3, 2], [3, 5], [3, 6], [3, 7])
      break
    case 2:
      son.changeStatus([2, 2], [2, 3], [3, 2], [3, 3], [4, 4], [4, 5], [5, 4], [5, 5])
      break
    case 3:
      son.changeStatus([1, 7], [2, 1], [2, 2], [3, 2], [3, 6], [3, 7], [3, 8])
      break
    case 4:
      son.changeStatus([1, 1], [1, 2], [1, 3], [2, 1], [2, 2], [2, 3], [3, 1], [3, 2], [3, 3], [4, 4], [4, 5], [4, 6], [5, 4], [5, 5], [5, 6], [6, 4], [6, 5], [6, 6])
      break
    case 5:
      son.changeStatus([1, 2], [1, 8], [2, 1], [2, 3], [2, 7], [2, 9], [3, 1], [3, 4], [3, 6], [3, 9], [4, 3], [4, 7], [5, 3], [5, 4], [5, 6], [5, 7])
      break
    case 6:
      son.changeStatus([1, 3], [1, 4], [1, 5], [2, 2], [2, 6], [3, 1], [3, 7], [4, 1], [4, 7], [5, 4], [6, 2], [6, 6], [7, 3], [7, 4], [7, 5], [8, 4], [11, 5], [11, 6], [11, 7], [12, 5], [12, 6], [12, 7], [13, 4], [13, 8], [15, 3], [15, 4], [15, 8], [15, 9])
  }
  son.updateCanvas()
})
// touches handler
canvas.addEventListener('touchstart', (e) => {
  touchHandler(e)
})
canvas.addEventListener('touchmove', (e) => {
  touchHandler(e)
})
function touchHandler (e) {
  e.preventDefault()
  let cordX = e.touches[0].clientX
  let cordY = e.touches[0].clientY
  let i = Math.floor(cordY / son.cellDimension)
  let j = Math.floor(cordX / son.cellDimension)
  son.status[i][j] = true
  son.updateCanvas()
}

// layout handling...
$('div.guide span').addEventListener('click', (e) => {
  $('div.guide').style.display = 'none'
  let notShowAgain = $('input#showAgain').checked
  if (notShowAgain) {
    window.localStorage.notShowAgain = 'true'
  }
})
// if show guide dialog...
if (!window.localStorage.notShowAgain) {
  $('div.guide').style.display = 'block'
}
$('div.rules span').addEventListener('click', (e) => {
  let target = $('div.rules')
  let duration = parseFloat(window.getComputedStyle(target).transitionDuration) * 1000
  target.style.top = '10vw'
  target.style.opacity = 0
  setTimeout(() => {
    target.style.display = 'none'
  }, duration)
})
$('div.rules').addEventListener('click', (e) => {
  $('div.rules span').click()
})
$('div.rulesTrigger').addEventListener('click', (e) => {
  let target = $('div.rules')
  target.style.display = 'block'
  setTimeout(() => {
    target.style.opacity = 1
    target.style.top = '5vw'
  }, 50)
})
