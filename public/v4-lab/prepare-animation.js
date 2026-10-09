// Lab-only accessibility integration. The existing lifecycle owns this button.
document.querySelectorAll('.v4-animation [data-animation="managed-dashboard"]').forEach(root => {
  if (root.querySelector('[data-animation-toggle]')) return;
  root.setAttribute('role', 'group');
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'v4-animation-toggle';
  button.dataset.animationToggle = '';
  button.hidden = true;
  button.textContent = 'Pause animation';
  root.append(button);
});
document.querySelector('.v4-menu')?.addEventListener('keydown', event => {
  const menu = event.currentTarget;
  if (event.key === 'Escape' && menu.open) {
    menu.open = false;
    menu.querySelector('summary').focus();
  }
});
