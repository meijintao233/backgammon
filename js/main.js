var canvas = document.getElementById('canvas'),
	ctx = canvas.getContext('2d'),
	width = canvas.width,							//the height of canvas
	height = canvas.height, 						//the width of canvas
	chessR = 20,									//chess radius
	commonConstant = 1 + chessR,					//inital position of the chess board data
 	positionX =	parseInt((width-chessR*2)/18), 		//the average length of X axios
	positionY =	parseInt((height-chessR*2)/18),		//the average length of Y axios
	data = [],										//chess board data
	wins = [],										//all the situation of victories
	myWins = [],									//the probability of player1 winning
	AIWins = [],									//the probability of AI winning
	count = 0,										//the number of victories
	player1 = new Player1('black'),					//the instance of player1
	player2 = new Player2('ghostwhite'),			//the instance of player2
	computer = new Computer('ghostwhite'), 			//the instance of AI
	flag = true,									//the mark of playing chess(true represent player1;false represent AI)
	over = false;									//judge game over
	
	
//structure function player1
function Player1(color){
	this.color = color;
}

//structure function player2
function Player2(color){
	this.color = color;
}

//structure function AI
function Computer(color){
	this.color = color;
}


//init chessboarddata 
(function initChessBoardData(data){
	for (let i = 0; i < 19; i++) {
		data[i] = [];
		for (let j = 0; j < 19; j++) {
			data[i][j] = 2 ;
		}
	}
	return data;
})(data);


//init chessboard
(function drawCheckboard(){
	ctx.strokeStyle = 'black';
	ctx.fillStyle = 'black';
	ctx.lineWidth = 2;
	for (let i = commonConstant; i <= width - commonConstant; i += positionX) {
		ctx.beginPath();
		ctx.moveTo(i,commonConstant);
		ctx.lineTo(i,height-commonConstant);
		ctx.closePath();
		ctx.stroke();
	}	
	for (let j = commonConstant; j <= height - commonConstant; j += positionY) {
		ctx.beginPath();
		ctx.moveTo(commonConstant,j);
		ctx.lineTo(width - commonConstant,j);
		ctx.closePath();
		ctx.stroke();
	}	
	for (let k = positionX * 3 + commonConstant; k <= positionX * 15 + commonConstant; k += positionX * 6) {
		for (let l = positionY * 3 + commonConstant; l <= positionY * 15 + commonConstant; l += positionY * 6) {
		ctx.beginPath();
		ctx.arc(k,l,7,0,Math.PI*2,true);
		ctx.closePath();
		ctx.fill();
		}
	}	
})();


//init the data of victories 
(function initWinningData(){
	for (let i = commonConstant; i <= width - commonConstant; i += positionX) {
		wins[parseInt(i/positionX)] = [];
		for (let j = commonConstant; j <= height - commonConstant; j += positionY) {
			wins[parseInt(i/positionX)][parseInt(j/positionY)] = [];
		}
	}
	
	//horizontal data(k:0-285)
	for (var i = commonConstant; i <= width - commonConstant; i += positionX) {
		for (var j = commonConstant; j <= height - commonConstant - 4 * positionY; j += positionY) {
			for (var k = 0; k < 5; k++) {
				wins[parseInt(i/positionX)][parseInt(j/positionY) + k][count] = count + 1;
			}
			count++;
		}
	}
	console.log(count);
	
	//vertical data(k:286-570)
	for (var i = commonConstant; i <= width - commonConstant; i += positionX) {
		for (var j = commonConstant; j <= height - commonConstant - 4 * positionY; j += positionY) {
			for (var k = 0; k < 5; k++) {
				wins[parseInt(j/positionY) + k][parseInt(i/positionX)][count] = count + 1;
			}
			count++;
		}
	}
	console.log(count);
	//oblique data(k:571-795)
	for (var i = commonConstant; i <= width - commonConstant - 4 * positionX; i += positionX) {
		for (var j = commonConstant; j <= height - commonConstant - 4 * positionY; j += positionY) {
			for (var k = 0; k < 5; k++) {
				wins[parseInt(i/positionX) + k][parseInt(j/positionY) + k][count] = count + 1;
			}
			count++;
		}
	}
	console.log(count);
	//anti-oblique data(796-1020)
	for (var i = commonConstant; i <= width - commonConstant - 4 * positionX; i += positionX) {
		for (var j = height - commonConstant; j >= commonConstant + 4 * positionY; j -= positionY) {
			for (var k = 0; k < 5; k++) {
				wins[parseInt(i/positionX) + k][parseInt(j/positionY) - k][count] = count + 1;
			}
			count++;
		}
	}
	console.log(count);	
	//init the probability of winning
	for (var i = 0; i < count; i++) {
		myWins[i] = 0;
		AIWins[i] = 0;
	}
	
})();



