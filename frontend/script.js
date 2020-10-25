const N_SIZE = 4,
      M_SIZE = 3,
      maxTurns = 5, // max allowed no of player
      dx = [0, 0, 1, -1], // 4 directions
      dy = [1, -1, 0, 0],
      colors = [ "red", "blue", "green", "white", "pink", "yellow"];

let   currentTurn, // current player
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

/*  drawing functions   */
function drawStatTable(){
    for(let i = 0; i < turns; i++){
        if(!validPlayer[i])
            document.getElementById(i+"online").innerHTML = "not available";
        else
            document.getElementById(i+"online").innerHTML = "available";
        if(validTurn[i])
            document.getElementById(i+"playing").innerHTML = "playing";
        else
            document.getElementById(i+"playing").innerHTML = "loser";
    }
}
function drawBoard(){
    for(let i = 0; i < N_SIZE; i++){
        for(let j = 0; j < M_SIZE; j++){
            let cell_id = i+' '+j;
            document.getElementById(cell_id).innerHTML = "" + ballColor[i][j] + ":" + ballCount[i][j];
        }
    }
    drawStatTable();
}

/*  matrix functions  */
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
        if(count == 0) validTurn[t] = false;
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
        tempAlert('Winner: Player ' + colors[playerTurn], 2000);
        // initialiseGame(turns, true); // playing 2nd round with same set of friend
    } 
}
function tempAlert(msg,duration){
    var el = document.createElement("div");
    el.innerHTML = msg;
    el.setAttribute("style",
    "position:absolute;top:20%;left:20%;width:70%;height:70%;align:center;background-color:black;color:white");
    setTimeout(function(){
        el.parentNode.removeChild(el); initialiseGame(turns, true);
    },duration);
    document.body.appendChild(el); 
}

function popChain(){
    drawBoard();
    winner();
  //while(!stable()){ 
    for(let i = 0; i < N_SIZE; i++){
        for(let j = 0; j < M_SIZE; j++){
            if((i == 0 && j == 0) || (i == N_SIZE-1 && j == 0)
             || (i == 0 && j == M_SIZE-1) || (i == N_SIZE-1 && j == M_SIZE-1)){
                if(ballCount[i][j] >= 2) {
                    popBalls(i, j, 2); return; 
                }
            }
            else if(i == 0 || j == 0 || i == N_SIZE-1 || j == M_SIZE-1){
                if(ballCount[i][j] >= 3) {
                    popBalls(i, j, 3); return; 
                }
            }
            else{
                if(ballCount[i][j] >= 4){
                    popBalls(i, j, 4); return; 
                }
            }
        }
    }
  //}winner();
}
function createMatrix(){  // creates matrix 
    for(let i = 0; i < N_SIZE; i++){
        ballColor[i] = new Array(M_SIZE);
        ballCount[i] = new Array(M_SIZE);
    }
}
/* end of matrix functions */

/*  game functions   */
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

function updateTurn(){ // updates turn if some players disconnect or loose in the game
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

function createStatTable(totalPlayer){ // creates stat portion of the game
    let onlineBoard = document.createElement('table'); // for player online for the game
    onlineBoard.setAttribute("border", 1);
    for(let i = 0; i < totalPlayer; i++){
        let row = document.createElement('tr');
        onlineBoard.appendChild(row);

        let cell = document.createElement('td');
        cell.setAttribute('align', 'center');
        cell.innerHTML = "" + colors[i];
        row.appendChild(cell);

        cell = document.createElement('td');
        cell.setAttribute('align', 'center');
        cell.setAttribute('id', i + 'online');
        cell.innerHTML = "available";
        row.appendChild(cell);
    }
    document.getElementById('playerOnline').appendChild(onlineBoard);

    let playingBoard = document.createElement('table'); // player actually playing the game
    playingBoard.setAttribute("border", 1);
    for(let i = 0; i < totalPlayer; i++){
        let row = document.createElement('tr');
        playingBoard.appendChild(row);

        let cell = document.createElement('td');
        cell.setAttribute('align', 'center');
        cell.innerHTML = "" + colors[i];
        row.appendChild(cell);

        cell = document.createElement('td');
        cell.setAttribute('align', 'center');
        cell.setAttribute('id', i + 'playing');
        cell.innerHTML = "playing";
        row.appendChild(cell);
    }
    document.getElementById('playerPlaying').appendChild(playingBoard);
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
            cell.setAttribute('height', 80);
            cell.setAttribute('width', 80);
            cell.setAttribute('align', 'center');
            cell.setAttribute('id',i+' '+j);
          
            cell.addEventListener("click",updateByYou,false);
            row.appendChild(cell);
            boxes.push(cell);
        }
    }
    document.getElementById("chainReaction").appendChild(board);
    createStatTable(totalPlayer);
}
function updateByYou() { // add/increment ball to the clicked cell
    if(allJoined == false) return;
    let res = this.id; 

    let x = Number(res[0]), y = Number(res[2]); 

    if(urTurn != currentTurn) // if you are not the current player
      return;
    if(ballCount[x][y] != 0 && ballColor[x][y] != colors[currentTurn]) // cell occupied by opponent
      return;
    socket.emit('curGame', res); //console.log(moveCount);
} 

