const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

/* fix coordinate system */
ctx.translate(0, canvas.height);
ctx.scale(1, -1);

/* time between frames (60fps) */
const TimeStep = 1 / 60;
const Gravity = -1000;
const Friction = 0.8;
const MaxSpeed = 400;

/* controls */
const Keybinds = {
	Jump: "w",
	Left: "a",
	Right: "d"
};

const controls = {
	jump: false,
	left: false,
	right: false
};

/* game state */
const game = {
	tick: 0
};

const player = {
	pos: {
		x: canvas.width / 2,
		y: canvas.height / 2
	},
	vel: {
		x: 0,
		y: 0
	},
	width: 20,
	height: 30,
	onGround: false,
	jumpForce: 500,
	runForce: 30,
	color: "#ff0000"
};

const platforms = [];

for(let i = 0; i < 20; i++) {
	platforms.push({
		pos: {
			x: Math.random() * canvas.width,
			y: Math.random() * canvas.height,
		},
		width: Math.random() * 75 + 25,
		height: Math.random() * 75 + 25,
		color: "#fff"
		
	});
}

const drawPlayer = function() {

	ctx.fillStyle = player.color;
	ctx.fillRect(
		player.pos.x - player.width / 2,
		player.pos.y - player.height / 2,
		player.width,
		player.height
	);
	
};

const drawPlatforms = function() {
	
	for(let platform of platforms) {
		
		ctx.fillStyle = platform.color;
		ctx.fillRect(
			platform.pos.x - platform.width / 2,
			platform.pos.y - platform.height / 2,
			platform.width,
			platform.height
		);
		
	}
	
};

const draw = function() {
	
	/* draw background */
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	drawPlatforms();
	drawPlayer();
	
};

const step = function() {
	
	/* update player - controls*/
	if(controls.jump && player.onGround) {
		player.vel.y = player.jumpForce;
		player.onGround = false;
	}
	
	/* if both L and R are held down, don't move. */
	let horizMove = 0;
	if(controls.left && !controls.right)
		horizMove = -player.runForce;
	else if(controls.right && !controls.left)
		horizMove = player.runForce;
	
	player.vel.x += horizMove;
	if(horizMove == 0 && player.onGround) {
		player.vel.x *= Friction;
	}
	
	/* save coords (useful for collision detection) */
	/* dirty method since I still have no idea how to copy properties in JS */
	let preCoords = {
		x: 0,
		y: 0
	};
	preCoords.x += player.pos.x;
	preCoords.y += player.pos.y;
	
	/* update player - physics */
	player.vel.x = Math.min(Math.max(-MaxSpeed, player.vel.x), MaxSpeed);
	player.vel.y += Gravity * TimeStep;
	
	player.pos.x += player.vel.x * TimeStep;
	player.pos.y += player.vel.y * TimeStep;
	
	/* keep in level*/
	if(player.pos.y < player.height / 2) {
		player.pos.y = player.height / 2;
		player.vel.y = 0;
		player.onGround = true;
	}
	
	if(player.pos.y > canvas.height - player.height / 2) {
		player.pos.y = canvas.height - player.height / 2;
		player.vel.y = 0;
	}

	if(player.pos.x < player.width / 2) {
		player.pos.x = player.width / 2;
		player.vel.x = 0;
	}
	
	if(player.pos.x > canvas.width - player.width / 2) {
		player.pos.x = canvas.width - player.width / 2;
		player.vel.x = 0;
	}

	/* knock out of platforms */
	for(let platform of platforms) {
		
		let leftX = platform.pos.x - platform.width / 2;
		let rightX = platform.pos.x + platform.width / 2;
		let topY = platform.pos.y + platform.height / 2;
		let bottomY = platform.pos.y - platform.height / 2;
		
		if(Math.abs(player.pos.y - platform.pos.y) < platform.height / 2 + player.height / 2) {
			if(preCoords.x + player.width / 2 <= leftX && player.pos.x + player.width / 2 > leftX) {
				player.pos.x = leftX - player.width / 2;
				player.vel.x = 0;
			}
			
			if(preCoords.x - player.width / 2 >= rightX && player.pos.x - player.width / 2 < rightX) {
				player.pos.x = rightX + player.width / 2;
				player.vel.x = 0;
			}
		}
		
		if(Math.abs(player.pos.x - platform.pos.x) < platform.width / 2 + player.width / 2) {
			if(preCoords.y - player.height / 2 >= topY && player.pos.y - player.height / 2 < topY) {
				player.pos.y = topY + player.height / 2;
				player.vel.y = 0;
				player.onGround = true;
			}
			
			if(preCoords.y + player.height / 2 <= bottomY && player.pos.y + player.height / 2 > bottomY) {
				player.pos.y = bottomY - player.height / 2;
				player.vel.y = 0;
			}
		}
		
	}
	
};

const run = function() {
	
	draw();
	step();
	game.tick++;
	
	requestAnimationFrame(run);
	
};

/* event handlers */
let handleKey = function(key, state) {
	switch(key) {
		case Keybinds.Jump: controls.jump = state; break;
		case Keybinds.Left: controls.left = state; break;
		case Keybinds.Right: controls.right = state; break;
	}
};

window.addEventListener("keydown", function(event) {
	handleKey(event.key, true);
});

window.addEventListener("keyup", function(event) {
	handleKey(event.key, false);
});

window.addEventListener("mousedown", function(event) {
	let rect = canvas.getBoundingClientRect();
	let x = event.clientX - rect.left;
	let y = event.clientY - rect.top;
	y = canvas.height - y;
	player.pos.x = x;
	player.pos.y = y;
	
});

run();
