import MachEArtwork from './MachEArtwork';
import { ShelbyMark } from './CarArt';

/* Company objects that sit beside an opened role. Still pieces only: nothing drifts or sways. */

// Accenture: the OpenAI API workflow running one request through the matching rules.
export function OpenAIWorkflow(){
 return <figure className="expArt expApi" aria-label="OpenAI API workflow window: a request with region, language, and time window comes back as a recommendation with its reasons">
  <div className="expApiBar" aria-hidden="true"><img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/openai.svg" alt="" loading="lazy"/><span>OpenAI API · trainer match</span><i/></div>
  <div className="expApiBody" aria-hidden="true">
   <p><em>request</em></p>
   <p><span>region</span>EMEA</p>
   <p><span>language</span>German</p>
   <p><span>window</span>Thu, local hours</p>
   <div className="expApiOut"><b>RECOMMEND</b><strong>Trainer 14 · Thu 10:00</strong><small>language ✓ capacity ✓ time zone ✓</small></div>
  </div>
 </figure>;
}

// Palmer (MSU career center): Sparty, from the CSE 335 game, after a résumé review.
export function SpartyCoach(){
 return <figure className="expArt expSparty" aria-label="Sparty, the Michigan State mascot, flexing next to a speech bubble reading: résumé ready, go get it">
  <img src="project-media/sparty.png" alt="" loading="lazy" decoding="async"/>
  <span className="expSpartyBubble" aria-hidden="true">Résumé ready.<br/>Go get it!</span>
 </figure>;
}

// PwC × The Arc of Indiana: the peer-benchmark slide with the seven-category scorecard.
export function PwcScorecard(){
 const n=7,cx=192,cy=106,r=50;
 const pt=(i:number,k:number)=>{const a=-Math.PI/2+i*2*Math.PI/n;return `${(cx+Math.cos(a)*r*k).toFixed(1)},${(cy+Math.sin(a)*r*k).toFixed(1)}`};
 const ring=(k:number)=>Array.from({length:n},(_,i)=>pt(i,k)).join(' ');
 const arc=[.78,.62,.9,.55,.7,.84,.66],peers=[.6,.8,.58,.74,.52,.6,.8];
 return <svg className="expArt expSvg expSlide" viewBox="0 0 280 200" role="img" aria-label="Slide comparing The Arc of Indiana with five peer organizations across seven scorecard categories">
  <defs><filter id="pwcShadow" x="-10%" y="-10%" width="120%" height="140%"><feDropShadow dx="2" dy="10" stdDeviation="8" floodColor="#4a1d06" floodOpacity=".2"/></filter></defs>
  <g filter="url(#pwcShadow)" transform="rotate(-2 140 100)">
   <rect x="14" y="14" width="252" height="172" rx="6" fill="#fffdfb"/>
   <rect x="14" y="14" width="252" height="6" rx="3" fill="#d04a02"/>
   <g transform="translate(30 32)"><rect width="10" height="7" fill="#ffb600"/><rect x="5" y="4" width="10" height="7" fill="#eb8c00" opacity=".9"/><rect x="10" y="8" width="10" height="7" fill="#d04a02" opacity=".9"/><rect x="15" y="12" width="10" height="7" fill="#db536a" opacity=".85"/></g>
   <text x="30" y="68" fontFamily="Inter,system-ui,sans-serif" fontSize="11" fontWeight="650" fill="#2d1a10">Peer benchmark</text>
   <text x="30" y="82" fontFamily="Inter,system-ui,sans-serif" fontSize="8.5" fill="#7a6456">7 categories · 5 peers</text>
   <g transform="translate(30 116)" fontFamily="Inter,system-ui,sans-serif" fontSize="8.5" fill="#4a3a30"><rect y="-7" width="10" height="4" rx="2" fill="#d04a02"/><text x="15" y="-2">The Arc</text><rect y="7" width="10" height="4" rx="2" fill="#b9aca3"/><text x="15" y="12">Peer average</text></g>
   {[.33,.66,1].map(k=><polygon key={k} points={ring(k)} fill="none" stroke="#e7ddd6" strokeWidth="1"/>)}
   {Array.from({length:n},(_,i)=><line key={i} x1={cx} y1={cy} x2={pt(i,1).split(',')[0]} y2={pt(i,1).split(',')[1]} stroke="#eee5de"/>)}
   <polygon points={peers.map((k,i)=>pt(i,k)).join(' ')} fill="#b9aca333" stroke="#b9aca3" strokeWidth="1.4"/>
   <polygon points={arc.map((k,i)=>pt(i,k)).join(' ')} fill="#d04a0226" stroke="#d04a02" strokeWidth="2" strokeLinejoin="round"/>
  </g>
 </svg>;
}

