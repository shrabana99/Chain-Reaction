const N_SIZE = 4,
	M_SIZE = 3,
	maxTurns = 7, // max allowed no of player
	dx = [0, 0, 1, -1], // 4 directions
	dy = [1, -1, 0, 0],
	colors = [ "red", "blue", "green", "black", "white", "pink", "yellow"];

let	currentTurn, // current player
	moveCount, // total no of moves
	turns, // no of player
	ballCount = new Array(N_SIZE), // counnt of ball in a cell
	ballColor = new Array(N_SIZE), // color of ball in a cell
	validTurn = new Array(maxTurns), // player in the game or not
	boxes = []; 


/* 	matrix functions	*/
function drawBoard(){
	for(let i = 0; i < N_SIZE; i++){
		for(let j = 0; j < M_SIZE; j++){
			let cell_id = i+' '+j;
			document.getElementById(cell_id).innerHTML = "";
			var element = document.getElementById(cell_id);
            createBall(element,ballColor[i][j],ballCount[i][j]);
		}
	}
}

// Ball making code -- Anirban

function Ball(colr)
{
      let ball = document.createElement('div');
      ball.setAttribute('class','circle');
      let inner_ball = document.createElement('div');
      inner_ball.setAttribute('class','innercirle');
      ball.appendChild(inner_ball);
      inner_ball.style.background = colr;
      ball.style.background = colr;
      ball.style.z_index = 4;
      return ball;
}
function createBall(element,colr,cnt)
{
	  if(cnt == 1){
	    let ball1 = Ball(colr);
     	ball1.classList.add("shake-little","shake-constant");	
        element.appendChild(ball1);	
     }
     else if(cnt == 2)
     {
     	let ball1 = Ball(colr);
     	ball1.style.left = '10px';
     	ball1.classList.add("shake-little","shake-constant");
        element.appendChild(ball1);
        let ball2 = Ball(colr);
        ball2.style.left = '-10px';
        ball2.classList.add("shake-little","shake-constant");
        element.appendChild(ball2);  
     }
     else if(cnt == 3)
     {
        let ball1 = Ball(colr);
     	ball1.style.left = '15px';
     	ball1.style.top = '-5px';
     	ball1.classList.add("shake-slow","shake-constant");
        element.appendChild(ball1);
        let ball2 = Ball(colr);
        ball2.style.left = '10px';
        ball2.classList.add("shake-slow","shake-constant");
        element.appendChild(ball2);
        let ball3 = Ball(colr);
        ball3.z_index = 4;
        ball3.style.top = '18px';
        ball3.style.left = '-40px';
        ball3.classList.add("shake-slow","shake-constant");
        element.appendChild(ball3);  
     }
}
///////////////////////////////////////////////////////////


function validCell(x, y){
	if(x >= 0 && y >= 0 && x < N_SIZE && y < M_SIZE) return true;
	return false;
}

function popBalls(x, y, k){
	ballCount[x][y] -= k;  //console.log(k);
	for(let i = 0; i < 4; i++){
		let n_x = x + dx[i];
		let n_y = y + dy[i];

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
	if(moveCount < 3)
		return;

	exclude();
	let playerCount = 0, playerTurn = 0;
	for(let t = 0; t < turns; t++){
		if(validTurn[t])
			playerTurn = t, playerCount++;
	}
	if(playerCount == 1){
		alert('Winner: Player ' + colors[playerTurn] );
		initialiseGame();
	} 
}

function popChain(){
	drawBoard();
	winner();
	//while(!stable()){ 
		for(let i = 0; i < N_SIZE; i++){
			for(let j = 0; j < M_SIZE; j++){
				if((i == 0 && j == 0) || (i == N_SIZE-1 && j == 0) || (i == 0 && j == M_SIZE-1) || (i == N_SIZE-1 && j == M_SIZE-1)){
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
function initialiseGame(){ // initialising
	currentTurn = 0; // player 0 starts
	moveCount = 0;
	turns = 3; // total no of players in the board
	for(let i = 0; i < N_SIZE; i++)
		for(let j = 0; j < M_SIZE; j++)
			ballColor[i][j] = "", ballCount[i][j] = 0;
	for(let i = 0; i < turns; i++)
		validTurn[i] = true;
}

function createMatrix(){  // creates matrix 
	for(let i = 0; i < N_SIZE; i++)
		ballColor[i] = new Array(M_SIZE),
		ballCount[i] = new Array(M_SIZE);
}

function createBoard() { // creates board
	
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
			cell.addEventListener("click",update,false);
			row.appendChild(cell);
			boxes.push(cell);
		}
	}
	document.getElementById("chainReaction").appendChild(board);
}

function update() { // add/increment ball to the clicked cell
	let res = this.id; //console.log(res);

    let x = Number(res[0]);
    let y = Number(res[2]); 

	if(ballCount[x][y] != 0 && ballColor[x][y] != colors[currentTurn]) // cell occupied by opponent
		return;

	// update current cell
	ballCount[x][y]++;
	moveCount++;
	ballColor[x][y] = colors[currentTurn]; 
	popChain();

	// update current players turn
	for(let i = 1; i < turns; i++){
		currentTurn = (currentTurn + 1)%turns;
		if(validTurn[currentTurn])
			break;
	}
	
	document.getElementById('turn').innerHTML = currentTurn;
	document.getElementById('color').innerHTML = colors[currentTurn];
} 

function createGame(){
	createMatrix();
	createBoard();
	initialiseGame();
	setInterval(popChain,300);
}

createGame();
