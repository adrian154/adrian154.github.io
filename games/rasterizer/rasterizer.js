"use strict";

const outCanvas = document.getElementById("output");
const outCtx = outCanvas.getContext("2d");

const dot = function(vec0, vec1) {
    return vec0[0] * vec1[0] + vec0[1] * vec1[1];
}

// Takes 2D points, draws to an imagedata
const drawTriangle = function(point0, point1, point2, imageData, r, g, b) {

    // Find bounding box
    let min = [
        Math.min(Math.min(point0[0], point1[0]), point2[0]),
        Math.min(Math.min(point0[1], point1[1]), point2[1])
    ];
    let max = [
        Math.max(Math.max(point0[0], point1[0]), point2[0]),
        Math.max(Math.max(point0[1], point1[1]), point2[1])
    ];

    for(let x = min[0]; x < max[0]; x++) {
        for(let y = min[1]; y < max[1]; y++) {

            // Check if point is in triangle by calculating barycentric coordinates

            // Get index, fill
            let idx = Math.floor(y * imageData.width + x) * 4;
            imageData.data[idx] = r;
            imageData.data[idx + 1] = g;
            imageData.data[idx + 2] = b;
            imageData.data[idx + 3] = 255;

        }
    }

};

const render = function() {

};

let r = () => Math.floor(Math.random() * 512);
let rp = () => [r(), r()];

outCtx.clearRect(0, 0, outCanvas.width, outCanvas.height);

let imd = outCtx.getImageData(0, 0, outCanvas.width, outCanvas.height);
console.log(imd);
let p0 = rp();
let p1 = rp();
let p2 = rp();
drawTriangle(p0, p1, p2, imd, outCanvas.width, 0, 0, 0);
outCtx.putImageData(imd, 0, 0);

outCtx.beginPath();
outCtx.moveTo(p0[0], p0[1]);
outCtx.lineTo(p1[0], p1[1]);
outCtx.lineTo(p2[0], p2[1]);
outCtx.closePath();
outCtx.fill();