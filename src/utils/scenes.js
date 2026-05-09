import { drawChar, drawStars, drawGround, drawBuilding, drawVignette, typeText, drawLaptop, lerp, ease, clamp } from './sceneHelpers';
import { portfolioData as D } from '../data/portfolioData';

const sk = Object.values(D.skills).flat();

export const SCENES = [
  // ─── 1. INTRO ───
  { id:'intro', dur:6000, draw(ctx,w,h,t,p){
    const bg=ctx.createLinearGradient(0,0,0,h);
    bg.addColorStop(0,'#0a0a1a'); bg.addColorStop(1,'#0f0f2e');
    ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);
    drawStars(ctx,w,h,t,100);
    // floating particles
    for(let i=0;i<30;i++){
      const px=(i*173+t*0.02*(i%3+1))%w;
      const py=(i*131+t*0.015*(i%2+1))%h;
      ctx.beginPath(); ctx.arc(px,py,1.5,0,Math.PI*2);
      ctx.fillStyle=`rgba(99,102,241,${0.15+Math.sin(t*0.002+i)*0.1})`; ctx.fill();
    }
    // character appears
    const charScale=ease(clamp(p*3,0,1));
    const cx=w/2, cy=h*0.55;
    drawChar(ctx,cx,cy,charScale*1.2,0,{glow:'#6366f1'});
    drawLaptop(ctx,cx,cy+20,charScale*1.2);
    // name
    if(p>0.3) typeText(ctx,D.hero.name,w/2,h*0.22,clamp((p-0.3)*3,0,1),{font:`bold ${Math.min(w*0.07,56)}px Inter,sans-serif`,color:'#fff'});
    if(p>0.55) typeText(ctx,D.hero.title,w/2,h*0.22+45,clamp((p-0.55)*4,0,1),{font:`${Math.min(w*0.03,22)}px Inter,sans-serif`,color:'#8b5cf6',cursor:'#8b5cf6'});
    drawVignette(ctx,w,h);
  }},

  // ─── 2. EDUCATION ───
  { id:'edu', dur:8000, draw(ctx,w,h,t,p){
    // sky
    const sky=ctx.createLinearGradient(0,0,0,h);
    sky.addColorStop(0,'#0c1445'); sky.addColorStop(0.6,'#1a1a4e'); sky.addColorStop(1,'#0a0a20');
    ctx.fillStyle=sky; ctx.fillRect(0,0,w,h);
    drawStars(ctx,w,h,t,60);
    const groundY=h*0.72;
    drawGround(ctx,w,h,groundY,'#141430');
    // road
    ctx.fillStyle='rgba(40,40,60,0.6)'; ctx.fillRect(0,groundY+10,w,8);
    // scrolling landscape
    const scroll=p*w*2.5;
    const edu=D.education;
    const spacing=w*0.7;
    edu.forEach((e,i)=>{
      const bx=w*0.3+i*spacing-scroll;
      if(bx>-200&&bx<w+200){
        const bw=100+i*20, bh=80+i*30;
        drawBuilding(ctx,bx,groundY,bw,bh,'rgba(255,220,100,0.5)');
        // label
        ctx.font='bold 14px Inter,sans-serif'; ctx.fillStyle='rgba(255,255,255,0.8)'; ctx.textAlign='center';
        ctx.fillText(e.degree.split(' ').slice(0,3).join(' '),bx+bw/2,groundY-bh-12);
        ctx.font='11px Inter,sans-serif'; ctx.fillStyle='rgba(139,92,246,0.9)';
        ctx.fillText(e.institution.split(',')[0],bx+bw/2,groundY-bh+2);
        ctx.font='11px Inter,sans-serif'; ctx.fillStyle='rgba(255,255,255,0.4)';
        ctx.fillText(e.year,bx+bw/2,groundY-bh+16);
      }
    });
    // walking character (grows with progress)
    const charX=w*0.25;
    const charScale=0.7+p*0.6;
    drawChar(ctx,charX,groundY+8,charScale,t*0.003,{walking:true,glow:'#8b5cf6'});
    // title
    ctx.font=`bold ${Math.min(w*0.04,28)}px Inter,sans-serif`; ctx.fillStyle='rgba(255,255,255,0.15)'; ctx.textAlign='left';
    ctx.fillText('EDUCATION JOURNEY',30,40);
    drawVignette(ctx,w,h);
  }},

  // ─── 3. SKILLS ───
  { id:'skills', dur:6000, draw(ctx,w,h,t,p){
    ctx.fillStyle='#080818'; ctx.fillRect(0,0,w,h);
    // matrix rain
    for(let i=0;i<40;i++){
      const x=(i*47)%(w-10)+5;
      const spd=20+i%5*10;
      const y=(t*0.001*spd+i*100)%h;
      ctx.font='12px monospace'; ctx.fillStyle=`rgba(99,102,241,${0.08+Math.sin(i)*0.04})`;
      ctx.fillText(String.fromCharCode(48+i%42),x,y);
    }
    // orbiting skills
    const cx=w/2,cy=h/2;
    const shown=Math.floor(clamp(p*1.5,0,1)*Math.min(sk.length,20));
    for(let i=0;i<shown;i++){
      const angle=(i/20)*Math.PI*2+t*0.0005;
      const r=120+Math.sin(i*1.5)*50;
      const sx=cx+Math.cos(angle)*r*Math.min(w/800,1.2);
      const sy=cy+Math.sin(angle)*r*0.5;
      ctx.font='bold 13px Inter,sans-serif';
      ctx.fillStyle=`rgba(200,210,255,${0.5+Math.sin(t*0.003+i)*0.3})`;
      ctx.textAlign='center';
      ctx.fillText(sk[i],sx,sy);
    }
    // center character
    drawChar(ctx,cx,cy+30,1,0,{glow:'#38bdf8'});
    // circuit lines
    ctx.strokeStyle='rgba(56,189,248,0.08)'; ctx.lineWidth=1;
    for(let i=0;i<8;i++){
      const a=i/8*Math.PI*2+t*0.0003;
      ctx.beginPath(); ctx.moveTo(cx,cy+30);
      ctx.lineTo(cx+Math.cos(a)*200,cy+30+Math.sin(a)*200);
      ctx.stroke();
    }
    ctx.font=`bold ${Math.min(w*0.04,28)}px Inter,sans-serif`; ctx.fillStyle='rgba(255,255,255,0.12)'; ctx.textAlign='left';
    ctx.fillText('TECHNICAL ARSENAL',30,40);
    drawVignette(ctx,w,h);
  }},

  // ─── 4. WORK EXPERIENCE ───
  { id:'work', dur:7000, draw(ctx,w,h,t,p){
    ctx.fillStyle='#0a0a1e'; ctx.fillRect(0,0,w,h);
    // office bg
    const deskY=h*0.6;
    ctx.fillStyle='#12122a'; ctx.fillRect(0,deskY,w,h-deskY);
    // monitors
    const monX=w*0.35, monW=w*0.3, monH=h*0.28;
    ctx.fillStyle='#1a1a3a'; ctx.fillRect(monX,deskY-monH-20,monW,monH);
    ctx.fillStyle='#0f1628'; ctx.fillRect(monX+4,deskY-monH-16,monW-8,monH-8);
    // scrolling code on monitor
    const codeLines=12;
    for(let i=0;i<codeLines;i++){
      const ly=deskY-monH-12+i*14+(t*0.03)%14;
      if(ly>deskY-monH-16&&ly<deskY-24){
        const lw=30+((i*37)%60);
        ctx.fillStyle=i%3===0?'rgba(99,102,241,0.5)':i%3===1?'rgba(56,189,248,0.4)':'rgba(74,222,128,0.4)';
        ctx.fillRect(monX+12,ly,lw,8);
      }
    }
    // desk
    ctx.fillStyle='#1e1e3a'; ctx.fillRect(monX-30,deskY-20,monW+60,12);
    // character typing
    const typing=Math.sin(t*0.01)*2;
    drawChar(ctx,w*0.5,deskY-2,1,0,{glow:'#4ade80'});
    // experience entries
    const exps=D.experience;
    const shown=Math.floor(clamp(p*2,0,1)*exps.length);
    for(let i=0;i<shown;i++){
      const ey=h*0.12+i*55;
      const ep=clamp((p-i*0.15)*4,0,1);
      ctx.globalAlpha=ep;
      ctx.font='bold 15px Inter,sans-serif'; ctx.fillStyle='#fff'; ctx.textAlign='left';
      ctx.fillText(exps[i].role,w*0.05,ey);
      ctx.font='12px Inter,sans-serif'; ctx.fillStyle='#4ade80';
      ctx.fillText(exps[i].company.split(',')[0],w*0.05,ey+18);
      ctx.globalAlpha=1;
    }
    ctx.font=`bold ${Math.min(w*0.04,28)}px Inter,sans-serif`; ctx.fillStyle='rgba(255,255,255,0.12)'; ctx.textAlign='right';
    ctx.fillText('PROFESSIONAL JOURNEY',w-30,40);
    drawVignette(ctx,w,h);
  }},

  // ─── 5. EXTRACURRICULAR ★ ───
  { id:'extra', dur:9000, draw(ctx,w,h,t,p){
    ctx.fillStyle='#0a0a1a'; ctx.fillRect(0,0,w,h);
    const phase=p*3; // 0-1: award, 1-2: sports, 2-3: leadership
    if(phase<1.2){
      // AWARD CEREMONY
      const sp=clamp(phase/1.2,0,1);
      // stage
      const stgY=h*0.7;
      ctx.fillStyle='#1a0a2e'; ctx.fillRect(0,stgY,w,h-stgY);
      ctx.fillStyle='#2a1a3e'; ctx.fillRect(w*0.15,stgY-4,w*0.7,8);
      // spotlight
      const spotG=ctx.createRadialGradient(w/2,0,10,w/2,stgY,w*0.3);
      spotG.addColorStop(0,'rgba(255,215,0,0.15)'); spotG.addColorStop(1,'transparent');
      ctx.fillStyle=spotG; ctx.fillRect(0,0,w,h);
      // character on stage
      drawChar(ctx,w/2,stgY-2,1.3,0,{glow:'#f59e0b'});
      // trophy descending
      const trophyY=lerp(-50,stgY-80,ease(clamp(sp*2-0.5,0,1)));
      ctx.font='40px serif'; ctx.textAlign='center';
      ctx.fillText('🏆',w/2,trophyY);
      // audience particles (applause)
      for(let i=0;i<20;i++){
        const ax=w*0.1+i*(w*0.8/20);
        const ay=h*0.85+Math.sin(t*0.005+i)*5;
        ctx.beginPath(); ctx.arc(ax,ay,4,0,Math.PI*2);
        ctx.fillStyle='rgba(150,150,200,0.3)'; ctx.fill();
      }
      // sparkle particles
      if(sp>0.5){
        for(let i=0;i<15;i++){
          const sx=w/2+(Math.sin(t*0.003+i*1.2))*100;
          const sy=trophyY-20+(Math.cos(t*0.004+i*0.8))*40;
          ctx.beginPath(); ctx.arc(sx,sy,2,0,Math.PI*2);
          ctx.fillStyle=`rgba(255,215,0,${Math.sin(t*0.005+i)*0.4+0.3})`; ctx.fill();
        }
      }
      ctx.font='bold 16px Inter,sans-serif'; ctx.fillStyle='rgba(255,215,0,0.9)'; ctx.textAlign='center';
      if(sp>0.3) ctx.fillText('Marian Golden Band Award',w/2,h*0.15);
      ctx.font='13px Inter,sans-serif'; ctx.fillStyle='rgba(255,255,255,0.5)';
      if(sp>0.5) ctx.fillText('S Grade — Outstanding Academic Achievement',w/2,h*0.15+22);
    }
    if(phase>=1&&phase<2.2){
      // VOLLEYBALL
      const sp=clamp((phase-1)/1.2,0,1);
      const courtY=h*0.72;
      // court
      ctx.fillStyle=sp>0.1?'#1a2a1a':'#0a0a1a';
      ctx.fillRect(0,courtY,w,h-courtY);
      // net
      ctx.strokeStyle='rgba(255,255,255,0.3)'; ctx.lineWidth=2;
      ctx.setLineDash([4,4]);
      ctx.beginPath(); ctx.moveTo(w/2,courtY-80); ctx.lineTo(w/2,courtY); ctx.stroke();
      ctx.setLineDash([]);
      // jumping character
      const jumpH=Math.sin(clamp(sp*3,0,Math.PI))*120;
      const armUp=sp>0.3&&sp<0.7;
      drawChar(ctx,w*0.4,courtY-2-jumpH,1.1,sp*10,{walking:sp<0.3,glow:'#14b8a6'});
      // ball
      if(sp>0.3){
        const bx=lerp(w*0.4,w*0.65,clamp((sp-0.3)*3,0,1));
        const by=courtY-80-Math.sin(clamp((sp-0.3)*3,0,1)*Math.PI)*60;
        ctx.beginPath(); ctx.arc(bx,by,8,0,Math.PI*2);
        ctx.fillStyle='#f0f0f0'; ctx.fill();
        ctx.strokeStyle='rgba(0,0,0,0.3)'; ctx.lineWidth=1; ctx.stroke();
      }
      // teammates
      for(let i=0;i<3;i++){
        drawChar(ctx,w*0.15+i*60,courtY-2,0.7,t*0.002+i,{color:'rgba(180,190,210,0.5)'});
      }
      ctx.font='bold 16px Inter,sans-serif'; ctx.fillStyle='rgba(20,184,166,0.8)'; ctx.textAlign='center';
      if(sp>0.2) ctx.fillText('School Volleyball Team Player',w/2,h*0.12);
    }
    if(phase>=2){
      // LEADERSHIP
      const sp=clamp((phase-2)/1,0,1);
      const floorY=h*0.7;
      ctx.fillStyle='#0f0f28'; ctx.fillRect(0,0,w,h);
      ctx.fillStyle='#16162e'; ctx.fillRect(0,floorY,w,h-floorY);
      // podium
      ctx.fillStyle='#2a2a4a';
      ctx.fillRect(w/2-30,floorY-50,60,50);
      ctx.fillRect(w/2-40,floorY-10,80,10);
      // character at podium
      drawChar(ctx,w/2,floorY-52,1.1,0,{glow:'#8b5cf6'});
      // audience
      for(let i=0;i<12;i++){
        const ax=w*0.1+i*(w*0.8/12);
        const ay=h*0.82+Math.sin(i)*8;
        drawChar(ctx,ax,ay,0.45,0,{color:'rgba(150,160,180,0.3)'});
      }
      // text
      ctx.font='bold 15px Inter,sans-serif'; ctx.fillStyle='rgba(139,92,246,0.8)'; ctx.textAlign='center';
      if(sp>0.2) ctx.fillText('Class Representative • Secretary, Matrix MCA',w/2,h*0.1);
      ctx.font='12px Inter,sans-serif'; ctx.fillStyle='rgba(255,255,255,0.4)';
      if(sp>0.4) ctx.fillText('Student Police Cadet • BCA Fest Coordinator',w/2,h*0.1+22);
    }
    ctx.font=`bold ${Math.min(w*0.035,24)}px Inter,sans-serif`; ctx.fillStyle='rgba(255,255,255,0.1)'; ctx.textAlign='left';
    ctx.fillText('BEYOND THE CODE',30,h-20);
    drawVignette(ctx,w,h);
  }},

  // ─── 6. PROJECTS ───
  { id:'proj', dur:6000, draw(ctx,w,h,t,p){
    ctx.fillStyle='#080820'; ctx.fillRect(0,0,w,h);
    // blueprint grid
    ctx.strokeStyle='rgba(99,102,241,0.06)'; ctx.lineWidth=1;
    for(let x=0;x<w;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
    for(let y=0;y<h;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
    // projects
    const projs=D.projects;
    projs.forEach((pr,i)=>{
      const pp=clamp((p-i*0.15)*3,0,1);
      if(pp<=0) return;
      const bx=w*0.1+i*(w*0.22), by=h*0.25;
      const bw=w*0.18, bh=h*0.35;
      // wireframe to filled
      if(pp<0.5){
        ctx.strokeStyle=`rgba(99,102,241,${pp*2})`; ctx.lineWidth=1.5;
        ctx.strokeRect(bx,by,bw*pp*2,bh*pp*2);
      } else {
        ctx.fillStyle=`rgba(20,20,50,${(pp-0.5)*2*0.8})`;
        ctx.fillRect(bx,by,bw,bh);
        ctx.strokeStyle='rgba(99,102,241,0.4)'; ctx.lineWidth=1;
        ctx.strokeRect(bx,by,bw,bh);
        // header
        ctx.fillStyle=`rgba(99,102,241,${(pp-0.5)*2*0.3})`;
        ctx.fillRect(bx,by,bw,20);
        // content lines
        for(let l=0;l<3;l++){
          ctx.fillStyle=`rgba(255,255,255,${(pp-0.5)*2*0.15})`;
          ctx.fillRect(bx+8,by+30+l*16,bw*0.6+l*10,6);
        }
      }
      if(pp>0.6){
        ctx.font='bold 12px Inter,sans-serif'; ctx.fillStyle=`rgba(255,255,255,${(pp-0.6)*2.5})`;
        ctx.textAlign='center'; ctx.fillText(pr.title,bx+bw/2,by+bh+20);
      }
    });
    drawChar(ctx,w*0.85,h*0.7,0.9,t*0.002,{walking:true,facing:'left',glow:'#ec4899'});
    ctx.font=`bold ${Math.min(w*0.04,28)}px Inter,sans-serif`; ctx.fillStyle='rgba(255,255,255,0.1)'; ctx.textAlign='left';
    ctx.fillText('BUILT & SHIPPED',30,40);
    drawVignette(ctx,w,h);
  }},

  // ─── 7. CLOSING ───
  { id:'close', dur:7000, draw(ctx,w,h,t,p){
    // sunrise gradient
    const sky=ctx.createLinearGradient(0,0,0,h);
    sky.addColorStop(0,`rgba(${10+p*30},${10+p*15},${40+p*20},1)`);
    sky.addColorStop(0.5,`rgba(${30+p*80},${20+p*40},${60+p*30},1)`);
    sky.addColorStop(0.8,`rgba(${60+p*150},${40+p*80},${30+p*20},1)`);
    sky.addColorStop(1,'#0a0a1a');
    ctx.fillStyle=sky; ctx.fillRect(0,0,w,h);
    if(p<0.5) drawStars(ctx,w,h,t,Math.floor(60*(1-p*2)));
    // sun
    if(p>0.3){
      const sunP=clamp((p-0.3)*2,0,1);
      const sunY=lerp(h*0.6,h*0.35,sunP);
      const sunG=ctx.createRadialGradient(w/2,sunY,5,w/2,sunY,80);
      sunG.addColorStop(0,'rgba(255,200,50,0.8)'); sunG.addColorStop(0.5,'rgba(255,150,50,0.2)'); sunG.addColorStop(1,'transparent');
      ctx.fillStyle=sunG; ctx.fillRect(0,0,w,h);
      ctx.beginPath(); ctx.arc(w/2,sunY,20+sunP*10,0,Math.PI*2);
      ctx.fillStyle='rgba(255,220,100,0.9)'; ctx.fill();
    }
    // road
    const roadY=h*0.75;
    drawGround(ctx,w,h,roadY,'#1a1a30');
    // perspective road lines
    ctx.strokeStyle='rgba(255,255,255,0.1)'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(w*0.3,h); ctx.lineTo(w/2,roadY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(w*0.7,h); ctx.lineTo(w/2,roadY); ctx.stroke();
    // character walking forward (shrinking = going into distance)
    const charScale=lerp(1.2,0.4,ease(clamp(p*1.5,0,1)));
    const charY=lerp(roadY+10,roadY-10,ease(clamp(p*1.5,0,1)));
    drawChar(ctx,w/2,charY,charScale,t*0.004,{walking:true,glow:'#f59e0b'});
    // quote
    if(p>0.5){
      const qp=clamp((p-0.5)*2.5,0,1);
      ctx.globalAlpha=qp;
      ctx.font=`italic ${Math.min(w*0.03,20)}px Inter,sans-serif`; ctx.fillStyle='rgba(255,255,255,0.8)'; ctx.textAlign='center';
      ctx.fillText('"Building solutions, exploring possibilities,',w/2,h*0.18);
      ctx.fillText('and continuously evolving."',w/2,h*0.18+28);
      ctx.font=`bold ${Math.min(w*0.025,16)}px Inter,sans-serif`; ctx.fillStyle='rgba(139,92,246,0.7)';
      ctx.fillText('— '+D.hero.name,w/2,h*0.18+60);
      ctx.globalAlpha=1;
    }
    // fade to black at end
    if(p>0.85){
      ctx.fillStyle=`rgba(0,0,0,${(p-0.85)/0.15})`; ctx.fillRect(0,0,w,h);
    }
    drawVignette(ctx,w,h);
  }},
];
