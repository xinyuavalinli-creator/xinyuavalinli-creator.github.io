const pose={a:.86,b:.59,c:.2,d:.14,e:.28};
function setPaused(id,paused){
 const state=motionStates.get(id);state.paused=paused;
 const button=document.querySelector('[data-pause="'+id+'"]');button.setAttribute('aria-pressed',paused);button.textContent=paused?'播放 ▷':'暂停 Ⅱ';
 button.setAttribute('aria-label',(paused?'播放 ':'暂停 ')+concepts.find(c=>c[0]===id)[1]+' 动画');
}
function showPose(id){const state=motionStates.get(id);setPaused(id,true);state.phase=pose[id];paint(state,state.phase);}
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{const state=motionStates.get(entry.target.dataset.motion);if(state)state.visible=entry.isIntersecting;}),{rootMargin:'100px'});
document.querySelectorAll('[data-motion]').forEach((canvas,i)=>{
 const id=canvas.dataset.motion,svg=canvas.querySelector('svg'),root=node('g');svg.append(root);
 const ghost=node('path',{'class':'wire-ghost'});root.append(ghost);
 const top=makeFace(root,'top'),front=makeFace(root,'front','AVALIN'),side=makeFace(root,'side','LI');
 const tether=node('path',{'class':'wire-tether'}),accent=node('path',{'class':'wire-accent'});root.append(tether,accent);
 const state={id,svg,root,ghost,top,front,side,tether,accent,phase:0,paused:false,visible:true,duration:8.4,slider:document.querySelector('[data-scrub="'+id+'"]'),progress:document.querySelector('[data-progress="'+id+'"]')};
 motionStates.set(id,state);paint(state,0);observer.observe(canvas);
 state.slider.addEventListener('input',()=>{setPaused(id,true);state.phase=Number(state.slider.value)/1000;paint(state,state.phase);});
});
document.querySelectorAll('[data-pause]').forEach(button=>button.addEventListener('click',()=>{const id=button.dataset.pause;setPaused(id,!motionStates.get(id).paused);}));
document.querySelectorAll('[data-replay]').forEach(button=>button.addEventListener('click',()=>{const state=motionStates.get(button.dataset.replay);state.phase=0;setPaused(state.id,false);paint(state,0);}));
document.querySelectorAll('[data-pose]').forEach(button=>button.addEventListener('click',()=>showPose(button.dataset.pose)));
document.getElementById('pause-all').addEventListener('click',()=>motionStates.forEach(state=>setPaused(state.id,true)));
document.getElementById('play-all').addEventListener('click',()=>motionStates.forEach(state=>setPaused(state.id,false)));
document.getElementById('show-static').addEventListener('click',()=>motionStates.forEach(state=>showPose(state.id)));
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
if(reduced.matches)motionStates.forEach(state=>showPose(state.id));
reduced.addEventListener('change',event=>{if(event.matches)motionStates.forEach(state=>showPose(state.id));});
let last=performance.now();
function tick(now){
 const delta=Math.min((now-last)/1000,.08);last=now;
 if(!document.hidden)motionStates.forEach(state=>{if(!state.paused&&state.visible){state.phase=(state.phase+delta/state.duration)%1;paint(state,state.phase);}});
 requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

