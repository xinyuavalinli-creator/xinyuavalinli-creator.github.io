let language = 'zh';
try { language = new URLSearchParams(location.search).get('lang') || localStorage.getItem('avalin-language') || 'zh'; } catch {}
if (!['zh','en'].includes(language)) language = 'zh';
let activeFilter = 'all';
let disposeBrandMotion = null;
let lightboxItems = [];
let lightboxIndex = 0;
let lightboxTrigger = null;
const t = (zh,en) => language === 'zh' ? zh : en;
const pair = value => value[language === 'zh' ? 0 : 1];
const arrow = '<span aria-hidden="true">↗</span>';
const asset = name => `assets/${name}.webp`;
const labels = {architecture:['建筑设计','Architecture'],research:['研究与叙事','Research & narrative'],drawing:['手绘观察','Sketchbook']};
const main = document.getElementById('main');
const dialog = document.getElementById('lightbox');

function picture(name, alt, cls='', eager=false) {
  const meta = (typeof ASSET_META !== 'undefined' ? ASSET_META[name] : null) || (['muro-a0plan','aac-model-original'].includes(name) ? IMAGE_LAYOUT[name] : null);
  if (meta) return `<img class="${cls}" src="${asset(name)}" srcset="assets/${name}-small.webp ${meta.smallWidth}w, ${asset(name)} ${meta.width}w" sizes="${eager ? '100vw' : '(max-width: 700px) 92vw, 46vw'}" width="${meta.width}" height="${meta.height}" alt="${alt}" loading="${eager?'eager':'lazy'}" decoding="async">`;
  return `<img class="${cls}" src="${asset(name)}" ${name.startsWith('board-') || name==='aac-structure-model' ? '' : `srcset="assets/${name}-small.webp 800w, ${asset(name)} ${name==='aac-structure-model'?603:name.startsWith('bungee-comic-')?2400:1800}w" sizes="(max-width: 700px) 100vw, 60vw"`} alt="${alt}" loading="${eager?'eager':'lazy'}" decoding="async">`;
}

function renderHeader() {

  document.getElementById('header').innerHTML = `
    <a class="brand" href="#/" aria-label="Xinyu (Avalin) Li — ${t('首页','Home')}"><span class="brand-symbol logo-approved">${logoMarkup()}</span><span class="brand-name">AVALIN LI<small>ARCHITECTURE & DESIGN</small></span></a>
    <nav aria-label="${t('主导航','Main navigation')}"><a href="#/work">${t('作品','Work')} <sup>08</sup></a><a href="#/about">${t('关于','About')}</a><a href="#/contact">${t('联系','Contact')} ${arrow}</a></nav>
    <div class="language-switch" role="group" aria-label="Language / 语言"><button data-lang="zh" aria-pressed="${language==='zh'}">中</button><span>/</span><button data-lang="en" aria-pressed="${language==='en'}">EN</button></div>`;
  document.querySelectorAll('.language-switch button[data-lang]').forEach(button => button.addEventListener('click', () => {
    const y = window.scrollY;
    language = button.dataset.lang;
    try { localStorage.setItem('avalin-language',language); } catch {}
    const languageUrl = new URL(location.href);
    languageUrl.searchParams.set('lang',language);
    history.replaceState(null,'',languageUrl);
    render(false);
    window.scrollTo({top:y,behavior:'instant'});
  }));
}

function renderFooter() {
  document.getElementById('footer').innerHTML = `<section class="contact-section" id="contact">
    <div class="section-eyebrow"><span>03 / ${t('开始对话','GET IN TOUCH')}</span><span>${t('建筑 · 创意 · 新的可能','ARCHITECTURE · IDEAS · POSSIBILITIES')}</span></div>
    <a class="contact-title" href="mailto:xinyuavalinli@gmail.com"><span>${t('一起，<br>创造更多。','LET’S MAKE<br>SOMETHING.')}</span><span class="contact-arrow" aria-hidden="true">↗</span></a>
    <div class="contact-bottom"><a class="email-link" href="mailto:xinyuavalinli@gmail.com">xinyuavalinli@gmail.com ${arrow}</a><div class="contact-downloads"><a href="assets/Xinyu-Li-CV.pdf" download>${t('下载简历','Download CV')} ↓</a></div></div>
    <div class="colophon"><span>© 2026 XINYU (AVALIN) LI</span><span>${t('以好奇心观察，以设计回应。','OBSERVE WITH CURIOSITY. RESPOND THROUGH DESIGN.')}</span><a href="#/">${t('返回顶部','Back to top')} ↑</a></div>
  </section>`;
}

