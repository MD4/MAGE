(function (global) {

    global.GameTest = MAGE.core.Game.extend({

        initialize: function () {
            this.debug('Mouse position', function() {
                return this.getMousePosition();
            }.bind(this));
        },

        update: function (time, delta) {
        },

        draw: function (context, time, elapsedTime, delta) {
            context.fillStyle = 'white';
            context.font = '50px sans';
            context.fillText('Hello world !', 150, 150);
        }
    });

}(window));