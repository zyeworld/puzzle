//@ts-nocheck
import { draw_cell } from "./themes/theme_manager.js";
import { reset_transform, is_dragging } from "./transform_manager.js";

/**@type { HTMLElement } */
const E_board = document.getElementById('board-container');
/**@type { SVGGElement } */
const E_cells = document.getElementById('cells');
/**@type { SVGGElement } */
const E_bg = document.getElementById('board-bg');

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
 * Get the bg element at coordinates (i, j)
 * @param {number} i 
 * @param {number} j 
 * @returns {SVGElement?}
 */
function get_bg(i, j) {
    return E_bg.querySelector(`[data-i="${i}"][data-j="${j}"]`);
}

/**
 * Check if (i1, j1) and (i2, j2) are near (8 cells max)
 * @param {number} i1 
 * @param {number} j1 
 * @param {number} i2 
 * @param {number} j2 
 * @returns {boolean}
 */
function is_near(i1, j1, i2, j2) {
    const di = i2 - i1;
    if (di < -8 || di > 8) return false;
    const dj = j2 - j1;
    if (dj < Math.max(-di-8, -8) || dj > Math.min(8-di, 8)) return false;
    return true;
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
        if (status !== Status.empty) {
            E_cell.dataset.status = status;
            E_cell.classList.add('last'); // Last played
        }
        return;
    }

    // Add cell according to theme
    const { cell, bg } = draw_cell(i, j);

    // Set classes and attributes
    cell.classList.add('cell');
    cell.dataset.i = i;
    cell.dataset.j = j;
    cell.dataset.status = status;
    if (bg) {
        bg.dataset.i = i;
        bg.dataset.j = j;
    }

    // Click listener (check for class 'click' in it)
    let E_click = cell.querySelector('click');
    if (!E_click) E_click = cell;
    
    E_click.addEventListener('click', function(e) {
        // Only click when not dragging
        if (is_dragging()) return;
        if (this.dataset.status === Status.empty)
            play_cell(i, j);
    });
    
    E_cells.appendChild(cell);
    if (bg) E_bg.appendChild(bg);
}


/////////////////////////////
//// Handling Board Data ////
/////////////////////////////

/**
 * Initialize the board
 */
export function initialize_board() {
    add_cell(0, 0, Status.empty);
    reset_transform();
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
        player: (board.length % 4 === 1 || board.length % 4 === 2) ? 2 : 1
    }
    board.push(move);
    
    // Add empty cells in every direction, at most 8 cells away
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
    if (board.length % 4 === 0 || board.length % 4 === 3) {
        E_board.classList.add('turn-p1');
    } else {
        E_board.classList.add('turn-p2');
    }

    // Update "Last played" cell
    // 1. Remove 3rd-to-last
    if (board.length >= 3) {
        get_cell(...board[board.length - 3].coord)?.classList.remove('last');
    }
    // 2. Remove 2nd-to-last if it's a different color
    if (board.length >= 2 && (board.length % 4 === 0 || board.length % 4 === 2)) {
        get_cell(...board[board.length - 2].coord)?.classList.remove('last');
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

    // Remove the cell from the board db
    const cell_index = board.findIndex(
        ({ coord, player }) => (coord[0] === i && coord[1] === j)
    );
    if (cell_index !== -1) {
        board.splice(cell_index, 1);
    }

    // Empty the cell
    E_cell.dataset.status = Status.empty;

    // Try removing cells in every direction, at most 8 cells away
    for (let di = -8; di <= 8; di++) {
        for (let dj = Math.max(-di-8, -8); dj <= Math.min(8-di, 8); dj++) {

            let should_delete = true;
            for (const { coord, player } of board) {
                if (is_near(i + di, j + dj, coord[0], coord[1])) {
                    should_delete = false;
                    break;
                }
            }
            if (should_delete) {
                get_cell(i + di, j + dj)?.remove();
                get_bg(i + di, j + dj)?.remove();
            }
        }
    }
    if (board.length === 0) {
        initialize_board();
    }
}

/**
 * Cancel the last move
 */
export function cancel_last_move() {
    if (board.length === 0) return;

    const coord = board[board.length - 1].coord;
    cancel_cell(coord[0], coord[1]);
}


/**
 * Draw the given board
 * @param {{ coord: number[]; player: number }[]} _board 
 */
export function draw_board(_board) {
    board = [];

    // Clear all cells
    while (E_cells.hasChildNodes()) {
        E_cells.removeChild(E_cells.lastChild);
    }
    while (E_bg.hasChildNodes()) {
        E_bg.removeChild(E_bg.lastChild);
    }

    if (_board.length === 0) {
        initialize_board();
        return;
    }
    _board.forEach(({ coord, player }) => {
        play_cell(coord[0], coord[1]);
    });
}

/**
 * Redraw the current board
 */
export function redraw_board() {
    draw_board(board);
}