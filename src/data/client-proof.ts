/** Populate only with exact, approved client content and permitted media. */
export type ClientVideo = {
  id:string;
  label:string;
  approved:boolean;
  sources:{src:string;type:'video/mp4'|'video/webm'}[];
  poster?:string;
  captions:{src:string;srclang:string;label:string}[];
  transcript?:string;
};
export type ClientQuote = { id:string;approved:boolean;quote?:string;attribution?:{name?:string;role?:string;company?:string} };
export const videoTestimonials:ClientVideo[] = Array.from({length:5},(_,i)=>({id:`client-video-${i+1}`,label:`Video ${String(i+1).padStart(2,'0')}`,approved:false,sources:[],captions:[]}));
export const textTestimonials:ClientQuote[] = Array.from({length:4},(_,i)=>({id:`client-quote-${i+1}`,approved:false}));
export const videoReady = (item:ClientVideo) => Boolean(item.approved&&item.sources.length&&item.poster&&item.captions.length&&item.transcript);
