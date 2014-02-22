/*
 * 
 * Particules
 * 
 */

var bubbleParam = {
	tex: "bubble",
	param: {
		gravity: -10,
		maxParticleScale: 0.2,
		minParticleScale: 0.15,
		alpha: 0.8,
		minRotation: 0,
		maxRotation: 80			
	},
	displace: {
		xMin : -20, 
		xMax: 20, 
		yMin: -10, 
		yMax: -20		
	},
	emit: {
		explode: false,
		lifespan: 1500,
		interval: 750,
		nbr: 100
	}
};


var missileParticulesParam = {
	tex: "bubble",
	param: {
		gravity: -10,
		maxParticleScale: 0.25,
		minParticleScale: 0.05,
		alpha: 0.9,
		minRotation: 0,
		maxRotation: 80	
	},
	displace: {
		xMin : -120, 
		xMax: -180, 
		yMin: -15, 
		yMax: 15		
	},
	emit: {
		explode: false,
		lifespan: 1500,
		interval: 50,
		nbr: 150
	}	
};

var boatBubble = {
	tex: "bubble",
	param: {
		gravity: -10,
		maxParticleScale: 0.25,
		minParticleScale: 0.05,
		alpha: 0.9,
		minRotation: 0,
		maxRotation: 80	
	},
	displace: {
		xMin : -50, 
		xMax: -80, 
		yMin: -15, 
		yMax: 15		
	},
	emit: {
		explode: false,
		lifespan: 1500,
		interval: 100,
		nbr: 400
	}	
}


var spriteBubblePoint = {
	backRock_1 : {
		x: 93,
		y: -20
	},
	backRock_2 : {
		x: 48,
		y: -20		
	},
	backRock_3 : {
		x: 173,
		y: -34
	},
	backRock_4 : {
		x: 88,
		y: -34		
	}
}

var rearBubblesParam = {
	tex: "bubble",
	param: {
		gravity: -10,
		maxParticleScale: 0.25,
		minParticleScale: 0.08,
		alpha: 0.9,
		minRotation: 0,
		maxRotation: 180	
	},
	displace: {
		xMin : -40, 
		xMax: -70, 
		yMin: 40, 
		yMax: -40		
	},
	emit: {
		explode: false,
		lifespan: 800,
		interval: 35,
		nbr: 150
	}	
}

var explosionParam = {
	tex: "etincelle",
	param: {
		gravity: 0,
		maxParticleScale: 0.8,
		minParticleScale: 0.55,
		alpha: 1,
		minRotation: 0,
		maxRotation: 50	
	},
	displace: {
		xMin : -75, 
		xMax: 75, 
		yMin: -75, 
		yMax: 75		
	},
	emit: {
		explode: true,
		lifespan: 500,
		interval: 0,
		nbr: 10
	}	
}

var toxicExplosion = {
	tex: "toxic",
	param: {
		gravity: 0,
		maxParticleScale: 0.3,
		minParticleScale: 0.1,
		alpha: 1,
		minRotation: 0,
		maxRotation: 0	
	},
	displace: {
		xMin : -75, 
		xMax: 75, 
		yMin: -75, 
		yMax: 75		
	},
	emit: {
		explode: true,
		lifespan: 500,
		interval: 0,
		nbr: 35
	}
};

var toxicBubbles = {
	tex: "toxic",
	param: {
		gravity: -7,
		maxParticleScale: 0.6,
		minParticleScale: 0.3,
		alpha: 1,
		minRotation: 0,
		maxRotation: 0			
	},
	displace: {
		xMin : -20, 
		xMax: 20, 
		yMin: -5, 
		yMax: -10		
	},
	emit: {
		explode: false,
		lifespan: 2000,
		interval: 150,
		nbr: 100
	}	
}

var onFire = {
	tex: "etincelle",
	param: {
		gravity: -8,
		maxParticleScale: 1.1,
		minParticleScale: 0.8,
		alpha: 1,
		minRotation: 0,
		maxRotation: 0			
	},
	displace: {
		xMin : -20, 
		xMax: 20, 
		yMin: -15, 
		yMax: -10		
	},
	emit: {
		explode: false,
		lifespan: 2000,
		interval: 200,
		nbr: 500
	}		
}

/*
 * 
 * Player
 * 
 */

var submarine_types = {
	submarine_a : { 
		texture: "submarine_a",
		unlocked: 0,
		gravity: 30,
		bounce: 0.6,
		lifes: 3,
		clipSize: 3,
		missilesSpeed : 120
	},
	submarine_b : {
		texture: "submarine_b",
		unlocked: 80,
		gravity: 20, 
		bounce: 0.6,
		lifes: 4,
		clipSize: 5,
		missilesSpeed : 180
	},
	submarine_c : {
		texture: "submarine_c",
		unlocked: 120,
		gravity: 15, 
		bounce: 0.6,
		lifes: 5,
		clipSize: 6,
		missilesSpeed : 250
	},
	submarine_d : {
		texture: "submarine_d",
		unlocked: 200,
		gravity: 40,
		bounce: 0.6,
		lifes: 7,
		clipSize: 9,
		missilesSpeed : 400
	}
};

/*
 * 
 * Foes
 * 
 */

var minesParam = {
	anim : {
		name : "mine_float",
		frameRate: 5,
		loop: true
	}
};


