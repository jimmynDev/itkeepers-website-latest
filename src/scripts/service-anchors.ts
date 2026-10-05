/** Preserve old fragments without any service-selection state or controls. */
export function mountServiceAnchors(): void {
  const aliases: Record<string, string> = {
    'managed-it': 'managed', 'microsoft-365-cloud': 'cloud', 'microsoft-cloud': 'cloud',
    cybersecurity: 'security', 'networking-infrastructure': 'networking',
    backup: 'managed', 'backup-disaster-recovery': 'managed', 'backup-recovery': 'managed', 'ai-automation': 'ai',
  };
  const navigate = () => {
    let hash: string;
    try { hash = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    if (hash === 'ai-automation-details' || hash === 'web-design-hosting-details') {
      const slug = hash === 'ai-automation-details' ? 'ai-automation' : 'web-design-hosting';
      location.replace(`/services/${slug}/#${hash}`);
      return;
    }
    const key = hash.startsWith('services/') ? hash.slice(9) : hash.replace(/^offering-/, '');
    const destination = hash === 'all-services-heading' ? 'services' : aliases[key] ? `services/${aliases[key]}` : hash;
    if (destination !== hash) document.getElementById(destination)?.scrollIntoView({ block: 'start' });
  };
  window.addEventListener('hashchange', navigate);
  navigate();
}
