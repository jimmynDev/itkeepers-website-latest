import { contactFieldError, type InquiryField } from './inquiry';

// Owner-provided public form ID, not an API key. No other destination is allowed.
export const formspreeEndpoint = 'https://formspree.io/f/mrppzvpo';
export const formspreeAcceptedMessage = 'Formspree accepted your message. Thank you.';
export const formspreeSubject = (intent: 'general' | 'review') => intent === 'review' ? 'ITKeepers — Free IT consultation request' : 'ITKeepers — Website inquiry';
export const formspreeSuccessMessage = (intent: 'general' | 'review') => intent === 'review'
  ? 'Formspree accepted your consultation request. This does not confirm inbox delivery or schedule an appointment.'
  : formspreeAcceptedMessage;

export function formspreePayload(data: FormData, intent: 'general' | 'review', compact: boolean): FormData {
  const payload = new FormData();
  for (const name of ['name','email','company','phone','message'] as InquiryField[]) {
    const value = data.get(name) ?? '';
    if (typeof value !== 'string' || contactFieldError(name, value, name === 'email' && !/^[^\s@]+@[^\s@]+$/.test(value.trim()))) throw new Error('Check your contact details.');
    payload.set(name, name === 'email' ? value.trim() : value);
  }
  const gotcha = data.get('_gotcha') ?? '';
  if (typeof gotcha !== 'string' || gotcha.trim()) throw new Error('This request could not be submitted. Please use email or telephone.');
  payload.set('_gotcha', gotcha);
  payload.set('type', intent);
  payload.set('form_kind', compact ? 'review' : 'contact');
  payload.set('_subject', formspreeSubject(compact ? 'review' : intent));
  return payload;
}

type ProviderError = { field?: string; message: string; code?: string };
export function formspreeErrors(value: unknown): ProviderError[] {
  if (!value || typeof value !== 'object') return [];
  const body = value as { errors?: unknown; error?: unknown };
  if (Array.isArray(body.errors)) return body.errors.flatMap(error => {
    if (!error || typeof error !== 'object') return [];
    const item = error as Record<string, unknown>;
    return [{ field: typeof item.field === 'string' ? item.field : undefined,
      code: typeof item.code === 'string' ? item.code : undefined,
      message: typeof item.message === 'string' ? item.message.slice(0, 400) : 'Please check this field.' }];
  });
  return typeof body.error === 'string' ? [{ message: body.error.slice(0, 400) }] : [];
}

export function formspreeAccepted(status: number, value: unknown): boolean {
  if (status < 200 || status >= 300 || !value || typeof value !== 'object') return false;
  const body = value as Record<string, unknown>;
  // Formspree's current client contract uses `next`; some responses include `ok`.
  // Never follow `next`, or mistake a hosted verification response for acceptance.
  return body.ok !== false && !('error' in body) && !('errors' in body)
    && !(typeof body.next === 'string' && /captcha|challenge|verify/i.test(body.next))
    && (body.ok === true || (typeof body.next === 'string' && body.next.length > 0));
}

export function formspreeFailure(status: number, value: unknown): { message: string; verification: boolean } {
  const errors = formspreeErrors(value);
  const next = value && typeof value === 'object' && 'next' in value ? String(value.next) : '';
  const verification = status === 403 || /captcha|challenge|verify/i.test(next) || errors.some(error => /captcha|challenge|spam|robot|blocked/i.test([error.code, error.field, error.message].join(' ')));
  if (status === 429) return { message:'Formspree is limiting requests. Please wait before trying again, or contact us by email or telephone.', verification:false };
  if (verification) return { message:'Formspree requires verification or rejected this request as spam. You can continue on Formspree to complete any required check, or use email or telephone.', verification:true };
  if (status === 401 || status === 404 || errors.some(error => ['INACTIVE','FORM_NOT_FOUND','PROJECT_NOT_FOUND'].includes(error.code ?? ''))) return { message:'The Formspree form is unavailable or not ready to accept submissions. Please use email or telephone.', verification:false };
  if ([400,422].includes(status)) return { message:'Formspree could not accept these details. Please check your details and any highlighted fields, or use email or telephone.', verification:false };
  return { message:'We could not confirm whether Formspree accepted your message. Your details are still here. Check before resending, or contact us by email or telephone.', verification:false };
}
