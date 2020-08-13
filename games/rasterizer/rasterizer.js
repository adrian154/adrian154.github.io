"use strict";

const outCanvas = document.getElementById("output");
const outCtx = outCanvas.getContext("2d");

// Takes 2D points, draws to an imagedata
const drawTriangle = function(point0, point1, point2, imageData, r, g, b) {

    // Sort by Y
    // We could sort by X too, this is totally arbitrary
    // The idea is to split the triangle into two along an axis 
    // Order is ascending
    let tmp;
    if(point1[1] < point0[1]) { tmp = point0; point0 = point1; point1 = tmp; }
    if(point2[1] < point1[1]) { tmp = point1; point1 = point2; point2 = tmp; }
    if(point1[1] < point0[1]) { tmp = point0; point0 = point1; point1 = tmp; }

    // Draw "top" half
    // Always starts at point 0
    let x0 = point0[0]; // x0 will go towards point1 (which sits on the split line)
    let x1 = point0[0]; // x1 will go towards point2
    for(let y = point0[1]; y < point1[1]; y++) {

        // Fill scanline
        let min = x0 < x1 ? x0 : x1;
        let max = x0 < x1 ? x1 : x0;
        for(let x = min; x <= max; x++) {

            // Fill...
            if(x < 0 || y < 0 || x > imageData.width || y > imageData.height) continue;

            let idx = Math.floor(y * imageData.width + x) * 4;
            imageData.data[idx] = r;
            imageData.data[idx + 1] = g;
            imageData.data[idx + 2] = b;
            imageData.data[idx + 3] = 255;

        }

        // Update x's
        let t1 = (y - point0[1]) / (point1[1] - point0[1]);
        let t2 = (y - point0[1]) / (point2[1] - point0[1]);
        x0 = point0[0] + t1 * (point1[0] - point0[0]);
        x1 = point0[0] + t2 * (point2[0] - point0[0]);

    }

    let x2 = x0;
    let x3 = x1;
    for(let y = point1[1]; y < point2[1]; y++) {

        // Fill scanline
        let min = x2 < x3 ? x2 : x3;
        let max = x2 < x3 ? x3 : x2;
        for(let x = min; x <= max; x++) {
            if(x < 0 || y < 0 || x > imageData.width || y > imageData.height) continue;
            let idx = Math.floor(y * imageData.width + x) * 4;
            imageData.data[idx] = r;
            imageData.data[idx + 1] = g;
            imageData.data[idx + 2] = b;
            imageData.data[idx + 3] = 255;  
        }

        // Lerp, again
        let t = (y - point1[1]) / (point2[1] - point1[1])
        x2 = x0 + t * (point2[0] - x0);
        x3 = x1 + t * (point2[0] - x1);

    }

};

const render = function() {

};

let r = () => Math.floor(Math.random() * 256);
let rp = () => [r(), r()];

let imd = outCtx.getImageData(0, 0, outCanvas.width, outCanvas.height);
console.log(imd);
let p0 = rp();
let p1 = rp();
let p2 = rp();
drawTriangle(p0, p1, p2, imd, outCanvas.width, 0, 0, 0);
outCtx.putImageData(imd, 0, 0);