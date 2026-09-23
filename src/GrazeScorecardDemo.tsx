import {useState} from 'react';
import './graze-scorecard-demo.css';

type ScoreRow = {category:string; specification:string; criticality:number; score:number; rubric:[string,string,string,string,string]};
const originalRows:ScoreRow[] = [
  {category:'Strategic Partnerships',specification:'Complimentary Businesses',criticality:2,score:5,rubric:['0 complimentary businesses','1–2 complimentary businesses','3–4 complimentary businesses','5–6 complimentary businesses','7+ complimentary businesses']},
  {category:'Strategic Partnerships',specification:'Educational Institutions',criticality:3,score:4,rubric:['0 educational institutions','1 educational institution','2 educational institutions','3 educational institutions','4+ educational institutions']},
  {category:'Strategic Partnerships',specification:'Event Spaces',criticality:4,score:2,rubric:['0 event spaces available','1–2 event spaces available','3–4 event spaces available','5–6 event spaces available','7+ event spaces available']},
  {category:'Facility Specifications',specification:'Triple Sink & Grease Traps',criticality:2,score:4,rubric:['Neither triple sinks nor grease traps are present','One or two sinks; grease trap installation needed','All sinks installed; grease traps needed','Triple sinks and grease traps meet requirements','Triple sinks and grease traps exceed requirements']},
  {category:'Facility Specifications',specification:'# of Suppliers',criticality:3,score:2,rubric:['Fewer than 3 viable suppliers within 5 miles','4–6 viable suppliers within 5 miles','7–9 viable suppliers within 5 miles','10 viable suppliers within 5 miles','10+ viable suppliers within 5 miles']},
  {category:'Facility Specifications',specification:'Square Footage',criticality:5,score:5,rubric:['< 750 sq ft','751–850 sq ft','851–950 sq ft','951–1,050 sq ft','≥ 1,050 sq ft']},
  {category:'Facility Specifications',specification:'Monthly Rent',criticality:5,score:1,rubric:['> $5,000','$4,501–4,999','$4,001–4,500','$3,501–4,000','≤ $3,500']},
  {category:'Customer Demographics',specification:'Average Income',criticality:2,score:2,rubric:['< $29,999','$30,000–39,999','$50,000–69,999','$70,000–89,999','≥ $90,000']},
  {category:'Competition Intensity',specification:'Charcuterie Catering Threats',criticality:3,score:4,rubric:['4+ established charcuterie caterers within 5 miles','3 established charcuterie caterers within 5 miles','1–2 established charcuterie caterers within 5 miles','1 nearby business, not established or direct','No charcuterie caterers within 5 miles']},
  {category:'Competition Intensity',specification:'General Catering Threats',criticality:1,score:2,rubric:['5+ bite-size refreshment caterers within 5 miles','3–4 bite-size refreshment caterers within 5 miles','2 bite-size refreshment caterers within 5 miles','1 bite-size refreshment caterer within 5 miles','No bite-size refreshment caterers within 5 miles']},
];
const categoryCounts:Record<string,number> = {'Strategic Partnerships':3,'Facility Specifications':4,'Customer Demographics':1,'Competition Intensity':2};
const tint=(value:number)=>value<=2?'low':value===3?'mid':'high';

export function GrazeScorecardDemo(){
  const [rows,setRows]=useState(originalRows);
  const [city,setCity]=useState('Sample location');
  const [baseline,setBaseline]=useState<[boolean,boolean]>([true,true]);
  const [active,setActive]=useState<number|null>(null);
  const total=rows.reduce((sum,row)=>sum+row.criticality*row.score,0);
  const update=(index:number,key:'criticality'|'score',value:number)=>setRows(current=>current.map((row,i)=>i===index?{...row,[key]:value}:row));
  return <div className="grazeSheetDemo">
    <div className="grazeSheetTop"><div className="grazeSheetCity"><label htmlFor="grazeCity">City Name:</label><input id="grazeCity" value={city} maxLength={42} onChange={e=>setCity(e.target.value)} aria-label="City name"/></div><button type="button" className="grazeSheetReset" onClick={()=>{setRows(originalRows);setBaseline([true,true]);setCity('Sample location');setActive(null)}}>Reset example ↺</button></div>
    <p className="grazeSheetHint">Change a score or criticality. Select a specification to see its scoring rubric.</p>
    <div className="grazeSheetScroll" role="region" aria-label="Interactive location scorecard" tabIndex={0}>
      <table className="grazeSheetTable"><colgroup><col className="category"/><col className="specification"/><col className="number"/><col className="number"/><col className="spacer"/><col className="total"/><col className="final"/></colgroup><thead><tr><th>Category</th><th>Specification</th><th>Criticality</th><th>Score</th><th className="grazeSheetSpacer" aria-hidden="true"/><th className="grazeSheetTotalHead">Totals</th><th className="grazeSheetFinalHead">SCORE</th></tr></thead><tbody>
        <tr className="grazeSheetBaseline"><th rowSpan={2} scope="rowgroup">Baseline Requirements</th><td>5,000 B2B Opportunities (Y/N)</td><td colSpan={2}><button type="button" aria-label="5,000 B2B opportunities" aria-pressed={baseline[0]} onClick={()=>setBaseline(([a,b])=>[!a,b])}>{baseline[0]?'yes':'no'} <span aria-hidden="true">⌄</span></button></td><td className="grazeSheetSpacer"/><td className="grazeSheetGap"/><td className="grazeSheetGap"/></tr>
        <tr className="grazeSheetBaseline"><td>100,000 B2C Opportunities (Y/N)</td><td colSpan={2}><button type="button" aria-label="100,000 B2C opportunities" aria-pressed={baseline[1]} onClick={()=>setBaseline(([a,b])=>[a,!b])}>{baseline[1]?'yes':'no'} <span aria-hidden="true">⌄</span></button></td><td className="grazeSheetSpacer"/><td className="grazeSheetGap"/><td className="grazeSheetGap"/></tr>
        {rows.map((row,i)=><tr key={row.specification}>
          {(i===0||rows[i-1].category!==row.category)&&<th rowSpan={categoryCounts[row.category]} scope="rowgroup">{row.category}</th>}
          <td className="grazeSheetSpec"><button type="button" aria-expanded={active===i} onClick={()=>setActive(active===i?null:i)}>{row.specification}<span aria-hidden="true">{active===i?'−':'+'}</span></button></td>
          {(['criticality','score'] as const).map(key=><td key={key} className={`grazeSheetInput ${tint(row[key])}`}><select aria-label={`${row.specification} ${key}`} value={row[key]} onChange={e=>update(i,key,Number(e.target.value))}>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n}</option>)}</select></td>)}
          <td className="grazeSheetSpacer"/>
          <td className="grazeSheetTotal">{row.criticality*row.score}</td>
          {i===0&&<td className="grazeSheetScoreCell" rowSpan={10}><div className="grazeSheetScoreBox"><b>SCORE</b><strong aria-live="polite">{total}</strong></div></td>}
        </tr>)}
      </tbody></table>
    </div>
    {active!==null&&<div className="grazeSheetRubric" aria-live="polite"><div className="grazeSheetRubricTitle"><b>SCORING RUBRIC</b><strong>{rows[active].specification}</strong></div><div className="grazeSheetRubricScale">{rows[active].rubric.map((description,index)=><div key={index} className={rows[active].score===index+1?'selected':''}><b>{index+1}</b><span>{description}</span></div>)}</div></div>}
  </div>;
}
