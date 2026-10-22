type Widget = {
  render: (target: HTMLElement, options: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};
declare global { interface Window { turnstile?: Widget } }
let loading: Promise<Widget> | undefined;
function load(): Promise<Widget> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!loading) loading = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.onload = () => window.turnstile ? resolve(window.turnstile) : reject(new Error('verification unavailable'));
    script.onerror = () => reject(new Error('verification unavailable'));
    document.head.append(script);
  });
  return loading;
}
/** Loaded only for the separately enabled backend build. No secrets or test bypasses. */
export function createInquiryVerification(form: HTMLFormElement, status: HTMLElement) {
  let widget: Widget | undefined; let id: string | undefined; let token = ''; let disposed = false;
  const target = form.querySelector<HTMLElement>('[data-inquiry-verification]');
  const unavailable = () => {
    if (disposed) return;
    token = '';
    status.textContent = 'Security verification is unavailable. Please use the email or telephone contact options.';
  };
  if (target && form.dataset.turnstileSitekey) void load().then(api => {
    if (disposed) return;
    widget = api;
    id = api.render(target, {
      sitekey: form.dataset.turnstileSitekey, action: 'inquiry', theme: 'auto', size: 'compact',
      callback: (value: string) => { token = value; },
      'expired-callback': () => { token = ''; status.textContent = 'Security verification expired. Please complete it again before sending.'; },
      'error-callback': unavailable,
    });
  }).catch(unavailable);
  else unavailable();
  return {
    token: () => token,
    reset() { token = ''; if (widget && id !== undefined) widget.reset(id); },
    dispose() { disposed = true; token = ''; if (widget && id !== undefined) widget.remove(id); },
  };
}
