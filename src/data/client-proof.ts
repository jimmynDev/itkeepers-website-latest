/** Populate only with exact, approved client content and permitted media. */
export type ClientVideo = {
  id:string;
  label:string;
  /** Publication approval covers the label, poster and supplied media. */
  approved:boolean;
  sources:{src:string;type:'video/mp4'|'video/webm'}[];
  poster?:string;
  captions:{src:string;srclang:string;label:string}[];
  transcript?:string;
};
export type ClientQuote = {
  id:string;
  /** Approval covers the exact quote, including its punctuation. */
  approved:boolean;
  quote?:string;
  /** True when the approved wording is an excerpt from a longer testimonial. */
  excerpt?:boolean;
  attribution?:{
    /** Confirm permission for every populated attribution field before enabling. */
    publicationApproved?:boolean;
    name?:string;
    role?:string;
    company?:string;
  };
};
// No approved video assets have been supplied. Keep this array separate.
export const videoTestimonials:ClientVideo[] = [];
// Exact excerpts and company attributions supplied and authorized by Jim for
// the V2 local visual review on 2026-10-13. No person names, roles or logos.
export const textTestimonials:ClientQuote[] = [
  {
    id:'client-quote-slide-designers',
    approved:true,
    excerpt:true,
    quote:"Amazing service! The team is fast, reliable, and always ready to help. They make IT simple and stress-free — highly recommended!",
    attribution:{company:'Slide Designers',publicationApproved:true},
  },
  {
    id:'client-quote-pfc-international',
    approved:true,
    excerpt:true,
    quote:"Beyond their reliable support, ITKeepers has played a key role in integrating advanced AI tools into our systems, significantly boosting our efficiency and productivity.",
    attribution:{company:'PFC International SAL',publicationApproved:true},
  },
  {
    id:'client-quote-international-maritime-academy',
    approved:true,
    excerpt:true,
    quote:"The team is professional, responsive, and always ready to support with tailored solutions. I've appreciated the smooth communication and the consistency in delivering what we need.",
    attribution:{company:'International Maritime Academy',publicationApproved:true},
  },
  {
    id:'client-quote-msad',
    approved:true,
    excerpt:true,
    quote:"Their swift response to any emergency - even to the slightest issue - proves how professional and dedicated the team is.",
    attribution:{company:'MSAD — Customs Clearance Agency',publicationApproved:true},
  },
];
export const videoReady = (item:ClientVideo) => Boolean(item.approved === true&&item.sources.length&&item.poster&&item.captions.length&&item.transcript);
export const quoteReady = (item:ClientQuote) => item.approved === true && typeof item.quote === 'string' && item.quote.trim().length > 0;
export const approvedAttribution = (item:ClientQuote) => item.attribution?.publicationApproved === true
  ? [item.attribution.name,item.attribution.role,item.attribution.company].filter(Boolean).join(' · ')
  : '';
