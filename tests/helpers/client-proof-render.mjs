import { readFile, mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { transform } from '@astrojs/compiler-rs';
import ts from 'typescript';
import { experimental_AstroContainer } from 'astro/container';

// Render the actual component with isolated, in-memory test data. Never edit
// production arrays or add a fixture route to the public Astro build.
export async function clientProofRenderer() {
  const directory = await mkdtemp(join(tmpdir(), 'itkeepers-client-proof-'));
  try {
    const source = await readFile(new URL('../../src/components/ClientProof.astro', import.meta.url), 'utf8');
    const dataSource = await readFile(new URL('../../src/data/client-proof.ts', import.meta.url), 'utf8');
    const compiled = await transform(source, { filename: 'ClientProof.astro', internalURL: import.meta.resolve('astro/compiler-runtime'), resultScopedSlot: true, renderScript: true });
    const data = ts.transpileModule(dataSource, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText;
    let code = compiled.code
      .replaceAll('../data/client-proof', './data.mjs')
      .replace(/^import "[^"]+\?astro&type=style[^\n]+\n/gm, '');
    // Vite normally handles bundler-only metadata. HTML rendering and the
    // separately tested playback controller do not use this metadata.
    code = code.replace(/,\s*createMetadata as \$\$createMetadata/, '')
      .replace(/export const \$\$metadata =[\s\S]*?\nconst \$\$ClientProof/, () => 'const $$ClientProof');
    await writeFile(join(directory, 'data.mjs'), data);
    await writeFile(join(directory, 'component.mjs'), code);
    const api = await import(pathToFileURL(join(directory, 'data.mjs')).href);
    const { default: Component } = await import(pathToFileURL(join(directory, 'component.mjs')).href);
    const container = await experimental_AstroContainer.create();
    return {
      api,
      css: compiled.css.join('\n'),
      async render({ quotes = [], videos = [] } = {}) {
        api.textTestimonials.splice(0, api.textTestimonials.length, ...quotes);
        api.videoTestimonials.splice(0, api.videoTestimonials.length, ...videos);
        return container.renderToString(Component);
      },
      dispose: () => rm(directory, { recursive: true, force: true }),
    };
  } catch (error) {
    await rm(directory, { recursive: true, force: true });
    throw error;
  }
}
