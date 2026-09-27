import React from 'react';

const sketches = [
 {name:'heart',color:'#bc4f62',paths:['M75 117C63 104 32 86 32 62C32 39 61 33 75 55C89 32 119 40 119 63C119 86 87 107 75 117Z'],fills:[0]},
 {name:'smiley face',color:'#d6a338',paths:['M116 79C118 131 32 133 33 80C30 25 119 28 116 79Z','M57 68l1 6','M92 67l-1 7','M51 91Q75 119 100 89'],fills:[0]},
 {name:'flower',color:'#b96686',paths:['M75 86Q83 111 72 134','M78 115Q100 93 108 105Q102 122 78 120','M73 80C42 92 36 63 57 61C37 40 61 29 75 51C84 25 109 39 95 60C124 57 122 85 96 82C104 108 73 111 73 80Z','M85 70a10 10 0 1 1 -20 0a10 10 0 1 1 20 0'],fills:[1,2,3]},
 {name:'sunshine',color:'#d89832',paths:['M104 79a29 29 0 1 1 -58 0a29 29 0 1 1 58 0','M75 27v10','M75 121v11','M24 79h10','M116 79h11','M39 43l8 8','M105 110l8 8','M111 43l-8 8','M44 110l-8 8'],fills:[0]},
 {name:'butterfly',color:'#7463a6',paths:['M74 80C26 23 13 73 52 88C25 126 60 141 75 92','M76 80C119 26 142 69 98 89C128 120 94 141 75 92','M74 65Q80 84 73 111','M75 68Q63 46 59 52M76 67Q90 47 94 52'],fills:[0,1]},
 {name:'rainbow',color:'#c76c6a',paths:['M30 109C26 32 123 31 122 109','M43 109C41 50 109 50 109 109','M56 109C55 69 96 69 96 109'],fills:[]},
];

export function watercolorName(click:number){return click ? sketches[(click-1)%sketches.length].name : 'blank paper'}

export default function WatercolorPaper({click}:{click:number}){
 const sketch=sketches[(Math.max(1,click)-1)%sketches.length];
 return <svg className="dhWatercolorPaper" viewBox="0 0 150 160" aria-hidden="true">
  <defs>
   <filter id="wcPaperGrain"><feTurbulence type="fractalNoise" baseFrequency=".75" numOctaves="3" seed="8"/><feColorMatrix values="0 0 0 0 .45 0 0 0 0 .37 0 0 0 0 .27 0 0 0 .12 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
   <filter id="wcPaperBleed" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".065" numOctaves="3" seed="4"/><feDisplacementMap in="SourceGraphic" scale="2.2"/><feGaussianBlur stdDeviation=".3"/></filter>
  </defs>
  <path d="M5 5L145 4L147 154L6 156Z" fill="#cfc7b4"/>
  <path d="M4 3L46 4L73 2L109 4L145 2L144 54L146 92L144 153L102 152L73 155L35 153L4 155L5 112L3 74Z" fill="#faf5e7" stroke="#e4dcc9" strokeWidth=".7"/>
  <path d="M8 8H140V149H8Z" fill="#fffdf3" filter="url(#wcPaperGrain)"/>
  {click>0&&<g key={click} className="dhPaperArtwork" filter="url(#wcPaperBleed)">
   {sketch.paths.map((d,i)=>{
    const color=sketch.name==='rainbow'?['#c96e6e','#d4aa43','#598c84'][i]:sketch.name==='flower'?(i<2?'#57846c':i===3?'#d5a83a':sketch.color):sketch.color;
    return <g key={i} style={{'--paint-delay':`${i*130}ms`} as React.CSSProperties}>
     {sketch.fills.includes(i)&&<path className="dhPaperWash" d={d} fill={color}/>}
     <path className="dhPaperLine" d={d} pathLength="1" fill="none" stroke={color} strokeWidth={sketch.name==='rainbow'?8:3.5} strokeLinecap="round" strokeLinejoin="round"/>
    </g>;
   })}
  </g>}
 </svg>;
}
