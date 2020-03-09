
let canvas;
let canvasContext;
const WINNING_SCORE = 11;
let ball = {
    x : 50,
    y : 50, 
    speedX : 15, 
    speedY : 4,
    color : "white",
    radius : 10,
}
let paddle = {
    height : 100,
    width : 10,
    left : {
        y : 250,
    },
    right : {
        y : 250,
    }
}

let player = {
    left : {
        score : 0,
    },
    right : {
        score : 0,
    }

}

let showWinScreen = false;

let easy = document.getElementById("easy");
let hard = document.getElementById("hard");

let computerSpeed = 6;



function calculateMousePosition(event){
    let rect = canvas.getBoundingClientRect();
    let root = document.documentElement;
    let mouse = {
        x : event.clientX - rect.left - root.scrollLeft,
        y : event.clientY - rect.top - root.scrollTop,
    }
    return {
        x : mouse.x,
        y : mouse.y,
    };
};


window.onload =  function(){
    canvas = document.getElementById("gameCanvas");
    canvasContext = canvas.getContext('2d');
    canvasContext.font = "noraml 36px Arial";
    let farmesPerSecond = 30;
    setInterval(callBoth, 1000/farmesPerSecond ) ;

    canvas.addEventListener('mousemove', function(event){
        let mousePos = calculateMousePosition(event);
        paddle.left.y = mousePos.y-(paddle.height/2);
    });

    canvas.addEventListener('click', function(){
        if(showWinScreen){
            restartGame();
            showWinScreen = false;
        }
    });

    easy.addEventListener('click',function(){
        ball.speedX = 15;
        computerSpeed = 6;
        restartGame();
    });
    hard.addEventListener('click',function(){
        ball.speedX = 25;
        computerSpeed = 12;
        restartGame();

    });
};



function restartGame(){
    player.left.score = 0;
    player.right.score = 0;
    ballReset();
}


function callBoth(){
    drawEverything();
    moveEverything();
}

function computerMovement(){
    let rightPaddleCenter = paddle.right.y + (paddle.height/2);
    if(rightPaddleCenter < ball.y-35){
        paddle.right.y += computerSpeed;
    }
    else if (rightPaddleCenter > ball.y+35){
        paddle.right.y -= computerSpeed;
    }
}

function moveEverything(){
    if(showWinScreen){
        return;
    }
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    computerMovement();

     //paddle angle
    let deltaY = {
        left : ball.y - (paddle.left.y +(paddle.height/2)),
        right : ball.y - (paddle.right.y +(paddle.height/2)),
       }
    if(ball.x > canvas.width ){
        if(ball.y > paddle.right.y && ball.y < paddle.right.y + paddle.height){
            ball.speedX = -ball.speedX;
            ball.speedY = deltaY.right * 0.35;
        }
        else{
            player.left.score++;
            ballReset();
        }
    } 
    if((ball.y > canvas.height )||(ball.y < 0)){
        ball.speedY = -ball.speedY;
    } 
    if(ball.x < 0){
        if(ball.y > paddle.left.y && ball.y < paddle.left.y + paddle.height){
            ball.speedX = -ball.speedX;
            ball.speedY = deltaY.left * 0.35;
        }
        else{
            player.right.score++;
            ballReset();
        }
    }
}

function ballReset(){
    if((player.left.score >= WINNING_SCORE)||(player.right.score >= WINNING_SCORE)){
        showWinScreen = true;
    }
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.speedX = -ball.speedX;
}

function drawNet(){
    for(let i = 0; i < canvas.height; i+=40){
        colorRect(canvas.width/2 - 1, i, 2, 20, "white")
    }
}

function drawEverything(){

    //black rectangle
    colorRect(0, 0, canvas.width, canvas.height ,"black")
 
    if(showWinScreen){
        canvasContext.fillStyle = "white";

        if(player.left.score >= WINNING_SCORE){
        canvasContext.fillText("LEFT PLAYER WON!", canvas.width/2 - 50, canvas.height/2);
        canvasContext.fillText("click to play again", canvas.width/2 - 40, canvas.height/2 + 50);
        }
        else if(player.right.score >= WINNING_SCORE){
        canvasContext.fillText("RIGHT PLAYER WON!", canvas.width/2 - 50, canvas.height/2 );
        canvasContext.fillText("click to play again", canvas.width/2 - 40, canvas.height/2 + 50);
        }
        else{

        }
        return;
    }
    drawNet();
    //left paddle
    colorRect(0, paddle.left.y, paddle.width, paddle.height, "white");

    //right paddle
    colorRect(canvas.width - paddle.width, paddle.right.y, paddle.width, paddle.height, "white");

    //ball
    colorCircle(ball.x, ball.y, ball.radius, ball.color);

    //score
    canvasContext.fillText(player.left.score, 100, 100);
    canvasContext.fillText(player.right.score, canvas.width -100, 100);

}

function colorCircle(centerX, centerY, radius, drawColor){
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    canvasContext.fill();
}

function colorRect(leftX, topY, width, height, drawColor){
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);

}
