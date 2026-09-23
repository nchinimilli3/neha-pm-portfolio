import React, {useEffect, useRef, useState} from 'react';
import './finsimple-demo.css';

/* Previous Estimates, played before and after. The window reproduces the
   shipped FinSimple Vehicle Estimate page (header, Get My Estimate /
   Previous Estimates tabs, the estimates table and its 7-day note). The
   visitor builds an estimate, leaves, and comes back three days later:
   before the feature the estimate is gone; after it, one tab away.
   Vehicles, VINs, and dollar amounts are sample data, and the estimate
   form is simplified. */

type Mode = 'before' | 'after';
type Vehicle = {vin: string; name: string};
const vehicles: Vehicle[] = [
  {vin: 'DEMO-4821', name: '2019 Ford Transit Passenger Van XL'},
  {vin: 'DEMO-5174', name: '2019 Ford Transit Passenger Van XL'}
];
const conditions = ['Excellent', 'Good', 'Fair'] as const;
type Condition = typeof conditions[number];

/* Sample math only: a trade value that falls with mileage and condition, less a sample payoff. */
const estimate = (miles: number, cond: Condition) => {
  const value = 32000 - miles * 0.12 + (cond === 'Excellent' ? 1000 : cond === 'Fair' ? -1500 : 0);
  return Math.max(500, Math.round((value - 18000) / 100) * 100);
};
const money = (n: number) => `$${n.toLocaleString('en-US')}`;

const older = [
  {vin: 'DEMO-5174', name: '2019 Ford Transit Passenger Van XL', equity: 4500, until: '12/13/24', expired: false},
  {vin: 'DEMO-6032', name: '2019 Ford Transit Passenger Van XLT', equity: 4500, until: '01/06/24', expired: true}
];

const PdfIcon = ({off}: {off?: boolean}) => <svg viewBox="0 0 16 18" aria-hidden="true" className={off ? 'isOff' : ''}><path d="M2.5 1.5h7l4 4v11h-11Z" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M9.5 1.5v4h4" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><text x="8" y="13.2" textAnchor="middle" fontSize="4.2" fontWeight="700" fill="currentColor" fontFamily="Arial">PDF</text></svg>;

