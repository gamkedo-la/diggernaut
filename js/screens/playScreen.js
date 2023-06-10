const playScreen = {

    hitCounter: 0,
    ticker: 0,
    music: null,

    reset: function () {
        player.reset();
        if (!playScreen.music) {
            playScreen.music = audio.playSound('downward-music', 0, 0.5, 1, true);
        }
    },

    draw: function () {
        this.ticker++
        this.prepareLightingOverlay();
        this.prepareBloomOverlay();
        this.drawParallaxBackground();
        tileMap.draw();
        actors.forEach(actor => actor.draw(canvasContext));
        player.draw();
        this.drawLightingOverlay();
        this.drawBloomOverlay();
        ui.draw();

        //this.debugDraw();
        uiActors.forEach(actor => actor.draw(canvasContext));

        //bigFontBlue.drawText("PLAYER", {x: player.x - view.x, y: player.y - view.y - 20}, 0, 1);
        drawTransition();

    },

    update: function () {
        this.followPlayer();
        ui.update();
        actors.forEach(actor => actor.update());
        uiActors.forEach(actor => actor.update());
        player.handleInput();
        player.update();
        tileMap.update();
        if (Key.justReleased(Key.m)) { signal.dispatch('gotoMap') }

        for (let i = 0; i < DEPTH_MILESTONES.length; i++) {
            if (player.depth > DEPTH_MILESTONES[i]) {
                depthAwards[DEPTH_MILESTONES[i]]();
                depthAwards[DEPTH_MILESTONES[i]] = function () { };
            }
        }

        for (let i = 0; i < BLUE_UPGRADES.length; i++) {
            if (player.inventory.blueOre == BLUE_UPGRADES[i].cost) {
                if (blueUpgrades[i].won) return;
                blueUpgrades[i].effect();
                blueUpgrades[i].won = true;
                return;
            }
        }

        for (let i = 0; i < GOLD_UPGRADES.length; i++) {
            if (player.inventory.ore == GOLD_UPGRADES[i].cost) {
                if (goldUpgrades[i].won) return;
                goldUpgrades[i].effect();
                goldUpgrades[i].won = true;
                return;
            }
        }



    },



    followPlayer: function () {
        //TODO: lerp camera, implement deadzone and camera shake
        view.x = player.x - canvas.width / 2;
        view.y = player.y - canvas.height / 2;
        view.x = Math.floor(view.x);
        view.y = Math.floor(view.y);
        view.x = Math.max(0, view.x);
        view.y = Math.max(0, view.y);
        view.x = Math.min(tileMap.widthInTiles * tileMap.tileWidth - canvas.width, view.x);
        // view.y = Math.min(tileMap.height * tileMap.tileSize - canvas.height, view.y);

    },

    drawParallaxBackground: function () {
        const layers = [
            {
                image: img['cave-background-2'],
                speed: 0.2
            },
            {
                image: img['cave-background-1'],
                speed: .5
            }
        ];

        layers.forEach(layer => {


            // Calculate the movement of the layer based on its speed
            const offsetX = (view.x * layer.speed) % 320;
            const offsetY = (view.y * layer.speed) % 320;

            // Draw the layer multiple times to fill the screen
            for (let x = -offsetX; x < view.width; x += 320) {
                for (let y = -offsetY; y < view.height; y += 320) {
                    canvasContext.drawImage(layer.image, x, y, 320, 320);
                }
            }
        });
    },
    prepareLightingOverlay: function () {
        bufferContext.save();
        bufferContext.fillStyle = COLORS[17];
        bufferContext.fillRect(0, 0, canvas.width, canvas.height);


        bufferContext.globalCompositeOperation = 'screen';
        let randX = randChoice([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, -1]);
        let randY = randChoice([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, -1]);
        bufferContext.drawImage(img['big_green_glow'], player.x - view.x - 160, player.y - view.y - 160, 320, 320);
        bufferContext.restore();
    },

    prepareBloomOverlay: function () {
        bloomContext.save();
        bloomContext.fillStyle = "rgba(128, 128, 128, 1)";
        bloomContext.fillRect(0, 0, canvas.width, canvas.height);
        bloomContext.restore();
    },

    drawLightingOverlay: function () {

        canvasContext.save();
        canvasContext.globalCompositeOperation = 'multiply';
        canvasContext.globalAlpha = 0.9;
        canvasContext.drawImage(bufferCanvas, 0, 0);

        canvasContext.restore();
    },

    drawBloomOverlay: function () {
        canvasContext.save();
        canvasContext.globalCompositeOperation = 'hard-light';
        canvasContext.globalAlpha = 1;
        canvasContext.drawImage(bloomCanvas, 0, 0);
        canvasContext.restore();
    },

    debugDraw: function () {
        tinyFont.drawText(
            `player:  x: ${player.x.toFixed(1)} y: ${player.y.toFixed(1)}
yvel: ${player.yvel.toFixed(1)} xvel: ${player.xvel.toFixed(1)} health: ${player.health}
diggerang: x: ${player.diggerang.x.toFixed(1)} y: ${player.diggerang.y.toFixed(1)}
elapsed: ${elapsed.toFixed(1)}`,
            { x: 10, y: 12 }, 0, 0, 1);
    }
}