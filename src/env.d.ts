/// <reference types="astro/client" />

/** Vite resolves these stylesheet imports to CSS source strings during Astro builds. */
declare module '*.css?inline' {
  const css: string;
  export default css;
}
