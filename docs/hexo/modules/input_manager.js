//@ts-nocheck
import { undo_last, draw_board } from "./hexo.js";

document.addEventListener('keydown', (e) => {
    if (e.key === 'z' || e.key === 'ArrowLeft') {
        e.preventDefault();
        undo_last();
    } else if (e.key === 'r') {
        draw_board([]);
    }
})