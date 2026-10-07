import { mountAnimation } from './animation-lifecycle';
type Scheduler={later:(callback:()=>void,delay:number)=>void};
const incidentPhases=['detect','ticket','assign','notify','investigate','resolve','document'];
function incident(root:HTMLElement,scheduler:Scheduler) {
  const scene=root.querySelector<HTMLElement>('[data-animation-visual]')!;
  const rail=scene.querySelector<HTMLElement>('.incident-rail')!;
  const steps=[...scene.querySelectorAll<HTMLElement>('[data-process-step]')];
  const ticket=scene.querySelector<HTMLElement>('.incident-ticket')!;
  const fill=scene.querySelector<HTMLElement>('.incident-fill')!;
  const status=scene.querySelector<HTMLElement>('[data-incident-status]')!;
  scene.dataset.phase='waiting';fill.style.transform='scaleY(0)';status.textContent='Detected';
  steps.forEach(step=>step.classList.remove('is-complete','is-active'));
  const activate=(index:number)=>{
    steps.forEach((step,i)=>{step.classList.toggle('is-complete',i<index);step.classList.toggle('is-active',i===index);});
    scene.dataset.phase=incidentPhases[index];
    const node=steps[index].querySelector<HTMLElement>('.incident-node')!.getBoundingClientRect();
    const box=rail.getBoundingClientRect();
    const y=node.top+node.height/2-box.top;
    ticket.style.top=`${y/box.height*100}%`;
    const axis=scene.querySelector<HTMLElement>('.incident-axis')!.getBoundingClientRect();
    fill.style.transform=`scaleY(${Math.min(1,Math.max(0,(node.top+node.height/2-axis.top)/axis.height))})`;
    ticket.classList.toggle('is-handoff',index===2);
    status.textContent=index>=5?'Resolved':index>=2?'Owned':'Detected';
  };
  return {duration:4800,play(){scene.dataset.phase='entrance';steps.forEach((_,i)=>scheduler.later(()=>activate(i),850+i*480));},settle(){scene.dataset.phase='settled';steps.forEach(step=>{step.classList.add('is-complete');step.classList.remove('is-active');});fill.style.transform='scaleY(1)';ticket.classList.remove('is-handoff');status.textContent='Resolved';}};
}
function knowledge(root:HTMLElement,scheduler:Scheduler) {
  const scene=root.querySelector<HTMLElement>('[data-animation-visual]')!;
  const sources=[...scene.querySelectorAll<HTMLElement>('[data-knowledge-source]')];
  const rows=[...scene.querySelectorAll<HTMLElement>('[data-knowledge-row]')];
  const letter=scene.querySelector<HTMLElement>('[data-engineer-letter]')!;
  const name=scene.querySelector<HTMLElement>('[data-engineer-name]')!;
  scene.dataset.phase='waiting';letter.textContent='A';name.textContent='Engineer A';
  return {duration:4300,play(){scene.dataset.phase='capture';sources.forEach((source,i)=>scheduler.later(()=>{source.classList.add('is-captured');rows[i].classList.add('is-captured');},700+i*260));scheduler.later(()=>{scene.dataset.phase='documented';},2250);scheduler.later(()=>{scene.dataset.phase='shared';},2800);scheduler.later(()=>{scene.dataset.phase='handoff';letter.textContent='B';name.textContent='Engineer B';},3500);},settle(){scene.dataset.phase='settled';sources.forEach(source=>source.classList.add('is-captured'));rows.forEach(row=>row.classList.add('is-captured'));letter.textContent='B';name.textContent='Engineer B';}};
}
function hardware(root:HTMLElement,scheduler:Scheduler) {
  const scene=root.querySelector<HTMLElement>('[data-animation-visual]')!;
  const signals=[...scene.querySelectorAll<HTMLElement>('[data-assessment-signal]')];
  const selected=scene.querySelector<HTMLElement>('[data-assessment-outcome="upgrade"]')!;
  const status=scene.querySelector<HTMLElement>('[data-assessment-status]')!;
  scene.dataset.phase='waiting';selected.classList.remove('is-selected');status.textContent='Reviewing';
  return {duration:3000,play(){scene.dataset.phase='evaluate';signals.forEach((signal,i)=>scheduler.later(()=>signal.classList.add('is-read'),350+i*230));scheduler.later(()=>{scene.dataset.phase='decision';selected.classList.add('is-selected');status.textContent='Example complete';},2100);},settle(){scene.dataset.phase='settled';signals.forEach(signal=>signal.classList.add('is-read'));selected.classList.add('is-selected');status.textContent='Example complete';}};
}
function initialize() {
  for(const [selector,factory] of [['.operate-process',incident],['.knowledge-continuity',knowledge],['.hardware-assessment',hardware]] as const) {
    document.querySelectorAll<HTMLElement>(selector).forEach(root=>{
      const dispose=mountAnimation(root,scheduler=>factory(root,scheduler));
      if(!root.dataset.operateCleanup){root.dataset.operateCleanup='true';document.addEventListener('astro:before-swap',dispose,{once:true});}
    });
  }
}
initialize();
document.addEventListener('astro:page-load',initialize);
