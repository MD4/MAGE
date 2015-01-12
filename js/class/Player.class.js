(function (global) {
    var Player = function (x, y, name, imgs) {
        Math.PI2 = Math.PI * 2;
        this.position = {
            x: x,
            y: y
        };
        this.name = name;
        this.imgs = imgs;
        this.legs = new Sprite(imgs.legs, 1, 14, 50);

        this.size = 10;
        this.turnSpeed = 0.1;
        this.acceleration = 0.075;
        this.maxSpeed = 0.09;
        this.friction = 1.05;
        this.breakForce = 1.1;
        this.speed = 0;
        this.torque = 0;
        this.angle = 0;
        this.destAngle = this.angle;
        this.scale = 1.75;
        this.bullets = [];
    };

    Player.prototype.turnRight = function (delta) {
        this.angle += this.turnSpeed * delta;
        this.angle %= Math.PI2;
    };

    Player.prototype.turnLeft = function (delta) {
        this.angle -= this.turnSpeed * delta;
        this.angle %= Math.PI2;
    };

    Player.prototype.goForward = function (delta) {
        if (this.speed >= -0.001) {
            this.torque += this.acceleration * delta;
            this.torque = Math.min(this.maxSpeed, this.torque);
        } else {
            this.break(delta);
        }
    };

    Player.prototype.stop = function (delta) {
        this.torque = 0;
    };

    Player.prototype.goBackward = function (delta) {
        if (this.speed <= 0.001) {
            this.torque -= this.acceleration * 0.8 * delta;
            this.torque = Math.max(-this.maxSpeed * 0.8, this.torque);
        } else {
            this.break(delta);
        }
    };

    Player.prototype.break = function (delta) {
        this.speed /= this.breakForce;
    };

    Player.prototype.doFriction = function (delta) {
        this.speed /= this.friction;
    };

    Player.prototype.update = function (delta) {
        this.speed += this.torque * delta;

        this.position.x += Math.cos(this.angle) * this.speed * delta;
        this.position.y += Math.sin(this.angle) * this.speed * delta;

        this.legs.step(this.speed / 2);

        this.doFriction(delta);

        for(var i = 0; i < this.bullets.length; i++) {
            this.bullets[i].update(delta);
        }

        this.angle = Math.lerpAngle(this.angle, this.destAngle, 10.0);
    };

    Player.prototype.draw = function (context) {
        context.strokeStyle = "rgba(255, 0, 0, 0.2)";
        context.lineWidth = 2;

        // context.drawImage(this.imgs.bob, this.position.x - this.size / 2, this.position.y  - this.size / 2, this.size, this.size);
        context.translate(this.position.x, this.position.y);
        context.rotate(this.angle);
        this.legs.draw(context, 0, 0, null, null, this.scale);
        context.drawImage(this.imgs.bob, -5, -8 * this.scale, 20 * this.scale, 16 * this.scale);
        context.rotate(-this.angle);
        context.translate(-this.position.x, -this.position.y);

        for(var i = 0; i < this.bullets.length; i++) {
            this.bullets[i].draw(context);
        }
    };

    Player.prototype.fire = function() {
        this.bullets.push(new Bullet(this.position.x, this.position.y, this.angle, 20));
    };

    Player.prototype.setAngle = function(angle) {
        this.destAngle = angle;
    };

    global.Player = Player;
}(window));