// I plan on extending this code to arbitrary length vectors as well as matrices
// Whether I'll get around to it, though...

// NOTE: lengthSquared is considerably faster than length
// For relative length checks, avoid using length()!
const add = (vec1, vec2) => [vec1[0] + vec2[0], vec1[1] + vec2[1]];
const sub = (vec1, vec2) => [vec1[0] - vec2[0], vec1[1] - vec2[1]];
const mul = (vec1, scalar) => [vec1[0] * scalar, vec1[1] * scalar];
const div = (vec1, scalar) => [vec1[0] / scalar, vec1[1] / scalar];
const dot = (vec1, vec2) => vec1[0] * vec2[0] + vec1[1] * vec2[1];
const length = (vec) => Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1]);
const lengthSquared = (vec) => vec[0] * vec[0] + vec[1] * vec[1];