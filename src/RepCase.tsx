import React from 'react';
import LifecycleRoad from './LifecycleRoad';
import { CaseChapter, CasePull, DecisionMoment, Tradeoff } from './CaseDecision';
import { assetUrl } from './main';

const stages = [
  { id: 'rp-discover', name: 'Discover', did: 'No memory for weights' },
  { id: 'rp-define', name: 'Define', did: 'Less tapping, more lifting' },
  { id: 'rep-decisions', name: 'Decide', did: 'One tap per set' }
];

export default function RepCase() {
  return <div className="repStory"><LifecycleRoad stages={stages} vehicle="dumbbell"/>
    <CaseChapter id="rp-discover" className="rpStage" title={<>Apple tracks the workout. <em>It doesn’t know what I lifted.</em></>}
      lead="I lift with Apple’s Traditional Strength Training workout. It records time, heart rate, calories, and my rings. It doesn’t save a single weight, set, or rep, so I was trying to remember what I did on each machine last time or writing it down somewhere else.">
      <ul className="rpTried">
        <li><b>Apple Workout</b><span>Great session tracking. No lift history.</span></li>
        <li><b>Phone gym apps</b><span>Built for the phone. Every set means unlocking it and digging through screens.</span></li>
        <li><b>Their Watch apps</b><span>Forms with small fields and menus, while I’m resting and sweaty.</span></li>
      </ul>
      <p className="rpWant">What I wanted: something that feels like Apple’s Workout app but remembers what I lift.</p>
    </CaseChapter>

    <CaseChapter id="rp-define" className="rpStage csChapter--split" title={<>Less tapping. <em>More lifting.</em></>}
      lead="That became the rule for every screen. Before building anything I wrote down what it had to do and what it would never do, so I wouldn’t end up building another bloated gym app.">
      <div className="rpRules">
        <div><h3>Has to</h3><ul>
          <li>Run every workout as a real Apple Health strength session</li>
          <li>Log a set in one tap when the numbers are already right</li>
          <li>Remember my last weight for every exercise</li>
          <li>Work with my phone left in my bag</li>
          <li>Keep data on my Watch and iPhone. No account, no server</li>
        </ul></div>
        <div><h3>Won’t</h3><ul className="rpCut">
          <li>App Store release</li><li>Accounts or social</li><li>Nutrition</li><li>AI workout plans</li><li>Form checking</li><li>Automatic rep counting</li>
        </ul></div>
      </div>
    </CaseChapter>

    <div className="rpStage csMoment" id="rep-decisions">
      <DecisionMoment
        statement={<>One tap logs a set.<br/>I count the reps.</>}
        sub="The biggest call was what the Watch should do between sets, and what it shouldn’t try to do."
        because={<p>Auto rep counting sounds like the obvious feature. On machines my wrist barely moves, so the count would be wrong a lot. A wrong count is worse than no count because then I’m fixing it mid-workout. Most sets I lift the same weight and reps as last time anyway, so the fastest log is the numbers already filled in and one button.</p>}
        tradeoff={<Tradeoff pairs={[
          ['Auto rep counting that guesses on machines', 'Numbers already filled in, one tap to confirm'],
          ['Typing a weight every set', 'Last weight remembered, Crown to change it']
        ]}/>}
        result={<p>Set Done is manual logging, and a set is never marked done just because time passed. If I change a weight it carries to the rest of that workout but never rewrites old sets. The app never raises a weight on its own.</p>}
      >
        <div className="rpBudget" aria-label="Taps on a Glutes day">
          <p className="rpBudgetHead">A Glutes day</p>
          <ol>
            <li><b>1</b><span>tap to start</span></li>
            <li><b>12</b><span>taps for 12 sets</span></li>
            <li><b>0</b><span>weights typed if nothing changed</span></li>
          </ol>
        </div>
      </DecisionMoment>
    </div>

    <CasePull>Full workouts work with my phone away, <em>and each one saves as exactly one Apple Fitness workout.</em></CasePull>

    <section className="rpOpen rpStage">
      <h2>Built for me. <em>Open to anyone.</em></h2>
      <p>REP is free and open source. My routines ship as starter templates, and the iPhone’s Plan tab lets anyone create, rename, and reorder routines, add exercises, and set their own loads, sets, reps, rest, and colors. A step-by-step guide walks through installing it from Xcode, even for someone who has never done it.</p>
      <a className="rpGithub" href="https://github.com/nchinimilli3/REP" target="_blank" rel="noreferrer">Get REP on GitHub ↗</a>
    </section>

    <section className="rpPhone rpStage">
      <figure><img src={assetUrl('project-media/rep/iphone-workout-history.png')} alt="REP on iPhone: workout history with every set logged"/></figure>
      <div>
        <h2>The phone is for <em>looking back.</em></h2>
        <p>Logging happens on the Watch. The iPhone app shows every workout and every set, so you can see what you lifted last week and track progress without remembering it. The two sync directly, with no cloud in between.</p>
      </div>
    </section>
  </div>;
}
