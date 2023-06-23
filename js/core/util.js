
/**
 * Keyboard input utility object
 *
 * @type {{ _pressed: {}; _released: {}; ESCAPE: number; LEFT: number; UP: number; RIGHT: number; DOWN: number; SPACE: number; ONE: number; TWO: number; THREE: number; FOUR: number; COMMA: number; PERIOD: number; ENTER: number; ... 21 more ...; update(): void; }}
 */
const Key = {

    _pressed: {},
    _released: {},

    ESCAPE: 27,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    SPACE: 32,
    ONE: 49,
    TWO: 50,
    THREE: 51,
    FOUR: 52,
    COMMA: 188,
    PERIOD: 190,
    ENTER: 13,
    a: 65,
    b: 66,
    c: 67,
    f: 70,
    w: 87,
    s: 83,
    d: 68,
    z: 90,
    x: 88,
    p: 80,
    r: 82,
    h: 72,
    i: 73,
    j: 74,
    k: 75,
    l: 76,
    m: 77,
    o: 79,

    isDown(keyCode) {
        return this._pressed[keyCode];
    },

    justReleased(keyCode) {
        return this._released[keyCode];
    },

    onKeydown(event) {
        if (audio && !audio.initialized) audio.init(loadSounds);
        this._pressed[event.keyCode] = true;
    },

    onKeyup(event) {
        this._released[event.keyCode] = true;
        delete this._pressed[event.keyCode];
    },

    update() {
        this._released = {};
    }
};

// TODO refactor into a Key lookalike with isDown() and justReleased() and button index constants
const Joy = {
    start:false,
    up:false,
    down:false,
    left:false,
    right:false,
    a:false,
    b:false,
    x:false,
    y:false,
    aReleased:false,
    bReleased:false,
    xReleased:false,
    yReleased:false,
    leftTriggerReleased:false,
    rightTriggerReleased:false,
    startReleased:false,
    leftTrigger:false,
    rightTrigger:false,
    dz:0.1, // deadzone prevents drift on old gamepads

    init() {
        window.addEventListener("gamepadconnected", function(e) {
            console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
                e.gamepad.index, e.gamepad.id,
                e.gamepad.buttons.length, e.gamepad.axes.length);
        });
    },
    update() {
        if (!navigator.getGamepads) return;
        let allGamepads = navigator.getGamepads();
        // FIXME: we only use the first gamepad because the "released" logic
        // gets confused when another controller is in charge
        for (let num = 0; num<1; num++) {
        //for (let num=0; num<allGamepads.length; num++) {
            let g = allGamepads[num];
            if (!g || !g.axes) break; // can be null for a few frames
            // left thumbstick or dpad to move
            this.left = (g.axes[0] < -this.dz) || g.buttons[14].value;
            this.right = (g.axes[0] > this.dz) || g.buttons[15].value;
            this.up = (g.axes[1] < -this.dz) || g.buttons[12].value;
            this.down = (g.axes[1] > this.dz) || g.buttons[13].value;
            // this logic is buggy if gamepad 2 is controlling things! =(
            this.aReleased = this.a && !(g.buttons[0].value > this.dz);
            this.bReleased = this.b && !(g.buttons[1].value > this.dz);
            this.xReleased = this.x && !(g.buttons[2].value > this.dz);
            this.yReleased = this.y && !(g.buttons[3].value > this.dz);
            this.leftTriggerReleased = this.leftTrigger && !(g.buttons[6].value > this.dz);
            this.rightTriggerReleased = this.rightTrigger && !(g.buttons[7].value > this.dz);
            this.startReleased = this.start && !(g.buttons[9].value > this.dz);
            this.a = g.buttons[0].value > this.dz;
            this.b = g.buttons[1].value > this.dz;
            this.x = g.buttons[2].value > this.dz;
            this.y = g.buttons[3].value > this.dz;
            this.leftTrigger = g.buttons[6].value > this.dz;
            this.rightTrigger = g.buttons[7].value > this.dz;
            this.start = g.buttons[9].value > this.dz;
        }
    }
};