function card(project) {
  return `<article class="work-card" data-category="${project.category}"><a href="#/project/${project.id}" aria-label="${t('查看项目','View project')} — ${project.title}">
    <div class="card-image image-${project.cover}">${picture(project.cover,pair([project.zh,project.title]))}<span class="card-number">${project.no}</span><span class="card-open" aria-hidden="true">↗</span><span class="card-category">${pair(labels[project.category])}</span></div>
    <div class="card-meta"><span>${project.title}</span><span>${project.year}</span></div>
    <div class="card-description"><span>${language==='zh'?project.zh:pair(project.subtitle)}</span><span class="card-location">${pair(project.location)}</span></div>
  </a></article>`;
}

function renderCards() {
  const visible=PROJECTS.filter(p=>activeFilter==='all'||p.category===activeFilter);
  document.getElementById('work-grid').innerHTML=visible.map(card).join('');
  document.getElementById('results-announcement').textContent=t(`显示 ${visible.length} 个项目`,`Showing ${visible.length} projects`);
  document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.filter===activeFilter));
}

function renderHome() {
  document.title='Xinyu (Avalin) Li — Architecture & Design';
  main.innerHTML=`<section class="hero" aria-labelledby="hero-title">
    <div class="hero-topline"><span>PORTFOLIO — 2022 / 2025</span><span>${t('空间 / 环境 / 公共生活','SPACE / ENVIRONMENT / PUBLIC LIFE')}</span><span class="hero-index">VOL. 01</span></div>
    <h1 id="hero-title" class="sr-only">AVALIN LI — ${t('建筑与空间设计','Architecture & Spatial Design')}</h1>
    <div class="hero-composition">
      <div class="hero-intro"><span class="little-cross" aria-hidden="true">+</span><h2>${t('空间，<br>与其间的生活。','Spaces for<br>life in between.')}</h2><p>${t('我是李心宇（Avalin Li）。<br>通过建筑、研究与视觉叙事，<br>探索人与场所之间的联系。','I’m Xinyu (Avalin) Li.<br>Exploring the relationship between people<br>and place through architecture, research, and image.')}</p><a class="hero-cta" href="#/work">${t('探索作品','Explore the work')} <span>↓</span></a></div>
      <div class="home-brand-motion" id="home-brand-motion"><svg viewBox="0 0 600 360" role="img" aria-label="AVALIN LI"></svg><button id="brand-motion-toggle" type="button" aria-pressed="false"></button></div>
    </div>
    <div class="hero-feature"><div class="hero-art"><a class="hero-main-image" href="#/project/aac-hillside">${picture('aac',t('AAC 山坡校园的木结构室内空间','Timber interior of AAC Hillside Campus'),'',true)}<span class="image-caption"><span>04 — AAC HILLSIDE CAMPUS</span><span>2022 ${arrow}</span></span></a>
      <a class="hero-inset" href="#/project/italy-sketchbook" aria-label="${t('打开意大利手绘','Open Italy sketchbook')}">${picture('italy',t('意大利现场建筑手绘','On-site architectural drawing in Italy'),'',true)}<span>${t('观察的另一种方式','A different way of seeing')} ↗</span></a>
      <span class="hero-note">drawn to<br><i>the everyday.</i><svg viewBox="0 0 100 50" aria-hidden="true"><path d="M5 5 Q80 0 81 37 M66 29 L81 40 L94 27"/></svg></span></div>
    </div>
    <div class="hero-bottom"><span>${t('建筑设计与环境研究','ARCHITECTURE & ENVIRONMENTAL DESIGN')}</span><span class="hero-bottom-right">SELECTED WORKS <span>↓</span></span></div>
  </section>
  <section class="work-section section-pad" id="work" aria-labelledby="work-heading">
    <div class="section-eyebrow"><span>01 / ${t('项目索引','PROJECT INDEX')}</span><span>2022 — 2025</span></div>
    <div class="work-heading-row"><h2 id="work-heading">${t('精选作品','Selected work')}<sup>(08)</sup><span class="serif-word">Selected.</span></h2><p>${t('从建筑到城市，从材料到日常。<br>八个关于空间与公共生活的探索。','From buildings to cities. From materials to everyday life.<br>Eight explorations of space and the public realm.')}</p></div>
    <div class="work-toolbar"><div class="filters" role="group" aria-label="${t('筛选作品','Filter projects')}"><button data-filter="all" aria-pressed="true">${t('全部','All')} <sup>08</sup></button><button data-filter="architecture" aria-pressed="false">${t('建筑设计','Architecture')} <sup>04</sup></button><button data-filter="research" aria-pressed="false">${t('研究与叙事','Research & narrative')} <sup>03</sup></button><button data-filter="drawing" aria-pressed="false">${t('手绘','Sketchbook')} <sup>01</sup></button></div><span class="work-view-label">${t('点击项目，进入故事','OPEN A PROJECT. EXPLORE THE STORY.')} ↗</span></div>
    <div id="results-announcement" class="sr-only" role="status" aria-live="polite"></div><div class="work-grid" id="work-grid"></div>
  </section>
  <section class="about-section section-pad" id="about" aria-labelledby="about-heading">
    <div class="section-eyebrow"><span>02 / ${t('关于我','ABOUT ME')}</span><span>XINYU (AVALIN) LI</span></div>
    <div class="about-grid"><div class="about-visual">${picture('italy-coast',t('厄尔巴岛海岸现场照片','Field photograph of the coast of Elba'))}<span class="about-photo-caption">FIELD NOTES / ELBA, ITALY</span><div class="about-stamp">AL<br><small>IN PROGRESS,<br>ALWAYS.</small></div></div>
    <div class="about-copy"><span class="eyebrow-accent">${t('你好，我是李心宇。','HELLO, I’M AVALIN.')}</span><h2 id="about-heading">${t('从观察出发，<br>让想法成为空间。','A curious eye.<br>A spatial mind.')}</h2><p>${t('我的创作围绕建筑、环境与公共生活展开。我通过场地观察、模型制作、绘图和视觉叙事，探索空间如何回应不同的人、文化与日常活动。','My work explores architecture, environment, and public life. Through site observation, model-making, drawing, and visual storytelling, I investigate how spaces can respond to different people, cultures, and everyday activities.')}</p><p>${t('我毕业于雪城大学建筑学院，目前在宾夕法尼亚大学 Weitzman 设计学院攻读环境建筑设计硕士，将建筑设计的兴趣延伸到建筑性能、环境系统与可持续设计。','I graduated from Syracuse University School of Architecture and am pursuing a Master in Environmental Building Design at the University of Pennsylvania’s Weitzman School of Design, extending my interests into building performance, environmental systems, and sustainable design.')}</p><a class="underline-link" href="assets/Xinyu-Li-CV.pdf" download>${t('下载完整简历','Download my CV')} ${arrow}</a></div></div>
    <div class="resume-grid"><div class="education"><h3>${t('教育背景','Education')} <span>↘</span></h3><article><time>2026 — 2027</time><h4>University of Pennsylvania</h4><p>Stuart Weitzman School of Design</p><p>${t('环境建筑设计硕士','Master in Environmental Building Design')}</p></article><article><time>2021 — 2026</time><h4>Syracuse University</h4><p>School of Architecture · B.Arch</p><p>${t('GPA 3.70 / 4.00 · 连续 10 学期院长嘉许名单','GPA 3.70 / 4.00 · Dean’s List, 10 semesters')}</p></article><article><time>2024</time><h4>${t('佛罗伦萨 & 纽约','Florence & New York City')}</h4><p>${t('雪城大学海外学习与城市项目','Syracuse study abroad and city programs')}</p></article></div>
    <div class="experience"><h3>${t('实践经历','Experience')} <span>↘</span></h3>${EXPERIENCE.map((item,index)=>`<details ${index===0?'open':''}><summary><span><small>${item.date.replace('PRESENT',t('至今','PRESENT'))}</small><strong>${item.name}</strong><em>${pair(item.role)} · ${pair(item.location)}</em></span><b aria-hidden="true">+</b></summary><p>${pair(item.text)}</p></details>`).join('')}</div></div>
    <div class="skills-row"><span>${t('创作工具','TOOLS OF THE TRADE')}</span><p>Rhino / AutoCAD / V-Ray / Enscape / D5 Render / Adobe CC / 3D Printing</p></div>
    <div class="about-extras"><p><strong>${t('在建筑之外','Beyond architecture')}</strong>${t('WeMediaLab 副主席（2022–2025）· 雪城大学项目助理与 3D 打印实验室助理 · YAC 2023「Home After Crisis」竞赛参与者','Vice President, WeMediaLab (2022–2025) · Syracuse program and 3D printing lab assistant · YAC 2023 “Home After Crisis” competition participant')}</p><span>${t('语言：中文 / 英语 / 意大利语','Languages: Mandarin / English / Italian')}</span></div>
  </section>`;
  disposeBrandMotion=mountBrandMotion(document.getElementById('home-brand-motion'),document.getElementById('brand-motion-toggle'),{play:t('播放动画 ▷','Play animation ▷'),pause:t('暂停动画 Ⅱ','Pause animation Ⅱ')});
  renderCards();
  document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{activeFilter=button.dataset.filter;renderCards();}));
}

