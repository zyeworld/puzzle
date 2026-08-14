//@ts-nocheck

/**@type { HTMLElement } */
const E_board = document.getElementById('board-container');
/**@type { SVGGElement } */
const E_board_transform = document.getElementById('board-transform');

//////////////////////////////////
//// Handling Board Transform ////
//////////////////////////////////

const View = {
    window_w: E_board.offsetWidth,
    window_h: E_board.offsetHeight,
    x: E_board.offsetWidth / 2,
    y: E_board.offsetHeight / 2,
    scale: 1
}

/** Set the transform of the board */
export function update_transform() {
    // TODO: determine min and max position
    // View.x = Math.min(Math.max(View.x, x_min), x_max);
    // View.y = Math.min(Math.max(View.y, y_min), y_max);

    E_board_transform.style.transform = `translate(${View.x}px, ${View.y}px) scale(${View.scale})`;
}
/** Reset the transform of the board */
export function reset_transform() {
    View.x = E_board.offsetWidth / 2;
    View.y = E_board.offsetHeight / 2;
    View.scale = 1;
    update_transform();
}

window.addEventListener('resize', function(e) {
    // Move the original center to the new center
    View.x += -View.window_w / 2 + window.innerWidth / 2;
    View.y += -View.window_h / 2 + window.innerHeight / 2;

    View.window_w = window.innerWidth;
    View.window_h = window.innerHeight;
    update_transform();
})


///////////////////
//// Scrolling ////
///////////////////

let wheel_tick = false;
document.addEventListener('wheel', function(e) {
    // Throttle
    if (!wheel_tick) {
        // Check scroll direction
        let scrollup = (e.wheelDelta && e.wheelDelta > 0) || (e.deltaY < 0);

        setTimeout(() => {
            let scale_new = scrollup ? (View.scale * 1.08) : (View.scale / 1.08);
            scale_new = Math.max(Math.min(scale_new, 3.99602), 0.250249);

            // Zoom in with mouse in the center
            const rect = E_board.getBoundingClientRect();
            const mouse_x = (e.clientX - rect.left) - View.x;
            const mouse_y = (e.clientY - rect.top) - View.y;
            const mouse_x_scaled = mouse_x * scale_new / View.scale;
            const mouse_y_scaled = mouse_y * scale_new / View.scale;
            
            View.x += mouse_x - mouse_x_scaled;
            View.y += mouse_y - mouse_y_scaled;
            View.scale = scale_new;
            update_transform();

            wheel_tick = false;
        }, 20);
        wheel_tick = true;
    }
})


//////////////////////
//// Click & Drag ////
//////////////////////

let sensitivity = 1; // mouse sensitivity
let drag_threshold = 5; // distance(px) mouse should travel before it becomes a drag

let mousedown_x = 0, mousedown_y = 0;
let prev_view_x = 0, prev_view_y = 0; // View.x and View.y when mousedown

let dragging = false;
/**
 * Check if mouse is currently dragging
 * @returns {boolean}
 */
export function is_dragging() {
    return dragging;
}

E_board.addEventListener('mousedown', function(e) {
    e.preventDefault();
    const rect = E_board.getBoundingClientRect();
    
    mousedown_x = e.clientX; mousedown_y = e.clientY;
    prev_view_x = View.x; prev_view_y = View.y;
    dragging = false;

    document.addEventListener('mouseup', onMouseup);
    document.addEventListener('mousemove', onMousemove);
})

/**
 * Drag event
 * @param {MouseEvent} e 
 */
function onMousemove(e) {
    e.preventDefault();
    
    // (x, y) of the point of E_move that appears as the top left pixel of the window.
    let delta_x = e.clientX - mousedown_x;
    let delta_y = e.clientY - mousedown_y;
    
    // If mouse moves a certain distance, start dragging
    if (delta_x * delta_x + delta_y * delta_y >= drag_threshold * drag_threshold) {
        dragging = true;
        E_board.classList.add('dragging');
    }

    if (dragging) {
        View.x = prev_view_x + sensitivity * delta_x;
        View.y = prev_view_y + sensitivity * delta_y;
        update_transform();
    }
}

/**
 * Mouseup event
 * @param {MouseEvent} e
 */
function onMouseup(e) {
    e.preventDefault();
    // stop moving when mouse button is released:
    document.removeEventListener('mouseup', onMouseup);
    document.removeEventListener('mousemove', onMousemove);

    E_board.classList.remove('dragging');

    // Do nothing if dragging ends
    if (dragging) return;
}