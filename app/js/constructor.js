/*
 * 
 * TileViewport
 * 
 */

function tileViewport() {
	
	this.sky = tileLayer(0, "ciel", game.world.width,  game.world.height, 0, (-1 * game.world.height + 120));
	this.sky.getFirstAlive().tileScale.y = (1,canvas.clientHeight / 64);
//	this.sky.scale.setTo(1, game.world.height / 64);
	
	this.see = tileLayer(0.1, "see_grad", game.world.width, game.world.height, 0, 35);
	this.see.getFirstAlive().tileScale.y = (1,canvas.clientHeight / 320);
	
	this.rocks = tileLayer(0.3 ,"rock_tile", game.world.width, 128, 0, game.world.height - 130, 0.5);
	this.sol_b = tileLayer(0.75 ,"sol_b", game.world.width, 32, 0, game.world.height - 28);
	this.sol_a = tileLayer(1 ,"sol_a", game.world.width, 16, 0, game.world.height - 15);
	
	this.wave_03 = tileLayer(0.4 ,"wave_03", game.world.width, 8, 0, 24);
	this.wave_02 = tileLayer(0.7 ,"wave_02", game.world.width, 18, 0, 19);
	
	this.overlayWaves = tileLayer(1 ,"overlay_waves", game.world.width, game.world.height, 0, 0, 0.018, 0.3);
	this.overlayWaves.y = 35;
	
	this.scrollTo = function(pos) {
		for (var layer in this) {
			if (this.hasOwnProperty(layer) && typeof this[layer] !== 'function') {
				var group = this[layer];
				group.forEach(function (item) {
					item.tilePosition.x = group.speed * pos;
				});
			}
		}
	};
	
	this.scrollBy = function(incr) {
		cmDistance += incr;
		this.scrollTo(-cmDistance);
	};
	
	this.animate = function() {
		var overlay = this.overlayWaves.getFirstExists(true),
			wave_02 = this.wave_02.getFirstExists(true),
			wave_03 = this.wave_03.getFirstExists(true),
			sin_1s = Math.sin(frameNumber/60);
		
		overlay.tilePosition.y = overlay.tilePosition.y + sin_1s;
		overlay.tilePosition.x = overlay.tilePosition.x + sin_1s;
		
		wave_02.tilePosition.x = wave_02.tilePosition.x + sin_1s;
		wave_03.tilePosition.x = wave_03.tilePosition.x + sin_1s / 2;
		
	};
	
	this.updateCameraPos = function() {
		for (var layer in this) {
			if (this.hasOwnProperty(layer) && typeof this[layer] !== 'function') {
				var group = this[layer];
				group.forEach(function (item) {
					item.y = group.baseY - cameraOffset;
				});
			}
		}
	};
	
	this.updateCameraPos();
	
}


/*
 * 
 * Environment
 * 
 */


