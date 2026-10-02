/** Normal buttons: Tab to each control; Enter/Space activate. No automatic steps. */
export function initializeWorkflows(scope: ParentNode) {
  scope.querySelectorAll<HTMLElement>('[data-workflow]').forEach((root) => {
    if (root.dataset.enhanced) return;
    const panels = [...root.querySelectorAll<HTMLElement>('[data-step-panel]')];
    const buttons = [...root.querySelectorAll<HTMLButtonElement>('[data-step]')];
    const previous = root.querySelector<HTMLButtonElement>('[data-previous]');
    const next = root.querySelector<HTMLButtonElement>('[data-next]');
    const status = root.querySelector<HTMLElement>('[data-step-status]');
    const selectors = root.querySelector<HTMLElement>('[data-step-selectors]');
    const navigation = root.querySelector<HTMLElement>('[data-step-navigation]');
    if (!panels.length || panels.length !== buttons.length || !previous || !next || !status || !selectors || !navigation) return;
    let current = 0;
    const select = (index: number, announce = true) => {
      if (!Number.isInteger(index) || index < 0 || index >= panels.length) return;
      current = index;
      panels.forEach((panel, position) => { panel.hidden = position !== index; });
      buttons.forEach((button, position) => {
        if (position === index) button.setAttribute('aria-current', 'step');
        else button.removeAttribute('aria-current');
      });
      // aria-disabled preserves focus when reaching an endpoint; handlers guard it.
      previous.setAttribute('aria-disabled', String(index === 0));
      next.setAttribute('aria-disabled', String(index === panels.length - 1));
      if (announce) status.textContent = `Step ${index + 1} of ${panels.length}: ${panels[index].dataset.stepTitle}`;
    };
    buttons.forEach((button, index) => button.addEventListener('click', () => { if (index !== current) select(index); }));
    previous.addEventListener('click', () => { if (current > 0) select(current - 1); });
    next.addEventListener('click', () => { if (current < panels.length - 1) select(current + 1); });
    select(0, false);
    selectors.hidden = false;
    navigation.hidden = false;
    root.dataset.enhanced = 'true';
  });
}