//get mouse position
function getCanvasPos(canvas,e){   
    var rect = canvas.getBoundingClientRect();
    return {   
     x: (e.clientX - rect.left) * (canvas.width / rect.width),  
     y: (e.clientY - rect.top) * (canvas.height / rect.height)   
   };  
}


//player1 op
Player1.prototype.drawChess = function(e){
		ctx.fillStyle = this.color;
		let m = 0,n = 0;
		let pos = getCanvasPos(canvas,e);
		for (let i = commonConstant; i <= width - commonConstant; i += positionX) {
			for (let j = commonConstant; j <= height - commonConstant; j += positionY) {
				if((pos.x - i) * (pos.x - i) + (pos.y - j) * (pos.y - j) < 100){
					if(data[parseInt(i/positionX)][parseInt(j/positionY)] == 2){
					ctx.beginPath();
					ctx.arc(i,j,chessR,0,Math.PI*2,true);
					ctx.closePath();
					ctx.strokeStyle = 'black';
					ctx.stroke();				
					ctx.fill();
					m = parseInt(i/positionX);
					n = parseInt(j/positionY);
					data[m][n] = 0;
					for (let k = 0; k < count; k++) {
						if(wins[m][n][k]){
							myWins[k]++;
							AIWins[k] = 99;
							if(myWins[k] == 5){
								over = true;
								setTimeout(function(){
									alert('You WIN!');
								},500);
							}
						}
					}
					if(!isGameover() && !over){
						flag = false;
						computer.AI();
					}
					}
				}
			}
		}
};



//player2 op
Player2.prototype.drawChess = function(e){
		ctx.fillStyle = this.color;
		let pos = getCanvasPos(canvas,e);
		for (let i = commonConstant; i <= width - commonConstant; i += positionX) {
			for (let j = commonConstant; j <= height - commonConstant; j += positionY) {
				if((pos.x - i) * (pos.x - i) + (pos.y - j) * (pos.y - j) < 100){
					if(data[parseInt(i/positionX)][parseInt(j/positionY)] == 2){
					ctx.beginPath();
					ctx.arc(i,j,chessR,0,Math.PI*2,true);
					ctx.closePath();
					ctx.strokeStyle = 'black';
					ctx.stroke();					
					ctx.fill();
					data[parseInt(i/positionX)][parseInt(j/positionY)] = 1;
					flag = true;
					}
				}	
			}
		}	
}

