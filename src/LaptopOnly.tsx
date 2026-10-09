import React,{useSyncExternalStore} from 'react';
import './laptop-only.css';

/* Preserve the full demo above the phone cutoff. Callers can supply a phone
   presentation; other demos keep the original note without mounting children. */
const PHONE='(max-width: 760px)';
const subscribe=(cb:()=>void)=>{const mq=window.matchMedia(PHONE);mq.addEventListener('change',cb);return()=>mq.removeEventListener('change',cb)};
export const usePhone=()=>useSyncExternalStore(subscribe,()=>window.matchMedia(PHONE).matches,()=>false);

export default function LaptopOnly({children,mobile}:{children:React.ReactNode;mobile?:React.ReactNode}){
 if(!usePhone())return <>{children}</>;
 if(mobile)return <>{mobile}</>;
 return <p className="laptopOnly">
  <svg viewBox="0 0 32 22" aria-hidden="true"><rect x="5" y="2" width="22" height="14" rx="1.6"/><path d="M2 19.5h28"/></svg>
  <span>Open this page on a laptop to try the demo.</span>
 </p>;
}
