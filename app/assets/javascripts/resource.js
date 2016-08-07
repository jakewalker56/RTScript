function Resource(resourceType, resourceAmount, x, y)
{
    this.resourceType = resourceType;
    this.resourceAmount = resourceAmount;
    this.unitsize = Math.max(Math.min(resourceAmount / 10, 5), 2);

    switch(this.resourceType)
    {
        case (ResourceType.MONEY):
            this.colorstring = "gold";
            break;
        case (ResourceType.ENERGY):
            this.colorstring = "lightgreen";
            break;
        default:
            break;
    }
    this.x = x;
    this.y = y;
    this.isAlive = true;
    this.ID = this.resourceType + '-' + window.resourceCount;
    window.resourceCount++;
}