// Project each moving plane directly into SVG, so letters stay attached to their surfaces.
const NS='http://www.w3.org/2000/svg';
const motionStates=new Map();
const TAU=Math.PI*2, rad=value=>value*Math.PI/180;
const clamp=value=>Math.max(0,Math.min(1,value));
const smooth=value=>value*value*(3-2*value);
function track(phase,keys){for(let i=1;i<keys.length;i++){if(phase<=keys[i][0]){const [a,x]=keys[i-1],[b,y]=keys[i];return x+(y-x)*smooth(clamp((phase-a)/(b-a)));}}return keys[keys.length-1][1];}
function shift(phase,amount){return (phase-amount+1)%1;}
function node(tag,attrs={}){const el=document.createElementNS(NS,tag);Object.entries(attrs).forEach(([key,value])=>el.setAttribute(key,value));return el;}
function config(id,p){
 const s=Math.sin(TAU*p),c=Math.cos(TAU*p);
 const q={w:240,h:140,d:145,yaw:-29,pitch:-18,roll:0,hinge:90,lid:0,front:[0,0,0],side:[0,0,0],top:[0,0,0],dx:0,dy:0,shear:0,ghost:.2,topAlpha:.85,frontTwist:0,sideTwist:0};
 if(id==='a'){
  // Open fully like study 02; return with the delayed roof and spring of study 01.
  const open=track(p,[[0,0],[.10,0],[.33,1],[.49,1],[.69,-.065],[.77,.025],[.85,0],[1,0]]);
  const roof=track(p,[[0,0],[.14,0],[.38,1],[.51,1],[.73,-.08],[.81,.025],[.89,0],[1,0]]);
  q.hinge=90*(1-open);q.lid=roof*48;
  q.yaw=-29*(1-open);q.pitch=-18*(1-open);
  q.roll=-3.5*Math.sin(Math.PI*open);q.dx=-q.d*.5*open;
  q.dy=-9*Math.sin(Math.PI*open);q.ghost=.16*(1-open);q.topAlpha=.85-.68*roof;
 }
 if(id==='c'){
  const stretch=track(p,[[0,0],[.16,1],[.34,-.7],[.46,.3],[.57,-.12],[.68,0],[.83,0],[1,0]]);
  q.w=240*(1+.28*stretch);q.h=140*(1-.24*stretch);q.d=145*(1-.13*stretch);q.shear=.12*stretch;q.roll=-3*stretch;q.yaw=-29+7*stretch;q.dy=-8*stretch;q.hinge=90-8*stretch;
 }
 if(id==='d'){
  const wave=Math.sin(TAU*p),other=Math.sin(TAU*p+.8);
  q.yaw=-28+8*wave;q.pitch=-14+7*other;q.roll=-5+7*Math.sin(TAU*p-.5);q.hinge=82+13*other;
  q.front=[-12*wave,12*other,0];q.side=[15*wave,-14*other,4*wave];q.top=[0,-8,0];q.lid=15+12*wave;q.ghost=.1;q.topAlpha=.28;
  q.frontTwist=3*other;q.sideTwist=-4*wave;q.dy=-5*Math.sin(TAU*p*2);
 }
 if(id==='e'){
  const out=track(p,[[0,0],[.18,1],[.38,1],[.62,-.06],[.71,.025],[.8,0],[1,0]]);
  const later=track(shift(p,.045),[[0,0],[.18,1],[.38,1],[.62,-.06],[.71,.025],[.8,0],[1,0]]);
  q.front=[-24*out,16*out,20*out];q.side=[33*later,-6*later,-6*later];q.top=[0,-42*out,0];q.lid=22*out;
  q.yaw=-29-9*out;q.roll=5*out;q.dy=7*out;q.hinge=90-12*later;q.ghost=.2*(1-out);
 }
 return q;
}
function project(point,q){
 let [x,y,z]=point;x+=y*q.shear;
 const ay=rad(q.yaw),ax=rad(q.pitch),az=rad(q.roll);
 const xx=x*Math.cos(ay)+z*Math.sin(ay),zz=-x*Math.sin(ay)+z*Math.cos(ay);
 const yy=y*Math.cos(ax)-zz*Math.sin(ax);
 return [(xx*Math.cos(az)-yy*Math.sin(az))*1.12+300+q.dx,(xx*Math.sin(az)+yy*Math.cos(az))*1.12+171+q.dy];
}
function plane(kind,q){
 const W=kind==='side'?q.d:q.w,H=kind==='top'?q.d:q.h;
 return [[0,0],[W,0],[W,H],[0,H]].map(([u,v])=>{
  let pos,offset,twist=0,center;
  if(kind==='front'){pos=[u-q.w/2,v-q.h/2,q.d/2];offset=q.front;twist=q.frontTwist;center=[0,0];}
  if(kind==='side'){pos=[q.w/2+u*Math.cos(rad(q.hinge)),v-q.h/2,q.d/2-u*Math.sin(rad(q.hinge))];offset=q.side;twist=q.sideTwist;center=[q.w/2,-q.h/2];}
  if(kind==='top'){pos=[u-q.w/2,-q.h/2-v*Math.sin(rad(q.lid)),q.d/2-v*Math.cos(rad(q.lid))];offset=q.top;}
  if(twist){const x=pos[0]-center[0],y=pos[1]-center[1],r=rad(twist);pos[0]=center[0]+x*Math.cos(r)-y*Math.sin(r);pos[1]=center[1]+x*Math.sin(r)+y*Math.cos(r);}
  return project(pos.map((value,i)=>value+offset[i]),q);
 });
}
const points=quad=>quad.map(p=>p.map(v=>v.toFixed(2)).join(',')).join(' ');
function makeFace(svg,name,label){
 const group=node('g',{'class':'wire-face wire-'+name});
 const outline=node('polygon',{'class':'face-outline'});
 group.append(outline);
 let type=null,text=null;
 if(label){type=node('g',{'class':'face-type'});text=node('g');WORD_OUTLINES[label].paths.forEach(glyph=>text.append(node('path',{d:glyph.d.replace(/^F[01]/,''),transform:'translate('+glyph.x+' 0)','fill-rule':'nonzero'})));type.append(text);group.append(type);}
 svg.append(group);return {group,outline,type,text};
}
function paintType(face,quad,width,height,label){
 if(!face.type)return;
 const [origin,x,,y]=quad;
 face.type.setAttribute('transform','matrix('+[(x[0]-origin[0])/width,(x[1]-origin[1])/width,(y[0]-origin[0])/height,(y[1]-origin[1])/height,origin[0],origin[1]].map(v=>v.toFixed(5)).join(' ')+')');
 // Same point size and inset on both planes; letters retain their original proportions.
 const size=48,pad=14,bottom=14;
 face.text.setAttribute('transform','translate('+pad+' '+(height-bottom)+') scale('+(size/100)+')');
}
function paint(state,phase){
 const q=config(state.id,phase),front=plane('front',q),side=plane('side',q),top=plane('top',q);
 const all=[...front,...side,...top],xs=all.map(p=>p[0]),ys=all.map(p=>p[1]);
 const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
 const fit=Math.min(1,530/(maxX-minX),290/(maxY-minY));
 let tx=(1-fit)*300,ty=(1-fit)*180;
 tx+=Math.max(0,25-(minX*fit+tx))-Math.max(0,maxX*fit+tx-575);
 ty+=Math.max(0,22-(minY*fit+ty))-Math.max(0,maxY*fit+ty-330);
 state.root.setAttribute('transform','matrix('+fit+' 0 0 '+fit+' '+tx+' '+ty+')');
 state.front.outline.setAttribute('points',points(front));state.side.outline.setAttribute('points',points(side));state.top.outline.setAttribute('points',points(top));
 state.top.group.setAttribute('opacity',q.topAlpha);
 paintType(state.front,front,q.w,q.h,'AVALIN');paintType(state.side,side,q.d,q.h,'LI');
 const back=[[-q.w/2,-q.h/2,-q.d/2],[q.w/2,-q.h/2,-q.d/2],[q.w/2,q.h/2,-q.d/2],[-q.w/2,q.h/2,-q.d/2]].map(point=>project(point,q));
 state.ghost.setAttribute('d','M'+back.map(p=>p.join(',')).join('L')+'Z M'+back[3].join(',')+'L'+front[3].join(','));
 state.ghost.setAttribute('opacity',q.ghost);
 state.accent.setAttribute('d','M'+front[1].join(',')+'L'+front[2].join(','));
 state.tether.setAttribute('d','M'+front[1].join(',')+'L'+side[0].join(',')+' M'+front[2].join(',')+'L'+side[3].join(','));
 state.tether.setAttribute('opacity',state.id==='d'?.45:.16);
 if(state.slider)state.slider.value=Math.round(phase*1000);if(state.progress)state.progress.value=String(Math.round(phase*100)).padStart(2,'0')+'%';
}

