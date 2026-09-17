import React from 'react';
import './chat-visuals.css';

// The four interaction states, pointed out on a real-looking iPhone thread.
export function ChatAnatomyPhone() {
 return <div className="caPhoneScene">
  <ul className="caNotes caLeft">
   <li style={{'--y': '22%'} as React.CSSProperties}><b>Presence</b><span>Room events, not messages</span></li>
   <li style={{'--y': '76%'} as React.CSSProperties}><b>Typing</b><span>Temporary, times out</span></li>
  </ul>
  <div className="caPhone" role="img" aria-label="An iPhone group thread showing a join event, a message with a heart Tapback, a delivered reply, and a typing indicator">
   <div className="caIsland"/>
   <div className="caHeader"><span className="caAvatars"><i/><i/><i/></span><strong>Project group</strong><small>3 people</small></div>
   <div className="caThread">
    <p className="caSystem">Maya joined the room</p>
    <div className="caMsg caTheirs"><small>Maya</small><span className="caBubble">did everyone push?<em className="caTapback">❤️</em></span></div>
    <div className="caMsg caMine"><span className="caBubble">yep just finished the socket changes</span><small className="caDelivered">Delivered</small></div>
    <div className="caMsg caTheirs"><span className="caBubble caTyping"><i/><i/><i/></span></div>
   </div>
   <div className="caInput"><span>iMessage</span><i>↑</i></div>
  </div>
  <ul className="caNotes caRight">
   <li style={{'--y': '38%'} as React.CSSProperties}><b>Tapback</b><span>Updates the same message</span></li>
   <li style={{'--y': '58%'} as React.CSSProperties}><b>Delivery</b><span>Reaches every client</span></li>
  </ul>
 </div>;
}
