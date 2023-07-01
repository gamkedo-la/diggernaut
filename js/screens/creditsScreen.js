const creditsScreen = {

    reset: function () {
        ticker = 0;
    },

    draw: function (additionalText = "") {
        this.credits = `` +
            this.congratsText +
            `
HomeTeam GameDev Presents:
Diggernauts

a JS game led by Ryan Malm from
April 2 thru July 2 2023

Ryan Malm: Project lead, core gameplay, player movement, controls, diggerang, map generation, tile art, particle effects, inventory
system, sound code (including compressor), sprite system, collectibles, enemy code (including crawler, tentacle, patroller, bat),
debug minimap, damage tuning, screen transition effect, unbreakable bricks, auto-tiles art, ore lifetime, large font, health drops,
lighting effects, shield upgrades, treasure details, scoring, upgrades, depth awards, credits display, inventory screen, in-game
music, additional player sounds, title screen

Christer "McFunkypants" Kaitila: Player stats (steps, jumps, helicopters), inventory stats (playtime, enemies killed), stats
display, gamepad controls, assorted room prefabs (t-intersection, platform, longhallway, stairs left, stairs right, hut, hallway,
well, plus, checkerboard, pipe), tentacle monster eyelids, irregular tentacle length, stalagmites, player damage display, sound
priority adjustments, randomized collectible and footstep sounds, minimap with arrow icon and depth indicator

H Trayford: Player damage screen shake, falling rocks damage other rocks, map replay, reusable player collider, ore costs for
diggerang & helicopter, rock & dense rock tile code, explosive tile cascade, ore bar expansion to 2600 ore, partial tile damage
shake, 4-hit conversion for dense ore, tile damage tracking in tilemap

Johan Ostling: Sound variation randomizer, sounds (player damage, crumbling rock variations, explosions, boomerang flying loop,
pickups, shovel to metal)

Klaim (A. Joel Lamotte): Title music

Kyle Knutson: Player sprite, unobtanium ore, gems, 90s treasures

Patrick McKeown: Sounds (dirt dig, jump variations, soft landing, health pickup, depth goal)

Jonathan Peterson: Bones collectible inventory tab, ore display, hjkl movement

Jacob LeCoq: Sprite moving directions, prevented helicopter mode while diggerang is out

Chad Serrant: Bone sprite

Joel Lamotte (Klaim) and Michael Primo: Playtesting
`
        this.congratsText = additionalText;
        clearScreen('black');
        let verticalSpacing = 4;
        let creditsLength = this.credits.split(/\r?\n/).length * (gameFont.characterHeight + verticalSpacing) + canvas.height;
        gameFont.drawText(this.credits, { x: 10, y: Math.floor( canvas.height - (ticker / 2) % creditsLength) }, 0, verticalSpacing);
        gameFont.drawText(this.credits, { x: 10, y: Math.floor(creditsLength + (ticker / 2) % creditsLength) }, 0, verticalSpacing);
        fillRect(0, 425, canvas.width, 15, '#111');
        tinyFont.drawText("Press Enter to return to Title", { x: 600, y: 430 }, 0, 0);
    },

    update: function () {
        Joy.update();
        if (Key.justReleased(Key.ENTER) || Joy.a || Joy.start || Joy.x) { signal.dispatch('titleScreen'); }
    }
}