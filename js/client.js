const N_SIZE = 9,
M_SIZE = 6,
alongX = 70, //distance between 2 lines along X axis
alongY = 60, //distance between 2 lines along Y axis
maxTurns = 4, // max allowed no of player
dx = [-1, 0, 1, 0], // 4 directions
dy = [ 0, 1, 0,-1],
colors = [ "red", "blue", "green","yellow"];

let c, // canvas
burstSound, // pop sound  
currentTurn, // current player
urTurn, // your turn as a player
moveCount, // total no of moves
turns, // no of player
allJoined = false, // all player joined or not
gameRunning, // game currently running or not
validTurn, // array,  player in the game or not
validPlayer, //array,  player connected in the room or not
boxes = [],
ballCount, // 2d array to count the balls
ballColor, // 2d array to store the Color of a cell
pointerMap,//map cell index to canvas coordinate 
unstableBalls; // this 3Darray will store ball objects and the directions they need to go when they are unstable

//////////////////////FRONTEND STARTS HERE/////////////////////////////////////////////////////////////

function preload()
{
    //burstSound = loadSound("../sound/burstSound.mp3"); // Bad sound ;(
}
// to setup the board .. 
function setup() 
{
	 newGame();
	 let board = select('#board');
	 c = createCanvas(435,555,WEBGL);
	 c.parent(board);

   pointerMapInit();
}


//this draw function is unique to p5.js .. It executes repeatedly.
//So all drawing goes here..
function draw()
{
	background(0);
	pointLight(250, 250, 250,-c.width/2,-c.height/2,5);
	pointLight(250, 250, 250,c.width/2,-c.height/2,5);
	pointLight(250, 250, 250,c.width/2,c.height/2,5);
	//pointLight(250, 250, 250,0,0,5);
	translate(-c.width/2,-c.height/2);
	
	findUnstableCell();
	
	drawGrid();

	for(var i = 0; i< N_SIZE;i++)
	{
		 for(var j = 0;j< M_SIZE;j++)
		 {
            drawBall(i,j);
		 }
	}
	drawUnstableBalls(); //animation of ball movement
	findUnstableCell();  
	drawStatTable(); 	
	//exclude();
}
function drawStatTable(){
	for(let i = 0; i < turns; i++){
		if(!validPlayer[i])
			document.getElementById(i+"online").innerHTML = "not available";
		else
			document.getElementById(i+"online").innerHTML = "available";
		if(validTurn[i])
			document.getElementById(i+"playing").innerHTML = "playing";
		else
			document.getElementById(i+"playing").innerHTML = "not playing";
	}
}
function pointerMapInit()// used to initialize the pointerMap Variable.
{
	pointerMap = new Array(N_SIZE);
    for(var i = 0;i < N_SIZE;i++)
	pointerMap[i] = new Array(M_SIZE);
	
	var x = function()
	{
		if(random(-1.0,1.0) < 0)
			return -0.01;
		else
			return 0.01;
	};

	for(let i = 0;i <= N_SIZE;i++)
	{
		for(let j = 0;j<=M_SIZE;j++)
		{			 
			if(i < N_SIZE && j < M_SIZE)
			 {

			 	pointerMap[i][j] = {
			 		factorX: x(),
			 		factorY: x(),
			 		factorZ: x(),
			 		startX: j*alongX,
			 		startY: i*alongY,
			 		endX: j*alongX+alongX,
			 		endY: i*alongY+alongY,  
			 	};
			 }
		}
	}
}


function mouseToCellIndex() // get the index of the cell from the mouse click
{
    let x = mouseX;
    let y = mouseY;
    var ans;
    for(var i = 0; i < N_SIZE;i++)
    {
    	 for(var j = 0;j < M_SIZE;j++)
    	 {
    	 	 if(x >= pointerMap[i][j].startX && x<= pointerMap[i][j].endX)
    	 	 {
    	 	 	if(y >= pointerMap[i][j].startY && y<= pointerMap[i][j].endY)
    	 	 	{
    	 	 		//console.log(i,j,x,y);
    	 	 		return {cellX:i,cellY:j};
    	 	 	}
    	 	 }
    	 }
    }
    return undefined;	
}


function drawGrid() //Draw grid
{
	for(let i = 0;i <= N_SIZE;i++)
	{
		for(let j = 0;j <= M_SIZE;j++)
		{
			 noFill();
			 strokeWeight(2);
             let idx = Math.floor(random(0,1.0006));
             if(idx == 1)
			 stroke('white');
			 else
			 stroke('green');	
			 if(i != N_SIZE && j != M_SIZE){
			   rect(j*alongX,i*alongY,alongX,alongY);
			   rect(j*alongX+13,i*alongY+13,alongX-2,alongY-2);
			  }
			  line(j*alongX,i*alongY,j*alongX+13,i*alongY+13); 
		}
	}
}


