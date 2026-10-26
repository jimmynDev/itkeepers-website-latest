export type InquiryIntent = 'review' | 'general';
export type InquiryField = 'name' | 'email' | 'company' | 'phone' | 'message';
/** Build and browser must agree on a same-origin delivery path, never the contact page. */
export function inquiryEndpoint(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const path = value.trim();
  return /^\/(?!\/)[a-zA-Z0-9/_-]+$/.test(path)
    && !/^\/contact\/*$/i.test(path) ? path : null;
}
export const inquiryLimits: Record<InquiryField,number> = { name:120,email:254,company:160,phone:40,message:3000 };
export const serviceInterests = [
  { value:'managed-it', label:'Managed IT' },
  { value:'cybersecurity', label:'Cybersecurity' },
  { value:'microsoft-cloud', label:'Microsoft 365 and Cloud' },
  { value:'networks-infrastructure', label:'Networking and Infrastructure' },
  { value:'backup-recovery', label:'Backup and Disaster Recovery' },
  { value:'ai-automation', label:'AI and Automation' },
  { value:'web-design-hosting', label:'Web Design and Hosting' },
  { value:'not-sure', label:'Not sure yet' }
] as const;
export function normalizeContactIntent(value: unknown): InquiryIntent { return value === 'review' ? 'review' : 'general'; }
export function contactSubmitLabel(intent: InquiryIntent): string { return intent === 'review' ? 'Request my free IT consultation' : 'Send my message'; }
/** Encode all visitor text inside one body parameter, never as mail headers. */
export function composeInquiryEmail(recipient: string, fields: Record<InquiryField,string>, intent: InquiryIntent): string {
  const subject = intent === 'review' ? 'Free IT consultation request' : 'General inquiry';
  const lines = [
    `Full name: ${fields.name.trim()}`,
    `Work email: ${fields.email.trim()}`,
    ...(fields.company.trim() ? [`Company: ${fields.company.trim()}`] : []),
    ...(fields.phone.trim() ? [`Phone: ${fields.phone.trim()}`] : []),
    `Inquiry type: ${intent}`,
    '', 'How can we help?', fields.message.trim().replace(/\r?\n/g, '\r\n')
  ];
  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\r\n'))}`;
}
/** Bound legacy service-interest fields retained by the disabled first-party endpoint. */
export function validateServiceInterests(values: unknown[]): string[] {
  if(values.some(value=>typeof value!=='string'||!serviceInterests.some(item=>item.value===value))) throw new Error('Unsupported service interest.');
  const result=[...new Set(values as string[])];
  if(result.includes('not-sure')&&result.length>1) throw new Error('Choose services or Not sure yet.');
  return result;
}
export function contactFieldError(field: InquiryField,value: string,emailTypeMismatch=false): string {
  const required: Partial<Record<InquiryField,string>> = {name:'Enter your full name.',email:'Enter your work email.',message:'Tell us briefly how we can help.'};
  if(!value.trim()&&required[field])return required[field]!;
  if(value.length>inquiryLimits[field])return `Use ${inquiryLimits[field]} characters or fewer.`;
  if(field==='email'&&emailTypeMismatch)return 'Enter a valid email address, for example name@company.com.';
  return '';
}
