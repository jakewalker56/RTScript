# RTScript
Javascript-based RTS strategy game

## Bases
Bases can produce units, but have a cooldown period of 1 second after doing so.

## Units
There are currently 7 unit types that are spawnable at the base

#### BRAWLER
Brawlers are close quarters combat specialists.  They are not particularly fast, but they are reasonably strong

#### GUNNER
Gunners are the base ranged unit.  They have a short firing range, but a fast firing rate, and can overpower close quarters combatants from afar

#### SNIPER
Powerful long distance ranged unit.  Low health, low speed, and low rate of fire

#### SCOUT
Scouts are cheap and fast.  They are best used to run around the battlefield collecting resources, or messing with enemy micro that just follows the nearest unit.

#### TANK
Extremely powerful, slow, long range, and high damage units.  They offer an AOE attack- any units colliding with their attack will be affected (typical attacks will only damage the first unit they collide with)

#### GATLING
Extremely high rate of fire unit.  Excellent against swarms, weak against snipers

#### SWARM
Extremely cheap and fast unit.  They pretty much get 1-hit-killed by anything, but they spawn 3 at a time.  Excellent defense against Snipers, weak against Gattling (and Tanks if they clump together)

## Resources
There are two types of resources in WarScript- Money and Energy.  You will steadily gain both of these resources just for being alive.

Resources will also appear across the battlefield randomly.  Successful strategies will involve creating scouts to salvage resources, and controlling the middle of the game board to give your scouts access to as many materials as possible
