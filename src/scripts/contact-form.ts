import { inquiryEndpoint, normalizeContactIntent, contactSubmitLabel, contactFieldError, composeInquiryEmail, type InquiryField } from '../data/inquiry';
import { contactEmail } from '../data/contact';
import { createInquiryVerification } from './inquiry-verification';
import { formspreeEndpoint, formspreePayload, formspreeAccepted, formspreeSuccessMessage, formspreeSubject, formspreeFailure, formspreeErrors } from '../data/formspree';
export { normalizeContactIntent, contactSubmitLabel, contactFieldError, inquiryLimits as contactLimits } from '../data/inquiry';

/** Formspree acceptance is separate from inbox delivery; local APIs never claim receipt. */
export function initializeContactForms(scope: ParentNode = document): void {
  scope.querySelectorAll<HTMLFormElement>('form[data-inquiry-form]').forEach(form => {
    if (form.dataset.inquiryInitialized) return;
    const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    const status = form.querySelector<HTMLElement>('[data-inquiry-status]');
    const fields = [...form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('.inquiry-field input, .inquiry-field textarea')];
    if (!button || !status) return;
    const action = form.getAttribute('action');
    const provider = form.dataset.inquiryDelivery === 'formspree' && action === formspreeEndpoint;
    const endpoint = provider ? formspreeEndpoint : form.dataset.inquiryDelivery === 'backend' && inquiryEndpoint(action) === '/api/contact' ? '/api/contact' : null;
    const nativeButton = form.querySelector<HTMLButtonElement>('[data-formspree-native]');
    const providerFallback = form.querySelector<HTMLElement>('[data-formspree-verification]');
    const errorContacts = form.querySelector<HTMLElement>('[data-inquiry-error-contacts]');
    const intentSelect = form.querySelector<HTMLSelectElement>('[data-inquiry-intent]');
    let sending = false;
    let accepted = false;
    const providerRejected = new WeakSet<HTMLInputElement | HTMLTextAreaElement>();

    const compact = form.dataset.inquiryMode === 'review';
    let intent = compact ? 'review' as const : normalizeContactIntent(new URL(window.location.href).searchParams.get('type'));
    const intentInput = form.querySelector<HTMLInputElement>('input[name="type"]');
    if (intentInput) { intentInput.value = intent; intentInput.disabled = false; }
    if (intentSelect) intentSelect.value = formspreeSubject(intent);
    if (!compact && intent === 'review') {
      const message = form.querySelector<HTMLTextAreaElement>('textarea[name="message"]');
      if (message && !message.value.trim()) message.value = "I'd like a free IT consultation.";
    }
    button.textContent = endpoint ? contactSubmitLabel(intent) : 'Continue to email';
    const markEdited = (): void => {
      if (!accepted) return;
      accepted = false;button.disabled = false;
      if (nativeButton) nativeButton.disabled = false;
      button.textContent = contactSubmitLabel(intent);
      status.dataset.state = 'info';
      status.textContent = 'Your previous message was accepted. Changes have not been sent.';
    };

    // Snapshot before locking: disabled controls are omitted by native form submission.
    let restoreControls: (() => void) | undefined;
    let nativePending = false;
    const lockControls = (nativePayload?: FormData): void => {
      const controls = nativePayload
        ? [...form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('input[name],textarea[name],select[name]')]
        : [...fields, ...(intentSelect ? [intentSelect] : [])];
      const states = controls.map(control => [control, control.disabled] as const);
      const copies: HTMLInputElement[] = [];
      if (nativePayload) {
        for (const [name, value] of nativePayload) {
          if (typeof value !== 'string') continue;
          const copy = document.createElement('input');
          copy.type = 'hidden';copy.name = name;copy.value = value;
          form.append(copy);copies.push(copy);
        }
      }
      controls.forEach(control => { control.disabled = true; });
      restoreControls = () => {
        states.forEach(([control, disabled]) => { control.disabled = disabled; });
        copies.forEach(copy => copy.remove());
        restoreControls = undefined;
      };
    };

    const controller = new AbortController();
    const verification = endpoint && !provider ? createInquiryVerification(form, status) : null;
    let pendingRequest: { data: string; id: string } | undefined;
    const options = { signal: controller.signal };
    form.dataset.inquiryInitialized = 'true';
    form.noValidate = true;
    // Backend native submission remains disabled without JS; direct contacts stay usable.
    button.disabled = false;

    intentSelect?.addEventListener('change', () => {
      if (sending) return;
      intent = intentSelect.value === formspreeSubject('review') ? 'review' : 'general';
      if (intentInput) intentInput.value = intent;
      const message = form.querySelector<HTMLTextAreaElement>('textarea[name="message"]');
      if (message && (!message.value.trim() || message.value === "I'd like a free IT consultation.")) {
        message.value = intent === 'review' ? "I'd like a free IT consultation." : '';
      }
      markEdited();
      button.textContent = endpoint ? contactSubmitLabel(intent) : 'Continue to email';
    }, options);

    // Returning from the external verification page must not leave the cached form locked.
    window.addEventListener('pageshow', () => {
      if (!nativePending) return;
      restoreControls?.();nativePending = false;sending = false;form.noValidate = true;
      form.removeAttribute('aria-busy');button.disabled = false;
      if (nativeButton) nativeButton.disabled = false;
      status.dataset.state = 'error';
      status.textContent = 'Acceptance on Formspree has not been confirmed here. Check before resending, or use email or telephone.';
      if (errorContacts) errorContacts.hidden = false;
    }, options);

    const validate = (field: HTMLInputElement | HTMLTextAreaElement): boolean => {
      providerRejected.delete(field);
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

    fields.forEach(field => {
      // Keep provider feedback stable while a retry click moves focus away.
      // Editing or submitting validates again; blur alone must not move the button.
      field.addEventListener('blur', () => { if (!providerRejected.has(field)) validate(field); }, options);
      field.addEventListener('input', () => {
        if (field.hasAttribute('aria-invalid')) validate(field);
        markEdited();
      }, options);
    });

    form.addEventListener('submit', async event => {
      const nativeAttempt = provider && (event as SubmitEvent).submitter === nativeButton;
      if (!nativeAttempt) event.preventDefault();
      if (button.disabled || sending || accepted) { event.preventDefault(); return; }
      const invalid = fields.filter(field => !validate(field));
      if (invalid.length) {
        event.preventDefault();
        status.dataset.state = 'error';
        status.textContent = endpoint ? 'Please correct the highlighted fields before sending.' : 'Please correct the highlighted fields before opening your email app.';
        if (errorContacts) errorContacts.hidden = false;
        invalid[0].focus();
        return;
      }
      let providerData: FormData | undefined;
      if (provider) {
        try { providerData = formspreePayload(new FormData(form), intent, compact); }
        catch (error) {
          event.preventDefault();status.dataset.state = 'error';
          status.textContent = error instanceof Error ? error.message : 'Please check your details.';
          if (errorContacts) errorContacts.hidden = false;
          status.focus();return;
        }
        if (nativeAttempt) {
          form.noValidate = false;
          if (!form.reportValidity()) { event.preventDefault();return; }
          lockControls(providerData);nativePending = true;
          sending = true;button.disabled = true;
          if (nativeButton) nativeButton.disabled = true;
          form.setAttribute('aria-busy','true');status.dataset.state = 'loading';
          if (errorContacts) errorContacts.hidden = true;
          status.textContent = 'Opening Formspree for verification. Acceptance has not been confirmed.';
          return; // User explicitly chose native HTTPS POST; provider handles its challenge/confirmation.
        }
      }
      if (!endpoint) {
        const data = new FormData(form);
        const values = Object.fromEntries(['name','email','company','phone','message'].map(name => [name, String(data.get(name) ?? '')])) as Record<InquiryField,string>;
        status.textContent = 'Your email app will open. Review and send your message there. Nothing is sent by this website.';
        window.location.assign(composeInquiryEmail(contactEmail.display, values, intent));
        return;
      }
      const token = verification?.token();
      if (!provider && !token) {
        status.textContent = 'Please complete security verification, or use the email or telephone contact options.';
        if (errorContacts) errorContacts.hidden = false;
        status.focus();
        return;
      }
      const payload = providerData ?? new FormData(form);
      if (!provider) {
        const fingerprint = JSON.stringify([...payload].filter(([name]) => !['cf-turnstile-response', 'request_id'].includes(name)));
        if (!pendingRequest || pendingRequest.data !== fingerprint) pendingRequest = { data: fingerprint, id: crypto.randomUUID() };
        payload.set('request_id', pendingRequest.id);
        payload.set('cf-turnstile-response', token!);
      }
      status.textContent = 'Sending your message…';
      status.dataset.state = 'loading';sending = true;
      lockControls();
      if (errorContacts) errorContacts.hidden = true;
      button.disabled = true;
      const submitLabel = button.textContent;
      button.textContent = 'Sending…';
      if (nativeButton) nativeButton.disabled = true;
      if (providerFallback) providerFallback.hidden = true;
      form.setAttribute('aria-busy', 'true');
      // Keep the entered details available for retry if the endpoint stalls.
      const requestController = new AbortController();
      const abortRequest = (): void => requestController.abort();
      controller.signal.addEventListener('abort', abortRequest, { once: true });
      const timeout = window.setTimeout(abortRequest, 15000);
      let failureMessage = provider ? formspreeFailure(0, null).message : 'We could not confirm acceptance. Please contact our team by email or telephone before resending.';
      let firstProviderField: HTMLInputElement | HTMLTextAreaElement | undefined;
      let allowNative = false;
      let providerResponded = false;
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          body: payload,
          headers: { Accept: 'application/json' },
          mode: 'cors',
          credentials: provider ? 'omit' : 'same-origin',
          redirect: 'error',
          signal: requestController.signal
        });
        providerResponded = true;
        const isJson = response.headers.get('content-type')?.toLowerCase().includes('application/json');
        const result: unknown = isJson ? await response.json() : null;
        if (provider) {
          if (formspreeAccepted(response.status, result)) {
            accepted = true;status.dataset.state = 'success';
            status.textContent = formspreeSuccessMessage(intent);
            status.focus();return;
          }
          const failure = formspreeFailure(response.status, result);
          failureMessage = failure.message;allowNative = failure.verification || (!isJson && response.ok);
          for (const error of formspreeErrors(result)) {
            const field = fields.find(item => item.name === error.field);
            if (!field) continue;
            providerRejected.add(field);
            const message = form.querySelector<HTMLElement>('[data-field-error="' + field.name + '"]');
            if (message) { message.textContent = error.message;message.hidden = false; }
            field.setAttribute('aria-invalid','true');firstProviderField ??= field;
          }
          throw new Error('Formspree did not confirm acceptance');
        }
        if (response.status === 429) failureMessage = 'Too many requests. Please wait or use the email or telephone contact options.';
        if (response.status === 400) failureMessage = 'We could not verify your request. Please check your details and complete security verification again.';
        if (response.status === 503 && result && typeof result === 'object' && 'code' in result
          && ['contact_unavailable', 'submission_not_stored'].includes(String(result.code))) {
          failureMessage = 'Online submissions are unavailable. Your message has not been saved or sent. Please use email or telephone.';
        }
        // Even a stray 2xx/legacy email response cannot hide the form or claim receipt.
        // Add success handling only alongside an approved durable storage/delivery contract.
        throw new Error('Submission not confirmed');
      } catch {
        if (controller.signal.aborted) return;
        restoreControls?.();
        verification?.reset();
        status.dataset.state = 'error';
        status.textContent = failureMessage;
        if (errorContacts) errorContacts.hidden = false;
        if (providerFallback) providerFallback.hidden = !(allowNative || (provider && !providerResponded));
        if (firstProviderField) firstProviderField.focus();else status.focus();
      } finally {
        window.clearTimeout(timeout);
        controller.signal.removeEventListener('abort', abortRequest);
        restoreControls?.();
        form.removeAttribute('aria-busy');
        sending = false;button.disabled = accepted;
        button.textContent = accepted ? 'Message accepted' : submitLabel;
        if (nativeButton) nativeButton.disabled = accepted;
      }
    }, options);
    document.addEventListener('astro:before-swap', () => { controller.abort(); verification?.dispose(); }, { once: true });
  });
}
