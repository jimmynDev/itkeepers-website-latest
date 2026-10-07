/** Fictional context checks, never a verdict that a message is safe. */
export type PhishingScenario = {
  id: string;
  sender: string;
  address: string;
  subject: string;
  body: string;
  checks: { label: string; detail: string }[];
  options: { id: string; label: string; response: string; explanation: string }[];
};

export const phishingScenarios: PhishingScenario[] = [
  {
    id: 'account', sender: 'Work account desk', address: 'access@northline-account.example',
    subject: 'Confirm your account before 5pm',
    body: 'Your work account will be suspended at 5pm. Use the sign-in link in this message to keep access to your files.',
    checks: [
      { label: 'Sender context', detail: 'Check the request through your usual IT contact or sign-in page.' },
      { label: 'Request urgency', detail: 'A deadline is a reason to pause, rather than skip verification.' }
    ],
    options: [
      { id: 'open', label: 'Open the sign-in link', response: 'There’s something worth checking first.', explanation: 'ITKeepers would check the account context through a known channel before anyone uses an unfamiliar sign-in link.' },
      { id: 'verify', label: 'Check the request another way', response: 'That gives you useful context.', explanation: 'Your usual sign-in page or known IT contact can help confirm whether the request is expected. ITKeepers would connect that context with the message.' },
      { id: 'involve', label: 'Send it to IT to verify', response: 'You can bring the team into this.', explanation: 'ITKeepers would check the message against the account context without asking you to follow an unfamiliar link.' }
    ]
  },
  {
    id: 'invoice', sender: 'Elena — Cedar Field Supplies', address: 'billing@cedarfield-payments.example',
    subject: 'Invoice 0842 — updated bank details',
    body: 'Please pay invoice 0842 today using the new bank details in the attachment. Our usual account is no longer available.',
    checks: [
      { label: 'Payment details', detail: 'A changed bank account needs independent verification before payment.' },
      { label: 'Known communication channel', detail: 'Use a supplier number already on record, not one in this message.' }
    ],
    options: [
      { id: 'pay', label: 'Pay using the new details', response: 'The change is worth checking first.', explanation: 'ITKeepers would investigate the message. Your payment owner still needs to verify and approve the bank change through the usual process.' },
      { id: 'call', label: 'Call using a number we already have', response: 'That gives you an independent check.', explanation: 'Confirm the change with the supplier through a known contact. ITKeepers can help investigate the message if anything remains uncertain.' },
      { id: 'involve', label: 'Send the change to IT to check', response: 'The team can help check the context.', explanation: 'ITKeepers would investigate the message, while your payment owner independently verifies and approves any change to bank details.' }
    ]
  },
  {
    id: 'shared-file', sender: 'Ana — Northline Studio', address: 'ana@northline.example',
    subject: 'Planning notes for tomorrow',
    body: 'Hi, the planning notes are ready in the shared folder. Open the file from this message before tomorrow’s meeting.',
    checks: [
      { label: 'Expected share', detail: 'Confirm with Ana through your usual conversation that the file was sent.' },
      { label: 'Access context', detail: 'Check the share against your familiar file-sharing environment.' }
    ],
    options: [
      { id: 'open', label: 'Open the shared file', response: 'Context matters here.', explanation: 'This could be an ordinary request. ITKeepers would check whether the share is expected; a familiar name alone does not verify it.' },
      { id: 'context', label: 'Check that Ana expected to send it', response: 'That adds useful context.', explanation: 'Confirm the share through your usual conversation. ITKeepers would connect that context with the file-sharing environment before drawing a conclusion.' },
      { id: 'involve', label: 'Send the request to IT to verify', response: 'There’s more context to gather.', explanation: 'ITKeepers would check the expected share and relevant access. This message alone does not establish whether it is safe.' }
    ]
  },
  {
    id: 'executive', sender: 'Morgan — Northline Studio', address: 'morgan@northline-office.example',
    subject: 'Quick payment while I’m in a meeting',
    body: 'I’m in a meeting and need you to make an urgent supplier payment. Reply now and I’ll send the account details. Please keep this between us.',
    checks: [
      { label: 'Identity and context', detail: 'Confirm with Morgan using a contact method you already trust.' },
      { label: 'Usual approval process', detail: 'Urgency or seniority should not bypass your payment approvals.' }
    ],
    options: [
      { id: 'reply', label: 'Reply and ask for the payment details', response: 'There’s a reason to pause first.', explanation: 'ITKeepers would help verify the sender and request. Your payment owner should confirm the context before acting on new payment instructions.' },
      { id: 'confirm', label: 'Contact Morgan through our usual channel', response: 'That gives you a separate check.', explanation: 'Confirm the request through a contact you already know, then follow the usual payment approvals. ITKeepers can investigate anything that does not fit.' },
      { id: 'involve', label: 'Ask IT and the payment owner to check', response: 'You can involve the people who know.', explanation: 'ITKeepers would help check the message context, while your payment owner verifies the request through the normal approval process.' }
    ]
  }
];
