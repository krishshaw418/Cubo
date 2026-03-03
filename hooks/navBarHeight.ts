"use client"
import { useEffect, useState } from "react";

export function useNavBarHeight() {
  const [navBarHeight, setNavBarHeight] = useState(0);

  useEffect(() => {
    const navBar = document.getElementById("navbar");
    if (navBar) {
      setNavBarHeight(navBar.offsetHeight);
    }
  }, []);

  return navBarHeight;
}