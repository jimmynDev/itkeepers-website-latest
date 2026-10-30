import { createHash } from 'node:crypto';
import base from '../../public/style.css?inline';
import mobile from '../../public/mobile.css?inline';
import services from '../../public/services-theme.css?inline';
import tokens from '../../public/visual-system-tokens.css?inline';
import visual from '../../public/visual-system.css?inline';
import emergency from '../../public/emergency.css?inline';
import pulse from '../../public/pulse-navigation.css?inline';
import copy from '../../public/supporting-copy.css?inline';
import headings from '../../public/primary-headings.css?inline';

// Keep the original cascade and source files, but deliver one minified request.
const bundle = (home: boolean) => {
  const css = [base, mobile, ...(home ? [services] : []), tokens, visual, emergency, pulse, copy, headings].join('\n');
  const file = `site-${createHash('sha256').update(css).digest('hex').slice(0, 12)}`;
  return { file, href: `/styles/${file}.css`, css };
};
export const sharedStyles = { home: bundle(true), inner: bundle(false) };
