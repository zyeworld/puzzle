//@ts-nocheck

/**@type { SVGGElement } */
const E_cells = document.getElementById('cells');

// Cells are hexagons
const CELL_SIDE = 36;
const CELL_W = Math.round(CELL_SIDE * Math.sqrt(3));
const CELL_H = CELL_SIDE * 3 / 2;


/**
 * Draw cell at (i, j)
 * @param {number} i 
 * @param {number} j 
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

    const x_min = x - CELL_W / 2;
    const x_max = x + CELL_W / 2;
    
    const y_up = y - CELL_SIDE / 2;
    const y_down = y + CELL_SIDE / 2;
    
    const cell = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    cell.setAttributeNS(null, 'points',
        `${x},${y - CELL_SIDE} ${x_max},${y_up} ${x_max},${y_down} ${x},${y + CELL_SIDE} ${x_min},${y_down} ${x_min},${y_up}`
    );
    return cell;
}