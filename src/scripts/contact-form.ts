import { normalizeContactIntent,contactSubmitLabel,contactFieldError,validateServiceInterests,type InquiryField } from '../data/inquiry';
export { normalizeContactIntent,contactSubmitLabel,contactFieldError,validateServiceInterests,inquiryLimits as contactLimits } from '../data/inquiry';
/** Both layouts stay disabled until a real shared delivery system exists. */
export function initializeContactForms(scope: ParentNode=document): void {
  scope.querySelectorAll<HTMLFormElement>('form[data-inquiry-form]').forEach(form=>{
    if(form.dataset.inquiryInitialized)return;
    const compact=form.dataset.inquiryMode==='review';
    const button=form.querySelector<HTMLButtonElement>('button[type="submit"]');
    const status=form.querySelector<HTMLElement>('[data-inquiry-status]');
    const fields=[...form.querySelectorAll<HTMLInputElement|HTMLTextAreaElement>('.inquiry-field input,.inquiry-field textarea')];
    const radios=[...form.querySelectorAll<HTMLInputElement>('input[type="radio"][name="intent"]')];
    const interests=[...form.querySelectorAll<HTMLInputElement>('input[type="checkbox"][name="interests"]')];
    if(!button||!status||fields.length!==(compact?4:5))return;
    form.dataset.inquiryInitialized='true';
    button.disabled=true;
    const controller=new AbortController();
    const options={signal:controller.signal};
    const setIntent=()=>{
      const intent=compact?'review':normalizeContactIntent(radios.find(input=>input.checked)?.value);
      button.textContent=contactSubmitLabel(intent);
    };
    if(!compact){const intent=normalizeContactIntent(new URL(window.location.href).searchParams.get('intent'));radios.forEach(input=>{input.checked=input.value===intent;});}
    setIntent();
    const validate=(field:HTMLInputElement|HTMLTextAreaElement)=>{
      const name=field.name as InquiryField;
      const error=form.querySelector<HTMLElement>(`[data-field-error="${name}"]`)!;
      const message=contactFieldError(name,field.value,name==='email'&&field.validity.typeMismatch);
      error.textContent=message;error.hidden=!message;
      if(message)field.setAttribute('aria-invalid','true');else field.removeAttribute('aria-invalid');
    };
    form.addEventListener('submit',event=>{event.preventDefault();button.disabled=true;status.textContent='Online requests are unavailable. Please contact us by phone or email. Your details have not been sent.';},options);
    radios.forEach(input=>input.addEventListener('change',setIntent,options));
    interests.forEach(input=>input.addEventListener('change',()=>{
      if(!input.checked)return;
      interests.forEach(other=>{if(input.value==='not-sure'?other!==input:other.value==='not-sure')other.checked=false;});
      validateServiceInterests(interests.filter(item=>item.checked).map(item=>item.value));
    },options));
    fields.forEach(field=>{
      field.addEventListener('blur',()=>validate(field),options);
      field.addEventListener('input',()=>{if(field.hasAttribute('aria-invalid'))validate(field);},options);
    });
    document.addEventListener('astro:before-swap',()=>controller.abort(),{once:true});
  });
}
/** Validated structured selections, ready for future shared endpoint integration. */
export function selectedServiceInterests(form:HTMLFormElement): string[] {
  return validateServiceInterests(new FormData(form).getAll('interests'));
}