function Environment() {
	this.createLayer = function(layer) {
		if (layer === 1) {			
			this.poissons_far = spritesLayer(0.25, -5,["poissons_1", "poissons_2"], 10, 0, 0.8, 0.75);
			this.poissons_mid = spritesLayer(0.5, -10,["poissons_1", "poissons_2"], 10, 120, 1, 1.2);
			this.caustics = spritesLayer(0.3, 0,["caustic_small", "caustic_medium", "caustic_large"], 4, 0);			
			this.rockBack = spritesLayer(1, 0,["backRock_1", "backRock_2", "backRock_3", "backRock_4"], 8, 0, false, false, [0,0.99]);
			this.setHitBox();

		} else if (layer === 2) {
			this.waves = spritesLayer(1, -20, ["wave_01a", "wave_01b"], 20, 0, 0.9);
			this.rockFront = spritesLayer(1.15, 0,["front_rock_1", "front_rock_2","front_rock_3"], 8, 300, false, 1);
		}		
	};
	
	
	this.randomSpawn = function(pool, respawnMin, respawnMax, yMin, yMax) {
		var toSpawn = pool.getRandom(),
			y = yMax ? Math.floor(Math.random() *  (yMax - yMin)) + yMin: yMin;
		
		if (toSpawn && !toSpawn.alive && frameNumber > pool.respawnTimer) {
			toSpawn.reset(game.world.width + 1, y);
			toSpawn.body.velocity.x = -1 * pool.speed * Environment.VELOCITY * gameSpeed + toSpawn.internVelocity;
			
			if (gameSpeed > 0) {

				pool.respawnTimer = frameNumber + (Math.floor(Math.random() * (respawnMax - respawnMin)) + respawnMin) / gameSpeed;
			} else if (toSpawn.internVelocity !== 0) {
				pool.respawnTimer = frameNumber + (Math.floor(Math.random() * (respawnMax - respawnMin)) + respawnMin) * (-60 / toSpawn.internVelocity);
			}
			
			if (haveBubble(toSpawn)) {
				particles.createEmitter(bubbleParam, toSpawn.x + spriteBubblePoint[toSpawn.key].x,  toSpawn.y + spriteBubblePoint[toSpawn.key].y, pool.speed );
				this.bringLayerToTop();
			}
		}
	};

	this.spawnRefresh = function() {
		this.randomSpawn(this.waves, 60, 80, 25);
		this.randomSpawn(this.poissons_far, 300, 750, 75, game.world.height - 150);
		this.randomSpawn(this.poissons_mid, 500, 1200, 75, game.world.height - 150);		
		
		this.randomSpawn(this.rockBack, 120, 350, game.world.height - 10);		
		
		this.randomSpawn(this.caustics, 600, 720, 30);
		this.randomSpawn(this.rockFront, 500, 1200, game.world.height - 130);		
	};
	
	this.populateRandomFromPool = function(pool, xMin, xMax, y, nbr, fromFirstBound) {
		var xPos = fromFirstBound ? 0 : Math.floor(Math.random() * xMax) + xMin,
			toSpawn;
		for (nbr; nbr > 0; nbr -= 1) {
			toSpawn = pool.getRandom();
			toSpawn.baseY = y;
			if (toSpawn && !toSpawn.alive) {
				toSpawn.reset(xPos, y);
				xPos = xPos + Math.floor(Math.random() * xMax) + xMin;
				toSpawn.body.velocity.x = -1 * pool.speed * Environment.VELOCITY * gameSpeed + toSpawn.internVelocity;
			}
		}
	};
	
	this.populateRandom = function() {
		this.populateRandomFromPool(this.waves, 50, 100, 25, 7, true);
		this.populateRandomFromPool(this.caustics, 50, 350, 30, 1, false);

		this.populateRandomFromPool(this.poissons_far, 150, 350, 100, 1, false);
		this.populateRandomFromPool(this.poissons_mid, 50, 200, 150, 1, false);		
		this.populateRandomFromPool(this.rockBack, 80, 100, game.world.height - 10, 2, false);
	};
	
	
	this.bringLayerToTop = function() {
		this.rockFront.forEach(function (el) {
			el.bringToTop();
		});
	};
	
	this.recalculateVelocity = function(freeze) {
		for (var layer in this) {
			if (this.hasOwnProperty(layer) && typeof this[layer] !== 'function') {
				var group = this[layer];
				group.forEach(function (item) {
					item.body.velocity.x = freeze ? 0 : -1 * group.speed * Environment.VELOCITY * gameSpeed + item.internVelocity;
				});
			}
		}
	};
	
	this.updateCameraPos = function() {
		for (var layer in this) {
			if (this.hasOwnProperty(layer) && typeof this[layer] !== 'function') {
				var group = this[layer];
				group.forEach(function (item) {
					item.y = item.baseY - cameraOffset;
				});
			}
		}
	};
	
	this.offsetXCamera = function(incr) {
		for (var layer in this) {
			if (this.hasOwnProperty(layer) && typeof this[layer] !== 'function') {
				var group = this[layer];
				group.forEach(function (item) {
					item.x += incr;
				});
			}
		}
	};
	
	this.resetAll = function() {
		for (var layer in this) {
			if (this.hasOwnProperty(layer) && typeof this[layer] !== 'function') {
				var group = this[layer];
				group.respawnTimer = group.baseRespawn;
				group.forEach(function (item) {
					item.kill();
				});
			}
		}
//		environment.populateRandom();
//		environment.updateCameraPos();
	};
	
	this.setHitBox = function() {
		this.rockBack.forEach( function (b) {
			switch (b.key) {
				case "backRock_1" :
					b.body.setPolygon( 102,0, 118,18, 119,48, 125,50, 130,71, 147,72, 175,95, 93,96, 34,83, 47,72, 48,60, 60,50, 60,40, 74,28, 80,15, 85,6  );
					break;
				case "backRock_2" :
					b.body.setPolygon( 22,48, 74,45, 111,60, 22,67 );
					break;
				case "backRock_3" :
					b.body.setPolygon( 64,4, 71,1, 93,7, 137,47, 143,59, 160,60, 187,62, 203,76, 28,75, 45,45, 43,25, 58,16 );
					break;
				case "backRock_4" :
					b.body.setPolygon( 83,2, 115,6, 125,54, 166,72, 167,88, 4,88, 36,57, 55,62, 73,51);
					break;					
				default: break;
			}
		});
	};
}

Environment.VELOCITY = 60;

/*
 * 
 * Foes
 * 
 */

