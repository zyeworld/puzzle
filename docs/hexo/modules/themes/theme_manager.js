//@ts-nocheck
import { redraw_board } from "../hexo.js";
import { draw_cell as draw_cell_omok } from "./omok/omok.js";
import { draw_cell as draw_cell_science } from "./science/science.js";


/**@type {HTMLElement} */
const E_main = document.querySelector('main');

const Theme = {
    science: 'science',
    omok: 'omok'
}

/**
 * Draw cell at (i, j)
 * @param {number} i 
 * @param {number} j
 * @returns {{ cell: Element, bg: Element? }}
 */
export function draw_cell(i, j) {
    switch (E_main.dataset.theme) {
        case Theme.science:
            return draw_cell_science(i, j);
        case Theme.omok:
            return draw_cell_omok(i, j);
        default:
            break;
    }
}

/**
 * Set the theme
 * @param {string} theme 
 */
function set_theme(theme) {
    if (E_main.dataset.theme === theme) return;
    E_main.dataset.theme = theme;
    redraw_board();
}

// Button click listeners
document.getElementById('theme-science').addEventListener('click', function(e) {
    set_theme(Theme.science);
})
document.getElementById('theme-omok').addEventListener('click', function(e) {
    set_theme(Theme.omok);
})
