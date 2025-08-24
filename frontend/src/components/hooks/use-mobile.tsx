"use client";

import * as React from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * Hook que detecta si el viewport está en modo móvil.
 * - Devuelve `true` en pantallas < 768px
 * - Seguro para SSR (inicia como `false`)
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    mql.addEventListener("change", onChange);
    onChange(); // inicial

    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}