function Foes() {
	
	var allowBarrelsFor = 0;
	
	this.mines = spritesLayer(1, 0,["mine"], 15, 120, false, false, [0.5,0.5]);
	this.mines.forEach( function (s) {
		s.body.setPolygon(40,32, 58,32, 65,39, 65,69, 58,75, 40,75, 34,69, 34,39 );
	});
	
	this.boats = spritesLayer(0.6, 0,["boat_foes"], 3, 2500);
	this.boats.setAll("immovable", true);
	this.boats.forEach( function (s) {
		s.body.setPolygon( 0,0, 800,0, 752,70, 638,73, 551,82, 135,84, 60,90, 25,90, 20,65 );
		s.prevRotat = 0;
	})
		
	this.sharks = spritesLayer(1, 0,["shark"], 5, 1200, false, false, [0,0]);
	this.sharks.forEach( function (s) {
		s.body.setPolygon( 50,0, 51,11, 76,18, 101,10, 93,21, 95,33, 80,25, 47,29, 52,35, 37,31, 7,30, 2,24, 16,13, 37,8 );
		s.prevRotat = 0;
	});
	
	this.barrels = spritesLayer(1, 0,["barrel"], 8, 0);
	this.barrels.forEach( function (s) {
		s.body.setPolygon( 13,1, 23,4, 29,10, 17,32, 7,27, 2,22 );
		s.target = game.add.sprite(0,0);
	});	
	
	
	
	this.randomSpawn = function(pool, respawnMin, respawnMax, yMin, yMax, anim) {		
		var toSpawn = pool.getFirstDead(),
			y = yMax ? Math.floor(Math.random() *  (yMax - yMin)) + yMin: yMin,
			allowSpan = allowSpan = !(toSpawn && frameNumber > pool.respawnTimer) ? false : !(toSpawn.key == "barrel") ? true : (allowBarrelsFor > 0) ? true : false;

			if (toSpawn && toSpawn.key == "mine" && allowBarrelsFor > 0) allowSpan = false;

		if (allowSpan) {			
			toSpawn.reset(game.world.width + 1, y);
			toSpawn.body.velocity.x = -1 * pool.speed * Environment.VELOCITY * gameSpeed;
			
			if (toSpawn.key == "barrel") {
				this.setRandomBarrel(toSpawn);
			} else if (toSpawn.key == "boat_foes") {
				allowBarrelsFor = 1500 / gameSpeed;
				sounds.play("boat_horn", effectsVolume, 0.6);
				particles.createEmitter(boatBubble, game.world.width, 80, 0.6);
				
			}
			
			if (anim) {
				toSpawn.animations.add(anim.name);
				toSpawn.animations.play(anim.name, anim.frameRate, anim.loop);
			}
			
			pool.respawnTimer = frameNumber + (Math.floor(Math.random() * (respawnMax - respawnMin)) + respawnMin) / gameSpeed;
		}
	};
	
	
	this.spawnRefresh = function() {
		this.randomSpawn(this.mines, 180, 320, 80, game.world.height - 50, minesParam.anim);
		this.randomSpawn(this.boats, 3500, 5500, 0, 0);
		this.randomSpawn(this.sharks, 1800, 2500, 80, game.world.height - 50);
		this.randomSpawn(this.barrels, 300, 450, 0);
		
	};
	
	this.animateSharks = function() {
		this.sharks.forEachAlive(function (item) {
			if (item.x > 100) {
				item.rotation = this.game.math.degToRad(180) + this.game.physics.moveToObject(item, player.submarine, 100 * gameSpeed);
				item.body.polygon.rotate(item.rotation - item.prevRotat);
				item.prevRotat = item.rotation;
			}
		});
	};
	
	this.recalculateVelocity = function(freeze) {
		for (var layer in this) {
			if (this.hasOwnProperty(layer) && typeof this[layer] !== 'function') {
				var group = this[layer];
				group.forEach(function (item) {
					item.body.velocity.x = freeze ? 0 : -1 * group.speed * Environment.VELOCITY * gameSpeed + item.internVelocity;
					item.body.velocity.y = freeze ? 0 : item.body.velocity.y;
				});
			}
		}
		
		this.barrels.forEachAlive(function(b){b.body.angularVelocity = freeze ? 0 : 10;});
	};
	
	this.resetAll = function() {
		for (var layer in this) {
			if (this.hasOwnProperty(layer) && typeof this[layer] !== 'function') {
				var group = this[layer];
				group.respawnTimer = group.baseRespawn;
				
				group.forEach(function (item) {
					item.kill();
				});
			}
		}
		
		
	};
	
	this.setRandomBarrel = function(barrel) {
		barrel.target.reset(-50,Math.floor(Math.random() * (game.world.height - 150) ) + 30);
		barrel.reset(game.world.width,-30);
		barrel.rotation = 0;
		barrel.body.angularVelocity = 10;
		var randomSize = (Math.floor(Math.random() * 4) + 8) / 10;
		barrel.scale.x = randomSize;
		barrel.scale.y = randomSize;	
		
		barrel.randomSpeed = Math.floor(Math.random() * 20) + 50;
		barrel.previousRotation = 0;
		
		barrel.leakPaticles = particles.createEmitter(toxicBubbles, barrel.x, barrel.y, 1);
	}
	
	this.animateBarrels = function() {
		
		allowBarrelsFor = allowBarrelsFor > 0 ? allowBarrelsFor - 1 : 0;
		
		this.barrels.forEachAlive(function(b) {
			this.game.physics.moveToObject(b, b.target, b.randomSpeed * gameSpeed);
			
			b.body.polygon.rotate(b.rotation - b.previousRotation);
			b.previousRotation = b.rotation;
			
			b.leakPaticles.x = b.x;
			b.leakPaticles.y = b.y;
			
		});
	}
}


/*
 * 
 * Bonus
 * 
 */

function Bonus() {
	this.health = spritesLayer(1, 0,["healthPack"], 10, 2400, false, false, [0.5,0.5]);
	this.health.forEach(function(el){el.body.setRectangle(30,34,34,31);});
	this.ammo = spritesLayer(1, 0,["ammoPack"], 10, 1800, false, false, [0.5,0.5]);	
	this.ammo.forEach(function(el){el.body.setRectangle(39,40,28,25);});
	this.tripleHealth = spritesLayer(1, 0,["tripleHealthPack"], 10, 4270, false, false, [0.5,0.5]);
	this.tripleHealth.forEach(function(el){el.body.setRectangle(30,34,34,31);});
	this.tripleAmmo= spritesLayer(1, 0,["tripleAmmoPack"], 10, 4270, false, false, [0.5,0.5]);
	this.tripleAmmo.forEach(function(el){el.body.setRectangle(33,37,31,28);});
	
	this.randomSpawn = function(pool, respawnMin, respawnMax, yMin, yMax, anim) {
		var toSpawn = pool.getFirstDead(),
			y = yMax ? Math.floor(Math.random() *  (yMax - yMin)) + yMin: yMin;
		
		if (toSpawn && frameNumber > pool.respawnTimer) {
			toSpawn.reset(game.world.width + 1, y);
			toSpawn.body.velocity.x = -1 * pool.speed * Environment.VELOCITY * gameSpeed;
			
			pool.respawnTimer = frameNumber + (Math.floor(Math.random() * (respawnMax - respawnMin)) + respawnMin) / gameSpeed;
		}
	};
	
	this.spawnRefresh = function() {
		this.randomSpawn(this.health, 1000, 1450, 80, game.world.height - 100);
		this.randomSpawn(this.ammo, 1000, 1450, 80, game.world.height - 100);
		this.randomSpawn(this.tripleHealth, 5000, 10000, 80, game.world.height - 100);
		this.randomSpawn(this.tripleAmmo, 5000, 10000, 80, game.world.height - 100);
	};
	
	this.recalculateVelocity = function(freeze) {
		for (var layer in this) {
			if (this.hasOwnProperty(layer) && typeof this[layer] !== 'function') {
				var group = this[layer];
				group.forEach(function (item) {
					item.body.velocity.x = freeze ? 0 : -1 * group.speed * Environment.VELOCITY * gameSpeed + item.internVelocity;
				});
			}
		}
	};
	
	this.resetAll = function() {
		for (var layer in this) {
			if (this.hasOwnProperty(layer) && typeof this[layer] !== 'function') {
				var group = this[layer];
				group.respawnTimer = group.baseRespawn;
				group.forEach(function (item) {
					item.kill();
				});
			}
		}
	};
}


