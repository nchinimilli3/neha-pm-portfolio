import React, {useState} from 'react';
import './graze.css';


function GrazeBoard(){
  const id=React.useId().replace(/:/g,'');
  const paint=(name:string)=>`url(#${name}-${id})`;
  return <svg className="grazeHeroFood" viewBox="0 0 820 620" role="img" aria-label="Code-drawn oak charcuterie board with brie, cheddar, crackers, grapes, salami roses, figs, olives, and rosemary">
    <defs>
      <linearGradient id={`wood-${id}`} x2=".2" y2="1"><stop stopColor="#deb580"/><stop offset=".4" stopColor="#c2925d"/><stop offset="1" stopColor="#a77240"/></linearGradient>
      <linearGradient id={`rind-${id}`} x2=".8" y2="1"><stop stopColor="#fff9db"/><stop offset=".55" stopColor="#ede3be"/><stop offset="1" stopColor="#c3aa7b"/></linearGradient>
      <linearGradient id={`cheese-${id}`} x2=".6" y2="1"><stop stopColor="#ffde8a"/><stop offset="1" stopColor="#dfa33b"/></linearGradient>
      <radialGradient id={`grape-${id}`} cx=".3" cy=".24"><stop stopColor="#b37485"/><stop offset=".32" stopColor="#81516d"/><stop offset=".8" stopColor="#513348"/><stop offset="1" stopColor="#322035"/></radialGradient>
      <radialGradient id={`olive-${id}`} cx=".3" cy=".25"><stop stopColor="#c4c780"/><stop offset=".6" stopColor="#7b8550"/><stop offset="1" stopColor="#45512f"/></radialGradient>
      <linearGradient id={`salami-${id}`} x2=".6" y2="1"><stop stopColor="#efa294"/><stop offset=".55" stopColor="#c56463"/><stop offset="1" stopColor="#854044"/></linearGradient>
      <radialGradient id={`honey-${id}`}><stop stopColor="#eabc58"/><stop offset=".75" stopColor="#b97424"/><stop offset="1" stopColor="#7d4f23"/></radialGradient>
      <filter id={`foodShadow-${id}`} x="-40%" y="-40%" width="180%" height="190%"><feDropShadow dx="2" dy="5" stdDeviation="4" floodColor="#402817" floodOpacity=".24"/></filter>
      <filter id={`boardShadow-${id}`} x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="6" dy="18" stdDeviation="15" floodColor="#492c1b" floodOpacity=".18"/></filter>
      <g id={`cracker-${id}`}><rect x="-24" y="-18" width="48" height="36" rx="7" fill="#d7a764" stroke="#bd8846" strokeWidth="2"/><rect x="-21" y="-15" width="42" height="30" rx="6" fill="#eed29d"/>{[-12,0,12].flatMap(x=>[-8,3,10].map(y=><circle key={`${x}-${y}`} cx={x} cy={y} r="1.1" fill="#aa834c"/>))}</g>
    </defs>
    <g transform="translate(52 84) rotate(-12 340 215)">
      <g filter={paint('boardShadow')}><path d="M63 29H590a28 28 0 0 1 28 28v106h93a30 30 0 0 1 0 60h-93v126a28 28 0 0 1-28 28H63a28 28 0 0 1-28-28V57a28 28 0 0 1 28-28Z" fill="#936139" transform="translate(0 10)"/><path d="M63 29H590a28 28 0 0 1 28 28v106h93a30 30 0 0 1 0 60h-93v126a28 28 0 0 1-28 28H63a28 28 0 0 1-28-28V57a28 28 0 0 1 28-28Z" fill={paint('wood')} stroke="#e0ba88" strokeWidth="3"/><circle cx="704" cy="193" r="12" fill="#93663f"/><circle cx="705" cy="190" r="9" fill="#f5f1e8"/>
      {Array.from({length:18},(_,i)=><path key={i} d={`M${53+i%3*5} ${48+i*18}q145 -8 284 0t259 -2`} fill="none" stroke={i%2?'#f1cd98':'#895c37'} strokeWidth={i%3===0?2:1} opacity=".18"/>)}</g>
      <g filter={paint('foodShadow')}>
        <g transform="translate(105 108) rotate(-18)">{Array.from({length:9},(_,i)=><use key={i} href={`#cracker-${id}`} transform={`translate(${i*13} ${i*3}) rotate(${i*3})`}/>)}</g>
        <g transform="translate(477 274) rotate(14)">{Array.from({length:7},(_,i)=><use key={i} href={`#cracker-${id}`} transform={`translate(${i*10} ${i*4}) rotate(${i*2})`}/>)}</g>
        <path d="M267 100 386 169 256 224Z" fill="#c3a978" transform="translate(0 12)"/><path d="M267 100 386 169 256 224Z" fill={paint('rind')} stroke="#f6edce" strokeWidth="5"/><path d="M267 109 374 169 261 216Z" fill="#f1e7c2"/><path d="M269 115 367 170" fill="none" stroke="#fff9e3" strokeWidth="4"/>
        <g transform="translate(349 257) rotate(12)">{[0,1,2,3,4].map(i=><g key={i} transform={`translate(${i*16} ${i*4})`}><path d="M-45-28 12-47 27 17-35 30Z" fill="#bb812e" transform="translate(0 5)"/><path d="M-45-28 12-47 27 17-35 30Z" fill={paint('cheese')} stroke="#f3cf76"/><circle cx="-17" cy="-9" r="4" fill="#cf9537" opacity=".6"/><circle cx="8" cy="9" r="3" fill="#cf9537" opacity=".6"/></g>)}</g>
        {[{x:441,y:119,r:45},{x:504,y:176,r:39},{x:430,y:190,r:31}].map(({x,y,r},index)=><g key={x+y} transform={`translate(${x} ${y})`}><circle r={r} fill="#783c41"/>{Array.from({length:8},(_,i)=><g key={i} transform={`rotate(${i*45+index*13})`}><path d={`M0 0Q${-r*.95} ${-r*.8} 0 ${-r}Q${r*.7} ${-r*.7} 0 0Z`} fill={paint('salami')} stroke="#f1b2a0" strokeWidth="2"/><circle cx="-7" cy={-r*.6} r="2" fill="#f5c6ae"/><circle cx="4" cy={-r*.8} r="1.5" fill="#f5c6ae"/></g>)}<path d="M-8 10Q-21-8 0-17Q20-8 8 8Q-4 20-8 0" fill={paint('salami')} stroke="#f4b0a0" strokeWidth="2"/></g>)}
        <g transform="translate(167 250)"><path d="M-36-43q60-35 116 2m-56-8 3 112" fill="none" stroke="#786244" strokeWidth="4"/>{[[0,0],[26,-23],[-24,12],[48,9],[5,31],[31,39],[60,34],[-15,46],[16,65],[43,66],[17,-19],[-10,-21],[68,-1],[40,0]].map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r={16+i%3} fill={paint('grape')}/><path d={`m${x-8} ${y-5}q1-6 7-6`} fill="none" stroke="#d4aabb" strokeWidth="2" opacity=".45"/></g>)}</g>
        <g transform="translate(311 306) rotate(-24)">{[-25,19].map((x,i)=><g key={x} transform={`translate(${x} ${i*8})`}><ellipse rx="24" ry="32" fill="#664053"/><ellipse rx="20" ry="28" fill="#e6b98f"/><ellipse rx="17" ry="24" fill="#a9525e"/>{Array.from({length:20},(_,j)=><circle key={j} cx={Math.sin(j*2.4)*j*.65} cy={Math.cos(j*2.4)*j*.95} r="1.1" fill="#f4d1a0"/>)}</g>)}</g>
        <g transform="translate(540 90)"><circle r="34" fill="#6c6658"/><circle cy="-4" r="33" fill="#e9e4cf"/><circle cy="-4" r="26" fill={paint('honey')}/><path d="M-15-18q18-9 29 4" stroke="#f7dfa0" strokeWidth="3" fill="none" opacity=".7"/></g>
        <g transform="translate(96 178)"><ellipse rx="33" ry="27" fill="#e5dfc7"/><ellipse cy="-4" rx="28" ry="24" fill="#9c977a"/>{[[-13,-10],[8,-12],[-3,6],[16,5],[-15,8]].map(([x,y])=><ellipse key={x} cx={x} cy={y} rx="11" ry="9" fill={paint('olive')} transform={`rotate(-20 ${x} ${y})`}/>)}</g>
      </g>
      {[{x:255,y:63,rotation:78},{x:539,y:323,rotation:-65},{x:94,y:330,rotation:30}].map(({x,y,rotation})=><g key={x} transform={`translate(${x} ${y}) rotate(${rotation})`}><path d="M0 0V-76" stroke="#6b7550" strokeWidth="2"/>{Array.from({length:9},(_,i)=><g key={i} transform={`translate(0 ${-i*8})`}><path d="M0 0Q-22-6-15-16Q-5-13 0 0M0 0Q20-6 13-16Q5-12 0 0" fill={i%2?'#657653':'#88916c'}/></g>)}</g>)}
    </g>
  </svg>;
}

