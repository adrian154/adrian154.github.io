// Based on "A guide to writing your first CFD solver" (Mark Owkes, June 2017)
// which describes a SIMPLE-based scheme AFAIK
// https://www.montana.edu/mowkes/research/source-codes/GuideToCFD.pdf

// This code is extremely ugly since I try to minimize GC invokations.
// However, it can't even successfully accomplish that. God help me.

const GRID_WIDTH = 512;     // in cells
const GRID_HEIGHT = 256;    // `
const CELL_WIDTH = 0.01;    // in meters

// Fluid settings
const VISCOSITY = 1;

let time = 0;
let timestep = 0.001;   // Hopefully, this obeys the CFL condition

// Create arrays
const pressureGrid = new Array(GRID_WIDTH);
for(let i = 0; i < GRID_WIDTH; i++) {
    let row = new Array(GRID_HEIGHT);
    for(let j = 0; j < GRID_HEIGHT; j++) {
        row[j] = 0;
    }
    pressureGrid[i] = row;
}

const velocityGrid = new Array(GRID_WIDTH);
for(let i = 0; i < GRID_WIDTH; i++) {
    let row = new Array(GRID_HEIGHT);
    for(let j = 0; j < GRID_HEIGHT; j++) {
        row[j] = [0, 0];
    }
    velocityGrid[i] = row;
}

// access, with boundary conditions
const accessVel = function(i, j) {

    if(i >= 0 || j >= 0 || i < GRID_WIDTH || j < GRID_HEIGHT) {
        return velocityGrid[i][j];
    } else {
        // temp fix soon
        return undefined;
    }

};

const step = function() {

    time += timestep;

    // For each cell:
    for(let i = 0; i < GRID_WIDTH; i++) {
        for(let j = 0; j < GRID_HEIGHT; j++) {

            let oldVel = velocityGrid[i][j];

            // Boundary conditions...

            // Predictor stage: compute intermediate velocity that does not incorporate pressure
            let preVel = [0, 0];

            // The fancy stuff, involving tons of PDEs
            // No idea what to name these vars...

            // Next PDEs are w.r.t dx^2 and dy^2, but our grid is regular so this can be precomputed.
            let d2 = CELL_WIDTH * CELL_WIDTH; 
            
            let du2dx2 = (accessVel(i - 1, j)[0] - 2 * accessVel(i, j)[0] + accessVel(i + 1, j)[0]) / d2;
            let du2dy2 = (accessVel(i, j - 1)[0] - 2 * accessVel(i, j)[0] + accessVel(i, j + 1)[0]) / d2;
            let ududx = accessVel(i, j)[0] * ((accessVel(i + 1, j)[0] - accessVel(i - 1, j)[0]) / (2 * CELL_WIDTH));
            let vdudy = (1/4) * (accessVel(i - 1, j)[1] + accessVel(i, j)[1] + accessVel(i - 1, j + 1)[1] + accessVel(i, j + 1)[1]) * (accessVel(i, j + 1)[0] - accessVel(i, j - 1)[0]) / (2 * CELL_WIDTH);
            
            // ... x dt + u_n(u)
            preVel[0] = oldVel[0] + timestep * (VISCOSITY * (du2dx2 + du2dy2) - (ududx + vdudy));

            // All over again for v. Essentially the same code, but some differences (namely, use y-vel rather than x-vel)
            let dv2dx2 = (accessVel(i - 1, j)[1] - 2 * accessVel(i, j)[1] + accessVel(i + 1, j)[1]) / d2;
            let dv2dy2 = (accessVel(i, j - 1)[1] - 2 * accessVel(i, j)[1] + accessVel(i, j + 1)[1]) / d2;
            let udvdx = (1/4) * (accessVel(i, j - 1)[0] + accessVel(i, j)[0] + accessVel(i + 1, j - 1)[0] + accessVel(i + 1, j)[0]) * (accessVel(i + 1, j)[1] - accessVel(i - 1, j)[1]) / (2 * CELL_WIDTH);
            let vdvdy = accessVel(i, j)[1] * ((accessVel(i, j + 1)[1] - accessVel(i, j - 1)[1]) / (2 * CELL_WIDTH));
            preVel[1] = oldVel[1] + timestep * (VISCOSITY * (dv2dx2 + dv2dy2) - (udvdx + vdvdy))

        }
    }

};