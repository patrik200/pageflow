/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare type CSSVarFunction = `var(--${string})` | `var(--${string}, ${string | number})`;
