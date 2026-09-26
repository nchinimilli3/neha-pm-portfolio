import React,{useEffect,useLayoutEffect,useRef,useState} from 'react';
import SpartanGame from './SpartanGame';
import StableFluids from './StableFluids';
import './after-hours.css';
import {HOME_SHOWN,isParked} from './CaseWindow';

/* "After hours": the same desk as the hero, now at night and seen from straight above.
   The desk light warms as the section arrives; scrolling moves the camera from device to device. */

type Project={id:string;title:string;company:string;blurb?:string;summary:string};
type Device={id:string;kind:'phone'|'laptop'|'tablet';x:number;y:number;w:number;h:number;rot:number;fy?:number;title:string;eyebrow:string;line:string;hint?:string;caseId?:string};

// The desk is a 1800 × 1150 set, in stage pixels.
// Everything is drawn at one true scale, about 2.65 px per mm (an iPhone 15 Pro is 71.6 mm → 190 px).
const SW=2700,SH=1700;
const LAYOUT:Record<string,Omit<Device,'id'|'title'|'eyebrow'|'line'|'caseId'|'hint'>>={
 commute:{kind:'phone',x:560,y:150,w:190,h:389,rot:-4},
 bookclub:{kind:'phone',x:250,y:250,w:190,h:389,rot:4},
 scheduler:{kind:'laptop',x:950,y:120,w:806,h:1124,rot:0},
 chat:{kind:'phone',x:1880,y:150,w:190,h:389,rot:5},
 game:{kind:'tablet',x:1900,y:720,w:656,h:473,rot:-2,fy:150},
 fluids:{kind:'tablet',x:150,y:900,w:656,h:473,rot:2},
};
const ORDER=['commute','bookclub','scheduler','chat','game','fluids'];
const EXTRA:Record<string,{title:string;eyebrow:string;line:string;hint:string}>={
 game:{title:'Spartan Touchdown',eyebrow:'MSU · CSE 335',line:'A C++ team game with player movement, collisions, enemies, scoring, and a shared level state.',hint:'Click the screen to play. Space jumps.'},
 fluids:{title:'Stable Fluids',eyebrow:'MSU · CSE 476',line:'Interactive 2D fluid simulation in C++ using the Stam method, with live emitters and obstacles.',hint:'Drag across the screen to stir it.'},
};

/* Phone screens are laid out in real iPhone points (393 wide) and scaled into the frame,
   so type, spacing and the Dynamic Island keep their true proportions. */
const Status=({time,dark=false}:{time:string;dark?:boolean})=><div className={`ahStatus ${dark?'isDark':''}`}><b>{time}</b><span aria-hidden="true"><svg viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg><svg viewBox="0 0 16 12"><path d="M8 11.5 5.6 9a3.4 3.4 0 0 1 4.8 0zM3.4 6.8a6.5 6.5 0 0 1 9.2 0l-1.5 1.5a4.4 4.4 0 0 0-6.2 0zM1.1 4.5a9.7 9.7 0 0 1 13.8 0l-1.5 1.5a7.6 7.6 0 0 0-10.8 0z"/></svg><i className="ahBatt"><i/></i></span></div>;

