function hitGround(sub, ground) {
	player.takeDamage(1);
	player.submarine.body.velocity.y = -30;
}

function hitMine(player_obj, foes_obj) {
	foes_obj.kill();
	sounds.play("explosion",effectsVolume , 1);
	particles.createEmitter(explosionParam, foes_obj.x, foes_obj.y, 1);
	player.takeDamage(2);
}

function hitBarrel(player_obj, foes_obj) {
	foes_obj.kill();
	sounds.play("explosion",effectsVolume , 1);
	particles.createEmitter(toxicExplosion, foes_obj.x, foes_obj.y, 1);
	player.takeDamage(1);
}

function dammagePlayer() {
	player.takeDamage(1);
}

function takeHealth(sub, healthPack) {
	healthPack.kill();
	player.heal(1);
	sounds.play("bonusPickUp",effectsVolume , 1);
}

function takeAmmo(sub, ammoPack) {
	ammoPack.kill();
	gun.getNewMissiles(1);
	sounds.play("bonusPickUp",effectsVolume , 1);	
}

function takeTripleHealth(sub, healthPack) {
	healthPack.kill();
	player.heal(3);
	sounds.play("bonusPickUp",effectsVolume , 1);
}

function takeTripleAmmo(sub, ammoPack) {
	ammoPack.kill();
	gun.getNewMissiles(3);
	sounds.play("bonusPickUp",effectsVolume , 1);	
}

function dammageFoes(missile, foes) {	
	gun.retrunMissile(missile);
	foes.kill();

	if (foes.key == "mine" || foes.key == "barrel") {
		var param = foes.key == "mine" ? explosionParam : toxicExplosion;
		sounds.play("explosion",effectsVolume, 1);
		particles.createEmitter(param, foes.x, foes.y, 1);
	}
	
	if (foes.key == "barrel") {
		particles.destroyEmitter(foes.leakPaticles.iIndex);
	}
}

function killObject(object) {
	if (object.x < 0) { // if not in the spawn area
		object.kill();
	}
}

function returnMissile(missile) {
	gun.retrunMissile(missile);
}

function barrelOnTheFloor(barrel, floor) {
	floor.body.velocity.x = -60;
	floor.body.velocity.y = 0;
	floor.y -= 1;
	
}
