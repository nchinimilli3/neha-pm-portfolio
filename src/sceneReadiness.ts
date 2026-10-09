/** Failed or slow images must not leave a scene hidden. Cancel on unmount. */
export function waitForSceneImages(images:Promise<unknown>[],reveal:()=>void,maxWait:number){
 let stopped=false;
 const finish=()=>{if(stopped)return;stopped=true;clearTimeout(timer);reveal()};
 const timer=setTimeout(finish,maxWait);
 Promise.allSettled(images).then(finish);
 return()=>{stopped=true;clearTimeout(timer)};
}
