
/**
 * clears the screen with a color
 *
 * @param {string} [color='#040408']
 */
function clearScreen(color = '#040408') {
    canvasContext.save();
    canvasContext.setTransform(1, 0, 0, 1, 0, 0);
    canvasContext.fillStyle = color;
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    canvasContext.restore();
}

/**
 * draws a stroked equaliteral polygon. assumes canvasContext exists
 * @param  {} x: x position of center
 * @param  {} y: y position of center
 * @param  {} r: radius
 * @param  {} sides: number of sides
 * @param  {} rotation=0 : rotation of polygon in radians
 */
function strokePolygon(x, y, r, sides, rotation = 0) {
    //sides = sides || Math.floor( 120 * (r*2) )+16;
    let ox, oy, px, py;
    for (let i = 0; i < sides; i++) {
        let j = i / sides * 6.283185; //tau radians
        let j2 = (i + 1) / sides * 6.283185; 
        ox = x + Math.cos(j + rotation) * r;
        oy = y + Math.sin(j + rotation) * r;
        px = x + Math.cos(j2 + rotation) * r;
        py = y + Math.sin(j2 + rotation) * r;
        line(px, py, ox, oy, canvasContext.fillStyle);
    }
}

/**
 * draws a filled rectangle. assumes canvasContext exists
 * @param  {} x: x position of center
 * @param  {} y: y position of center
 * @param  {} width: width of rectangle
 * @param  {} height: height of rectangle
 */
function fillRect(x, y, width, height) {
    canvasContext.fillRect(x, y, width, height);
}


/**
 * fills one pixel. assumes canvasContext exists
 * @param  {} x: integer x position of pixel. 
 * @param  {} y: integer y position of pixel
 * @param  {} color: color of pixel. default is error magenta
 * 
 */
function pset(x, y) {
    canvasContext.fillRect(x|0, y|0, 1, 1);
}

//line uses pset and breseham's line algorithm to draw a pixel line between two points in a single color
//dynamically drawn objects and effects should use this instead of canvasContext.line, to avoid anti-aliasing.
function line(x1, y1, x2, y2, color = '#FF00FF', context) {
    context = context || canvasContext;
    //we take in floats, but we need to round them to integers for the algorithm to work
    x1 = Math.round(x1);
    y1 = Math.round(y1);
    x2 = Math.round(x2);
    y2 = Math.round(y2);

    let dx = Math.abs(x2 - x1);
    let dy = Math.abs(y2 - y1);
    let sx = (x1 < x2) ? 1 : -1;
    let sy = (y1 < y2) ? 1 : -1;
    let err = dx - dy;
    let tries = canvas.width*3;
    while (true) {
        tries--;
        if(tries<0) break;
        canvasContext.fillStyle = color;
        pset(x1, y1, context);
        if ((x1 == x2) && (y1 == y2)) break;
        let e2 = 2 * err;
        if (e2 > -dy) { err -= dy; x1 += sx; }
        if (e2 < dx) { err += dx; y1 += sy; }
    }
}
class spriteFont {
    /**
     * @constructor
     * @param {*} width
     * @param {*} height
     * @param {*} originX
     * @param {*} originY
     * @param {*} characterWidth
     * @param {*} characterHeight
     * @param {*} image
     */
    constructor(
        width,
        height,
        characterWidth,
        characterHeight,
        image,
        originX = 0,
        originY = 0) {
        this.width = width;
        this.height = height;
        this.origin = { x: originX, y: originY };
        this.characterWidth = characterWidth;
        this.characterHeight = characterHeight;

        this.widthInCharacters = Math.floor(width / characterWidth);
        this.heightInCharacters = Math.floor(height / characterHeight);
        this.characterOrderString = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.0123456789 '!@#$%^&*()+-=,":;><`,

        this.characterMap = this.characterOrderString.split("");
        this.image = image;

        return this;
    }

    /**
     * draws text to the canvas. assumes canvasContext exists
     *
     * @param {string} textString
     * @param {{ x: number; y: number; }} [pos={ x: 0, y: 0 }]
     * @param {int} [hspacing=0]
     * @param {int} [vspacing=2]
     * @param {int} [scale=1]
     */
    drawText(textString, pos = { x: 0, y: 0 }, hspacing = 0, vspacing = 2, scale = 1) {
        if (!textString) return;
        var lines = textString.split("\n");
        var self = this;
        self.pos = pos, self.hspacing = hspacing, self.vspacing = vspacing;
        lines.forEach(function (line, index, arr) {
            self._textLine({ textString: line, pos: { x: self.pos.x, y: self.pos.y + index * (self.characterHeight + self.vspacing) * scale }, hspacing: self.hspacing }, scale);
        })
    }

    _textLine({ textString, pos = { x: 0, y: 0 }, hspacing = 0 } = {}, scale = 1 ){
        var textStringArray = textString.split("");
        var self = this;
        let ctx = canvasContext;
        textStringArray.forEach(function (character, index, arr) {
            //find index in characterMap
            let keyIndex = self.characterMap.indexOf(character);
            //tranform index into x,y coordinates in spritefont texture
            let spriteX = self.origin.x + (keyIndex % self.widthInCharacters) * self.characterWidth;
            let spriteY = self.origin.y + Math.floor(keyIndex / self.widthInCharacters) * self.characterHeight;
            //draw
           
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(
                self.image,
                spriteX,
                spriteY,
                self.characterWidth,
                self.characterHeight,
                pos.x + ((self.characterWidth + hspacing) * index * scale),
                pos.y,
                self.characterWidth * scale,
                self.characterHeight * scale
            )
        })
    }

    // drawColorText(textString, pos = { x: 0, y: 0 }, hspacing = 0, vspacing = 2, scale = 1, color = "#FF00FF") {
    //     this.drawText(textString, pos, hspacing, vspacing, scale, color);
    //     bufferContext.globalCompositeOperation = "source-atop";
    //     bufferContext.fillStyle = color;
    //     bufferContext.fillRect(0, 0, bufferCanvas.width, bufferCanvas.height);
    //     canvasContext.drawImage(bufferCanvas, 0, 0);
    // }

}


function drawTileSprite(tileset, tileData, x, y, ctx){
    ctx = ctx || canvasContext;
    ctx.drawImage(
        tileset.image,
        (tileData % tileset.tileColumns) * tileset.tileWidth,
        Math.floor(tileData / tileset.tileColumns) * tileset.tileHeight,
        tileset.tileWidth,
        tileset.tileHeight,
        x,
        y,
        tileset.tileWidth,
        tileset.tileHeight
    );
}