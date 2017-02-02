// define tools func...
let $ = document.querySelector.bind(document)
// canvas settings...
let canvas = $('canvas'), ctx = canvas.getContext('2d')
canvas.width = canvas.height = innerWidth
ctx.fillStyle = 'black'

// some const...
let options = {
  MAINTAIN_VALUE: 2, 
  REBORN_VALUE: 3, 
  EVOLVE_TIME: 500
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
    this.cellDimension = innerWidth / this.count.xCount
    // init cell status
    for (let i = 0; i < yCount; i ++) {
      this.status[i] = []
      this.nextStatus[i] = []
      for (let j = 0; j < xCount; j ++) {
        this.status[i][j] = false
        this.nextStatus[i][j] = false
      }
    }
  },
  changeStatus (...rest) {
    this.init(this.count.xCount, this.count.yCount)
    rest.forEach((arr) => {
      let [i,j] = arr
      this.status[i - 1][j - 1] = true
    })
  },
  updateCanvas () {
    ctx.clearRect(0, 0, innerWidth, innerWidth)
    for (let i = 0; i < this.count.yCount; i ++) {
      for (let j = 0; j < this.count.xCount; j ++ ) {
        if (this.status[i][j]) {
          ctx.fillRect(this.cellDimension * j, this.cellDimension * i, this.cellDimension, this.cellDimension)
        }
      }
    }
  },
  evolve () {
    for (let i = 0; i < this.count.yCount; i ++ ) {
      for (let j = 0; j < this.count.xCount; j ++) {
        let neighbors = null, st = this.status
        // first row
        if (i === 0) {
          // first column
          if (j === 0) {
            neighbors = [st[i][j+1], st[i+1][j], st[i+1][j+1]]
          // last column
          } else if (j === this.count.xCount - 1) {
            neighbors = [st[i][j-1], st[i+1][j-1], st[i+1][j]]
          // others
          } else {
            neighbors = [st[i][j-1], st[i][j+1], st[i+1][j-1], st[i+1][j], st[i+1][j+1]]
          }
        // last row
        } else if (i === this.count.yCount - 1) {
          // first column
          if (j === 0) {
            neighbors = [st[i-1][j], st[i-1][j+1], st[i][j+1]]
          } else if (j === this.count.xCount - 1) {
            neighbors = [st[i-1][j-1], st[i-1][j], st[i][j-1]]
          } else {
            neighbors = [st[i-1][j-1], st[i-1][j], st[i-1][j+1], st[i][j-1], st[i][j+1]]
          }
        // others
        } else {
          if (j === 0) {
            neighbors = [st[i-1][j], st[i-1][j+1], st[i][j+1], st[i+1][j], st[i+1][j+1]]
          } else if (j === this.count.xCount - 1) {
            neighbors = [st[i-1][j-1], st[i-1][j], st[i][j-1], st[i+1][j-1], st[i+1][j]]
          } else {
            // debugger
            neighbors = [st[i-1][j-1], st[i-1][j], st[i-1][j+1], st[i][j-1], st[i][j+1], st[i+1][j-1], st[i+1][j], st[i+1][j+1]]
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
          livingCells ++
        }
      }
    }
    data.generation ++
    $('p.generation').textContent = 'Generation: ' + data.generation
    $('p.livingCells').textContent = 'Living cells count: ' + livingCells
  }
}
let son = Object.create(father)
son.status = []
son.nextStatus = []
son.count = son.cellDimension = null
son.init(30, 30)
son.changeStatus([2,2],[2,3],[3,2],[3,3],[4,4],[4,5],[5,4],[5,5])
son.updateCanvas()
// bind listeners
$('button.start').addEventListener('click', (e) => {
  clearTimeout(son.timer)
  son.timer = setInterval(son.evolve.bind(son), options.EVOLVE_TIME)
})
$('button.pause').addEventListener('click', (e) => {
  clearTimeout(son.timer)
})
$('input.evolveTime').addEventListener('change', (e) => {
  options.EVOLVE_TIME = Number(e.target.value)
})