let app = new PIXI.Application({width: 640, height: 360});
document.body.appendChild(app.view);


PIXI.Assets.load([
    "./img/atlas/diggernaut-atlas.json",
    "./img/atlas/diggernaut-atlas.png"
]).then(() => {
    doneLoading();
});

const state = {
    elapsed: 0,
    sprites: {}
}

function doneLoading() {
    app.ticker.add(update);
    
    let gem = PIXI.Sprite.from("gems01.png");
    gem.x = 100;
    gem.y = 100;

    let gem2 = PIXI.Sprite.from("gems02.png");
    gem2.x = 200;
    gem2.y = 100;

    app.stage.addChild(gem);
    app.stage.addChild(gem2);

    let player = PIXI.Sprite.from("Player00.png");
    player.x = 300;
    player.y = 100;

    app.stage.addChild(player);

    console.log(PIXI.Assets.cache);
}

function update(delta){
    state.elapsed += delta;
    // Update the sprite's X position based on the cosine of our elapsed time.  We divide
    // by 50 to slow the animation down a bit...
    //console.log(state.elapsed);
}
