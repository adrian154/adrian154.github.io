// Points of the triangle
const points = [];

const outCanvas = document.getElementById("output");
const outCtx = outCanvas.getContext("2d");
outCtx.font = "12px Consolas";

const dot = (vec0, vec1) => vec0[0] * vec1[0] + vec0[1] * vec1[1];

const calcBaryCoords = function(point, vert0, vert1, vert2) {

    // Make P into Q
    point[0] -= vert0[0];
    point[1] -= vert0[1];

    let v1 = [vert1[0] - vert0[0], vert1[1] - vert0[1]];
    let v2 = [vert2[0] - vert0[0], vert2[1] - vert0[1]];

    // Precalculate dot products to make things easier
    let A = dot(point, v1);
    let B = dot(point, v2);
    let c = dot(v1, v1);
    let d = dot(v1, v2);
    let e = dot(v2, v2);

    let u = (B * d) / (A * e  * (d * d - e * c));
    let v = (A - u * c) / d;

    return [u, v];

};

const animate = function() {

    outCtx.clearRect(0, 0, outCanvas.width, outCanvas.height)

    let topText = "";
    if(points.length == 3) {

        outCtx.beginPath();
        outCtx.moveTo(points[0][0], points[0][1]);
        outCtx.lineTo(points[1][0], points[1][1]);
        outCtx.lineTo(points[2][0], points[2][1]);
        outCtx.closePath();

        outCtx.globalAlpha = 0.25;
        outCtx.fill();

        outCtx.globalAlpha = 1.0;
        outCtx.stroke();

    } else {
        topText = `Click to add points (${3 - points.length} to go)`;
    }

    outCtx.fillText(topText, 20, 20);

    // Always draw points on top
    for(let point of points) {
        outCtx.beginPath();
        outCtx.arc(point[0], point[1], 5, 0, 2 * Math.PI, false);
        outCtx.closePath();
        outCtx.fill();
    }

    requestAnimationFrame(animate);

};

outCanvas.addEventListener("click", event => {

    let rect = outCanvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    if(points.length < 3) points.push([x, y]);

});

animate();