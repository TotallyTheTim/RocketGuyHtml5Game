let c = document.getElementById("canvas");
let ctx = c.getContext("2d");
let groundLevel = 50;
let naturalColor = '#075';
let smoothness = 5;
let framesInAir = 0;
let currentCrouchStep = 0;
let crouchSteps = 15;
let difficulty = 0;
let score = 0;
let keys = {
    active: {
        left: false,
        up: false,
        down: false,
        right: false
    },
    size: {
        xy: 15,
        margin: 5
    },
    colors: {
        active: '#393',
        inactive: '#565'
    }
};
let objective = [];

let fps = 60;

let player = {
    pos : {
        x : 20,
        y: groundLevel,
        fromRight: 0,
        fromGround: 0
    },
    speed : {
        x : 0,
        y : 0,
        max: 4,
        gravity: .4
    },
    size : {
        x : 0,
        y : 0,
        crouching: {
            x: 100,
            y: 50
        },
        normal: {
            x: 50,
            y: 100
        }
    },
    color: '#000'
};

player.size.x = player.size.normal.x;
player.size.y = player.size.normal.y;
addObj(2.5);

let interval = setInterval(frame, 1000/fps);

function addObj(speedstart = 2){

    if (score > 62000){
        difficulty=10;
    } else
    if (score > 25000){
        difficulty=9;
    } else
    if (score > 10000){
        difficulty=8;
    } else
    if (score > 4000){
        difficulty=7;
    } else
    if (score > 16000){
        difficulty=6;
    } else
    if (score > 6200){
        difficulty=5;
    } else
    if (score > 2500){
        difficulty=4;
    } else
    if (score > 1200){
        difficulty=3;
    } else
    if (score > 500){
        difficulty=2;
    } else
    if (score > 200){
        difficulty=1;
    }

    let colours = ['#ff0','#ffad00','#ff8031','#ff312a','#ff707a','#ff00a8','#d400ff', '#6700ff'];

    let obj = {
        color: colours[difficulty],
        speed: Math.random()*difficulty + speedstart,
        width: (Math.random()*difficulty + 2) * 5,
        height: (Math.random()*difficulty + 2) * 3,
        score: 0,
        y: 0,
        fromRight: -100
    };
    obj.score = Math.round(obj.speed * obj.width * obj.height)
    obj.y = Math.random()*(player.size.normal.y-obj.height/2) + obj.height/2
    objective.push(obj)
}

function frame() {
    ctx.strokeStyle = naturalColor;
    ctx.fillStyle = naturalColor;
    clear();
    drawGround();
    drawText();
    drawPlayer();
    calcPos();
    drawKeys();
    drawObjectives();
}

function drawObjectives() {
    for (let i = 0; i < objective.length; i++){
        ctx.fillStyle = '#000'
        ctx.fillStyle = objective[i].color;
        ctx.strokeStyle = '#000';
        ctx.strokeRect(c.offsetWidth - objective[i].fromRight - objective[i].width,c.offsetHeight - groundLevel -  objective[i].y,objective[i].width,objective[i].height);
        ctx.fillRect(c.offsetWidth - objective[i].fromRight - objective[i].width,c.offsetHeight - groundLevel -  objective[i].y,objective[i].width,objective[i].height);
        objective[i].fromRight += objective[i].speed;
        if (c.offsetWidth - objective[i].fromRight < -objective[i].width/2){
            score += objective[i].score;
            objective.splice(i, 1);
            addObj();
            i--
        } else //todo: hit registration
            if (objective[i].fromRight){

        }
    }
}

function drawText() {
    ctx.font = "15px consolas";
    ctx.fillText("SpeedX: " + player.speed.x,10,20);
    ctx.fillText("SpeedY: " + player.speed.y,10,35);
    ctx.fillText("FromGround: " + player.pos.fromGround,10,55);
    ctx.fillText("FromRight: " + player.pos.fromRight,10,70);
    ctx.fillText("SpeedY: " + player.speed.y,10,35);
    ctx.fillText("Score:" + score, c.offsetWidth - 190, 75)
    ctx.font = "35px consolas";
    ctx.fillText("RocketGuy", c.offsetWidth - 190, 45)
}

