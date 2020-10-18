var N_SIZE = 3,
	M_SIZE = 3,
	turns = 2,
	currentTurn,
	gameOver, 
	moveCount;

var ballCount = new Array(N_SIZE),
	ballColor = new Array(N_SIZE),
	boxes = [],
	colors = ["red", "blue"];

// matrix functions
function createMatrix(){
	for(var i = 0; i < N_SIZE; i++){
		ballColor[i] = new Array(M_SIZE);
		ballCount[i] = new Array(M_SIZE);
	}
	for(var i = 0; i < N_SIZE; i++){
		for(var j = 0; j < M_SIZE; j++){
			ballColor[i][j] = "";
			ballCount[i][j] = 0;
		}
	}
}

/*
function isStable(){
	if(ballCount[0][0] == 2 || ballCount[N_SIZE-1][0] == 2 || ballCount[0][M_SIZE-1] == 2 || ballCount[N_SIZE-1][M_SIZE-1] == 2)
		return false; // conner
	for(var i = 0; i < N_SIZE; i++){
		for(var j = 0; j < M_SIZE; j++){
			if(ballCount[i][j] == 4) // middle
				ans = false;
			if(i == 0 || j == 0 || i == N_SIZE-1 || j == M_SIZE-1 && ballCount == 3) // border
				return false;
		}
	}
	return true;
}
function winner(){}
function popCorner(){}
function popBorder(){}
function popMiddle(){}
*/

function createBoard() {
	
	var board = document.createElement('table');
    board.setAttribute("border", 1);
    board.setAttribute("cellspacing", 0);

	for (let i = 0; i < N_SIZE; i++) {
		let row = document.createElement('tr');
		board.appendChild(row);
		for (let j = 0; j < M_SIZE; j++) {
	        let cell = document.createElement('td');
	        cell.setAttribute('height', 120);
	        cell.setAttribute('width', 120);
	        cell.setAttribute('align', 'center');

	        //changed here
	        cell.setAttribute('id',i+' '+j);
			
			cell.classList.add('col' + j,'row' + i);

			cell.addEventListener("click",update,false);
			row.appendChild(cell);
			boxes.push(cell);
		}
	}

	document.getElementById("chainReaction").appendChild(board);
}


function update() { 
	let res = this.id;
	console.log(res);
	//changed here
    let i = Number(res[0]);
    let j = Number(res[2]); 
	this.innerHTML = ""+(i*j);
	/*if(ballCount[x][y] != 0 && ballColor[x][y] != colors[currentTurn])
		return;
	ballCount[x][y] = 0;
	ballColor[x][y] = colors[currentTurn];
	currentTurn = (currentTurn + 1)%turns;*/
} 


function initialiseGame(){
	gameOver = false;
	currentTurn = 0;
	moveCount = 0;
	createMatrix();
	createBoard();
}

initialiseGame();
