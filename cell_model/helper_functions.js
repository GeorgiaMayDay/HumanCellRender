// Helper functions

export function comparePositions(i, j) {
    if (i.x == j.x && i.y == j.y && i.z == j.z) {
        return true;
    }
    return false;
}

export function compareClickWithPoint(i, j) {
    if ((j[0] >= i.x - 20 && j[0] <= i.x + 20) &&
        (j[1] >= i.y - 20 && j[1] <= i.y + 20) &&
        (j[2] >= i.z - 20 && j[2] <= i.z + 20)) {
        return true;
    }

    return false;
}