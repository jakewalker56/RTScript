function Unit(unitType, team, x, y)
{
    this.maxHealth = 0;
    this.currentHealth = 0;
    this.speed = 0;
    this.cooldown = 0;
    this.range = 0;
    this.attack = 0;
    this.unitsize = 0;
    this.colorstring = "red";
    this.AOE = false;
    this.energyCost = 0;
    this.moneyCost = 0;
    this.radius = 0;
    this.unitType = unitType;
    this.moneyCost = MoneyCost[this.unitType];
    this.energyCost = EnergyCost[this.unitType];

    switch (this.unitType)
    {
        case UnitTypeEnum.SWARM:
        //spawns multiple units
            this.maxHealth = 3;
            this.currentHealth = this.maxHealth;
            this.speed = 4;
            this.cooldown = 10;
            this.range = 3;
            this.attack = 2.7;
            this.unitsize = 2.5;
            break;
        case UnitTypeEnum.BRAWLER:
            this.maxHealth = 105;
            this.currentHealth = this.maxHealth;
            this.speed = 3;
            this.cooldown = 14;
            this.range = 2;
            this.attack = 5;
            this.unitsize = 3;
            break;
        case UnitTypeEnum.SCOUT:
            this.maxHealth = 25;
            this.currentHealth = this.maxHealth;
            this.speed = 4.2;
            this.cooldown = 16;
            this.range = 2;
            this.attack = 1;
            this.unitsize = 2;
            break;
        case UnitTypeEnum.GUNNER:
            this.maxHealth = 70;
            this.currentHealth = this.maxHealth;
            this.speed = 2;
            this.cooldown = 17;
            this.range = 45;
            this.attack = 4;
            this.unitsize = 2;
            break;
        case UnitTypeEnum.SNIPER:
            this.maxHealth = 40;
            this.currentHealth = this.maxHealth;
            this.speed = 0.8;
            this.cooldown = 50;
            this.range = 90;
            this.attack = 27;
            this.unitsize = 1;
            break;
        case UnitTypeEnum.TANK:
            this.maxHealth = 300;
            this.currentHealth = this.maxHealth;
            this.speed = 0.3;
            this.cooldown = 90;
            this.range = 100;
            this.attack = 65;
            this.unitsize = 6.5;
            this.AOE = true;
            this.radius = 6;
            break;
        case UnitTypeEnum.GATLING:
            this.maxHealth = 150;
            this.currentHealth = this.maxHealth;
            this.speed = 0.85;
            this.cooldown = 3;
            this.range = 75;
            this.attack = 6;
            this.unitsize = 4;
            break;
        default:
            break;
    }

    this.lastActionTick = window.tick;

    if(team == window.baseOne.team)
    {
        this.colorstring = "red";
    }

    else if (team == window.baseTwo.team)
    {
        this.colorstring = "blue";
    }
    
    this.checkActionAvailable = function()
    {
        current = window.tick;
        if(current - this.lastActionTick > this.cooldown)
        {
          return true;
        }
        return false;
    }
    this.damage = function(attack)
    {
        this.currentHealth -= attack;
    }
    this.update = function(action, direction, speed)
    {
        tookAction = false;
        if(action != null)
        {
            if(this.checkActionAvailable())
            {
              switch(action.actionEnum)
              {
                case(ActionEnum.ATTACK):
                    //Try to attack.  If the attack is illegal, you lose your cooldown for a failed attempt
                    window.Attack(this.x, this.y, action.params[0], 
                        action.params[1], this.radius, this.range, this.attack, this.AOE, this.team);
                    tookAction = true;
                    break;
                default:
                    break;
              }
            }
        }
        if(tookAction == true)
        {
            this.lastActionTick = window.tick;
        }
        if(direction && speed)
        {
            speed = Math.min(speed, this.speed) * window.speedScale;
            if(tookAction == true)
            {
                speed = 0;
            }
            distance = Math.pow(Math.pow(direction[0], 2) + Math.pow(direction[1], 2), 0.5);
            if(distance != 0)
            {
                changex = direction[0] * speed / distance
                changey = direction[1] * speed / distance
                //don't prevent collisions with walls- note that a fast enough unit would pass right through
                //a wall
                collisions = collision(this.x + changex, this.y + changey, 0);
                wallCollision = false;
                for(var k = 0; k < collisions.length; k++)
                {
                    if(collisions[k].unitType == UnitTypeEnum.WALL)
                    {
                        wallCollision = true;
                    }
                }
                if(!wallCollision)
                {
                    this.x += changex
                    this.y += changey
                }
            }
        }
        this.checkDeath();
    }
    this.checkDeath = function()
    {
      if(this.x < 0 || this.x >= window.boardWidth ||
          this.y < 0 || this.y >= window.boardHeight )
      {
        console.log("unit out of bounds died!")
         this.isAlive = false;
      }
      if(this.currentHealth <= 0)
      {
         this.isAlive = false;
      }
    }

    this.x = x;
    this.y = y;
    this.isAlive = true;
    this.team = team;
    this.ID = team + '-' + window.unitCount;

    window.unitCount++;
}