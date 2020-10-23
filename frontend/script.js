const N_SIZE = 4,
  M_SIZE = 3,
  maxTurns = 7, // max allowed no of player
  dx = [0, 0, 1, -1], // 4 directions
  dy = [1, -1, 0, 0],
  colors = [ "red", "blue", "green", "black", "white", "pink", "yellow"];

let currentTurn, // current player
  urTurn, // your turn as a player
  moveCount, // total no of moves
  turns, // no of player
  allJoined, // all player joined or not
  gameRunning, // game currently running or not
  ballCount = new Array(N_SIZE), // counnt of ball in a cell
  ballColor = new Array(N_SIZE), // color of ball in a cell
  validTurn, // array,  player in the game or not
  validPlayer, //array,  player connected in the room or not
  boxes = []; 

/*  matrix functions  */
function drawBoard(){
  for(let i = 0; i < N_SIZE; i++){
    for(let j = 0; j < M_SIZE; j++){
      let cell_id = i+' '+j;
      document.getElementById(cell_id).innerHTML = "" + ballColor[i][j] + ":" + ballCount[i][j];
    }
  }
  for(let i = 0; i < turns; i++)
    document.getElementById(colors[i]).innerHTML = "" + colors[i] + " " + validPlayer[i] + " " + validTurn[i];
}

function validCell(x, y){
  if(x >= 0 && y >= 0 && x < N_SIZE && y < M_SIZE) return true;
  return false;
}

function popBalls(x, y, k){
  ballCount[x][y] -= k;  //console.log(k);
  for(let i = 0; i < 4; i++){
    let n_x = x + dx[i], n_y = y + dy[i];

    if(validCell(n_x, n_y)){
      ballCount[n_x][n_y]++;
      ballColor[n_x][n_y] = ballColor[x][y];
    }
  }
  if(ballCount[x][y] == 0)
    ballColor[x][y] = "";
  exclude();
}

function exclude(){
  for(let t = 0; t < turns; t++){
    if(validTurn[t] == false) continue; // already excluded

    let count = 0;
    for(let i = 0; i < N_SIZE; i++){
      for(let j = 0; j < M_SIZE; j++){
        if(ballColor[i][j] == colors[t]) count++;
      }
    }
    if(count == 0)
      validTurn[t] = false;
  }
}

function winner(){
  if(moveCount < 3) return;

  exclude();
  let playerCount = 0, playerTurn = 0;
  for(let t = 0; t < turns; t++){
    if(validTurn[t])
      playerTurn = t, playerCount++;
  }
  if(playerCount == 1){
    alert('Winner: Player ' + colors[playerTurn] );
    initialiseGame(turns, true); // playing 2nd round with same set of friend
  } 
}

function popChain(){
  drawBoard();
  winner();
  //while(!stable()){ 
    for(let i = 0; i < N_SIZE; i++){
      for(let j = 0; j < M_SIZE; j++){
        if((i == 0 && j == 0) || (i == N_SIZE-1 && j == 0) || 
          (i == 0 && j == M_SIZE-1) || (i == N_SIZE-1 && j == M_SIZE-1)){
          if(ballCount[i][j] >= 2) {
            popBalls(i, j, 2); 
            return; 
          }
        }
        else if(i == 0 || j == 0 || i == N_SIZE-1 || j == M_SIZE-1){
          if(ballCount[i][j] >= 3) {
            popBalls(i, j, 3); 
            return; 
          }
        }
        else{
          if(ballCount[i][j] >= 4){
            popBalls(i, j, 4);
            return; 
          }
        }
      }
    }
  //}winner();
}
/* end of matrix funcions */

/* game funcions */
function initialiseGame(totalPlayer, allJoinedOrNot){ // initialising
  currentTurn = 0; // player 0 starts
  moveCount = 0; 
  allJoined = allJoinedOrNot; // while creating room it will be false, after creating room it shall be true
  turns = totalPlayer; //2; // total no of players in the board
  for(let i = 0; i < N_SIZE; i++)
    for(let j = 0; j < M_SIZE; j++)
      ballColor[i][j] = "", ballCount[i][j] = 0;

  for(let i = 0; i < totalPlayer; i++)
    validTurn[i] = validPlayer[i];
  updateTurn();
}

function updateTurn(){
  if(validTurn[currentTurn] == false){
    for(let i = 1; i < turns; i++){
      currentTurn = (currentTurn+1)%turns;
      if(validTurn[currentTurn]) 
        break;
    }
  }
  document.getElementById('turn').innerHTML = currentTurn+1;
  document.getElementById('color').innerHTML = colors[currentTurn];
}

