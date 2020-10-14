// DOM elements
const canvas = document.getElementById("main-canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Physical/simulation constants
const PARTICLE_RADIUS = 32;
const PARTICLE_RADIUS_SQUARED = PARTICLE_RADIUS * PARTICLE_RADIUS;
const PARTICLE_MASS = 70;
const GAS_CONSTANT = 2000;
const REST_DENSITY = 1000;
const VISCOSITY = 250;
const TIMESTEP = 1 / 60;
const GRAVITY = 900;
const BORDER_COR = 0.5;

// Kernel constants
const POLY6 = 315 / (64 * Math.PI * Math.pow(PARTICLE_RADIUS, 9));
const SPIKY_GRADIENT = 45 / (Math.PI * Math.pow(PARTICLE_RADIUS, 6));
const VISC_LAPLACIAN = 45 / (Math.PI * Math.pow(PARTICLE_RADIUS, 6));

// Dynamic elemnts
const particles = [];

// Kernels for SPH
const densityKernel = function(distanceSquared) {
    return POLY6 * Math.pow(PARTICLE_RADIUS * PARTICLE_RADIUS - distanceSquared, 3)
};

const pressureKernelGradient = function(distance) {
    return SPIKY_GRADIENT * Math.pow(PARTICLE_RADIUS - distance, 2);
}

const viscosityKernelLaplacian = function(distance) {
    return VISC_LAPLACIAN * (PARTICLE_RADIUS - distance);
};

const calcDensityPressure = function() {

    for(let particle of particles) {
        
        particle.density = 0;
        for(let other of particles) {
        
            if(particle === other) continue;
            let dx = other.x - particle.x;
            let dy = other.y - particle.y;
            let distSq = dx * dx + dy * dy;

            if(distSq < PARTICLE_RADIUS_SQUARED) {
                console.log("t");
                particle.density += PARTICLE_MASS * densityKernel(distSq);
            }

        }

        particle.pressure = GAS_CONSTANT * (particle.density - REST_DENSITY);

    }

};

const calcForces = function() {

    for(let particle of particles) {

        let fPressureX = 0;
        let fPressureY = 0;

        let fViscosityX = 0;
        let fViscosityY = 0;

        for(let other of particles) {

            if(particle === other) continue;

            let dx = other.x - particle.x;
            let dy = other.y - particle.y;
            let dist = Math.sqrt(dx * dx + dy * dy);

            if(dist < PARTICLE_RADIUS) {
                
                let fPressureMagnitude = PARTICLE_MASS * (particle.pressure + other.pressure) / (2 * other.pressure) * pressureKernelGradient(dist);
                fPressureX += (-dx / dist) * fPressureMagnitude;
                fPressureY += (-dy / dist) * fPressureMagnitude;

                let fViscosityMagnitude = VISCOSITY * PARTICLE_MASS / other.pressure * viscosityKernelLaplacian(dist);
                fViscosityX += (other.dx - particle.dx) * fViscosityMagnitude;
                fViscosityY += (other.dy - particle.dy) * fViscosityMagnitude;

            }

        }

        // Factor in forces
        particle.ddx += (fViscosityX + fPressureX) / particle.density;
        particle.ddy += (fViscosityX + fPressureX) / particle.density + GRAVITY;

    }

};

const integrate = function() {

    for(let particle of particles) {
        
        // Integrate velocity/acceleration
        particle.dx += particle.ddx * TIMESTEP;
        particle.dy += particle.ddy * TIMESTEP;
        let nextX = particle.x + particle.dx * TIMESTEP;
        let nextY = particle.y + particle.dy * TIMESTEP;
        
        // Reset acceleration as this must be recalculated every frame
        particle.ddx = 0;
        particle.ddy = 0;

        // Boundaries
        if(nextX < PARTICLE_RADIUS) {
            nextX = PARTICLE_RADIUS;
            particle.dx *= -BORDER_COR;   
        }

        if(nextY < PARTICLE_RADIUS) {
            nextY = PARTICLE_RADIUS;
            particle.dy *= -BORDER_COR;
        }

        if(nextX > canvas.width - PARTICLE_RADIUS) {
            nextX = canvas.width - PARTICLE_RADIUS;
            particle.dx *= -BORDER_COR;
        }

        if(nextY > canvas.height - PARTICLE_RADIUS) {
            nextY = canvas.height - PARTICLE_RADIUS;
            particle.dy *= -BORDER_COR;
        }

        particle.x = nextX;
        particle.y = nextY;

    }
};

const step = function() {
    calcDensityPressure();
    calcForces();
    integrate();
};

const draw = function() {

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ffff00";
    for(let particle of particles) {
        ctx.fillRect(particle.x - 2, particle.y - 2, 4, 4);
    }

};

const run = function() {
    draw();
    step();
    requestAnimationFrame(run);
};

canvas.addEventListener("click", event => {
    particles.push({
        x: event.offsetX,
        y: event.offsetY,
        dx: 0,
        dy: 0,
        ddx: 0,
        ddy: 0
    });
});

run();