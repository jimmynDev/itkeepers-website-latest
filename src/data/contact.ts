/** Emergency number supplied and authorized by the project owner on 2026-10-05. */
export const emergencyPhone = { display:'+961 81 816 761', href:'tel:+96181816761' } as const;

/** Jim approved this number for general inquiries on 2026-10-12. */
export const businessPhone = emergencyPhone;
/** Verified US office number supplied and authorized by Jim on 2026-10-28. */
export const usBusinessPhone = { display:'+1 561 600-9940', href:'tel:+15616009940' } as const;
/** General business email supplied and authorized by Jim on 2026-10-12. */
export const contactEmail = { display:'info@itkeepers.com', href:'mailto:info@itkeepers.com' } as const;

/** Owner confirmed this fixed form recipient on 2026-10-20 (Phase 5.4).
 * Separate from displayed contact details: no visitor or marketing-email change can reroute submissions.
 * Cloudflare destination verification and controlled inbox receipt are separate release gates.
 */
export const contactFormRecipient = 'info@itkeepers.com' as const;

/** Footer support email approved by Jim on 2026-10-13. */
export const supportEmail = { display:'support@itkeepers.com', href:'mailto:support@itkeepers.com' } as const;
