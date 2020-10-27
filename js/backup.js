

// This a Backup of client file 




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
allJoined, // all player joined or not
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
    	 	 		console.log(i,j,x,y);
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
	if(pos != undefined){
	 ballCount[pos.cellX][pos.cellY]++;
	 currentTurn++;
	 currentTurn%=4;
	}
}

// FRONTEND OF GRID ENDS HERE //////////////////////////////////////////////////////////////////////////////










