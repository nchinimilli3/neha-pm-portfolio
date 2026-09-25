import {useId, useState} from 'react';
import './education-convergence.css';

const degrees = [
 {id:'cs',title:'Computer Science',award:'Bachelor of Science',college:'College of Engineering',lens:'Computer Science helps me turn an idea into working behavior: understand the technical constraints, test the edge cases, and build something people can use.'},
 {id:'scm',title:'Supply Chain Management',award:'Bachelor of Arts',college:'Broad College of Business',lens:'Supply Chain Management helps me see the whole operation: capacity, incentives, timing, and the handoffs that determine whether a product works at scale.'},
];

export default function EducationConvergence(){
 const id=useId();
 const [open,setOpen]=useState<string|null>(null);
 return <div className="eduConvergence eduDiplomaWall">
  <div className="eduDiplomaPair">
   {degrees.map(degree=><article className={`eduDiplomaStudy eduDiploma-${degree.id}`} key={degree.id}>
    <div className="eduDiplomaHanger" aria-hidden="true"><svg viewBox="0 0 100 74" preserveAspectRatio="none"><path d="M0 74 50 0 100 74" vectorEffect="non-scaling-stroke"/></svg><span/></div>
    <button className="eduDiplomaControl" type="button" aria-expanded={open===degree.id} aria-controls={`${id}-${degree.id}`} onClick={()=>setOpen(open===degree.id?null:degree.id)}>
     <span className="eduDiplomaFrame">
     <span className="eduDiplomaMat">
      <span className="eduDiplomaPaper">
       <span className="eduDiplomaUniversity">Michigan State University</span>
       <span className="eduDiplomaCollege">{degree.college}</span>
       <span className="eduDiplomaRule" aria-hidden="true"><i/></span>
       <span className="eduDiplomaStatus">Degree in progress</span>
       <span className="eduDiplomaName">Neha Chinimilli</span>
       <span className="eduDiplomaAward">{degree.award}</span>
       <strong className="eduDiplomaMajor">{degree.title}</strong>
       <span className="eduDiplomaDate">Expected May 2027</span>
       <span className="eduDiplomaFooter" aria-hidden="true"><i/><span className="eduDiplomaSeal"><span>NC</span></span><i/></span>
      </span>
     </span>
     </span>
     <span className="eduDiplomaLabel"><span>{degree.award==='Bachelor of Science'?'01 / Engineering':'02 / Business'}</span><span>{open===degree.id?'Close':'How I use this'} <span aria-hidden="true">{open===degree.id?'−':'+'}</span></span></span>
    </button>
    <p className="eduDiplomaLens" id={`${id}-${degree.id}`} hidden={open!==degree.id}>{degree.lens}</p>
   </article>)}
  </div>
 </div>
}
