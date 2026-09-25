import './rolling-vehicle.css';

// A real vehicle image that can drive. Each wheel is the same pixels cut out of the source
// image and laid back over itself, so rotating them turns the vehicle's own wheels instead of
// a stand-in disc. At rest the angle is 0 and the overlay sits exactly on the original.

export type Wheel = { cx: number; cy: number; r: number };

export default function RollingVehicle({
 src, w, h, wheels, moving = false, stalled = false, alt, className = '',
}: {
 src: string; w: number; h: number; wheels: Wheel[];
 moving?: boolean; stalled?: boolean; alt: string; className?: string;
}) {
 const pct = (n: number) => `${n}%`;
 const state = `${moving ? ' isMoving' : ''}${stalled ? ' isStalled' : ''}`;
 return (
  <div className={`rvVehicle${state} ${className}`.trim()}>
   <img
    className="rvBody" src={src} width={w} height={h} alt={alt}
    draggable={false} decoding="async" data-no-lightbox
   />
   {wheels.map((k, i) => (
    <span key={i} className="rvWheel" aria-hidden="true" style={{
     left: pct(((k.cx - k.r) / w) * 100),
     top: pct(((k.cy - k.r) / h) * 100),
     width: pct(((2 * k.r) / w) * 100),
     backgroundImage: `url(${src})`,
     backgroundSize: `${(w / (2 * k.r)) * 100}% auto`,
     backgroundPosition: `${((k.cx - k.r) / (w - 2 * k.r)) * 100}% ${((k.cy - k.r) / (h - 2 * k.r)) * 100}%`,
     animationDelay: `${i * -0.05}s`,
    }} />
   ))}
  </div>
 );
}
