import React from 'react';

/* SVG text, drawn as a picture of itself. Chrome lays live SVG <text> out again whenever the
   scale it's drawn at changes (it hints the glyphs for the screen), and the desk's camera changes
   that scale on every frame of the walk-in: each label was re-laid out, and the layer under it
   repainted, every frame. An image draws at any scale with no layout. `markup` is the label as
   SVG source in the parent's own viewBox coordinates, so it lands exactly where the text was.
   System fonts only: an SVG image can't load the page's web fonts. */
export default function FlatText({viewBox,markup}:{viewBox:string;markup:string}){
 const [x,y,w,h]=viewBox.split(/[\s,]+/).map(Number);
 const href=React.useMemo(()=>'data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${markup}</svg>`),[viewBox,markup]);
 return <image href={href} x={x} y={y} width={w} height={h}/>;
}
