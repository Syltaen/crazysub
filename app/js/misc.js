/*
 * 
 * Game States
 * 
 */

function lauchTransitionStart() {
	if (gameState === 0) {
		// submarine reset
		gun.maxClipSize =  submarine_types[subChoice].clipSize;
		gun.clipSize = gun.maxClipSize;

		player.maxLife = submarine_types[subChoice].lifes;
		player.life = player.maxLife;
		// randomSpawns 0

		gameState = 1;
		
		sounds.play("dive", effectsVolume, 0.7);
	}
}

var prevGameSpeed = 1,
	prevSubVelocity = 0;

function pauseGame() {
	if (gameState === 3) {
		// freeze all
		prevGameSpeed = gameSpeed;
		gameSpeed = 0;
		environment.recalculateVelocity(true);
		foes.recalculateVelocity(true);
		bonus.recalculateVelocity(true);
		startMenu.recalculateVelocity(true);
		gun.freezeMissiles(true);

		prevSubVelocity = player.submarine.body.velocity.y;
		player.submarine.body.velocity.y = 0;
		player.submarine.body.gravity.y = 0;

		pauseMenu.visibility(true);

		// stop animations

		gameState = 4;
		
		sounds.muteAll();
	}
}

function startGame(resume) {
	if ((gameState === 2 && !resume) || (resume && gameState === 4)) {
		
		// objects velocity
		gameSpeed = resume ? prevGameSpeed : 1;
		gameState = 3;

		environment.recalculateVelocity();
		startMenu.recalculateVelocity();

		if (!resume) {
			interface = new Interface(); // fade in ?
			player.initialize();
			cmDistance = 0;
		} else {
			foes.recalculateVelocity();
			bonus.recalculateVelocity();
			player.submarine.body.velocity.y = prevSubVelocity;
			gun.freezeMissiles(false);
			sounds.resetVolumes();
			player.initialize(true);
		}
	}
}

function resetGame() {
	if (gameState === 5 || gameState === 4) {
		gameState = 0;
		gameSpeed = 0;
		frameNumber = 0;

		// reset everything		
		foes.resetAll();
		bonus.resetAll();
		environment.resetAll();
		startMenu.resetAll();
		gun.resetAll();
		particles.resetAll();
		sounds.resetAll();
		player.resetAll();

		// reset camera
		cameraOffset = -1 * game.world.height + 120;
		tileViewport.updateCameraPos();
		environment.updateCameraPos();
		startMenu.updateCameraPos();	

		// fade interface
		interface.resetAll();	
	}
}

function gameOver() {
	gameSpeed = 0;
	gameState = 5;
	
	environment.recalculateVelocity();
	foes.recalculateVelocity();	
	bonus.recalculateVelocity();
	
	foes.sharks.forEachAlive(function(b){b.body.velocity.x = -120;});
	
	if (Math.floor(cmDistance / 100) > bestScore) {
		bestScore = Math.floor(cmDistance / 100);
		localStorage.bestScore = bestScore;
		startMenu.highScore.content = bestScore+"m";
		startMenu.highScore.alpha = 1;
		startMenu.highScoreIcon.alpha = 1;
		
		gameOverScreen.toggleDisplay(false, "highScore");		
		
	} else {
		gameOverScreen.toggleDisplay(false, "tryAgain");
	}
}

/*
 * 
 * Spawn filters
 * 
 */

var SpriteHaveBubble = ["backRock_1", "backRock_2", "backRock_3", "backRock_4"];
function haveBubble(obj) {
	if (SpriteHaveBubble.indexOf(obj.key) > -1) {
		return true;
	} else {
		return false;		
	}
}

var frontSprite = ["front_rock_1", "front_rock_2", "front_rock_3"];
function frontLayer(obj) {
	if (frontSprite.indexOf(obj.key) > -1) {
		return true;
	} else {
		return false;		
	}	
}


/*
 * 
 * Scoring
 * 
 */

function updateDistance() {
	interface.score.content = Math.floor(cmDistance / 100) + " m ";
}

function updateDifficulty() {
	gameSpeed = (cmDistance / 2500 + 1);
}

/*
 * 
 * Creations & Initialisations
 * 
 */


function setControls() {
	function movePlayer(direction) {
		player.move = direction;
		sounds.play("motor", effectsVolume, 0.25, true);
		player.rearBubbles.start(rearBubblesParam.emit.explode, rearBubblesParam.emit.lifespan, rearBubblesParam.emit.interval, rearBubblesParam.emit.nbr);
	}
	
	function stopPlayer() {
		if (keyUp.isUp && keyDown.isUp) {
			player.move = "none";
			player.submarine.body.velocity.y = 0;

			sounds.stop("motor");

			player.rearBubbles.on = false;	
		} else {
			console.log(keyUp);
			console.log(keyDown);
		}
	}
		

	game.input.onDown.add(function(e) {
		if (gameState === 3) {
			if (e.positionDown.y <= player.submarine.y - 20) {
				movePlayer("up");
			} else if (e.positionDown.y > player.submarine.y + 20) {
				movePlayer("down");
			}
		}
	}, this);

	var keyUp = game.input.keyboard.addKey(Phaser.Keyboard.UP);
	keyUp.isUp = true;
    keyUp.onDown.add(function() {movePlayer("up");}, this, "up");
	keyUp.onUp.add(stopPlayer, this, "up");
	
    var keyDown = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
	keyDown.isUp = true;
    keyDown.onDown.add(function() {movePlayer("down");}, this, "down");
	keyDown.onUp.add(stopPlayer, this, "up");
	
	game.input.onUp.add(function (e) {
		if (gameState === 3) {
			if (e.position.x - 70 > e.positionDown.x) {
				gun.fire();
			}

			stopPlayer();
		}
	}, this);
	
    var keySpace = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    keySpace.onDown.add(function(){  
		if (gameState === 3) {
			gun.fire(); 
		}
	}, this);
	
}


/*
 * 
 * Animations
 * 
 */

function offsetXCamera() {
	player.submarine.x -= 2;
	environment.offsetXCamera(-2);
	tileViewport.scrollBy(2);
	startMenu.offsetXCamera(-2);	
}


