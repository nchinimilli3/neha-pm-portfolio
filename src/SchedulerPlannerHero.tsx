import React from 'react';
import './scheduler-v2.css';

/* Object north star: Papier Weekly Happenings planner — https://www.papier.com/us/weekly-happenings-454 */
/* UI north star: Google Calendar official week view — https://storage.googleapis.com/support-kms-prod/qcBMpABlDvO6QwWeDsPZBBbiZe5ZSwEuYKaI */
export default function SchedulerPlannerHero(){
  return <div className="schPlannerHero" role="img" aria-label="A tactile weekly desk planner that turns tentative availability into a confirmed calendar event">
    <div className="schPlannerCover"><span>WEEKLY</span><b>HAPPENINGS</b></div>
    <div className="schPlannerPad"><header><div><span>SEPTEMBER</span><strong>15 — 19</strong></div><em>Group project week</em></header><div className="schPlannerGrid"><span/><b>MON</b><b>TUE</b><b>WED</b><b>THU</b><b>FRI</b><span>10</span><i>A</i><i className="maybe">?</i><i>×</i><i>A</i><i/><span>10:30</span><i className="maybe">?</i><i className="selected">A</i><i>A</i><i className="maybe">?</i><i/><span>11</span><i/><i>A</i><i className="maybe">?</i><i>×</i><i>A</i></div><footer><span><i>A</i> Available</span><span><i>?</i> Maybe</span><span><i>×</i> Unavailable</span></footer></div>
    <article className="schEventTicket"><span>RECOMMENDED</span><time><b>16</b>SEP</time><div><strong>Design Sync</strong><p>Tuesday · 10:30–11:00</p><small>Minskoff Pavilion · 3 people</small></div><b>✓</b></article><div className="schPencil" aria-hidden="true"/><small className="schHeroCaption">From uncertain plans to one calendar-ready event.</small>
  </div>
}
