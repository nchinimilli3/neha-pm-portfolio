import React,{useEffect,useRef,useState} from 'react';
import './mobile-demos.css';

type Props={
 shipment:{id:string;name:string;sku:string;destination:string;language:string;items:number;status:string;checks:boolean[]};
 events:{id:string;activity:string;user:string;details:string;next:string}[];
 scanning:boolean;loaded:boolean;onScan:()=>void;onCheck:(index:number)=>void;onComplete:()=>void;onReset:()=>void;
 documentNames:string[];tasks:string[];
};
const steps=['Find','Review','Prepare','Complete','Audit'];

/* A phone-only presentation of the same shipment, checks and audit events.
   No independent mock completion state: the parent owns every mutation. */
export default function KohlerMobileDemo({shipment:s,events,scanning,loaded,onScan,onCheck,onComplete,onReset,documentNames,tasks}:Props){
 const [step,setStep]=useState(0);
 const [reviewed,setReviewed]=useState<boolean[]>([false,false,false]);
 const [documentIndex,setDocumentIndex]=useState<number|null>(null);
 const heading=useRef<HTMLHeadingElement>(null);
 const previousStep=useRef(step);
 useEffect(()=>{if(loaded)setStep(current=>current===0?1:current)},[loaded]);
 useEffect(()=>{if(previousStep.current!==step){heading.current?.focus({preventScroll:true});heading.current?.scrollIntoView({block:'nearest',behavior:'instant'});previousStep.current=step}},[step]);
 const allReviewed=reviewed.every(Boolean),allChecked=s.checks.every(Boolean),completed=s.status==='Completed';
 function restart(){onReset();setStep(0);setReviewed([false,false,false]);setDocumentIndex(null)}
 return <section className="mobileShipmentDemo" aria-label="Ship Anywhere guided preview">
  <header className="mobileShipmentBrand"><strong>KOHLER</strong><span>Ship Anywhere</span></header>
  <p className="mobileDemoIntro">Guided preview · Sample shipment and documents</p>
  <ol className="mobileDemoProgress" aria-label="Shipment progress">{steps.map((label,i)=><li key={label} aria-current={i===step?'step':undefined}><span>{i+1}</span>{label}</li>)}</ol>
  <div className="mobileShipmentBody">
   <h3 ref={heading} tabIndex={-1}>{['Find the right shipment','Review its destination packet','Prepare the shipment','Confirm it is ready','Follow the audit trail'][step]}</h3>
   <div className="mobileShipmentRecord"><span>{s.id} · {s.sku}</span><strong>{s.name}</strong><span>{s.destination} · {s.items} items</span><b>{s.status}</b></div>
   {step===0&&<><p>Scan the sample barcode to retrieve the shipment and its destination documents.</p><div className="mobileBarcode" aria-hidden="true"/><button type="button" className="mobileDemoPrimary" disabled={scanning} onClick={()=>loaded?setStep(1):onScan()}>{scanning?'Scanning…':'Scan sample barcode'}</button><p role="status">{scanning?'Looking up SHP-10493…':''}</p></>}
   {step===1&&<><p>Open each sample document. The shipment, destination and language stay attached to the packet.</p><div className="mobileDocumentList">{documentNames.map((name,i)=><button type="button" key={name} aria-expanded={documentIndex===i} onClick={()=>{setDocumentIndex(documentIndex===i?null:i);setReviewed(old=>old.map((v,n)=>n===i?true:v))}}><span>{name}</span><b>{reviewed[i]?'Viewed ✓':'Open →'}</b></button>)}</div>
    {documentIndex!==null&&<article className="mobileSampleDocument" aria-label="Sample document preview"><span>SAMPLE · A4</span><h4>{documentNames[documentIndex]}</h4><dl><dt>Shipment</dt><dd>{s.id}</dd><dt>Product</dt><dd>{s.name} · {s.sku}</dd><dt>Destination</dt><dd>{s.destination}</dd><dt>Language pack</dt><dd>{s.language}</dd></dl><p>Predefined demo packet. This sample is not an approved export document.</p><button type="button" onClick={()=>setDocumentIndex(null)}>Close document</button></article>}
    <p role="status">{reviewed.filter(Boolean).length} of 3 documents viewed</p><button type="button" className="mobileDemoPrimary" disabled={!allReviewed} onClick={()=>{setDocumentIndex(null);setStep(2)}}>Continue to preparation</button></>}
   {step===2&&<><p>Verify the documents, then the manifest and packing. Earlier checks unlock the next task.</p><div className="mobileTaskList">{tasks.map((task,i)=>{const available=i<3||s.checks.slice(0,i).every(Boolean);return <label key={task} className={!available?'isUnavailable':''}><input type="checkbox" checked={s.checks[i]} disabled={!available||completed} onChange={()=>onCheck(i)}/><span>{task}</span></label>})}</div><p role="status">{s.checks.filter(Boolean).length} of 5 checks complete</p><button type="button" className="mobileDemoPrimary" disabled={!allChecked} onClick={()=>setStep(3)}>Review completion</button></>}
   {step===3&&<><p>{completed?'Shipment completed. Its preparation checks and completion are recorded in the audit trail.':'All five preparation checks are verified. Confirm completion to create its audit record.'}</p><dl className="mobileCompletion"><dt>Documents</dt><dd>3 viewed</dd><dt>Preparation</dt><dd>{s.checks.filter(Boolean).length} / 5 verified</dd><dt>Destination</dt><dd>{s.destination}</dd></dl>{!completed?<button type="button" className="mobileDemoPrimary" disabled={!allChecked} onClick={onComplete}>Complete sample shipment</button>:<button type="button" className="mobileDemoPrimary" onClick={()=>setStep(4)}>View shipment audit</button>}<p role="status">{completed?'Completion saved in this demo.':''}</p></>}
   {step===4&&<><p>These records were created by your actions in the demo.</p><ol className="mobileAuditList">{events.filter(e=>!e.id.startsWith('seed-')).map(e=><li key={e.id}><strong>{e.activity}</strong><span>{e.user} · {e.next}</span><p>{e.details}</p></li>)}</ol><button type="button" className="mobileDemoPrimary" onClick={restart}>Replay shipment</button></>}
  </div>
  <footer className="mobileDemoFooter"><button type="button" disabled={step===0||scanning} onClick={()=>{setDocumentIndex(null);setStep(step-1)}}>← Back</button><button type="button" onClick={restart}>Reset preview</button></footer>
  <p className="mobileDemoFinePrint">Changes last until reset or refresh. Explore the full workspace on a laptop.</p>
 </section>;
}
