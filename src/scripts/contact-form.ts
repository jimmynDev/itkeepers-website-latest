import { normalizeContactIntent, contactSubmitLabel, contactFieldError, validateServiceInterests, composeInquiryEmail, type InquiryField } from '../data/inquiry';
import { contactEmail } from '../data/contact';
export { normalizeContactIntent, contactSubmitLabel, contactFieldError, validateServiceInterests, inquiryLimits as contactLimits } from '../data/inquiry';

/** The endpoint must return application/json with { ok: true } after durable delivery. */
export function initializeContactForms(scope: ParentNode = document): void {
  scope.querySelectorAll<HTMLFormElement>('form[data-inquiry-form]').forEach(form => {
    if (form.dataset.inquiryInitialized) return;
    const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    const status = form.querySelector<HTMLElement>('[data-inquiry-status]');
    const live = form.closest<HTMLElement>('.inquiry-widget')?.querySelector<HTMLElement>('[data-inquiry-live]');
    const success = form.closest<HTMLElement>('.inquiry-widget')?.querySelector<HTMLElement>('[data-inquiry-success]');
    const fields = [...form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('.inquiry-field input, .inquiry-field textarea')];
    const chips = [...form.querySelectorAll<HTMLButtonElement>('button[data-interest]')];
    if (!button || !status || !live) return;
    const action = form.getAttribute('action');
    const endpoint = form.dataset.inquiryDelivery === 'backend' && action && /^\/(?!\/)[a-zA-Z0-9/_-]+$/.test(action) && action !== '/contact' ? action : null;

    const compact = form.dataset.inquiryMode === 'review';
    const intent = compact ? 'review' : normalizeContactIntent(new URL(window.location.href).searchParams.get('type'));
    const intentInput = form.querySelector<HTMLInputElement>('input[name="type"]');
    if (intentInput) intentInput.value = intent;
    if (!compact && intent === 'review') {
      const message = form.querySelector<HTMLTextAreaElement>('textarea[name="message"]');
      if (message && !message.value.trim()) message.value = "I'd like a free IT review.";
    }
    button.textContent = endpoint ? contactSubmitLabel(intent) : 'Continue to email';

    const controller = new AbortController();
    const options = { signal: controller.signal };
    form.dataset.inquiryInitialized = 'true';

    const validate = (field: HTMLInputElement | HTMLTextAreaElement): boolean => {
      const name = field.name as InquiryField;
      const error = form.querySelector<HTMLElement>('[data-field-error="' + name + '"]');
      if (!error) return true;
      const message = contactFieldError(name, field.value, name === 'email' && field.validity.typeMismatch);
      error.textContent = message;
      error.hidden = !message;
      if (message) field.setAttribute('aria-invalid', 'true');
      else field.removeAttribute('aria-invalid');
      return !message;
    };
    const syncChips = (): void => {
      chips.forEach(chip => {
        const input = form.querySelector<HTMLInputElement>('input[name="interests"][value="' + chip.dataset.interest + '"]');
        chip.setAttribute('aria-pressed', input?.checked ? 'true' : 'false');
      });
    };
    chips.forEach(chip => chip.addEventListener('click', () => {
      const input = form.querySelector<HTMLInputElement>('input[name="interests"][value="' + chip.dataset.interest + '"]');
      if (!input) return;
      input.checked = !input.checked;
      if (input.checked) {
        form.querySelectorAll<HTMLInputElement>('input[name="interests"]').forEach(other => {
          if (input.value === 'not-sure' ? other !== input : other.value === 'not-sure') other.checked = false;
        });
      }
      syncChips();
    }, options));
    syncChips();

    fields.forEach(field => {
      field.addEventListener('blur', () => { validate(field); }, options);
      field.addEventListener('input', () => { if (field.hasAttribute('aria-invalid')) validate(field); }, options);
    });

    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (button.disabled) return;
      const invalid = fields.filter(field => !validate(field));
      if (invalid.length) {
        status.textContent = 'Please correct the highlighted fields before sending.';
        invalid[0].focus();
        return;
      }
      try {
        selectedServiceInterests(form);
      } catch {
        status.textContent = 'Please review your selected services.';
        return;
      }
      if (!endpoint) {
        const data = new FormData(form);
        const values = Object.fromEntries(['name','email','company','phone','message'].map(name => [name, String(data.get(name) ?? '')])) as Record<InquiryField,string>;
        status.textContent = 'Your email app will open. Review and send your message there.';
        window.location.assign(composeInquiryEmail(contactEmail.display, values, intent, data.getAll('interests')));
        return;
      }
      status.textContent = 'Sending your message…';
      button.disabled = true;
      form.setAttribute('aria-busy', 'true');
      // Keep the entered details available for retry if the endpoint stalls.
      const requestController = new AbortController();
      const abortRequest = (): void => requestController.abort();
      controller.signal.addEventListener('abort', abortRequest, { once: true });
      const timeout = window.setTimeout(abortRequest, 15000);
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
          credentials: 'same-origin',
          redirect: 'error',
          signal: requestController.signal
        });
        const isJson = response.headers.get('content-type')?.toLowerCase().includes('application/json');
        const result: unknown = response.ok && isJson ? await response.json() : null;
        if (!response.ok || !result || typeof result !== 'object' || !('ok' in result) || result.ok !== true || !success) throw new Error('Delivery not confirmed');
        live.hidden = true;
        success.hidden = false;
        status.textContent = '';
        success.focus?.();
      } catch {
        if (controller.signal.aborted) return;
        status.textContent = 'We could not confirm delivery. Please try again or contact our team using the contact details.';
        status.focus();
      } finally {
        window.clearTimeout(timeout);
        controller.signal.removeEventListener('abort', abortRequest);
        form.removeAttribute('aria-busy');
        button.disabled = false;
      }
    }, options);
    document.addEventListener('astro:before-swap', () => controller.abort(), { once: true });
  });
}

/** Structured selections for the receiving API; validate these again on the server. */
export function selectedServiceInterests(form: HTMLFormElement): string[] {
  return validateServiceInterests(new FormData(form).getAll('interests'));
}
