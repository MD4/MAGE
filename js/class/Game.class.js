window.requestAnimFrame = (function () {
    return  window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

(function (global) {
    var Game = function (container, options) {
        options = options || {};

        this.width = options.width || 800;
        this.height = options.height || 600;
        this.clearColor = options.clearColor || "white";
        this.fpsRefreshRate = options.fpsRefreshRate || 500;
        this.debugMode = options.debugMode || false;
        this.eventsContainer = options.eventsContainer || container;
        this.keyboardEventsContainer = options.keyboardEventsContainer || document;
        this.allowResize = options.allowResize || true;

        this.lastRender = 0;
        this.FPS = 0;
        this.tmrFPS = 0;
        this.frameCount = 0;
        this.container = container;
        this.keyStates = {};
        this.oldKeyStates = {};
        this.buttonStates = {};
        this.mousePosition = {x: 0, y: 0};
        this.containerPosition = $(container).offset();
    };

    Game.prototype.initializeAll = function () {
        if (this.allowResize) {
            $(window).resize(function () {
                this.initContext();
            }.bind(this));
        }

        this.initContext();
        this.initListeners();

        this.initialize();
    };

    Game.prototype.initContext = function () {
        this.width = $(this.container).width();
        this.height = $(this.container).height();

        this.container.setAttribute('width', this.width);
        this.container.setAttribute('height', this.height);

        this.context = this.container.getContext("2d");
    };

    Game.prototype.start = function () {
        this.initializeAll();
        requestAnimFrame(this.loop.bind(this));
    }

    Game.prototype.initialize = function () {
        // Let it empty here
        // Extend class and implement it
    };

    Game.prototype.update = function (time, delta) {
        // Let it empty here
        // Extend class and implement it
    };

    Game.prototype.draw = function (context, time, elapsedTime, delta) {
        // Let it empty here
        // Extend class and implement it
    };

    Game.prototype.clear = function (context, color) {
        context.fillStyle = color;
        context.fillRect(0, 0, this.width, this.height);
    };

    Game.prototype.drawDebugMode = function (context, time, elapsedTime, delta) {
        context.fillStyle = "black";
        context.fillText("Time : " + time.toFixed(2), 10, 10);
        context.fillText("Elapsed time : " + elapsedTime.toFixed(2), 10, 20);
        context.fillText("Delta : " + delta.toFixed(2), 10, 30);
        context.fillText("Tmr FPS : " + this.tmrFPS.toFixed(2), 10, 40);
        context.fillText("FPS : " + this.FPS, 10, 50);
    };

    Game.prototype.loop = function (time) {
        var delta = (time - this.lastRender) / 16.66666667;
        var elapsedTime = time - this.lastRender;

        this.clear(this.context, "white");
        this.update(time, delta);
        this.draw(this.context, time, elapsedTime, delta);

        if (this.debugMode) this.drawDebugMode(this.context, time, elapsedTime, delta);

        this.frameCount++;

        if (time >= this.tmrFPS + this.fpsRefreshRate) {
            this.tmrFPS = time;
            this.FPS = this.frameCount * (1000 / this.fpsRefreshRate);
            this.frameCount = 0;
        }
        this.lastRender = time;
        this.oldKeyStates = this.clone(this.keyStates);
        requestAnimFrame(this.loop.bind(this));
    };

    Game.prototype.initListeners = function () {
        this.initMouseListeners();
        this.initKeyboardListeners();
    };

    Game.prototype.initKeyboardListeners = function () {
        this.keyboardEventsContainer.onkeydown = function (e) {
            this.keyStates[e.keyCode] = true;
        }.bind(this);
        this.keyboardEventsContainer.onkeyup = function (e) {
            this.keyStates[e.keyCode] = false;
        }.bind(this);
    };

    Game.prototype.initMouseListeners = function () {
        this.eventsContainer.onmousedown = function (e) {
            this.buttonStates[e.button] = true;
        }.bind(this);
        this.eventsContainer.onmouseup = function (e) {
            this.buttonStates[e.button] = false;
        }.bind(this);
        this.eventsContainer.onmousemove = function (e) {
            this.mousePosition = {
                x: e.clientX - this.containerPosition.top,
                y: e.clientY - this.containerPosition.left
            };
        }.bind(this);
    };

    Game.prototype.isKeyDown = function (keyCode) {
        return !!this.keyStates[keyCode];
    };

    Game.prototype.isJustKeyDown = function (keyCode) {
        return (this.isKeyDown(keyCode) && !this.oldKeyStates[keyCode]);
    };

    Game.prototype.isJustKeyUp = function (keyCode) {
        return (!this.isKeyDown(keyCode) && !!this.oldKeyStates[keyCode]);
    };

    Game.prototype.clone = function (object) {
        return JSON.parse(JSON.stringify(object));
    };

    global.Game = Game;
}(window));