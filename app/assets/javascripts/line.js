function Line(x1, y1, x2, y2, team)
{
    this.fromx = x1;
    this.fromy = y1;
    this.tox = x2;
    this.toy = y2;

    this.startTick = window.tick;
    this.team = team;
}