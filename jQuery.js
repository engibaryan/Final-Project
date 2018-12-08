$(".animate").delay(1000).animate({"opacity": "1"}, 700);

$(".we").delay(2000).animate({"opacity": "1"}, 700);

$(document).ready(function(){
    $(".we").animate({"font-size": "100"}, 500);
    $(".animate").delay(2500).fadeOut();
    $(".we").delay(1000).fadeOut();
    $("#p1").delay(5000).fadeIn();
    $(".but").delay(5500).animate({"opacity": "1"}, 700);
    
 $(".but").click(function() {
     $(".but").fadeOut();
     $("#p1").fadeOut();
     $("#close-image").fadeIn();
     $("#close-CSS").fadeIn();
     $("#close-image img").delay(500).fadeIn();
     $("#close-CSS img").delay(500).fadeIn();
     $("#p2").delay(500).fadeIn();
     $(document).keypress(function(e) {
    if(e.which == 13) {
       game();
        $("#p2").delay(250).fadeOut();
    }
});
       
});
    
    
    });



function game() {	
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')

    canvas.width = 1200;
    canvas.height = 948;

    let gameStatus = 'stopped';

    const spaceImg = new Image();
    spaceImg.src = './assets/space.jpg';

    const spaceshipImg = new Image();
    spaceshipImg.src = './assets/spaceship.png';

    const bulletImg = new Image();
    bulletImg.src = './assets/bullet.png';

    const enemyImg = new Image();
    enemyImg.src = './assets/enemySpaceship.png';

    const youWinImg = new Image();
    youWinImg.src = './assets/youWin.jpg';

    const tryAgainImg = new Image();
    tryAgainImg.src = './assets/tryAgain.png';

     const crushSound = new Audio('');
     const bulletSound = new Audio("./assets/bulletSound.wav");
     const gameOverSound = new Audio('');
     const youWinSound = new Audio('./assets/youWinSound.mp3');
     const createSpaceShip = function() {
        return {
            x      : 550,
            y      : 850,
            width  : 100,
            height : 100,
            xDir   : 0,
            yDir   : 0,
            speed  : 10
        };
    };

    const creatBullet = function(x, y, yDir) {
        bulletSound.currentTime = 0;
        bulletSound.play();

      if(!yDir) {
        yDir = -1;
      }
        return {
            x      : x,
            y      : y,
            width  : 20,
            height : 20,
            xDir   : 0,
            yDir   : yDir,
            speed  : 8
        };
    };

    const creatEnemy = function(x,y) {
        return {
            x       : x,
            y       : y,
            width   : 140,
            height  : 140,
            xDir    : 0,
            yDir    : 0,
            speed   : 5
        };
    };

    let gameData = {
        spaceship       : createSpaceShip(),
        spaceShipBullets: [],
        enemys          : [],
        enemBullet      : [],
        counter         : 0
    };

    const game = {
        drawSpaceship: function() {
            ctx.drawImage(spaceshipImg, gameData.spaceship.x, gameData.spaceship.y, gameData.spaceship.width, gameData.spaceship.height);
        },
        updateSpaceship: function() {
            gameData.spaceship.x += gameData.spaceship.xDir * gameData.spaceship.speed;
            gameData.spaceship.y += gameData.spaceship.yDir * gameData.spaceship.speed;
        },
        drawBullet: function(bullet) {
            ctx.drawImage(bulletImg, bullet.x, bullet.y, bullet.width, bullet.height)
        },
        updateBullet: function(bullet) {
            bullet.x += bullet.xDir * bullet.speed;
            bullet.y += bullet.yDir * bullet.speed;

            if (bullet.x > canvas.width) {
                bullet.deleteme = true;
            }
        },
        drawEnemy: function(enemy) {
            ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height)
        },
        updateEnemy: function(enemy) {

            enemy.x += enemy.xDir * enemy.speed;
            enemy.y += enemy.yDir * enemy.speed;

            if (gameData.counter % 50 === 0) {

                gameData.enemBullet.push(creatBullet(enemy.x+62, enemy.y + 72, 1));

            }

            if (enemy.y + enemy.height < 0) {
                enemy.deleteme = true;
            }
        }
    };

          const draw = function() {
        ctx.drawImage(spaceImg, 0, 0, canvas.width, canvas.height);
        game.drawSpaceship(gameData.spaceship);

        gameData.spaceShipBullets.forEach(function(bullet) {
            game.drawBullet(bullet)
        });

        gameData.enemys.forEach(function(enemy) {
            game.drawEnemy(enemy);
        });

        gameData.enemBullet.forEach(function(ebullet) {
            game.drawBullet(ebullet);
        });
    };

    const intersect = (rect1, rect2) => {
        const x = Math.max(rect1.x, rect2.x),
            num1 = Math.min(rect1.x + rect1.width / 2, rect2.x + rect2.width / 2),
            y = Math.max(rect1.y, rect2.y),
            num2 = Math.min(rect1.y + rect1.height / 2, rect2.y + rect2.height / 2);
        return (num1 >= x && num2 >= y);
    };

    const update = function() {
        const play = document.getElementById('myTune');
        gameData.counter++;

        game.updateSpaceship(gameData.spaceship);

        gameData.spaceShipBullets.forEach(function(bullet) {
            game.updateBullet(bullet)
        });

        gameData.enemys.forEach(function(enemy) {
            game.updateEnemy(enemy);
        });

        gameData.enemBullet.forEach(function(bullet) {
            game.updateBullet(bullet);
        });

        gameData.spaceShipBullets.forEach(function(bullet) {
            gameData.enemys.forEach(function(enemy) {
                let point = 0;

                if (intersect(bullet, enemy)) {
                    bullet.deleteme = true;
                    enemy.deleteme = true;
                    point++;
                }
            });
        });

        gameData.enemys.forEach(function(enemy) {
            if (intersect(enemy, gameData.spaceship) || (enemy.y  > canvas.height-enemy.height+40)) {
                gameStatus = 'game over';
                play.pause();
            }
            enemy.y= enemy.y+2.2;
            if(enemy.y > canvas.height){
              enemy.deleteme = true;
            }
        });

        gameData.enemBullet.forEach(function(bullet) {
            if (intersect(bullet, gameData.spaceship)) {
                gameStatus = 'game over';
                play.pause();
            }
        });
        gameData.spaceShipBullets = gameData.spaceShipBullets.filter(bullet => !bullet.deleteme);
        gameData.enemys = gameData.enemys.filter(enemy => !enemy.deleteme);
        gameData.enemBullet = gameData.enemBullet.filter(bullet => !bullet.deleteme);


        const rand = function(num) {
            return Math.floor(Math.random() * num) + 1;
        };


        if (gameData.counter > 100) {
            gameData.counter = -1;
            gameData.enemys.push(creatEnemy(rand(canvas.width - 30),0));
            gameData.enemys.push(creatEnemy(rand(canvas.width - 30),0));
        }
        if(gameData.spaceship.x > canvas.width){
             gameData.spaceship.x = 0;
  
         }
        if(gameData.spaceship.x < 0){
            gameData.spaceship.x = canvas.width;
        }
        if(gameData.spaceship.y > canvas.height-gameData.spaceship.height){
            gameData.spaceship.y = canvas.height-gameData.spaceship.height;
        }
};

    const loop = function() {
        const play = document.getElementById('myTune');
        if(gameData.spaceship.y<0){
            ctx.drawImage(youWinImg, 0, 0, canvas.width, canvas.height);
            play.pause();
            youWinSound.play();
        }

        else if (gameStatus === 'playing') {
            draw();
            update();
            requestAnimationFrame(loop)
                } else if (gameStatus === 'game over') {
                    play.pause();

          ctx.drawImage(tryAgainImg, 0, 0, canvas.width, canvas.height);


        }
            
    }
    loop();

    const leftKey = 37,
        upKey = 38,
        rightKey = 39,
        downKey = 40,
        spaceKey = 32;
        enterKey = 13;

    document.addEventListener('keydown', e => {
        e.preventDefault();
        const keyCode = e.keyCode;
        const spaceship = gameData.spaceship;
        if (keyCode === rightKey)
            gameData.spaceship.xDir = 1;
        else if (keyCode === leftKey)
            gameData.spaceship.xDir = -1;
        else if (keyCode === upKey)
            gameData.spaceship.yDir = -1;
        else if (keyCode === downKey)
            gameData.spaceship.yDir = 1;
        else if (keyCode === spaceKey)
            gameData.spaceShipBullets.push(creatBullet(gameData.spaceship.x + 39, gameData.spaceship.y - 20));
    });
    document.addEventListener('keyup', e => {
        e.preventDefault();
        const keyCode = e.keyCode;
        const spaceship = gameData.spaceship;
        if (keyCode === rightKey || keyCode === leftKey || keyCode === upKey || keyCode === downKey) {
            spaceship.yDir = 0;
            spaceship.xDir = 0;
        }
    });

    document.addEventListener('keydown', e => {
        e.preventDefault();
        const keyCode = e.keyCode;
        if (keyCode === enterKey){
        if (gameStatus === 'stopped') {
            gameStatus = 'playing';
            loop();
        }
        if(gameStatus == "game over") {
            location.reload();
        }
       }
    })
}