# Diggernaut

A fast-paced action rogue-like with infinite digging downward, inspired by Super Motherload, Downwell, and Spelunky. Dig endlessly downward, collecting gems, bones, and artifacts, while avoiding falling rocks, stealing valuable artifacts from the squid's lair, and fighting off the various subterranean cryptids.

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
  - each explosion ore tile destroys a 5x5 area. 
- various subterranean cryptids
  - crawling spiked slugs
    - patrol terrain, can only be killed with the Diggerang
    - killing spiders has small chance of health drop
  - flying cave bats
    - dive bomb player from above. can be jumped on from above to kill
  - tentacle blocks
    - stationary, but can grab player and drag them down
  - boss monster: cave squid
### Collectibles
Pre-created sets of items will be procedurally placed throughout the world (lots of pixel art opportunities here)
- Rare Treasures
  - An eclectic collection of gems, minerals, bones, and nostalgic artifacts. 
    - currently done: gem stones and 90's stuff collections

### Mechanics and Items
- Diggerang
  - your trusty double-ended shovel. Can be thrown like a boomerang, twirled like a helicopter, and used to dig.
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
  - Diggerang Throw
    - kill multiple cryptids at once by throwing your diggerang at them.
    - Diggerang will collect item drops it passes near
    - attempting to hit a dragon with a throw carries the risk of your Diggerang being eaten.
    - bash the action button to return the Diggerang from a stuck statem
  - Player takes damage from falling on stalagmites
  - Player takes damage from contact with cryptids

### Terrain types:
- 0 empty space 
- 1 dirt
- 2 unbreakable rock
- 3 unbreakable metal ore
- 4 unobtainium ore
- 5 falling rocks
- 6 explosive ore
- 7 super dense unobtainium ore
- 8 rock
- 9 dense rock
- ? subject to additions, this is good starting point
  
### "Winning" The Game
- Collect all of the rare treasures

### 100% Completion and Achievement ideas
- Speed Run: Collect all treasure in under X minutes

