# Diggernaut

A fast-paced action rogue-like with infinite digging downward, inspired by Super Motherload, Downwell, and Spelunky. Dig endlessly downward, collecting gems, bones, and artifacts, while avoiding falling rocks, stealing valuable artifacts from the dragon's lair, and fighting off the various subterranean cryptids.

Game will feature an inventory that's displayed on pause with tabs for each collection.

Player is armed with a double-ended shovel (Diggerang) multi-tool that can dig, be thrown like a boomerang, and twirled like a helicopter to break your fall.


### Hazards
- falling rocks from above
  - digging through adjacent space will cause them to fall. 
  - falling rocks contain 1 of the gem collections
- voids / free fall spaces
- explosive ore
  - explodes when dug through
  - adjacent explosive ore will explode
  - each explosion ore tile destroys a 3x3 area
- stalagmites
  - deal heavy damage if fallen on from above at high speed
- various subterranean cryptids
  - crawling spiders
    - patrol terrain or drop from above on thread
    - killing spiders has small chance of health drop
  - flying cave hornets
    - attack player on site, swarm in groups
  - tentacles
    - stationary, but can grab player and drag them down
  - mini boss monster: cave squid
    - moves by grabbing the walls
    - attacks with its tentacles
    - many hp, must kill all tentacles to kill squid
  - big boss monster: dragon (if time)
    - sleeps at the lowest point of the map
    - 4th artifact collection and 4th gem collection are in its lair
### Collectibles
Pre-created sets of items will be procedurally placed throughout the world (lots of pixel art opportunities here)
- Gems (target 16, more if time)
  - 4 sets of 4 gems each
    - 1 of the sets will be distributed inside the dragon's lair
    - 1 of the sets hidden within falling rocks
- Bones 
  - 3 sets of 7 bones each
    - each set contains: 1 skull, 1 ribcage/torso, 2 arms, 2 legs, 1 tail
    - will leave it in the hands of the artists to decide what creature the bones belong to
- Artifacts
  - hidden in chests, placed in the dragon's lair and squid rooms, hidden in the walls
  - 4 sets of 4 artifacts each
    - 1 set in dragon's lair
    - 1 set hidden in squid rooms
    - 1 set hidden in chests
    - 1 set hidden in enemy spawner rooms

### Mechanics and Items
- Bombs
  - can be crafted from 100 unobtainium
  - explodes in a 4x4 area
  - will destroy unbreakable rock and metal ore
- Diggerang
  - your trusty double-ended shovel. Can be thrown like a boomerang, twirled like a helicopter, and used to dig.
- Jetpack (rare)
  - allows you to dig upward, and fly upward through empty space
  - required for stealth achievement, dragons hoard can only be collected from below with jetpack
- Map (scanning drone deployment);
  - can be crafted from 500 unobtainium
  - reveals the entire map
  - required for speed run achievement
- Player actions
  - Dig left, right, and down
  - wall jump
    - can be used to scale walls upward
  - Helicopter
    - spin your diggerang above your head to slow fall in open spaces
    - depletes unobtanium stores quickly
  - wall slide
    - can be used to slow fall at edges of open spaces when no energy is left to helicopter
  - power drill
    - can quickly bulldoze through blocks downward starting from a jump
    - depletes unobtanium stores quickly
    - can be used to destroy explosive ore without taking damage
  - Diggerang Throw
    - kill multiple cryptids at once by throwing your diggerang at them.
    - Diggerang will collect item drops it passes near
    - attempting to hit a dragon with a throw carries the risk of your Diggerang being eaten.
    - bash the action button to return the Diggerang from a stuck state
  - Shovel Melee
    - swing your shovel at enemies to kill them
  - Player takes damage from hititng the ground at high speed
  - Player takes damage from falling on stalagmites
  - Player takes damage from contact with cryptids

### Terrain types:
- 0 empty space 
- 1 dirt
- 2 unbreakable rock
- 3 unbreakable metal ore
- 4 unobtainium
- 5 falling rocks
- 6 stalactites
- 7 explosive ore
- ? subject to additions, this is good starting point
  
Terrain notes: For visual interest, there can and will be more than one tile graphic for each terrain type.
Artists can feel free to add as many they want, the game will procedurally / randomly select from the available tiles.
Tilemap game data will be represented by 0-7, but game will generate a decorative tilemap based on game data using all available tile graphics.

### Winning The Game
- Collect all 4 sets of 4 gems
- Collect the "Dragon's Hoard" collections and Kill the dragon

### 100% Completion and Achievement ideas
- Collect all 4 sets of 4 gems
- Collect all 3 sets of 7 bones
- Collect all 4 sets of 4 artifacts
- Stealth Mode: Collect all sets without waking or killing the dragon
- Pacifist Mode: Collect all sets without killing any cryptids
- Speed Run: Collect all sets in under X minutes
- Unpaid Assassin: Kill the dragon with an empty inventory
- 

