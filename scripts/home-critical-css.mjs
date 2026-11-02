import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { parse as parseHTML } from 'parse5';
import postcss from 'postcss';
import { selectAll } from 'css-select';

// Unstyled, absolutely positioned descendants of later illustrations must not
// briefly paint over the first screen while their complete stylesheet loads.
// Native CSS removes this temporary containment; no script is needed.
export function containLaterContent(html) {
  const document=parseHTML(html,{sourceCodeLocationInfo:true});
  let passed=false;const positions=[];
  const visit=node=>{
    const attrs=Object.fromEntries((node.attrs||[]).map(a=>[a.name,a.value]));
    if(passed && node.tagName && !['script','style','link','meta','noscript'].includes(node.tagName)){
      if((attrs.class||'').split(/\s+/).includes('home-motion-control'))return;
      const tag=node.sourceCodeLocation?.startTag;
      if(tag){positions.push(tag.endOffset-(html.slice(tag.startOffset,tag.endOffset).endsWith('/>')?2:1));return;}
    }
    for(const child of node.childNodes||[])visit(child);
    if(attrs.id==='services/managed')passed=true;
  };
  visit(document);
  if(!passed)throw Error('Review the Home first-screen boundary.');
  for(const position of positions.sort((a,b)=>b-a))html=html.slice(0,position)+' data-home-late'+html.slice(position);
  return html;
}

// Work on the final Astro selectors, retaining source order and every conditional
// wrapper. Only selectors conclusively unrelated to the first screen are omitted.
export function criticalHomeCSS(css, html) {
  const critical = new Set();
  let pastFirstScreen = false;
  function convert(node, parent, inherited = false) {
    const attrs = Object.fromEntries((node.attrs || []).map(a => [a.name, a.value]));
    const classes = (attrs.class || '').split(/\s+/);
    const own = classes.some(c => ['header-region', 'home-hero', 'home-pointer-light', 'home-motion-control'].includes(c)) || attrs.id === 'services/managed';
    const item = { type: node.tagName ? 'tag' : 'root', name: node.tagName, attribs: attrs, children: [], parent };
    if (!pastFirstScreen || inherited || own || ['html', 'body', 'main'].includes(node.tagName)) critical.add(item);
    item.children = (node.childNodes || []).filter(n => n.tagName).map(n => convert(n, item, inherited || own));
    item.children.forEach((n, i, all) => { n.prev = all[i - 1] || null; n.next = all[i + 1] || null; });
    if (attrs.id === 'services/managed') pastFirstScreen = true;
    return item;
  }
  const dom = convert(parseHTML(html));
  if (!pastFirstScreen) throw Error('Review the Home first-screen boundary.');
  for (const node of critical) for (let parent=node.parent; parent; parent=parent.parent) critical.add(parent);
  const tree = postcss.parse(css);
  tree.walkRules(rule => {
    if (rule.parent.type === 'atrule' && /keyframes$/i.test(rule.parent.name)) return;
    // Runtime states must not cause first-screen hover, focus, theme or entrance
    // rules to disappear merely because the static document has not entered them.
    const selector = rule.selector.replace(/::[\w-]+(?:\([^)]*\))?/g, '')
      .replace(/:(?:hover|focus-visible|focus-within|focus|active|visited)\b/g, '')
      .replace(/\[(?:data-(?!astro-)[\w-]+|aria-[\w-]+)(?:[^\]]*)\]/g, '')
      .replace(/\.(?:is-[\w-]+|no-anim|home-motion-ready)\b/g, '');
    try { if (!selectAll(selector, dom.children).some(n => critical.has(n))) rule.remove(); }
    catch { /* Unknown selector grammar is retained, never guessed away. */ }
  });
  const values=[];
  tree.walkDecls(decl => { if (!decl.parent?.parent?.name?.endsWith('keyframes')) values.push(decl.value); });
  const used=values.join(' ');
  tree.walkAtRules(/keyframes$/i, rule => {
    if (!new RegExp(`(^|[^\\w-])${rule.params.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}([^\\w-]|$)`).test(used)) rule.remove();
  });
  // Keep font faces, properties, keyframes and cascade layers. Empty media/supports
  // wrappers are harmless but need not occupy the critical document.
  tree.walkAtRules(rule => { if (rule.nodes?.length === 0) rule.remove(); });
  return tree.toString();
}

export function homeCriticalStyles() {
  return { name: 'home-first-screen-css', hooks: { 'astro:build:done': async ({ dir }) => {
    const file = new URL('index.html', dir);
    const html = await readFile(file, 'utf8');
    const links = [...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*>/g)];
    let result = containLaterContent(html), total = 0;
    const full = [];
    for (const [tag] of links) {
      const href = /href="([^"]+)"/.exec(tag)?.[1];
      if (!href?.startsWith('/') || !href.endsWith('.css')) throw Error('Review the Home stylesheet origin.');
      const css = await readFile(new URL('.' + href, dir), 'utf8');
      for (const [, value] of css.matchAll(/url\(([^)]+)\)/g)) {
        if (!/^(?:\/|#|data:)/.test(value.trim().replace(/^['"]|['"]$/g,''))) throw Error('Review relative Home CSS asset URLs before combining.');
      }
      full.push(css);
      const critical = criticalHomeCSS(css, html);
      total += Buffer.byteLength(critical);
      if (critical.includes('</style')) throw Error('Unsafe CSS delimiter.');
      result = result.replace(tag, critical ? `<style data-home-critical>${critical}</style>` : '');
    }
    if (!links.length || total > 90000) throw Error(`Review the bounded first-screen CSS budget (${total} bytes).`);
    // One native body stylesheet completes the original cascade in source order.
    // No media switching, runtime loader, inline event handler or JS dependency.
    result=result.replace('</head>','<style data-home-critical>html[data-home-enhanced] [data-home-late]{visibility:hidden;content-visibility:hidden}</style></head>');
    const complete=full.join('\n')+'\nhtml[data-home-enhanced] [data-home-late]{visibility:visible;content-visibility:visible}';
    const name=`styles/site-${createHash('sha256').update(complete).digest('hex').slice(0,12)}.css`;
    await writeFile(new URL(name,dir),complete);
    result=result.replace('</body>',`<link rel="stylesheet" href="/${name}" data-home-full></body>`);
    await writeFile(file, result);
    console.log(`Home first-screen CSS: ${total} bytes; ${links.length} full stylesheets preserved in one native body stylesheet (${Buffer.byteLength(complete)} bytes).`);
  } } };
}
