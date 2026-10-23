const comicPages=Array.from({length:19},(_,i)=>['bungee-comic-'+String(i+1).padStart(2,'0'),'Bungee Space · 第 '+(i+1)+' 页','Bungee Space · Page '+(i+1)]);
let comicPage=0,comicMode='page',comicTurning=false,comicTurnId=0,comicSwiped=false;
const comicWide=window.matchMedia('(min-width: 800px)');
const comicReduced=window.matchMedia('(prefers-reduced-motion: reduce)');
const comicImageCache=new Map();
const spreadStart=index=>index===0?0:1+2*Math.floor((index-1)/2);
const spreadPages=index=>comicWide.matches?(index===0?[-1,0]:[index,index+1]):[index];
function comicShell(){
 return '<section class="comic-reader section-pad" id="comic-reader" aria-label="'+t('Bungee Space 连环画','Bungee Space visual story')+'">'+
 '<div class="comic-heading"><div><span class="eyebrow-accent">A SPATIAL STORY / 19 PAGES</span><h2>'+t('走进 Bungee Space','Inside Bungee Space')+'</h2><p>'+t('跟随镜头，穿过书架与日常。','Follow the camera through bookshelves and everyday life.')+'</p></div><div class="comic-modes" role="group" aria-label="'+t('阅读模式','Reading mode')+'"><button data-comic-mode="page">'+t('翻页阅读','Turn the pages')+'</button><button data-comic-mode="scroll">'+t('连续阅读','Continuous')+'</button></div></div>'+
 '<div class="comic-controls"><button id="comic-prev" aria-label="'+t('向前翻页','Turn back')+'">← <span>'+t('上一页','Previous')+'</span></button><span id="comic-status" role="status" aria-live="polite"></span><button id="comic-next" aria-label="'+t('向后翻页','Turn forward')+'"><span>'+t('下一页','Next')+'</span> →</button></div><div id="comic-stage"></div>'+
 '<div class="comic-thumbnails" aria-label="'+t('选择页码','Choose a page')+'">'+comicPages.map((item,i)=>'<button data-comic-page="'+i+'" aria-label="'+t('前往第 '+(i+1)+' 页','Go to page '+(i+1))+'"><img src="assets/'+item[0]+'-small.webp" alt="" loading="lazy"><span>'+String(i+1).padStart(2,'0')+'</span></button>').join('')+'</div>'+
 '<p class="comic-note">'+t('点击箭头或左右滑动翻页 · 点击画面放大 · 19 页原作，保留英文对白','Use the arrows or swipe to turn · Select an image to enlarge · 19 original pages with English dialogue')+'</p></section>';
}
function setupComic(){
 document.querySelectorAll('[data-comic-mode]').forEach(button=>button.addEventListener('click',()=>{comicMode=button.dataset.comicMode;renderComic();}));
 document.querySelectorAll('[data-comic-page]').forEach(button=>button.addEventListener('click',()=>{
  const index=Number(button.dataset.comicPage);
  if(comicMode==='scroll'){comicMode='page';comicPage=index;renderComic();}
  else animateComicTo(comicWide.matches?spreadStart(index):index);
  document.getElementById('comic-reader').scrollIntoView({behavior:'instant',block:'start'});
 }));
 document.getElementById('comic-prev').addEventListener('click',()=>turnComic(-1));
 document.getElementById('comic-next').addEventListener('click',()=>turnComic(1));
 document.getElementById('comic-reader').addEventListener('keydown',event=>{
  if(comicMode!=='page'||!['ArrowLeft','ArrowRight'].includes(event.key))return;
  event.preventDefault();turnComic(event.key==='ArrowRight'?1:-1);
 });
 const stage=document.getElementById('comic-stage');let start=null;
 stage.addEventListener('pointerdown',event=>{start={x:event.clientX,y:event.clientY};comicSwiped=false;});
 stage.addEventListener('pointerup',event=>{
  if(!start)return;const dx=event.clientX-start.x,dy=event.clientY-start.y;start=null;
  if(comicMode==='page'&&Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.3){comicSwiped=true;turnComic(dx<0?1:-1);}
 });
 stage.addEventListener('pointercancel',()=>{start=null;});
 stage.addEventListener('click',event=>{if(comicSwiped){event.preventDefault();event.stopPropagation();comicSwiped=false;}},true);
 renderComic();
}
comicWide.addEventListener('change',()=>{if(document.getElementById('comic-stage'))renderComic();});
function pageImage(index,eager=true){
 const item=comicPages[index];if(!item)return '';
 return '<img src="'+asset(item[0])+'" alt="'+pair(item.slice(1))+'" loading="'+(eager?'eager':'lazy')+'" decoding="async" draggable="false">';
}
function sheetMarkup(index,side='',continuous=false){
 if(index<0||index>=comicPages.length)return '<div class="book-empty '+side+'" aria-hidden="true"></div>';
 return '<figure class="comic-sheet '+side+'" data-load-state="loading"><button data-comic-enlarge="'+index+'" aria-label="'+t('放大第 '+(index+1)+' 页','Enlarge page '+(index+1))+'">'+pageImage(index,!continuous||index===0)+'</button><div class="comic-load-status" role="status"><span>'+t('画面载入中…','Loading page…')+'</span><button class="comic-retry" hidden>'+t('重新加载','Try again')+' ↻</button></div>'+(continuous?'<figcaption>'+String(index+1).padStart(2,'0')+' / 19</figcaption>':'')+'</figure>';
}
function bookMarkup(pages){
 return '<div class="book-scene '+(comicWide.matches?'book-spread':'book-single')+'">'+pages.map((index,i)=>sheetMarkup(index,i===0&&comicWide.matches?'book-left':'book-right')).join('')+(comicWide.matches?'<div class="book-spine" aria-hidden="true"></div>':'')+'</div>';
}
function bindComicImages(stage){
 stage.querySelectorAll('[data-comic-enlarge]').forEach(button=>button.addEventListener('click',()=>{if(!comicTurning)openLightbox(Number(button.dataset.comicEnlarge));}));
 stage.querySelectorAll('.comic-sheet').forEach(sheet=>{
  const image=sheet.querySelector('img'),status=sheet.querySelector('.comic-load-status'),retry=sheet.querySelector('.comic-retry');
  const ready=()=>{sheet.dataset.loadState='ready';status.hidden=true;};
  const failed=()=>{sheet.dataset.loadState='error';status.hidden=false;status.querySelector('span').textContent=t('图片暂未载入，请重试。','The image could not load. Please try again.');retry.hidden=false;};
  image.addEventListener('load',ready);image.addEventListener('error',failed);
  retry.addEventListener('click',()=>{sheet.dataset.loadState='loading';retry.hidden=true;status.querySelector('span').textContent=t('画面载入中…','Loading page…');image.src=image.src.split('?')[0]+'?retry='+Date.now();});
  if(image.complete){if(image.naturalWidth)ready();else failed();}
 });
}
function updateComicControls(){
 const continuous=comicMode==='scroll',visible=spreadPages(comicPage).filter(i=>i>=0&&i<19);
 document.getElementById('comic-status').textContent=continuous?t('完整故事 · 19 页','Full story · 19 pages'):visible.map(i=>String(i+1).padStart(2,'0')).join('–')+' / 19';
 document.getElementById('comic-prev').disabled=continuous||comicTurning||comicPage===0;
 document.getElementById('comic-next').disabled=continuous||comicTurning||visible[visible.length-1]===18;
 document.querySelectorAll('[data-comic-mode]').forEach(button=>{button.setAttribute('aria-pressed',button.dataset.comicMode===comicMode);button.disabled=comicTurning;});
 document.querySelectorAll('[data-comic-page]').forEach(button=>{button.setAttribute('aria-current',!continuous&&visible.includes(Number(button.dataset.comicPage))?'page':'false');button.disabled=comicTurning;});
}
function renderComic(){
 comicTurnId++;comicTurning=false;
 if(comicWide.matches)comicPage=spreadStart(comicPage);
 const stage=document.getElementById('comic-stage');if(!stage)return;
 const continuous=comicMode==='scroll';stage.className='comic-stage '+(continuous?'continuous':'book-viewport');stage.setAttribute('aria-busy','false');
 stage.innerHTML=continuous?comicPages.map((_,i)=>sheetMarkup(i,'',true)).join(''):bookMarkup(spreadPages(comicPage));
 bindComicImages(stage);updateComicControls();
 if(!continuous){const next=comicWide.matches?(comicPage===0?1:comicPage+2):comicPage+1;spreadPages(next).filter(i=>i>=0&&i<19).forEach(i=>loadComicImage(i));}
}
function turnComic(direction){
 if(comicTurning||comicMode!=='page')return;
 let next=comicPage+direction;
 if(comicWide.matches)next=direction>0?(comicPage===0?1:comicPage+2):(comicPage<=1?0:comicPage-2);
 if(next<0||next>=19)return;
 animateComicTo(next);
}
function loadComicImage(index){
 if(!comicImageCache.has(index)){
  const image=new Image();
  const promise=new Promise(resolve=>{image.onload=()=>resolve(true);image.onerror=()=>{comicImageCache.delete(index);resolve(false);};image.src=asset(comicPages[index][0]);});
  comicImageCache.set(index,promise);
 }
 return comicImageCache.get(index);
}
async function animateComicTo(target){
 if(comicTurning||target===comicPage||target<0||target>=19)return;
 if(comicReduced.matches){comicPage=target;renderComic();return;}
 const stage=document.getElementById('comic-stage'),oldPage=comicPage,forward=target>oldPage;
 const oldPages=spreadPages(oldPage),newPages=spreadPages(target);
 const token=++comicTurnId;comicTurning=true;stage.setAttribute('aria-busy','true');updateComicControls();
 await Promise.race([Promise.all(newPages.filter(i=>i>=0&&i<19).map(loadComicImage)),new Promise(resolve=>setTimeout(resolve,1800))]);
 if(token!==comicTurnId||!stage.isConnected)return;
 const wide=comicWide.matches;
 const under=wide?(forward?[oldPages[0],newPages[1]]:[newPages[0],oldPages[1]]):newPages;
 stage.innerHTML=bookMarkup(under);bindComicImages(stage);
 const scene=stage.querySelector('.book-scene'),leaf=document.createElement('div');
 leaf.className='book-leaf flexible-leaf '+(forward?'turn-forward':'turn-backward');
 leaf.setAttribute('aria-hidden','true');
 const front=wide?(forward?oldPages[1]:oldPages[0]):oldPages[0];
 const back=wide?(forward?newPages[0]:newPages[1]):newPages[0];
 // A continuous curved sheet, approximated by narrow adjoining paper strips.
 scene.appendChild(leaf);scene.classList.add('is-turning');
 const shadow=document.createElement('div');shadow.className='page-cast-shadow';shadow.setAttribute('aria-hidden','true');scene.append(shadow);
 const count=40,width=scene.clientWidth/(wide?2:1),stripWidth=width/count,height=scene.clientHeight;
 const strips=[];
 for(let i=0;i<count;i++){
  const strip=document.createElement('div');strip.className='paper-strip';strip.style.width=(stripWidth+.5)+'px';
  strip.style.transformOrigin=forward?'left center':'right center';
  const frontX=forward?i*stripWidth:width-(i+1)*stripWidth;
  const backX=forward?width-(i+1)*stripWidth:i*stripWidth;
  const face=(index,x,side)=>'<div class="paper-face paper-'+side+'">'+(index>=0&&index<19?'<img src="'+asset(comicPages[index][0])+'" alt="" draggable="false" style="width:'+width+'px;height:'+height+'px;left:-'+x+'px">':'')+'</div>';
  strip.innerHTML=face(front,frontX,'front')+face(back,backX,'back');leaf.append(strip);strips.push(strip);
 }
 const duration=1320,started=performance.now(),direction=forward?-1:1;
 function frame(now){
  if(token!==comicTurnId||!stage.isConnected)return;
  const p=Math.min(1,(now-started)/duration);
  // Slow pickup, relaxed travel, and a long soft landing with zero end velocity.
  const eased=p*p*p*(p*(p*6-15)+10),rotation=Math.PI*eased;
  const curl=Math.sin(rotation)*.58;
  let x=0,z=0;
  for(let i=0;i<count;i++){
   const u=(i+.5)/count,angle=direction*(rotation+curl*(2*u-1));
   const left=forward?x:width+x-stripWidth;
   const pose='translate3d('+left+'px,0,'+z+'px) rotateY('+(angle*180/Math.PI)+'deg)';
   strips[i].style.transform=pose;
   const darkness=Math.abs(Math.sin(angle))*.19;
   strips[i].style.setProperty('--paper-shade',darkness.toFixed(3));
   const travel=forward?stripWidth:-stripWidth;
   x+=Math.cos(angle)*travel;z-=Math.sin(angle)*travel;
  }
  const lift=Math.sin(rotation);
  shadow.style.opacity=String(lift*.26);
  shadow.style.width=(width*(.12+.65*Math.abs(Math.cos(rotation))))+'px';
  shadow.style.left=(wide?width:0)+(forward?Math.min(0,x):Math.min(0,-x))+'px';
  shadow.style.filter='blur('+(5+lift*15)+'px)';
  if(p<1)requestAnimationFrame(frame);else{comicPage=target;renderComic();}
 }
 requestAnimationFrame(frame);
}
