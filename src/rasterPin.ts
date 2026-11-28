/* A big illustrated scene the camera zooms through is kept as one GPU layer, rastered at a fixed
   zoom: re-rastering one (SVG filters, a whole desk of art) costs 100–600ms on a laptop GPU.
   Zooming in it only upscales (soft until rest). It re-rasters only when it must: zooming out past
   1/1.45 of the raster's zoom (a close-up raster of the whole scene is too big to draw), and once
   at rest when the raster is visibly upscaled. Dropping it at every pause redrew the scene on each
   stop and again on each start: the sticky feel.
   3D-transformed parts are layers of their own, outside the scene's raster: pass them in too, or
   they re-raster on every zoom frame. */
export function rasterPin(layers:HTMLElement[],{restMs=250,canRest=():boolean=>true}={}){
 let at=0,last=0,timer=0,raf=0;
 const set=(v:string)=>layers.forEach(el=>{el.style.willChange=v});
 const reraster=(s:number)=>{at=s;set('auto');cancelAnimationFrame(raf);
  raf=requestAnimationFrame(()=>{raf=0;if(at)set('transform')})};
 return {
  // Call with the scene's scale on every camera frame.
  move(s:number){
   last=s;
   if(!at){at=s;set('transform')}
   else if(s<at/1.45)reraster(s);
   window.clearTimeout(timer);timer=window.setTimeout(()=>{if(last>at*1.12&&canRest())reraster(last)},restMs);
  },
  // Off screen: free the layers' GPU memory; they're rebuilt on the way back.
  release(){if(!at)return;at=0;window.clearTimeout(timer);cancelAnimationFrame(raf);set('auto')},
  dispose(){window.clearTimeout(timer);cancelAnimationFrame(raf);set('')},
 };
}