// Ford: the Shelby GT500 from the Customer Value Framework case.
export function FordShelby(){
 return <figure className="expArt expShelby" aria-label="Blue 1967 Shelby GT500, the car from the Ford Customer Value Framework case"><ShelbyMark/></figure>;
}

// Ford Credit: the Mach-E with a dealership hang tag carrying a saved FinSimple estimate.
export function FordCreditCar(){
 return <figure className="expArt expCar" aria-label="Blue Mustang Mach-E with a hang tag reading: Ford Credit FinSimple, estimate saved">
  <MachEArtwork className="expCarBody"/>
  <div className="expCarTag" aria-hidden="true">
   <span>Ford Credit · FinSimple</span>
   <strong>Estimate saved ✓</strong>
  </div>
 </figure>;
}

// Spectrum: a folded site map with the three candidate locations pinned in Spectrum's hexagon.
export function SpectrumMap(){
 const hex=(x:number,y:number,s:number)=>Array.from({length:6},(_,i)=>{const a=Math.PI/6+i*Math.PI/3;return `${(x+Math.cos(a)*s).toFixed(1)},${(y+Math.sin(a)*s).toFixed(1)}`}).join(' ');
 const pins:[number,number,string,string,boolean][]=[[92,78,'A','8.4',true],[178,64,'B','7.1',false],[150,138,'C','6.3',false]];
 return <svg className="expArt expSvg" viewBox="0 0 280 200" role="img" aria-label="Folded map with three candidate locations scored 8.4, 7.1 and 6.3">
  <defs><filter id="spShadow" x="-10%" y="-10%" width="120%" height="140%"><feDropShadow dx="2" dy="10" stdDeviation="8" floodColor="#123f22" floodOpacity=".2"/></filter></defs>
  <g filter="url(#spShadow)" transform="rotate(2 140 100)">
   <path d="M18 22l82-8 80 8 82-8v164l-82 8-80-8-82 8z" fill="#f4f1e6"/>
   <path d="M100 14v172l80-8V22z" fill="#ebe7da"/>
   <path d="M18 128c40-10 60 20 110 6s70-40 134-26" stroke="#9fc3d6" strokeWidth="9" fill="none" strokeLinecap="round"/>
   <path d="M196 120c18-6 40-2 52 8-6 20-30 26-50 18-10-6-10-20-2-26z" fill="#cfe2c4"/>
   {['M18 60h244','M18 100c80 4 160-4 244 2','M60 14v172','M140 14l10 172','M222 14l-6 172'].map(d=><path key={d} d={d} stroke="#fff" strokeWidth="4" fill="none"/>)}
   {pins.map(([x,y,l,score,top])=><g key={l}>
    <polygon points={hex(x,y,15)} fill={top?'#1f7a3c':'#8fa89a'} stroke="#fff" strokeWidth="2.5"/>
    <text x={x} y={y+4} textAnchor="middle" fontFamily="Inter,system-ui,sans-serif" fontSize="11" fontWeight="700" fill="#fff">{l}</text>
    <text x={x+20} y={y+4} fontFamily="Caveat,cursive" fontSize="16" fill={top?'#1f7a3c':'#5d6d63'}>{score}</text>
   </g>)}
  </g>
 </svg>;
}
