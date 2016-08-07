window.Attack =  function(xfrom, yfrom, xto, yto, radius, range, attack, aoe, team)
{
    if(Math.pow(Math.pow(xfrom - xto, 2) + Math.pow(yfrom - yto, 2), 0.5) < range)
    {
        window.Lines.push(new Line(xfrom, yfrom, xto, yto, team));
        if(radius > 0) {
            window.Explosions.push(new Explosion(xto, yto, radius, team));
        }

        collisions = collision(xto, yto, radius);
        for(var j = 0; j < collisions.length; j++)
        {
            if(collisions[j].team != team)
            {
              if(collisions[j].currentHealth <= 0)
              {
                //already died this turn, want to hit the next unit on this same space
                continue;
              }
              //console.log(collisions[j].ID + ' taking ' + attack + ' damage');
              collisions[j].damage(attack);
              if(aoe == false)
              {
                //if this is not an AOE attack, then we just hit the first enemy and we're done
                return;
              }
            }
        }
    }
}
function CreateGlobals()
{

    window.StartTime = (new Date()).getTime();
    window.StartTick = 0;
    window.LastResourceTick = 0;
    window.ResourceSpawnTicks = 20;
    window.MinResourceAmount = 25;
    window.MaxResourceAmount = 50;
    window.Lines = new Array();
    window.Explosions = new Array();

	window.currentGridPosx = 0;
	window.currentGridPosy = 0;
	//window.boardWidth = window.innerWidth - 50;
	//window.boardHeight = window.innerHeight - 100;

    window.tick = window.StartTick;
    window.tickDelay = 35;

    window.unitCount = 0;
    window.baseCount = 0;

	//down: 0  right: 1  up: 2  left: 3
	window.xmove = new Array(0, 1, 0, -1);
	window.ymove = new Array(1, 0, -1, 0);

	window.isAlive = true;
	window.board = document.getElementById("board");
    window.board.width = window.innerWidth * 9.5 / 12.0;
    window.board.height= window.innerHeight * 0.6;
    window.ctx = board.getContext("2d");
    
    //need to shrink the board if we're going to zoom in
    window.viewScale = 2;
    window.speedScale = 0.75;

    window.boardWidth = window.board.width / window.viewScale;
    window.boardHeight = window.board.height / window.viewScale;

    window.teamColors = ["#FF0000", "#0000FF"]
    window.attackFadeTicks = 2;
    window.explosionFadeTicks = 30;

    

	//window.board.style.border = "1px solid black";
	//window.board.style.width = window.boardWidth;
	//window.board.style.height = window.boardHeight;
	
    window.units = new Array();
    window.resources = new Array();

    window.baseOne = new Warbase(window.boardWidth / 5, window.boardHeight/5, "Team 1");
    window.baseTwo = new Warbase(window.boardWidth * 4 / 5, window.boardHeight * 4/5, "Team 2");
    
    window.baseOne.AI = eval("new Warrior1()");
    window.baseTwo.AI = eval("new Warrior1()");

    window.units1 = document.getElementById("scoreboard-score1-table-units");
    window.energy1 = document.getElementById("scoreboard-score1-table-energy");
    window.money1 = document.getElementById("scoreboard-score1-table-money");
    window.base1 = document.getElementById("scoreboard-score1-table-base");

    window.units2 = document.getElementById("scoreboard-score2-table-units");
    window.energy2 = document.getElementById("scoreboard-score2-table-energy");
    window.money2 = document.getElementById("scoreboard-score2-table-money");
    window.base2 = document.getElementById("scoreboard-score2-table-base");

    window.timer = document.getElementById("game-timer");
}
function resetGame()
{
	var elm = document.getElementById("tryAgain");
	window.board.removeChild(elm);
	CreateGlobals();
	Update();
}
function tryAgain() 
{
    var tmpElm = document.createElement("div");
    tmpElm.id = "tryAgain";
    tmpElm.className = "try-again-dialog";
    tryagainstring = "Booth Hacks War<p></p>You died :(<p></p>";
    if(!window.baseOne.isAlive)
    {
        tryagainstring = "Team Two wins!"
    }
    else
    {
        tryagainstring = "Team One wins!"
    }

    tryagainstring += "<p>Team 1: " + window.baseOne.currentHealth + "/" + window.baseOne.maxHealth + "</p>"; 
    tryagainstring += "<p>Team 2: " + window.baseTwo.currentHealth + "/" + window.baseTwo.maxHealth + "</p>";
    tryagainstring += "<p>Resource Count:" + window.resources.length + "</p>"
    var tryAgainTxt = document.createElement("div");
    tryAgainTxt.innerHTML = tryagainstring;
    var tryAgainStart = document.createElement("button");
    tryAgainStart.appendChild( document.createTextNode("Play Again?"));
    
    var reloadGame = function() {
        resetGame();
    };
    
    tryAgainStart.addEventListener("click", reloadGame, false);
    tmpElm.appendChild(tryAgainTxt);
    tmpElm.appendChild(tryAgainStart);
    window.board.appendChild(tmpElm);
    return tmpElm;
}