export function GrazeHero(){
  return <figure className="grazeHero">
    <div className="grazeHeroRing" aria-hidden="true"/>
    <GrazeBoard/>
    <figcaption className="grazeHeroMenu"><span>ON THE MENU</span><strong>The next<br/>great location.</strong><div><span>Northville</span><b>123</b></div><div><span>Ann Arbor</span><b>122</b></div><div><span>Traverse City</span><b>101</b></div><small>Michigan shortlist · April 2024</small></figcaption>
    <span className="grazeHeroSeal" aria-hidden="true">GRAZE<br/><i>&</i> GROW</span>
  </figure>;
}
const criteria=[
  {name:'Strategic partnerships',short:'Partnerships',detail:'Complementary businesses, educational institutions, and event spaces.',example:'Event spaces',criticality:4,score:2,why:'Potential partners can create a recurring stream of catering occasions.'},
  {name:'Facility specifications',short:'Facility',detail:'Triple sinks, grease traps, suppliers, square footage, and rent.',example:'Square footage',criticality:5,score:5,why:'A promising market still needs a space that works operationally.'},
  {name:'Customer demographics',short:'Customers',detail:'Average income and the baseline B2B and B2C opportunity.',example:'Average income',criticality:2,score:2,why:'The local customer base needs to fit the offering.'},
  {name:'Competition intensity',short:'Competition',detail:'Charcuterie catering competitors and broader catering alternatives.',example:'Charcuterie catering threats',criticality:3,score:4,why:'The model considers both direct competitors and other catering choices.'}
];
export function GrazeRecipe(){
  const [selected,setSelected]=useState(0),item=criteria[selected];
  return <div className="grazeRecipe">
    <div className="grazeRecipeMenu"><span className="grazeEyebrow">THE LOCATION RECIPE</span><h3>Four ingredients.<br/>One consistent rubric.</h3><div className="grazeIngredientChoices" role="group" aria-label="Explore a scoring criterion">{criteria.map((c,i)=><button type="button" key={c.name} aria-pressed={selected===i} className={selected===i?'selected':''} onClick={()=>setSelected(i)}><span>0{i+1}</span><strong>{c.short}</strong><span aria-hidden="true">↗</span></button>)}</div></div>
    <div className="grazeRecipeDetail" aria-live="polite"><span className="grazeEyebrow">{item.name}</span><h4>{item.detail}</h4><p>{item.why}</p><div className="grazeMath"><div><b>{item.criticality}</b><span>Criticality</span></div><i>×</i><div><b>{item.score}</b><span>Score</span></div><i>=</i><div className="grazeMathResult"><b>{item.criticality*item.score}</b><span>Contribution</span></div></div><footer><strong>{item.example}</strong></footer></div>
  </div>;
}
const cities=[{name:'Northville',score:123,note:'Highest score in the team’s Michigan comparison.',next:'Investigate properties and potential owners alongside Ann Arbor.'},{name:'Ann Arbor',score:122,note:'Only one point behind Northville.',next:'Keep the two leading markets in consideration while testing property-level assumptions.'},{name:'Traverse City',score:101,note:'Lower score among the three markets evaluated.',next:'Research Traverse City as lower-priority in the property and owner investigation shortlist.'}];
export function GrazeLocations(){
  const [selected,setSelected]=useState(0),city=cities[selected];
  return <div className="grazeLocations"><div className="grazeLocationMenu"><header><span className="grazeEyebrow">MICHIGAN / LOCATION TASTING</span><h3>The shortlist</h3></header><div role="group" aria-label="Explore a candidate location">{cities.map((c,i)=><button key={c.name} type="button" className={selected===i?'selected':''} aria-pressed={selected===i} onClick={()=>setSelected(i)}><span>0{i+1}</span><strong>{c.name}</strong><i/><b>{c.score}</b></button>)}</div></div><aside className="grazeLocationReceipt" aria-live="polite"><span>LOCATION REVIEW</span><h4>{city.name}</h4><div className="grazeReceiptScore"><b>{city.score}</b><span>weighted score</span></div><div className="grazeScoreScale" aria-label={`${city.score} on the deck's 150-point scale`}><i style={{width:`${city.score/150*100}%`}}/></div><p>{city.note}</p><hr/><strong>Next step</strong><p>{city.next}</p><small>Shortlist evidence, not a confirmed franchise opening.</small></aside></div>;
}
export function GrazeGrowth(){
  const [branch,setBranch]=useState('Okemos');
  const partnerships=branch==='Okemos'?'Educational institutions, Capitol-area organizations, and event centers.':'Fitness centers, banquet halls, and religious centers.';
  return <div className="grazeGrowth"><div className="grazeBranchSwitch"><div role="group" aria-label="Choose an existing branch">{['Okemos','Shelby'].map(name=><button key={name} type="button" aria-pressed={branch===name} className={branch===name?'selected':''} onClick={()=>setBranch(name)}>{name}{name==='Shelby'?' Township':''}</button>)}</div></div><div className="grazeOrderTickets">
    <article><header><span>ORDER 01</span><b>BUILD AWARENESS</b></header><h3>Show up<br/>locally.</h3><p>Community outreach through local events and relationships.</p><footer><span>ON THE ACTION LIST</span><strong>Attend relevant community events.</strong></footer></article>
    <article><header><span>ORDER 02</span><b>CREATE REPEAT DEMAND</b></header><h3>Bring partners<br/>to the table.</h3><p aria-live="polite">{partnerships}</p><footer><span>ON THE ACTION LIST</span><strong>Reach out to nearby organizations about catering partnerships.</strong></footer></article>
    <article><header><span>ORDER 03</span><b>REACH LOCAL CUSTOMERS</b></header><h3>Make the<br/>feed appetizing.</h3><p>Targeted digital advertising aligned to each branch’s audience and geography.</p><footer><span>ON THE ACTION LIST</span><strong>Create targeted social graphics and track paid-ad performance.</strong></footer></article>
  </div></div>;
}

export function GrazeProjectPreview(){
  const asset=(path:string)=>`${import.meta.env.BASE_URL}${path}`;
  return <figure className="grazeProjectPreview" aria-label="Graze Craze franchise strategy: original location scorecard, scoring rubric, and Michigan shortlist presented together">
    <div className="grazePreviewHeading"><img src={asset('project-media/graze/logo.png')} alt="Graze Craze"/><span>FRANCHISE STRATEGY<br/><b>A repeatable location decision.</b></span></div>
    <div className="grazePreviewMap"><span>MICHIGAN SHORTLIST</span><img src={asset('project-media/graze/michigan.png')} alt="Original map of the three candidate Michigan markets"/><div>Northville · Ann Arbor<br/>Traverse City</div></div>
    <div className="grazePreviewRubric"><span>SCORING RUBRIC</span><img src={asset('project-media/graze-rubric.png')} alt="Original evaluation rubric"/></div>
    <div className="grazePreviewWorkbook"><header><span>▦</span><strong>Location scorecard</strong><small>Excel</small></header><img src={asset('project-media/graze-scorecard.png')} alt="Original Excel scorecard with weighted location criteria"/><footer><b>Evaluation</b><span>Criticality</span><span>Rubric</span></footer></div>
  </figure>;
}