/*
 * 
 * Player
 * 
 */

function Player(sub_tex, lifesNbr) {
	this.submarine = game.add.sprite(game.world.width / 2 - 20, game.world.height - 135, sub_tex);
	this.submarine.anchor.x = 0.25;
	this.submarine.anchor.y = 0.5;
	this.submarine.body.bounce.y = submarine_types[subChoice].bounce;
	this.submarine.body.collideWorldBounds = true;
	
	this.rearBubbles = particles.createEmitter(rearBubblesParam, this.submarine.x, this.submarine.y, 0, true);
	this.onFire = false;
	
	this.maxLife = lifesNbr;
	this.life = this.maxLife;
	
	this.invulnarableTimer = 0;
	
	this.cadenas = game.add.sprite( game.world.width / 2 - 57, game.world.height - 148, "cadenas");
	this.baseLockText = game.add.text(game.world.width / 2 - 27,  game.world.height - 142, "reach", { font: "16px 'Razing'", fill: "#77cfee", stroke: '#ffffff', strokeThickness: 3 });
	
	this.lockValue = game.add.text(game.world.width / 2 + 20,  game.world.height - 142, "250m", { font: "16px 'Razing'", fill: "#ed8f21", stroke: '#ffffff', strokeThickness: 3 });
	this.cadenas.kill();
	this.baseLockText.alpha = 0;
	this.lockValue.alpha = 0;

	
	this.initialize = function(gravityOnly) {
		this.submarine.body.gravity.y = submarine_types[subChoice].gravity;
		
		if (!gravityOnly) {
			if (subChoice == "submarine_a") {
				this.submarine.body.setPolygon( 3,7, 12,18, 24,8, 28,1, 34,1, 41,6, 59,11, 67,21, 67,34, 52,44, 31,44, 14,36, 7,41 );
			} else if (subChoice == "submarine_b") {
				this.submarine.body.setPolygon( 1,10, 15,9, 15,18, 25,10, 48,4, 65,16, 67,27, 61,39, 38,43, 18,37, 16,44, 2,43 );
			} else if (subChoice == "submarine_c") {
				this.submarine.body.setPolygon( 3,3, 12,12, 23,9, 44,2, 47,7, 71,12, 93,27, 89,36, 67,42, 24,38, 22,34, 13,34, 6,43 );
			} else if (subChoice == "submarine_d") {
				this.submarine.body.setPolygon( 1,4, 60,3, 64,0, 84,0, 86,6, 94,16, 95,29, 81,44, 66,42, 40,42 );
			}

			this.submarine.reset(30, game.world.height / 2);	
			
		}		
	}
	
	this.takeDamage = function(dgt) {
		
		if (this.invulnarableTimer <= 0) {
			this.life = this.life - dgt;
			if (this.life <= 0 ) {
				this.life = 0;
				this.isKilled();
			}
			this.checkLife();
			this.updateInterface();
			this.invulnarableTimer = 60;	
		}
	};
	
	this.heal = function(pts) {
		this.life = this.life + pts > this.maxLife ? this.maxLife : this.life + pts;
		this.updateInterface();
		this.checkLife();
	};
	
	this.updateInterface = function() {
		for (var i = 0; i < interface.lifes.length; i++ ) {			
			if (i < this.life && interface.lifes[i].key != "life_full") {
				interface.lifes[i].loadTexture('life_full');
			} else if (i >= this.life && interface.lifes[i].key != "life_empty") {
				interface.lifes[i].loadTexture('life_empty');
			}
		}		
	};
	
	this.updateSubmarine = function() {
		var angle =  Math.sin( ((this.submarine.y / game.world.height) * 0.75 - 0.35) * 1 );
		this.submarine.rotation = angle;
		
		this.rearBubbles.rotation = angle;
		this.rearBubbles.x = this.submarine.x;
		this.rearBubbles.y = this.submarine.y;
		if (this.onFire) {
			this.onFire.x = this.submarine.x;
			this.onFire.y = this.submarine.y;
		}
		
		if (this.invulnarableTimer > 0 ) {
			this.submarine.alpha =  Math.cos(this.invulnarableTimer) / 5;
			this.invulnarableTimer -= 1;
			if (this.invulnarableTimer === 0) {
				this.submarine.alpha = 1;
			}
		}
	};
	
	this.isKilled = function() {	
		this.submarine.kill();
		sounds.play("alarm", effectsVolume, 1, true);
		gameOver();
	};
	
	this.resetAll = function() {
		this.submarine.reset( game.world.width / 2 - 20, game.world.height - 135);
		this.submarine.body.gravity.y = 0;
		this.submarine.body.velocity.y = 0;
		this.submarine.rotation = 0;
		this.rearBubbles = particles.createEmitter(rearBubblesParam, this.submarine.x, this.submarine.y, 0, true);
		this.invulnarableTimer = 0;
	}
	
	this.checkLife = function() {
		var currentParticles = this.rearBubbles.cursor.key;
		if (this.life === 1 && currentParticles != "etincelle") {
			this.onFire = particles.createEmitter(onFire, this.submarine.x, this.submarine.y, 0);
		} else {
			if (this.onFire) {
				particles.destroyEmitter(this.onFire.iIndex);
			}
			this.onFire = false;
		}
	}
}


/*
 * 
 * GUN PAN PAN
 * 
 */

