var canvas,
	game,
	progressLoad,
	fileLoaded,
	logo,
	whiteBg,
	startMenu,
	gameSpeed= 0,
	cmDistance = 0,
	frameNumber = 0,
	limites,
	tileViewport,
	environment,
	particles,
	foes,
	bonus,
	keyUp,
	keyDown,
	firstTouchX,
	interface,
	score_text,
	bestScore = localStorage.bestScore || 0,
	sounds,
	musicVolume = localStorage.musicVolume || 1,
	effectsVolume = localStorage.effectsVolume || 1,
	subChoice = localStorage.lastSubChoice || "submarine_a",
	gameState = 0,
	cameraOffset = 0,
	pauseMenu,
	optionsScreen,
	gameOverScreen,
	helpScreen
;

function init() {	
	canvas = document.getElementById("game_canvas");
	var w = canvas.clientWidth < canvas.clientHeight ? canvas.clientHeight : canvas.clientWidth,
		h = canvas.clientWidth < canvas.clientHeight ? canvas.clientWidth : canvas.clientHeight;
	
	
	game = new Phaser.Game(w, h, Phaser.AUTO, 'game_canvas', { preload: preload, create: create, update: update, render: render }); // ! AUTO
	
	function preload() {

		game.load.image('logoCrazySub', 'assets/interface/logoCrazySub.png');
		
		// environment
		game.load.image('ciel', 'assets/tile/ciel.png');
		game.load.image('see_grad', 'assets/tile/grad_see.png');
		game.load.image('wave_01a', 'assets/environment/wave_01a.png');
		game.load.image('wave_01b', 'assets/environment/wave_01b.png');
		game.load.image('wave_02', 'assets/tile/wave_02.png');
		game.load.image('wave_03', 'assets/tile/wave_03.png');
		game.load.image('rock_tile', 'assets/tile/rock_tile.png');
		game.load.image('sol_a', 'assets/tile/sol_a.png');
		game.load.image('sol_b', 'assets/tile/sol_b.png');
		game.load.image('overlay_waves', 'assets/tile/overlay_waves.png');
		
		game.load.image('caustic_small', 'assets/environment/caustic_small.png');
		game.load.image('caustic_medium', 'assets/environment/caustic_medium.png');
		game.load.image('caustic_large', 'assets/environment/caustic_large.png');
		game.load.image('poissons_1', 'assets/environment/poissons_1.png');
		game.load.image('poissons_2', 'assets/environment/poissons_2.png');
		game.load.image('backRock_1', 'assets/environment/backRock_1.png');
		game.load.image('backRock_2', 'assets/environment/backRock_2.png');
		game.load.image('backRock_3', 'assets/environment/backRock_3.png');
		game.load.image('backRock_4', 'assets/environment/backRock_4.png');		
		game.load.image('front_rock_1', 'assets/environment/front_rock_1.png');		
		game.load.image('front_rock_2', 'assets/environment/front_rock_2.png');
		game.load.image('front_rock_3', 'assets/environment/front_rock_3.png');

		game.load.image('bubble', 'assets/particles/bubble.png');
		game.load.image('etincelle', 'assets/particles/etincelles.png');
		game.load.image('toxic', 'assets/particles/toxic.png');
		
		game.load.spritesheet('mine', 'assets/foes/mine_sprite.png', 100, 100);
		game.load.image('boat_foes', 'assets/foes/boat_foes.png');
		game.load.image('shark', 'assets/foes/shark.png');
		game.load.image('barrel', 'assets/foes/barrel.png');
		
		game.load.image('submarine_a', 'assets/player/submarine_01_BasicYellowSub.png');			
		game.load.image('submarine_b', 'assets/player/submarine_02_LightingStrike.png');
		game.load.image('submarine_c', 'assets/player/submarine_03_redFlames.png');
		game.load.image('submarine_d', 'assets/player/submarine_04_yoMama.png');
		game.load.image('locked_submarine_a', 'assets/player/locked_submarine_01_BasicYellowSub.png');			
		game.load.image('locked_submarine_b', 'assets/player/locked_submarine_02_LightingStrike.png');
		game.load.image('locked_submarine_c', 'assets/player/locked_submarine_03_redFlames.png');
		game.load.image('locked_submarine_d', 'assets/player/locked_submarine_04_yoMama.png');
		game.load.image('healthPack', 'assets/player/healthPack.png');
		game.load.image('ammoPack', 'assets/player/ammoPack.png');
		game.load.image('tripleHealthPack', 'assets/player/tripleHealthPack.png');
		game.load.image('tripleAmmoPack', 'assets/player/tripleAmmoPack.png');		
		
		game.load.image('missile', 'assets/player/missile.png');		
		
		game.load.image('life_empty', 'assets/interface/life_empty.png');
		game.load.image('life_full', 'assets/interface/life_full.png');
		game.load.image('missile_empty', 'assets/interface/missile_empty.png');
		game.load.image('missile_full', 'assets/interface/missile_full.png');
		game.load.image('pause_btn', 'assets/interface/btn_	pause.png');

		game.load.image('start_boat', 'assets/interface/boatStart.png');
		game.load.image('arrow_btn', 'assets/interface/arrow_btn.png');
		game.load.image('play_btn', 'assets/interface/play_btn.png');
		game.load.image('start_aura', 'assets/interface/start_aura.png');
		game.load.image('highScoreIcon', 'assets/interface/highScoreIcon.png');
		game.load.image('optionsBtn_startScreen', 'assets/interface/optionsBtn_startScreen.png');		
		game.load.image('cadenas', 'assets/interface/cadenas.png');
		game.load.image('logoCrazySub', 'assets/interface/logoCrazySub.png');
		
		
		game.load.image('restartBtn', 'assets/interface/restartBtn.png');
		game.load.image('optionsBtn', 'assets/interface/optionsBtn.png');
		game.load.image('resumeBtn', 'assets/interface/resumeBtn.png');
		game.load.image('aura_pause', 'assets/interface/aura_pause.png');
		
		game.load.image('optionPanel', 'assets/interface/optionPanel.png');
		game.load.image('leaveOptions', 'assets/interface/leaveOptions.png');
		game.load.image('toggleOff', 'assets/interface/toggleOff.png');
		game.load.image('toggleOn', 'assets/interface/toggleOn.png');
		
		game.load.image('blueBg', 'assets/interface/blueBg.png');
		game.load.image('instr_01', 'assets/interface/instr_01.png');
		game.load.image('instr_02', 'assets/interface/instr_02.png');
		
		game.load.image('newHighScore_panel', 'assets/interface/newHighScore_panel.png');
		game.load.image('tryAgain_panel', 'assets/interface/tryAgain_panel.png');
		game.load.image('newGame_btn', 'assets/interface/newGame_btn.png');

		game.load.audio('loop_music', ['assets/sounds/loop_bg_music.mp3', 'assets/sounds/loop_bg_music.ogg']);
		game.load.audio('alarme_snd', ['assets/sounds/alarme.mp3', 'assets/sounds/alarme.ogg']);
		game.load.audio('bulles', ['assets/sounds/bulles.mp3','assets/sounds/bulles.ogg']);
		game.load.audio('ambiance_snd', ['assets/sounds/ambiance_underwater.mp3','assets/sounds/ambiance_underwater.ogg']);
		game.load.audio('explosion_snd', ['assets/sounds/explosion.mp3', 'assets/sounds/explosion.ogg']);
		game.load.audio('motor_snd', ['assets/sounds/motor.mp3', 'assets/sounds/motor.ogg']);
		game.load.audio('rocket_snd', ['assets/sounds/rocketFire.mp3','assets/sounds/rocketFire.ogg']);
		game.load.audio('bonusPickUp', ['assets/sounds/bonusPickUp.mp3', 'assets/sounds/bonusPickUp.ogg']);
		game.load.audio('boat_horn', ['assets/sounds/boat_horn.mp3','assets/sounds/boat_horn.ogg']);
		game.load.audio('dive', ['assets/sounds/dive.mp3', 'assets/sounds/dive.ogg']);
		
		
		game.stage.backgroundColor = '#ffffff';
		game.load.onFileComplete.add(updateProgressBar, this);
		
		progressLoad = game.add.text(game.world.width / 2 - 25,  game.world.height / 2 + 50, "0%", { font: "30px 'Razing'", fill: "#ffffff", stroke: '#78ceec', strokeThickness: 3, align: "center" });
		
		fileLoaded = game.add.text(game.world.width / 2 - 50,  game.world.height / 2 + 85, "...", { font: "12px Arial", fill: "#4f90b0", align: "center" });
	}
	
	function updateProgressBar(progress, cache_ID, success, files_loaded, total_files) {
		if (cache_ID == "logoCrazySub") {
			logo = game.add.sprite(game.world.width / 2 - 222 , game.world.height / 2 - 115, "logoCrazySub");
		}

		
		
		progressLoad.content = progress + "%";
		fileLoaded.content = cache_ID + " (" + files_loaded +"/" + total_files + ")";
		
	}
	
	
	function create() {
		
		
		cameraOffset = -1 * game.world.height + 120;

		sounds = new audioEmitters();	
		limites = new Limits();
		tileViewport = new tileViewport();
		
		// Start Menu
		environment = new Environment();
		environment.createLayer(1);
		startMenu = new StartMenu();
		
		foes = new Foes();
		bonus = new Bonus();
		particles = new ParticulesManager();
		gun = new bulletClip(submarine_types[subChoice].clipSize);
		player = new Player(submarine_types[subChoice].texture, submarine_types[subChoice].lifes);
		startMenu.checkIfAvailable();

		environment.createLayer(2);
//		environment.populateRandom();
//		environment.updateCameraPos();
		
		pauseMenu = new PauseMenu();
		optionsScreen = new optionsScreen();
		gameOverScreen = new gameOverScreen();
		helpScreen = new helpScreen();
		
		setControls();
		
		
		
		// debug
//		fps = game.add.text(5,  game.world.height -20, "0", { font: "10px Arial", fill: "#eaff00", stroke: '#78ceec', strokeThickness: 0, align: "center" });
		
		
	}
	
	function update() {
		
		startMenu.animateBoat();
		
		
		if (gameState == 0) {
//			environment.randomSpawn(environment.waves, 60, 80, 25 + cameraOffset);
//			environment.randomSpawn(environment.poissons_far, 300, 750, 75 + cameraOffset, game.world.height - 150 + cameraOffset);
//			environment.randomSpawn(environment.poissons_mid, 500, 1200, 75 + cameraOffset, game.world.height - 150 + cameraOffset);
		} 
		else if (gameState === 1) {
			if (cameraOffset >= 0) {
				gameState = 2;
			} else {
				cameraOffset += 3;
			}
			
			if (player.submarine.y > game.world.height / 2) {
				player.submarine.y -= 0.3;
			}
			
			tileViewport.updateCameraPos();
			startMenu.updateCameraPos();			
//			environment.updateCameraPos();

			
		} else if (gameState === 2) {
			// fade interface
			if (startMenu.visible) {
				startMenu.fadeAway();			
			}
			
			// all x
			if (player.submarine.x > 30) {
				offsetXCamera();
			} else {
				
				if (bestScore <= 0) {
					helpScreen.launch();	
				} else {
					startGame();					
				}
			}

		} else if (gameState === 3) {
		
			particles.animate();
			updateDistance();
			updateDifficulty();
			
			// Animations
			tileViewport.scrollBy(gameSpeed);
			
			environment.spawnRefresh();
			foes.spawnRefresh();
			bonus.spawnRefresh();
			player.updateSubmarine();
			
			foes.animateSharks();
			foes.animateBarrels();
			
			game.physics.collide(player.submarine, limites.ground, hitGround, null, this);
			game.physics.collide(player.submarine, limites.sky);
			game.physics.overlap(foes.barrels, limites.ground, barrelOnTheFloor, null, this);

			game.physics.overlap(player.submarine, foes.mines, hitMine, null, this);
			game.physics.overlap(player.submarine, foes.barrels, hitBarrel, null, this);			
			game.physics.overlap(player.submarine, foes.boats, dammagePlayer, null, this);
			game.physics.overlap(player.submarine, foes.sharks, dammagePlayer, null, this);
			game.physics.overlap(player.submarine, environment.rockBack, dammagePlayer, null, this);

			game.physics.overlap(player.submarine, bonus.health, takeHealth, null, this);
			game.physics.overlap(player.submarine, bonus.ammo, takeAmmo, null, this);
			game.physics.overlap(player.submarine, bonus.tripleHealth, takeTripleHealth, null, this);
			game.physics.overlap(player.submarine, bonus.tripleAmmo, takeTripleAmmo, null, this);

			game.physics.overlap(gun.clip, foes.mines, dammageFoes, null, this);
			game.physics.overlap(gun.clip, foes.sharks, dammageFoes, null, this);
			game.physics.overlap(gun.clip, foes.barrels, dammageFoes, null, this);
			
			// Inputs
			if (player.move == "up") {
				player.submarine.body.velocity.y = -60;
			}

			if (player.move == "down") {
				player.submarine.body.velocity.y = 60;
			}
			

		}
		
		if (gameState != 4) { // if not paused
			frameNumber++;
			tileViewport.animate();
		}
		

			
	}

	function render() {
//		game.debug.renderPhysicsBody(player.submarine.body);
//		
//		foes.sharks.forEachAlive(function(s){
//			game.debug.renderPhysicsBody(s.body);
//		});
//		
//		foes.mines.forEachAlive(function(s){
//			game.debug.renderPhysicsBody(s.body);
//		});		
//		
//		foes.boats.forEachAlive(function(s){
//			game.debug.renderPhysicsBody(s.body);
//		});
//		
//		foes.barrels.forEachAlive(function(s){
//			game.debug.renderPhysicsBody(s.body);
//		});
//		
//		environment.rockBack.forEachAlive(function(s){
//			game.debug.renderPhysicsBody(s.body);
//		});
//		
//		bonus.health.forEachAlive(function(s){
//			game.debug.renderPhysicsBody(s.body);
//		});
//		
//		bonus.ammo.forEachAlive(function(s){
//			game.debug.renderPhysicsBody(s.body);
//		});
//		
//		bonus.tripleHealth.forEachAlive(function(s){
//			game.debug.renderPhysicsBody(s.body);
//		});
//		
//		bonus.tripleAmmo.forEachAlive(function(s){
//			game.debug.renderPhysicsBody(s.body);
//		});
//		
//		game.debug.renderPhysicsBody(limites.ground.body);
		
		
//		fps.content = game.time.fps;

	}
}