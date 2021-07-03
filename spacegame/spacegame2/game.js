// DISCLAIMER: THIS CODE STINKS! Readers may be compelled to gouge out their own eyes.
// You have been warned.

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// physics constants
const GRAVITY = 2.0;
const BOUNCINESS = 0.7;
const DT = 1 / 60;
const ACCELERATION = 5;
const GAME_STATE = {
    TITLE_SCREEN: 0,
    RUNNING: 1,
    DEAD: 2,
    PAUSE: 3
};

let mouse = {
    x: 0,
    y: 0,
    down: false
};

// various game state
let state = GAME_STATE.TITLE_SCREEN;
let planets = null;
let particles = null;
let player = null;
let ticks = 0;

const resetGame = () => {
    
    // generate planets
    planets = [];
    for(let i = 0; i < 15; i++) {
        let radius = Math.random() * 10 + 10;
        planets.push({
            x: Math.random() * (canvas.width - radius) + radius / 2,
            y: Math.random() * (canvas.height - radius) + radius / 2,
            dx: Math.random() * 30 - 15,
            dy: Math.random() * 30 - 15,
            ddx: 0,
            ddy: 0,
            radius: radius,
            mass: radius * radius
        });
    }

    player = planets[0];
    player.heading = 0;
    player.radius = 16;
    player.fuel = 100;
    player.isPlayer = true;

    // reset all else
    particles = [];

};

const step = () => {

    // reset accel
    for(const planet of planets) {
        planet.ddx = 0;
        planet.ddy = 0;
    }

    // accumulate accelerations
    /*for(let i = 0; i < planets.length; i++) {
        const planet0 = planets[i];
        for(let j = i + 1; j < planets.length; j++) {
            const planet1 = planets[j];
            const dx = planet1.x - planet0.x;
            const dy = planet1.y - planet0.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const gravityForce = GRAVITY * planet0.mass * planet1.mass / (dist * dist);
            planet0.ddx += gravityForce / planet0.mass * dx / dist;
            planet0.ddy += gravityForce / planet0.mass * dy / dist;
            planet1.ddx -= gravityForce / planet1.mass * dx / dist;
            planet1.ddy -= gravityForce / planet1.mass * dy / dist;
        }
    }*/

    // move, taking into account boundaries
    for(const planet of planets) {

        planet.dx += planet.ddx * DT;
        planet.dy += planet.ddy * DT;
        let nextX = planet.x + planet.dx * DT;
        let nextY = planet.y + planet.dy * DT;

        // prevent collisions
        for(const otherPlanet of planets) {
            if(otherPlanet == planet) continue;
            const dx = otherPlanet.x - planet.x;
            const dy = otherPlanet.y - planet.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const minDist = planet.radius + otherPlanet.radius;
            if(dist < minDist) {
                let overlap = (dist - minDist) / 2;
                nextX -= overlap * dx / dist;
                nextY -= overlap * dy / dist;
            }
        }


        if(nextX + planet.radius > canvas.width) {
            nextX = canvas.width - planet.radius;
            planet.dx *= -BOUNCINESS;
        }
        
        if(nextY + planet.radius > canvas.height) {
            nextY = canvas.height - planet.radius;
            planet.dy *= -BOUNCINESS;
        }

        if(nextX < planet.radius) {
            nextX = planet.radius;
            planet.dx *= -BOUNCINESS;
        }

        if(nextY < planet.radius) {
            nextY = planet.radius;
            planet.dy *= -BOUNCINESS;
        }

        planet.x = nextX;
        planet.y = nextY;

    }

    console.log("OOEY");

};

const draw = () => {

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for(const planet of planets) {
        ctx.fillStyle = planet.isPlayer ? "#ff0000" : "#ffffff";
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
    }

};

const run = () => {
    draw();
    step();
    requestAnimationFrame(run);
};

// handle input
window.addEventListener("mousemove", (event) => {
    const box = canvas.getBoundingClientRect();
    mouse.x = event.clientX - box.left;
    mouse.y = event.clientY - box.top;
});

window.addEventListener("mousedown", (event) => {
    mouse.down = true;
});

window.addEventListener("mouseup", (event) => {
    mouse.up = true;
});

window.addEventListener("keydown", (event) => {
    // todo
});

resetGame();
run();