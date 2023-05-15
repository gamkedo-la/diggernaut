var spriteSheet = require('spritesheet-js');

console.log('Generating spritesheet...');
spriteSheet("../img/single/*.png", {format: 'pixijs', name: 'diggernaut-atlas'}, function(err) {
    if (err) {
        console.log('Error generating spritesheet: ' + err);
    } else {
        console.log('Spritesheet generated!');

        //copy the generated files to the atlas folder
        var fs = require('fs');
        fs.rename('diggernaut-atlas.json', '../img/atlas/diggernaut-atlas.json', (err) => {
            if (err) throw err;
            console.log('diggernaut-atlas.json was created and placed in pixitest/img/atlas');
        });

        fs.rename('diggernaut-atlas.png', '../img/atlas/diggernaut-atlas.png', (err) => {
            if (err) throw err;
            console.log('diggernaut-atlas.json was created and placed in pixitest/img/atlas');
        });
            }
});

