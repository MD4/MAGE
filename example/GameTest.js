(function (global) {

    global.GameTest = MAGE.core.Game.extend({

        initialize: function () {
        },

        update: function (time, delta) {
        },

        draw: function (context, time, elapsedTime, delta) {
            context.fillStyle = 'white';
            context.font = '50px sans';
            context.fillText('Hello world !', 100, 100);
        }
    });

}(window));