function galleryFigure(item, index) {
  const caption = item[language==='zh'?1:2];
  return `<figure class="gallery-item ${item[0].startsWith('board')?'gallery-wide':''}"><button data-image="${index}" aria-label="${t('放大','Enlarge')} — ${caption}">${picture(item[0],caption)}<span class="enlarge-hint">↗</span></button><figcaption><span>${caption}</span><span>${String(index).padStart(2,'0')}</span></figcaption></figure>`;
}

function projectGallery(project) {
  if (project.chapters) return renderEditorialGallery(project);
  if (!project.gallerySections) return `<section class="project-gallery section-pad" aria-label="${t('项目图像与图纸','Project images and drawings')}">${project.gallery.map((item,i)=>galleryFigure(item,i+1)).join('')}</section>`;
  let offset = 1;
  const sections = project.gallerySections.map((section, i) => {
    const items = section.items.map(item => galleryFigure(item, offset++)).join('');
    const heading = `<span class="gallery-chapter">${String(i+1).padStart(2,'0')} /</span><h2 tabindex="-1" id="gallery-title-${section.id}">${pair(section.title)}</h2><span class="gallery-total">${String(section.items.length).padStart(2,'0')} ${t('张','IMAGES')}</span>`;
    if (section.collapsed) return `<details class="gallery-collection gallery-spreads" id="gallery-${section.id}"><summary class="gallery-section-heading">${heading}<span class="gallery-toggle" aria-hidden="true">+</span></summary><div class="project-gallery curated-grid">${items}</div></details>`;
    return `<section class="gallery-collection" id="gallery-${section.id}" aria-labelledby="gallery-title-${section.id}"><div class="gallery-section-heading">${heading}</div><div class="project-gallery curated-grid">${items}</div></section>`;
  }).join('');
  return `<div class="curated-archive section-pad"><nav class="gallery-index" aria-label="${t('项目图像目录','Project image index')}"><span>${t('浏览项目','EXPLORE THE PROJECT')}</span><div>${project.gallerySections.map(section=>`<button type="button" data-gallery-jump="${section.id}">${pair(section.title)} <span aria-hidden="true">↓</span></button>`).join('')}</div></nav>${sections}</div>`;
}