function bulletClip(size) {
	this.maxClipSize = size;
	this.clipSize = this.maxClipSize;
	
	this.clip = game.add.group();
	this.clip.createMultiple(9, "missile");
	this.clip.setAll("scale.x", 0.5);
	this.clip.setAll("scale.y", 0.5);	
	
	this.clip.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', returnMissile, this);
	
	this.reloadTime = 0;
	
	this.fire = function() {
		var missile = this.clip.getFirstDead(),
			missile2 = missile,
			missile3 = missile;
		
		if (subChoice == "submarine_c" || subChoice == "submarine_d") {
			while (missile2 == missile || missile2.alive) {
				missile2 = this.clip.getRandom();
			}
		}
		
		if (subChoice == "submarine_d") {
			while (missile3 == missile || missile3 == missile2 || missile3.alive) {
				missile3 = this.clip.getRandom();
			}
		}
		
		
//			missile2 = subChoice == "submarine_c" || subChoice == "submarine_d" ? this.clip.getFirstDead() : true,
//			missile3 = subChoice == "submarine_d" ? this.clip.getFirstDead() : true;
		
		if (missile && missile2 && missile3 && this.reloadTime < frameNumber && this.clipSize > 0) {		
			this.clipSize--;
			var xPos = player.submarine.x + player.submarine.width / 2,
				yPos = player.submarine.y + player.submarine.height * 0.40;
			
			missile.reset(xPos, yPos);
			missile.body.velocity.x = submarine_types[subChoice].missilesSpeed * gameSpeed;
			missile.attachedParticles = particles.createEmitter(missileParticulesParam, xPos,  yPos, -1 * submarine_types[subChoice].missilesSpeed / Environment.VELOCITY );
			
			if (subChoice == "submarine_c") {
				missile2.reset(xPos - 35, yPos);
				missile2.body.velocity.x = submarine_types[subChoice].missilesSpeed * gameSpeed;
				missile2.attachedParticles = particles.createEmitter(missileParticulesParam, xPos - 35,  yPos, -1 * submarine_types[subChoice].missilesSpeed / Environment.VELOCITY );
			}
			
			if (subChoice == "submarine_d") {
				missile2.reset(xPos - 10, yPos - 15);
				missile2.body.velocity.x = submarine_types[subChoice].missilesSpeed * gameSpeed;
				missile2.attachedParticles = particles.createEmitter(missileParticulesParam, xPos - 10,  yPos - 15, -1 * submarine_types[subChoice].missilesSpeed / Environment.VELOCITY );
				
				missile3.reset(xPos - 20, yPos - 30);
				missile3.body.velocity.x = submarine_types[subChoice].missilesSpeed * gameSpeed;
				missile3.attachedParticles = particles.createEmitter(missileParticulesParam, xPos - 20,  yPos - 30, -1 * submarine_types[subChoice].missilesSpeed / Environment.VELOCITY );
			}
			
			sounds.play("rocketLaunch", effectsVolume, 1);
			this.reloadTime = frameNumber + 60;
			this.refreshInterface();
		}
	};
	
	this.retrunMissile = function(missile) {
		missile.kill();
		particles.destroyEmitter(missile.attachedParticles.iIndex);
	};
	
	this.getNewMissiles = function(nbr) {
		this.clipSize = this.clipSize + nbr > this.maxClipSize ? this.maxClipSize : this.clipSize + nbr;
		this.refreshInterface();
	};
	
	this.refreshInterface = function() {
		for (var i = 0; i < interface.missiles.length; i++ ) {			
			if (i < this.clipSize && interface.missiles[i].key != "missile_full") {
				interface.missiles[i].loadTexture('missile_full');
			} else if (i >= this.clipSize && interface.missiles[i].key != "missile_empty") {
				interface.missiles[i].loadTexture('missile_empty');
			}
		}
		
		if (this.clipSize <= 0) {
			interface.missiles.forEach(function (el) { el.alpha = 0.5; });
		} else {
			interface.missiles.forEach(function (el) { el.alpha = 1; });
		}
	};
	
	this.freezeMissiles = function(freeze) {
		this.clip.forEachAlive(function (b) {
			b.body.velocity.x = freeze ? 0 : 200;
		});
	};
	
	this.resetAll = function() {
		this.clip.forEachAlive(function (b) {
			b.kill();
		});
		
		this.reloadTime = 0;
	};
}


/*
 * 
 * ParticulesManager
 * 
 */


function ParticulesManager() {
	this.pool = emitterPool(30); // plusieurs pools ?
	
	this.poolTrack = [];
	
	this.getEmitter = function() {
		var emit = this.pool.shift();
		if (emit) {
			return emit;
		} else {
			return new Phaser.Particles.Arcade.Emitter(game);
		}		
	};
	
	this.destroyEmitter = function(i, cleared) {
		var emitter = this.poolTrack[i].emitter
		this.pool.push(emitter);
	
		
		emitter.kill();
		
		setTimeout(function() {
			if (!cleared) {
				emitter.forEach(function(p){p.kill();});				
			}

			
		}, 1500);
	
		this.poolTrack[i] = false;
		
	};
	
	this.createEmitter = function(param, x, y, speed, dontPlay) {	
		var source = this.getEmitter(),
			velocity = -1 * speed * Environment.VELOCITY * gameSpeed;
		
		if (!source.cursor || source.cursor.key !== param.tex) { //  && source.cursor.key !== param.tex
			source.removeAll();
			source.makeParticles(param.tex);
			source.alreadyUsed = true;
		}
				
		for (var p in param.param) {
			source[p] = param.param[p];
		}
		
		source.minParticleSpeed.setTo(param.displace.xMin + velocity, param.displace.yMin);
		source.maxParticleSpeed.setTo(param.displace.xMax + velocity, param.displace.yMax);
		
		source.x = x;
		source.y = y;
		source.iIndex = this.poolTrack.length;
		
		if (!dontPlay) {
			source.start(param.emit.explode, param.emit.lifespan, param.emit.interval, param.emit.nbr);			
		}
		

		
		this.poolTrack.push({speed: speed, emitter: source, index: source.iIndex});
		
		source.update();
		
		return source;
	};
	
	this.animate = function() {
		var context = this;
		this.poolTrack.forEach(function (el) {			
			if (el) {
				el.emitter.update();
				el.emitter.x = el.emitter.x - (el.speed * gameSpeed);				
				if (el.emitter.x < 0) {
					context.destroyEmitter(el.index);
				}
//			si off ou out -> delete
			}
		});
	};
	
	this.resetAll = function() {
		for (var i = 0; i < this.poolTrack.length; i++) {
			if (this.poolTrack[i]) {
				this.poolTrack[i].emitter.forEach(function(p){p.kill();});
				this.destroyEmitter(i, true);				
			}
		}
	}
}


