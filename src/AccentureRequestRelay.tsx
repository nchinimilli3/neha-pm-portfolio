import React from 'react';

export default function AccentureRequestRelay() {
  return (
    <div className="requestWalkthrough">

      <div className="requestScreens">
        <article className="requestStep">
          <header>
            <b>1</b>

            <div>
              <h3>Requests started in Salesforce with the basic session details.</h3>
            </div>
          </header>

          <div className="requestApp salesforceApp">
            <div className="requestAppChrome">
              <span className="salesforceCloud">☁</span>
              <strong>Salesforce</strong>
              <span>Service</span>
            </div>

            <nav>
              Requests <span>›</span> #021
            </nav>

            <div className="requestAppBody">
              <span className="documentEyebrow">
                TRAINING REQUEST
              </span>

              <h4>Enterprise AI basics</h4>

              <dl>
                <div>
                  <dt>Request owner</dt>
                  <dd>Customer team</dd>
                </div>

                <div>
                  <dt>Timing</dt>
                  <dd>Next week</dd>
                </div>

                <div>
                  <dt>Region</dt>
                  <dd className="requestWarning">
                    Not provided
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </article>

        <article className="requestStep">
          <header>
            <b>2</b>

            <div>
              <h3>A coordinator filled the gaps and reviewed which trainers fit.</h3>
            </div>
          </header>

          <div className="requestApp slackApp">
            <div className="requestAppChrome">
              <strong>Slack</strong>
              <span>Enablement workspace</span>
            </div>

            <nav># enablement-ops</nav>

            <div className="requestAppBody">
              <div className="requestMessage">
                <b className="botAvatar">B</b>

                <div>
                  <strong>
                    Request bot <small>APP</small>
                  </strong>

                  <p>New request #021</p>

                  <blockquote>
                    Enterprise AI basics
                    <br />
                    Timing: next week
                    <br />
                    <b>Region: not provided</b>
                  </blockquote>
                </div>
              </div>

              <div className="requestMessage">
                <b className="humanAvatar">C</b>

                <div>
                  <strong>Coordinator</strong>

                  <p>
                    Confirm region and language, then check trainer expertise,
                    availability, capacity, and local working hours.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </article>

        <article className="requestStep">
          <header>
            <b>3</b>

            <div>
              <h3>The match still had to work in the trainer’s local time.</h3>
            </div>
          </header>

          <div className="requestApp calendarApp">
            <div className="requestAppChrome">
              <span className="calendarIcon">31</span>
              <strong>Google Calendar</strong>
            </div>

            <nav>
              Trainer availability <span>Week view</span>
            </nav>

            <div className="calendarExample">
              <div className="calendarDays">
                <span />
                <b>MON<em>14</em></b>
                <b className="isToday">TUE<em>15</em></b>
                <b>WED<em>16</em></b>
              </div>

              <div className="calendarHours">
                <span>9 AM</span>
                <span>10 AM</span>
                <span>11 AM</span>
              </div>

              <div className="calendarGrid">
                <div className="calendarHold">
                  Session hold
                  <br />
                  <small>Check local time</small>
                </div>
              </div>
            </div>

            <div className="calendarReview">
              <b>Scheduling checks</b>

              <span>
                Confirm availability, certifications, convert the session into the trainer's local time,
                and make sure it falls within their working hours and capacity for the week.
              </span>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}