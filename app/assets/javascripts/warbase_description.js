
function WarbaseDescription(base)
{
    this.health = base.health;
    this.gold = base.gold;
    this.energy = base.energy;
    this.lastActionTick = base.lastActionTick
    this.cooldown = base.cooldown;
    this.maxUnitCount = base.maxUnitCount;
    this.currentUnitCount = base.currentUnitCount;
    this.x = base.x;
    this.y = base.y;

    this.actionDescription = null;
    this.params = null;
}