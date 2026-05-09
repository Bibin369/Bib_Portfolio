export const lerp = (a,b,t) => a+(b-a)*t;
export const ease = t => t<0.5?2*t*t:-1+(4-2*t)*t;
export const clamp = (v,a,b) => Math.max(a,Math.min(b,v));

export function drawChar(ctx, x, y, s, phase, opts={}) {
  ctx.save(); ctx.translate(x,y); ctx.scale(s,s);
  if(opts.facing==='left') ctx.scale(-1,1);
  const c = opts.color||'rgba(220,225,240,0.95)';
  const walk = opts.walking? Math.sin(phase*6)*0.5 : 0;
  const bob = opts.walking? Math.abs(Math.sin(phase*6*2))*2 : 0;
  ctx.translate(0,-bob);
  // head
  ctx.beginPath(); ctx.arc(0,-42,11,0,Math.PI*2);
  ctx.fillStyle=c; ctx.fill();
  // body
  ctx.beginPath(); ctx.moveTo(-9,-31); ctx.lineTo(9,-31);
  ctx.lineTo(7,-2); ctx.lineTo(-7,-2); ctx.closePath(); ctx.fill();
  // legs
  ctx.lineWidth=5; ctx.lineCap='round'; ctx.strokeStyle=c;
  ctx.beginPath(); ctx.moveTo(-3,-2);
  ctx.lineTo(-3+Math.sin(walk)*14, 22+Math.cos(walk)*2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(3,-2);
  ctx.lineTo(3+Math.sin(-walk)*14, 22+Math.cos(-walk)*2); ctx.stroke();
  // arms
  ctx.lineWidth=4;
  const arm = opts.walking? Math.sin(-phase*6)*0.4 : 0;
  ctx.beginPath(); ctx.moveTo(-9,-28);
  ctx.lineTo(-9+Math.sin(arm)*12,-12); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(9,-28);
  ctx.lineTo(9+Math.sin(-arm)*12,-12); ctx.stroke();
  // glow
  if(opts.glow){
    ctx.shadowColor=opts.glow; ctx.shadowBlur=20;
    ctx.beginPath(); ctx.arc(0,-42,11,0,Math.PI*2); ctx.fill();
    ctx.shadowBlur=0;
  }
  ctx.restore();
}

export function drawStars(ctx, w, h, t, count=80) {
  for(let i=0;i<count;i++){
    const x=(i*137.5+50)%w, y=(i*97.3+30)%h;
    const blink=Math.sin(t*0.001+i)*0.5+0.5;
    ctx.beginPath(); ctx.arc(x,y,blink*1.5+0.3,0,Math.PI*2);
    ctx.fillStyle=`rgba(255,255,255,${blink*0.7+0.1})`; ctx.fill();
  }
}

export function drawGround(ctx, w, h, y, color) {
  const g=ctx.createLinearGradient(0,y,0,h);
  g.addColorStop(0,color); g.addColorStop(1,'rgba(0,0,0,0.8)');
  ctx.fillStyle=g; ctx.fillRect(0,y,w,h-y);
}

export function drawBuilding(ctx, x, y, bw, bh, winColor) {
  ctx.fillStyle='rgba(20,20,40,0.9)';
  ctx.fillRect(x,y-bh,bw,bh);
  ctx.fillStyle=winColor||'rgba(255,220,100,0.6)';
  for(let r=0;r<Math.floor(bh/20);r++)
    for(let c=0;c<Math.floor(bw/16);c++)
      if(Math.random()>0.3) ctx.fillRect(x+6+c*16,y-bh+8+r*20,8,10);
}

export function drawVignette(ctx, w, h) {
  const g=ctx.createRadialGradient(w/2,h/2,w*0.3,w/2,h/2,w*0.8);
  g.addColorStop(0,'transparent'); g.addColorStop(1,'rgba(0,0,0,0.5)');
  ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
}

export function typeText(ctx, text, x, y, progress, style={}) {
  const chars=Math.floor(text.length*clamp(progress,0,1));
  ctx.font=style.font||'bold 36px Inter,sans-serif';
  ctx.fillStyle=style.color||'#fff';
  ctx.textAlign=style.align||'center';
  ctx.fillText(text.slice(0,chars),x,y);
  if(chars<text.length&&progress<1){
    ctx.fillStyle=style.cursor||'#6366f1';
    const m=ctx.measureText(text.slice(0,chars));
    const cx=style.align==='center'?x+m.width/2-ctx.measureText(text).width/2:x+m.width;
    ctx.fillRect(cx+2,y-20,2,24);
  }
}

export function drawLaptop(ctx, x, y, s) {
  ctx.save(); ctx.translate(x,y); ctx.scale(s,s);
  ctx.fillStyle='#2a2a3e';
  ctx.fillRect(-20,-18,40,25);
  ctx.fillStyle='#3b82f6';
  ctx.fillRect(-17,-15,34,19);
  // code lines
  for(let i=0;i<4;i++){
    ctx.fillStyle=`rgba(100,200,255,${0.4+i*0.1})`;
    ctx.fillRect(-14,-12+i*4,10+Math.random()*14,2);
  }
  ctx.fillStyle='#1a1a2e';
  ctx.beginPath(); ctx.moveTo(-25,7); ctx.lineTo(25,7);
  ctx.lineTo(28,12); ctx.lineTo(-28,12); ctx.closePath(); ctx.fill();
  ctx.restore();
}