function CommuteScreen(){
 return <div className="ahIos acScreen">
  <Status time="7:22"/>
  <div className="acTop"><div><small>Friday, Aug 21</small><h4>Good morning, Neha</h4></div><i>N</i></div>
  <div className="acDest"><div><small>Arrive by</small><b>Salesforce Tower</b></div><b>9:00 AM</b></div>
  <div className="acWake"><small>Wake up</small><strong>7:18 AM</strong><span>Leave at 8:06 AM</span></div>
  <div className="acRoute"><i>B</i><div><small>Recommended</small><b>BART</b><span>19th St → Embarcadero</span></div><div className="acTimes"><b>8:19</b><small>arrive 8:51</small></div></div>
  <p className="acWhy">More recovery time if you miss a train.</p>
  <div className="acChips"><span><i/>Live <b>BART</b></span><span>Bridge +6m</span></div>
  <p className="acSleep">Can I sleep longer?</p>
  <nav className="acTabs">{['Today','Plan','History','Settings'].map((t,i)=><span key={t} className={i===0?'isOn':''}><svg viewBox="0 0 24 24">{i===0?<path d="M4 10.5 12 4l8 6.5V20h-5v-6H9v6H4z"/>:i===1?<path d="M6 4h12v16H6zM9 9h6M9 13h6M9 17h3"/>:i===2?<path d="M4.5 9A8 8 0 1 1 5 16M4 4v5h5M12 8v5l3 2"/>:<><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2 2M16.4 16.4l2 2M18.4 5.6l-2 2M7.6 16.4l-2 2"/></>}</svg>{t}</span>)}</nav>
  <i className="ahHome"/>
 </div>;
}

function IMessageScreen(){
 return <div className="ahIos imScreen">
  <Status time="9:41"/>
  <header className="imHead">
   <span className="imBack"><svg viewBox="0 0 12 20"><path d="M10 2 2 10l8 8"/></svg><b>12</b></span>
   <div className="imWho"><span className="imFaces"><i>M</i><i>A</i><i>N</i></span><span>CSE 477 Team <em>›</em></span></div>
   <span className="imCam"><svg viewBox="0 0 28 18"><rect x="1" y="2" width="18" height="14" rx="4"/><path d="M20 7l7-4v12l-7-4z"/></svg></span>
  </header>
  <div className="imBody">
   <small className="imStamp"><b>iMessage</b><br/>Today 9:38 PM</small>
   <span className="imName">Maya</span>
   <p className="imThem">did everyone push?<em className="imTap" aria-label="Loved">♥</em></p>
   <p className="imMe">yep just finished the socket changes</p>
   <small className="imRead">Delivered</small>
   <span className="imName">Alex</span>
   <p className="imThem imTyping" aria-hidden="true"><i/><i/><i/></p>
  </div>
  <footer className="imBar"><span className="imPlus">+</span><div className="imField">iMessage<svg viewBox="0 0 14 20"><rect x="4" y="1" width="6" height="11" rx="3"/><path d="M1.5 9a5.5 5.5 0 0 0 11 0M7 14.5V19"/></svg></div></footer>
  <i className="ahHome"/>
 </div>;
}

// Bookclub's club home, rebuilt in code. The flower photo and the book cover are cropped from the
// app's own screenshot (a text-free patch of the header photo, and the cover art).
function BookclubScreen(){
 return <div className="ahIos bcScreen">
  <Status time="8:47"/>
  <div className="bcBar"><span>College Friends</span><i className="bcBell" aria-hidden="true"><svg viewBox="0 0 20 22"><path d="M10 2a6 6 0 0 0-6 6v4l-2 4h16l-2-4V8a6 6 0 0 0-6-6zM7.5 19a2.5 2.5 0 0 0 5 0"/></svg></i></div>
  <div className="bcHero"><h4>College Friends</h4><small>5 readers · private</small><span className="bcFaces">{['L','M','J','L','O'].map((x,i)=><i key={i}>{x}</i>)}</span></div>
  <div className="bcNow"><i className="bcCover" aria-hidden="true"/><div><small><i/>Currently reading</small><h5>A Thousand Splendid Suns</h5><span>Khaled Hosseini</span></div></div>
  <div className="bcProgress"><div><small>You’re on chapter 17</small><b>Update progress</b></div><div><i><i/></i><small>33%</small></div></div>
  <div className="bcRow"><small>Finish by</small><b>Oct 1</b></div>
  <span className="bcAdd" aria-hidden="true">+</span>
  <nav className="bcTabs" aria-hidden="true"><span><svg viewBox="0 0 24 24"><path d="M3 5.5C6 4 9 4 12 6c3-2 6-2 9-.5V19c-3-1.5-6-1.5-9 .5-3-2-6-2-9-.5zM12 6v13.5"/></svg>Club</span><span><svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg>Find</span><span><i>L</i>Me</span></nav>
  <i className="ahHome"/>
 </div>;
}

// iPadOS status bar: time and date on the left, Wi-Fi and battery on the right.
const PadStatus=()=><div className="ahPadStatus" aria-hidden="true"><span><b>9:41 PM</b> Tue Sep 24</span><span><svg viewBox="0 0 16 12"><path d="M8 11.5 5.6 9a3.4 3.4 0 0 1 4.8 0zM3.4 6.8a6.5 6.5 0 0 1 9.2 0l-1.5 1.5a4.4 4.4 0 0 0-6.2 0zM1.1 4.5a9.7 9.7 0 0 1 13.8 0l-1.5 1.5a7.6 7.6 0 0 0-10.8 0z"/></svg>84%<i className="ahBatt"><i/></i></span></div>;

function Screen({id,focus=true}:{id:string;focus?:boolean}){
 if(id==='commute')return <CommuteScreen/>;
 if(id==='bookclub')return <BookclubScreen/>;
 if(id==='scheduler')return <img className="ahShot ahShotCover" src="project-media/scheduler-actual-v31.png" alt="" loading="lazy" decoding="async"/>;
 if(id==='chat')return <IMessageScreen/>;
 if(id==='game')return <SpartanGame/>;
 if(id==='fluids')return <StableFluids live={focus}/>;
 return null;
}

// MacBook Air (2020) keyboard: key widths per row, in key units; the last key of the top row is Touch ID.
const KEY_ROWS=[Array(14).fill(1),[1,...Array(12).fill(1),1.5],[1.5,...Array(12).fill(1),1],[1.8,...Array(11).fill(1),1.8],[2.3,...Array(10).fill(1),2.3],[1,1,1,1.3,5.2,1.3,1,1,1,1]];

function DeviceView({d,on,focus,onPick}:{d:Device;on:boolean;focus:boolean;onPick:()=>void}){
 const style={left:d.x,top:d.y,width:d.w,height:d.h,transform:`rotate(${d.rot}deg)`} as React.CSSProperties;
 const live=d.id==='game'||d.id==='fluids';
 const label=`${d.title}: ${d.line}`;
 const inner=d.kind==='laptop'
  ?<><div className="ahLid"><i className="ahCam" aria-hidden="true"/><div className="ahScreen"><Screen id={d.id} focus={focus}/></div><span className="ahLidName" aria-hidden="true">MacBook Air</span></div><div className="ahDeck" aria-hidden="true"><div className="ahKeys">{KEY_ROWS.map((row,r)=><div key={r} className="ahKeyRow">{row.map((k,i)=><i key={i} style={{flex:k}} className={r===0&&i===row.length-1?'ahTouchId':''}/>)}</div>)}</div><i className="ahTrackpad"/></div></>
  :<>{d.kind==='phone'&&<i className="ahButtons" aria-hidden="true"/>}<div className="ahScreen"><Screen id={d.id} focus={focus}/>{d.kind==='phone'&&<i className="ahIsland" aria-hidden="true"/>}{d.kind==='tablet'&&<><PadStatus/><i className="ahIndicator" aria-hidden="true"/></>}</div></>;
 // Live screens stay interactive, so they are not wrapped in a button; the others are one.
 return live
  ?<div className={`ahDevice ah-${d.kind} ah-${d.id} ${on?'isOn':''}`} style={style} role="group" aria-label={label}>{inner}</div>
  :<button type="button" className={`ahDevice ah-${d.kind} ah-${d.id} ${on?'isOn':''}`} style={style} onClick={onPick} aria-label={label}>{inner}</button>;
}

// Xbox Series controller in Carbon Black, from above: offset sticks, faceted D-pad,
// dark face buttons with coloured letters, the lit Xbox button, and bumpers along the top edge.
function XboxController(){
 const stick=(cx:number,cy:number,id:string)=><g>
  <circle cx={cx} cy={cy} r="21" fill="#08080a"/>
  <circle cx={cx} cy={cy} r="16.5" fill={`url(#${id})`}/>
  <circle cx={cx} cy={cy} r="11" fill="none" stroke="#3a3b40" strokeWidth="1.2"/>
  {Array.from({length:24},(_,i)=>{const a=i*Math.PI/12;return <line key={i} x1={cx+Math.cos(a)*13} y1={cy+Math.sin(a)*13} x2={cx+Math.cos(a)*16} y2={cy+Math.sin(a)*16} stroke="#15161a" strokeWidth=".9"/>})}
 </g>;
 const face=(cx:number,cy:number,l:string,c:string)=><g><circle cx={cx} cy={cy} r="8.6" fill="url(#xbFace)" stroke="#060607" strokeWidth=".8"/><text x={cx} y={cy+3.4} textAnchor="middle" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="9.5" fill={c}>{l}</text></g>;
 return <svg className="ahController" viewBox="0 0 240 168" aria-hidden="true">
  <defs>
   <linearGradient id="xbBody" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stopColor="#2e2f34"/><stop offset=".55" stopColor="#1b1c20"/><stop offset="1" stopColor="#111114"/></linearGradient>
   <radialGradient id="xbStick" cx=".4" cy=".35" r=".7"><stop offset="0" stopColor="#3c3d43"/><stop offset=".7" stopColor="#1d1e22"/><stop offset="1" stopColor="#141518"/></radialGradient>
   <radialGradient id="xbFace" cx=".4" cy=".35" r=".7"><stop offset="0" stopColor="#35363b"/><stop offset="1" stopColor="#141417"/></radialGradient>
   <radialGradient id="xbGuide" cx=".45" cy=".4" r=".6"><stop offset="0" stopColor="#ffffff"/><stop offset=".7" stopColor="#dfe2e6"/><stop offset="1" stopColor="#9da3aa"/></radialGradient>
  </defs>
  <path d="M40 22C62 8 178 8 200 22" stroke="#3b3c42" strokeWidth="7" strokeLinecap="round" fill="none"/>
  <path d="M60 20C86 11 154 11 180 20C206 23 223 37 231 62C241 97 240 136 222 153C207 166 189 159 179 141C169 123 158 113 139 111H101C82 113 71 123 61 141C51 159 33 166 18 153C0 136-1 97 9 62C17 37 34 23 60 20Z" fill="url(#xbBody)" stroke="#0a0a0c" strokeWidth="1.5"/>
  <path d="M26 58C36 36 60 27 88 25" stroke="#ffffff14" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
  {stick(64,60,'xbStick')}
  {stick(152,98,'xbStick')}
  <g transform="translate(92 98)">
   <circle r="17" fill="#0b0b0d"/>
   <path d="M-5-14h10v9h9v10h-9v9H-5v-9h-9V-5h9z" fill="url(#xbFace)" stroke="#060607" strokeWidth=".8"/>
   <circle r="3" fill="#0d0d10"/>
  </g>
  {face(179,43,'Y','#f2c21b')}{face(163,59,'X','#3c8ce7')}{face(195,59,'B','#e23b3b')}{face(179,75,'A','#3fbf4f')}
  <circle cx="120" cy="34" r="11" fill="#0a0a0c"/>
  <circle cx="120" cy="34" r="8.5" fill="url(#xbGuide)"/>
  <path d="M114.6 28.6C118 31 122 36.5 125.4 39.4M125.4 28.6C122 31 118 36.5 114.6 39.4" stroke="#2c3036" strokeWidth="2.3" fill="none" strokeLinecap="round"/>
  <rect x="100" y="54" width="9" height="7" rx="3.5" fill="#0c0c0e"/><rect x="131" y="54" width="9" height="7" rx="3.5" fill="#0c0c0e"/><rect x="115.5" y="66" width="9" height="5" rx="2.5" fill="#0c0c0e"/>
  <path d="M102.5 56.5h4M102.5 58.5h4M133.5 56h4M133.5 57.7h4M133.5 59.4h4" stroke="#6b6d73" strokeWidth=".7"/>
 </svg>;
}

// Coffee from straight above: a green MSU mug (glazed lip, white interior, crema with a feathered
// latte heart), its handle seen as a flat tab, on a cork coaster printed with the Spartans wordmark.
function MsuMug(){
 const heart='M104 128c-15-8-25-16-25-27 0-8 6-13 13-13 5 0 9 3 12 7 3-4 7-7 12-7 7 0 13 5 13 13 0 11-10 19-25 27z';
 return <svg className="ahMug" viewBox="0 0 220 220" aria-hidden="true">
  <defs>
   <filter id="amCork" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 .35 0 0 0 0 .22 0 0 0 0 .1 0 0 0 1.2 -.55"/><feComposite in2="SourceGraphic" operator="in"/></filter>
   <filter id="amFoamTex" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="2" seed="9"/><feColorMatrix values="0 0 0 0 1 0 0 0 0 .95 0 0 0 0 .86 0 0 0 .9 -.45"/><feComposite in2="SourceGraphic" operator="in"/></filter>
   <filter id="amSoft"><feGaussianBlur stdDeviation="1.4"/></filter>
   <filter id="amCast" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5"/></filter>
   <radialGradient id="amGlaze" cx=".7" cy=".3" r=".8"><stop offset="0" stopColor="#3a7e67"/><stop offset=".45" stopColor="#1f5b4a"/><stop offset="1" stopColor="#0d2f26"/></radialGradient>
   <radialGradient id="amInside" cx=".62" cy=".38" r=".62"><stop offset=".7" stopColor="#f7f4ec"/><stop offset="1" stopColor="#bfb8aa"/></radialGradient>
   <radialGradient id="amCrema" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#c9a174"/><stop offset=".72" stopColor="#a8784a"/><stop offset=".92" stopColor="#6e4424"/><stop offset="1" stopColor="#4a2c16"/></radialGradient>
   <radialGradient id="amHeart" cx=".5" cy=".45" r=".6"><stop offset="0" stopColor="#fbf4e6"/><stop offset=".8" stopColor="#f1e2c6"/><stop offset="1" stopColor="#dcc19a"/></radialGradient>
   <path id="amTopArc" d="M34 110a76 76 0 0 1 152 0"/><path id="amBotArc" d="M28 110a82 82 0 0 0 164 0"/>
  </defs>
  <circle cx="110" cy="110" r="102" fill="#c79b6d"/>
  <circle cx="110" cy="110" r="102" fill="#c79b6d" filter="url(#amCork)"/>
  <circle cx="110" cy="110" r="92" fill="none" stroke="#1d4d40" strokeWidth="1.6"/>
  <text fontFamily="Helvetica,Arial,sans-serif" fontWeight="800" fontSize="12.5" letterSpacing="3.2" fill="#1d4d40"><textPath href="#amTopArc" startOffset="50%" textAnchor="middle">MICHIGAN STATE</textPath></text>
  <text fontFamily="Helvetica,Arial,sans-serif" fontWeight="800" fontSize="12.5" letterSpacing="4" fill="#1d4d40"><textPath href="#amBotArc" startOffset="50%" textAnchor="middle" dominantBaseline="hanging">SPARTANS</textPath></text>
  <circle cx="98" cy="118" r="63" fill="#000" opacity=".45" filter="url(#amCast)"/>
  <rect x="150" y="100" width="44" height="20" rx="10" fill="#000" opacity=".35" filter="url(#amCast)" transform="translate(-6 6)"/>
  <rect x="154" y="101" width="40" height="18" rx="9" fill="url(#amGlaze)"/>
  <path d="M160 104h28" stroke="#6fa892" strokeWidth="2" strokeLinecap="round" opacity=".7"/>
  <circle cx="106" cy="110" r="60" fill="url(#amGlaze)"/>
  <circle cx="106" cy="110" r="55.5" fill="#f1ede3"/>
  <circle cx="106" cy="110" r="53" fill="url(#amInside)"/>
  <circle cx="106" cy="111" r="47" fill="url(#amCrema)"/>
  <circle cx="106" cy="111" r="47" fill="#fff" filter="url(#amFoamTex)" opacity=".35"/>
  <path d={heart} fill="url(#amHeart)" filter="url(#amSoft)"/>
  <path d={heart} fill="url(#amHeart)" transform="translate(104 108) scale(.82) translate(-104 -108)"/>
  <path d="M104 72v58" stroke="#b98a5b" strokeWidth="1.4" strokeLinecap="round" opacity=".75"/>
  <path d="M130 62a53 53 0 0 1 26 30" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" opacity=".8"/>
  <ellipse cx="128" cy="92" rx="10" ry="5" fill="#fff" opacity=".22" transform="rotate(-35 128 92)" filter="url(#amSoft)"/>
 </svg>;
}

// A travel watercolour tin from above: black enamel, the lid folded open into white mixing wells
// (with leftover washes), twelve half pans, and a brush resting across it.
function WatercolorTin(){
 const pans=['#f2c230','#e8862a','#d5452f','#b8325a','#7c3f8f','#2f5aa8','#2c8ec4','#2f8a5a','#7ea83a','#a5692f','#6b3f25','#2b2b2e'];
 return <svg className="ahPaints" viewBox="0 0 280 180" aria-hidden="true">
  <defs><filter id="wtCast" x="-20%" y="-30%" width="140%" height="160%"><feGaussianBlur stdDeviation="5"/></filter>
   <radialGradient id="wtPan" cx=".4" cy=".35" r=".7"><stop offset="0" stopColor="#fff" stopOpacity=".35"/><stop offset=".5" stopColor="#fff" stopOpacity="0"/></radialGradient></defs>
  <rect x="4" y="20" width="266" height="138" rx="10" fill="#000" opacity=".45" filter="url(#wtCast)" transform="translate(-10 10)"/>
  <rect x="10" y="16" width="126" height="140" rx="9" fill="#1b1b1e"/>
  <rect x="17" y="23" width="112" height="126" rx="6" fill="#f4f2ec"/>
  {[[20,26],[74,26],[20,88],[74,88]].map(([x,y],i)=><rect key={i} x={x} y={y} width="52" height="58" rx="8" fill="#fbfaf6" stroke="#dcd8cf"/>)}
  <path d="M28 40c10-6 24-2 30 8-8 10-22 10-30-8z" fill="#2f5aa8" opacity=".28"/><path d="M84 104c14-4 24 6 24 14-12 6-24 0-24-14z" fill="#d5452f" opacity=".25"/><path d="M30 104c6 8 22 10 30 2" stroke="#e8862a" strokeWidth="5" opacity=".3" strokeLinecap="round" fill="none"/>
  <rect x="136" y="16" width="134" height="140" rx="9" fill="#1b1b1e"/>
  <path d="M136 22v128" stroke="#3a3a40" strokeWidth="2"/>
  {pans.map((c,i)=>{const col=i%4,row=Math.floor(i/4),x=146+col*30,y=26+row*42;return <g key={c}><rect x={x} y={y} width="26" height="36" rx="3" fill="#e9e6de"/><rect x={x+2.5} y={y+2.5} width="21" height="31" rx="2" fill={c}/><rect x={x+2.5} y={y+2.5} width="21" height="31" rx="2" fill="url(#wtPan)"/><ellipse cx={x+13} cy={y+20} rx="6" ry="8" fill="#000" opacity=".12"/></g>})}
  <g transform="rotate(-24 150 90)">
   <rect x="20" y="86" width="190" height="7" rx="3.5" fill="#b3342a"/><rect x="20" y="86" width="190" height="2.5" rx="1.2" fill="#fff" opacity=".25"/>
   <rect x="210" y="85" width="26" height="9" rx="2" fill="#c9c9c6"/><path d="M236 85c14 0 26 3 34 4.5-8 1.5-20 4.5-34 4.5z" fill="#2b2320"/>
  </g>
 </svg>;
}

// Kodak Portra single-roll boxes lying flat, face up: orange bands with the Kodak Professional
// wordmark, the violet band carrying "Portra 400/800", and the navy 135-36 tab.
function PortraBox({speed}:{speed:'400'|'800'}){
 const kp=(x:number,y:number,size:number)=><text x={x} y={y} fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize={size}><tspan fontWeight="800" fill="#d6261b">Kodak</tspan><tspan dx={size*.25} fontWeight="400" fill="#2b1a10">Professional</tspan></text>;
 return <svg className={`ahPortra is${speed}`} viewBox="0 0 170 128" aria-hidden="true">
  <defs><filter id={`pbCast${speed}`} x="-20%" y="-30%" width="140%" height="160%"><feGaussianBlur stdDeviation="4"/></filter>
   <linearGradient id={`pbOrange${speed}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fbb535"/><stop offset="1" stopColor="#f39c16"/></linearGradient>
   <linearGradient id={`pbViolet${speed}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#7669de"/><stop offset="1" stopColor="#6457cf"/></linearGradient></defs>
  <rect x="4" y="10" width="150" height="110" rx="2" fill="#000" opacity=".45" filter={`url(#pbCast${speed})`} transform="translate(-6 6)"/>
  <rect x="10" y="8" width="150" height="110" rx="2" fill={`url(#pbOrange${speed})`}/>
  {kp(18,22,9)}
  <rect x="10" y="34" width="150" height="58" fill={`url(#pbViolet${speed})`}/>
  <path d="M160 36H124a8 8 0 0 0 0 16h36z" fill="#27266a"/>
  <text x="143" y="47.5" textAnchor="middle" fontFamily="'Helvetica Neue',Arial,sans-serif" fontWeight="600" fontSize="8.5" fill="#fff">135-36</text>
  <text x="18" y="75" fontFamily="'Helvetica Neue',Arial,sans-serif" fontWeight="500" fontSize="24" letterSpacing="-.3" fill="#fff">Portra {speed}</text>
  <text x="19" y="86" fontFamily="'Helvetica Neue',Arial,sans-serif" fontWeight="700" fontSize="5.8" letterSpacing=".5" fill="#fff">COLOR NEGATIVE FILM</text>
  {kp(18,109,13)}
  <rect x="10" y="8" width="150" height="110" rx="2" fill="none" stroke="#fff" strokeOpacity=".3"/>
  <path d="M10 9h150" stroke="#fff" strokeOpacity=".45"/>
 </svg>;
}

// A 35 mm Portra 400 canister lying on its side, the leader pulled out onto the desk.
function FilmCanister(){
 return <svg className="ahCanister" viewBox="0 0 200 134" aria-hidden="true">
  <defs>
   <linearGradient id="fcBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#050505"/><stop offset=".28" stopColor="#2c2c2e"/><stop offset=".42" stopColor="#141415"/><stop offset="1" stopColor="#050505"/></linearGradient>
   <linearGradient id="fcFilm" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#6c3426"/><stop offset=".5" stopColor="#8a4a38"/><stop offset="1" stopColor="#6c3426"/></linearGradient>
   <filter id="fcCast" x="-20%" y="-30%" width="140%" height="160%"><feGaussianBlur stdDeviation="4"/></filter>
  </defs>
  <path d="M40 66h120v64H40z" fill="#000" opacity=".45" filter="url(#fcCast)" transform="translate(-6 6)"/>
  <path d="M52 66V20c0-10 6-16 16-16h14c8 0 12 4 12 12v16h48v34z" fill="url(#fcFilm)"/>
  {[12,24,36,48].map(y=><rect key={y} x="56" y={y} width="6" height="7" rx="1.2" fill="#2b1d14"/>)}
  {[40,52].map(y=><rect key={y} x="134" y={y} width="6" height="7" rx="1.2" fill="#2b1d14"/>)}
  <path d="M94 32c10 0 24 0 48 0" stroke="#ffffff22" strokeWidth="1"/>
  <rect x="16" y="86" width="16" height="26" rx="3" fill="#161617"/><path d="M19 90v18M23 90v18M27 90v18" stroke="#2e2e31" strokeWidth="1.3"/>
  <rect x="30" y="64" width="136" height="68" rx="5" fill="url(#fcBody)"/>
  <rect x="30" y="64" width="7" height="68" rx="2" fill="#1b1b1c"/><rect x="159" y="64" width="7" height="68" rx="2" fill="#1b1b1c"/>
  <text x="48" y="82" fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="9"><tspan fontWeight="800" fill="#fff">Kodak</tspan><tspan dx="1.5" fill="#fff">Professional</tspan></text>
  <text x="47" y="99" fontFamily="'Helvetica Neue',Arial,sans-serif" fontWeight="300" fontSize="15" letterSpacing=".4" fill="#fff">PORTRA 400</text>
  <text x="48" y="109" fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="6" fill="#e9e9e9">Color Negative Film</text>
  <rect x="46" y="114" width="110" height="9" fill="#f2b12c"/><text x="49" y="120.6" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="4.6" fill="#2b1a10">NOTES</text>
  <text x="41" y="122" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="5" fill="#bdbdbd" transform="rotate(-90 41 122)">C41</text>
  <path d="M36 70h124" stroke="#ffffff30" strokeWidth="1.5"/>
 </svg>;
}

export default function AfterHours({projects,onOpen}:{projects:Project[];onOpen:(id:string)=>void}){
 const devices:Device[]=ORDER.map(id=>{
  const p=projects.find(x=>x.id===id),x=EXTRA[id];
  return {id,...LAYOUT[id],title:p?.title||x.title,eyebrow:p?.company||x.eyebrow,line:p?.blurb||p?.summary||x.line,hint:x?.hint,caseId:p?id:undefined};
 });
 const stops=devices.length+1; // the overview, then one stop per device
 const trackRef=useRef<HTMLElement>(null),viewRef=useRef<HTMLDivElement>(null),stageRef=useRef<HTMLDivElement>(null);
 const [active,setActive]=useState(0);
 const [lampOn,setLampOn]=useState(false);
 // Decided before the first paint, so a phone never flashes the pinned desktop layout.
 const [isStatic,setStatic]=useState(()=>window.matchMedia('(max-width: 900px), (max-aspect-ratio: 23/20), (prefers-reduced-motion: reduce)').matches);
 const activeRef=useRef(0);
 const [listOpen,setListOpen]=useState(false);
 const listRef=useRef<HTMLDivElement>(null);

 useEffect(()=>{
  const mq=window.matchMedia('(max-width: 900px), (max-aspect-ratio: 23/20), (prefers-reduced-motion: reduce)');
  const set=()=>setStatic(mq.matches);set();mq.addEventListener('change',set);return()=>mq.removeEventListener('change',set);
 },[]);

 // Layout effect: the desk is framed before the first paint, never shown unscaled.
 useLayoutEffect(()=>{
  const stage=stageRef.current,track=trackRef.current,view=viewRef.current;if(!stage||!track||!view)return;
  view.style.visibility='hidden';
  if(isStatic){
   // A still flat lay that fits the column width.
   const fit=()=>{const w=stage.parentElement?.clientWidth||SW;stage.style.transform=`scale(${w/SW})`;view.style.visibility='visible'};
   fit();window.addEventListener('resize',fit);return()=>window.removeEventListener('resize',fit);
  }
  const HEAD=72;
  // Quintic easing has zero velocity AND acceleration at either end of a pan.
  const cl=(v:number)=>Math.max(0,Math.min(1,v)),ease=(t:number)=>t*t*t*(t*(t*6-15)+10);
  const camFor=(i:number,vw:number,vh:number)=>{
   const h=vh-HEAD,midY=HEAD+h/2;
   if(i===0){const s=Math.min(vw*.6/SW,h*.9/SH);return {s,cx:SW/2,cy:SH/2,X:vw*.64,Y:midY}}
   const d=devices[i-1];
   // Phones get a closer look so their type reads; bigger devices keep some desk around them.
   // fy nudges the framing down to include a prop that belongs with the device (the controller).
   const fy=d.fy||0,s=Math.min(2.6,vw*.46/d.w,h*(d.kind==='phone'?.82:.68)/(d.h+fy*2));
   return {s,cx:d.x+d.w/2,cy:d.y+d.h/2+fy,X:vw*.63,Y:midY};
  };
  let raf=0,idleTimer=0,pendingActive=0,lastTransform='',lastLamp:boolean|undefined;
  const settle=()=>{
   if(pendingActive!==activeRef.current){activeRef.current=pendingActive;setActive(pendingActive)}
  };
  const update=()=>{
   raf=0;
   if(isParked(track)){window.clearTimeout(idleTimer);return}
   const vw=window.innerWidth,vh=window.innerHeight,r=track.getBoundingClientRect(),total=track.offsetHeight-vh;
   if(r.bottom<-50||r.top>vh+50){window.clearTimeout(idleTimer);return}
   // Follow the browser's scroll position directly. An extra easing loop made wheel input
   // lag behind the page and kept repainting the whole desk after scrolling stopped.
   const top=r.top;
   // The desk keeps one viewing angle from its first visible frame; only its light warms on arrival.
   const arrive=cl(1-top/vh);
   const dusk=String(arrive);if(track.style.getPropertyValue('--dusk')!==dusk)track.style.setProperty('--dusk',dusk);
   const lamp=arrive>.62;
   if(lamp!==lastLamp){lastLamp=lamp;track.classList.toggle('lampOn',lamp);setLampOn(lamp)}
   // Give the pan room to breathe, followed by a stable, readable hold.
   const p=cl(-top/Math.max(1,total))*stops,seg=Math.min(stops-1,Math.floor(p)),t=p-seg;
   let a=camFor(seg,vw,vh),b=a,k=0;
   if(seg>0){const prev=camFor(seg-1,vw,vh);b=a;a=prev;k=ease(cl(t/.68))}
   const s=a.s*Math.pow(b.s/a.s,k);
   // Interpolate the rendered translation so a simultaneous zoom cannot swing
   // the camera past its destination. Both endpoints retain their exact framing.
   const x=(a.X-a.cx*a.s)*(1-k)+(b.X-b.cx*b.s)*k;
   const y=(a.Y-a.cy*a.s)*(1-k)+(b.Y-b.cy*b.s)*k;
   const transform=`translate(${x}px,${y}px) scale(${s})`;
   if(transform!==lastTransform){stage.style.transform=transform;lastTransform=transform}
   view.style.visibility='visible';
   // Update React only after scrolling settles so the live demos do not restart mid-pan.
   pendingActive=seg>0&&k<.5?seg-1:seg;
   window.clearTimeout(idleTimer);
   idleTimer=window.setTimeout(settle,160);
  };
  const onScroll=()=>{if(!raf)raf=requestAnimationFrame(update)};
  const redraw=()=>{cancelAnimationFrame(raf);raf=0;update()};
  update();window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',redraw);window.addEventListener(HOME_SHOWN,redraw);
  return()=>{window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',redraw);window.removeEventListener(HOME_SHOWN,redraw);cancelAnimationFrame(raf);window.clearTimeout(idleTimer)};
 },[isStatic]);

 // Jump to the middle of a stop's hold.
 const goTo=(i:number)=>{
  const track=trackRef.current;if(!track)return;
  if(isStatic){const d=devices[i-1];if(d?.caseId)onOpen(d.caseId);return}
  const total=track.offsetHeight-window.innerHeight,top=track.getBoundingClientRect().top+window.scrollY;
  const at=i===0?.2:i+.84;
  window.scrollTo({top:top+total*(at/stops)+1,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
 };
 // Wheel momentum can cross several short stops in one gesture. Advance one device with
 // the same browser scroll used by the rail, and let the next gesture advance again.
 useEffect(()=>{
  if(isStatic)return;
  const track=trackRef.current;if(!track)return;
  let locked=false,idle=0;
  // Keep a gesture locked until the browser's actual scroll has settled.
  // A fixed timeout alone can expire halfway through a long smooth scroll.
  const release=()=>{window.clearTimeout(idle);idle=window.setTimeout(()=>{locked=false},200)};
  const onScroll=()=>{if(locked)release()};
  const move=(direction:number)=>{
   const next=activeRef.current+direction;
   if(next>=stops)document.getElementById('about')?.scrollIntoView({behavior:'smooth',block:'start'});
   else goTo(Math.max(0,next));
  };
  const onWheel=(e:WheelEvent)=>{
   if(e.ctrlKey||e.defaultPrevented||Math.abs(e.deltaY)<2||Math.abs(e.deltaX)>Math.abs(e.deltaY)||isParked(track))return;
   if((e.target as Element)?.closest?.('.ahPop,input,textarea,select,[contenteditable]'))return;
   const r=track.getBoundingClientRect();
   if(r.top>0||r.bottom<window.innerHeight)return;
   if(activeRef.current===0&&e.deltaY<0)return;
   e.preventDefault();
   release();
   if(locked)return;
   locked=true;
   move(e.deltaY>0?1:-1);
  };
  const onKey=(e:KeyboardEvent)=>{
   if(e.key!=='ArrowDown'&&e.key!=='ArrowUp'||e.repeat||e.defaultPrevented||e.altKey||e.ctrlKey||e.metaKey||isParked(track))return;
   if((e.target as Element)?.closest?.('input,textarea,select,button,a,[contenteditable],[role="button"],[role="textbox"]'))return;
   const r=track.getBoundingClientRect();
   if(r.top>1||r.bottom<window.innerHeight-1||activeRef.current===0&&e.key==='ArrowUp')return;
   e.preventDefault();
   if(locked)return;
   locked=true;
   release();
   move(e.key==='ArrowDown'?1:-1);
  };
  track.addEventListener('wheel',onWheel,{passive:false});
  window.addEventListener('scroll',onScroll,{passive:true});
  document.addEventListener('keydown',onKey);
  return()=>{track.removeEventListener('wheel',onWheel);window.removeEventListener('scroll',onScroll);document.removeEventListener('keydown',onKey);window.clearTimeout(idle)};
 },[isStatic]);
 // The list is a quick pop-up over the tour, not a second copy of it under the desk.
 useEffect(()=>{
  if(!listOpen)return;
  const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape')setListOpen(false)};
  const onDown=(e:PointerEvent)=>{if(!listRef.current?.contains(e.target as Node))setListOpen(false)};
  document.addEventListener('keydown',onKey);document.addEventListener('pointerdown',onDown);
  return()=>{document.removeEventListener('keydown',onKey);document.removeEventListener('pointerdown',onDown)};
 },[listOpen]);
 const pick=(d:Device,i:number)=>{setListOpen(false);if(d.caseId)onOpen(d.caseId);else goTo(i+1)};

 const cur=active>0?devices[active-1]:null;
 const heading=<div className="ahIntro"><h2>Fun things I’ve built</h2><p>Side projects where I explore a product question, build the interaction, and learn from using it.</p></div>;

 return <section id="fun" className={`ahSection ${isStatic?'isStatic':''}`} aria-label="Fun things I’ve built">
  {isStatic&&heading}
  <section ref={trackRef} className={`ahTrack ${lampOn||isStatic?'lampOn':''}`} style={{'--stops':stops} as React.CSSProperties}>
   <div className="ahPin">
    <div ref={viewRef} className="ahView">
      <div ref={stageRef} className="ahStage">
       <div className="ahDesk" aria-hidden="true"/>
       <div className="ahBooks" aria-hidden="true"><i/><i/><i/></div>
       <MsuMug/>
       <div className="ahPad" aria-hidden="true"/>
       <XboxController/>
       <WatercolorTin/>
       <PortraBox speed="800"/>
       <FilmCanister/>
       <div className="ahSticky" aria-hidden="true">ship it<br/>tonight ✓</div>
       <div className="ahPen" aria-hidden="true"/>
       <div className="ahPencil" aria-hidden="true"/>
       {devices.map((d,i)=><DeviceView key={d.id} d={d} on={active===0||active===i+1} focus={isStatic||active===i+1} onPick={()=>goTo(i+1)}/>)}
       <div className="ahNight" aria-hidden="true"/>

      </div>
    </div>
    {!isStatic&&<>
     <div className="ahCaption" aria-live="polite">
      {cur?<div key={cur.id} className="ahCapCard"><h3>{cur.title}</h3><p>{cur.line}</p>{cur.hint&&<small>{cur.hint}</small>}{cur.caseId&&<button type="button" className="ahOpen" onClick={()=>onOpen(cur.caseId!)}>Read the case study <span aria-hidden="true">→</span></button>}</div>:heading}
     </div>
     <div className="ahRail" aria-label="After hours tour">
      <ol>{Array.from({length:stops},(_,i)=><li key={i}><button type="button" className={active===i?'isOn':''} onClick={()=>goTo(i)} aria-label={i===0?'The whole desk':devices[i-1].title} aria-current={active===i?'step':undefined}><span>{i===0?'Desk':devices[i-1].title}</span></button></li>)}
       <li><button type="button" className="ahNext" onClick={()=>document.getElementById('about')?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})} aria-label="Skip to the next section: About me"><span>Next: About me</span></button></li></ol>
      <div ref={listRef} className="ahListPop">
       <button type="button" className="ahSkip" aria-expanded={listOpen} aria-controls="fun-pop" onClick={()=>setListOpen(o=>!o)}>{listOpen?'Close list':'Show list'}</button>
       {listOpen&&<div id="fun-pop" className="ahPop" role="dialog" aria-label="All fun builds">
        <ol>{devices.map((d,i)=><li key={d.id}><button type="button" onClick={()=>pick(d,i)}>
         <span className="ahNum">{String(i+1).padStart(2,'0')}</span>
         <b>{d.title}</b><small>{d.eyebrow}</small>
         <em>{d.caseId?'Case study →':'Try it ↑'}</em>
        </button></li>)}</ol>
       </div>}
      </div>
     </div>
    </>}
   </div>
  </section>
  {isStatic?<div id="fun-list" className="ahList">
   <ol>{devices.map((d,i)=><li key={d.id}>
    <span className="ahNum">{String(i+1).padStart(2,'0')}</span>
    <h3>{d.title}</h3>
    <span className="ahMeta">{d.eyebrow}</span>
    <p>{d.line}</p>
    {d.caseId?<button type="button" onClick={()=>onOpen(d.caseId!)}>Read the case study <span aria-hidden="true">→</span></button>:!isStatic&&<button type="button" onClick={()=>goTo(i+1)}>Try it on the desk <span aria-hidden="true">↑</span></button>}
   </li>)}</ol>
  </div>:null}
 </section>;
}
