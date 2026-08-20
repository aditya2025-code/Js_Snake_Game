const board = document.querySelector('.board')
const startbtn = document.querySelector('.btn-start')
const restartbtn = document.querySelector('.btn-restart')
const modal = document.querySelector('.modal')
const startGameModal = document.querySelector('.start-game')
const gameOverModal = document.querySelector('.game-over')

const highScoreElement = document.querySelector('#high-score')
const scoreElement = document.querySelector('#score')
const timeElement = document.querySelector('#time')


let highScore = localStorage.getItem('HighScore') || 0
let score = 0
let time = `00:00`

highScoreElement.innerHTML = highScore

const blockHeight = 50
const blockWidth = 50

const rows = Math.floor(board.clientHeight / blockHeight)
const cols = Math.floor(board.clientWidth / blockWidth)

const blocks = []

let snake = [
    {
        x: 4, y: 3
    }, {
        x: 4, y: 4
    }, {
        x: 4, y: 5
    }
]

let food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols)
}

let direction = 'right'

let intervalId = null
let timeIntervalId = null

for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const block = document.createElement('div')
        block.classList.add("block")
        board.appendChild(block)

        // block.innerHTML = `${row}:${col}`

        blocks[`${row}:${col}`] = block
    }
}


function generateFood() {

    let newFood

    do {
        newFood = {
            x: Math.floor(Math.random() * rows),
            y: Math.floor(Math.random() * cols)
        }

    } while (
        snake.some(segment =>
            segment.x === newFood.x && segment.y === newFood.y))

    return newFood
}


function render() {

    let head = null

    blocks[`${food.x}:${food.y}`].classList.add("food")


    //DIRECTION CHANGE

    if (direction === 'left') {
        head = { x: snake[0].x, y: snake[0].y - 1 }

    } else if (direction === 'right') {
        head = { x: snake[0].x, y: snake[0].y + 1 }

    } else if (direction === 'down') {
        head = { x: snake[0].x + 1, y: snake[0].y }

    } else if (direction === 'up') {
        head = { x: snake[0].x - 1, y: snake[0].y }
    }


    // FOOD COLLISION

    if (head.x === food.x && head.y === food.y) {

        blocks[`${food.x}:${food.y}`].classList.remove("food")

        food = generateFood()

        blocks[`${food.x}:${food.y}`].classList.add("food")

        snake.unshift(head)

        score += 10
        scoreElement.innerHTML = score

        if (score > highScore) {
            highScore = score
            localStorage.setItem("HighScore", highScore.toString())
            highScoreElement.innerHTML = highScore
        }

        return
    }


    // GAME OVER CHECK

    if (
        head.x < 0 ||
        head.x >= rows ||
        head.y < 0 ||
        head.y >= cols ||

        // Check Snake Touch it's self
        snake.slice(2).some(
            segment =>
                segment.x === head.x &&
                segment.y === head.y
        )
    ) {

        modal.style.display = "flex"
        startGameModal.style.display = "none"
        gameOverModal.style.display = "flex"

        clearInterval(intervalId)
        clearInterval(timeIntervalId)

        return
    }


    // Remove old snake
    snake.forEach(segment => {
        blocks[`${segment.x}:${segment.y}`]
            .classList.remove("fill")
    })


    // Add new head
    snake.unshift(head)

    // Remove tail
    snake.pop()


    // Render new snake
    snake.forEach(segment => {
        blocks[`${segment.x}:${segment.y}`].classList.add("fill")
    })
}


// START GAME

startbtn.addEventListener("click", () => {

    modal.style.display = "none"

    clearInterval(intervalId)
    clearInterval(timeIntervalId)

    intervalId = setInterval(() => {
        render()
    }, 200)

    timeIntervalId = setInterval(() => {

        let [min, sec] = time.split(":").map(Number)

        if (sec === 59) {
            min += 1
            sec = 0
        } else {
            sec += 1
        }

        time = `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
        timeElement.innerHTML = time

    }, 1000)
})


// RESTART

restartbtn.addEventListener("click", restartGame)


function restartGame() {

    clearInterval(intervalId)
    clearInterval(timeIntervalId)

    score = 0
    time = `00:00`

    scoreElement.innerHTML = score
    timeElement.innerHTML = time
    highScoreElement.innerHTML = highScore

    blocks[`${food.x}:${food.y}`]
        .classList.remove("food")

    snake.forEach(segment => {
        blocks[`${segment.x}:${segment.y}`]
            .classList.remove("fill")
    })

    modal.style.display = "none"

    snake = [
        {
            x: 4, y: 3
        }, {
            x: 4, y: 4
        }, {
            x: 4, y: 5
        }
    ]

    food = generateFood()

    timeIntervalId = setInterval(() => {

        let [min, sec] = time.split(":").map(Number)

        if (sec === 59) {
            min += 1
            sec = 0
        } else {
            sec += 1
        }

        time = `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
        timeElement.innerHTML = time

    }, 1000)


    intervalId = setInterval(() => {
        render()
    }, 200)
}



// KEYBOARD CONTROLS

addEventListener("keydown", (event) => {

    if (event.key === "ArrowUp" || event.key.toUpperCase() === "W") {

        if (direction !== "down") {
            direction = "up"
        }

    } else if (event.key === "ArrowDown" || event.key.toUpperCase() === "S") {

        if (direction !== "up") {
            direction = "down"
        }

    } else if (event.key === "ArrowRight" || event.key.toUpperCase() === "D") {
        if (direction !== "left") {
            direction = "right"
        }

    } else if (event.key === "ArrowLeft" || event.key.toUpperCase() === "A") {

        if (direction !== "right") {
            direction = "left"
        }
    }

})