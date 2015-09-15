(function (global) {
    global.MAGE = {
        version: '0.0.1',
        core: {},
        utils: {}
    };
}(window));

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
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
        this.clearColor = options.clearColor || "black";
        this.debugColor = options.debugColor || "white";
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
        this.oldButtonStates = {};
        this.mousePosition = {x: 0, y: 0};
        this.containerPosition = {
            x: container.offsetLeft,
            y: container.offsetTop
        };
        this.debugIndicators = [];
    };

    Game.prototype.initializeAll = function () {
        if (this.allowResize) {
            window.onresize = function () {
                this.initContext();
            }.bind(this);
        }

        this.initContext();
        this.initListeners();

        this.initialize();
    };

    Game.prototype.initContext = function () {
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;

        this.container.setAttribute('width', this.width);
        this.container.setAttribute('height', this.height);

        this.context = this.container.getContext("2d");
    };

    Game.prototype.start = function () {
        this.initializeAll();
        requestAnimFrame(this.loop.bind(this));
    };

    Game.prototype.initialize = function () {
        // Extend class and implement it
    };

    Game.prototype.update = function (time, delta) {
        // Extend class and implement it
    };

    Game.prototype.draw = function (context, time, elapsedTime, delta) {
        // Extend class and implement it
    };

    Game.prototype.clear = function (context, color) {
        context.fillStyle = color;
        context.fillRect(0, 0, this.width, this.height);
    };

    Game.prototype.drawDebugMode = function (context, time, elapsedTime, delta) {
        var y = 1;

        context.font = '10px sans';
        context.fillStyle = this.debugColor;
        context.fillText("Time : " + time.toFixed(2), 10, 10 * y++);
        context.fillText("Elapsed time : " + elapsedTime.toFixed(2), 10, 10 * y++);
        context.fillText("Delta : " + delta.toFixed(2), 10, 10 * y++);
        context.fillText("Tmr FPS : " + this.tmrFPS.toFixed(2), 10, 10 * y++);
        context.fillText("FPS : " + this.FPS, 10, 10 * y++);
        y++;
        this.debugIndicators.forEach(function (i, indicator) {
            context.fillText(indicator.title + " : " + indicator.fn(), 10, 10 * y++);
        });
    };

    Game.prototype.loop = function (time) {
        var delta = (time - this.lastRender) / 16.66666667;
        var elapsedTime = time - this.lastRender;

        this.clear(this.context, this.clearColor);
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
        this.oldButtonStates = this.clone(this.buttonStates);
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

    Game.prototype.isButtonDown = function (button) {
        return !!this.buttonStates[button];
    };

    Game.prototype.isJustButtonDown = function (button) {
        return (this.isButtonDown(button) && !this.oldButtonStates[button]);
    };

    Game.prototype.isJustButtonUp = function (button) {
        return (!this.isButtonDown(button) && !!this.oldButtonStates[button]);
    };

    Game.prototype.getMousePosition = function () {
        return this.mousePosition;
    };

    Game.prototype.clone = function (object) {
        return JSON.parse(JSON.stringify(object));
    };

    Game.prototype.debug = function (title, fn) {
        this.debugIndicators.push({
            title: title,
            fn: fn
        });
    };

    global.MAGE.core.Game = Game;
}(window));

(function (global) {
    var Sprite = function (img, rowCount, colCount, interval) {
        this.img = img;
        this.rowCount = rowCount;
        this.colCount = colCount;
        this.interval = interval;

        this.tileSize = {
            width: this.img.width / colCount,
            height: this.img.height / rowCount
        };
        this.current = 0;
        this.tmrStep = Date.now();
    };

    Sprite.prototype.step = function (step) {
        if (Date.now() > this.tmrStep + this.interval) {
            this.current += step;
            if (this.current <= 0) {
                this.current = this.rowCount * this.colCount - 1;
            } else {
                this.current %= this.rowCount * this.colCount;
            }
            this.tmrStep = Date.now();
        }
    };

    Sprite.prototype.getCurrentTileRect = function () {
        return {
            x: Math.floor(this.current % this.colCount) * this.tileSize.width,
            y: Math.floor(this.current / this.colCount) * this.tileSize.height,
            width: this.tileSize.width,
            height: this.tileSize.height
        };
    };

    Sprite.prototype.draw = function (context, x, y, width, height, scale) {
        var currentTileRect = this.getCurrentTileRect();
        width = width || this.tileSize.width;
        height = height || this.tileSize.height;
        context.drawImage(
            this.img,
            currentTileRect.x,
            currentTileRect.y,
            currentTileRect.width,
            currentTileRect.height,
            (x - width / 2) * scale,
            (y - height / 2) * scale,
            width * scale,
            height * scale
        );
    };

    global.MAGE.utils.Sprite = Sprite;
}(window));