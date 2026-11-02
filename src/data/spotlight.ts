export type SpotlightProfile = 'home' | 'medium' | 'low' | 'subtle';

/** Apply only to released pages rendered by Base; legal/Pulse stay excluded. */
export function spotlightProfile(path: string): SpotlightProfile | undefined {
  if (path === '/') return 'home';
  if (path.startsWith('/services/')) return 'medium';
  if (path === '/about/') return 'low';
  if (path === '/contact/') return 'subtle';
  return undefined;
}