function createGame(totalPlayer){
    createMatrix(); 
    createBoard(totalPlayer); 
    initialiseGame(totalPlayer, false); 
    setInterval(popChain,200);
}

/*  client function starts  */
// chat and (game+stat) functions
const socket = io('http://localhost:3000');

//  chat functions      //
const chatBox = document.getElementById('chatBox');
const message = document.getElementById('message');
const sendButton = document.getElementById('sendButton');

sendButton.addEventListener('click', function(){
    let msg = message.value;
    if(msg == "") return;
    message.value = "";
    socket.emit('sendMessage', msg);
});

socket.on('connected', function(player) {
    addMessage(colors[player-1] + " connected");
});
socket.on('disconnected', function(player) {
    addMessage(colors[player-1] + " disconnected");
});
socket.on('sentMsg', function(player, msg){
    addMessage(colors[player-1] + " " + msg);
});
function addMessage(message) {
    const msg = document.createElement('div');
    msg.innerText = message;
    chatBox.append(msg);
}
// end of chat functions    //

//  game+stat functions     //
socket.on('gameStatus', handleGameStatus); // creates board for each player
socket.on('lastJoined', handleAllJoined); // indicates if all joined or not for all player
socket.on('gameRun', updateForAll); // updates board for all player
socket.on('playerLeft', handlePlayerLeft); // updates player left for all player
socket.on('unknownCode', handleUnknownCode); // triggers for unknown room
socket.on('roomFull', handleRoomFull); // triggers for full room

function handleGameStatus(gameCode, gameTurn, totalPlayer){ 
    document.getElementById('gameCodeDisplay').innerHTML = gameCode;
    document.getElementById('gamePlayer').innerHTML = totalPlayer;

    urTurn = gameTurn-1;
    document.getElementById('yourTurn').innerHTML = urTurn+1;
    document.getElementById('yourColor').innerHTML = colors[urTurn];

    visible();
    createGame(totalPlayer);
}
function handleAllJoined() { allJoined = true;  }

function updateForAll(cell_id){ 
    let x = Number(cell_id[0]);
    let y = Number(cell_id[2]); 
    ballCount[x][y]++;
    moveCount++;
    ballColor[x][y] = colors[currentTurn]; 
    popChain();
    // update current players turn
    currentTurn = (currentTurn + 1)%turns;
    updateTurn(); // 
}
function handlePlayerLeft(x){ 
    validPlayer[x-1] = false;
    validTurn[x-1] = false;
    updateTurn(); 
}
function handleUnknownCode() {
    hide(); alert('Unknown Game Code');
}
function handleRoomFull() {
    hide(); alert('This game is already in progress');
}

/*  helper function/hide+show screen   */ 
const gameScreen = document.getElementById('gameScreen');
const initialScreen = document.getElementById('initialScreen');
const gameCodeInput = document.getElementById('gameCodeInput');

function hide() {
    initialScreen.style.display = "block";
    gameScreen.style.display = "none";
    gameCodeInput.value = "";
}
function visible(){
    initialScreen.style.display = "none";
    gameScreen.style.display = "block";
}
/*    end of client functions      */

/*  button functions/initial screen */
const newGameBtn = document.getElementById('newGameButton');
const joinGameBtn = document.getElementById('joinGameButton');
const gamePlayerInput = document.getElementById('gamePlayerInput');

newGameBtn.addEventListener('click', function () { // creates new game room
    let playerNo = gamePlayerInput.value;
    socket.emit('newGame', playerNo);
});
joinGameBtn.addEventListener('click', function () { // join into a game room
    const code = gameCodeInput.value;
    socket.emit('joinGame', code);
});