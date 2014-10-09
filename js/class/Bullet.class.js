(function (global) {
    var Bullet = function (x, y, angle, speed) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = speed;
    };

    Bullet.prototype.update = function (delta) {
        this.x += Math.cos(this.angle) * this.speed * delta;
        this.y += Math.sin(this.angle) * this.speed * delta;
    };

    Bullet.prototype.draw = function (context) {
        context.strokeStyle = "orangered";
        context.lineWidth = 1;

        context.beginPath();
        context.moveTo(this.x, this.y);
        context.lineTo(
                this.x - Math.cos(this.angle + Math.PI) * this.speed,
                this.y - Math.sin(this.angle + Math.PI) * this.speed
        );
        context.stroke();
    };

    global.Bullet = Bullet;
}(window));