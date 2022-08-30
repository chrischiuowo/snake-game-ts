'use strict'
// main target
class MainTarget {
  constructor () {
    let _a
    this.outerBox = document.querySelector('.game-box')
    this.element = document.querySelector('.main-target')
    this.targetHead = document.querySelector('.main-target > .first')
    this.targetBody = (_a = this.element) === null || _a === void 0 ? void 0 : _a.getElementsByTagName('div')
  }

  get X () {
    return this.targetHead.offsetLeft
  }

  set X (value) {
    if (this.X === value) { return }
    if (value < 0 || value > this.outerBox.getBoundingClientRect().width) { throw new Error('撞牆！') }
    if (this.targetBody[1] && this.targetBody[1].offsetLeft === value) {
      if (value > this.X) { value = this.X - 10 } else { value = this.X + 10 }
    }
    this.targetHead.style.left = value + 'px'
  }

  get Y () {
    return this.targetHead.offsetTop
  }

  set Y (value) {
    if (this.Y === value) { return }
    if (value < 0 || value > this.outerBox.getBoundingClientRect().width) { throw new Error('撞牆！') }
    if (this.targetBody[1] && this.targetBody[1].offsetTop === value) {
      if (value > this.Y) { value = this.Y - 10 } else { value = this.Y + 10 }
    }
    this.targetHead.style.top = value + 'px'
  }

  addBody () {
    const div = document.createElement('div')
    this.element.insertAdjacentElement('beforeend', div)
  }

  moveBody () {
    for (let i = this.targetBody.length - 1; i > 0; i--) {
      const newY = this.targetBody[i - 1].offsetTop
      const newX = this.targetBody[i - 1].offsetLeft
      this.targetBody[i].style.left = newX + 'px'
      this.targetBody[i].style.top = newY + 'px'
    }
  }

  checkBody () {
    for (let i = 1; i < this.targetBody.length; i++) {
      const body = this.targetBody[i]
      if (this.X === body.offsetLeft && this.Y === body.offsetTop) {
        throw new Error('撞自己！')
      }
    }
  }
}
// point
class PointItem {
  constructor () {
    this.element = document.querySelector('.point')
  }

  get X () {
    return this.element.offsetLeft
  }

  get Y () {
    return this.element.offsetTop
  }

  randomPosition () {
    const left = Math.floor(Math.random() * 30) * 10
    const top = Math.floor(Math.random() * 30) * 10
    this.element.style.left = left + 'px'
    this.element.style.top = top + 'px'
  }
}
// record
class GameRecord {
  constructor (maxLevel = 10, upScore = 1) {
    this.score = 0
    this.level = 1
    this.scoreEle = document.querySelector('.score span')
    this.levelEle = document.querySelector('.level span')
    this.maxLevel = maxLevel
    this.upScore = upScore
  }

  addScore () {
    this.score += 10
    this.scoreEle.innerHTML = this.score + ''
    if (this.score % (this.upScore * 10) === 0) {
      this.levelUp()
    }
  }

  levelUp () {
    const lvColor = {
      lv1: 'red',
      lv2: 'orange',
      lv3: 'yellow',
      lv4: 'green',
      lv5: 'blue',
      lv6: 'darkBlue',
      lv7: 'purple',
      lv8: 'pink',
      lv9: 'deepPink',
      lv10: 'fuchsia'
    }
    if (this.level < this.maxLevel) {
      this.levelEle.innerHTML = ++this.level + ''
      const target1 = document.querySelector('.game-container')
      const target2 = document.querySelector('.main-target .first')
      target1.style.setProperty('border-color', lvColor[`lv${this.level}`])
      target2.style.setProperty('background-color', lvColor[`lv${this.level}`])
    }
  }
}
// control
class GameControl {
  constructor () {
    this.keyCode = 39 || 40
    this.isLive = true
    this.mainTarget = new MainTarget()
    this.pointItem = new PointItem()
    this.gameRecord = new GameRecord()
  }

  init () {
    document.addEventListener('keydown', this.keydownHandler.bind(this))
    this.move()
  }

  keydownHandler (e) {
    this.keyCode = e.keyCode
  }

  move () {
    let newX = this.mainTarget.X
    let newY = this.mainTarget.Y
    switch (this.keyCode) {
      // up
      case 38:
        newY -= 10
        break
        // down
      case 40:
        newY += 10
        break
        // left
      case 37:
        newX -= 10
        break
        // right
      case 39:
        newX += 10
        break
    }
    this.getPoint(newX, newY)
    this.mainTarget.moveBody()
    try {
      this.mainTarget.X = newX
      this.mainTarget.Y = newY
      this.mainTarget.checkBody()
    } catch (err) {
      if (err instanceof Error) {
        alert('GAME OVER ' + err.message)
      }
      this.isLive = false
    }
    this.isLive && setTimeout(this.move.bind(this), 250 - ((this.gameRecord.level - 1) * 20))
  }

  getPoint (newX, newY) {
    if (this.pointItem.X === newX && this.pointItem.Y === newY) {
      this.pointItem.randomPosition()
      this.gameRecord.addScore()
      this.mainTarget.addBody()
    }
  }
}
const game = new GameControl()
const timerT = document.querySelector('.timer-t')
const startGame = () => {
  let num = 3
  timerT.innerHTML = num + ''
  const timer = setInterval(function () {
    num = num - 1
    timerT.innerHTML = num + ''
    if (num <= 0) {
      clearInterval(timer)
      timerT.style.display = 'none'
      game.init()
    }
  }, num * 200)
}
startGame()