function drawBall(x,y) //used to draw all balls called inside draw()
{
	let startX = pointerMap[x][y].startX;
	let endX = pointerMap[x][y].endX;
	let startY = pointerMap[x][y].startY;
	let endY = pointerMap[x][y].endX;
	let factorX = pointerMap[x][y].factorX;
	let factorY = pointerMap[x][y].factorY;
	let factorZ = pointerMap[x][y].factorZ;
	let X = startX+alongX/2;let Y = startY+alongY/2;
	//ellipse(startX+35,startY+30,30,30);

    let color = ballColor[x][y];
    //console.log(X,Y,color,ballCount[x][y]);
    let vibrateX,vibrateY;
 
    fill(color);
	noStroke();
    if(ballCount[x][y] == 1)
    {
       vibrateX = random(-0.2,0.9);
       vibrateY = random(-0.1,0.5);
       translate(X+vibrateY,Y+vibrateY);
       sphere(14);
       translate(-(X+vibrateY),-(Y+vibrateY));
           
    }
    else if(ballCount[x][y] == 2)
    {
       push();
       vibrateX = random(-0.05,0.05);
       vibrateY = random(-0.1,0.1);
       translate(X+vibrateY-8,Y+vibrateY);
       rotateZ(frameCount * factorZ);
       rotateY(frameCount * factorY);
	   rotateX(frameCount * factorX);
	   sphere(14);
	   translate(16,0);
	   sphere(14);
	   translate(-16,0);
       translate(-(X+vibrateY-8),-(Y+vibrateY));
       pop();
    }
    else if(ballCount[x][y] == 3)
    {
    	push();
    	vibrateX = random(-0.1,1.5);
        vibrateY = random(-0.1,1.5);
		translate(X+vibrateX-8,Y+vibrateY);
		rotateZ(frameCount * factorZ);
		rotateY(frameCount * factorY);
		rotateX(frameCount * factorX);
		sphere(14);
		translate(16,0);
		rotateZ(frameCount * factorZ);
		rotateY(frameCount * factorY);
		rotateX(frameCount * factorX);
		sphere(14);
		translate(-8,8);
		rotateZ(frameCount * factorZ);
		rotateY(frameCount * factorY);
		rotateX(frameCount * factorX);
		sphere(14);
		translate(8,-8);
		translate(-16,0);
		translate(-(X+vibrateX-8),-(Y+vibrateY));
        pop();
    }
    else if(ballCount[x][y] >= 4)
    {
        push();
        vibrateX = random(-0.1,1.5);
        vibrateY = random(-0.1,1.5);
		translate(X+vibrateX-8,Y+vibrateY);
		rotateZ(frameCount * factorZ);
		rotateY(frameCount * factorY);
		rotateX(frameCount * factorX);
		sphere(14);
		translate(16,0);
		rotateZ(frameCount * factorZ);
		rotateY(frameCount * factorY);
		rotateX(frameCount * factorX);
		sphere(14);
		translate(-8,8);
		rotateZ(frameCount * factorZ);
		rotateY(frameCount * factorY);
		rotateX(frameCount * factorX);
		sphere(14);
		rotateZ(frameCount * factorZ);
		rotateY(frameCount * factorY);
		rotateX(frameCount * factorX);
		translate(0,-16);
		sphere(14);
		pop();
    }
}

function validCell(x, y){
  if(x >= 0 && y >= 0 && x < N_SIZE && y < M_SIZE) return true;
  return false;
}

function isUnstable(x,y) // to check if the cell is unstable.
{
	if((x == 0 && y == 0) || (x == 0 && y == M_SIZE-1) || (x == N_SIZE-1 && y == M_SIZE-1) || (x == N_SIZE-1 && y == 0))
	  {
		  if(ballCount[x][y] > 1)
		  return true
		  return false;
	  }
	else if(x>=1 && x <= N_SIZE-2 && y>=1 && y<=M_SIZE-2)
	 {
		 if(ballCount[x][y] > 3)
		  return true;
		  return false;
	 }
	 else if(ballCount[x][y] > 2)
	 {
          return true;
	 }
	 else
	 {
		 return false;
	 }  	
}