// Mount the approved identity independently of the exploration-page controls.
function mountBrandMotion(container,button,labels){
 const svg=container.querySelector('svg'),root=node('g');svg.append(root);
 const ghost=node('path',{'class':'wire-ghost'});root.append(ghost);
 const top=makeFace(root,'top'),front=makeFace(root,'front','AVALIN'),side=makeFace(root,'side','LI');
 const tether=node('path',{'class':'wire-tether'}),accent=node('path',{'class':'wire-accent'});root.append(tether,accent);
 const state={id:'a',root,ghost,top,front,side,tether,accent};
 const preference=matchMedia('(prefers-reduced-motion: reduce)');
 let phase=0,paused=preference.matches,visible=false,frame=0,last=0,destroyed=false;
 const update=()=>{button.textContent=paused?labels.play:labels.pause;button.setAttribute('aria-pressed',String(paused));};
 const tick=now=>{frame=0;if(destroyed||paused||!visible||document.hidden)return;phase=(phase+Math.min((now-last)/1000,.08)/8.4)%1;last=now;paint(state,phase);frame=requestAnimationFrame(tick);};
 const resume=()=>{cancelAnimationFrame(frame);frame=0;if(!destroyed&&!paused&&visible&&!document.hidden){last=performance.now();frame=requestAnimationFrame(tick);}};
 const toggle=()=>{paused=!paused;update();resume();};
 const onPreference=()=>{paused=preference.matches;if(paused){phase=0;paint(state,phase);}update();resume();};
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;resume();});observer.observe(container);
 button.addEventListener('click',toggle);preference.addEventListener('change',onPreference);document.addEventListener('visibilitychange',resume);paint(state,0);update();
 return ()=>{destroyed=true;cancelAnimationFrame(frame);observer.disconnect();button.removeEventListener('click',toggle);preference.removeEventListener('change',onPreference);document.removeEventListener('visibilitychange',resume);};
}
