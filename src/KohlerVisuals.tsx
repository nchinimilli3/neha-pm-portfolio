import React from 'react';
import './kohler-visuals.css';

const asset = (src: string) => `${import.meta.env.BASE_URL}${src}`;

function Stamp({children, className = ''}: {children: React.ReactNode; className?: string}) {
 return <span className={`kxStamp ${className}`}>{children}</span>;
}

// In stock, missing paperwork, held shipment: three objects on one shipping line.
export function KohlerOrderHold() {
 return <div className="kxHold" aria-label="A faucet is in stock, but missing market documents put the export order on hold">
  <div className="kxHoldBeat">
   <div className="kxHoldArt"><svg className="kxFaucet" viewBox="0 0 160 130" role="img" aria-label="Single-handle faucet">
     <defs>
      <linearGradient id="kxChrome" x1="0" x2="1"><stop offset="0" stopColor="#6f7a80"/><stop offset=".18" stopColor="#e9eef1"/><stop offset=".42" stopColor="#9aa5ab"/><stop offset=".62" stopColor="#f7f9fa"/><stop offset="1" stopColor="#5d686e"/></linearGradient>
      <linearGradient id="kxChromeV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f4f7f8"/><stop offset=".45" stopColor="#a3adb3"/><stop offset=".7" stopColor="#e3e8eb"/><stop offset="1" stopColor="#6b767c"/></linearGradient>
      <radialGradient id="kxShadow"><stop offset="0" stopColor="#1f2b27" stopOpacity=".28"/><stop offset="1" stopColor="#1f2b27" stopOpacity="0"/></radialGradient>
     </defs>
     <ellipse cx="62" cy="122" rx="46" ry="6" fill="url(#kxShadow)"/>
     <rect x="38" y="110" width="48" height="10" rx="3" fill="url(#kxChromeV)"/>
     <rect x="50" y="46" width="24" height="66" rx="3" fill="url(#kxChrome)"/>
     <path d="M50 52c0-26 18-40 44-40h26c10 0 17 7 17 17v6h-16v-4c0-3-2-5-5-5H94c-15 0-24 9-24 26z" fill="url(#kxChromeV)"/>
     <rect x="119" y="33" width="20" height="10" rx="2" fill="url(#kxChrome)"/>
     <rect x="121" y="43" width="16" height="3" rx="1.5" fill="#4d575c"/>
     <path d="M74 60l30-12a4 4 0 0 1 5 2l1 3a4 4 0 0 1-3 5l-33 10z" fill="url(#kxChromeV)"/>
     <path d="M53 50v58" stroke="#fff" strokeOpacity=".7" strokeWidth="2" strokeLinecap="round"/>
     <path d="M60 30c8-9 20-14 34-14" stroke="#fff" strokeOpacity=".75" strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg><i className="kxCheck" aria-hidden="true">✓</i></div>
   <div className="kxHoldText"><strong>K-14402 is in stock</strong><span>Physical inventory is confirmed.</span></div>
  </div>
  <div className="kxHoldBeat">
   <div className="kxHoldArt kxGhostPages" aria-hidden="true">{['Spec', 'Warranty', 'Labels'].map((doc, i) => <span key={doc} style={{'--i': i} as React.CSSProperties}>{doc}</span>)}</div>
   <div className="kxHoldText"><strong>The India packet is missing</strong><span>Spec sheet, warranty, and labels still need to be prepared.</span></div>
  </div>
  <div className="kxHoldBeat isHeld">
   <div className="kxHoldArt kxHoldRoute" aria-hidden="true"><b>US</b><i/><b>IN</b><Stamp>On hold</Stamp></div>
   <div className="kxHoldText"><strong>Order SO-28471 stops</strong><span>Inventory is available, but the order cannot ship.</span></div>
  </div>
 </div>;
}

const people = [
 {role: 'Warehouse associate', job: 'Starts the export request and follows the preparation steps.', skin: '#c68b67', shirt: '#245b48', hair: '#2b211c'},
 {role: 'Product data owner', job: 'Provides the approved product information used in the packet.', skin: '#8d5a42', shirt: '#927047', hair: '#1c1715'},
 {role: 'Regional compliance', job: 'Checks destination-specific requirements and unresolved issues.', skin: '#e2b995', shirt: '#4f7f6c', hair: '#6d4630'},
 {role: 'Order operations', job: 'Reviews the completed packet before the order continues.', skin: '#6b4535', shirt: '#b7894f', hair: '#151313'},
];

