function Warbase(x, y, team)
{
    this.checkUnitAvailable = function()
    {
        if(this.currentUnitCount < this.maxUnitCount)
        {
          current = window.tick;
          if(current - this.lastActionTick > this.cooldown)
          {
            this.lastActionTick = current;
            return true;
          }
        }
        return false;
    }
    this.maxHealth = 1000;
    this.currentHealth = this.maxHealth;
    this.AI = null;
    this.money = 400;
    this.energy = 400;
    this.energyRegen = 0.5;
    this.moneyRegen = 0.5;
    this.cooldown = 10;
    this.lastActionTick = window.tick;
    this.maxUnitCount = 50;
    this.currentUnitCount = 0;
    this.team = team;
    this.unitsize = 15;
    this.x = x;
    this.y = y;
    this.isAlive = true;
    this.ID = team + '-' + window.baseCount;
    this.colorstring = "grey"
    
    this.spawnUnit = function(unitType, skipValidation)
    {
        if(this.checkUnitAvailable() || skipValidation)
        {
            unit = new Unit(unitType, this.team, this.x, this.y);
            if((this.energy > unit.energyCost && this.money > unit.moneyCost) || skipValidation)
            {
              window.units.push(unit);
              this.currentUnitCount++;
              if(!skipValidation)
              {
                this.energy -= unit.energyCost;
                this.money -= unit.moneyCost;
              }
              return true;
            }
            else
            {
                return false;
            }
        }
        return false;
    }
    this.unitDied = function(team)
    {
        if(team == this.team)
        {
            this.currentUnitCount--;
        }
    }
    this.incrementGoods = function()
    {
        this.money += this.moneyRegen;
        this.energy += this.energyRegen;
    }

    this.update = function(actionDescription)
    {
        if(actionDescription)
        {
          switch(actionDescription.actionEnum)
          {
            case (ActionEnum.SPAWN):
                result = this.spawnUnit(actionDescription.params, false);
                if(actionDescription.params == UnitTypeEnum.SWARM && result)
                {
                    //if we spawn a swarm, spawn a few more!
                    this.spawnUnit(actionDescription.params, true);
                    this.spawnUnit(actionDescription.params, true);
                }
                break;
            default:
                break;
          }
        }
        this.incrementGoods()
        this.checkDeath();
    }
    this.damage = function(damage)
    {
        this.currentHealth -= damage;
        console.log(this.currentHealth + "/" + this.maxHealth)
    }
    this.checkDeath = function()
    {
        if(this.currentHealth <= 0)
        {
            this.isAlive = false;
            window.isAlive = false;
        }
    }
}