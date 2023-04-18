class Collider {
  constructor (x, y, width, height, feelerDelta = { left: 2, right: 2, top: 2, bottom: 2 }, ownerType) {
    this.x = x;
    this.y = y;

    this.ownerType = ownerType;

    this.width = width;
    this.height = height;

    this.left = this.x;
    this.right = this.x + this.width;
    this.top = this.y;
    this.bottom = this.top + this.height;

    this.feelerDelta = feelerDelta;

    this.leftFeeler = {
      x: this.left - this.feelerDelta.left,
      y: this.top + this.height / 2
    }
    this.rightFeeler = {
      x: this.right + this.feelerDelta.right,
      y: this.top + this.height / 2
    }
    this.topFeeler = {
      x: this.left + this.width / 2,
      y: this.top - this.feelerDelta.top
    }
    this.bottomFeeler = {
      x: this.left + this.width / 2,
      y: this.bottom + this.feelerDelta.bottom
    }
  }

  update (x, y) {
    this.x = x;
    this.y = y;

    this.top = this.y;
    this.bottom = this.y + this.height;
    this.left = this.x;
    this.right = this.x + this.width;

    this.leftFeeler.x = this.left - this.feelerDelta.left;
    this.leftFeeler.y = this.top + this.height / 2;
    this.rightFeeler.x = this.right + this.feelerDelta.right;
    this.rightFeeler.y = this.top + this.height / 2;
    this.topFeeler.x = this.left + this.width / 2;
    this.topFeeler.y = this.top - this.feelerDelta.top;

    this.bottomFeeler.x = this.left + this.width / 2;
    this.bottomFeeler.y = this.bottom + this.feelerDelta.bottom;
  }

  tileCollisionCheck(tileCheck) {
    const left = Math.floor(this.left),
        right = Math.floor(this.right),
        top = Math.floor(this.top),
        bottom = Math.floor(this.bottom)

    //check for collision with tile at corners of collider
    const topLeft = tileMap.data[tileMap.pixelToTileIndex(left, top)];
    const topRight = tileMap.data[tileMap.pixelToTileIndex(right, top)];
    const bottomLeft = tileMap.data[tileMap.pixelToTileIndex(left, bottom)];
    const bottomRight = tileMap.data[tileMap.pixelToTileIndex(right, bottom)];

    return (topLeft > tileCheck || topRight > tileCheck || bottomLeft > tileCheck || bottomRight > tileCheck);
}

getTilesAtCorners(tileCheck) {
  const left = Math.floor(this.left),
      right = Math.floor(this.right),
      top = Math.floor(this.top),
      bottom = Math.floor(this.bottom)

  //check for collision with tile at corners of collider
  const topLeft = tileMap.data[tileMap.pixelToTileIndex(left, top)];
  const topRight = tileMap.data[tileMap.pixelToTileIndex(right, top)];
  const bottomLeft = tileMap.data[tileMap.pixelToTileIndex(left, bottom)];
  const bottomRight = tileMap.data[tileMap.pixelToTileIndex(right, bottom)];

  return {
    topLeft: { index: topLeft, collides: topLeft > tileCheck },
    topRight: { index: topRight, collides: topRight > tileCheck },
    bottomLeft: { index: bottomLeft, collides: bottomLeft > tileCheck },
    bottomRight: { index: bottomRight, collides: bottomRight > tileCheck }
  }
}

  draw () {
    canvasContext.save();
    canvasContext.fillStyle = "Red";
    pset(this.leftFeeler.x - view.x, this.leftFeeler.y - view.y);
    pset(this.rightFeeler.x - view.x, this.rightFeeler.y - view.y);
    pset(this.topFeeler.x - view.x, this.topFeeler.y - view.y);
    pset(this.bottomFeeler.x - view.x, this.bottomFeeler.y - view.y);
    canvasContext.restore();
  }

  getTileIndexAndSpawnPos (direction) {
    switch (direction) {
      case LEFT: return {
        startTileIndex: tileMap.pixelToTileIndex(this.leftFeeler.x, this.leftFeeler.y),
        spawnX: this.leftFeeler.x,
        spawnY: this.leftFeeler.y
      };
      case RIGHT:
        return {
          startTileIndex: tileMap.pixelToTileIndex(this.rightFeeler.x, this.rightFeeler.y),
          spawnX: this.rightFeeler.x,
          spawnY: this.rightFeeler.y
        };
      case UP:
        return {
          startTileIndex: tileMap.pixelToTileIndex(this.topFeeler.x, this.topFeeler.y),
          spawnX: this.topFeeler.x,
          spawnY: this.topFeeler.y
        };
      case DOWN:
        return {
          startTileIndex: tileMap.pixelToTileIndex(this.bottomFeeler.x, this.bottomFeeler.y),
          spawnX: this.bottomFeeler.x,
          spawnY: this.bottomFeeler.y
        };
      default:
        return {
          startTileIndex: tileMap.pixelToTileIndex(this.x + this.width / 2, this.y + this.height / 2),
          spawnX: this.x,
          spawnY: this.y
        };
    }
  }

  emit(definition) {
    emitParticles(this.bottomFeeler.x, this.bottom, definition);
  }
}