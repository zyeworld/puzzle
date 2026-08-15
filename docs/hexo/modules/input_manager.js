//@ts-nocheck
import { cancel_last_move } from "./hexo.js";

document.addEventListener('keydown', (e) => {
    if (e.key === 'z' || e.code === 'ArrowLeft') {
        e.preventDefault();
        cancel_last_move();
    }
})