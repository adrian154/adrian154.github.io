# 1: Triangle Drawing

There's two ways you can implement 2D triangle rasterization. For both ways, our functions will have the same "signature":

```js
drawTriangle = function(point0, point1, point2, imageData, r, g, b);
```

## Method A

The first way is to split the triangle into some scanlines and sweep. The code for this method is quite verbose, but it's easy to understand conceptually. The idea is:

1. Sort the triangle's points along one axis, we'll do Y since it feels easier to understand.
2. Start from the top- or bottom-most point. Use linear interpolation to find the the correct start and end X for the scanline at a given Y-level.
3. Increment Y (working our way up each scanline)

In practice, it's not so simple; the triangle has to be split in half for this method to work. Here's the code:

```js
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

    // Bottom half
    // This could probably be done in a loop, but I can't be bothered
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
```

## Method B

We could also brute force this method, with something like this:

```
// (pseudo-code)
for(point in boundingBoxOfTriangle) {
    if(insideTriangle(point)) {
        fill();
    }
}
```

This seems pretty crappy until you realize that Method A can't really be run in parallel, whereas this method definitely can be. This algorithm is especially suited for the GPU, which can run thousands of threads in parallel. My demo is single-threaded for the sake of simplicity, but I'll still implement this algorithm since it introduces another concept that will pop up again, barycentric coordinates.

### How do we know if a point is inside a triangle?

This will seem like a tangent (hehe), but it'll all become relevant soon.

The three points of a triangle define a 2D plane. You can describe any 2D plane by its basis vectors. You could use the sides of a triangle as basis vectors, thus creating a "barycentric coordinate space".

To visualize it, compare it to a simple Cartesian coordinate space. In the Cartesian plane, you can get to any point by starting from the origin *O*, moving *x* distance along the *X* axis, then *y* distance in the direction of the *Y* axis, so we describe a point as a two-component vector: \[*x*, *y*\].

You can describe this mathematically. *X* and *Y* are our basis vectors; *O* is our origin, and *P* is the final point. *x* and *y* are scalars; together, they make up the two component vector that can then be translated into "real" coordinates.

```
X = [1, 0]
Y = [0, 1]
P = O + x * X + y * Y
```

In this case, it's a no-op; the input vector is the same as the output vector. However, if we change the basis vectors and origin, they will become different.

Let's go back to the triangle. To define our barycentric coordinate space, we need two basis vectors and an origin. Our origin can be any one of the vertices on the triangle; let's go with the arbitrary "first" one, which we'll call A. Our basis vectors can then be the two sides of the triangles adjacent to point A, AB and AC. In this coordinate space, any point on triangle ABC can be reached by walking *u* steps along AB, then *v* steps in the direction of AC.

Now, it's time for some math. We can use the formulation from earlier to describe this coordinate space like so:

```
P = A + u * AB + v * AC
```

We need to convert our Cartesian coordinates (P) to barycentric coordinates ([*u*, *v*]), meaning we need to solve for *u* and *v*. It's an equation of two unknowns, so we'll need to find another equation. Let's first orient the new space so that the origin is on A.

```
P = A + u * (B - A) + v * (C - A)
(P - A) = u * (B - A) + v * (C - A)
```

We'll refer to our new point, (P - A), as Q; the basis vectors will be V1 and V2.

```
// We need to solve for u and v. This process is really tedious.
// Start with this
Q = u * V1 + v * V2

// Dot by V1 for one equation, V2 for another
Q . V1 = (u * V1 + v * V2) . V1
Q . V2 = (u * V1 + v * V2) . V2

// Distribute V1, V2
Q . V1 = u * (V1 . V1) + v * (V1 . V2)
Q . V2 = u * (V1 . V2) + v * (V2 . V2)

// (Tedious substitution)
```

This brings us to the final formula:

```js
const dot = (vec0, vec1) => vec0[0] * vec1[0] + vec0[1] * vec1[1];

const calcBaryCoords = function(point, vert0, vert1, vert2) {

    // Make P into Q
    let Q = [point[0] - vert0[0], point[1] - vert0[1]];

    let v1 = [vert1[0] - vert0[0], vert1[1] - vert0[1]];
    let v2 = [vert2[0] - vert0[0], vert2[1] - vert0[1]];

    // Precalculate dot products to make things easier
    let A = dot(Q, v1);
    let B = dot(Q, v2);
    let c = dot(v1, v1);
    let d = dot(v1, v2);
    let e = dot(v2, v2);

    let u = (B * d - A * e) / (d * d - c * e);
    let v = (A - u * c) / d;

    return [u, v];

};
```

Of course, you may want to integrate this into your triangle-rendering calculations since much of the dot products can be precalculated.

### So, how do we check if a point is in the triangle?

It's simple. For starters, *u* and *v*  must be positive; if they are negative, the point is definitely on the wrong side of the basis vectors.

Next, *u* + *v* must be less than 1. Imagine the same condition on the Cartesian plane: `x + y < 1`. It would look something like this:

![image](https://i.imgur.com/R2AYoYL.png)

*Apologies for the crude illustration method :)*

Our barycentric coordinate system is much the same, except it's oriented so that *u = 1* corresponds to one vertex of the triangle, and *v = 1* corresponds to the other. This effectively "stretches" the normal Cartesian plane so that the bound we have set (`u + v < 1`) lies upon the final edge of the triangle.

An interactive demonstration of this can be found [here](https://adrian154.github.io/games/rasterizer/bary_demo.html).

## The code

All of this fiddling with numbers yields this result:

```js

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

    // Precompute some stuff
    let v1 = [point1[0] - point0[0], point1[1] - point0[1]];
    let v2 = [point2[0] - point0[0], point2[1] - point0[1]];
    let c = dot(v1, v1);
    let d = dot(v1, v2);
    let e = dot(v2, v2);

    for(let x = min[0]; x < max[0]; x++) {
        for(let y = min[1]; y < max[1]; y++) {

            // Check if point is in triangle by calculating barycentric coordinates
            let Q = [x - point0[0], y - point0[1]];
            let A = dot(Q, v1);
            let B = dot(Q, v2);

            let u = (B * d - A * e) / (d * d - c * e);
            if(u < 0) continue;

            let v = (A - u * c) / d;
            if(v < 0) continue;

            if(u + v > 1) continue;

            // Get index, fill
            let idx = Math.floor(y * imageData.width + x) * 4;
            imageData.data[idx] = r;
            imageData.data[idx + 1] = g;
            imageData.data[idx + 2] = b;
            imageData.data[idx + 3] = 255;

        }
    }

};
```

This code is pretty heavily unoptimized since it is extremely GC-intensive (several lists per pixel per triangle!!) Optimizing it would make it further unreadable, however, so that is left as a task for the reader.

# END