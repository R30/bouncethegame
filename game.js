var user_painted = false;
var canvas, canvasContext;
//possible: shrinking of game field at higher levels
//possible: making sure the square keeps on the same x-coordinate as long as the x-coordinate of the mouse is withing boundaries, not caring whether the y-coordinate is within boundaries
const squareSideLength = 20;
const circleRadius = 10;
var userSpeed = 10; //must not be equal to 0
var high_score = 0; //hightest level
function calcMousePos(evt){
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = Math.min(Math.max(evt.clientX - rect.left - root.scrollLeft, 0), rect.right-rect.left);
	var mouseY = Math.min(Math.max(evt.clientY - rect.top - root.scrollTop, 0), rect.bottom-rect.top);
	return {
		y:mouseY,
		x:mouseX
	};
}

//prototype of enemy object
//int, int, int, int, string
function Enemy(x, xspeed, y, yspeed, color) {
	//NOTE: y coordinate is reverse from normal (i.e. higher coordinate is lower point in space)
	//NOTE: coordinates show the center of the object
	this.x = x;
	this.y = y;
	this.xspeed = xspeed;
	this.yspeed = yspeed;
	this.color = color;
	this.radius = circleRadius;
	this.update = function(){
		if(this.xspeed<0){
			if(this.x<=circleRadius+0){
				this.xspeed = -this.xspeed;
			}
		} else {
			if(this.x+circleRadius>=canvas.width){
				this.xspeed = -this.xspeed;
			}
		}
		if(this.yspeed<0){
			if(this.y<=circleRadius+0){
				this.yspeed = -this.yspeed;
			}
		} else {
			if(this.y+circleRadius>=canvas.height){
				this.yspeed = -this.yspeed;
			}
		}
		this.x += this.xspeed;
		this.y += this.yspeed;
	};
}
//prototype of user object
//int, int, int, int, string
function User(x, xspeed, y, yspeed, color){
	//NOTE: y coordinate is reverse from normal (i.e. higher coordinate is lower point in space)
	//NOTE: coordinates show the center of the object
	this.x = x;
	this.y = y;
	this.color = color;
	this.sideLength = squareSideLength;

}
//the user square
var user;
//this is where I keep the enemies
var enemies = [];
var level = 0;
var framesPerSecond = 60;
//number of more speed per level for new enemy object
var speedIncrease = 1;
var enemySpeed = 3;
var colors = ["red", "blue", "green", "yellow", "orange", "purple", "pink", "magenta", "cyan"];

var username = "John";

//===================Start of functions ====================================================

function init(){
	
	if(!user_painted){
		user = new User(canvas.width/2, 10, canvas.height/2, 10, "black");
		user_painted = true;
	}
	level = 0;
	enemies = [];
	increaseLevel();
	update();
	
	//high score=<SCORE>
	
	
}

window.onload = function(){
	//first time starting stuff
	
	canvas = document.getElementById("gameCanvas");
	canvasContext = canvas.getContext("2d");
	init();
	setInterval(update, 1000/framesPerSecond);
	setInterval(increaseLevel, 10000);
	document.addEventListener("mousemove", function(evt){
		//TODO make the x coordinate change even if the y coordinate is out of the canvas
		var mousePos = calcMousePos(evt);
		user.y = mousePos.y ;
		user.x = mousePos.x ;
	});
	
	

};

function increaseLevel(){
	level++;
	enemies.push(new Enemy(Math.random()*(canvas.width-2*circleRadius)+circleRadius, enemySpeed, Math.random()*(canvas.height-2*circleRadius)+circleRadius, enemySpeed, colors[Math.round(Math.random()*colors.length)]));

}

function update(){
	updateValues();
	drawStuff();
}

function dist(enemy1, user1){
	return Math.sqrt(((enemy1.x-user1.x)*(enemy1.x-user1.x))+((enemy1.y-user1.y)*(enemy1.y-user1.y)));
}

function updateValues(){
	for(var x=0; x<enemies.length; x++){
		enemies[x].update();
		if(dist(enemies[x], user)<=(user.sideLength/2+enemies[x].radius/2)){
			
			if(level>high_score){
				high_score = level;
				if(userdata.hasOwnProperty(username)){
					updateHighScore(username, high_score);
				}
			}
			//alert("Gameover because of the " + colors[x] + " ball, your highest level is " + high_score);
			document.getElementById("game_over").innerHTML = ("Game over because of the " + colors[Math.min(x, colors.length-1)] + " ball, level " + level);
			init();
		}
	}
}

function drawCircle(xCoord, yCoord, radius, circleColor){
	canvasContext.fillStyle = circleColor;
	canvasContext.beginPath();
	canvasContext.arc(xCoord, yCoord, radius, 0, 2*Math.PI, true);
	canvasContext.fill();

}

function drawSquare(xCoord, yCoord, sideLength, squareColor){
	canvasContext.fillStyle = squareColor;
	canvasContext.beginPath();
	canvasContext.rect(xCoord-sideLength/2, yCoord-sideLength/2, sideLength, sideLength);
	canvasContext.fill();

}

function drawStuff(){
	canvasContext.clearRect(0, 0, canvas.width, canvas.height);
	for(var x=0; x<enemies.length; x++){
		drawCircle(enemies[x].x, enemies[x].y, enemies[x].radius, enemies[x].color);
	}
	drawSquare(user.x, user.y, user.sideLength, user.color);
}

