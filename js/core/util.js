
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
    w: 87,
    s: 83,
    d: 68,
    z: 90,
    x: 88,
    f: 70,
    p: 80,
    r: 82,
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
function rectCollision(rect1, rect2) {
    return (
        rect1.left < rect2.right &&
        rect2.left < rect1.right &&
        rect1.top < rect2.bottom &&
        rect2.top < rect1.bottom
      );
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