function findUnstableCell() //to find all unstable cells and put the unstable balls in unstableBall array.
{
	 for(var i = 0; i < N_SIZE;i++)
	 {
		 for(var j = 0;j< M_SIZE;j++)
		 {
			  if(isUnstable(i,j))
			  {
				 ballCount[i][j] = 0; 
				 makeUnstableBalls(i,j);
			  }
		 }
	 }
}

function makeUnstableBalls(x,y) //make temporary balls for pop animation
{
    let a,b; 
	for(let i = 0;i < 4;i++)
	{
		 a = x+dx[i];
		 b = y+dy[i];
		 if(validCell(a,b))
		 {
			 var Ball = {
				signX: (a-x),
				signY: (b-y), 
				moveX: alongX,
				moveY: alongY,
				currX: pointerMap[x][y].startX+alongX/2.0,
				currY: pointerMap[x][y].startY+alongY/2.0,
				newX: a,
				newY: b, 
				color: ballColor[x][y],
			 };
			 unstableBalls[x][y][i] = Ball;
		 }
	}
}

function drawUnstableBalls() //used to draw the temporary balls on grid
{
	winner();
	var Fact = 4;
	for(var x = 0; x < N_SIZE;x++)
	{
		for(var y = 0;y < M_SIZE;y++)
		{
			for(var z = 0;z < 4;z++)
			{
				if(unstableBalls[x][y][z] == 0){
					continue;
				 }
				 else if(unstableBalls[x][y][z].moveX <=0 && unstableBalls[x][y][z].moveY <= 0)
				 {
					  //burstSound.play();
					  let X = unstableBalls[x][y][z].newX;let Y = unstableBalls[x][y][z].newY;
					  ballColor[X][Y] = unstableBalls[x][y][z].color;
					  ballCount[X][Y]++;
					  unstableBalls[x][y][z] = 0;
					  
				 }
				 else
				 {
					 unstableBalls[x][y][z].moveX-=Fact;
					 unstableBalls[x][y][z].moveY-=Fact;
					 unstableBalls[x][y][z].currX+= (unstableBalls[x][y][z].signY*Fact);
					 unstableBalls[x][y][z].currY+= (unstableBalls[x][y][z].signX*Fact);
					 
					 let X = unstableBalls[x][y][z].currX;let Y = unstableBalls[x][y][z].currY;
					 translate(X,Y);
					 fill(unstableBalls[x][y][z].color);
					 noStroke(); 
					 sphere(14);
					 translate(-X,-Y);
				 }
			}
		}
	}
}
function newGame() // to create a new game..
{   
	let totalPlayer = 4;
	validTurn = new Array(totalPlayer);
    validPlayer = new Array(totalPlayer);    
    for(let i = 0; i < totalPlayer; i++){
        validTurn[i] = true; validPlayer[i] = true;
    }

	unstableBalls = new Array(N_SIZE);
    ballColor = new Array(N_SIZE);
    ballCount = new Array(N_SIZE);
    for(var i = 0;i < N_SIZE;i++){
    	ballColor[i] = new Array(M_SIZE);
	    ballCount[i] = new Array(M_SIZE);
	    unstableBalls[i] = new Array(M_SIZE);
    }
    for(var i = 0;i < N_SIZE;i++)
     {
       for(var j = 0;j < M_SIZE;j++)
       {
         let cc = Math.floor(random(0,3.9));
         ballCount[i][j] = 0;
		 ballColor[i][j] = colors[cc];
		 unstableBalls[i][j] = new Array(4);
       }
	 }
	 
	 for(var i = 0;i < N_SIZE;i++)
	 {
		  for(var j = 0;j< M_SIZE;j++)
		  {
			  for(var k = 0;k < 4;k++)
			  {
				  unstableBalls[i][j][k] = 0;
			  }
		  }
	 }
}



//This is the mouse click event on canvas.
function mouseClicked() // mouse click event handler 
{
	var pos = mouseToCellIndex();
	if(pos == undefined) return;

	if(allJoined == false) return;

    let x = pos.cellX, y = pos.cellY; 

    if(urTurn != currentTurn) // if you are not the current player
      return;
    if(ballCount[x][y] != 0 && ballColor[x][y] != colors[currentTurn]) // cell occupied by opponent
      return;

  	moveCount++;
  	let res = x + " " + y;
    socket.emit('curGame', res); //console.log(res, allJoined);
}

// FRONTEND OF GRID ENDS HERE //////////////////////////////////////////////////////////////////////////////

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

function createGame(totalPlayer){
    createStatTable(totalPlayer); 
    initialiseGame(totalPlayer, false); 
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
    message.value = ""; //console.log();
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
    let msg = document.createElement('div');
    msg.innerText = message;
    chatBox.appendChild(msg);
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
    //popChain();
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