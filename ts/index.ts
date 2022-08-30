// main target
class MainTarget {
  element: HTMLElement
  targetHead: HTMLElement
  targetBody: HTMLCollection
  outerBox: HTMLElement

  constructor () {
    this.outerBox = document.querySelector('.game-box') as HTMLElement
    this.element = document.querySelector('.main-target') as HTMLElement
    this.targetHead = document.querySelector('.main-target > .first') as HTMLElement
    this.targetBody = this.element?.getElementsByTagName('div') as HTMLCollection
  }

  get X () {
    return this.targetHead.offsetLeft
  }

  set X (value: number) {
    if (this.X === value) return
    if (value < 0 || value > this.outerBox.getBoundingClientRect().width) throw new Error('撞牆！')
    if (this.targetBody[1] && (this.targetBody[1] as HTMLElement).offsetLeft === value) {
      if (value > this.X) value = this.X - 10
      else value = this.X + 10
    }
    this.targetHead.style.left = value + 'px'
  }

  get Y () {
    return this.targetHead.offsetTop
  }

  set Y (value: number) {
    if (this.Y === value) return
    if (value < 0 || value > this.outerBox.getBoundingClientRect().width) throw new Error('撞牆！')
    if (this.targetBody[1] && (this.targetBody[1] as HTMLElement).offsetTop === value) {
      if (value > this.Y) value = this.Y - 10
      else value = this.Y + 10
    }
    this.targetHead.style.top = value + 'px'
  }

  addBody () {
    const div: HTMLElement = document.createElement('div')
    this.element.insertAdjacentElement('beforeend', div)
  }

  moveBody () {
    for (let i = this.targetBody.length - 1; i > 0; i--) {
      const newY = (this.targetBody[i - 1] as HTMLElement).offsetTop as number
      const newX = (this.targetBody[i - 1] as HTMLElement).offsetLeft as number
      (this.targetBody[i] as HTMLElement).style.left = newX + 'px' as string
      (this.targetBody[i] as HTMLElement).style.top = newY + 'px' as string
    }
  }

  checkBody () {
    for (let i = 1; i < this.targetBody.length; i++) {
      const body = this.targetBody[i] as HTMLElement
      if (this.X === body.offsetLeft && this.Y === body.offsetTop) {
        throw new Error('撞自己！')
      }
    }
  }
}

// point
class PointItem {
  element: HTMLElement

  constructor () {
    this.element = document.querySelector('.point') as HTMLElement
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
  score: number
  level: number
  scoreEle: HTMLElement
  levelEle: HTMLElement
  maxLevel: number
  upScore: number

  constructor (maxLevel = 10, upScore = 1) {
    this.score = 0
    this.level = 1
    this.scoreEle = document.querySelector('.score span') as HTMLElement
    this.levelEle = document.querySelector('.level span') as HTMLElement
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
    const lvColor: {[key: string]: string} = {
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
      const target1 = document.querySelector('.game-container') as HTMLElement
      const target2 = document.querySelector('.main-target .first') as HTMLElement
      target1.style.setProperty('border-color', lvColor[`lv${this.level}`])
      target2.style.setProperty('background-color', lvColor[`lv${this.level}`])
    }
  }
}

// control
class GameControl {
  mainTarget: MainTarget
  pointItem: PointItem
  gameRecord: GameRecord
  keyCode = 39 || 40
  isLive = true

  constructor () {
    this.mainTarget = new MainTarget()
    this.pointItem = new PointItem()
    this.gameRecord = new GameRecord()
  }

  init () {
    document.addEventListener('keydown', this.keydownHandler.bind(this))
    this.move()
  }

  keydownHandler (e: KeyboardEvent) {
    this.keyCode = e.keyCode
  }

  move () {
    let newX:number = this.mainTarget.X
    let newY:number = this.mainTarget.Y

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
        alert('GAME OVER ' + (err.message as string))
      }
      this.isLive = false
    }

    this.isLive && setTimeout(this.move.bind(this), 250 - ((this.gameRecord.level - 1) * 20))
  }

  getPoint (newX: number, newY: number) {
    if (this.pointItem.X === newX && this.pointItem.Y === newY) {
      this.pointItem.randomPosition()
      this.gameRecord.addScore()
      this.mainTarget.addBody()
    }
  }
}

const game = new GameControl()
const timerT = document.querySelector('.timer-t') as HTMLElement
const startGame = ():void => {
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
