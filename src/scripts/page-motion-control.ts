/** One persistent page choice; no storage, forced autoplay or focus ownership. */
export function mountPageMotionControl(button: HTMLButtonElement) {
  const media=matchMedia('(prefers-reduced-motion: reduce), (forced-colors: active)');
  let paused=false;
  const update=()=>{
    // A paused page must remain readable when a media change recreates CSS
    // animations. Finish the one-shot entrance; never freeze it at opacity 0.
    if(paused) document.querySelector('[data-hero-headline]')?.setAttribute('data-headline-entered','');
    document.documentElement.toggleAttribute('data-motion-paused',paused);
    button.textContent=paused?'Resume motion':'Pause motion';
    button.disabled=media.matches;
    if(media.matches) button.textContent='Motion reduced';
    document.dispatchEvent(new CustomEvent('itkeepers:motionchange',{detail:paused}));
  };
  button.hidden=false;
  button.addEventListener('click',()=>{paused=!paused;update();});
  media.addEventListener('change',update);
  update();
}