function calcPos() {
    player.pos.x += player.speed.x;
    player.pos.y += player.speed.y;

    player.pos.x = Math.round(player.pos.x);
    player.pos.y = Math.round(player.pos.y);

    let fromGround = player.pos.y - groundLevel;
    if (fromGround > 0){
        framesInAir++;
        player.speed.y = player.speed.y - (framesInAir * .05 * player.speed.gravity)
    } else {
        framesInAir = 0;
        player.pos.y = groundLevel;
    }

    let difference = {
        x : player.size.crouching.x - player.size.normal.x,
        y : player.size.crouching.y - player.size.normal.y
    };
    if (keys.active.down){
        if (currentCrouchStep < crouchSteps){
            player.pos.x -=(difference.x / crouchSteps)/2;
            currentCrouchStep++
        }
    } else if (currentCrouchStep > 0){
        player.pos.x +=(difference.x / crouchSteps)/2;
        currentCrouchStep--
    }
    player.size.x = player.size.normal.x + (difference.x * (currentCrouchStep/ crouchSteps));
    player.size.y = player.size.normal.y + (difference.y * (currentCrouchStep/ crouchSteps));

    player.pos.fromGround = (player.pos.y - groundLevel);
    player.pos.fromRight = c.offsetWidth - player.pos.x - player.size.x;

}

function drawGround() {
    ctx.moveTo(0, c.offsetHeight - groundLevel)
    ctx.lineTo(c.offsetWidth, c.offsetHeight - groundLevel);
    ctx.stroke();
}

function drawKeys() {
    let midX = c.offsetWidth/2;
    let bottom = c.offsetHeight-keys.size.margin - keys.size.xy;
    if (player.speed.x !== 0){
        player.speed.x = player.speed.x / (1 + 1/smoothness);
        player.speed.x = Math.round(player.speed.x * 1000) / 1000
        if (player.speed.x > -0.01 && player.speed.x < 0 ){
            player.speed.x = 0;
        } else if ((player.speed.x < 0.01 && player.speed.x > 0 )){
            player.speed.x = 0;
        }
    }
    if (player.speed.y !== 0){
        player.speed.y = player.speed.y / (1 + 1/smoothness);
        player.speed.y = Math.round(player.speed.y * 1000) / 1000
        if (player.speed.y > -0.01 && player.speed.y < 0 ){
            player.speed.y = 0;
        } else if ((player.speed.y < 0.01 && player.speed.y > 0 )){
            player.speed.y = 0;
        }
    }
    // down
    if (keys.active.down){ctx.fillStyle = keys.colors.active} else { ctx.fillStyle = keys.colors.inactive
        addForce(3);}
    ctx.fillRect(midX - keys.size.xy/2, bottom, keys.size.xy, keys.size.xy)
    // up
    if (keys.active.up){ctx.fillStyle = keys.colors.active} else { ctx.fillStyle = keys.colors.inactive
        addForce(1);}
    ctx.fillRect(midX - keys.size.xy/2, bottom - keys.size.xy - keys.size.margin, keys.size.xy, keys.size.xy)
    // left
    if (keys.active.left){ctx.fillStyle = keys.colors.active} else { ctx.fillStyle = keys.colors.inactive
        addForce(2);}
    ctx.fillRect(midX - keys.size.xy/2 - keys.size.xy - keys.size.margin, bottom, keys.size.xy, keys.size.xy)
    // right
    if (keys.active.right){ctx.fillStyle = keys.colors.active} else { ctx.fillStyle = keys.colors.inactive
        addForce(4);}
    ctx.fillRect(midX - keys.size.xy/2 + keys.size.xy + keys.size.margin, bottom, keys.size.xy, keys.size.xy)
}

function addForce(direction) {
    switch (direction) {
        case 1:
            player.speed.y = player.speed.y - player.speed.max/5/(1 + 1/smoothness);
            break;
        case 2:
            player.speed.x = player.speed.x + player.speed.max/5/(1 + 1/smoothness);
            break;
        case 3:
            player.speed.y = player.speed.y + player.speed.max/5/(1 + 1/smoothness);
            break;
        case 4:
            player.speed.x = player.speed.x - player.speed.max/5/(1 + 1/smoothness);
            break;
    }
}

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.pos.x,c.offsetHeight-player.pos.y-player.size.y,player.size.x,player.size.y);
}

function clear() {
    ctx.clearRect(0, 0, c.offsetWidth, c.offsetHeight);
}


window.addEventListener("keydown", down,false);

window.addEventListener("keyup", up,false);


function down(e) {
    let code = e.keyCode;
    switch (code) {
        case 37:case 65: keys.active.left = true; break; //Left & A
        case 38:case 87: keys.active.up = true; break; //Up & W
        case 39:case 68: keys.active.right = true; break; //Right & D
        case 40:case 83: keys.active.down = true; break; //Down & S
    }
}

function up(e) {
    let code = e.keyCode;
    switch (code) {
        case 37:case 65: keys.active.left = false; break; //Left & A
        case 38:case 87: keys.active.up = false; break; //Up & W
        case 39:case 68: keys.active.right = false; break; //Right & D
        case 40:case 83: keys.active.down = false; break; //Down & S
    }
}
