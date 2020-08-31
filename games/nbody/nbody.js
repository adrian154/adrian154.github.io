const canvas = document.getElementById("output-canvas");
const ctx = canvas.getContext("2d");

// universal gravity constant, adjusts gravity strength linearly
const GRAVITY_CONST = 10;
const TIMESTEP = 1 / 60;

// Simulation functions
const init = function() {

    let objects = [];

    for(let i = 0; i < 10; i++) {
        objects.push({
            position: [
                Math.random() * canvas.width - canvas.width / 2,
                Math.random() * canvas.height - canvas.height / 2
            ],
            velocity: [
                0,
                0
            ],
            mass: 100
        });
    }

    return objects;

};

// Update positions
const step = function(objects) {

    for(let i = 0; i < objects.length; i++) {

        let object = objects[i];
        let force = [0, 0];

        for(let j = 0; j < objects.length; j++) {

            // Don't calculuate attraction to self
            if(i == j) continue;

            let object2 = objects[j];
            let d = sub(object2.position, object.position);

            let dist = length(d); // the force formula doesn't make use of the exact length (only the squared length); however, we need this to calculate the normal vector anyway
            let F = GRAVITY_CONST * object.mass * object2.mass / (dist * dist); // F = magnitude of force
            let fVec = mul(div(d, dist), F); // add force contribution
            force = add(force, fVec);

        }

        // Update velocity
        object.velocity = add(object.velocity, mul(force, TIMESTEP));

        // Update position
        let futurePosition = add(object.position, mul(object.velocity, TIMESTEP));

        // Collision sweep pass
        

        /*temporary*/object.position = futurePosition;

    }

};

// Draw objects
const draw = function(objects) {

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000000";

    ctx.translate(canvas.width / 2, canvas.height / 2);
    let transform = ctx.getTransform();

    for(let object of objects) {

        ctx.translate(object.position[0], object.position[1]);

        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();

        ctx.setTransform(transform);

    }

    ctx.resetTransform();

};

// Main loop
const run = function() {
    draw(objects);
    step(objects);
    requestAnimationFrame(run);
};

// Start the loop
let objects = init();
run();