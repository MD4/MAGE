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
        var currentTileRect = {
            x: Math.floor(this.current % this.colCount) * this.tileSize.width,
            y: Math.floor(this.current / this.colCount) * this.tileSize.height,
            width: this.tileSize.width,
            height: this.tileSize.height
        };
        return currentTileRect;
    };

    Sprite.prototype.draw = function (context, x, y, width, height, scale) {
        var currentTileRect = this.getCurrentTileRect();
        width = width || this.tileSize.width;
        height = height || this.tileSize.height;
        context.drawImage(this.img, currentTileRect.x, currentTileRect.y, currentTileRect.width, currentTileRect.height, (x - width / 2) * scale, (y - height / 2) * scale, width * scale, height * scale);
    };

    global.Sprite = Sprite;
}(window));