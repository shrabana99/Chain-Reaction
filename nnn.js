const N_SIZE = 4,
	M_SIZE = 3,
	turns = 2, // no of player
	dx = [0, 0, 1, -1], // 4 directions
	dy = [1, -1, 0, 0];

let	currentTurn, // current player
	gameOver, 
	moveCount, // total no of moves
	ballCount = new Array(N_SIZE),
	ballColor = new Array(N_SIZE),
	boxes = [],
	colors = ["red", "blue"];

/*	matrix functions	*/

function drawBoard(){
	for(let i = 0; i < N_SIZE; i++){
		for(let j = 0; j < M_SIZE; j++){
			let cell_id = i+' '+j;
			document.getElementById(cell_id).innerHTML = "" + ballColor[i][j] + ":" + ballCount[i][j];
		}
	}
}

function stable(){
	for(let i = 0; i < N_SIZE; i++){
		for(let j = 0; j < M_SIZE; j++){
			if((i == 0 && j == 0) || (i == N_SIZE-1 && j == 0) || (i == 0 && j == M_SIZE-1) || (i == N_SIZE-1 && j == M_SIZE-1)){
					if(ballCount[i][j] >= 2) return false;
			}
			else if(i == 0 || j == 0 || i == N_SIZE-1 || j == M_SIZE-1){
				if(ballCount[i][j] >= 3) return false;
			}
			else{
				if(ballCount[i][j] >= 4) return false;
			}
		}
	}
	return true;
}

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
}

function winner(){
	if(moveCount < 3)
		return;

	let count1 = 0, count2 = 0;
	for(let i = 0; i < N_SIZE; i++){
		for(let j = 0; j < M_SIZE; j++){
			if(ballColor[i][j] == "red") count1++;
			if(ballColor[i][j] == "blue") count2++;
		}
	} //console.log(count1, count2);
	if(count1 == 0 || count2 == 0){
		alert('Winner: Player ' + colors[(currentTurn+1)%turns] );
		initialiseGame();
	} 
}

function popChain(){
	drawBoard();
	while(!stable()){
		let pop = false;
		for(let i = 0; i < N_SIZE; i++){
			for(let j = 0; j < M_SIZE; j++){
				if((i == 0 && j == 0) || (i == N_SIZE-1 && j == 0) || (i == 0 && j == M_SIZE-1) || (i == N_SIZE-1 && j == M_SIZE-1)){
					if(ballCount[i][j] >= 2) {
						popBalls(i, j, 2); 
						pop = true; break;
					}
				}
				else if(i == 0 || j == 0 || i == N_SIZE-1 || j == M_SIZE-1){
					if(ballCount[i][j] >= 3) {
						popBalls(i, j, 3); 
						pop = true; break;
					}
				}
				else{
					if(ballCount[i][j] >= 4){
						popBalls(i, j, 4);
						pop = true; break;
					}
				}
			}
		}
		if(pop)return;
	}
	winner();
}
/* end of matrix funcions */

/* game funcions */
function initialiseGame(){ // initialising
	gameOver = false;
	currentTurn = 0;
	moveCount = 0;
	for(let i = 0; i < N_SIZE; i++)
		for(let j = 0; j < M_SIZE; j++)
			ballColor[i][j] = "", ballCount[i][j] = 0;

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

	ballCount[x][y]++;
	moveCount++;
	ballColor[x][y] = colors[currentTurn]; 
	currentTurn = (currentTurn + 1)%turns;
	drawBoard();
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