// Direction
const Direction = {
    LEFT: 0,
    RIGHT: 1,
    UP: 2,
    DOWN: 3,
};

/**
 * returns mouse position relative to canvas
 *
 * @param {*} evt mouse event object
 * @returns {{ x: number; y: number; }}
 */
function calculateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x:mouseX,
        y:mouseY
    };
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

/**
 * returns distance between two objects with x and y properties
 * @date 3/24/2023 - 1:49:39 PM
 *
 * @param {*} object1 any object with {x, y} properties
 * @param {*} object2 any object with {x, y} properties
 * @returns {*}
 */
function distanceBetween(object1, object2){
    return Math.sqrt(Math.pow(object1.x - object2.x, 2) + Math.pow(object1.y - object2.y, 2));
}

/**
 * returns angle in radians between two objects with x and y properties
 *
 * @param {*} source any object with {x, y} properties
 * @param {*} target any object with {x, y} properties
 * @returns {*}
 */
function lookAtAngle(source, target){
    return Math.atan2(target.y - source.y, target.x - source.x);
}

/**
 * linear interpolation
 *
 * @param {*} v0 start
 * @param {*} v1 end
 * @param {*} t normalized time
 * @returns {number}
 */
function lerp(v0, v1, t) {
    return v0*(1-t)+v1*t
}

/**
 * maps a value from one range to another
 * @param {*} value 
 * @param {*} low1 
 * @param {*} high1 
 * @param {*} low2 
 * @param {*} high2 
 * @returns 
 */
