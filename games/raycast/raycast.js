const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

// Helper funcs
const radToDeg = (radians) => radians * 180 / Math.PI;
const degToRad = (degrees) => degrees * Math.PI / 180;
const FOVToFocal = (degrees) => canvas.width / (2 * Math.tan(degToRad(degrees) / 2));
const floor = (x) => x < 0 ? Math.ceil(x) : Math.floor(x);
//const nextGridPos = (x, dir) => (dir < 0 ? Math.floor : Math.ceil)((x + 0.001) / tileSize) * tileSize;
const nextGridPos = (x, dir) => (Math.floor(x / tileSize) + (dir > 0 ? 1 : -0.0001)) * tileSize;

// Constants
const tileSize = 50;
const minimapScale = 1;

// Map
const MAP_WIDTH = 5;
const MAP_HEIGHT = 5;
const map = [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0]
];

// Initialize globals
// NOTE - Don't copy this. Lots of global state is bad practice!!!
let posX = 30;
let posY = 30;
let viewAngle = Math.random() * 2 * Math.PI;
let FOV = 60;
let focalLength = FOVToFocal(FOV);
const controls = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    lookLeft: false,
    lookRight: false
};

// Trace the ray
const traceRay = function(start, ray, debug) {

    let tileX = Math.floor(start[0] / tileSize);
    let tileY = Math.floor(start[1] / tileSize);
    let cur = [...start]; // wasteful shallow copy but whatever

    let yPerX = ray[1] / ray[0];
    let xPerY = ray[0] / ray[1];

    if(debug)
        console.log(`start=(${tileX}, ${tileY})`);

    while(true) {

        if(debug) {
            console.log(`cur=(${cur[0]}, ${cur[1]}), tile=(${tileX}, ${tileY})`);
        }

        let nextHorizY = nextGridPos(cur[1], Math.sign(ray[1]));
        let nextHorizX = (nextHorizY - cur[1]) * xPerY + cur[0];

        let nextVertX = nextGridPos(cur[0], Math.sign(ray[0]));
        let nextVertY = (nextVertX - cur[0]) * yPerX + cur[1];
        if(debug) console.log(cur[0], Math.sign(ray[0]));

        let nextHorizDistSq = (nextHorizX - cur[0]) * (nextHorizX - cur[0]) + (nextHorizY - cur[1]) * (nextHorizY - cur[1]); 
        let nextVertDistSq = (nextVertX - cur[0]) * (nextVertX - cur[0]) + (nextVertY - cur[1]) * (nextVertY - cur[1]);

        //console.log(`horizontal=(${nextHorizX}, ${nextHorizY}), sqDist=${nextHorizDistSq}`);
        //console.log(`vertical=(${nextVertX}, ${nextVertY}), sqDist=${nextVertDistSq}`);

        if(isFinite(nextHorizDistSq) && (!isFinite(nextVertDistSq) || nextHorizDistSq < nextVertDistSq)) {
            if(debug) console.log("going horizontal" + nextHorizDistSq);
            cur[0] = nextHorizX;
            cur[1] = nextHorizY;
            tileY += Math.sign(ray[1]);
        } else {
            if(debug) console.log("going vertical, d=" + nextVertDistSq);
            cur[0] = nextVertX;
            cur[1] = nextVertY;
            tileX += Math.sign(ray[0]);
        }

        if(tileX < 0 || tileY < 0 || tileX >= MAP_WIDTH || tileY >= MAP_HEIGHT) break;

        if(map[tileX][tileY]) {
            if(debug) {
                console.log(`final=(${tileX}, ${tileY}), position=(${cur[0]}, ${cur[1]})`)
            }
            let dx = cur[0] - start[0];
            let dy = cur[1] - start[1];
            return Math.sqrt(dx * dx + dy * dy);
        }

    }

    return Infinity;

};

// Draw the scene
const draw = function() {

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";

    let debugDist;
    for(let screenX = 0; screenX < canvas.width; screenX++) {

        // interpolate angle
        let angle = degToRad((screenX / canvas.width) * FOV - FOV / 2) + viewAngle;

        // ray
        let dx = Math.cos(angle);
        let dy = Math.sin(angle);
        
        let dist = traceRay([posX, posY], [dx, dy]);
        if(screenX == Math.floor(canvas.width / 2)) debugDist = dist;
        if(isFinite(dist)) {
            let width = tileSize * focalLength / dist/ 5;
            let color = 2500 / dist;
            ctx.fillStyle = `rgb(${color},${color},${color})`;
            ctx.fillRect(screenX, (canvas.height - width) / 2, 1, width);
        }

    }

    ctx.fillStyle = "#ff0000";
    for(let x = 0; x < map.length; x++) {
        for(let y = 0; y < map[x].length; y++) {

            if(map[x][y])
                ctx.fillRect(x * tileSize * minimapScale, y * tileSize * minimapScale, tileSize * minimapScale, tileSize * minimapScale);

        }
    }

    ctx.fillStyle = "#00ff00";
    ctx.font = "24px Arial";
    ctx.fillText(`(${posX.toFixed(2)}, ${posY.toFixed(2)})`, 2, 24);
    ctx.fillText(viewAngle.toFixed(2), 2, 48);

    ctx.beginPath();
    ctx.arc(posX * minimapScale, posY * minimapScale, 3, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "#00ff00";
    ctx.beginPath();
    ctx.moveTo(posX * minimapScale, posY * minimapScale);
    ctx.lineTo(posX * minimapScale + Math.cos(viewAngle) * debugDist * minimapScale, posY * minimapScale + Math.sin(viewAngle) * debugDist * minimapScale);
    ctx.closePath();
    ctx.stroke();

};

// Update player position
const update = function() {

    if(controls.forward) {
        posX += Math.cos(viewAngle);
        posY += Math.sin(viewAngle);
    }

    if(controls.backward) {
        posX -= Math.cos(viewAngle);
        posY -= Math.sin(viewAngle);
    }

    if(controls.lookLeft) {
        viewAngle -= 0.03;
    }

    if(controls.lookRight) {
        viewAngle += 0.03;
    }

};

// Game loop
const run = function() {
    draw();
    update();
    requestAnimationFrame(run);
};

// Add event listeners
const handleKey = (key, state) => {
    console.log(key, state);
    switch(key) {
        case "w": controls.forward = state; break;
        case "a": controls.left = state; break;
        case "s": controls.backward = state; break;
        case "d": controls.right = state; break;
        case "h": controls.lookLeft = state; break;
        case "k": controls.lookRight = state; break;
    }
};

window.addEventListener("keydown", (event) => handleKey(event.key, true));
window.addEventListener("keyup", (event) => handleKey(event.key, false));

run();