// Four roles share one line through a single export packet.
export function KohlerRoles() {
 const avatar = (p: typeof people[number]) => <svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="31" className="kxHalo"/><path d="M12 60c2-14 10-21 20-21s18 7 20 21" fill={p.shirt}/><circle cx="32" cy="25" r="11" fill={p.skin}/><path d="M20 24c0-9 5-14 12-14s13 5 12 14c-3-5-7-7-12-7s-9 2-12 7" fill={p.hair}/></svg>;
 return <div className="kxRoles">
  <h3>Four roles work from the same packet</h3>
  <ol>
   {people.slice(0, 2).map(p => <li key={p.role}>{avatar(p)}<strong>{p.role}</strong><span>{p.job}</span></li>)}
   <li className="kxRolesCore" aria-hidden="true"><svg viewBox="0 0 90 104"><path d="M14 10h46l18 18v66H14z" className="kxSheetBack" transform="rotate(-7 45 52)"/><path d="M12 8h48l18 18v70H12z" className="kxSheet"/><path d="M60 8v18h18" className="kxFold"/><path d="M24 40h40M24 50h40M24 60h28" className="kxLines"/><circle cx="62" cy="80" r="10" className="kxSeal"/><path d="M57 80l4 4 7-8" className="kxSealTick"/></svg></li>
   {people.slice(2).map(p => <li key={p.role}>{avatar(p)}<strong>{p.role}</strong><span>{p.job}</span></li>)}
  </ol>
 </div>;
}

