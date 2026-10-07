import type { ClientVideo } from '../data/client-proof';
const mounted=new WeakMap<HTMLElement,()=>void>();
export function initializeClientProof(scope:ParentNode) {
  scope.querySelectorAll<HTMLElement>('[data-client-proof]').forEach(root=>{
    if(mounted.has(root)) return;
    const config=root.querySelector('[data-proof-config]');
    const video=root.querySelector<HTMLVideoElement>('[data-proof-video]');
    const facade=root.querySelector<HTMLElement>('[data-proof-facade]');
    const play=root.querySelector<HTMLButtonElement>('[data-proof-play]');
    if(!config||!video||!facade||!play) return;
    const items:ClientVideo[]=JSON.parse(config.textContent||'[]');
    if(!items.length) return;
    const selectors=[...root.querySelectorAll<HTMLButtonElement>('[data-proof-select]')];
    const poster=root.querySelector<HTMLImageElement>('[data-proof-poster]');
    const transcript=root.querySelector<HTMLAnchorElement>('[data-proof-transcript]');
    const label=root.querySelector<HTMLElement>('[data-proof-video-label]');
    const status=root.querySelector<HTMLElement>('[data-proof-status]');
    const frame=root.querySelector<HTMLElement>('.proof-media-frame')!;
    let selected=items[0];
    let generation=0;
    const pause=()=>{generation++;video.pause();play.disabled=false;};
    const release=()=>{pause();video.removeAttribute('src');video.replaceChildren();video.load();video.hidden=true;facade.hidden=false;};
    const choose=(event:Event)=>{
      const button=event.currentTarget as HTMLButtonElement;
      const next=items.find(item=>item.id===button.dataset.proofSelect);
      if(!next||next.id===selected.id) return;
      release();selected=next;
      if(poster) poster.src=next.poster!;
      video.poster=next.poster!;video.setAttribute('aria-label',next.label);
      if(transcript) transcript.href=next.transcript!;
      if(label) label.textContent=next.label;
      if(status) status.textContent='';
      selectors.forEach(item=>{if(!item.disabled)item.setAttribute('aria-pressed',String(item===button));});
    };
    const start=async()=>{
      play.disabled=true;
      const attempt=++generation;
      if(!video.querySelector('source')) {
        selected.sources.forEach(item=>{const source=document.createElement('source');source.src=item.src;source.type=item.type;video.append(source);});
        selected.captions.forEach((item,index)=>{const track=document.createElement('track');track.kind='captions';track.src=item.src;track.srclang=item.srclang;track.label=item.label;track.default=index===0;video.append(track);});
        video.load();
      }
      facade.hidden=true;video.hidden=false;
      try { await video.play();if(attempt===generation)video.focus({preventScroll:true}); }
      catch { if(attempt===generation){video.hidden=true;facade.hidden=false;if(status)status.textContent='Video could not be played. Try again.';play.focus({preventScroll:true});} }
      finally { if(attempt===generation)play.disabled=false; }
    };
    const visibility=()=>{if(document.hidden)pause();};
    const observer='IntersectionObserver' in window?new IntersectionObserver(entries=>{if(entries.some(entry=>!entry.isIntersecting))pause();},{threshold:0}):null;
    observer?.observe(frame);
    selectors.forEach(button=>button.addEventListener('click',choose));play.addEventListener('click',start);
    play.hidden=false;
    document.addEventListener('visibilitychange',visibility);window.addEventListener('pagehide',pause);
    const dispose=()=>{release();observer?.disconnect();selectors.forEach(button=>button.removeEventListener('click',choose));play.removeEventListener('click',start);document.removeEventListener('visibilitychange',visibility);window.removeEventListener('pagehide',pause);mounted.delete(root);};
    mounted.set(root,dispose);document.addEventListener('astro:before-swap',dispose,{once:true});
  });
}
