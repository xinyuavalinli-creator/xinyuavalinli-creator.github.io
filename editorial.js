/* Chapters follow the portfolio's sequence; image roles are explicitly authored. */
const editorialRow = (layout, ...images) => ({layout, images});
const editorialChapter = (id, title, text, rows, more=[]) => ({id,title,text,rows,more});
const EDITORIAL_ITEMS = [
 ['story-akw-context','阿克韦萨斯内：河流、聚落与场地','Akwesasne: river, settlement, and site'],
 ['story-akw-concept','围绕共同中心的空间原型','Spatial prototypes around a shared center'],
 ['story-akw-forest','从林地到建筑的材料循环','Material cycles from woodland to building'],
 ['story-muro-season','冬季与夏季的人口变化','Seasonal population change'],
 ['story-muro-demographics','居民年龄结构变化','Changes in the resident age structure'],
 ['story-muro-ruin','风暴之后的海岸遗迹','Coastal remains after the storm'],
 ['story-muro-section','地形、墙体与临海空间剖面','Section through terrain, walls, and waterfront rooms'],
 ['story-muro-plan','沿海总平面','Coastal master plan'],
 ['story-hudson-section','居住单元与共享空间透视剖面','Perspective section through dwellings and shared spaces'],
 ['story-hudson-plans','首层至四层平面组织','Plans from the ground to the fourth floor'],
 ['story-aac-section','随坡地延展的连续剖面','Continuous section along the hillside'],
];
const EDITORIAL = {
 'akwesasne': [
  editorialChapter('context',['从共同的中心出发','A shared center'],['河流与林地界定场地，集会、手工艺和传统聚落提供空间原型。','The river and woodland define the site; gathering, craft, and settlement traditions inform its spatial organization.'],[
   editorialRow('duet','story-akw-context','story-akw-concept'),
  ],['archive-akw-massing']),
  editorialChapter('forest',['森林成为建筑的一部分','The forest becomes architecture'],['保留林地边缘，将场地木材用于建造；展览与学习空间在树木之间展开。','The woodland edge is retained and site timber enters the construction cycle. Exhibition and learning spaces open toward the trees.'],[
   editorialRow('pair','archive-akw-exhibition-section','archive-akw-library-section'),
   editorialRow('panorama','story-akw-forest'),
  ]),
  editorialChapter('program',['三个展亭，一条共享路径','Three pavilions, one shared path'],['弧形走廊串联中央展厅、行政空间与图书馆，形成从公共到安静的空间层次。','A curved corridor connects the exhibition pavilion, administration, and library, moving from the public center toward quieter spaces.'],[
   editorialRow('duet','archive-akw-site','archive-akw-plans'),
   editorialRow('pair','akwesasne-gallery','akwesasne-interior'),
  ],['archive-akw-program','archive-akw-section','archive-akw-elevation']),
  editorialChapter('envelope',['让围护回应日常与气候','An envelope for everyday life'],['可开启界面连接内外庭院，环境系统嵌入木结构与楼板之间。','Operable edges connect the interior and gardens, while environmental services fit between the timber frame and floor layers.'],[
   editorialRow('reverse','archive-akw-services','archive-akw-envelope'),
  ],['archive-akw-joint','archive-akw-base']),
  editorialChapter('structure',['从整体框架到一个节点','From frame to connection'],['以木框架和板材建立整体秩序，再通过节点模型追踪构件之间的连接。','Timber frames and panels establish the overall order. Connection models bring the study down to the scale of individual components.'],[
   editorialRow('duet','archive-akw-structure','archive-akw-frame'),
  ]),
 ],
 'muro-e-mare': [
  editorialChapter('context',['一座小镇，两种季节','One town, two seasons'],['常住居民的日常与夏季游客的到来，使海岸需要兼顾稳定的社区生活和短暂的停留。','Resident routines and summer visitors ask the waterfront to accommodate both lasting community life and temporary stays.'],[
   editorialRow('duet','archive-muro-context','story-muro-ruin'),
  ],['story-muro-season','story-muro-demographics','archive-muro-coast','archive-muro-stone']),
  editorialChapter('wall',['把边界变成可以停留的地方','An inhabitable edge'],['挡土墙向场地内部延展，墙与墙之间形成通道，串联入口、停留与看海的片刻。','The retaining wall extends into the site. A passage between walls links entry, pause, and views toward the sea.'],[
   editorialRow('duet','archive-muro-walls','archive-muro-sequence'),
   editorialRow('panorama','story-muro-section'),
  ]),
  editorialChapter('life',['面向海的日常生活','Everyday life facing the sea'],['棋牌室、咖啡馆与临海平台回应不同的使用节奏，让交往沿着海岸展开。','A card-playing room, café, and waterfront platforms support different rhythms of use along the coast.'],[
   editorialRow('hero','muro-interior'),
   editorialRow('duet','muro-courtyard','archive-muro-activities'),
   editorialRow('panorama','story-muro-plan'),
  ]),
  editorialChapter('movement',['沿墙游走，回到地形','Following the wall through the terrain'],['入口顺坡而下，路径在不同标高间往返。模型把墙、地形与行走联系起来。','The entry descends with the slope and the route moves between levels. Models bring wall, terrain, and movement together.'],[
   editorialRow('muro-pair','archive-muro-site','muro-section-model'),
  ],['muro-model']),
 ],
 'hudson-overlook': [
  editorialChapter('city',['从城市的生活方式开始','Beginning with life in Hudson'],['场地研究连接当地居民与短期访客的居住需求，公共功能和交通成为竖向组织的骨架。','Site research connects the housing needs of local residents and short-term visitors. Shared programs and circulation organize the building vertically.'],[
   editorialRow('duet','archive-hudson-site','archive-hudson-program'),
  ],['archive-hudson-circulation']),
  editorialChapter('modules',['可组合的居住单元','Dwellings that combine'],['单层与复式单元纳入同一模块体系，结构与居住空间可以按需求组合。','Single-level and duplex dwellings share a modular system, allowing structure and living space to be combined in different arrangements.'],[
   editorialRow('duet','archive-hudson-assembly','archive-hudson-typologies'),
  ]),
  editorialChapter('living',['在单元之间，留出共享空间','Shared space between dwellings'],['从首层入口到居住楼层，平面与透视剖面展示独处、交往和通行如何并存。','From the ground-floor entrance to the residential levels, plans and the perspective section show privacy, encounter, and movement together.'],[
   editorialRow('duet','story-hudson-section','story-hudson-plans'),
  ]),
  editorialChapter('facade',['用模型推敲结构与表皮','Developing frame and facade through models'],['从整体框架转向立面构件，再以局部模型观察支撑、楼板与围护的连接。','The study moves from the overall frame to facade components, then to the connections between bracing, floors, and enclosure.'],[
   editorialRow('duet','archive-hudson-frame','archive-hudson-envelope'),
   editorialRow('pair','hudson-structure','archive-hudson-bracing'),
  ],['archive-hudson-units','hudson-detail','hudson']),
 ],
 'aac-hillside': [
  editorialChapter('terrain',['把山谷转译为建筑','Translating a valley into architecture'],['从辛辛那提的坡地出发，将山谷、脊线与三角结构转化为校园的空间秩序。','The Cincinnati hillside becomes a starting point for translating valleys, ridgelines, and triangular structure into a campus.'],[
   editorialRow('duet','archive-aac-context','aac-concept'),
  ],['archive-aac-program']),
  editorialChapter('ascent',['一段连续的上行路径','A continuous ascent'],['长坡道串联工作室与公共空间。体量嵌入山坡，空间沿途收紧、展开。','A long ramp connects studios and shared spaces. Volumes enter the hillside, creating moments of compression and release along the route.'],[
   editorialRow('hero','aac'),
   editorialRow('panorama','archive-aac-massing'),
   editorialRow('panorama','story-aac-section'),
   editorialRow('pair','aac-corridor','archive-aac-stair'),
  ],['archive-aac-courtyard','archive-aac-sections']),
  editorialChapter('structure',['结构随地形生长','Structure rising with the terrain'],['场地模型展示建筑如何落在坡地上；平面与分解轴测进一步揭示学习空间和木构体系的关系。','The site model shows how the building meets the slope. Plans and the exploded axonometric reveal the relationship between learning spaces and the timber system.'],[
   editorialRow('duet','archive-aac-model-side','archive-aac-structure'),
   editorialRow('pair','archive-aac-plan-a','archive-aac-plan-b'),
  ],['archive-aac-model-top']),
 ],
 'clean-soil-bank': [
  editorialChapter('cycle',['土壤进入建造循环','Soil enters the building cycle'],['分离、处理与打印，将土壤从城市材料转化为逐步生长的建筑系统。','Separation, processing, and printing transform urban soil into a building system that grows incrementally.'],[
   editorialRow('portrait','archive-soil-system'),
  ]),
  editorialChapter('time',['一座随时间变化的塔','A tower changing over time'],['透视剖面揭示垂直系统，时间序列则展示建造、使用与再次循环的关系。','The perspective section reveals the vertical system; the time sequence connects construction, occupation, and renewed material cycles.'],[
   editorialRow('duet','soil-section','archive-soil-time'),
  ]),
  editorialChapter('ground',['把城市地面还给公共生活','Returning urban ground to public life'],['地面随土壤塔的变化重新组织，为植物生长、通行与临时活动留下空间。','The ground is reorganized as the tower changes, making room for planting, movement, and temporary activities.'],[
   editorialRow('reverse','archive-soil-ground','soil-site'),
  ]),
 ],
 'italy-sketchbook': [
  editorialChapter('proportion',['先看比例，再进入空间','Proportion before space'],['从平面秩序到穹顶内部，用线条追踪尺度与视线。','From the order of a plan to the interior of a dome, drawing follows scale and sightlines.'],[
   editorialRow('reverse','archive-italy-plan','archive-italy-interior'),
  ]),
  editorialChapter('place',['从远景走向城市细部','From distant views to urban detail'],['地形、街道与建筑片段，构成由远及近的观察。','Terrain, streets, and architectural fragments form a sequence of observations from far to near.'],[
   editorialRow('duet','archive-italy-landscape','italy-drawing-1'),
  ]),
  editorialChapter('interior',['让观察进入构造','Observation becoming detail'],['平面、剖面和室内透视互相补充，把旅行中的印象转化为可以反复阅读的记录。','Plans, sections, and interior perspectives complement one another, turning travel impressions into a record to revisit.'],[
   editorialRow('pair','archive-italy-sections','archive-italy-elements'),
   editorialRow('portrait','italy-drawing-2'),
   editorialRow('pair','italy-drawing-3','italy-drawing-4'),
  ]),
 ],
 'islands-of-commons': [
  editorialChapter('publicness',['名义上的公共空间，实际如何使用？','How public is a public space?'],['从分区与公共空间的关系出发，审视 245 Park Avenue 的空间条件。','The relationship between zoning and public space frames a closer reading of 245 Park Avenue.'],[
   editorialRow('portrait','commons-map'),
  ]),
  editorialChapter('access',['高差如何改变可达性','How grade changes access'],['剖面把台阶、路径和停留空间放在一起，揭示日常到达的障碍。','The section brings stairs, routes, and places to pause together, revealing barriers to everyday access.'],[
   editorialRow('panorama','commons-section'),
  ]),
  editorialChapter('history',['把当下放回城市历史','Placing the present in urban history'],['通过历史地图与街区形态对照，理解公共空间如何形成，又如何变化。','Historical maps and block forms trace how the public space emerged and changed.'],[
   editorialRow('pair','commons-history','archive-commons-history'),
  ]),
 ],
};

