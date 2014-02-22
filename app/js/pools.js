function tileLayer(relative_speed, tex, width, height, x, y, opacity, scale) {
	var sprite_layer = game.add.group();
	sprite = new Phaser.TileSprite(game, x, y, width, height, tex);
	if (opacity) sprite.alpha = opacity;
	if (scale) { sprite.tileScale.x = scale;  sprite.tileScale.y = scale; }
	
	sprite_layer.add(sprite);
	sprite_layer.speed = relative_speed;
	sprite_layer.baseY = y;
	
	return sprite_layer;
}


function spritesLayer(relative_speed, internVelocity, sprites, number, spawnTime, opacity, scale, anchor, hitbox) {
	var pool = game.add.group();
	
	for (var i = 0; i < sprites.length; i++) {
		pool.createMultiple(number, sprites[i]);
	}
	
	pool.speed = relative_speed;
	
	pool.setAll('internVelocity', internVelocity);
	
	
	if (opacity) {
		pool.forEach(function (el) {
			el.alpha = opacity;
		});		
	}
	
	if (scale) {
		pool.forEach(function (el) {
			el.scale.x = scale; 
			el.scale.y = scale;
		});		
	}
	
	if (anchor) {
		pool.forEach(function (el) {
			el.anchor.x = anchor[0]; 
			el.anchor.y = anchor[1];
		});			
	}
	
	if (hitbox) {
		pool.forEach(function (el) {
			el.body.setRectangle(hitbox.w, hitbox.h, hitbox.x, hitbox.y);
		});
	}

	pool.respawnTimer = spawnTime;
	pool.baseRespawn = pool.respawnTimer;
	
	pool.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', killObject, this);

	return pool;
}

function emitterPool(nbr) { 
	var pool = [],
		emitter,
		i;
	for (i = 0; i < nbr; i++) {
		emitter = new Phaser.Particles.Arcade.Emitter(game);
		pool.push(emitter);
	}
		
	return pool;
}
