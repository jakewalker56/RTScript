function Explosion(x, y, radius, team)
{
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.unitsize = radius;

    this.startTick = window.tick;
    this.team = team;

    this.r = 255;
    this.g = 100;
    this.b = 0;
}