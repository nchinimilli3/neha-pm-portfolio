import MachEArtwork from './MachEArtwork';
import { ShelbyMark } from './CarArt';

/* Company objects that sit beside an opened role. Still pieces only: nothing drifts or sways. */

// Accenture: the build ran on OpenAI's API, so: a ChatGPT chat. "hi!" goes out, the typing
// dots, then the reply. Plays when the role opens (.open in experience-theme.css).
export function ChatGPTHello(){
 return <figure className="expArt expChat" aria-label="A ChatGPT chat: the message hi! is sent and ChatGPT replies hey!">
  <div className="expChatBar" aria-hidden="true"><img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/openai.svg" alt="" loading="lazy"/><span>ChatGPT</span></div>
  <div className="expChatBody" aria-hidden="true">
   <p className="expChatMe">hi!</p>
   <div className="expChatBot"><img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/openai.svg" alt="" loading="lazy"/><span className="expChatDots"><i/><i/><i/></span><p>hey! 👋</p></div>
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

// PwC × The Arc of Indiana: the five recommendations on a clipboard, ticked off one by one,
// then stamped ADOPTED. Plays when the role opens (experience-theme.css); rests on the last frame.
export function PwcAdopted(){
 const rows=[44,72,100,128,156],lines=[[88,58],[96,44],[80,62],[92,50],[70,46]];
 return <svg className="expArt expSvg expAdopted" viewBox="0 0 280 200" role="img" aria-label="A clipboard of five recommendations, each ticked, stamped ADOPTED">
  <defs>
   <filter id="pwShadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="9" stdDeviation="7" floodColor="#5a2308" floodOpacity=".2"/></filter>
   <linearGradient id="pwBoard" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#c9935e"/><stop offset=".5" stopColor="#b07a46"/><stop offset="1" stopColor="#8f5d31"/></linearGradient>
   <linearGradient id="pwPaper" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fffefb"/><stop offset="1" stopColor="#f6f2ea"/></linearGradient>
   <linearGradient id="pwClip" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f3f4f5"/><stop offset=".45" stopColor="#b9bec3"/><stop offset=".55" stopColor="#dfe2e5"/><stop offset="1" stopColor="#8a9198"/></linearGradient>
   <filter id="pwInk" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1 1.5"/><feComposite in="SourceGraphic" operator="in"/></filter>
  </defs>
  <g transform="rotate(-3 140 104)">
   {/* Board, paper, clip. */}
   <g filter="url(#pwShadow)"><rect x="52" y="10" width="176" height="186" rx="9" fill="url(#pwBoard)"/></g>
   <path d="M60 18h160" stroke="#e2b386" strokeOpacity=".6" strokeWidth="1.2" strokeLinecap="round"/>
   <rect x="62" y="24" width="156" height="166" rx="2" fill="url(#pwPaper)"/>
   <path d="M62 188h156" stroke="#d9d0c2" strokeWidth="1.2"/>
   <rect x="106" y="4" width="68" height="22" rx="5" fill="url(#pwClip)"/><rect x="122" y="0" width="36" height="10" rx="5" fill="none" stroke="#9aa1a8" strokeWidth="3"/>
   <circle cx="140" cy="16" r="3.4" fill="#6f777e"/><circle cx="139" cy="15" r="1.2" fill="#e8ebee"/>
   {/* Five recommendations: a box, two lines of text, a tick drawn in. */}
   {rows.map((y,i)=><g key={y}>
    <rect x="74" y={y-8} width="16" height="16" rx="3" fill="#fff" stroke="#c9bfb1" strokeWidth="1.4"/>
    <rect x="98" y={y-6} width={lines[i][0]} height="5" rx="2.5" fill="#3a2a20" opacity=".72"/>
    <rect x="98" y={y+3} width={lines[i][1]} height="3.6" rx="1.8" fill="#b9ada0" opacity=".8"/>
    <path className="pwTick" style={{'--i':i} as React.CSSProperties} d={`M76 ${y}l5 5.5L94 ${y-10}`} fill="none" stroke="#1f7a3c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" pathLength="1"/>
   </g>)}
  </g>
  {/* The stamp, in PwC orange, slightly worn. */}
  <g className="pwStamp" transform="rotate(-10 140 118)">
   <g filter="url(#pwInk)" fill="none" stroke="#c24502">
    <rect x="70" y="94" width="140" height="48" rx="6" fill="#fffdf8" fillOpacity=".55" strokeWidth="4"/>
    <rect x="76" y="100" width="128" height="36" rx="3" strokeWidth="1.4"/>
    <text x="140" y="127" textAnchor="middle" fontFamily="Inter,system-ui,sans-serif" fontSize="25" fontWeight="800" letterSpacing="2.5" fill="#c24502" stroke="none">ADOPTED</text>
   </g>
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

// Spectrum: presenting the recommendation. A hand on a presenter clicker; its laser dot checks
// each option on the chart and settles on the pick, which lights up green. Plays when the role
// opens (experience-theme.css); the resting state is the final frame.
const SP_BARS:[string,number,number][]=[['A',150,62],['B',192,82],['C',234,44]];
export function SpectrumClicker(){
 const base=122;
 return <svg className="expArt expSvg expClicker" viewBox="0 0 280 200" role="img" aria-label="A hand on a presenter clicker; its laser dot checks options A, B and C on a chart and settles on B, which turns green">
  <defs>
   <filter id="pcShadow" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="8" stdDeviation="7" floodColor="#123f22" floodOpacity=".18"/></filter>
   <linearGradient id="pcPanel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffffff"/><stop offset="1" stopColor="#f1f3f4"/></linearGradient>
   <linearGradient id="pcBar" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#a9b6c4"/><stop offset=".5" stopColor="#c3cdd8"/><stop offset="1" stopColor="#9eacbb"/></linearGradient>
   <linearGradient id="pcWin" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#1c6e37"/><stop offset=".5" stopColor="#2f9a55"/><stop offset="1" stopColor="#1a6633"/></linearGradient>
   <radialGradient id="pcDot"><stop offset="0" stopColor="#fff4f0"/><stop offset=".22" stopColor="#ff3b2f"/><stop offset=".5" stopColor="#ff2a1f" stopOpacity=".55"/><stop offset="1" stopColor="#ff2a1f" stopOpacity="0"/></radialGradient>
   <linearGradient id="pcBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4a4d52"/><stop offset=".18" stopColor="#2a2c30"/><stop offset=".7" stopColor="#15161a"/><stop offset="1" stopColor="#0a0b0d"/></linearGradient>
   <linearGradient id="pcSkin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f0c4a6"/><stop offset=".55" stopColor="#dca183"/><stop offset="1" stopColor="#bf7f62"/></linearGradient>
   <linearGradient id="pcThumb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f6d0b4"/><stop offset=".6" stopColor="#e2a98b"/><stop offset="1" stopColor="#c68667"/></linearGradient>
  </defs>
  {/* The chart, floating on its own card. */}
  <g filter="url(#pcShadow)"><rect x="118" y="10" width="150" height="132" rx="8" fill="url(#pcPanel)"/></g>
  <rect x="132" y="24" width="38" height="5" rx="2.5" fill="#1d2a36" opacity=".8"/><rect x="132" y="33" width="26" height="3.4" rx="1.7" fill="#9aa6b2" opacity=".7"/>
  {[56,78,100].map(y=><path key={y} d={`M132 ${y}H254`} stroke="#e3e7eb" strokeWidth="1"/>)}
  <path d={`M132 ${base}H254`} stroke="#b9c2ca" strokeWidth="1.2"/>
  {SP_BARS.map(([l,x,h])=><g key={l}>
   <rect x={x-12} y={base-h} width="24" height={h} rx="3" fill="url(#pcBar)"/>
   {l==='B'&&<rect className="ckWin" x={x-12} y={base-h} width="24" height={h} rx="3" fill="url(#pcWin)"/>}
   <text x={x} y={base+14} textAnchor="middle" fontFamily="Inter,system-ui,sans-serif" fontSize="12" fontWeight="700" fill={l==='B'?'#1f7a3c':'#5d6b78'}>{l}</text>
  </g>)}
  <g className="ckCheck"><circle cx="192" cy={base-82-14} r="9" fill="#1f7a3c"/><path d={`M187.6 ${base-96}l3 3 5.6-6`} fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></g>
  {/* The laser dot: a hot white core in a red glow. */}
  <g className="ckDot"><circle r="9" fill="url(#pcDot)"/><circle r="2.2" fill="#fff6f2"/></g>
  {/* Hand and clicker, angled toward the chart. */}
  <g transform="translate(52 160) rotate(-26) scale(.86)">
   {/* Palm and the curled fingers under the clicker. */}
   <path d="M-70 10C-60-6-40-4-22 4L34 6C44 8 46 20 36 24C46 26 46 38 34 40C42 44 40 56 28 56L-30 64C-56 66-76 50-80 34Z" fill="url(#pcSkin)"/>
   {[[6,24],[8,40]].map(([x,y])=><path key={y} d={`M${x-30} ${y}H${x+26}`} stroke="#a8694f" strokeOpacity=".45" strokeWidth="1.1" strokeLinecap="round"/>)}
   <path d="M30 8C38 10 40 18 34 22" fill="none" stroke="#fbe0cc" strokeOpacity=".7" strokeWidth="1.4" strokeLinecap="round"/>
   {/* Clicker body: matte black, rounded, a lit edge along its top. */}
   <rect x="-34" y="-11" width="96" height="21" rx="10.5" fill="url(#pcBody)"/>
   <path d="M-26-9.6H54" stroke="#7d8189" strokeOpacity=".55" strokeWidth="1.1" strokeLinecap="round"/>
   <rect x="58" y="-6" width="5" height="12" rx="2.4" fill="#0c0d10"/><circle cx="61.6" cy="0" r="2.4" fill="#ff3b2f"/><circle cx="61.2" cy="-.8" r=".8" fill="#ffd8d2"/>
   <rect x="22" y="-5.4" width="16" height="9" rx="4.5" fill="#2e3136" stroke="#55595f" strokeWidth=".6"/>
   <circle cx="6" cy="-.6" r="3.2" fill="#2e3136" stroke="#55595f" strokeWidth=".6"/><circle cx="-6" cy="-.6" r="3.2" fill="#2e3136" stroke="#55595f" strokeWidth=".6"/>
   {/* Thumb resting on the laser button. */}
   <path d="M-62-2C-46-18-6-20 24-14C34-12 38-4 30 0C20 4-10 4-40 8Z" fill="url(#pcThumb)"/>
   <path d="M18-13.6C26-14 32-11 32-6C30-4 24-5 18-6Z" fill="#f9e3d6" stroke="#d29a80" strokeWidth=".6"/>
   <path d="M-40-8C-24-12 0-14 14-12" fill="none" stroke="#fff3ea" strokeOpacity=".55" strokeWidth="1.6" strokeLinecap="round"/>
  </g>
 </svg>;
}
