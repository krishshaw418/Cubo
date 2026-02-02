"use client"
export function calculateHeight() {
    const navBar = document.getElementById("navbar");
    if (navBar) {
        return navBar.offsetHeight;
    }
    else {
        return 0;
    }
}