import React from 'react';

// Original vector study drawn against Ford's official blue Mach-E side profile.
// Reference: https://ford.bg/cars/mustang-mach-e
// Coordinates follow the reference photograph; the group maps them into 800 × 410.
export default function MachEArtwork({ className = '' }: { className?: string }) {
 const wheel = (x: number, name: string) => <g>
  <circle cx={x} cy="664" r="102" fill="#11161d" stroke="#202832" strokeWidth="3"/>
  <circle cx={x} cy="664" r="88" fill="#1b222b" stroke="#454d57" strokeWidth="2"/>
  <circle cx={x} cy="664" r="72" fill="#101923" stroke="#77818b" strokeWidth="4"/>
  <path d={`M${x+36} 620Q${x+53} 627 ${x+51} 664L${x+44} 687L${x+30} 685L${x+32} 639Z`} fill="#a52c39"/>
  <g className={`meWheel ${name}`} style={{ transformOrigin: `${x}px 664px` }}>{Array.from({length:10},(_,i)=><g key={i} transform={`rotate(${i*36} ${x} 664)`}><path d={`M${x-7} 649L${x-20} 598L${x-9} 594L${x+4} 648Z`} fill="url(#maAlloy)" stroke="#202a36" strokeWidth="2"/><path d={`M${x+5} 646L${x+24} 599L${x+33} 605L${x+16} 652Z`} fill="#687887" stroke="#222d36" strokeWidth="2"/></g>)}</g>
  <circle cx={x} cy="664" r="19" fill="#29333d" stroke="#94a1ad" strokeWidth="2"/>
  {[0,72,144,216,288].map(a=><circle key={a} cx={x+Math.cos(a*Math.PI/180)*27} cy={664+Math.sin(a*Math.PI/180)*27} r="4" fill="#d5dce2"/>)}
  <circle cx={x} cy="664" r="8" fill="#bcc7ce"/>
  <path d={`M${x-88} 625Q${x} 538 ${x+88} 625`} stroke="#96a2af" strokeOpacity=".16" strokeWidth="2" fill="none"/>
 </g>;
 return <svg className={`meIllustration ${className}`} viewBox="0 0 800 410" role="img" aria-label="Original blue Mustang Mach-E side-profile illustration, shaped from Ford's official photo, with curved panoramic roof, rising quarter window, sculpted doors and large alloy wheels.">
 <defs>
  <linearGradient id="maPaint" x1="0" y1="0" x2=".08" y2="1"><stop stopColor="#6ca5c9"/><stop offset=".19" stopColor="#1675b2"/><stop offset=".35" stopColor="#0b5284"/><stop offset=".49" stopColor="#238dcc"/><stop offset=".62" stopColor="#08608f"/><stop offset=".86" stopColor="#0588ca"/><stop offset="1" stopColor="#074675"/></linearGradient>
  <linearGradient id="maGlass" x2=".6" y2="1"><stop stopColor="#68717b"/><stop offset=".24" stopColor="#313d4a"/><stop offset="1" stopColor="#162839"/></linearGradient>
  <linearGradient id="maAlloy" x2=".7" y2="1"><stop stopColor="#a1adb8"/><stop offset=".5" stopColor="#566371"/><stop offset=".65" stopColor="#b7c2cc"/><stop offset="1" stopColor="#434f5b"/></linearGradient>
  <linearGradient id="maBelly" x2="0" y2="1"><stop stopColor="#00517b" stopOpacity=".1"/><stop offset=".34" stopColor="#003c63" stopOpacity=".8"/><stop offset=".7" stopColor="#03416a" stopOpacity=".75"/><stop offset="1" stopColor="#32b8ef" stopOpacity=".4"/></linearGradient>
  <linearGradient id="maShoulder" x2="0" y2="1"><stop stopColor="#4ac4fd" stopOpacity=".7"/><stop offset="1" stopColor="#006299" stopOpacity="0"/></linearGradient>
  <linearGradient id="meTrail"><stop stopColor="#60aaff" stopOpacity="0"/><stop offset="1" stopColor="#72bcff"/></linearGradient>
  <filter id="maShadow" x="-.1" y="-1" width="1.2" height="3"><feGaussianBlur stdDeviation="10"/></filter>
 </defs>
 <g className="meTrails" fill="none" stroke="url(#meTrail)" strokeLinecap="round"><path d="M-140 200H170" strokeWidth="2"/><path d="M-100 235H190" strokeWidth="3"/><path d="M-180 280H150" strokeWidth="1.5"/><path d="M-60 326H210" strokeWidth="2"/></g>
 <g className="meCar"><g transform="translate(-29 -33) scale(.5)">
 <ellipse cx="831" cy="748" rx="619" ry="21" fill="#09213a" opacity=".24" filter="url(#maShadow)"/>
 <path d="M212 469Q210 459 231 451L324 402L355 383L343 370Q383 356 440 351L492 344Q642 328 779 335Q858 337 908 358Q975 389 1083 467Q1284 461 1390 512L1448 539L1454 577L1454 622L1445 638L1454 691L1432 701L1368 706Q1373 550 1245 550Q1124 550 1124 714H548Q547 552 420 552Q294 552 296 704L252 694L211 667L208 635L215 580L208 528L215 491Z" fill="url(#maPaint)" stroke="#22475f" strokeWidth="2"/>
 <path d="M342 368Q413 347 490 345L491 330Q508 323 538 341Q654 330 779 335Q859 337 909 357L902 365Q831 342 734 347Q598 346 456 377L376 400L357 386Z" fill="#203444"/>
 <path d="M344 369Q435 347 489 345Q660 330 779 336Q861 338 908 357" fill="none" stroke="#abc6dc" strokeWidth="4"/>
 <path d="M231 451L345 402L444 374Q592 348 731 349Q849 349 909 374Q988 414 1078 470L1038 471Q958 411 908 393Q824 353 732 359Q567 363 410 416Z" fill="#0c476f"/>
 <path d="M411 416Q531 376 645 363Q744 353 810 363Q883 370 940 404L1048 469L775 465L641 460L497 442L441 432Z" fill="url(#maGlass)" stroke="#142733" strokeWidth="3"/>
 <path d="M414 417L442 432L469 434L507 386Z" fill="#314354" stroke="#121f2a" strokeWidth="3"/>
 <path d="M528 383L499 442M731 358L752 464" stroke="#15232f" strokeWidth="16"/>
 <path d="M553 408Q603 382 689 380Q708 380 710 397L714 450L549 438Z" fill="#8ba0ae" opacity=".14"/>
 <path d="M773 382Q815 365 916 409L960 444L949 458L787 455Z" fill="#bdcfdd" opacity=".28"/>
 <path d="M443 446L442 535M460 440L443 465M745 469L757 524L758 704M1067 468Q1096 523 1076 619L1064 715" fill="none" stroke="#103e59" strokeWidth="2"/>
 <path d="M230 471Q360 455 452 465Q560 477 648 470L1049 480Q1194 475 1328 510" fill="none" stroke="#4caee0" strokeOpacity=".55" strokeWidth="3"/>
 <path d="M229 480Q303 478 414 496L439 528Q334 516 294 569L249 606L218 590Z" fill="url(#maShoulder)"/>
 <path d="M516 548Q536 521 595 522L1080 542L1068 651Q916 639 751 637Q627 622 563 624Q537 612 516 548Z" fill="url(#maBelly)"/>
 <path d="M563 624Q675 596 762 607L1068 651Q902 644 751 642L606 643Z" fill="#35b8ef" opacity=".27"/>
 <path d="M550 670L657 653L803 657L965 664L1126 692L1125 716L551 715Z" fill="#1b2b38"/>
 <path d="M557 674L672 662L965 675L1095 692L1069 703H557Z" fill="#71808b" opacity=".23"/>
 <path d="M212 620L225 628L295 647L295 690L255 688L216 665L209 649Z" fill="#172936"/>
 <path d="M212 623L241 633L242 640L211 631Z" fill="#eb5358"/>
 <path d="M299 648Q305 557 388 537Q480 516 531 602L548 667L548 704H528Q529 573 420 573Q313 573 315 700H295Z" fill="#073b5a"/>
 <path d="M302 642Q318 552 394 542Q478 524 527 608" fill="none" stroke="#42aadd" strokeWidth="9"/>
 <path d="M1125 691Q1118 547 1240 534Q1357 529 1375 663L1370 713H1350Q1364 573 1245 573Q1132 573 1145 715H1125Z" fill="#073b5a"/>
 <path d="M1125 650Q1140 544 1241 541Q1332 537 1364 636" fill="none" stroke="#309fd8" strokeWidth="9"/>
 <path d="M1320 518L1360 520L1445 540L1440 558L1392 551L1365 538Z" fill="#1b354a" stroke="#54798d" strokeWidth="2"/>
 <path d="M1331 523L1361 526L1439 543" fill="none" stroke="#e6f7ff" strokeWidth="4"/>
 <path d="M1374 533L1372 542L1383 547M1397 539L1395 549L1405 553M1420 544L1419 553L1428 557" stroke="#f2fbff" strokeWidth="3" fill="none"/>
 <path d="M1438 623L1454 619L1446 643L1448 685L1422 689L1425 647Z" fill="#102c43"/>
 <path d="M1450 694L1370 705" stroke="#8198a8" strokeWidth="3"/>
 <path d="M215 479L238 482L246 488L238 495L213 502" fill="#0c283b" stroke="#8da1ad" strokeWidth="3"/>
 <path d="M218 493L211 511M228 496L220 515M238 494L230 513" stroke="#d1e1ee" strokeWidth="5"/>
 <path d="M981 431Q1003 425 1029 444L1032 463L1009 475L973 470L967 456Z" fill="#13232e" stroke="#354c60" strokeWidth="2"/>
 <path d="M974 450L1024 457" stroke="#8296a5" strokeWidth="3"/>
 <path d="M1130 482L1161 484L1168 500L1163 519L1130 516Z" fill="none" stroke="#18547b" strokeWidth="1.5"/>
 <circle cx="491" cy="432" r="4" fill="#698093"/><circle cx="758" cy="450" r="4" fill="#698093"/>
 <path d="M306 598L318 596L302 633L292 631Z" fill="#fc7376"/>
 <text x="978" y="650" fill="#81b7d5" fontFamily="sans-serif" fontStyle="italic" fontSize="9" letterSpacing="1">MACH-E</text>
 {wheel(420,'meRear')}{wheel(1245,'meFront')}
 </g></g>
 </svg>;
}
