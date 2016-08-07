UnitTypeEnum = {
    BRAWLER : "Brawler",
    GUNNER : "Gunner",
    SNIPER : "Sniper",
    SCOUT : "Scout",
    TANK : "Tank",
    GATLING : "Gatling",
    SWARM : "Swarm",
    BASE: "base",
    WALL: "wall"
}

MoneyCost = {
    "Brawler" : 45,
    "Gunner" : 60,
    "Sniper" : 110,
    "Scout" : 0,
    "TANK" : 250,
    "Gatling" : 45,
    "Swarm" : 50
}
EnergyCost = {
    "Brawler" : 45,
    "Gunner" : 10,
    "Sniper" : 135,
    "Scout" : 25,
    "TANK" : 250,
    "Gatling" : 175,
    "Swarm" : 25
}

ResourceType = {
    MONEY : "Money",
    ENERGY : "Energy"
}

ActionEnum = {
    SPAWN : "Spawn",
    ATTACK : "Attack"
}


function collision(x, y, radius)
{
    //returns an array of all the units, bases, and walls that are within radius units of coordinate x,y
    //otherwise returns empty array
    results = new Array();

    for(var i = 0; i < window.units.length; i++)
    {
        // x1  x1 + width
        //  ____  y1
        // |    |
        // |____| ___  y2
        //       |   |
        //       |___|
        //       x2  x2 + width
       
        if( (x + radius >= window.units[i].x && x - radius <= window.units[i].x + window.units[i].unitsize ) &&
            (y + radius >= window.units[i].y && y - radius <= window.units[i].y + window.units[i].unitsize ))
        {
            results.push(window.units[i]);
        }
    }

    if( (x + radius >= window.baseOne.x && x - radius <= window.baseOne.x + window.baseOne.unitsize ) &&
        (y + radius >= window.baseOne.y && y - radius <= window.baseOne.y + window.baseOne.unitsize ))
    {
        results.push(window.baseOne);
    }
    if( (x + radius >= window.baseTwo.x && x - radius <= window.baseTwo.x + window.baseTwo.unitsize  ) &&
        (y + radius >= window.baseTwo.y && y - radius <= window.baseTwo.y + window.baseTwo.unitsize ))
    {
        results.push(window.baseTwo);
    }
    return results;
}
