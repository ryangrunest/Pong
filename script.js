var width = 700;
var height = 600;
var upArrow = 38, downArrow = 40;
var pi = Math.PI;
var canvas, ctx, keystate;
var player, ai, ball;

player = {
	x: null,
	y: null,
	width: 20,
	height: 100,

	update: function() {
		if (keystate[upArrow]) this.y -= 15;
		if (keystate[downArrow]) this.y += 15;
	},
	draw: function() {
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
}

ai = {
	x: null,
	y: null,
	width: 20,
	height: 100,

	update: function() {
		var desty = ball.y - (this.height - ball.side) * 1.0;
		this.y += (desty - this.y) * 0.5;
	},	
	draw: function() {
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
};

ball = {
	x: null,
	y: null,
	vel: null,
	side: 20,
	speed: 15,

	update: function() {
		this.x += this.vel.x;
		this.y += this.vel.y;

		if (0 > this.y || this.y + this.side > height) {
			var offset = this.vel.y < 0 ? 0 - this.y : height - (this.y+this.side);
			this.y += 2*offset;
			this.vel.y *= -1;
		}

		var AABBIntersect = function(ax, ay, aw, ah, bx, by, bw, bh) {
			return ax < bx+bw && ay < by + bh && bx < ax + aw && by < ay + ah;
		};

		var paddle = this.vel.x < 0 ? player : ai;

		if (AABBIntersect(paddle.x, paddle.y, paddle.width, paddle.height,
			this.x, this.y, this.side, this.side)
			) {
			this.x = paddle === player ? player.x + player.width : ai.x - this.side;
			var n = (this.y + this.side - paddle.y) / (paddle.height + this.side);
			var phi = 0.25*pi*(2*n - 1);
			this.vel.x = (paddle === player ? 1 : -1)* this.speed * Math.cos(phi);
			this.vel.y = this.speed * Math.sin(phi);
		}
	},
	draw: function() {
		ctx.fillRect(this.x, this.y, this.side, this.side);
	}
}

function main() {
	canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	ctx = canvas.getContext("2d");
	document.body.appendChild(canvas);

	keystate = {};
	document.addEventListener("keydown", function(evt) {
		keystate[evt.keyCode] = true;
	});
	document.addEventListener("keyup", function(evt) {
		delete keystate[evt.keyCode];
	});

	init();

	var loop = function() {
		update();
		draw();

		window.requestAnimationFrame(loop, canvas);
	};
	window.requestAnimationFrame(loop, canvas);
}

function init() {
	player.x = player.width;
	player.y = (height - player.height)/2;

	ai.x = width - (player.width + ai.width);
	ai.y = (height - ai.height) / 2;

	ball.x = (width - ball.side) / 2;
	ball.y = (height - ball.side) / 2;

	ball.vel = {
		x: ball.speed,
		y: 0,
	}
};
function update() {
	player.update();
	ai.update();
	ball.update();
};
function draw() {
	ctx.fillRect(0,  0, width, height);

	ctx.save();
	ctx.fillStyle = '#fff';
	player.draw();
	ai.draw();
	ball.draw();

	var w = 4;
	var x = (width - w) * 0.5;
	var y = 0;
	var step = height / 20;
	while (y < height) {
		ctx.fillRect(x, y + step * 0.25, w, step * 0.5);
		y += step;
	};

	ctx.restore();
};

main();