//AI op
Computer.prototype.AI = function(){
	var myScore = [],	//player1 score
	 	AIScore = [],	//AI score
	 	maxScore = 0,	//the worse score
	 	m = 0, 			//the best X position
	 	n = 0;			//the best Y position
	 	
	for (let i = commonConstant; i <= width - commonConstant; i += positionX) {
	 	myScore[parseInt(i/positionX)] = [];
		AIScore[parseInt(i/positionX)] = [];
		for (let j = commonConstant; j <= height - commonConstant; j += positionY) {
			myScore[parseInt(i/positionX)][parseInt(j/positionY)] = 0;
			AIScore[parseInt(i/positionX)][parseInt(j/positionY)] = 0;
		}
	}
	
	for (let i = commonConstant; i <= width - commonConstant; i += positionX) {
		for (let j = commonConstant; j <= height - commonConstant; j += positionY) {
			let myCount = 0,
				AICount = 0,
				myCount_1 = 0,
				AICount_1 = 0,
				u = parseInt(i/positionX),
				v = parseInt(j/positionY);
			if(data[parseInt(i/positionX)][parseInt(j/positionY)] == 2){
				for (let k = 0; k < count; k++) {
					if(wins[parseInt(i/positionX)][parseInt(j/positionY)][k]){
						if(myWins[k] == 1){
							myScore[parseInt(i/positionX)][parseInt(j/positionY)] += 100;
						}else if(myWins[k] == 2){
							myScore[parseInt(i/positionX)][parseInt(j/positionY)] += 200;
							for (let w = 0; w < wins[u][v].length; w++) {
								if(myWins[wins[u][v][w]-1] == 2){
									myCount++;
								}
								if(myWins[wins[u][v][w]-1] == 99){
									myCount--;
								}	
							}
							if(myCount >= 2){
								myScore[u][v] += 3000;
							}
						}else if(myWins[k] == 3){
							myScore[parseInt(i/positionX)][parseInt(j/positionY)] += 13000;
							for (let w = 0; w < wins[u][v].length; w++) {
								if(myWins[wins[u][v][w]-1] == 99 && wins[u][v][w]-1 == k){
									myScore[parseInt(i/positionX)][parseInt(j/positionY)] -= 6000;
								}	
							}
							
						}else if(myWins[k] == 4){
							myScore[parseInt(i/positionX)][parseInt(j/positionY)] += 66666;
						}
						if(AIWins[k] == 1){
							AIScore[parseInt(i/positionX)][parseInt(j/positionY)] += 150;
						}else if(AIWins[k] == 2){
							AIScore[parseInt(i/positionX)][parseInt(j/positionY)] += 450;
							for (let w = 0; w < wins[u][v].length; w++) {
								if(AIWins[wins[u][v][w]-1] == 2){
									AICount++;
								}
								if(AIWins[wins[u][v][w]-1] == 99){
									AICount--;
								}	
							}
							if(AICount >= 2){
								AIScore[u][v] += 5000;
							}
						}else if(AIWins[k] == 3){
							AIScore[parseInt(i/positionX)][parseInt(j/positionY)] += 20000;
							for (let w = 0; w < wins[u][v].length; w++) {
								if(AIWins[wins[u][v][w]-1] == 99 && wins[u][v][w]-1 == k){
									AICount[parseInt(i/positionX)][parseInt(j/positionY)] -= 10000;
								}	
							}
							
						}else if(AIWins[k] == 4){
							AIScore[parseInt(i/positionX)][parseInt(j/positionY)] += 99999;
						}
					}
				}
				
				if(myScore[parseInt(i/positionX)][parseInt(j/positionY)] > maxScore){
					maxScore = myScore[parseInt(i/positionX)][parseInt(j/positionY)];
					m = i;
					n = j;
				}else if(myScore[parseInt(i/positionX)][parseInt(j/positionY)] == maxScore){
					if(AIScore[parseInt(i/positionX)][parseInt(j/positionY)] > AIScore[parseInt(m/positionX)][parseInt(n/positionY)]){
						m = i; 
						n = j;
					}
				}
				
				if(AIScore[parseInt(i/positionX)][parseInt(j/positionY)] > maxScore){
					maxScore = AIScore[parseInt(i/positionX)][parseInt(j/positionY)];
					m = i;
					n = j;
				}else if(AIScore[parseInt(i/positionX)][parseInt(j/positionY)] == maxScore){
					if(myScore[parseInt(i/positionX)][parseInt(j/positionY)] > myScore[parseInt(m/positionX)][parseInt(n/positionY)]){
						m = i;
						n = j;
					}
				}
			}
		}
	}
	ctx.beginPath();
	ctx.arc(m,n,chessR,0,Math.PI*2,true);
	ctx.closePath();
	ctx.strokeStyle = 'black';
	ctx.stroke();
	ctx.fillStyle = this.color;
	ctx.fill();
	data[parseInt(m/positionX)][parseInt(n/positionY)] = 1;	
	for (let k = 0; k < count; k++) {
		if(wins[parseInt(m/positionX)][parseInt(n/positionY)][k]){
		AIWins[k]++;
		myWins[k] = 99;
			if(AIWins[k] == 5){
				over = true;
				setTimeout(function(){
					alert('AI WIN!');
				},500);
			}
		}
	}
	if(!isGameover() && !over){
		flag = true;
	}
}


//game start
$('#canvas').on('click',function(e){
	if(flag){
		player1.drawChess(e);
	}else{
		return;
	}
});


//game rule(0 represent black chess, 1 represent white chess, 2 represent space)
function isGameover(){
	for (let i = commonConstant; i <= width - commonConstant; i += positionX) {
		for (let j = commonConstant; j <= height - commonConstant; j += positionY) {
			if(data[parseInt(i/positionX)][parseInt(j/positionY)] == 2){
				return false;
			}
		}
	}
	return true;
}