function createMatrix(){  // creates matrix 
  for(let i = 0; i < N_SIZE; i++)
    ballColor[i] = new Array(M_SIZE),
    ballCount[i] = new Array(M_SIZE);
}

function createBoard(totalPlayer) { // creates board
  validTurn = new Array(totalPlayer);
  validPlayer = new Array(totalPlayer);

  for(let i = 0; i < totalPlayer; i++){
    validTurn[i] = true; validPlayer[i] = true;
  }

  var board = document.createElement('table');
    board.setAttribute("border", 1);
    board.setAttribute("cellspacing", 0);

  for (let i = 0; i < N_SIZE; i++) {
    let row = document.createElement('tr');
    board.appendChild(row);
    for (let j = 0; j < M_SIZE; j++) {
          let cell = document.createElement('td');
          cell.setAttribute('height', 100);
          cell.setAttribute('width', 100);
          cell.setAttribute('align', 'center');

          //changed here
          cell.setAttribute('id',i+' '+j);
      
      //cell.classList.add('col' + j,'row' + i);
      cell.addEventListener("click",updateByYou,false);
      row.appendChild(cell);
      boxes.push(cell);
    }
  }
  document.getElementById("chainReaction").appendChild(board);

  for(let i = 0; i < totalPlayer; i++){
    let cell = document.createElement('div');
    cell.setAttribute('id', colors[i]);
    cell.innerHTML = "" + colors[i] + " " + validPlayer[i];
    document.getElementById('activePlayer').appendChild(cell);
  }
}

function updateByYou() { // add/increment ball to the clicked cell
  if(allJoined == false) return;
  let res = this.id; console.log(res);

  let x = Number(res[0]);
  let y = Number(res[2]); 

  if(urTurn != currentTurn) // if you are not the current player
    return;
  if(ballCount[x][y] != 0 && ballColor[x][y] != colors[currentTurn]) // cell occupied by opponent
    return;
  socket.emit('curGame', res);
} 

function createGame(totalPlayer){
  createMatrix();
  createBoard(totalPlayer);
  initialiseGame(totalPlayer, false);
  setInterval(popChain,300);
}

/*  client function/game screen   */
const socket = io('http://localhost:3000');

socket.on('gameStatus', handleGameStatus);
socket.on('lastJoined', handleAllJoined);
socket.on('gameRun', updateForAll);
socket.on('playerLeft', handlePlayerLeft);
socket.on('unknownCode', handleUnknownCode);
socket.on('roomFull', handleRoomFull);

function handleGameStatus(gameCode, gameTurn, totalPlayer){ // shows game status and board
  document.getElementById('gameCodeDisplay').innerHTML = gameCode;
  document.getElementById('gamePlayer').innerHTML = totalPlayer;

  urTurn = gameTurn-1;
  document.getElementById('yourTurn').innerHTML = urTurn+1;
  document.getElementById('yourColor').innerHTML = colors[urTurn];

  visible();
  createGame(totalPlayer);
}

function handleAllJoined() {
  allJoined = true;
}
function updateForAll(cell_id){
  // update current cell
  let x = Number(cell_id[0]);
  let y = Number(cell_id[2]); 
  ballCount[x][y]++;
  moveCount++;
  ballColor[x][y] = colors[currentTurn]; 
  popChain();
  // update current players turn
  currentTurn = (currentTurn + 1)%turns;
  updateTurn();
}

function handlePlayerLeft(x){ //alert("someone left");
  x--;
  validPlayer[x] = false;
  validTurn[x] = false;
  updateTurn();
}

function handleUnknownCode() {
  hide();
  alert('Unknown Game Code')
}
function handleRoomFull() {
  hide();
  alert('This game is already in progress');
}

/*  helper function/hide+show screen   */ 
const gameScreen = document.getElementById('gameScreen');
const initialScreen = document.getElementById('initialScreen');
function hide() {
  initialScreen.style.display = "block";
  gameScreen.style.display = "none";
}
function visible(){
  initialScreen.style.display = "none";
  gameScreen.style.display = "block";
}

/*  button functions/initial screen */
const newGameBtn = document.getElementById('newGameButton');
const joinGameBtn = document.getElementById('joinGameButton');
const gameCodeInput = document.getElementById('gameCodeInput');
const gamePlayerInput = document.getElementById('gamePlayerInput');

newGameBtn.addEventListener('click', function () {
  let x = gamePlayerInput.value;
  if(2 <= x && x <= 4)
    socket.emit('newGame', x);
  else
    alert("invalid input");
});
joinGameBtn.addEventListener('click', function () {
  const code = gameCodeInput.value;
  socket.emit('joinGame', code);
});