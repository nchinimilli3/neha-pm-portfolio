/* Drawn artwork for the Commute case, in the same register as the AC Transit
   coach and the BART car: real colours, real proportions, flat shading with
   gradients rather than outline icons. Everything lives in one sprite so a
   gradient id exists exactly once on the page no matter how many markers
   render, and each landmark is used through <use href="#cmart-…">.

   The subjects are the actual ones on the route: an Oakland bungalow, an AC
   Transit shelter, a BART entrance pylon, the west span of the Bay Bridge, the
   Transbay Tube, and Salesforce Tower, because the strip is a map of one
   specific commute, not a generic trip. */

const LAND = '0 0 96 67';   // landmarks: the scene, cropped to its ground line
const MEDIA = import.meta.env.BASE_URL + 'project-media/';
const OBJ = '0 0 64 56';    // routine objects: one thing, centred

export const CommuteArtDefs = () => <svg aria-hidden="true" focusable="false"
  style={{position:'absolute',width:0,height:0,overflow:'hidden'}}>
 <defs>
  <linearGradient id="cmWall" x1="0" y1="0" x2="0" y2="1">
   <stop offset="0" stopColor="#f4ecdf"/><stop offset="1" stopColor="#dccdb6"/>
  </linearGradient>
  <linearGradient id="cmRoof" x1="0" y1="0" x2="0" y2="1">
   <stop offset="0" stopColor="#5c5a66"/><stop offset="1" stopColor="#3b3944"/>
  </linearGradient>
  <linearGradient id="cmGlass" x1="0" y1="0" x2="1" y2="1">
   <stop offset="0" stopColor="#cfe0e7"/><stop offset=".55" stopColor="#9db9c5"/><stop offset="1" stopColor="#7d9dab"/>
  </linearGradient>
  <linearGradient id="cmSteel" x1="0" y1="0" x2="1" y2="0">
   <stop offset="0" stopColor="#b6bdc2"/><stop offset=".5" stopColor="#8e979d"/><stop offset="1" stopColor="#6f787e"/>
  </linearGradient>
  <linearGradient id="cmConcrete" x1="0" y1="0" x2="0" y2="1">
   <stop offset="0" stopColor="#cdc7ba"/><stop offset="1" stopColor="#a49d90"/>
  </linearGradient>
  <linearGradient id="cmWater" x1="0" y1="0" x2="0" y2="1">
   <stop offset="0" stopColor="#5b93a8"/><stop offset=".6" stopColor="#2f6a83"/><stop offset="1" stopColor="#1b4459"/>
  </linearGradient>
  <linearGradient id="cmSilt" x1="0" y1="0" x2="0" y2="1">
   <stop offset="0" stopColor="#6d6858"/><stop offset="1" stopColor="#4d4a3e"/>
  </linearGradient>
  <linearGradient id="cmBlock" x1="0" y1="0" x2="1" y2="0">
   <stop offset="0" stopColor="#a9a89f"/><stop offset="1" stopColor="#7e7d75"/>
  </linearGradient>
  <linearGradient id="cmCar" x1="0" y1="0" x2="0" y2="1">
   <stop offset="0" stopColor="#eef2f4"/><stop offset=".55" stopColor="#ccd4d8"/><stop offset="1" stopColor="#9aa4aa"/>
  </linearGradient>
  <linearGradient id="cmAsphalt" x1="0" y1="0" x2="0" y2="1">
   <stop offset="0" stopColor="#6a6a70"/><stop offset="1" stopColor="#4c4c52"/>
  </linearGradient>
  <linearGradient id="cmEnamel" x1="0" y1="0" x2="0" y2="1">
   <stop offset="0" stopColor="#fdfaf3"/><stop offset="1" stopColor="#e2d9c8"/>
  </linearGradient>
  <linearGradient id="cmWood" x1="0" y1="0" x2="0" y2="1">
   <stop offset="0" stopColor="#8e6244"/><stop offset="1" stopColor="#5f3f2b"/>
  </linearGradient>
  <linearGradient id="cmLinen" x1="0" y1="0" x2="0" y2="1">
   <stop offset="0" stopColor="#ffffff"/><stop offset="1" stopColor="#dfe3e6"/>
  </linearGradient>
  <linearGradient id="cmBrew" x1="0" y1="0" x2="0" y2="1">
   <stop offset="0" stopColor="#6b4326"/><stop offset="1" stopColor="#3e2413"/>
  </linearGradient>
  <linearGradient id="cmBrass" x1="0" y1="0" x2="1" y2="0">
   <stop offset="0" stopColor="#e2c489"/><stop offset=".5" stopColor="#bd9b5c"/><stop offset="1" stopColor="#8f7340"/>
  </linearGradient>
 </defs>

 {/* ── the Oakland end of the trip ─────────────────────────────── */}
 <symbol id="cmart-home" viewBox={LAND}>
  <ellipse cx="48" cy="65" rx="36" ry="3.2" fill="#2b2744" opacity=".12"/>
  <rect x="61" y="17" width="7" height="16" fill="#8a7466"/>
  <rect x="59.5" y="15" width="10" height="3.5" rx="1" fill="#6d5a4d"/>
  <path d="M48 11 89 38H7z" fill="url(#cmRoof)"/>
  <path d="M7 38h82v3.5H7z" fill="#332f3a"/>
  <path d="M48 11 89 38h-5L48 16z" fill="#fff" opacity=".1"/>
  <rect x="43" y="27" width="10" height="8" rx="1" fill="#4a4754"/>
  <path d="M45 27v8M48 27v8M51 27v8" stroke="#6d6a78" strokeWidth=".8"/>
  <rect x="16" y="41.5" width="64" height="22.5" fill="url(#cmWall)"/>
  <path d="M16 47h64M16 53h64M16 59h64" stroke="#c9b89e" strokeWidth=".7" opacity=".8"/>
  <rect x="19" y="47" width="12" height="11" rx="1" fill="url(#cmGlass)"/>
  <rect x="19" y="47" width="12" height="11" rx="1" fill="none" stroke="#fffaf0" strokeWidth="1.6"/>
  <path d="M25 47v11M19 52.5h12" stroke="#fffaf0" strokeWidth="1"/>
  <rect x="65" y="47" width="12" height="11" rx="1" fill="#f2c77a"/>
  <rect x="65" y="47" width="12" height="11" rx="1" fill="none" stroke="#fffaf0" strokeWidth="1.6"/>
  <path d="M71 47v11M65 52.5h12" stroke="#fffaf0" strokeWidth="1"/>
  <rect x="33" y="44.5" width="30" height="3" rx="1" fill="#332f3a"/>
  <rect x="34" y="47.5" width="2.6" height="16.5" fill="#efe7d8"/>
  <rect x="59.4" y="47.5" width="2.6" height="16.5" fill="#efe7d8"/>
  <rect x="42" y="49" width="12" height="15" rx="1" fill="url(#cmWood)"/>
  <rect x="44" y="51" width="8" height="5.5" rx=".6" fill="#a97b55"/>
  <circle cx="51.6" cy="58.5" r="1" fill="#e0c485"/>
  <rect x="38" y="64" width="20" height="2.4" rx="1" fill="#b9b1a2"/>
 </symbol>

 {/* ── the AC Transit stop: shelter and the route blade ─────────── */}
 <symbol id="cmart-stop" viewBox={LAND}>
  <ellipse cx="42" cy="65" rx="32" ry="3" fill="#2b2744" opacity=".12"/>
  <rect x="0" y="63" width="96" height="3" fill="#c7c1b4"/>
  <rect x="6" y="29" width="54" height="4.5" rx="2" fill="url(#cmSteel)"/>
  <rect x="6" y="33.5" width="54" height="1.6" fill="#5e676c"/>
  <rect x="12" y="35" width="42" height="26" fill="url(#cmGlass)" opacity=".8"/>
  <path d="M14 61 26 35h5L19 61zM30 61 42 35h3L33 61z" fill="#fff" opacity=".22"/>
  <rect x="8.5" y="33.5" width="3.5" height="29.5" fill="url(#cmSteel)"/>
  <rect x="54" y="33.5" width="3.5" height="29.5" fill="url(#cmSteel)"/>
  <rect x="32.5" y="35" width="1.6" height="26" fill="#8e979d"/>
  <rect x="15" y="50" width="34" height="3.4" rx="1.2" fill="#9c8a72"/>
  <rect x="17" y="53.4" width="2.4" height="9.6" fill="#788186"/>
  <rect x="44.6" y="53.4" width="2.4" height="9.6" fill="#788186"/>
  <rect x="74" y="19" width="3.4" height="44" fill="url(#cmSteel)"/>
  <rect x="66" y="12" width="24" height="17" rx="2" fill="#0b7a5b"/>
  <rect x="66" y="12" width="24" height="17" rx="2" fill="none" stroke="#f6fbf9" strokeWidth="1.4"/>
  <rect x="69" y="15" width="18" height="3.4" rx="1" fill="#f6fbf9"/>
  <rect x="69" y="20.5" width="12" height="2.6" rx="1" fill="#f6fbf9" opacity=".85"/>
  <rect x="69" y="24.5" width="15" height="2.2" rx="1" fill="#f6fbf9" opacity=".6"/>
 </symbol>

 {/* ── the BART station: shelter, map case, bench and ticket machine ──
     Rendered artwork, cropped to its alpha bounds so the platform slab lands
     on the shared horizon. The drawn stair-and-pylon version read as a dark
     wedge at this size; a shelter you can actually recognise does not. */}
 <symbol id="cmart-station" viewBox="0 0 206 100">
  <image href={`${MEDIA}bart-station-shelter.webp`} x="-3.39" y="-35.58" width="213.06" height="159.71"/>
 </symbol>

 {/* ── the Bay Bridge west span ─────────────────────────────────
     Rendered artwork rather than drawn paths: the west span's two towers and
     the anchorage between them carry more recognition than anything worth
     hand-building at this size. Its own 3:1 viewBox, so <use> letterboxes it
     into the shared 4:3 marker box instead of stretching it. */}
 <symbol id="cmart-bridge" viewBox="0 0 324 100">
  <image href={`${MEDIA}bay-bridge-west-span.webp`} x="-2.64" y="-3.63" width="329.6" height="110.1"/>
 </symbol>

 {/* ── the Transbay Tube: bay above, a train inside ─────────────── */}
 <symbol id="cmart-tunnel" viewBox={LAND}>
  <rect x="0" y="0" width="96" height="33" fill="url(#cmWater)"/>
  <path d="M0 3h96" stroke="#cfe6ee" strokeWidth="1.6" opacity=".6"/>
  <path d="M8 9h14M34 13h18M64 8h20M20 20h22M58 24h24" stroke="#bcd7e0" strokeWidth="1" opacity=".38" strokeLinecap="round"/>
  <rect x="0" y="33" width="96" height="8" fill="url(#cmSilt)"/>
  <path d="M0 33c10 3 18-2 28 1s20 3 30 0 28 2 38-1v3H0z" fill="#7d7663" opacity=".7"/>
  <rect x="0" y="41" width="96" height="25" rx="7" fill="url(#cmConcrete)"/>
  <path d="M0 41h96v2.4H0z" fill="#ded8cb"/>
  <path d="M66 41v25M80 41v25" stroke="#8e8778" strokeWidth="1.2"/>
  <rect x="6" y="45" width="54" height="17" rx="4" fill="#191e22"/>
  <rect x="9" y="47.5" width="48" height="12" rx="4" fill="url(#cmCar)"/>
  <path d="M9 51.5c0-2.2 1.8-4 4-4h44v4z" fill="#0b5ea8"/>
  <rect x="9" y="55.5" width="48" height="1.6" fill="#0b5ea8" opacity=".7"/>
  <rect x="15" y="49.4" width="7" height="4" rx="1" fill="#cfe3f0"/>
  <rect x="25" y="49.4" width="7" height="4" rx="1" fill="#cfe3f0"/>
  <rect x="35" y="49.4" width="7" height="4" rx="1" fill="#cfe3f0"/>
  <rect x="45" y="49.4" width="7" height="4" rx="1" fill="#cfe3f0"/>
  <circle cx="11.6" cy="57.4" r="1.4" fill="#ffe9ad"/>
 </symbol>

 {/* ── the residential blocks before any transit ───────────────── */}
 <symbol id="cmart-sidewalk" viewBox={LAND}>
  <rect x="0" y="52" width="96" height="15" fill="url(#cmConcrete)"/>
  <path d="M0 52h96v1.8H0z" fill="#e4dfd3"/>
  <path d="M0 61h96" stroke="#b5aea1" strokeWidth="1"/>
  <path d="M34 52v9M70 52v9" stroke="#b5aea1" strokeWidth="1"/>
  <path d="M6 30 20 20l14 10v22H6z" fill="#cfc6b4" opacity=".55"/>
  <path d="M6 30 20 20l14 10z" fill="#9a9385" opacity=".6"/>
  {[3, 10, 17, 24, 31, 38, 45].map(x => <path key={x} d={`M${x} 52V40l1.7-2.4L${x + 3.4} 40v12z`} fill="#f2ead9"/>)}
  <path d="M2 42.5h48M2 48h48" stroke="#ded2ba" strokeWidth="2.2"/>
  <rect x="65" y="38" width="3.6" height="14" fill="#6b4a33"/>
  <path d="M66.8 40c-7.4 0-11.4-4.4-11.4-9.6S60 21 66.8 21s11.4 4.6 11.4 9.4S74.2 40 66.8 40z" fill="#5f9270"/>
  <path d="M66.8 21c6.8 0 11.4 4.6 11.4 9.4 0 3.2-1.8 5.9-4.6 7.6-.4-7.2-2.8-13-6.8-17z" fill="#4a7a5b"/>
  <rect x="85" y="42" width="3" height="10" fill="#6b4a33"/>
  <path d="M86.5 44c-5.6 0-8.6-3.4-8.6-7.2s3-7 8.6-7 8.6 3.4 8.6 7-3 7.2-8.6 7.2z" fill="#6a9c78"/>
 </symbol>

 {/* ── downtown, the last three blocks on foot ──────────────────── */}
 <symbol id="cmart-street" viewBox={LAND}>
  <rect x="0" y="50" width="96" height="16" fill="url(#cmAsphalt)"/>
  <rect x="0" y="44" width="96" height="6" fill="url(#cmConcrete)"/>
  <path d="M0 44h96v1.4H0z" fill="#e0dacd"/>
  <path d="M6 52h8v13H6zM22 52h8v13h-8zM38 52h8v13h-8zM54 52h8v13h-8zM70 52h8v13h-8zM86 52h8v13h-8z" fill="#f0eee6" opacity=".82"/>
  <rect x="2" y="8" width="26" height="36" fill="url(#cmBlock)"/>
  <rect x="2" y="8" width="26" height="3" fill="#6f6e67"/>
  {[13, 20, 27, 34].map(y => [5, 12, 19].map(x =>
   <rect key={`${x}-${y}`} x={x} y={y} width="5" height="4.6" rx=".6" fill="#cfe0e7" opacity={y === 20 ? .95 : .62}/>))}
  <rect x="2" y="38" width="26" height="6" fill="#55544e"/>
  <rect x="66" y="16" width="26" height="28" fill="url(#cmBlock)" opacity=".85"/>
  {[20, 27, 34].map(y => [69, 76, 83].map(x =>
   <rect key={`${x}-${y}`} x={x} y={y} width="5" height="4.6" rx=".6" fill="#cfe0e7" opacity=".5"/>))}
  <rect x="45" y="16" width="3" height="28" fill="url(#cmSteel)"/>
  <path d="M46.5 16h9a4 4 0 0 1 4 4" fill="none" stroke="url(#cmSteel)" strokeWidth="3" strokeLinecap="round"/>
  <path d="M56 20h7l-2.6 5h-7z" fill="#dfe6e9"/>
  <rect x="34" y="34" width="2.8" height="10" fill="#6b4a33"/>
  <path d="M35.4 36c-6 0-9-3.4-9-7.6S29.6 20 35.4 20s9 4.2 9 8.4-3 7.6-9 7.6z" fill="#5f9270"/>
  <path d="M35.4 20c5.8 0 9 4.2 9 8.4 0 2.6-1.2 4.8-3.2 6.2-.6-6-2.6-11-5.8-14.6z" fill="#4c7a5c"/>
 </symbol>

 {/* ── Salesforce Tower, the arrival ────────────────────────────── */}
 <symbol id="cmart-tower" viewBox="0 0 21 100">
  <image href={`${MEDIA}salesforce-tower.webp`} x="-24.13" y="-1.27" width="69.4" height="102.7"/>
 </symbol>

 {/* ── routine objects: the part of the morning no feed can see ─── */}
 <symbol id="cmart-alarm" viewBox={OBJ}>
  <ellipse cx="32" cy="50" rx="19" ry="2.6" fill="#2b2744" opacity=".13"/>
  <path d="M13 13 6 6.5a5 5 0 0 1 7-7L19.5 6zM51 13l7-6.5a5 5 0 0 0-7-7L44.5 6z" fill="url(#cmBrass)"/>
  <path d="M22 44 18 50h6l3-5zM42 44l4 6h-6l-3-5z" fill="#8f7340"/>
  <circle cx="32" cy="27" r="20" fill="url(#cmBrass)"/>
  <circle cx="32" cy="27" r="16.5" fill="url(#cmEnamel)"/>
  <circle cx="32" cy="27" r="16.5" fill="none" stroke="#a98c52" strokeWidth="1.2"/>
  <path d="M32 13v2.6M46 27h-2.6M32 41v-2.6M18 27h2.6" stroke="#6b6250" strokeWidth="1.4" strokeLinecap="round"/>
  <path d="M32 27V17.5" stroke="#3c3a45" strokeWidth="2" strokeLinecap="round"/>
  <path d="M32 27l7.5 5" stroke="#3c3a45" strokeWidth="2" strokeLinecap="round"/>
  <path d="M32 27l-4 9" stroke="#c0472f" strokeWidth="1.3" strokeLinecap="round"/>
  <circle cx="32" cy="27" r="1.8" fill="#3c3a45"/>
  <path d="M21 16a16.5 16.5 0 0 1 9-4.2" stroke="#fff" strokeWidth="2" opacity=".65" fill="none" strokeLinecap="round"/>
 </symbol>

 <symbol id="cmart-bed" viewBox={OBJ}>
  <ellipse cx="32" cy="48" rx="26" ry="2.4" fill="#2b2744" opacity=".12"/>
  <rect x="4" y="12" width="7" height="34" rx="2" fill="url(#cmWood)"/>
  <rect x="5.6" y="14" width="3.8" height="20" rx="1.6" fill="#a97b55" opacity=".6"/>
  <rect x="55" y="26" width="5.5" height="20" rx="2" fill="url(#cmWood)"/>
  <rect x="9" y="30" width="48" height="9" rx="3" fill="url(#cmLinen)"/>
  <rect x="9" y="26.5" width="48" height="5" rx="2.4" fill="#eef1f3"/>
  <path d="M26 26.5h31v5H26z" fill="#c9d6de"/>
  <path d="M26 29.5c2.5 1.6 5 2 8 2h23v-5H26z" fill="#b4c6d1"/>
  <rect x="13" y="20" width="18" height="9" rx="4" fill="#fbfcfd"/>
  <rect x="13" y="20" width="18" height="9" rx="4" fill="none" stroke="#d5dde2" strokeWidth="1"/>
  <rect x="9" y="38" width="48" height="3" rx="1.4" fill="#b9c2c8"/>
 </symbol>

 <symbol id="cmart-shower" viewBox={OBJ}>
  <rect x="8" y="4" width="48" height="48" rx="3" fill="#dfe8ea"/>
  <path d="M8 4h48v48H8z" fill="none"/>
  <path d="M20 4v48M32 4v48M44 4v48M8 18h48M8 32h48M8 46h48" stroke="#c6d4d7" strokeWidth=".9"/>
  <rect x="34" y="4" width="22" height="48" rx="3" fill="#cfe0e7" opacity=".55"/>
  <path d="M38 6 34 52h4L42 6z" fill="#fff" opacity=".4"/>
  <rect x="30" y="6" width="3" height="9" rx="1.4" fill="url(#cmSteel)"/>
  <path d="M19 17c0-6.2 5.5-9 12.5-9S44 10.8 44 17z" fill="url(#cmSteel)"/>
  <rect x="19" y="16.4" width="25" height="2.6" rx="1.3" fill="#6f787e"/>
  <path d="M22 21v9M27 22v11M32 21v13M37 22v11M42 21v9" stroke="#8fc4d8" strokeWidth="1.6" strokeLinecap="round" opacity=".85"/>
  <path d="M24 34v5M30 37v6M36 34v5" stroke="#8fc4d8" strokeWidth="1.4" strokeLinecap="round" opacity=".55"/>
 </symbol>

 <symbol id="cmart-coffee" viewBox={OBJ}>
  <path d="M18 8c0-3 3.5-3.4 3.5-7M28 8c0-3 3.5-3.4 3.5-7M38 8c0-3 3.5-3.4 3.5-7" stroke="#b9c4c8" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity=".75"/>
  <ellipse cx="30" cy="48" rx="21" ry="3" fill="#2b2744" opacity=".13"/>
  <ellipse cx="30" cy="46" rx="21" ry="4" fill="#e6e1d6"/>
  <ellipse cx="30" cy="45" rx="21" ry="4" fill="#f4efe4"/>
  <path d="M44 20h4a8.5 8.5 0 0 1 0 17h-4v-4h4a4.5 4.5 0 0 0 0-9h-4z" fill="#eae4d7"/>
  <path d="M12 15h34v20a14 14 0 0 1-14 8h-6a14 14 0 0 1-14-8z" fill="url(#cmEnamel)"/>
  <path d="M34 15h12v20a14 14 0 0 1-12 8z" fill="#ddd4c2" opacity=".55"/>
  <ellipse cx="29" cy="15" rx="17" ry="4.6" fill="#f7f3ea"/>
  <ellipse cx="29" cy="15" rx="13.6" ry="3.4" fill="url(#cmBrew)"/>
  <ellipse cx="24" cy="14.2" rx="4" ry="1.2" fill="#8a5c36" opacity=".6"/>
 </symbol>

 <symbol id="cmart-keys" viewBox={OBJ}>
  <ellipse cx="32" cy="50" rx="22" ry="2.4" fill="#2b2744" opacity=".12"/>
  <circle cx="17" cy="24" r="9.5" fill="none" stroke="url(#cmBrass)" strokeWidth="3.4"/>
  <path d="M25 19.5 47 15l1.6 4.5-3.6.8.8 4-3.4.8.6 3.4-18.6 4z" fill="url(#cmBrass)"/>
  <path d="M25 19.5 47 15l1.6 4.5-3.6.8z" fill="#efd9a8" opacity=".65"/>
  <path d="M23 30 43 36l-1.4 4.4-3.4-1 -1.4 3.8-3.2-1-1 3.2L22 41.6z" fill="#b9c2c8"/>
  <path d="M23 30 43 36l-1.4 4.4-3.4-1z" fill="#dee5e9" opacity=".7"/>
  <circle cx="17" cy="24" r="4.4" fill="none" stroke="#8f7340" strokeWidth="1"/>
 </symbol>

 <symbol id="cmart-door" viewBox={OBJ}>
  <rect x="9" y="3" width="46" height="50" rx="2" fill="url(#cmConcrete)"/>
  <rect x="13" y="6" width="38" height="47" rx="1.5" fill="url(#cmWood)"/>
  <rect x="13" y="6" width="38" height="47" rx="1.5" fill="none" stroke="#4a3020" strokeWidth="1.2"/>
  <rect x="18" y="10" width="28" height="13" rx="1" fill="#cfe0e7"/>
  <rect x="18" y="10" width="28" height="13" rx="1" fill="none" stroke="#4a3020" strokeWidth="1.4"/>
  <path d="M32 10v13M18 16.5h28" stroke="#4a3020" strokeWidth="1.1"/>
  <rect x="18" y="28" width="28" height="9" rx="1" fill="#a97b55" opacity=".55"/>
  <rect x="18" y="41" width="28" height="8" rx="1" fill="#a97b55" opacity=".45"/>
  <circle cx="45" cy="32.5" r="2.4" fill="url(#cmBrass)"/>
  <rect x="9" y="52" width="46" height="3" rx="1" fill="#b3aca0"/>
 </symbol>
</svg>;

/* A landmark on the journey strip. Each subject keeps its real proportions,
   the bridge is long and low, the tower is tall and narrow, so the marker svg
   takes the matching viewBox and the CSS bottom-aligns them all to one ground
   line. The label is the accessible name; the picture is what a reader uses. */
const BOX: Record<string, string> = {bridge: '0 0 324 100', tower: '0 0 21 100', station: '0 0 206 100'};

export const Landmark = ({name, label, className = 'mlabGlyph'}:
 {name: string; label: string; className?: string}) =>
 <svg className={`${className} is-${name}`} viewBox={BOX[name] ?? LAND}
  preserveAspectRatio="xMidYMax meet" role="img" aria-label={label}>
  <use href={`#cmart-${name}`}/>
 </svg>;