for (const project of PROJECTS) {
 if (!EDITORIAL[project.id]) continue;
 const byName = new Map([...project.gallery, ...EDITORIAL_ITEMS].map(item=>[item[0],item]));
 project.chapters = EDITORIAL[project.id];
 const ordered = project.chapters.flatMap(c=>[...c.rows.flatMap(r=>r.images),...c.more]);
 const used = new Set(ordered);
 project.referenceImages = project.gallery.filter(item=>!used.has(item[0]));
 project.gallery = [...ordered.map(name=>byName.get(name)),...project.referenceImages];
 project.galleryByName = new Map(project.gallery.map((item,i)=>[item[0],{item,index:i+1}]));
}

function imageGeometry(m) {
 const [x,y,w,h]=m.crop;
 if(m.rotate===90) return {ratio:m.height*h/(m.width*w),style:`width:${100*m.width/(m.height*h)}%;left:${100*(y+h)/h}%;top:${-100*x/w}%;transform:rotate(90deg);transform-origin:0 0;`};
 return {ratio:m.width*w/(m.height*h),style:`width:${100/w}%;left:${-100*x/w}%;top:${-100*y/h}%;`};
}
function framedImage(name, caption, sizes='(max-width: 700px) 92vw, 80vw') {
 const m = IMAGE_LAYOUT[name];
 if (!m) return picture(name,caption);
 const {ratio,style}=imageGeometry(m);
 const responsive=m.smallWidth?`srcset="assets/${m.source}-small.webp ${m.smallWidth}w, assets/${m.source}.webp ${m.width}w" sizes="${sizes}"`:'';
 return `<span class="image-frame" style="aspect-ratio:${ratio};--image-ratio:${ratio}"><img src="assets/${m.source}.webp" ${responsive} width="${m.width}" height="${m.height}" alt="${caption}" loading="lazy" decoding="async" style="${style}">${mapLabelOverlay(name,style)}</span>`;
}
function mapLabelOverlay(name,style) {
 return name==='story-akw-context'?`<img class="map-label-overlay" src="assets/story-akw-context-labels.png" alt="" aria-hidden="true" width="2027" height="3000" style="${style}">`:'';
}
function editorialFigure(project,name) {
 const {item,index}=project.galleryByName.get(name),caption=item[language==='zh'?1:2];
 return `<figure class="story-figure"><button data-image="${index}" aria-label="${t('放大','Enlarge')} — ${caption}">${framedImage(name,caption)}<span class="enlarge-hint">↗</span></button><figcaption><span>${caption}</span><span>${String(index).padStart(2,'0')}</span></figcaption></figure>`;
}
function renderEditorialGallery(project) {
 const chapters=project.chapters.map((c,i)=>`<section class="editorial-chapter" id="gallery-${c.id}" aria-labelledby="gallery-title-${c.id}"><header class="chapter-intro"><span class="chapter-number">${String(i+1).padStart(2,'0')}</span><div><h2 id="gallery-title-${c.id}" tabindex="-1">${pair(c.title)}</h2><p>${pair(c.text)}</p></div></header>${c.rows.map(r=>`<div class="story-row story-row--${r.layout}">${r.images.map(name=>editorialFigure(project,name)).join('')}</div>`).join('')}${c.more.length?`<details class="chapter-studies"><summary>${t('展开相关图纸与研究','Related drawings & studies')} <span>${String(c.more.length).padStart(2,'0')} ＋</span></summary><div class="study-grid">${c.more.map(name=>editorialFigure(project,name)).join('')}</div></details>`:''}</section>`).join('');
 const references=project.referenceImages.length?`<details class="chapter-studies portfolio-references" id="gallery-references"><summary>${t('作品集图版','Portfolio spreads')} <span>${String(project.referenceImages.length).padStart(2,'0')} ＋</span></summary><div class="reference-grid">${project.referenceImages.map(item=>editorialFigure(project,item[0])).join('')}</div></details>`:'';
 return `<div class="editorial-project section-pad"><nav class="chapter-index" aria-label="${t('阅读顺序','Reading sequence')}"><span>${t('项目脉络','PROJECT SEQUENCE')}</span><div>${project.chapters.map((c,i)=>`<button data-gallery-jump="${c.id}"><small>${String(i+1).padStart(2,'0')}</small>${pair(c.title)}<span aria-hidden="true">↘</span></button>`).join('')}</div></nav>${chapters}${references}</div>`;
}
