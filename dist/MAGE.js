/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function () {
	var initializing = false, fnTest = /xyz/.test(function () {
		xyz;
	}) ? /\b_super\b/ : /.*/;

	// The base Class implementation (does nothing)
	this.Class = function () {
	};

	// Create a new Class that inherits from this class
	Class.extend = function (prop) {
		var _super = this.prototype;

		// Instantiate a base class (but only create the instance,
		// don't run the init constructor)
		initializing = true;
		var prototype = new this();
		initializing = false;

		// Copy the properties over onto the new prototype
		for (var name in prop) {
			// Check if we're overwriting an existing function
			prototype[name] = typeof prop[name] == "function" &&
					typeof _super[name] == "function" && fnTest.test(prop[name]) ?
					(function (name, fn) {
						return function () {
							var tmp = this._super;

							// Add a new ._super() method that is the same method
							// but on the super-class
							this._super = _super[name];

							// The method only need to be bound temporarily, so we
							// remove it when we're done executing
							var ret = fn.apply(this, arguments);
							this._super = tmp;

							return ret;
						};
					})(name, prop[name]) :
					prop[name];
		}

		// The dummy class constructor
		function Class () {
			// All construction is actually done in the init method
			if (!initializing && this.init)
				this.init.apply(this, arguments);
		}

		// Populate our constructed prototype object
		Class.prototype = prototype;

		// Enforce the constructor to be what we expect
		Class.prototype.constructor = Class;

		// And make this class extendable
		Class.extend = arguments.callee;

		return Class;
	};
})();

(function (global) {
    global.MAGE = {
        version: '0.0.2',
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

    global.MAGE.core.Game = Class.extend({

        init: function (container, options) {
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
        },

        initializeAll: function () {
            if (this.allowResize) {
                window.onresize = function () {
                    this.initContext();
                }.bind(this);
            }

            this.initContext();
            this.initListeners();

            this.initialize();
        },

        initContext: function () {
            this.width = this.container.offsetWidth;
            this.height = this.container.offsetHeight;

            this.container.setAttribute('width', this.width);
            this.container.setAttribute('height', this.height);

            this.context = this.container.getContext("2d");
        },

        start: function () {
            this.initializeAll();
            requestAnimFrame(this.loop.bind(this));
        },

        initialize: function () {
            // Extend class and implement it
        },

        update: function (time, delta) {
            // Extend class and implement it
        },

        draw: function (context, time, elapsedTime, delta) {
            // Extend class and implement it
        },

        clear: function (context, color) {
            context.fillStyle = color;
            context.fillRect(0, 0, this.width, this.height);
        },

        drawDebugMode: function (context, time, elapsedTime, delta) {
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
        },

        loop: function (time) {
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
        },

        initListeners: function () {
            this.initMouseListeners();
            this.initKeyboardListeners();
        },

        initKeyboardListeners: function () {
            this.keyboardEventsContainer.onkeydown = function (e) {
                this.keyStates[e.keyCode] = true;
            }.bind(this);
            this.keyboardEventsContainer.onkeyup = function (e) {
                this.keyStates[e.keyCode] = false;
            }.bind(this);
        },

        initMouseListeners: function () {
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
        },

        isKeyDown: function (keyCode) {
            return !!this.keyStates[keyCode];
        },

        isJustKeyDown: function (keyCode) {
            return (this.isKeyDown(keyCode) && !this.oldKeyStates[keyCode]);
        },

        isJustKeyUp: function (keyCode) {
            return (!this.isKeyDown(keyCode) && !!this.oldKeyStates[keyCode]);
        },

        isButtonDown: function (button) {
            return !!this.buttonStates[button];
        },

        isJustButtonDown: function (button) {
            return (this.isButtonDown(button) && !this.oldButtonStates[button]);
        },

        isJustButtonUp: function (button) {
            return (!this.isButtonDown(button) && !!this.oldButtonStates[button]);
        },

        getMousePosition: function () {
            return this.mousePosition;
        },

        clone: function (object) {
            return JSON.parse(JSON.stringify(object));
        },

        debug: function (title, fn) {
            this.debugIndicators.push({
                title: title,
                fn: fn
            });
        }

    });
}(window));

(function (global) {

    global.MAGE.utils.Sprite = Class.extend({
        init: function (img, rowCount, colCount, interval) {
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
        },

        step: function (step) {
            if (Date.now() > this.tmrStep + this.interval) {
                this.current += step;
                if (this.current <= 0) {
                    this.current = this.rowCount * this.colCount - 1;
                } else {
                    this.current %= this.rowCount * this.colCount;
                }
                this.tmrStep = Date.now();
            }
        },

        getCurrentTileRect: function () {
            return {
                x: Math.floor(this.current % this.colCount) * this.tileSize.width,
                y: Math.floor(this.current / this.colCount) * this.tileSize.height,
                width: this.tileSize.width,
                height: this.tileSize.height
            };
        },

        draw: function (context, x, y, width, height, scale) {
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
        }
    });

}(window));