(function (global) {
    var GameTest = Game;
    var keys = {
        leftArrow: 37,
        upArrow: 38,
        rightArrow: 39,
        downArrow: 40,
        Z: 90,
        S: 83,
        Q: 81,
        D: 68,
        space: 32,
        ctrl: 17
    };

    GameTest.prototype.initialize = function () {
        this.player = new Player(this.width / 2, this.height / 2, "bob", {
            bob: document.getElementById("bob"),
            legs: document.getElementById("legs")
        });

        this.debug("Mouse Angle", function () {
            return Math.angle(this.player.position, this.getMousePosition()).toFixed(2);
        }.bind(this));
        this.debug("Player angle", function () {
            return this.player.angle.toFixed(2);
        }.bind(this));
    };

    GameTest.prototype.update = function (time, delta) {
        if (this.isKeyDown(keys.Q)) {
            this.player.turnLeft(delta);
        }
        if (this.isKeyDown(keys.D)) {
            this.player.turnRight(delta);
        }
        if (this.isKeyDown(keys.Z)) {
            this.player.goForward(delta);
        }
        if (this.isJustKeyUp(keys.Z)) {
            this.player.stop(delta);
        }
        if (this.isKeyDown(keys.S)) {
            this.player.goBackward(delta);
        }
        if (this.isJustKeyUp(keys.S)) {
            this.player.stop(delta);
        }
        if (this.isJustButtonDown(0)) {
            this.player.fire();
        }


        var angle = Math.angle(this.player.position, this.getMousePosition());
        this.player.setAngle(angle);
        this.player.update(delta);
    };

    GameTest.prototype.draw = function (context, time, elapsedTime, delta) {
        this.player.draw(context);
    };

    global.GameTest = GameTest;
}(window));