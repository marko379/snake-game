const cvs = document.getElementById('cvs');
const ctx = cvs.getContext('2d');
// add a border to cvs
cvs.style.border = '1px solid #ffffff';

// game colors
let boardColor = '#000000', headColor = '#FFF', bodyColor = '#999'

// cvs dimensions
const width = cvs.width, height = cvs.height;

const scoreEl = document.querySelector('.score');
const highScoreEl = document.querySelector('.high-score');
const gameOverEl = document.querySelector('.game-over');
const playAgainBtn = document.querySelector('.play-again');

const FPS = 1000 / 7;
let gameLoop;
const squareSize = 20;
let gameStarted = false;

let snake = [
  { x: 2, y: 0 }, // Head
  { x: 1, y: 0 }, // Body
  { x: 0, y: 0 }, // Tail
];

// direction
let currentDirection = '';
let directionsQueue = [];
const directions = {
  RIGHT: 'ArrowRight',
  LEFT: 'ArrowLeft',
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
};


// gameLoop = setInterval(frame, FPS);

// draw board
function drawBoard() {
  ctx.fillStyle = boardColor;
  ctx.fillRect(0, 0, width, height);
}

// draw square
function drawSquare(x, y, color) {
  ctx.fillStyle = color;
  // ctx.fillRect(x,y,squareSize,squareSize)
  ctx.fillRect(
    x * squareSize,
    y * squareSize,
    squareSize,
    squareSize
  );

  ctx.strokeStyle = boardColor;
  ctx.strokeRect(
    x * squareSize,
    y * squareSize,
    squareSize,
    squareSize
  );
}

function drawSnake() {
  snake.forEach((square, index) => {
    const color = index === 0 ? headColor : bodyColor;
    drawSquare(square.x, square.y, color);
  });
}


// number of vertical/horizontal squares
const horizontalSq = width / squareSize; // 400/20 => 20
const verticalSq = height / squareSize; // 400/20 => 20

// food
let food = createFood(); // { x : 5, y : 6 }
function createFood() {
  let food = {
    x: Math.floor(Math.random() * horizontalSq),
    y: Math.floor(Math.random() * verticalSq),
  };
  // making sure zmija i hrana nisu na istoj poziciji kada zmija pojede jabuku
  while (
    snake.some((square) => square.x === food.x && square.y === food.y)
  ) {
    food = {
      x: Math.floor(Math.random() * horizontalSq),
      y: Math.floor(Math.random() * verticalSq),
    };
  }
  return food;
}
function drawFood() {
  drawSquare(food.x, food.y, '#F95700');
}

// keyup event lisenter
document.addEventListener('keyup', setDirection);

function setDirection(event) {
  const newDirection = event.key;
  const oldDirection = currentDirection;

      if (
        // this is to prevent to go in oposite directions,if u going right and then you press to go left this part pf the code 
        //  will not """directionsQueue.push(newDirection);""" be executed
        (newDirection === directions.LEFT &&
          oldDirection !== directions.RIGHT) 
        ||
        (newDirection === directions.RIGHT &&
          oldDirection !== directions.LEFT) 
        ||
        (newDirection === directions.UP &&
          oldDirection !== directions.DOWN) 
        ||
        (newDirection === directions.DOWN &&
          oldDirection !== directions.UP)
      ) {
        if (!gameStarted) {
          gameStarted = true;
          gameLoop = setInterval(frame, FPS);
        }
        // remember setDirectons is called only when keyup is pressed
        directionsQueue.push(newDirection); 
      }
}

// let snake = [
//   { x: 2, y: 0 }, // Head
//   { x: 1, y: 0 }, // Body
//   { x: 0, y: 0 }, // Tail
// ];

function moveSnake() {
  if (!gameStarted) return;

  // get head position
  // this will return new object, depence,this is example,  head = { x: 2, y: 0 }
  const head = { ...snake[0] };

  // consume the directions, basicly empty the list
  if (directionsQueue.length) {
    // current direction is same as directionsQueue and then clear up list so directionsQueue list is empty
    currentDirection = directionsQueue.shift();
  }

  // change head postion
  // current direction = directionsQueue.shift(); ... current direction is represented as 'ArrowRight'
  //  directions.RIGHT is represented as'ArrowRight'
  switch (currentDirection) {
    case directions.RIGHT:
      // its all about adding and removing squares
      // head = head(2) + 1 = head(3) snake is moved to 3rd square on board on x line
      // head = { x: 3, y: 0 }
      head.x += 1;
      break;
    case directions.LEFT:
      head.x -= 1;
      break;
    case directions.UP:
      head.y -= 1;
      break;
    case directions.DOWN:
      head.y += 1;
      break;
  }
  //  if snake has eaten food then skip snake.pop() , 
  // if snake has not eaten food then remove tail (last object from the list)
  if (hasEatenFood()) {
    food = createFood();
  } else {
    // remove tail
    snake.pop();
  }

  // unshift new head
  // Add new elements to an array, add head = { x: 3, y: 0 } to snake list
  snake.unshift(head);
}

function hasEatenFood() {
  const head = snake[0];
  return head.x === food.x && head.y === food.y;
}


// score
const initialSnakeLength = snake.length; // 3
let score = 0;
let highScore = localStorage.getItem('high-score') || 0;
function renderScore() {
  score = snake.length - initialSnakeLength;
  scoreEl.innerHTML = `⭐ ${score}`;
  highScoreEl.innerHTML = `🏆 ${highScore}`;
}


// hit wall
function hitWall() {
  const head = snake[0];

  return (
    head.x < 0 ||
    head.x >= horizontalSq ||
    head.y < 0 ||
    head.y >= verticalSq
  );
}

// hit self
function hitSelf() {
  const snakeBody = [...snake];
  // Shift (remove) the first element of the array:
  const head = snakeBody.shift();
  // this will return false or true 
  // check if head has same position as snake body 
  return snakeBody.some(
    (square) => square.x === head.x && square.y === head.y
  );
}

function gameOver() {
  // select score and high score el
  const scoreEl = document.querySelector('.game-over-score .current');
  const highScoreEl = document.querySelector(
    '.game-over-score .high'
  );

  // calculate the high score
  highScore = Math.max(score, highScore);
  localStorage.setItem('high-score', highScore);

  // update the score and high score el
  scoreEl.innerHTML = `⭐ ${score}`;
  highScoreEl.innerHTML = `🏆 ${highScore}`;

  // show game over el
  gameOverEl.classList.remove('hide');
}


// loop
function frame() {
  drawBoard();
  drawFood();
  moveSnake();
  drawSnake();
  renderScore();
  if (hitWall() || hitSelf()) {
    clearInterval(gameLoop);
    gameOver();
  }
}
frame();

// restart the game
playAgainBtn.addEventListener('click', restartGame);
function restartGame() {
  // reset snake length and position
  snake = [
    { x: 2, y: 0 }, // Head
    { x: 1, y: 0 }, // Body
    { x: 0, y: 0 }, // Tail
  ];

  // reset directions
  currentDirection = '';
  directionsQueue = [];

  // hide the game over screen
  gameOverEl.classList.add('hide');

  // reset the gameStarted state to false
  gameStarted = false;

  // re-draw everything
  frame();
}