/*
 * 
 * Sounds
 * 
 */


function audioEmitters() {
	this.bg_music = game.add.audio('loop_music');	
	this.ambiance = game.add.audio('ambiance_snd');			
	this.bulles = game.add.audio('bulles');
	
	this.motor = game.add.audio('motor_snd');
	this.alarm = game.add.audio('alarme_snd');
	this.explosion = game.add.audio('explosion_snd');
	this.rocketLaunch = game.add.audio('rocket_snd');
	this.bonusPickUp = game.add.audio('bonusPickUp');
	this.dive = game.add.audio('dive');
	this.boat_horn = game.add.audio('boat_horn');
	
	
	
	this.play = function(which, multi, volume, loop, restart) {
		this[which].play("", 0, volume * multi, loop, restart); 
	};
	
	this.play("bg_music", musicVolume, 0.4, true);
	this.play("bulles", musicVolume, 0.7, true);
	this.play("ambiance", musicVolume, 1, true);
	
	this.stop = function(which) {
		this[which].stop();
	};
	
	this.resetVolumes = function(effects, musics) {
		if (gameState !== 4) {
			effectsVolume = effects ? effects : effectsVolume;
			musicVolume = musics ? musics : musicVolume;		
			this.motor.volume = effectsVolume * 0.25;
			this.alarm.volume = effectsVolume;
			this.explosion.volume = effectsVolume;
			this.rocketLaunch.volume = effectsVolume;
			this.bonusPickUp.volume = effectsVolume;
			this.dive.volume = effectsVolume * 0.7;
			this.boat_horn.volume = effectsVolume * 0.6;
			
			this.bg_music.volume = musicVolume * 0.4;
			this.ambiance.volume = musicVolume;	
			this.bulles.volume = musicVolume * 0.7;
		}
	}
	
	this.muteAll = function() {
		for (var music in this) {
			if (this.hasOwnProperty(music) && typeof this[music] !== 'function') {
				this[music].volume = 0;
			}
		}
	}
	
	this.resetAll = function() {
		this.stop("motor");
		this.stop("alarm");
		this.stop("motor");
		this.stop("explosion");
		this.stop("rocketLaunch");
		this.stop("bonusPickUp");
		this.stop("dive");
		this.stop("boat_horn");		
	}
}



/*
 * 
 * Game limits
 * 
 */

function Limits() {
	this.ground = game.add.sprite(0,game.world.height - 10);
	this.ground.width = game.world.width;
	this.ground.body.immovable = true;
	
	this.sky = game.add.sprite(0, 0);
	this.sky.width = game.world.width;
	this.sky.height = 30;
	this.sky.body.immovable = true;
}

/*
 * 
 * inGame Interface
 * 
 */

function Interface() {
	this.lifes = [];
	for (var i = 0; i < player.maxLife; i++) {
		var heart = game.add.sprite( 23 * i + 10,10,"life_full");
			heart.scale.setTo(0.65, 0.65);
		this.lifes.push(heart);
	}
	
	this.missiles = [];
	for (var i = 0; i < gun.clipSize; i++) {
		var missile = game.add.sprite( 18 * i + 15, 33,"missile_full");
			missile.scale.setTo(0.60, 0.60);
		this.missiles.push(missile);
	}
	this.pause_btn = game.add.button(game.world.width - 40, 14, 'pause_btn', pauseGame, this);
	this.pause_btn.scale.setTo(0.75,0.75);
	
	this.score = game.add.text(game.world.width / 2, 14, "0 m", { font: "26px 'Razing'", fill: "#ffffff", stroke: '#77cfee', strokeThickness: 4, align: "center" });

	this.resetAll = function() {
		this.lifes.forEach(function (item) {
			item.destroy();
		});
		this.lifes = [];
		
		this.missiles.forEach(function (item) {
			item.destroy();
		});
		this.missiles = [];
		
		this.pause_btn.destroy();
		this.score.destroy();
	}
	
	this.visibility = function(visible) {
		if (!visible) {
			this.pause_btn.kill();
			this.score.alpha = 0;
			this.lifes.forEach(function(c){
				c.alpha = 0;
			});

			this.missiles.forEach(function(c){
				c.alpha = 0;
			});
			
		} else {
			this.pause_btn.revive();
			this.score.alpha = 1;
			this.lifes.forEach(function(c){
				c.alpha = 1;
			});

			this.missiles.forEach(function(c){
				c.alpha = 1;
			});
		}
	};
}


/*
 * 
 * Menus
 * 
 */

