const {Application, Sprite, Assets} = PIXI;
let app = new Application({width: 544, height: 306});
document.getElementById("gamebox").appendChild(app.view);


Assets.load([
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

    let player = Sprite.from("Player00.png");
    player.x = 300;
    player.y = 100;

    app.stage.addChild(player);

    console.log(Assets.cache);
}

function update(delta){
    state.elapsed += delta;
}