// Packing line: approved sources drop onto a belt, an agent station assembles the packet, and a person stamps it at the gate.
export function KohlerAssembly() {
 const sources = [
  {name: 'Order', system: 'SAP', q: 'What is shipping where?', icon: <path d="M6 3h9l4 4v14H6zM15 3v4h4M9 12h7M9 16h5"/>},
  {name: 'Product', system: 'PIM', q: 'Which product facts are approved?', icon: <path d="M5 9h10a3 3 0 0 1 3 3v1h2M9 9V5h3v4M12 13v3M5 9v4"/>},
  {name: 'Market', system: 'Rules', q: 'What does India require?', icon: <><circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.8 3 2.8 14 0 17M12 3.5c-2.8 3-2.8 14 0 17"/></>},
 ];
 const steps = [
  {zone: 'Fixed rules', tone: 'rules', icon: <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z"/>, title: 'Gather approved information', copy: 'Order, product, and market data come from the systems that own them. Required fields, sources, and format are checked against explicit rules.'},
  {zone: 'AI assistance', tone: 'ai', icon: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/>, title: 'Assemble the market packet', copy: 'Azure and Databricks provide context. An agent drafts market-specific material and points out what is still missing.'},
  {zone: 'Human review', tone: 'human', icon: <path d="M12 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM4.5 21c.8-4.6 3.7-7 7.5-7s6.7 2.4 7.5 7"/>, title: 'A person approves the packet', copy: 'Conflicting sources, uncertain translations, and incomplete evidence stay visible. The order never moves on its own.'},
 ];
 return <div className="kxLine" aria-label="Order, product, and market information are assembled into an India export packet, then held for a person to review">
  <div className="kxLineStage">
   <div className="kxBelt" aria-hidden="true"><i/></div>
   <span className="kxCargo" aria-hidden="true"/>

   <div className="kxStation kxInputs">
    {sources.map(src => <div key={src.name} className="kxSource">
     <span className="kxSourceIcon" aria-hidden="true"><svg viewBox="0 0 24 24">{src.icon}</svg></span>
     <div><strong>{src.q}</strong><span>{src.name} · {src.system}</span></div>
    </div>)}
   </div>

   <div className="kxStation kxAgent">
    <svg className="kxArm" viewBox="0 0 120 90" aria-hidden="true"><path d="M10 6h40M30 6v24l36 18v12"/><circle cx="30" cy="30" r="5"/><circle cx="66" cy="48" r="5"/><path d="M58 64h16l-3 8H61z"/></svg>
    <svg className="kxFolder" viewBox="0 0 160 120" aria-hidden="true">
     <path d="M8 26h52l10 10h82v76H8z" className="kxFolderBack"/>
     <rect x="22" y="14" width="46" height="20" rx="4" className="kxTab kxTab1"/><rect x="66" y="10" width="44" height="24" rx="4" className="kxTab kxTab2"/><rect x="108" y="16" width="40" height="18" rx="4" className="kxTab kxTab3"/>
     <path d="M8 44h144v68H8z" className="kxFolderFront"/>
     <path d="M26 66h60M26 78h84M26 90h48" className="kxFolderLines"/>
    </svg>
    <ul className="kxPacketTabs"><li className="t1">Purist® facts</li><li className="t2">English + Hindi · A4</li><li className="t3">3 ready · 1 open</li></ul>
    <p className="kxChain"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>Every line keeps its source link</p>
   </div>

   <div className="kxStation kxGate">
    <svg className="kxClipboard" viewBox="0 0 140 170" aria-hidden="true">
     <rect x="10" y="16" width="120" height="150" rx="10" className="kxBoard"/><rect x="46" y="6" width="48" height="22" rx="6" className="kxClip"/>
     <path d="M24 56l6 6 10-12M24 90l6 6 10-12" className="kxOk"/><path d="M50 56h62M50 90h56" className="kxRow"/>
     <circle cx="32" cy="124" r="9" className="kxWarn"/><path d="M32 119v6M32 129v.5" className="kxWarnMark"/><path d="M50 124h48" className="kxRow"/>
    </svg>
    <ul className="kxGateList"><li>Product facts</li><li>Regional spec</li><li className="isOpen">Warranty language</li></ul>
    <Stamp className="kxGateStamp">Ready after 1 review</Stamp>
   </div>
  </div>

  <ol className="kxLineSteps">{steps.map((step, i) => <li key={step.zone} className={`is-${step.tone}`}>
   <span className="kxZone"><b>{i + 1}</b><svg viewBox="0 0 24 24" aria-hidden="true">{step.icon}</svg>{step.zone}</span>
   <strong>{step.title}</strong>
   <p>{step.copy}</p>
  </li>)}</ol>
 </div>;
}

// The order as a shipping tag: the hero object for Ship Anywhere.
export function KohlerHeroTag() {
 return <div className="kxTagScene">
  <div className="kxTagWrap"><div className="kxTag" aria-label="Kohler export order SO-28471, K-14402 to Bengaluru, India, packet ready for review">
   <svg className="kxTagString" viewBox="0 0 120 60" aria-hidden="true"><path d="M2 8C40 2 70 50 118 30"/></svg>
   <span className="kxTagHole" aria-hidden="true"/>
   <img className="kxTagLogo" src={asset('company-logos/kohler.svg')} alt="Kohler"/>
   <small>Export order</small>
   <strong>SO-28471</strong>
   <div className="kxTagRoute"><span>K-14402</span><i aria-hidden="true"/><span>Bengaluru, IN</span></div>
   <div className="kxTagDocs" aria-hidden="true"><i/><i/><i/><i/></div>
   <div className="kxTagTrail"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>PIM · SAP · reviewed by ops</div>
  </div><Stamp className="kxTagStamp">Ready for review</Stamp></div>
 </div>;
}

// The three product principles, pinned beside the decision they came from.
export function KohlerPrinciples() {
 return <ol className="kxTagNotes">
  <li><b>1</b><strong>Start with the order</strong><span>The SKU and destination give the workflow the context it needs to begin.</span></li>
  <li><b>2</b><strong>Keep the work together</strong><span>Documents, missing information, validation, and review stay attached to the same order.</span></li>
  <li><b>3</b><strong>Keep the source trail</strong><span>Generated material points back to the approved source and the person who reviewed it.</span></li>
 </ol>;
}

export function KohlerExceptions() {
 return <div className="kxExceptions">
  <article>
   <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M12 6h18l8 8v28H12z" strokeDasharray="4 3"/><path d="M20 24l8 8M28 24l-8 8"/></svg>
   <div><strong>Product information is missing</strong><p>Route the issue back to the product-data owner.</p></div>
  </article>
  <article>
   <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M6 10h16v24H6zM26 14h16v24H26z"/><path d="M20 42h8M20 46h8" className="kxNe"/><path d="M26 40l-4 8"/></svg>
   <div><strong>Sources disagree</strong><p>Show the conflicting information and require a person to resolve it.</p></div>
  </article>
  <article>
   <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M6 24h36" className="kxTrack"/><path d="M6 24h20"/><path d="M34 16v16"/><circle cx="26" cy="24" r="3"/></svg>
   <div><strong>Evidence is incomplete</strong><p>Stop the workflow and identify exactly what still needs to be provided.</p></div>
  </article>
 </div>;
}

export function KohlerDelivery() {
 const shipped = [
  ['Market-specific preparation packet', 'Built from approved product and market sources'],
  ['Exception handling and human review', 'Nothing unresolved moves with the order'],
  ['Auditable preparation history', 'Every line keeps its source and reviewer'],
 ];
 return <div className="kxDelivery">
  <div className="kxVoyage">
   <div className="kxVoyageRoute" aria-hidden="true"><b>US</b><i><em/></i><b>IN</b></div>
   <p className="kxBefore"><s>Teams search across systems and rebuild missing market documentation.</s></p>
   <p className="kxAfter">The order shows what is ready, what is missing, and what needs a person to review.</p>
  </div>
  <ul className="kxShipped">{shipped.map(([item, note]) => <li key={item}><i aria-hidden="true">✓</i><div><strong>{item}</strong><span>{note}</span></div></li>)}</ul>
 </div>;
}
