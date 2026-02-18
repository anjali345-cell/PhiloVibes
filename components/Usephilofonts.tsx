"use client";

import { useEffect } from "react";

export function usePhiloFonts() {
  useEffect(() => {
    const id = "philo-fonts";
    if (document.getElementById(id)) return; // don't inject twice
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=DM+Serif+Display:ital@0;1&family=Libre+Baskerville:ital@1&display=swap";
    document.head.appendChild(link);
    // intentionally never removed — fonts are global
  }, []);
}