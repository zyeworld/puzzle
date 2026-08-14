//@ts-nocheck
import { draw_cell } from "./themes/standard.js";
import { reset_transform, is_dragging } from "./mouse_manager.js";

/**@type { HTMLElement } */
const E_board = document.getElementById('board-container');
/**@type { SVGGElement } */
const E_cells = document.getElementById('cells');

/**@type {{ coord: number[]; player: number }[]} */
let board = [];


////////////////////////////
//// Handling Each Cell ////
////////////////////////////

// Status of each cell
const Status = {
    empty: "0",
    p1: "1",
    p2: "2"
};

// Cells are represented in 2D coordinates (i, j)
// (-1,-2)  (0,-2)   (1,-2)   (2,-2)   (3,-2)
//     (-1,-1)   (0,-1)   (1,-1)   (2,-1)
// (-2,0)   (-1,0)   (0,0)    (1,0)    (2,0)
//     (-2,1)    (-1,1)   (0,1)    (1,1)
// (-3,2)   (-2,2)   (-1,2)   (0,2)    (1,2)

/**
 * Get the cell element at coordinates (i, j)
 * @param {number} i 
 * @param {number} j 
 * @returns {SVGElement?}
 */
function get_cell(i, j) {
    return E_cells.querySelector(`[data-i="${i}"][data-j="${j}"]`);
}

/**
 * Add a cell at coordinates (i, j)
 * @param {number} i 
 * @param {number} j 
 * @param {string} status
 */
function add_cell(i, j, status) {
    // Check if cell already exists
    let E_cell = get_cell(i, j);
    if (E_cell) {
        // Update if the status changed from empty to something else
        if (status !== Status.empty)
            E_cell.dataset.status = status;
        return;
    }

    // Add cell according to theme
    E_cell = draw_cell(i, j);

    // Set classes and attributes
    E_cell.classList.add('cell');
    E_cell.dataset.i = i;
    E_cell.dataset.j = j;
    E_cell.dataset.status = status;

    // Click listener
    E_cell.addEventListener('click', function(e) {
        // Only click when not dragging
        if (is_dragging()) return;
        if (this.dataset.status === Status.empty)
            play_cell(i, j);
    });

    E_cells.appendChild(E_cell);
}


/////////////////////////////
//// Handling Board Data ////
/////////////////////////////

/**
 * Initialize the board
 */
export function initialize_board() {
    reset_transform();
    add_cell(0, 0, Status.empty);
}

/**
 * Play one move on the current board at (i, j)
 * @param {number} i
 * @param {number} j
 */
export function play_cell(i, j) {
    // TODO: check integrity
    const move = {
        coord: [i, j],
        player: (board.length % 4 == 1 || board.length % 4 == 2) ? 2 : 1
    }
    board.push(move);
    
    // Add empty cells in every direction at most 8 cells away
    for (let di = -8; di <= 8; di++) {
        for (let dj = Math.max(-di-8, -8); dj <= Math.min(8-di, 8); dj++) {
            add_cell(i + di, j + dj, Status.empty);
        }
    }
    // Add the played cell
    add_cell(i, j, move.player.toString());

    // Set turn on HTML
    E_board.classList.remove('turn-p1');
    E_board.classList.remove('turn-p2');
    if (board.length % 4 == 0 || board.length % 4 == 3) {
        E_board.classList.add('turn-p1');
    } else {
        E_board.classList.add('turn-p2');
    }
}

/**
 * Cancel one existing move on the current board at (i, j)
 * @param {number} i
 * @param {number} j
 */
export function cancel_cell(i, j) {    
    const E_cell = get_cell(i, j);
    if (!E_cell) return;

    // Empty the cell
    E_cell.dataset.status = Status.empty;

    // Try removing it and the cells around
    // TODO
}


/**
 * Refresh and draw the entire board
 * @param {{ coord: number[]; player: number }[]} _board 
 */
export function draw(_board) {
    board = _board;

    // Clear all cells
    while (E_cells.hasChildNodes) {
        E_cells.removeChild(E_cells.lastChild);
    }

    if (board.length === 0) {
        initialize_board();
        return;
    }
    board.forEach(play_cell);
}