export default function FinSimpleEstimateDemo() {
  const [mode, setMode] = useState<Mode>('before');
  const [stage, setStage] = useState(0);     // 0 build, 1 estimate shown, 2 came back, 3 found it again
  const [tab, setTab] = useState<'get' | 'prev'>('get');
  const [vin, setVin] = useState(vehicles[0].vin);
  const [miles, setMiles] = useState('');
  const [cond, setCond] = useState<Condition | null>(null);
  const [result, setResult] = useState<number | null>(null);
  const [saved, setSaved] = useState<{vin: string; name: string; equity: number} | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const after = mode === 'after';
  const today = stage >= 2 ? 'Wed, Dec 11' : 'Sun, Dec 8';
  const milesNum = Number(miles.replace(/[^0-9]/g, ''));
  const ready = milesNum > 0 && cond !== null;
  const vehicle = [...vehicles, ...older].find(v => v.vin === vin)!;

  const reset = (next: Mode) => {
    setMode(next); setStage(0); setTab('get'); setVin(vehicles[0].vin); setMiles(''); setCond(null);
    setResult(null); setSaved(null); setToast(null);
  };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready) return;
    const equity = estimate(milesNum, cond!);
    setResult(equity);
    if (stage === 0) { setSaved({vin, name: vehicle.name, equity}); setStage(1); }
    else if (stage === 2) setStage(3);
  };
  const leave = () => {
    setStage(2); setResult(null);
    if (!after) { setMiles(''); setCond(null); setVin(vehicles[0].vin); }
  };
  const openPrev = () => { setTab('prev'); if (stage === 2) setStage(3); };
  const flash = (msg: string) => {
    setToast(msg);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2400);
  };
  const renew = (v: string) => {
    setVin(v); setMiles(''); setCond(null); setResult(null); setTab('get');
  };

  const rows = saved ? [{...saved, until: '12/15/24', expired: false, isNew: true}, ...older.map(r => ({...r, isNew: false}))] : [];

  /* The narration sits outside the replica, so the window stays a faithful copy of the product. */
  const prompt = (() => {
    if (stage === 0) return <>Build an estimate: pick a condition, enter the mileage, and get your equity.</>;
    if (stage === 1) return <>Most people don’t decide on the spot. <button type="button" className="fsdNext" onClick={leave}>Leave and come back in 3 days →</button></>;
    if (stage === 2) return after
      ? <>Three days later. Your estimate is still valid. Open <b>Previous Estimates</b>.</>
      : <>Three days later. There’s nowhere to find Sunday’s estimate, so the form is blank. Build it again.</>;
    return after
      ? <>Back to Sunday’s estimate in one click, still valid until 12/15/24. <button type="button" className="fsdNext" onClick={() => reset('before')}>Try it without the feature ↻</button></>
      : <>Same van, same mileage, typed in again from scratch. <button type="button" className="fsdNext" onClick={() => reset('after')}>Now try it with Previous Estimates →</button></>;
  })();

  return (
    <div className={`fsdDemo${after ? ' isAfter' : ''}`}>
      <div className="fsdBar">
        <p className="fsdPrompt" aria-live="polite"><span className="fsdDay">{today}</span>{prompt}</p>
        <div className="fsdModes" role="group" aria-label="Which version of FinSimple">
          <button type="button" aria-pressed={!after} onClick={() => reset('before')}>Before</button>
          <button type="button" aria-pressed={after} onClick={() => reset('after')}>With Previous Estimates</button>
        </div>
      </div>

      <div className="fsdWin">
        <div className="fsdChrome" aria-hidden="true"><i/><i/><i/><span>FinSimple Financing</span></div>
        <div className="fsdSite" key={mode}>
          <header className="fsdHeader">
            <div className="fsdBrand"><strong>FinSimple Financing</strong><span>Dashboard</span></div>
            <span className="fsdMenu" aria-hidden="true"><i/><i/><i/><small>Menu</small></span>
          </header>
          <div className="fsdTitle">
            <span className="fsdBack">‹ Dashboard</span>
            <h3>Vehicle Estimate</h3>
            <div className="fsdTabs" role="tablist">
              <button type="button" role="tab" aria-selected={tab === 'get'} onClick={() => setTab('get')}>Get My Estimate</button>
              {after && <button type="button" role="tab" aria-selected={tab === 'prev'} className={stage === 2 && tab !== 'prev' ? 'isCue' : ''} onClick={openPrev}>Previous Estimates</button>}
            </div>
          </div>

          <div className="fsdBody">
            {tab === 'get' ? (
              <form className="fsdCard fsdForm" onSubmit={submit}>
                <h4>Get My Estimate</h4>
                <div className="fsdFields">
                  <label className="fsdField">
                    <span>Vehicle</span>
                    <select value={vin} onChange={e => { setVin(e.target.value); setResult(null); }}>
                      {vehicles.map(v => <option key={v.vin} value={v.vin}>{v.name} · {v.vin}</option>)}
                      {older[1].vin === vin && <option value={older[1].vin}>{older[1].name} · {older[1].vin}</option>}
                    </select>
                  </label>
                  <label className="fsdField">
                    <span>Current mileage</span>
                    <input inputMode="numeric" placeholder="e.g. 42,000" value={miles}
                      onChange={e => { const d = e.target.value.replace(/[^0-9]/g, '').slice(0, 6); setMiles(d ? Number(d).toLocaleString('en-US') : ''); setResult(null); }}/>
                  </label>
                  <div className="fsdField" role="group" aria-labelledby="fsd-cond">
                    <span id="fsd-cond">Condition</span>
                    <div className="fsdPills">
                      {conditions.map(c => <button type="button" key={c} aria-pressed={cond === c} onClick={() => { setCond(c); setResult(null); }}>{c}</button>)}
                    </div>
                  </div>
                </div>
                <div className="fsdActions">
                  <button type="submit" className="fsdPrimary" disabled={!ready}>Get My Estimate</button>
                  {!ready && <small>Enter mileage and condition to continue.</small>}
                </div>
                {result !== null && <div className="fsdResult" role="status">
                  <div><span>Estimated Equity</span><strong>{money(result)}</strong></div>
                  <div><span>Estimate Valid Until</span><b>{stage >= 2 ? '12/18/24' : '12/15/24'}</b></div>
                  <button type="button" className="fsdLink" onClick={() => flash(`Estimate_${vin}.pdf saved`)}><PdfIcon/>Save as PDF</button>
                </div>}
                <p className="fsdNote">Estimates are good for only 7 days after vehicle estimate submitted.</p>
              </form>
            ) : (
              <section className="fsdCard fsdPrev">
                <h4>Previous Estimates</h4>
                <div className="fsdTableWrap">
                  <table className="fsdTable">
                    <thead><tr><th>Vehicles</th><th>VIN</th><th>Estimated Equity</th><th>Estimate Valid Until</th><th>Status</th><th>Save as PDF</th><th>Action</th></tr></thead>
                    <tbody>
                      {rows.map(r => (
                        <tr key={r.vin} className={r.isNew ? 'isNew' : ''}>
                          <td>{r.name}</td>
                          <td><code>{r.vin}</code></td>
                          <td>{money(r.equity)}</td>
                          <td>{r.until}</td>
                          <td>{r.expired ? <span className="fsdExpired">Expired</span> : null}</td>
                          <td>{r.expired ? <span className="fsdPdf"><PdfIcon off/></span> : <button type="button" className="fsdPdf" aria-label={`Save ${r.vin} as PDF`} onClick={() => flash(`Estimate_${r.vin}.pdf saved`)}><PdfIcon/></button>}</td>
                          <td><button type="button" className="fsdLink" onClick={() => renew(r.vin)}>Get New Estimate</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="fsdNote">Estimates are good for only 7 days after vehicle estimate submitted.</p>
              </section>
            )}
          </div>
          {toast && <p className="fsdToast" role="status">{toast}</p>}
        </div>
      </div>
    </div>
  );
}