function Cleanup()
{
    for(var i = 0; i < window.units.length; i++)
    {
        if(units[i].isAlive == false)
        {
            console.log("unit " + i + " died!");
            window.baseOne.unitDied(window.units[i].team);
            window.baseTwo.unitDied(window.units[i].team);
            window.units[i] = null;
            window.units.splice(i, 1);
            i--;
        }
    }
    for(var i = 0; i < window.resources.length; i++)
    {
        if(window.resources[i].isAlive == false)
        {
            console.log("resource " + i + " consumed!");
            window.resources[i] = null;
            window.resources.splice(i, 1);
            i--;
        }
    }
    for(var i = 0; i < window.Lines.length; i++)
    {
        if(window.Lines[i].startTick + window.attackFadeTicks < window.tick)
        {
            console.log("Attack " + i + " faded out!")
            window.Lines[i] = null;
            window.Lines.splice(i, 1);
            i--;
        }
    }
    for(var i = 0; i < window.Explosions.length; i++)
    {
        if(window.Explosions[i].startTick + window.explosionFadeTicks < window.tick)
        {
            console.log("Explosion " + i + " faded out!")
            window.Explosion[i] = null;
            window.Explosions.splice(i, 1);
            i--;
        }
    }
}
function ParseWarPlan(base, warplan, debug)
{
    for(var i = 0; i < warplan.myUnits.length; i++)
    {
        for(var j = 0; j < window.units.length; j++)
        {
            if(window.units[j].ID == warplan.myUnits[i].ID)
            {
                if(debug)
                {
                    console.log(window.units[j].ID + ": " + warplan.myUnits[i].moveDirection + ", " + warplan.myUnits[i].moveSpeed);
                }
                window.units[j].update(
                    warplan.myUnits[i].actionDescription, 
                    warplan.myUnits[i].moveDirection, 
                    warplan.myUnits[i].moveSpeed
                );
            }
        }
    }
    base.update(warplan.myBase.actionDescription);
}
function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}
function UpdateScoreboard()
{
    window.units1.innerHTML = "Units: " + window.baseOne.currentUnitCount + "/" + window.baseTwo.maxUnitCount;
    window.energy1.innerHTML = "Energy: " + Math.round(window.baseOne.energy);
    window.money1.innerHTML = "Money: " + Math.round(window.baseOne.money);
    window.base1.innerHTML = "Base: " + Math.round(window.baseOne.currentHealth) + "/" + window.baseOne.maxHealth;

    window.units2.innerHTML = "Units: " + window.baseTwo.currentUnitCount + "/" + window.baseTwo.maxUnitCount;
    window.energy2.innerHTML = "Energy: " + Math.round(window.baseTwo.energy);
    window.money2.innerHTML = "Money: " + Math.round(window.baseTwo.money);
    window.base2.innerHTML = "Base: " + Math.round(window.baseTwo.currentHealth) + "/" + window.baseTwo.maxHealth;

    currenttime = (new Date()).getTime() - window.StartTime;
    window.timer.innerHTML = Math.floor(currenttime / (60 * 1000)) + ':' + pad(Math.floor((currenttime / 1000) % 60), 2);
}
function GenerateResources()
{
    if(window.LastResourceTick + window.ResourceSpawnTicks < window.tick)
    {
        type = Math.random() < 0.5 ? ResourceType.MONEY : ResourceType.ENERGY;
        amount = window.MinResourceAmount + Math.random() * (window.MaxResourceAmount - window.MinResourceAmount);
        
        //don't put it right on the edge
        x = 14 + Math.random() * (window.boardWidth - 28);
        y = 14 + Math.random() * (window.boardHeight - 28);
        window.resources.push(new Resource(type, amount, x, y));

        window.LastResourceTick = window.tick;
    }

}
function CheckResources()
{
    for(var i = 0; i < window.resources.length; i++)
    {
        collisions = collision(window.resources[i].x, window.resources[i].y, window.resources[i].unitsize - 1);
        for(var j = 0; j < collisions.length; j++)
        {
            if(collisions[j].unitType && collisions[j].team)
            {
                if(collisions[j].team == window.baseOne.team)
                {
                    switch(window.resources[i].resourceType)
                    {
                        case(ResourceType.MONEY):
                            window.baseOne.money += window.resources[i].resourceAmount;
                            break;
                        case(ResourceType.ENERGY):
                            window.baseOne.energy += window.resources[i].resourceAmount;
                            break;
                        default:
                          break;
                    }
                    window.resources[i].isAlive = false;
                    break;
                }
                else if (collisions[j].team == window.baseTwo.team)
                {
                     switch(window.resources[i].resourceType)
                    {
                        case(ResourceType.MONEY):
                            window.baseTwo.money += window.resources[i].resourceAmount;
                            break;
                        case(ResourceType.ENERGY):
                            window.baseTwo.energy += window.resources[i].resourceAmount;
                            break;
                        default:
                          break;
                    }
                    window.resources[i].isAlive = false;
                    break;
                }
            }
        }
    }
}
function DrawRect(obj) {
    window.ctx.fillRect(window.viewScale * (obj.x - obj.unitsize / 2), window.viewScale * (obj.y - obj.unitsize / 2), window.viewScale * obj.unitsize, window.viewScale * obj.unitsize);    
}
function DrawBoard()
{
    var ctx = window.ctx;
    //clear canvas
    ctx.clearRect(0, 0, window.boardWidth * window.viewScale, window.boardHeight * window.viewScale)

    
    //draw bases
    ctx.fillStyle = window.baseOne.colorstring;
    DrawRect(window.baseOne)
    DrawRect(window.baseTwo)
    
    //draw resources
    for(var i = 0; i < window.resources.length; i++) {
        ctx.fillStyle = window.resources[i].colorstring;
        DrawRect(window.resources[i]);
    }

    //draw units
    for(var i = 0; i < window.units.length; i++) {
        ctx.fillStyle = window.units[i].colorstring;
        DrawRect(window.units[i]);
    }    

    //draw attacks
    ctx.lineWidth = 1;
    for(var i = 0; i < window.Lines.length; i++)
    {
        ctx.beginPath();
        if(window.Lines[i].team == window.baseOne.team)
        {
            ctx.strokeStyle = window.teamColors[0];
        }
        else
        {
            ctx.strokeStyle = window.teamColors[1];
        }
        //TODO: implement fade
        var fade = (1 - Math.max(window.tick - window.Lines[i].startTick, 0)/window.attackFadeTicks); 
        ctx.moveTo(window.viewScale * window.Lines[i].fromx, window.viewScale * window.Lines[i].fromy);
        ctx.lineTo(window.viewScale * window.Lines[i].tox, window.viewScale * window.Lines[i].toy);
        ctx.stroke();
    }

    for(var i = 0; i < window.Explosions.length; i++) {
        ctx.beginPath();
        var fade = (1 - Math.max(window.tick - window.Explosions[i].startTick, 0)/window.explosionFadeTicks); 
        ctx.fillStyle = 'rgba(' + window.Explosions[i].r + ',' + window.Explosions[i].g + ', ' + window.Explosions[i].b + ', ' + fade + ')';
        DrawRect(window.Explosions[i]);
    }  
}
function Update()
{

    warplan = new Warplan(window.baseOne, window.baseTwo, window.StartTick, window.resources)
    updatedPlan = window.baseOne.AI.Execute(warplan);
    ParseWarPlan(window.baseOne, updatedPlan, false);
    
    warplan2 = new Warplan(window.baseTwo, window.baseOne, window.StartTick, window.resources)
    updatedPlan2 = window.baseTwo.AI.Execute(warplan2);
    ParseWarPlan(window.baseTwo, updatedPlan2, false);

    CheckResources();

    Cleanup();
    GenerateResources();
    UpdateScoreboard();
    DrawBoard();
    if((new Date()).getTime() - window.StartTime > 25 * 60 * 1000)
    {
        window.isAlive = false;
    }
    if(window.isAlive)
    {
        window.tick = window.tick + 1;
        setTimeout(function(){Update();}, window.tickDelay);
    }
    else
    {
        tryAgain();
    }
}

function runWar()
{
	CreateGlobals();
	Update();
}