function StartMenu() {
	var submarines = ["submarine_a", "submarine_b", "submarine_c", "submarine_d"];
	this.changeBoat = function(incr) {
		if (gameState === 0) {
			var choice = submarines.indexOf(subChoice) + incr > submarines.length - 1 ? 0 :
			submarines.indexOf(subChoice) + incr < 0 ? submarines.length -1 :
			submarines.indexOf(subChoice) + incr;
			subChoice = localStorage.lastSubChoice = submarines[choice];
			this.checkIfAvailable();
		}
	}
	
	this.checkIfAvailable = function() {
		if (bestScore >= submarine_types[subChoice].unlocked) {
			player.submarine.loadTexture(subChoice);
			this.playButton.revive();
			player.cadenas.kill();
			player.baseLockText.alpha = 0;
			player.lockValue.alpha = 0;
		} else {
			player.submarine.loadTexture("locked_" + subChoice);
			this.playButton.kill();
			player.cadenas.revive();
			player.baseLockText.alpha = 1;
			player.lockValue.alpha = 1;
			player.lockValue.content = submarine_types[subChoice].unlocked + "m";
		}
	}
	
	this.prevBoat = function(){
		this.changeBoat(-1);
	};
	
	this.nextBoat = function(){
		this.changeBoat(1);
	};
	
	function displayOptions () {
		optionsScreen.toggleDisplay();
	}

	
	
	this.boat = game.add.sprite(game.world.width / 2 + 15, game.world.height - 164, "start_boat");
	this.boat.anchor.setTo(0.5,0.5);
	this.boat.baseY = game.world.height - 164 + -1 * game.world.height + 120;
	
	this.aura = game.add.sprite(game.world.width / 2 -  75, game.world.height - 210, "start_aura");
	this.aura.baseY = game.world.height - 210 + -1 * game.world.height + 120;
	
	this.arrowLeft = game.add.button(game.world.width / 2 - 65, game.world.height - 150, "arrow_btn", this.prevBoat, this);
	this.arrowLeft.baseY = game.world.height - 150 + -1 * game.world.height + 120;
	this.arrowLeft.scale.x = -1;
	
	this.arrowRight = game.add.button(game.world.width / 2 + 65, game.world.height - 150, "arrow_btn", this.nextBoat, this);
	this.arrowRight.baseY =game.world.height - 150 + -1 * game.world.height + 120;
	
	this.playButton = game.add.button(game.world.width / 2  - 43, game.world.height - 100, "play_btn", lauchTransitionStart, this);
	this.playButton.baseY =  game.world.height - 100 + -1 * game.world.height + 120;
	if (bestScore < submarine_types[subChoice].unlocked) {
		this.playButton.kill();
	}
	
	this.options = game.add.button(game.world.width - 90, 10, "optionsBtn_startScreen", displayOptions, this);
	this.options.baseY =  10 + -1 * game.world.height + 120;
	
	this.highScore = game.add.text(60, 20, bestScore + "m", { font: "26px 'Razing'", fill: "#ece23a", stroke: '#83d2d9', strokeThickness: 3 });
	this.highScore.baseY =  20 + -1 * game.world.height + 120;	
	
	this.highScoreIcon = game.add.sprite( 10, 10, "highScoreIcon");
	this.highScoreIcon.baseY =  10 + -1 * game.world.height + 120;
	
	
	
	// if best score
	if (bestScore <= 0) {
		this.highScore.alpha = 0;
		this.highScoreIcon.alpha = 0;
	}
	
	this.updateCameraPos = function() {
		for (var item in this) {
			if (this.hasOwnProperty(item) && typeof this[item] !== 'function') {
				this[item].y = this[item].baseY - cameraOffset;
			}
		}
	};
		
	this.visible = true;
	
	var toFade = ["aura", "arrowLeft", "arrowRight", "playButton", "options", "highScore", "highScoreIcon"];
	this.fadeAway = function() {
		for (var t = 0; t < toFade.length; t++) {
			this[toFade[t]].alpha -= 0.05;
			if (this[toFade[t]].alpha <= 0) {
				this.visible = false;
			}
		}
	};
	
	this.animateBoat = function() {
		this.boat.rotation = Math.sin(frameNumber / 45 ) / 25 ;
	};
		
	this.offsetXCamera = function(incr) {
		for (var item in this) {
			if (this.hasOwnProperty(item) && typeof this[item] !== 'function') {			
				this[item].x += incr;
			}
		}
	};
	
	var toMove = ["boat", "aura", "arrowLeft", "arrowRight", "playButton", "options", "highScoreIcon"];
	this.recalculateVelocity = function(freeze) {
		for (var m = 0; m < toMove.length; m++) {
			this[toMove[m]].body.velocity.x = freeze ? 0 : -1 * Environment.VELOCITY * gameSpeed;
			this[toMove[m]].outOfBoundsKill = true;
		}
	};
	
	this.resetAll = function() {
		for (var i = 0; i < toMove.length; i++) {
			this[toMove[i]].revive();
			this[toMove[i]].alpha = 1;
			this[toMove[i]].body.velocity.x = 0;
		}
		
		this.visible = true;
		
		this.boat.x = game.world.width / 2 + 15;
		this.boat.y = this.boat.baseY;
		
		this.aura.x = game.world.width / 2 -  75;
		this.aura.y = this.aura.baseY;

		this.arrowLeft.x = game.world.width / 2 - 65;
		this.arrowLeft.y = this.arrowLeft.baseY;

		this.arrowRight.x = game.world.width / 2 + 65;
		this.arrowRight.y = this.arrowRight.baseY;

		this.playButton.x = game.world.width / 2  - 43;
		this.playButton.y = this.playButton.baseY;
		
		this.options.x = game.world.width - 90;
		this.options.y = this.options.baseY;
		
		this.highScore.x = 55;
		this.highScore.y = this.highScore.baseY;
		this.highScore.alpha = 1;
		
		this.highScoreIcon.x = 10;
		this.highScoreIcon.y = this.highScoreIcon.baseY;
	};
}