function renderProject(project) {
  document.title=`${project.title} — Xinyu (Avalin) Li`;
  const isComic = project.id === 'bungee-space';
  lightboxItems = isComic ? comicPages : [[project.cover,project.zh,project.title],...project.gallery];
  const next=PROJECTS[(PROJECTS.indexOf(project)+1)%PROJECTS.length];
  main.innerHTML=`<article class="project-page">
    <section class="project-heading section-pad"><div class="project-breadcrumb"><a href="#/work">← ${t('全部作品','All projects')}</a><span>${project.no} / 08 — ${pair(labels[project.category])}</span></div><h1>${language==='zh'?project.zh:project.title}</h1><div class="project-subtitle"><span>${language==='zh'?project.title:pair(project.subtitle)}</span><span>${project.year}</span></div></section>
    <div class="project-info section-pad"><div><small>${t('地点','LOCATION')}</small><span>${pair(project.location)}</span></div><div><small>${t('时间','WHEN')}</small><span>${pair(project.season)}</span></div><div><small>${t('团队','CREDITS')}</small><span>${pair(project.team)}</span></div></div>
      ${isComic ? '' : `<div class="project-cover-wrap ${['soil','commons','italy'].includes(project.cover)?'sheet-cover':''}"><button class="detail-cover" data-image="0" aria-label="${t('放大项目主图','Enlarge project cover')}">${['soil','commons','italy'].includes(project.cover)?framedImage(project.cover,language==='zh'?project.zh:project.title):picture(project.cover,language==='zh'?project.zh:project.title,'cover-'+project.cover,true)}<span class="enlarge-hint">${t('放大查看','VIEW IMAGE')} ↗</span></button></div>`}
    <section class="project-story section-pad"><div><span class="eyebrow-accent">${t('项目概述','THE PROJECT')}</span><h2>${pair(project.subtitle)}</h2><div class="project-tags">${project.tags.map(tag=>`<span>${tag}</span>`).join('')}</div></div><div class="project-body">${project.paragraphs.map(p=>`<p>${pair(p)}</p>`).join('')}</div></section>
    ${isComic ? comicShell() : projectGallery(project)}
    <a class="next-project section-pad" href="#/project/${next.id}"><span>${t('下一个项目','NEXT PROJECT')} / ${next.no}</span><strong>${language==='zh'?next.zh:next.title}</strong><b aria-hidden="true">↗</b></a>
  </article>`;
  document.querySelectorAll('[data-image]').forEach(button=>button.addEventListener('click',()=>openLightbox(Number(button.dataset.image))));
  document.querySelectorAll('[data-gallery-jump]').forEach(button=>button.addEventListener('click',()=>{
    const collection = document.getElementById(`gallery-${button.dataset.galleryJump}`);
    if (collection.tagName === 'DETAILS') collection.open = true;
    collection.querySelector('h2').focus({preventScroll:true});
    collection.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
  }));
  if(isComic) setupComic();
}

