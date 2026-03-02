"use client"
export function calculateHeight() {
    const navBar = window.document.getElementById("navbar");
    if (navBar) {
        return navBar.offsetHeight;
    }
    else {
        return 0;
    }
}