function mapRange(value, low1, high1, low2, high2) {
    
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

/**
 * maps a value to a range between 0 and 1
 * @param {*} value 
 * @param {*} min 
 * @param {*} max 
 * @returns 
 */
function normalize(value, min, max) {
    return (value - min) / (max - min);
}

/**
 * checks if an actor is on-screen or near edge of screen taking
 * padding into account, returns true or false
 *
 * @param {*} actor
 * @param {number} [pad=200]
 * @returns {boolean}
 */
//TODO: rewrite as rect vs rect to account for actor size, not just position
function inView(actor, pad = 200){
    let screenX = actor.x - view.x,
        screenY = actor.y - view.y,
        padding = pad;
        return (screenX > -padding &&
               screenX < (canvas.width + padding) &&
               screenY > -padding &&
               screenY < canvas.height+padding);
}

/**
 * checks if two rectangles are colliding, returns true or false
 *
 * @param {*} rect1 any object with {x, y, width, height} properties
 * @param {*} rect2
 * @returns {boolean}
 */
function rectCollision(collider1, collider2) {
    const dx = collider1.centerX() - collider2.centerX();
    const dy = collider1.centerY() - collider2.centerY();
    const combinedHalfWidths = (collider1.width + collider2.width) / 2;
    const combinedHalfHeights = (collider1.height + collider2.height) / 2;

    if (Math.abs(dx) < combinedHalfWidths && Math.abs(dy) < combinedHalfHeights) {
        const overlapX = combinedHalfWidths - Math.abs(dx);
        const overlapY = combinedHalfHeights - Math.abs(dy);

        const collisionInfo = {
            top: false,
            bottom: false,
            left: false,
            right: false,
        };

        if (overlapX < overlapY) {
            if (dx < 0) {
                collisionInfo.right = true;
            } else {
                collisionInfo.left = true;
            }
        } else {
            if (dy < 0) {
                collisionInfo.top = true;
            } else {
                collisionInfo.bottom = true;
            }
        }

        return collisionInfo;
    }
    return false;
}

/**
 * checks if a point is inside a rectangle, returns true or false
 *
 * @param {*} x
 * @param {*} y
 * @param {*} rect
 * @returns {boolean}
 */
function pointInRect(x, y, rect){
    return  x >= rect.left &&
            x <= rect.right &&
            y >= rect.top &&
            y <= rect.bottom
}

function screenShake (intensity) {
    view.x += mapRNG() * intensity - intensity / 2;
    view.y += mapRNG() * intensity - intensity / 2;
}

function rand(min, max) {
    return mapRNG() * (max - min) + min;
}

function randInt(min, max) {
    return Math.floor(mapRNG() * (max - min + 1)) + min;
}

function randChoice(arr) {
    return arr[Math.floor(mapRNG() * arr.length)];
}

function cubicBezierPoint(t, p0, p1, p2, p3) {
    const oneMinusT = 1 - t;
    const oneMinusTSquared = oneMinusT * oneMinusT;
    const oneMinusTCubed = oneMinusTSquared * oneMinusT;
    const tSquared = t * t;
    const tCubed = tSquared * t;
    const x = oneMinusTCubed * p0.x + 3 * oneMinusTSquared * t * p1.x + 3 * oneMinusT * tSquared * p2.x + tCubed * p3.x;
    const y = oneMinusTCubed * p0.y + 3 * oneMinusTSquared * t * p1.y + 3 * oneMinusT * tSquared * p2.y + tCubed * p3.y;

    return { x, y };
}

function emitParticles(x, y, definition, pool=actors){
    for (let i = 0; i < definition().quantity; i++) {
        let particle = new Particle(x + definition().offset.x(), y + definition().offset.y(), definition(), pool);
        pool.push(particle);
    }
}

//color function takes an rgba() string or hex value string fillStyle and returns an object with r, g, b, a values
function color(colorString) {
    if (colorString[0] === "#") {
        const r = parseInt(colorString.slice(1, 3), 16);
        const g = parseInt(colorString.slice(3, 5), 16);
        const b = parseInt(colorString.slice(5, 7), 16);
        const a = 1;
        //return {r, g, b, a};
        //return should have named keys
        return {r: r, g: g, b: b, a: a};
    } else {
        const r = parseInt(colorString.slice(5, 8));
        const g = parseInt(colorString.slice(9, 12));
        const b = parseInt(colorString.slice(13, 16));
        const a = 1;
        return {r: r, g: g, b: b, a: a};
    }   
}

//rgbaString takes an object with r, g, b, a values and returns an rgba() string
function rgbaString(color) {
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
}

//hexString takes a color object with r, g, b, a values and returns a hex string
function hexString(color) {
    const r = color.r.toString(16).padStart(2, "0");
    const g = color.g.toString(16).padStart(2, "0");
    const b = color.b.toString(16).padStart(2, "0");
    const a = Math.round(color.a * 255).toString(16).padStart(2, "0");
    return `#${r}${g}${b}${a}`;
}


//colorLerp takes two colors and a value between 0 and 1 and returns a color between the two
function colorLerp(color1, color2, t) {
    const r = lerp(color1.r, color2.r, t);
    const g = lerp(color1.g, color2.g, t);
    const b = lerp(color1.b, color2.b, t);
    const a = lerp(color1.a, color2.a, t);
    return {r, g, b, a};
}

//currentColor takes an array of colors and a value between 0 and 1 and returns a color lerped between array values
function currentColor(colors, t) {
    const color1 = colors[Math.floor(t * colors.length)];
    const color2 = colors[Math.ceil(t * colors.length)];
    if(!color2) return color1;
    return colorLerp(color1, color2, t * colors.length % 1);
}

function UIMsg (message, duration=3000) {
    uiActors.push(new UIMessage(message, duration));
}

function UIMessage (message, duration) {
    this.message = message;
    this.duration = duration;
    this.timer = 0;
    this.update = function () {
        this.timer += elapsed;
        if (this.timer > this.duration) {
            uiActors.splice(uiActors.indexOf(this), 1);
        }
    }
    this.draw = function () {
        gameFont.drawText(this.message, { x: 250, y: 425 }, 0, 0, 1, CENTERED);
    }
}


