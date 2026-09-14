import React, { useState } from 'react';

function InterviewPortrait({ index }: { index: number }) {
  const skin = ['#c7906c', '#b97b58', '#edc4a0', '#885c46'][index];
  const shirt = ['#315c77', '#a67958', '#667b70', '#516780'][index];

  return (
    <svg viewBox="0 0 130 116" aria-hidden="true">
      <path d="M0 103Q65 82 130 103V116H0" fill="#163b5410" />
      <path
        d="M26 116V96Q29 76 65 76Q102 76 105 96V116"
        fill={shirt}
      />
      <path d="M55 68H76V87Q65 95 55 87" fill={skin} />
      <path
        d="M38 43Q32 9 66 9Q100 9 94 47L88 77H42Z"
        fill={index === 2 ? '#8e6449' : '#29353b'}
      />
      <ellipse cx="65" cy="48" rx="24" ry="30" fill={skin} />
      <path
        d={
          index % 2 === 0
            ? 'M39 41Q32 12 61 12Q91 9 91 37Q76 34 67 23Q58 38 39 41'
            : 'M40 32Q42 5 68 11Q97 12 91 39L83 27L49 26Z'
        }
        fill={index === 2 ? '#8e6449' : '#29353b'}
      />
      <path
        d="M54 47H57M74 47H77M62 63Q67 66 72 62"
        fill="none"
        stroke="#3b3533"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {index === 1 && (
        <g fill="none" stroke="#203b4d" strokeWidth="2">
          <rect x="46" y="41" width="17" height="13" rx="4" />
          <rect x="69" y="41" width="17" height="13" rx="4" />
          <path d="M63 45H69" />
        </g>
      )}

      <path
        d="M54 85L65 95L77 85"
        stroke="#fff6"
        fill="none"
      />
    </svg>
  );
}

export function InterviewRoom() {
  return (
    <div className="fvInterviewRoom">
      <header>
        <span>
          <i /> USER INTERVIEWS
        </span>
        <b>04 sessions</b>
      </header>

      <div className="fvPeople">
        {[0, 1, 2, 3].map((i) => (
          <div key={i}>
            <InterviewPortrait index={i} />
            <span>Participant 0{i + 1}</span>

            <div className="fvVoice" aria-hidden="true">
              {[5, 11, 18, 9, 15, 6, 12, 4].map((h, j) => (
                <i key={j} style={{ height: h }} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="fvInterviewPrompt">
        <span>What I compared</span>
        <strong>
          One long assessment or a guided, multi-page version?
        </strong>

        <div aria-hidden="true">
          <i />
          <b>↔</b>
          <i />
          <i />
          <i />
        </div>
      </div>

      <footer>
        I compared both layouts and asked users about the questions,
        navigation, and scoring experience.
      </footer>
    </div>
  );
}

export function SurveyDemo() {
  const [mode, setMode] = useState<'before' | 'after'>('before');
  const [answer, setAnswer] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const options = [
    { label: 'Low demand', score: 20 },
    { label: 'Moderate demand', score: 55 },
    { label: 'High demand', score: 90 },
  ];

  const visible = mode === 'before' || submitted;

  return (
    <section className="fvSurveySection">
      <header>
        <div>
          <span className="fvEyebrow">One change from the interviews</span>

          <h2>
            Why I moved the score
            <br />
            <em>to the end.</em>
          </h2>
        </div>

        <p>
          During the interviews, I noticed a problem with showing the score
          while someone was still answering. Seeing the score change could
          influence the answers that came next. I kept the scoring logic, but
          changed when users could see the result.
        </p>
      </header>

      <div
        className="fvSurveyModes"
        role="group"
        aria-label="Compare the original and revised scoring experience"
      >
        <button
          type="button"
          aria-pressed={mode === 'before'}
          onClick={() => {
            setMode('before');
            setSubmitted(false);
          }}
        >
          Original / Live score
        </button>

        <button
          type="button"
          aria-pressed={mode === 'after'}
          onClick={() => {
            setMode('after');
            setSubmitted(false);
          }}
        >
          Revised / Score after submission
        </button>
      </div>

      <div className="fvSurveyExperiment">
        <div className="fvSurveyForm">
          <div className="fvSurveyTop">
            <span>Customer Value Framework</span>
            <span>Example question</span>
          </div>

          <fieldset>
            <legend>
              What is the perceived demand for this experience?
            </legend>

            <p>
              Choose the answer that best matches the customer evidence.
            </p>

            {options.map((option, i) => (
              <label
                key={option.label}
                className={answer === i ? 'chosen' : ''}
              >
                <input
                  type="radio"
                  name="fv-demand"
                  value={i}
                  checked={answer === i}
                  onChange={() => {
                    setAnswer(i);
                    setSubmitted(false);
                  }}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </fieldset>

          {mode === 'after' && (
            <button
              className="fvSubmit"
              type="button"
              onClick={() => setSubmitted(true)}
            >
              {submitted ? 'Submitted ✓' : 'Submit answer →'}
            </button>
          )}

          <small>
            This demo uses simplified example values, not Ford's scoring
            formula.
          </small>
        </div>

        <aside
          className={`fvScorePanel ${visible ? '' : 'isProtected'}`}
          aria-live="polite"
        >
          <span className="fvEyebrow">
            {mode === 'before'
              ? 'Score shown while answering'
              : submitted
                ? 'Score shown after submission'
                : 'Score hidden while answering'}
          </span>

          {visible ? (
            <>
              <div
                className="fvScoreValue"
                key={options[answer].score}
              >
                <strong>{options[answer].score}</strong>
                <span>/ 100</span>
              </div>

              <div
                className="fvScoreTrack"
                role="meter"
                aria-label="Illustrative score"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={options[answer].score}
              >
                <i
                  style={{
                    width: `${options[answer].score}%`,
                  }}
                />
              </div>

              <h3>
                {mode === 'before'
                  ? 'The score changes with every answer.'
                  : 'The score appears after submission.'}
              </h3>

              <p>
                {mode === 'before'
                  ? 'Try another answer. You can immediately see which option produces a higher score, even though the customer evidence has not changed.'
                  : 'The same scoring logic still runs, but the user makes the choice before seeing the result.'}
              </p>
            </>
          ) : (
            <>
              <div
                className="fvProtectedWindow"
                aria-hidden="true"
              >
                <svg viewBox="0 0 80 90">
                  <path
                    d="M20 40V25a20 20 0 0 1 40 0V40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="5"
                  />

                  <rect
                    x="9"
                    y="37"
                    width="62"
                    height="45"
                    rx="6"
                    fill="currentColor"
                  />

                  <path
                    d="M40 51V67"
                    stroke="#eef2ef"
                    strokeWidth="5"
                  />
                </svg>
              </div>

              <h3>
                The score stays hidden until submission.
              </h3>

              <p>
                The user can answer the question without seeing how each
                option changes the result.
              </p>

              <div className="fvCompletion">
                <i /> Answer ready to submit
              </div>
            </>
          )}
        </aside>
      </div>
    </section>
  );
}