document.addEventListener('DOMContentLoaded', function() {

document.addEventListener("keydown",moveSnake )

const squares = document.querySelectorAll('.grid div')
const start = document.querySelector('.start')
const score = document.querySelector('.apples')

currentSnake = [59,58,57,56,55,54]
initallSnake = [59,58,57,56,55,54]
direction = 1
num = 1
scoring = 0


start.addEventListener('click',startGame)


function startGame() {
  num ++
  if(num % 2 === 0){
    initallSnake.forEach(function(item){
      squares[item].classList.remove('snake')
    });

    initallSnake.forEach(function(item){
      squares[item].classList.add('snake')
    }); 
    const go = setInterval(repeat,100)
  }
  else{
    location.reload()
  }

}




// remember , its all about tail and head, they dictate the direction of the whole snake, nothing between head 
// and tail is not important
function repeat(){
  const tail = currentSnake.pop()
  currentSnake.unshift(currentSnake[0] + direction)
  head = currentSnake[0]
  wallHit(direction,head)
  squares[head].classList.add('snake')
  squares[tail].classList.remove('snake')
  gettingApple(head,tail)
  randomApple(head)
  hitItSelf(head,currentSnake)


  

}



function moveSnake(event){
  const keyDirection  = event.key
  if (keyDirection === 'ArrowRight' && direction !== -1){
    direction = +1
  }
  if (keyDirection === 'ArrowLeft' && direction !== +1){
    direction = -1
  }
  if (keyDirection === 'ArrowUp' && direction !== +40){
    direction = -40
  }
  if (keyDirection === 'ArrowDown' && direction !== -40){
    direction = +40
  }

}


function wallHit(direction,head){
  if(direction === 1 && head  % 40 === 0){
    location.reload()
  }
  else if(direction === 40 && head > 1599 ){
    location.reload()
  }
  else if(direction === -40 && head < 0 ){
    location.reload()
  }
  else if(direction === -1 && (head +1 )  % 40 === 0 ){
    console.log(direction)
    location.reload()
  }
}

function hitItSelf(head,rep){
  rep.forEach(function(s,index){
    if(index > 0 && head === s){
      location.reload()
    }
  })
}


function gettingApple(head,tail){
  if(squares[head].classList.contains('apple')){
    newTail = tail
    currentSnake.push(newTail)
    squares[newTail].classList.add('snake')

  }
}


function trackScore(){
  scoring ++
  score.innerText = scoring

}


function randomApple(head) {
  if (squares[head].classList.contains('apple')){
     trackScore(scoring)
    squares[head].classList.remove('apple')
    do{
      appleIndex = Math.floor(Math.random() * squares.length)
    } 
    while(squares[appleIndex].classList.contains('snake')) //making sure apples dont appear on the snake

    squares[appleIndex].classList.add('apple')
  }
}





})