function PauseMenu() {
	this.lauchResume = function () {
		if (gameState === 4) {
			this.visibility(false);
			startGame(true);
		}
	};
	
	this.lauchRestart = function () {
		if (gameState === 4) {
			this.visibility(false);
			resetGame();
		}
	};
	
	this.lauchOptions = function () {
		if (gameState === 4) {
			optionsScreen.toggleDisplay();
		}
	};
	
	this.aura = game.add.sprite(game.world.width / 2 -  150, game.world.height / 2  - 150, "aura_pause");
	this.resume = game.add.button(game.world.width / 2 - 75, game.world.height / 2 - 60, "resumeBtn", this.lauchResume, this);
	this.restart = game.add.button(game.world.width / 2 - 75, game.world.height / 2 , "restartBtn", this.lauchRestart, this);
	this.options = game.add.button(game.world.width / 2 - 75, game.world.height / 2 + 60, "optionsBtn", this.lauchOptions, this);
	
	this.visibility = function(visible) {
		if (!visible) {
			for (var element in this) {
				if (this.hasOwnProperty(element) && typeof this[element] !== 'function') {
					this[element].kill();
				}
			}
			
			if (interface) interface.visibility(true);
			
			
		} else {
			for (var element in this) {
				if (this.hasOwnProperty(element) && typeof this[element] !== 'function') {
					this[element].revive();
				}
			}
			
			if (interface) interface.visibility(false);
			
		}
	};
	
	this.visibility(false);
}

function optionsScreen() {
	this.toggleDisplay = function(hide) {
		for (var element in this) {
			if (this.hasOwnProperty(element) && typeof this[element] !== 'function') {
				if (hide) {
					this[element].kill();
				} else {
					this[element].revive();
				}
			}
		}
	};
	
	this.toggleEffects = function () {
		if (effectsVolume <= 0) {
			this.effectsVolume.loadTexture("toggleOn");
			effectsVolume = localStorage.effectsVolume = 1;
		} else {
			this.effectsVolume.loadTexture("toggleOff");
			effectsVolume = localStorage.effectsVolume = 0;
		}		
		sounds.resetVolumes();
	}
	
	this.toggleMusics = function () {
		if (musicVolume <= 0) {
			this.musicVolume.loadTexture("toggleOn");
			musicVolume = localStorage.musicVolume = 1;
		} else {
			this.musicVolume.loadTexture("toggleOff");
			musicVolume = localStorage.musicVolume = 0;
		}		
		sounds.resetVolumes();
	}
	
	var texEffect = effectsVolume <= 0 ? "toggleOff" : "toggleOn",
		texMusics = musicVolume <= 0 ? "toggleOff" : "toggleOn";;
	
	this.panel = game.add.sprite(game.world.width / 2 -  228, game.world.height / 2  - 151, "optionPanel");
	this.leaveBtn = game.add.button(game.world.width / 2 + 210, game.world.height / 2 - 155, "leaveOptions", hideOptions, this);
	this.effectsVolume = game.add.button(game.world.width / 2 + 15, game.world.height / 2 - 45, texEffect, this.toggleEffects, this);
	this.musicVolume = game.add.button(game.world.width / 2 + 15, game.world.height / 2 + 15, texMusics, this.toggleMusics, this);
	
	function hideOptions() {
		this.toggleDisplay(true);
	}
	
	this.toggleDisplay(true);
}

function gameOverScreen() {
	function newGame() {
		this.toggleDisplay(true);
		resetGame();
	}
	
	this.newGame = game.add.button(game.world.width / 2 - 64, game.world.height / 2 + 50, "newGame_btn", newGame, this);
	this.tryAgainPanel = game.add.sprite(game.world.width / 2 - 65, game.world.height / 2 - 53, "tryAgain_panel");
	this.newHighScore = game.add.sprite(game.world.width / 2 - 69 , game.world.height / 2 - 125, "newHighScore_panel");
	this.highScore = game.add.text(game.world.width / 2 - 35,  game.world.height / 2 - 15, "0m", { font: "42px 'Razing'", fill: "#fcc677", stroke: '#ee9021', strokeThickness: 3, align: "center" });
	this.score = game.add.text(game.world.width / 2 - 35,  game.world.height / 2 - 16, bestScore + "m", { font: "42px 'Razing'", fill: "#f8db61", stroke: '#ef9067', strokeThickness: 3, align: "center" });
	
	this.toggleDisplay = function(hide, which) {
		if (which == "highScore" && !hide) {
			this.newGame.revive();
			this.newHighScore.revive();
			this.highScore.alpha = 1;
			this.highScore.content = bestScore + "m";
		} else if (which == "tryAgain" && !hide) {
			this.newGame.revive();
			this.tryAgainPanel.revive();
			this.score.alpha = 1;
			this.score.content = Math.floor(cmDistance / 100)+"m";
		} else {
			this.newGame.kill();
			this.tryAgainPanel.kill();
			this.newHighScore.kill();
			this.highScore.alpha = 0;
			this.score.alpha = 0;
		}
	};
	
	this.toggleDisplay(true);	
}


function helpScreen() {
	this.blueBg = game.add.tileSprite(0,0,game.world.width, game.world.height, "blueBg");
	this.panel01 = game.add.button(game.world.width / 2 - 260,game.world.height / 2 - 124,"instr_01",function(){
		this.panel02.revive();
		this.panel01.kill();
		this.panel01.alpha = 0;
	},this);
	this.panel02 = game.add.button(game.world.width / 2 - 171,game.world.height / 2 - 32,"instr_02",function(){
		this.panel01.kill();
		this.panel02.kill();
		this.blueBg.kill();
		startGame();
	},this);
	
	this.launch = function() {
		this.blueBg.revive();
		this.panel01.revive();
	}
	
	this.blueBg.alpha = 0.8;
	this.blueBg.kill();
	this.panel01.kill();
	this.panel02.kill();
	
}

