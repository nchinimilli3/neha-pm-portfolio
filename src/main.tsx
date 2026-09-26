import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
// CSS that LaptopOnly (now in the CaseStudy chunk) brought in here; kept in place so the cascade order is unchanged.
import './laptop-only.css';
import { createRoot } from 'react-dom/client';
import './styles.css';
import './estee.css';
// CSS that EsteeDemo (now in the CaseStudy chunk) brought in here; kept in place so the cascade order is unchanged.
import './estee-demo.css';
// CSS that FCVFCase (now in the CaseStudy chunk) brought in here; kept in place so the cascade order is unchanged.
import './lifecycle-road.css';
import './rolling-vehicle.css';
import './case-decision.css';
import './fcvf-visuals.css';
// CSS that KohlerVisuals (now in the CaseStudy chunk) brought in here; kept in place so the cascade order is unchanged.
import './kohler-visuals.css';
// CSS that AccentureVisuals (now in the CaseStudy chunk) brought in here; kept in place so the cascade order is unchanged.
import './accenture-visuals.css';
import AboutFilmCamera from './AboutFilmCamera';
import { AboutBookshelf, AboutRealityTV, type ShelfBook, type TvShow } from './AboutHobbies';
// CSS that FinSimpleCase (now in the CaseStudy chunk) brought in here; kept in place so the cascade order is unchanged.
import './finsimple.css';
import AfterHours from './AfterHours';
import { OpenAIWorkflow, SpartyCoach, PwcScorecard, FordShelby, FordCreditCar, SpectrumMap } from './ExperienceArt';
// CSS that FinSimpleEstimateDemo (now in the CaseStudy chunk) brought in here; kept in place so the cascade order is unchanged.
import './finsimple-demo.css';
import './accenture-v2.css';
// CSS that SchedulerPlannerHero (now in the CaseStudy chunk) brought in here; kept in place so the cascade order is unchanged.
import './scheduler-v2.css';
// CSS that AccentureSFHero (now in the CaseStudy chunk) brought in here; kept in place so the cascade order is unchanged.
import './accenture-sf-hero.css';
import DeskHero, { DeskGoodnight } from './DeskHero';
import AboutCorner from './AboutCorner';
import EducationConvergence from './EducationConvergence';
import { CASE_FILES, HOME_SHOWN, isParked, maximizeInto, setCaseLoader } from './CaseWindow';
// CSS that ChatVisuals (now in the CaseStudy chunk) brought in here; kept in place so the cascade order is unchanged.
import './chat-visuals.css';
// CSS that SchedulerVisuals (now in the CaseStudy chunk) brought in here; kept in place so the cascade order is unchanged.
import './scheduler-visuals.css';
// CSS that BookclubEditorial (now in the CaseStudy chunk) brought in here; kept in place so the cascade order is unchanged.
import './bookclub-editorial.css';
import './graze.css';
// CSS that GrazeScorecardDemo (now in the CaseStudy chunk) brought in here; kept in place so the cascade order is unchanged.
import './graze-scorecard-demo.css';
import './fcvf.css';
import './annotation-fixes.css';
import './annotation-final.css';
import './chat.css';
// CSS that CommuteCase (now in the CaseStudy chunk) brought in here; kept in place so the cascade order is unchanged.
import './commute-case.css';
import './commute-bart.css';
import './commute-surfaces.css';
import './commute-model-lab.css';
import './case-system.css';
import './responsive-v44.css';
import './experience-theme.css';
import './simple-view.css';

