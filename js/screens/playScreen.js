const playScreen = {

    hitCounter: 0,
    ticker: 0,
    music: null,

    reset: function () {
        player.reset();
        if (playScreen.music) {
            playScreen.music.sound.stop();
            playScreen.music = null;
        }
        
    },

    draw: function () {
        this.ticker++
        this.prepareLightingOverlay();
        this.prepareBloomOverlay();
        this.drawParallaxBackground();
        tileMap.draw(view, canvasContext);
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
        if (!playScreen.music) {
            playScreen.music = audio.playSound(sounds['downward-music'], 0, 1, 1, true);
        }
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
            if (player.inventory.blueOre > BLUE_UPGRADES[i].cost) {
                if (!blueUpgrades[i].won){
                    blueUpgrades[i].effect();
                    blueUpgrades[i].won = true;
                    return;
                }
            }
        }

        for (let i = 0; i < GOLD_UPGRADES.length; i++) {
            if (player.inventory.ore > GOLD_UPGRADES[i].cost) {
                if (!goldUpgrades[i].won){
                    goldUpgrades[i].effect();
                    goldUpgrades[i].won = true;
                    return;
                }
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
        let maxDepth = 9000;
        let depth = clamp(player.depth, 0, maxDepth-1);
        let colorLevel = Math.max(0, mapRange(depth, 40, maxDepth, 0, 1));
        let backgroundFill = rgbaString( currentColor(BG_GRADIENT, colorLevel) );
        
        bufferContext.save();
        bufferContext.fillStyle = backgroundFill;
        bufferContext.fillRect(0, 0, canvas.width, canvas.height);


        bufferContext.globalCompositeOperation = 'screen';
        
        let glowSize = Math.max( mapRange(depth, 40, maxDepth, 900, 160), 160);
        let half = glowSize / 2;
        bufferContext.drawImage(img['big_green_glow'], player.x - view.x - half, player.y - view.y - half, glowSize, glowSize);
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
        let alpha = mapRange(player.depth, 60, 1000, 0, 1);
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
    },

    
}