function openLightbox(index) {
  lightboxTrigger=document.activeElement;
  lightboxIndex=index;
  updateLightbox();
  dialog.hidden=false;
  ['header','main','footer'].forEach(id=>document.getElementById(id).inert=true);
  document.body.classList.add('modal-open');
  document.getElementById('lightbox-close').focus();
}
function closeLightbox() {
  dialog.hidden=true;
  ['header','main','footer'].forEach(id=>document.getElementById(id).inert=false);
  document.body.classList.remove('modal-open');
  lightboxTrigger?.focus();
}
function updateLightbox() {
  const item=lightboxItems[lightboxIndex];
  const img=document.getElementById('lightbox-image');
  const frame=document.getElementById('lightbox-frame');
  const meta=typeof IMAGE_LAYOUT!=='undefined'?IMAGE_LAYOUT[item[0]]:null;
  frame.querySelector('.map-label-overlay')?.remove();
  img.style.cssText='';frame.style.cssText='';frame.className='';
  if(meta){
    const {ratio,style}=imageGeometry(meta);
    frame.className='lightbox-cropped';
    frame.style.cssText=`--image-ratio:${ratio};aspect-ratio:${ratio};`;
    img.style.cssText=`position:absolute;height:auto;max-width:none;max-height:none;${style}`;
    frame.insertAdjacentHTML('beforeend',mapLabelOverlay(item[0],`position:absolute;height:auto;max-width:none;max-height:none;${style}`));
  }
  img.src=asset(meta?meta.source:item[0]);img.alt=item[language==='zh'?1:2];
  document.getElementById('lightbox-caption').textContent=img.alt;
  document.getElementById('lightbox-count').textContent=`${String(lightboxIndex+1).padStart(2,'0')} / ${String(lightboxItems.length).padStart(2,'0')}`;
}
function stepImage(direction) {lightboxIndex=(lightboxIndex+direction+lightboxItems.length)%lightboxItems.length;updateLightbox();}
document.getElementById('lightbox-close').addEventListener('click',closeLightbox);
document.getElementById('lightbox-prev').addEventListener('click',()=>stepImage(-1));
document.getElementById('lightbox-next').addEventListener('click',()=>stepImage(1));
dialog.addEventListener('keydown',event=>{
  if(event.key==='Escape'){event.preventDefault();closeLightbox();}
  if(event.key==='ArrowRight')stepImage(1);
  if(event.key==='ArrowLeft')stepImage(-1);
  if(event.key==='Tab'){
    const controls=Array.from(dialog.querySelectorAll('button'));
    const index=controls.indexOf(document.activeElement);
    event.preventDefault();
    controls[(index+(event.shiftKey?-1:1)+controls.length)%controls.length].focus();
  }
});

function render(scroll=true) {
  disposeBrandMotion?.();disposeBrandMotion=null;
  comicTurnId++;comicTurning=false;
  if(!dialog.hidden)closeLightbox();
  document.documentElement.lang=language==='zh'?'zh-CN':'en';
  document.body.dataset.lang=language;
  renderHeader();renderFooter();
  const route=location.hash.replace(/^#\/?/,'').split('/');
  const project=route[0]==='project'&&PROJECTS.find(p=>p.id===route[1]);
  if(project) renderProject(project); else renderHome();
  if(scroll) {
    if(!project&&['work','about','contact'].includes(route[0])) requestAnimationFrame(()=>document.getElementById(route[0]).scrollIntoView({behavior:'instant',block:'start'}));
    else window.scrollTo({top:0,behavior:'instant'});
  }
}
window.addEventListener('hashchange',()=>render());
document.addEventListener('click',event=>{
  if(event.target.closest('.skip-link')){event.preventDefault();main.focus();main.scrollIntoView();return;}
  const link=event.target.closest('a[href^="#/"]');
  if(link&&link.hash===location.hash) {event.preventDefault();render();}
});
render();