export const assetUrl=src=>{
  if(/^https?:\/\//.test(src))return src;
  const clean=src.replace(/^\/+/, '');
  return import.meta.env.DEV?`/${clean}`:`${import.meta.env.BASE_URL}${clean}`;
};
export const metrics = {
  kohler: [
    ['42%','less processing time','outcome'],
    ['71% → 94%','first-pass document accuracy','outcome'],
    ['5','person team','scope'],
    ['1 → any','destination markets per SKU','system']
  ],
  accenture: [
    ['~60 min','coordinator work saved per request','outcome'],
    ['21','live requests supported','scope'],
    ['3,862','user responses analyzed','analysis'],
    ['10-tab','automation data contract','artifact'],
    ['8x','requests per trainer, top vs. bottom decile of teams','outcome']
  ],
  fcvf: [
    ['+25%','assessment feedback submitted','outcome'],
    ['4','user interviews led','research']
  ],
  finsimple: [
    ['15%','less calendar time per story than the team’s prior average','outcome'],
    ['6%','fewer Salesforce write failures per submitted estimate','outcome']
  ],
  estee: [
    ['Top 5','finalist, Kode With Klossy × Estée Lauder','outcome']
  ],
  marketExpansion: [
    ['4','decision criteria','scope'],
    ['3','locations compared','analysis'],
    ['1','scorecard the client can rerun','artifact'],
    ['3','growth recommendations delivered','decision']
  ],
  commute: [
    ['4','apps this one replaced','scope'],
    ['9','live data sources, one decision','system']
  ]
};




export const projects = [
  {
    id:'commute',
    title:'Commute',
    company:'Independent app · iOS',
    summary:'A personal iOS app that tells me the latest I can wake up and still get to work on time.',
    blurb:'Learns my routine, simulates 1,000 mornings per departure, and chooses the latest wake time that still clears the arrival target.',
    media:'commute'
  },
  {
    id:'fcvf',
    title:'Customer Value Framework',
    company:'Ford Motor Company',
    preview:'Moved a customer-value assessment from Excel to the web, then used four interviews to raise feedback volume 25%.',
    summary:'A web version of the customer value assessment that Ford teams had been running in Excel.',
    media:'fcvf'
  },
  {
    id:'accenture',
    title:'AI Lab GTM Enablement',
    company:'Accenture · Frontier AI lab',
    preview:'Built and launched an AI workflow for a frontier AI lab that cuts ~60 min of coordinator work per request.',
    summary:'Go to market enablement for an AI lab, matching trainers to customer training sessions.',
    media:'accenture'
  },
  {
    id:'kohler',
    title:'Ship Anywhere',
    company:'Kohler Co. · MSU CSE Capstone',
    preview:'Built an export assistant that cut processing time 42% and raised first-pass accuracy from 71% to 94%.',
    summary:'An assistant that gets a Kohler order ready to ship to another country.',
    media:'kohler'
  },
  {
    id:'scheduler',
    title:'Group Scheduling App',
    company:'Live web product · CSE 477',
    summary:'A group scheduling app for students, built from a one line assignment: build When2meet.',
    blurb:'Keeps “maybe”, ranks the best time, and carries the choice into a venue poll, chat, and calendar event.',
    media:'scheduler'
  },
  {
    id:'finsimple',
    title:'Previous Estimates',
    company:'Ford Credit · FinSimple',
    preview:'Brought saved estimates back for returning customers, with 6% fewer write failures per estimate.',
    summary:'A way for returning Ford Credit customers to get back to an estimate they already built.',
    media:'finsimple'
  },
  {
    id:'marketExpansion',
    title:'Market Expansion Scorecard',
    company:'Consumer services client · Spectrum Consulting Group',
    preview:'Built a reusable scorecard to compare three markets on the same four criteria.',
    summary:'A scorecard that let a franchise client compare candidate markets the same way every time.',
    media:'marketExpansion'
  },
  {
    id:'chat',
    title:'iMessage Recreation on Web',
    company:'MSU · CSE 477',
    summary:'A real time chat room for a class assignment, built as an iMessage recreation.',
    blurb:'iMessage on the web, because everyone knew the spec. Typing expires; a Tapback edits the message.',
    media:'chat'
  },
  {
    id:'estee',
    title:'Double Wear Foundation',
    company:'Estée Lauder × Kode With Klossy',
    preview:'Turned a promotional brief into a product decision tool. Top 5 in the Estée Lauder challenge.',
    summary:'A one week build for the Kode With Klossy challenge: a Double Wear page that helps shoppers find their shade.',
    media:'estee'
  },
  {
    id:'bookclub',
    title:'Bookclub',
    company:'Independent product · live web app',
    summary:'A private app for my reading group, so picking books and tracking progress happen in one place.',
    blurb:'A private app for my reading group: pick the book, track progress, talk without spoilers. Live, and in use.',
    media:'bookclub'
  }
];

function CompanyBanner(){
 const logos=[['company-logos/ford-white-source.png','Ford'],['company-logos/ford-credit-white-source.png','Ford Credit'],['company-logos/esteelauder.png','Estée Lauder'],['company-logos/accenture-v31.png','Accenture'],['company-logos/kohler.svg','Kohler'],['company-logos/pwc-v31.png','PwC']];
 return <section className="companyBanner" aria-label="Companies and organizations I have built for"><span>Built for</span><div>{logos.map(([src,alt])=><img className={`companyBannerLogo companyBannerLogo-${alt.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`} key={alt} src={assetUrl(src)} alt={alt}/>)}</div></section>
}

function CompanyLogo({src='',alt='',label=''}){const [failed,setFailed]=useState(false);const fallback=label||alt.split(/\s+/).filter(Boolean).slice(0,2).map(word=>word[0]).join('').toUpperCase();return <div className={`companyLogo ${failed?'fallback':''}`}>{src&&!failed?<img loading="lazy" decoding="async" src={src} alt={alt} onError={()=>setFailed(true)}/>:<strong className="logoText" aria-label={alt}>{fallback}</strong>}</div>}


const experienceItems=[
 {id:'accenture',caseStudy:'accenture',note:'~60 min saved / request',company:'Accenture',role:'Technology Summer Analyst',location:'San Francisco, CA',dates:'Summer 2026',logo:'company-logos/accenture-v31.png',brand:{ink:'#3b1a57',accent:'#7a00c2',figure:'~60 min',label:'of coordinator work saved per request, now live',art:<OpenAIWorkflow/>},short:'Built and launched an AI workflow for a frontier AI lab that cuts ~60 min of coordinator work per request, after supporting 21 live enablement requests and writing the rules into a 10-tab data contract.',detail:<div className="expStory"><p>I worked inside a live customer-enablement operation supporting 21 requests. I used the repeated checks and exceptions I saw to document matching rules, build and launch the request workflow, and recommend what the program should improve next.</p><div className="expMetricRow"><span><b>21</b> live requests</span><span><b>10-tab</b> data contract</span><span><b>3,862</b> user responses</span></div><div className="expColumns"><div><strong>Live requests</strong><span>Supported intake, validation, trainer fit, scheduling, status management, global coverage across six regions, and closeout.</span></div><div><strong>Automation requirements</strong><span>Documented required inputs, matching rules, warnings, reason codes, QA cases, and human-review points so repeated checks could be tested before automation.</span></div><div><strong>Research and recommendations</strong><span>Analyzed 3,862 user responses and researched ~20 providers, narrowing the work into 27 metrics, 12 patterns, five recommendations, and a 90-day test plan.</span></div></div></div>},
 {id:'palmer',note:'200+ students coached',company:'Russell Palmer Career Management Center',role:'Peer Coach',location:'East Lansing, MI',dates:'May 2025-May 2026',logo:'company-logos/palmer-v31.png',brand:{ink:'#12352c',accent:'#18453b',figure:'40%',label:'of the positive feedback on a 25-coach team',art:<SpartyCoach/>},short:'Ran 20+ coaching sessions a week at MSU’s career center for 200+ undergraduates, and generated 40% of the positive feedback on a 25-coach team.',detail:<div className="expStory"><p>As a peer coach in MSU’s Russell Palmer Career Management Center, I met one-on-one with students for resume reviews, interview preparation, recruiting strategy, networking, and case prep. Each session ended with specific edits or next steps the student could use right away.</p><div className="expMetricRow"><span><b>20+</b> sessions weekly</span><span><b>200+</b> undergraduates coached</span><span><b>25</b> coaches on team</span></div></div>},
 {id:'fordcredit',caseStudy:'finsimple',note:'50% faster restoration',company:'Ford Credit',role:'Software Engineering Intern',location:'Dearborn, MI',dates:'Summers 2024-2025',logo:'company-logos/ford-credit-v31.png',brand:{ink:'#123466',accent:'#1f4d8c',figure:'50%',label:'less restoration time, from four recovery playbooks',art:<FordCreditCar/>},short:'Owned a customer-facing Ford Credit feature from requirements through production, improved delivery 15%, and turned recurring incidents into four playbooks that cut restoration time 50%.',detail:<div className="expStory"><p>As the sole intern embedded on FinSimple, I worked on customer-facing feature delivery and the systems around it: AEM, Salesforce APIs, QA and production environments, release coordination, incidents, and onboarding.</p><div className="expMetricRow"><span><b>15%</b> faster delivery</span><span><b>25</b> issues investigated</span><span><b>4</b> recovery playbooks</span><span><b>50</b> people across 5 teams</span></div><div className="expColumns"><div><strong>Product</strong><span>Built AEM components and Salesforce-backed workflows from customer and business requirements; worked across UI behavior, REST/GraphQL integration, Postman validation, and testing through development, QA, and production.</span></div><div><strong>Delivery quality</strong><span>Reviewed QA security-scan findings and PR compliance, documented release and environment-tagging workflows, and researched OAuth/API error patterns to support reliable deployments.</span></div><div><strong>Production operations</strong><span>Monitored live incidents, analyzed customer-impacting failure patterns, and coordinated with Payment, DevOps, and QA teams while turning recurring issues into four reusable recovery playbooks.</span></div></div><div className="expNote">I also built a centralized onboarding hub from 15 technical resources across 3 teams, cutting intern ramp-up from ~2 weeks to 3 days.</div></div>},
 {id:'pwc',note:'5 of 5 recs adopted',company:'PwC × Arc of Indiana',role:'Consulting Extern',location:'',dates:'Aug-Oct 2024',logo:'company-logos/pwc-v31.png',brand:{ink:'#5a2308',accent:'#c24502',figure:'5 of 5',label:'recommendations adopted by the client’s leadership',art:<PwcScorecard/>},short:'Benchmarked five peer nonprofits for The Arc of Indiana on a seven-category scorecard I built, and all five recommendations were adopted.',detail:<div className="expStory"><p>Over a five-week externship, I independently researched The Arc of Indiana and peer organizations it could learn from. I defined the comparison criteria, built a weighted seven-category scorecard, benchmarked five organizations across 10+ engagement and innovation metrics, and turned the findings into recommendations for the client.</p><div className="expMetricRow"><span><b>7</b> scorecard categories</span><span><b>5</b> peer organizations</span><span><b>10+</b> metrics</span></div></div>},
 {id:'ford',caseStudy:'fcvf',note:'+25% feedback',company:'Ford Motor Company',role:'Software Engineering Intern',location:'Dearborn, MI',dates:'Summer 2023',logo:'company-logos/ford.png',brand:{ink:'#0b2a55',accent:'#1a4a8f',figure:'+25%',label:'feedback volume after four user interviews reshaped the app',art:<FordShelby/>},short:'Built Ford’s Customer Value Framework as a web app, led four user interviews, and changed the interaction model based on them. Feedback volume went up 25%.',detail:<div className="expStory"><p>My first internship put me close to both the code and the user. On a 10-person team, I helped build the full-stack Customer Value Framework, interviewed users, and used what we learned to change the product and implementation.</p><div className="expMetricRow"><span><b>4</b> user interviews</span><span><b>100+</b> Git commits</span><span><b>7</b> legacy CSS files replaced</span></div><div className="expColumns two"><div><strong>What I owned</strong><span>Frontend and backend implementation, accessibility improvements, refactoring, user interviews, Agile planning, and turning product feedback into interface changes, including pagination and score-visibility changes.</span></div><div><strong>What changed</strong><span>We moved toward a multi-page experience, removed the in-progress score, and replaced seven legacy CSS files with a more maintainable Material-UI approach while feedback volume increased 25%.</span></div></div></div>},
 {id:'spectrum',caseStudy:'marketExpansion',note:'7 client projects',company:'Spectrum Consulting Group',role:'Consultant',location:'East Lansing, MI',dates:'2022–May 2026',logo:'company-logos/spectrum-v31.png',brand:{ink:'#123f22',accent:'#1f7a3c',figure:'7',label:'client projects across five industries',art:<SpectrumMap/>},short:'Seven client projects across consumer services, utilities, hospitality, automotive, and private equity: a location scorecard the client can rerun, 19 KPIs for a utility software selection, and a market-penetration strategy for a portfolio company in insurance tech.',detail:<div className="expStory"><div className="expMetricRow"><span><b>3,000+</b> data points</span><span><b>19</b> utility KPIs</span><span><b>3</b> locations compared</span><span><b>2</b> analysts mentored</span></div><div className="expColumns spectrumColumns"><div><strong>Consumer services</strong><span>Built an interactive Excel scorecard and rubric so the team could compare candidate locations using the same market and operating criteria. The team also developed community, partnership, and paid-media recommendations for existing branches.</span></div><div><strong>Utilities</strong><span>Built a criticality/feasibility rubric, defined 19 KPIs, and evaluated three software options for a multimillion-dollar utility.</span></div><div><strong>Hospitality</strong><span>Found engagement gaps across 3,000+ responses and recommended three digital initiatives that increased social interaction by 20%.</span></div><div><strong>Automotive SaaS</strong><span>Led the analysis workstream: combined customer pain points with funnel evidence, redesigned lead-management workflows, and defined target accounts, buyer roles, outreach sequences, CRM handoffs, and demo guidance tied to the workflow problems behind them.</span></div><div><strong>Private equity</strong><span>Built a market-penetration strategy for a private equity client’s portfolio company in insurance tech, and supported the value-creation work around integration and process rollout.</span></div></div></div>},
];


function ExperienceSection({onOpen}){
 const [openIds,setOpenIds]=useState([]);
 const itemRefs=useRef({});
 // The number and object float up beside the summary; summaries differ in height, so measure each
 // one and let the CSS place the float just under the date row instead of a fixed distance up.
 useLayoutEffect(()=>{
  const measure=()=>openIds.forEach(id=>{const el=itemRefs.current[id],sum=el?.querySelector('.experienceSummary');if(sum)el.style.setProperty('--sumH',`${sum.offsetHeight}px`)});
  measure();window.addEventListener('resize',measure);return()=>window.removeEventListener('resize',measure);
 },[openIds]);
 const toggle=id=>{
  const opening=!openIds.includes(id);
  setOpenIds(current=>current.includes(id)?current.filter(x=>x!==id):[...current,id]);
  // An opened role is sized to fit one screen, so bring all of it into view when it doesn't already fit.
  if(opening)requestAnimationFrame(()=>requestAnimationFrame(()=>{const el=itemRefs.current[id];if(!el)return;const r=el.getBoundingClientRect(),top=84;if(r.top<top||r.bottom>window.innerHeight)window.scrollBy({top:r.top-top,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}));
 };
 return <section id="experience" className="section experienceSection v28Experience"><div className="experienceIntro"><div className="sectionTitle compactTitle"><h2>Experience</h2></div><p>Product decisions grounded in customer research, operational evidence, and hands-on delivery. Open a role to see what I owned and what changed.</p></div><div className="experienceAccordion">{experienceItems.map((x,index)=>{const isOpen=openIds.includes(x.id);return <article ref={el=>{if(el)itemRefs.current[x.id]=el}} className={`experienceItem experience-${x.id} ${x.brand?'expBranded':''} ${isOpen?'open':''}`} style={x.brand?{'--exp-ink':x.brand.ink,'--exp-accent':x.brand.accent} as React.CSSProperties:undefined} key={x.id}><button className="experienceSummary" onClick={()=>toggle(x.id)} aria-expanded={isOpen} aria-label={`${x.company}: ${isOpen?'collapse details':'expand details'}`}><span className="experienceIndex" aria-hidden="true">{String(index+1).padStart(2,'0')}</span><CompanyLogo src={x.logo} alt={x.company}/><div><div className="expHead"><h3>{x.company}</h3>{x.note&&<em className="expChip">{x.note}</em>}</div><span className="experienceRole">{x.role}</span>{x.location&&<span className="experienceLocation">{x.location}</span>}<p>{x.short}</p></div><time>{x.dates}</time><b className="expToggle" aria-hidden="true">{isOpen?'−':'+'}</b></button><div className="experienceDetail" aria-hidden={!isOpen} hidden={!isOpen}><div>{x.brand&&<aside className="expBrandHero"><p><b>{x.brand.figure}</b><span>{x.brand.label}</span></p>{x.brand.art}</aside>}{x.detail}{x.caseStudy&&<button type="button" className="expCaseStudyLink" onClick={()=>onOpen?.(x.caseStudy)}>Read the case study <span aria-hidden="true">→</span></button>}</div></div></article>})}</div></section>
}



function EducationSection(){
 return <section id="education" className="section educationSection" aria-labelledby="education-heading"><div className="sectionTitle compactTitle"><h2 id="education-heading">Education</h2></div><EducationConvergence/></section>
}



const aboutFilmPhotos=[
  {src:'project-media/about-film/01.jpg',width:1050,height:650,alt:'Golden Gate Bridge and Baker Beach framed by dark tree branches'},
  {src:'project-media/about-film/02.jpg',width:1002,height:1512,alt:'Yosemite granite cliffs rising above a green meadow and trees'},
  {src:'project-media/about-film/03.jpg',width:1086,height:1283,alt:'Banana plants and tropical greenery at a roadside farm in Hawaii'},
  {src:'project-media/about-film/04.jpg',width:1127,height:1409,alt:'Presidio buildings and palms with the Golden Gate Bridge behind them'},
  {src:'project-media/about-film/05.jpg',width:1193,height:1800,alt:'Two graduates walking together through a warmly lit arched hallway'},
  {src:'project-media/about-film/06.jpg',width:750,height:1133,alt:'Paddleboarder on clear blue Lake Tahoe framed by tall trees'},
  {src:'project-media/about-film/07.jpg',width:1002,height:1512,alt:'Turquoise cove and waterfall along a rocky California coastline'},
  {src:'project-media/about-film/08.jpg',width:1193,height:1800,alt:'Graduation portrait between colorful library stacks'},
  {src:'project-media/about-film/09-conservatory.jpg',width:1193,height:1800,alt:'Water lilies and hanging orchids under the glass roof of a plant conservatory'},
  {src:'project-media/about-film/10.jpg',width:1333,height:883,alt:'Painted Ladies with the San Francisco skyline in the distance'}
];

const shelfBooks:ShelfBook[]=[
  {title:'A Thousand Splendid Suns',author:'Khaled Hosseini',cloth:'#6d2631',foil:'#d6b066',motif:'sun'},
  {title:'When Breath Becomes Air',author:'Paul Kalanithi',cloth:'#264a3f',foil:'#d3ad63',motif:'breath'},
  {title:'The Year of Magical Thinking',author:'Joan Didion',cloth:'#b6863a',foil:'#3b2612',motif:'moons'},
  {title:'Sharp Objects',author:'Gillian Flynn',cloth:'#28314f',foil:'#d4b06a',motif:'shards'}
];
const tvShows:TvShow[]=[
  {title:'Modern Family',kicker:'Sitcom',from:'#ffcf7a',to:'#e0793f',doodle:'house'},
  {title:'Vanderpump Rules',kicker:'Reality',from:'#f7a9c0',to:'#b0406a',doodle:'glass'},
  {title:'Summer House',kicker:'Reality',from:'#8fdde0',to:'#2b8aa6',doodle:'beach'},
  {title:'Real Housewives',kicker:'The newest season',from:'#d8c2f2',to:'#6f4db3',doodle:'diamond'}
];

/* Two paper planes take off from "traveling" on a loop, each leaving a dotted
   trail: one loops the loop off the end of the word, one glides over the top.
   The trails and the flight paths share the same curves (px, word-relative). */
const TRAVEL_FLIGHTS=[
 'M50 26C60 18 71 6 65-1C59-7 48 2 57 8C67 14 84 4 106-4',
 'M2 29C9 13 24 3 40 5S72 17 92 8'
];
function TravelPlanes(){
 return <span className="travelSky" aria-hidden="true">
  <svg className="travelTrails" viewBox="0 0 120 40" width="120" height="40">
   <defs>{TRAVEL_FLIGHTS.map((d,i)=><mask key={i} id={`travelReveal${i}`} maskUnits="userSpaceOnUse" x="-20" y="-40" width="180" height="100"><path className={`travelReveal travelFlight${i}`} d={d} pathLength={1}/></mask>)}</defs>
   {TRAVEL_FLIGHTS.map((d,i)=><path key={i} className={`travelTrail travelFlight${i}`} d={d} mask={`url(#travelReveal${i})`}/>)}
  </svg>
  {TRAVEL_FLIGHTS.map((d,i)=><span key={i} className={`travelPlane travelFlight${i}`} style={{offsetPath:`path('${d}')`}}>
   <svg viewBox="0 0 14 10"><path className="planeWing" d="M.6 5 13.4.6 8 9.4 6.3 6.1Z"/><path className="planeFold" d="M13.4.6 6.3 6.1 4.8 8.6"/></svg>
  </span>)}
 </span>;
}

/* "baking": a pinch of sprinkles scatters off the top of the word, tumbles, and
   falls back through a soft puff of flour, every few seconds. The hops stay low
   so they never land on the line above. [x drift, peak, landing, spin, colour] */
const BAKE_SPRINKLES:[number,number,number,number,string][]=[
 [-30,-9,12,300,'#f4a6bd'],[-18,-12,9,-260,'#ffc857'],[-6,-13,11,220,'#7fcdb0'],[8,-12,8,-320,'#a98ee8'],
 [21,-10,12,280,'#f5846f'],[-40,-5,14,-200,'#7fcdb0'],[2,-14,7,360,'#f4a6bd'],[-12,-11,13,-300,'#a98ee8'],
 [32,-8,10,-240,'#ffc857'],[42,-4,15,200,'#f4a6bd']
];
function BakeSprinkles(){
 return <span className="bakeSky" aria-hidden="true">
  <span className="bakeFlour"><i/><i/><i/></span>
  {BAKE_SPRINKLES.map(([dx,up,down,spin,c],i)=><span key={i} className="bakeSprinkle" style={{'--dx':`${dx}px`,'--up':`${up}px`,'--down':`${down}px`,'--spin':`${spin}deg`,'--c':c,'--k':i} as React.CSSProperties}><i><b/></i></span>)}
 </span>;
}

function BookRecForm(){
 const [book,setBook]=useState('');
 const [status,setStatus]=useState('idle');
 const [sentBook,setSentBook]=useState('');
 const inputRef=useRef<HTMLInputElement>(null);
 const submit=async(e)=>{
   e.preventDefault();
   const value=book.trim();
   if(!value||status==='sending')return;
   setStatus('sending');
   try{
     const response=await fetch('https://formsubmit.co/ajax/chinimi2@msu.edu',{
       method:'POST',
       headers:{'Content-Type':'application/json','Accept':'application/json'},
       body:JSON.stringify({
         _subject:'New book recommendation from your portfolio',
         recommendation:value,
         _template:'table',
         _honey:''
       })
     });
     if(!response.ok)throw new Error('Submission failed');
     setSentBook(value);
     setBook('');
     setStatus('sent');
   }catch{
     setStatus('error');
   }
 };
 return <form className={`bookRecForm ${status}`} onSubmit={submit}>
  <p className="bookRecTitle"><svg className="bookRecIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 6.5C10 5 7 4.6 3.5 5v13c3.5-.4 6.5 0 8.5 1.5 2-1.5 5-1.9 8.5-1.5V5C17 4.6 14 5 12 6.5z"/><path d="M12 6.5v13"/></svg>Reading anything good? Send me a rec.</p>
  {status==='sent' ? <div className="bookRecConfirmation" role="status">
   <span className="bookRecConfirmCopy"><strong className="brThanks">got it, thank you!</strong>{sentBook&&<span>“{sentBook}” is going on my list.</span>}</span>
   <button type="button" onClick={()=>{setStatus('idle');requestAnimationFrame(()=>inputRef.current?.focus())}}>Send another</button>
   <svg className="bookRecScene brMail" viewBox="0 0 120 90" aria-hidden="true" focusable="false">
    <ellipse cx="60" cy="84" rx="52" ry="4" fill="#3a2a1c" opacity=".12"/>
    <g className="brBox"><rect x="84" y="48" width="6" height="36" rx="1.5" fill="#7a5a3c"/><path d="M68 34a19 19 0 0 1 38 0v18H68Z" fill="#2c4a8a"/><rect x="68" y="44" width="38" height="8" fill="#23407a"/><rect x="74" y="31" width="20" height="3.4" rx="1.7" fill="#0f1f3d"/>
     <g className="brFlag"><rect x="104" y="26" width="2.4" height="20" rx="1" fill="#6b6b6b"/><rect x="106" y="26" width="10" height="6.5" rx="1" fill="#d9483b"/></g></g>
    <g className="brLetter">
     <g className="brNote"><rect x="10" y="22" width="44" height="34" rx="2" fill="#fffdf8" stroke="#e1d6c6"/><path d="M16 32h26M16 38h32M16 44h22" stroke="#b9c7da" strokeWidth="1.4"/><path d="M40 47c3-4 6-4 8 0" stroke="#b0452f" fill="none" strokeWidth="1.4"/></g>
     <g className="brEnv"><rect x="8" y="30" width="48" height="30" rx="2" fill="#f1e2c6" stroke="#d7c09a"/><path d="M8 60l20-15 4 3 4-3 20 15" fill="none" stroke="#d7c09a"/><path className="brFlap" d="M8 30l24 17 24-17Z" fill="#e9d4ae" stroke="#d7c09a"/></g>
    </g>
   </svg>
  </div> : <div className="bookRecRow">
   <input ref={inputRef} id="book-rec" aria-label="Leave me a book rec" value={book} onChange={e=>{setBook(e.target.value);if(status==='error')setStatus('idle')}} placeholder="Title and author" autoComplete="off" disabled={status==='sending'}/>
   <button type="submit" disabled={!book.trim()||status==='sending'}>{status==='sending'?'Sending…':'Send →'}</button>
  </div>}
  {status==='error'&&<span className="bookRecStatus" role="status">Couldn’t send that one. Try again.</span>}
 </form>
}

function Home({openCase,onChangeView}){
 // Phone nav: every link lives in a sheet behind a menu button.
 const [navOpen,setNavOpen]=useState(false);
 const navToggleRef=useRef<HTMLButtonElement>(null);
 const navRef=useRef(null);const [activeSection,setActiveSection]=useState('');const [navInd,setNavInd]=useState<React.CSSProperties>({opacity:0});
 useEffect(()=>{const ids=['projects','experience','fun'];const onScroll=()=>{if(isParked(navRef.current))return;const y=window.innerHeight*.35;let cur='';for(const id of ids){const el=document.getElementById(id);if(el&&el.getBoundingClientRect().top<y)cur=id}const about=document.getElementById('about');if(about&&about.getBoundingClientRect().top<y)cur='';setActiveSection(cur)};onScroll();window.addEventListener('scroll',onScroll,{passive:true});return()=>window.removeEventListener('scroll',onScroll)},[]);
 useEffect(()=>{const nav=navRef.current;if(!nav)return;const a=activeSection&&nav.querySelector(`a[href="#${activeSection}"]`);if(!a){setNavInd(v=>({...v,opacity:0}));return}setNavInd({opacity:1,width:`${a.offsetWidth}px`,transform:`translateX(${a.offsetLeft}px)`})},[activeSection]);
 useEffect(()=>{if(!navOpen)return;const k=e=>{if(e.key==='Escape'){setNavOpen(false);navToggleRef.current?.focus()}};window.addEventListener('keydown',k);return()=>window.removeEventListener('keydown',k)},[navOpen]);
 // The About photo can be taken over by the film camera, the bookshelf, or the TV: one at a time.
 const [aboutView,setAboutView]=useState<'photo'|'film'|'books'|'tv'>('photo');
 const [filmIndex,setFilmIndex]=useState(0);
 const aboutPhotoRef=useRef<HTMLDivElement>(null);
 const openAbout=(view:'film'|'books'|'tv')=>{
   setAboutView(view);
   // Stacked layouts put the photo above the copy, so bring it into view.
   requestAnimationFrame(()=>{const r=aboutPhotoRef.current?.getBoundingClientRect();if(r&&(r.top<60||r.top>window.innerHeight*.55))window.scrollTo({top:window.scrollY+r.top-88,behavior:'smooth'})});
 };
 const closeAbout=useCallback(()=>setAboutView('photo'),[]);
 // Looping decoration (planes, sprinkles, steam, screen flicker) only runs in sections on screen.
 // First paint is just the desk hero; everything below builds right after, well before the
 // walk-in's long scroll can reach it (so it's never seen building). A deep link builds it all at once.
 const [rest,setRest]=useState(()=>!!window.location.hash);
 useEffect(()=>{if(rest)return;const go=()=>setRest(true);const ric=window.requestIdleCallback;let r2=0,id=0;
  // After the hero's first frame has painted, once the browser is idle (at most 1.2s later).
  const r1=requestAnimationFrame(()=>{r2=requestAnimationFrame(()=>{id=ric?ric(go,{timeout:1200}):window.setTimeout(go,300)})});
  return()=>{cancelAnimationFrame(r1);cancelAnimationFrame(r2);if(ric)window.cancelIdleCallback(id);else clearTimeout(id)}},[rest]);
 useEffect(()=>{const secs=document.querySelectorAll<HTMLElement>('.homePage>section:not(#top)');if(!secs.length)return;const io=new IntersectionObserver(es=>es.forEach(e=>e.target.toggleAttribute('data-offscreen',!e.isIntersecting)),{rootMargin:'200px 0px'});secs.forEach(s=>io.observe(s));return()=>io.disconnect()},[rest]);
 const serious=['fcvf','accenture','finsimple','kohler','marketExpansion','estee'].map(id=>projects.find(p=>p.id===id)).filter(Boolean);
 const fun=['commute','bookclub','scheduler','chat'].map(id=>projects.find(p=>p.id===id)).filter(Boolean);
 return <><button type="button" className="viewSkip" onClick={()=>onChangeView(true)}>Skip the animation: switch to Simple view</button>
 <header className={`siteHeader homeHeader${navOpen?' navIsOpen':''}`}><a className="wordmark" href="#top">Neha Chinimilli</a><button ref={navToggleRef} type="button" className="navToggle" aria-expanded={navOpen} aria-controls="primaryNav" aria-label={navOpen?'Close menu':'Open menu'} onClick={()=>setNavOpen(o=>!o)}><span/><span/></button><nav id="primaryNav" ref={navRef} aria-label="Primary" onClick={e=>{if((e.target as HTMLElement).closest('a'))setNavOpen(false)}}><i className="navIndicator" aria-hidden="true" style={navInd}/><a href="#projects" className={activeSection==='projects'?'isActive':''}>Selected work</a><a href="#experience" className={activeSection==='experience'?'isActive':''}>Experience</a><a href="#fun" className={activeSection==='fun'?'isActive':''}>Fun things I’ve built</a><a href="Neha_Chinimilli_Resume.pdf" target="_blank" rel="noreferrer">Resume</a><a href="mailto:chinimi2@msu.edu">Email</a><a className="headerLinkedIn" href="https://github.com/nchinimilli3" target="_blank" rel="noreferrer" aria-label="Neha Chinimilli on GitHub"><img src={assetUrl('github.svg')} alt="GitHub"/></a><a className="headerLinkedIn" href="https://www.linkedin.com/in/nchinimilli" target="_blank" rel="noreferrer" aria-label="Neha Chinimilli on LinkedIn"><img src={assetUrl('linkedin.svg')} alt="LinkedIn"/></a></nav><ViewModeToggle simple={false} onChange={onChangeView}/></header>
 <main id="main-content" className="homePage">
  <DeskHero projects={serious} openCase={openCase} onSimple={()=>onChangeView(true)}/>
  {rest&&<><CompanyBanner/>
  <ExperienceSection onOpen={openCase}/><EducationSection/>
  <AfterHours projects={fun} onOpen={openCase}/>
  <section id="about" className="section aboutSection">
    <div className="aboutPhoto" ref={aboutPhotoRef}>{aboutView==='books'?<AboutBookshelf books={shelfBooks} onClose={closeAbout}/>:aboutView==='tv'?<AboutRealityTV shows={tvShows} onClose={closeAbout}/>:aboutView==='film'?<AboutFilmCamera photos={aboutFilmPhotos} open index={filmIndex} onClose={closeAbout} onChange={setFilmIndex}/>:<AboutCorner onOpen={v=>{openAbout(v);if(v==='film')setFilmIndex(0)}}/>}</div><div className="aboutCopy"><h2>About me</h2><p>I’m Neha, finishing <strong>two degrees at Michigan State in Computer Science and Supply Chain Management</strong>. I’m drawn to work where I can understand why a system is hard to use, decide what should change, and help ship a better version. I’m a <span className="creativeWord" tabIndex={0} aria-label="creative">{"creative".split("").map((c,i)=><span key={i} aria-hidden="true" style={{"--i":i} as React.CSSProperties}>{c}</span>)}<svg className="creativeLine" viewBox="0 0 120 14" preserveAspectRatio="none" aria-hidden="true"><path d="M3 9 C 18 3, 30 13, 46 7 S 74 3, 88 8 S 108 12, 117 5"/></svg><svg className="creativeWash" viewBox="-130 -70 260 140" aria-hidden="true">
 <defs>
  <filter id="wcBleed" x="-30%" y="-30%" width="160%" height="160%">
   <feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="3" seed="7" result="n"/>
   <feDisplacementMap in="SourceGraphic" in2="n" scale="16" xChannelSelector="R" yChannelSelector="G" result="d"/>
   <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3" result="grain"/>
   <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -.9 1.05" result="g"/>
   <feComposite in="d" in2="g" operator="in" result="grained"/>
   <feGaussianBlur in="grained" stdDeviation=".6"/>
  </filter>
  {[['wcRose','#f3a0b8','#d9587e'],['wcPeach','#fbc79a','#e8844f'],['wcGold','#fbd98f','#e0a13a'],['wcCoral','#f7a58f','#d9604f']].map(([id,a,e])=><radialGradient key={id} id={id}><stop offset="0" stopColor={a} stopOpacity=".28"/><stop offset=".62" stopColor={a} stopOpacity=".5"/><stop offset=".86" stopColor={e} stopOpacity=".72"/><stop offset=".95" stopColor={e} stopOpacity=".9"/><stop offset="1" stopColor={e} stopOpacity="0"/></radialGradient>)}
 </defs>
 <g filter="url(#wcBleed)">
  {[[-70,-8,34,'wcRose'],[-22,-30,28,'wcPeach'],[34,-22,32,'wcCoral'],[78,6,26,'wcGold'],[-40,26,24,'wcPeach'],[22,30,27,'wcRose'],[-98,14,15,'wcCoral'],[100,-28,13,'wcRose']].map(([x,y,r,f],i)=><circle key={i} className="wcPool" cx={x} cy={y} r={r} fill={`url(#${f})`} style={{"--k":i} as React.CSSProperties}/>)}
  {[[-112,-34,2.6,'#d9587e'],[-86,-48,1.6,'#e8844f'],[112,32,2.2,'#d9604f'],[92,48,1.4,'#e0a13a'],[-60,50,1.8,'#d9587e'],[58,-50,2,'#e8844f'],[124,-6,1.3,'#d9587e'],[-124,40,1.2,'#e0a13a']].map(([x,y,r,c],i)=><circle key={'d'+i} className="wcDrop" cx={x} cy={y} r={r} fill={c as string} style={{"--k":i} as React.CSSProperties}/>)}
 </g>
</svg></span> at heart, so I care about how a product feels, not only whether it works. I’ve built customer-facing software at Ford and Ford Credit and worked on product and business problems at Accenture and Spectrum. That mix is why I’m pursuing product management.</p><p className="hobbyLine">Outside of work, I’m usually trying a new coffee shop<span className="coffeeCup" aria-hidden="true"><svg viewBox="0 0 24 24"><path className="steam s1" d="M9.5 8.5c-1.3-1.2 1.3-2.3 0-3.6s0-2.4 0-2.4"/><path className="steam s2" d="M13 8.5c-1.3-1.2 1.3-2.3 0-3.6s0-2.4 0-2.4"/><path className="cupLine" d="M5 11h13v3.5A5.5 5.5 0 0 1 12.5 20h-2A5.5 5.5 0 0 1 5 14.5z"/><path className="cupLine" d="M18 12.2h.9a2.2 2.2 0 0 1 0 4.4h-1.3"/><path className="cupLine" d="M4 22h15"/></svg></span>, <span className="travelWord">traveling<TravelPlanes/></span>, <span className="filmPhotoTriggerWrap"><button type="button" className="filmPhotoTrigger" onClick={()=>openAbout('books')} aria-expanded={aboutView==='books'}>reading</button><span className="filmPhotoHint" role="tooltip">click to see my shelf</span></span>, keeping up with <span className="filmPhotoTriggerWrap"><button type="button" className="filmPhotoTrigger" onClick={()=>openAbout('tv')} aria-expanded={aboutView==='tv'}>reality TV</button><span className="filmPhotoHint" role="tooltip">click to turn it on</span></span>, <span className="bakeWord">baking<BakeSprinkles/></span>, hiking, painting, or taking <span className="filmPhotoTriggerWrap"><button type="button" className="filmPhotoTrigger" onClick={()=>{openAbout('film');setFilmIndex(0)}} aria-expanded={aboutView==='film'}>film photos</button><span className="filmPhotoHint" role="tooltip">click to see my photos</span></span>.</p><div className="aboutActions"><BookRecForm/></div></div></section>
  <DeskGoodnight/>
 </>}</main>
 </>
}

function ScrollToTopButton(){
 const [visible,setVisible]=useState(false);
 const [progress,setProgress]=useState(0);
 useEffect(()=>{const update=()=>{setVisible(window.scrollY>520);const max=document.documentElement.scrollHeight-window.innerHeight;setProgress(max>0?Math.min(1,window.scrollY/max):0)};update();window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);return()=>{window.removeEventListener('scroll',update);window.removeEventListener('resize',update)}},[]);
 return <button type="button" className={`scrollTopButton ${visible?'visible':''}`} onClick={()=>window.scrollTo({top:0,behavior:(document.documentElement.dataset.view==='simple'||window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth') as ScrollBehavior})} aria-label="Back to top" title="Back to top"><svg className="scrollRing" viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="scrollRingInk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" className="scrollRingStop1"/><stop offset="1" className="scrollRingStop2"/></linearGradient></defs><circle cx="24" cy="24" r="22" className="scrollRingTrack"/><circle cx="24" cy="24" r="22" className="scrollRingFill" style={{strokeDashoffset:138.2*(1-progress)}}/></svg><span aria-hidden="true">↑</span></button>
}

function ViewModeToggle({simple,onChange}:{simple:boolean,onChange:(simple:boolean)=>void}){
 return <button type="button" className="viewModeToggle" onClick={()=>onChange(!simple)} title={simple?'Back to the illustrated desk and Neha OS':'Everything on one plain page, no animation'}>
  {simple?<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="2" y="2" width="12" height="9" rx="1"/><path d="M5 14h6M8 11v3M4 8l3-3 2 2 2-1 1 2"/></svg>:<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3h10M3 7h10M3 11h7"/></svg>}
  <span>{simple?'Full experience':'Simple view'}</span>
 </button>
}

/* Simple view: the same content as the illustrated homepage, laid out for a
   one-minute scan. Every number comes from the metrics/experience data above
   (which match the resume); nothing here is written only for this view. */
const SIMPLE_PROOF=[[...metrics.accenture[0].slice(0,2),'Accenture'],[...metrics.kohler[1].slice(0,2),'Kohler · MSU capstone'],[...metrics.fcvf[0].slice(0,2),'Ford'],['50%','less incident restoration time','Ford Credit']];
// Which metric leads each case row: the one its preview and desk window already use.
const SIMPLE_LEAD_METRIC:Record<string,number>={fcvf:0,accenture:0,finsimple:1,kohler:0,marketExpansion:3,estee:0};
const SIMPLE_SKILLS=[['Skills','Python, Java, C/C++, JavaScript, TypeScript, React, Swift, HTML/CSS, Ruby, SQL, Power BI, Excel, PowerPoint, Git, R'],['Software','Jira, Confluence, ServiceNow, Splunk, Adobe Experience Manager, Google Cloud, GraphQL, Figma, OpenAI API']];
const EMAIL='chinimi2@msu.edu',LINKEDIN='https://www.linkedin.com/in/nchinimilli',RESUME='Neha_Chinimilli_Resume.pdf';

function SimpleHome({openCase,onChangeView}:{openCase:(id:string)=>void,onChangeView:(simple:boolean)=>void}){
 const [navOpen,setNavOpen]=useState(false);
 const navToggleRef=useRef<HTMLButtonElement>(null);
 useEffect(()=>{if(!navOpen)return;const close=(e:KeyboardEvent)=>{if(e.key==='Escape'){setNavOpen(false);navToggleRef.current?.focus()}};window.addEventListener('keydown',close);return()=>window.removeEventListener('keydown',close)},[navOpen]);
 const selected=['fcvf','accenture','finsimple','kohler','marketExpansion','estee'].map(id=>projects.find(p=>p.id===id)).filter(Boolean);
 const independent=['commute','bookclub','scheduler','chat'].map(id=>projects.find(p=>p.id===id)).filter(Boolean);
 const caseLink=(id:string)=>({href:`#/projects/${id}`,onClick:(e:React.MouseEvent)=>{if(e.button===0&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey){e.preventDefault();openCase(id)}}});
 const head=(id:string,title:string,note?:string)=><div className="sHead"><h2 id={`${id}-h`}>{title}</h2>{note&&<p>{note}</p>}</div>;
 return <><a className="viewSkip" href="#main-content">Skip to content</a>
 <header className={`simpleHeader homeHeader${navOpen?' navIsOpen':''}`}><a className="simpleWordmark" href="#top">Neha Chinimilli</a><button ref={navToggleRef} type="button" className="navToggle" aria-expanded={navOpen} aria-controls="simpleNav" aria-label={navOpen?'Close menu':'Open menu'} onClick={()=>setNavOpen(o=>!o)}><span/><span/></button><nav id="simpleNav" aria-label="Primary" onClick={e=>{if((e.target as HTMLElement).closest('a'))setNavOpen(false)}}><a href="#projects">Work</a><a href="#experience">Experience</a><a href="#education">Education</a><a href="#skills">Skills</a><a href="#contact">Contact</a><a href={RESUME} target="_blank" rel="noreferrer">Resume <span aria-hidden="true">↗</span></a></nav><ViewModeToggle simple onChange={onChangeView}/></header>
 <main className="simpleHome" id="main-content" tabIndex={-1}>
  <section className="sLead" id="top" aria-labelledby="simple-name">
   <div className="sLeadMain"><h1 id="simple-name">Neha Chinimilli</h1><p className="sPitch"><b>Product-minded engineer</b> who turns customer and operations problems into shipped software, most recently at Accenture, Ford Credit, and Ford.</p>
    <div className="sActions"><a className="sPrimary" href={RESUME} target="_blank" rel="noreferrer">Resume (PDF) <span aria-hidden="true">↗</span></a><a href={`mailto:${EMAIL}`}>{EMAIL}</a><a href={LINKEDIN} target="_blank" rel="noreferrer">LinkedIn <span aria-hidden="true">↗</span></a></div></div>
   <dl className="sFacts"><div><dt>Education</dt><dd>B.S. Computer Science + B.A. Supply Chain Management, Michigan State University · May 2027</dd></div><div><dt>Most recent</dt><dd>Technology Summer Analyst, Accenture · Summer 2026</dd></div><div><dt>Before that</dt><dd>Software Engineering Intern, Ford Credit and Ford · 2023–2025</dd></div></dl>
   <ul className="sProof" aria-label="Headline results">{SIMPLE_PROOF.map(([v,l,who])=><li key={l}><b>{v}</b><span>{l}</span><small>{who}</small></li>)}</ul>
  </section>
  <section className="sSection" id="projects" aria-labelledby="projects-h">{head('projects','Selected work','Each opens a case study: the problem, my decisions, and what changed.')}
   <div className="sRows">{selected.map(p=>{const m=metrics[p.id]?.[SIMPLE_LEAD_METRIC[p.id]??0];return <article className="sWork" key={p.id}><div><span className="sMeta">{p.company}</span><h3><a {...caseLink(p.id)}>{p.title}<span aria-hidden="true"> →</span></a></h3><p>{p.preview||p.summary}</p></div>{m&&<p className="sMetric"><b>{m[0]}</b><span>{m[1]}</span></p>}</article>})}</div></section>
  <section className="sSection" id="experience" aria-labelledby="experience-h">{head('experience','Experience')}
   <div className="sRows">{experienceItems.map(x=><article className="sRole" key={x.id}><div className="sRoleHead"><h3>{x.company}</h3><span>{x.role}</span><time>{x.dates}</time></div><p>{x.short}</p>{x.caseStudy&&<a className="sMore" {...caseLink(x.caseStudy)}>Related case study<span aria-hidden="true"> →</span></a>}</article>)}</div></section>
  <section className="sSection" id="education" aria-labelledby="education-h">{head('education','Education')}
   <div className="sRows"><article className="sRole"><div className="sRoleHead"><h3>Michigan State University</h3><span>B.S. Computer Science · B.A. Supply Chain Management</span><time dateTime="2027-05">Expected May 2027</time></div><p>College of Engineering and Broad College of Business. Dean’s List, 6 of 8 semesters.</p></article></div></section>
  <section className="sSection" id="skills" aria-labelledby="skills-h">{head('skills','Skills & tools')}
   <dl className="sSkills">{SIMPLE_SKILLS.map(([k,v])=><div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl></section>
  <section className="sSection" id="fun" aria-labelledby="fun-h">{head('fun','Independent builds','Products and experiments I made on my own or for class.')}
   <div className="sBuilds">{independent.map(p=><article key={p.id}><h3><a {...caseLink(p.id)}>{p.title}<span aria-hidden="true"> →</span></a></h3><span className="sMeta">{p.company}</span><p>{p.blurb||p.summary}</p></article>)}<article><h3>Spartan Touchdown</h3><span className="sMeta">MSU · CSE 335</span><p>A C++ team game with player movement, collisions, enemies, scoring, and a shared level state.</p></article><article><h3>Stable Fluids</h3><span className="sMeta">MSU · CSE 476</span><p>An interactive 2D fluid simulation in C++ using the Stam method.</p></article></div></section>
  <section className="sSection" id="about" aria-labelledby="about-h">{head('about','About')}
   <div className="sProse"><p>I’m drawn to work where I can understand why a system is hard to use, decide what should change, and help ship a better version. My background in software and operations is why I’m pursuing product management.</p><p>Outside work, I’m usually trying a new coffee shop, reading, hiking, painting, or taking film photos.</p></div></section>
  <section className="sSection" id="contact" aria-labelledby="contact-h">{head('contact','Contact')}
   <div className="sProse"><p className="sEmail"><a href={`mailto:${EMAIL}`}>{EMAIL}</a></p><div className="sActions"><a className="sPrimary" href={RESUME} target="_blank" rel="noreferrer">Resume (PDF) <span aria-hidden="true">↗</span></a><a href={LINKEDIN} target="_blank" rel="noreferrer">LinkedIn <span aria-hidden="true">↗</span></a></div></div></section>
 </main><footer className="simpleFooter"><span>© 2026 Neha Chinimilli</span><button type="button" onClick={()=>onChangeView(false)}>See the full experience</button><a href="#top">Back to top ↑</a></footer></>
}

// View preference: ?view=simple|full (a link Neha can send) beats the saved choice.
const VIEW_KEY='neha-view-mode';
const initialSimple=()=>{const q=new URLSearchParams(window.location.search).get('view');if(q==='simple'||q==='full')return q==='simple';try{return localStorage.getItem(VIEW_KEY)==='simple'}catch{return false}};

// Case study pages (and their CSS) are a separate chunk: see CaseStudy.tsx.
type CaseProps={id:string;onBack:()=>void};
let CaseStudy:React.ComponentType<CaseProps>|null=null;
let caseLoad:Promise<void>|null=null;
const loadCaseStudy=()=>caseLoad??=import('./CaseStudy').then(m=>{CaseStudy=m.default},e=>{caseLoad=null;throw e});
setCaseLoader(loadCaseStudy);

function App(){
 const route=()=>{const project=window.location.hash.match(/^#\/projects\/([^/?#]+)/);if(project)return {type:'case',id:project[1]};return {type:'home'}};
 const [current,setCurrent]=useState(route);
 const [simple,setSimple]=useState(initialSimple);
 useLayoutEffect(()=>{document.documentElement.dataset.view=current.type==='home'&&simple?'simple':'full'},[simple,current.type]);
 // Read by callbacks that the kept-alive home holds on to, so they never see a stale route.
 const onCase=useRef(current.type==='case');onCase.current=current.type==='case';
 const viewAnchor=useRef<{id:string,offset:number}|null>(null);
 const restoreViewFocus=useRef(false);
 const changeView=(next:boolean)=>{
  if(next===simple)return;
  restoreViewFocus.current=true;
  const isHome=!onCase.current;
  const candidates=Array.from(document.querySelectorAll<HTMLElement>(isHome?'#top, #projects, #experience, #education, #skills, #fun, #about, #contact':'.casePage section[id]'));
  const visible=candidates.filter(el=>{const r=el.getBoundingClientRect();return r.bottom>80&&r.top<window.innerHeight*.75});
  let active=visible.sort((a,b)=>Math.abs(a.getBoundingClientRect().top-80)-Math.abs(b.getBoundingClientRect().top-80))[0]||candidates[0];
  const projectAnchor=document.getElementById('projects');
  if(isHome&&active?.id==='top'&&projectAnchor&&active.contains(projectAnchor)&&projectAnchor.getBoundingClientRect().top<=160)active=projectAnchor;
  // Sections that only exist in one view land on their nearest neighbour.
  const id=isHome&&active?({skills:'education',contact:'about'}[active.id]||active.id):active?.id;
  viewAnchor.current=active?{id,offset:isHome?0:Math.max(0,80-active.getBoundingClientRect().top)}:null;
  // Only an explicit choice is remembered; it also retires a ?view= link param.
  try{localStorage.setItem(VIEW_KEY,next?'simple':'full')}catch{}
  const url=new URL(window.location.href);if(url.searchParams.has('view')){url.searchParams.delete('view');history.replaceState(history.state,'',url.pathname+url.search+url.hash)}
  setSimple(next);
 };
 useLayoutEffect(()=>{
  const anchor=viewAnchor.current;if(!anchor)return;viewAnchor.current=null;
  const align=()=>{
   const target=document.getElementById(anchor.id);if(!target)return;
   const offset=Math.min(anchor.offset,Math.max(0,target.offsetHeight-160));
   window.scrollTo({top:Math.max(0,window.scrollY+target.getBoundingClientRect().top-80+offset),behavior:'instant' as ScrollBehavior});
  };
  align();
  if(restoreViewFocus.current){restoreViewFocus.current=false;document.querySelector<HTMLButtonElement>('.homeHeader .viewModeToggle')?.focus({preventScroll:true})}
  // The illustrated room measures its scale on mount. Align again once those
  // layout effects and ResizeObserver updates have settled.
  let second=0;const first=requestAnimationFrame(()=>{align();second=requestAnimationFrame(align)});
  return()=>{cancelAnimationFrame(first);cancelAnimationFrame(second)};
 },[simple]);
 const homeScroll=useRef(0);
 const restoreHomeScroll=useRef(false);
 // Back button out of a case: return to where home was, like the red button does.
 useEffect(()=>{const onHash=()=>{const next=route();if(onCase.current&&next.type==='home')restoreHomeScroll.current=true;setCurrent(next)};window.addEventListener('hashchange',onHash);return()=>window.removeEventListener('hashchange',onHash)},[]);
 // Restore during layout, before paint (and before a closing view transition
 // snapshots the page); once more a frame later in case late layout moved it.
 useLayoutEffect(()=>{
  if(current.type!=='home'||!restoreHomeScroll.current)return;
  restoreHomeScroll.current=false;
  const go=()=>window.scrollTo({top:homeScroll.current,behavior:'instant' as ScrollBehavior});
  go();window.dispatchEvent(new Event(HOME_SHOWN));requestAnimationFrame(go);
 },[current]);
 const openCase=(id)=>{homeScroll.current=window.scrollY;window.location.hash=`/projects/${id}`;setCurrent({type:'case',id});requestAnimationFrame(()=>window.scrollTo({top:0,behavior:'instant' as ScrollBehavior}))};
 const closeRoute=()=>{restoreHomeScroll.current=true;history.pushState(null,'',window.location.pathname+window.location.search);setCurrent({type:'home'})};
 // Once home has been shown it stays mounted, parked under any case (see isParked).
 // Landing straight on a case (or opening one from Simple view) loads its chunk on demand;
 // otherwise it's preloaded once the browser is idle after the first paint.
 const [,caseLoaded]=useState(0);
 useEffect(()=>{if(current.type==='case'&&!CaseStudy)loadCaseStudy().then(()=>caseLoaded(n=>n+1),()=>{})},[current]);
 useEffect(()=>{const ric=window.requestIdleCallback,warm=()=>{loadCaseStudy().catch(()=>{})};const id=ric?ric(warm,{timeout:2500}):window.setTimeout(warm,1500);return()=>{if(ric)window.cancelIdleCallback(id);else clearTimeout(id)}},[]);
 const homeMounted=useRef(false);
 const isCase=current.type==='case';
 if(!isCase)homeMounted.current=true;
 // Parking and unparking only flips the wrapper; the home tree itself doesn't re-render.
 const homeEl=useMemo(()=>simple?<SimpleHome openCase={openCase} onChangeView={changeView}/>:<Home openCase={openCase} onChangeView={changeView}/>,[simple]);
 return <>
  {homeMounted.current&&<div className="homeKeep" data-parked={isCase?'':undefined} inert={isCase} aria-hidden={isCase||undefined}>{homeEl}</div>}
  {isCase&&CaseStudy&&<CaseStudy id={current.id} onBack={closeRoute}/>}
  <ScrollToTopButton/>
 </>;
}

// Easter eggs: a hello for anyone who opens dev tools, and a tab title that
// calls you back when you wander off (per case, restored on return).
console.log('%cHi 👋','font:700 28px system-ui;color:#7b4bd1');
console.log("%cIf you're reading the console, you're the kind of person I want to work with.\nnchinimilli5@gmail.com",'font:15px/1.5 system-ui;color:#444');
const AWAY_TITLES:Record<string,string>={commute:'⏰ your alarm is going off',bookclub:'📚 come back, the book club is waiting',scheduler:'📅 still free at 2?',chat:'💬 typing…',fcvf:'🏁 the Mustang is idling',finsimple:'🧾 your estimate is ready',estee:'💄 touch-up time',kohler:'🚿 still shipping anywhere',accenture:'🚋 one request still in the queue',marketExpansion:'🧀 the cheese is getting warm'};
let homeTitle=document.title;
document.addEventListener('visibilitychange',()=>{
 if(document.hidden){homeTitle=document.title;const id=location.hash.match(/^#\/projects\/([^/?#]+)/)?.[1];document.title=(id&&AWAY_TITLES[id])||'👀 come back, there’s more'}
 else document.title=homeTitle;
});

createRoot(document.getElementById('root')).render(<App/>);
