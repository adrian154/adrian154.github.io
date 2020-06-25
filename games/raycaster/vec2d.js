// Immutable functions
const plus = function(v1, v2) {
    return {
        x: v1.x + v2.x,
        y: v1.y + v2.y
    };
};

const minus = function(v1, v2) {
    return {
        x: v1.x - v2.x,
        y: v1.y - v2;y
    };
}

const dot = function(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
};

const length = function(v) {
    return Math.sqrt(v.x * v.x + v.y * v.y);
};

const lengthSquared = function(v) {
    return v.x * v.x + v.y * v.y;
};

// Class
function Vec2(x, y) {
    this.x = x;
    this.y = y;
    
    this.add = function(v2) {
        this.x += v2.x;
        this.y += v2.y;
    };

    this.subtract = function(v2) {
        this.x -= v2.x;
        this.y -= v2.y;
    }

};