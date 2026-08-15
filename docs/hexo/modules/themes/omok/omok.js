//@ts-nocheck

// Cells are hexagons
const CELL_SIDE = 36;
const CELL_W = Math.round(CELL_SIDE * Math.sqrt(3));
const CELL_H = CELL_SIDE * 3 / 2;

const CIRCLE_R = 26;
const LINE_R = 38;
const LINE_R_SIN30 = LINE_R / 2;
const LINE_R_SIN60 = Math.round(LINE_R * Math.sqrt(3) / 2);

/**
 * Draw cell at (i, j)
 * @param {number} i 
 * @param {number} j 
 * @returns {{ cell: Element, bg: Element? }}
 */
export function draw_cell(i, j) {
    // Cells are represented in 2D coordinates (i, j)
    // (-1,-2)  (0,-2)   (1,-2)   (2,-2)   (3,-2)
    //     (-1,-1)   (0,-1)   (1,-1)   (2,-1)
    // (-2,0)   (-1,0)   (0,0)    (1,0)    (2,0)
    //     (-2,1)    (-1,1)   (0,1)    (1,1)
    // (-3,2)   (-2,2)   (-1,2)   (0,2)    (1,2)

    const x = (i + j/2) * CELL_W;
    const y = j * CELL_H;

    // Background lines
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    // Tweaked through trial and error
    path.setAttributeNS(null, 'd',
       `M ${x - LINE_R + 5},${y} H ${x + LINE_R - 5}
        M ${x - LINE_R_SIN30},${y - LINE_R_SIN60} L ${x + LINE_R_SIN30},${y + LINE_R_SIN60}
        M ${x + LINE_R_SIN30},${y - LINE_R_SIN60} L ${x - LINE_R_SIN30},${y + LINE_R_SIN60}`
    );

    // Circle
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttributeNS(null, 'r', CIRCLE_R);
    circle.setAttributeNS(null, 'cx', x);
    circle.setAttributeNS(null, 'cy', y);
    circle.classList.add('click');
    
    return { 'cell': circle, 'bg': path };
}