import React from 'react';
import {flushSync} from 'react-dom';
import './case-brand.css';

/* A case study is a window on the Neha OS desktop, maximized. The window bar is
   Neha OS chrome (red closes it); inside, the page takes on that company's
   palette and type voice, which live in case-brand.css. */

const asset=(src:string)=>{const clean=src.replace(/^\/+/,'');return import.meta.env.DEV?`/${clean}`:`${import.meta.env.BASE_URL}${clean}`};

export const CASE_FILES:Record<string,string>={
 fcvf:'customer-value-framework',accenture:'trainer-matching.app',finsimple:'previous-estimates',kohler:'ship-anywhere',
 marketExpansion:'market-scorecard.xlsx',estee:'double-wear',commute:'commute.app',bookclub:'bookclub — live',
 scheduler:'scheduler.html',chat:'imessage.html'
};

/* Grow a desktop window (or a fun-build window) into the full-screen case,
   then hand off to the router. */
export function maximizeInto(from:Element|null|undefined,id:string,go:()=>void){
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(!from||reduce){go();return}
 // Preferred: a native view transition. The browser morphs the window into the
 // full-screen case (and its title bar into the case's bar) on the compositor.
 const vt=(document as Document&{startViewTransition?:(update:()=>void)=>unknown}).startViewTransition;
 if(typeof vt==='function'){
  const win=from as HTMLElement,bar=win.querySelector<HTMLElement>('.dhWinBar,.osWinBar');
  win.style.viewTransitionName='case-window';
  if(bar)bar.style.viewTransitionName='case-bar';
  const t=vt.call(document,()=>{flushSync(go);window.scrollTo({top:0,behavior:'instant' as ScrollBehavior})});
  tagTransition(t,'max');
  return;
 }
 const r=from.getBoundingClientRect();
 const g=document.createElement('div');
 g.className=`maxGhost case-${id}`;
 g.setAttribute('aria-hidden','true');
 g.innerHTML='<div class="maxGhostBar"><i></i><i></i><i></i><span></span></div>';
 g.querySelector('span')!.textContent=CASE_FILES[id]||id;
 Object.assign(g.style,{left:`${r.left}px`,top:`${r.top}px`,width:`${r.width}px`,height:`${r.height}px`});
 document.body.appendChild(g);
 g.getBoundingClientRect();
 Object.assign(g.style,{left:'0px',top:'0px',width:'100vw',height:'100vh'});
 g.classList.add('isMax');
 let done=false;
 const finish=()=>{if(done)return;done=true;go();
  requestAnimationFrame(()=>requestAnimationFrame(()=>{g.classList.add('isGone');window.setTimeout(()=>g.remove(),360)}))};
 g.addEventListener('transitionend',e=>{if(e.target===g&&e.propertyName==='width')finish()});
 window.setTimeout(finish,800);
}

type VT={finished:Promise<unknown>};
// Direction lives on <html> so the CSS can play the transition forwards or backwards.
function tagTransition(t:unknown,dir:'max'|'min'){
 const root=document.documentElement;root.dataset.vt=dir;
 (t as VT)?.finished?.finally(()=>{if(root.dataset.vt===dir)delete root.dataset.vt});
}

/* Closing a case: the page shrinks back into the window it came from (the
   desktop window or the fun-build window with the same case id). If that
   window isn't on screen once home has restored its scroll, it just fades. */
export function minimizeTo(id:string,back:()=>void){
 const vt=(document as Document&{startViewTransition?:(update:()=>void)=>unknown}).startViewTransition;
 if(typeof vt!=='function'||window.matchMedia('(prefers-reduced-motion: reduce)').matches){back();return}
 document.documentElement.dataset.vt='min';
 let named:HTMLElement[]=[];
 const t=vt.call(document,()=>{
  // Animation frames are paused while the browser captures the transition, so
  // everything here is synchronous: home restores its scroll and draws the
  // desktop during this flush.
  flushSync(back);
  const win=document.querySelector<HTMLElement>(`[data-case="${id}"]`);
  const r=win?.getBoundingClientRect();
  if(win&&r&&r.bottom>0&&r.top<window.innerHeight&&r.width>0){
   const bar=win.querySelector<HTMLElement>('.dhWinBar,.osWinBar');
   win.style.viewTransitionName='case-window';named.push(win);
   if(bar){bar.style.viewTransitionName='case-bar';named.push(bar)}
  }
 });
 tagTransition(t,'min');
 (t as VT)?.finished?.finally(()=>{named.forEach(el=>{el.style.viewTransitionName=''});named=[]});
}

export function CaseWindowBar({id,onBack,children}:{id:string;onBack:()=>void;children?:React.ReactNode}){
 return <div className="caseWinBar">
  <div className="caseWinLights"><button type="button" className="cwRed" onClick={onBack} aria-label="Close this case study and go back to selected work"/><i/><i/></div>
  <button type="button" className="caseWinBack" onClick={onBack}>← Selected work</button>
  <span className="caseWinFile" aria-hidden="true">{CASE_FILES[id]||id}</span>
  <div className="caseWinRight">{children}</div>
 </div>
}
