(function (global) {
    var GameTest = MAGE.core.Game;

    GameTest.prototype.initialize = function () {
    };

    GameTest.prototype.update = function (time, delta) {
    };

    GameTest.prototype.draw = function (context, time, elapsedTime, delta) {
        context.fillStyle = 'white';
        context.font = '50px sans';
        context.fillText('Hello world !', 100, 100);
    };

    global.GameTest = GameTest;
}(window));