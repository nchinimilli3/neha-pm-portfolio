import React,{useSyncExternalStore} from 'react';
import './laptop-only.css';

/* Interactive demos are built for a laptop screen and can't be shown cleanly on
   a phone, so on phone widths they're replaced by a short note (and never mounted). */
const PHONE='(max-width: 760px)';
const subscribe=(cb:()=>void)=>{const mq=window.matchMedia(PHONE);mq.addEventListener('change',cb);return()=>mq.removeEventListener('change',cb)};
export const usePhone=()=>useSyncExternalStore(subscribe,()=>window.matchMedia(PHONE).matches,()=>false);

export default function LaptopOnly({children}:{children:React.ReactNode}){
 if(!usePhone())return <>{children}</>;
 return <p className="laptopOnly">
  <svg viewBox="0 0 32 22" aria-hidden="true"><rect x="5" y="2" width="22" height="14" rx="1.6"/><path d="M2 19.5h28"/></svg>
  <span>Open this page on a laptop to try the demo.</span>
 </p>;
}
