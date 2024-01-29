// Helper functions

export function comparePositions(i, j) {
    if (i.x == j.x && i.y == j.y && i.z == j.z) {
        return true;
    }
    return false;
}

export function compareClickWithPoint(i, j) {
    console.log(i)
    console.log(j)
    if ((j[0] >= i.x - 15 && j[0] <= i.x + 15) &&
        (j[1] >= i.y - 15 && j[1] <= i.y + 15) &&
        (j[2] >= i.z - 15 && j[2] <= i.z + 15)) {
        return true;
    }

    return false;
}