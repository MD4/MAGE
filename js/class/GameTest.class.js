(function (global) {
    var GameTest = Game;
    var keys = {
        leftArrow: 37,
        upArrow: 38,
        rightArrow: 39,
        downArrow: 40,
        space: 32,
        ctrl: 17
    };

    GameTest.prototype.initialize = function () {
        this.player = new Player(this.width / 2, this.height / 2, "bob", {
            bob: document.getElementById("bob"),
            legs: document.getElementById("legs")
        });
    };

    GameTest.prototype.update = function (time, delta) {
        if (this.isKeyDown(keys.leftArrow)) {
            this.player.turnLeft(delta);
        }
        if (this.isKeyDown(keys.rightArrow)) {
            this.player.turnRight(delta);
        }
        if (this.isKeyDown(keys.upArrow)) {
            this.player.goForward(delta);
        }
        if (this.isJustKeyUp(keys.upArrow)) {
            this.player.stop(delta);
        }
        if (this.isKeyDown(keys.downArrow)) {
            this.player.goBackward(delta);
        }
        if (this.isJustKeyUp(keys.downArrow)) {
            this.player.stop(delta);
        }
        if (this.isJustKeyDown(keys.ctrl)) {
            this.player.fire();
        }

        this.player.update(delta);
    };

    GameTest.prototype.draw = function (context, time, elapsedTime, delta) {

        if (this.isKeyDown(keys.space)) {
            for(var i = 0; i < 10000; i++) {
                context.fillStyle = "white";
                context.fillRect(0, 0, 10000, 10000);
            }

        }

        this.player.draw(context);
    };

    global.GameTest = GameTest;
}(window));