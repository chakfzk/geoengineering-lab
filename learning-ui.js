/* Readable diagram labels, restrained keyword emphasis, and photo observation guides. */
function setHighlightedText(element,text,keywords){
 element.replaceChildren();
 const words=[...new Set(keywords)].sort((a,b)=>b.length-a.length),used=new Set();
 let start=0;
 while(start<text.length){
  let at=-1,word='';
  for(const key of words){const next=text.indexOf(key,start);if(next>=0&&(at<0||next<at)){at=next;word=key;}}
  if(at<0){element.append(document.createTextNode(text.slice(start)));break;}
  element.append(document.createTextNode(text.slice(start,at)));
  if(used.size<3&&!used.has(word)){const strong=document.createElement('strong');strong.textContent=word;element.append(strong);used.add(word);}
  else element.append(document.createTextNode(word));
  start=at+word.length;
 }
}
(()=>{
const shortNames={
 '표층에서 자라는 플랑크톤':'식물 플랑크톤',
 '같은 물의 양을 더 작은 물방울로 나눔':'구름 속 물방울',
 '땅 위에 세운 분무탑':'분무탑',
 '물방울이 모여 생긴 구름':'새 구름',
 '높은 하늘의 에어로졸 입자층':'에어로졸층',
 '입자를 뿌리는 비행기':'분사 비행기',
 '이미 있는 해상 구름':'기존 해상 구름',
 '햇빛을 반사하는 흰 지붕':'흰 지붕',
 '깊이 가라앉는 탄소':'가라앉는 탄소',
 '공기에서 잡는 필터':'포집 장치',
 '깊은 바다의 영양분':'심층수의 영양분'
};
const overlaps=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
Features.layoutDiagramNames=function(){
 const host=$('diagram-labels'),stage=$('stage'),svg=$('diagram').querySelector('svg');
 host.replaceChildren();if(!svg)return;
 const frame=stage.getBoundingClientRect(),w=stage.clientWidth,h=stage.clientHeight,items=[];
 const add=(name,anchor,bounds)=>{
  name=shortNames[name]||name;
  if(!name||name==='CO₂'||name==='탄소'||name.length>24||name.startsWith('거울에'))return;
  if(items.some(item=>item.name===name))return;
  items.push({name,anchor,bounds});
 };
 // Explicit element anchors: never use a label's former text position as its target.
 const narrow=stage.clientWidth<600,W=narrow?440:800;
 const definitions={
  0:[['태양',90,260],['지구',660,260],...(state.compare||state.strength===0?[]:[['우주 반사경',358,265]])],
  1:[['대류권',W*.84,400],['성층권',W*.84,125],['살포 비행기',W*.22,197],...(state.compare||state.strength===0?[]:[['에어로졸 입자층',W*.57,225]])],
  2:[['사막 지표',710,405],...(state.compare||state.strength===0?[]:[['사막 반사판',183,339]])],
  3:[['분무탑',150,260],...(state.compare||state.strength===0?[]:[['새 구름',415,180]])],
  4:[['분무선',145,280],['기존 해상 구름',415,180]],
  6:[['흰 지붕',255,295],['어두운 지붕',515,295]],
  8:[['공기 속 CO₂',W*.13,235],['포집 장치',W*.28+W*.09*.39,245],['모은 CO₂',W*.69,225],['지하 저장',W*.75,475],['포집되지 않은 CO₂',W*.8,115]],
  10:[...(state.mode==='iron'?[['철분 공급선',W*.19,255]]:[['심층수 펌프',W*.17+7,345],['심층수의 영양분',W*.14,452]]),['식물 플랑크톤',W*.45,307],['사체·배설물의 응집',W*.56,376],['일부 유기물 입자의 침강',W*.59,422],['다시 순환하는 탄소',W*.8,334]]
 };
 if(state.id===6){const a=(state.compare?0:state.strength)/100,n=Math.round(a*5);definitions[6]=[];if(n)definitions[6].push(['흰 지붕',255,295]);if(n<5)definitions[6].push(['어두운 지붕',255+n*65,295]);}
 svg.querySelectorAll('text').forEach(text=>{if(!['CO₂','탄소'].includes(text.textContent.trim()))text.classList.add('diagram-name');});
 const targets=definitions[state.id];
 if(targets){
  let matrix=svg.getScreenCTM();
  // Legacy diagrams scale their children on narrow screens, custom diagrams change viewBox.
  if(narrow&&![1,8,10].includes(state.id)){const child=[...svg.children].find(e=>e.hasAttribute('transform'));if(child)matrix=child.getScreenCTM();}
  const sizes={'태양':[86,86],'지구':[120,120],'우주 반사경':[20,Math.max(10,state.strength*1.4)],'살포 비행기':[80,40],'에어로졸 입자층':[W*.34,50],'사막 반사판':[46,8],'분무탑':[60,150],'새 구름':[160,95],'기존 해상 구름':[180,105],'분무선':[110,55],'흰 지붕':[60,10],'어두운 지붕':[60,10],'포집 장치':[W*.09*.78,120],'모은 CO₂':[44,65],'지하 저장':[65,32],'심층수 펌프':[15,150],'사체·배설물의 응집':[18,16]};
  for(const [name,x,y] of targets){const point=new DOMPoint(x,y).matrixTransform(matrix),size=sizes[name];let bounds=null;if(size){const tl=new DOMPoint(x-size[0]/2,y-size[1]/2).matrixTransform(matrix),br=new DOMPoint(x+size[0]/2,y+size[1]/2).matrixTransform(matrix);bounds={x:tl.x-frame.x-stage.clientLeft,y:tl.y-frame.y-stage.clientTop,w:br.x-tl.x,h:br.y-tl.y};}add(name,{x:point.x-frame.x-stage.clientLeft,y:point.y-frame.y-stage.clientTop},bounds);}
 }else{
  svg.querySelectorAll('.diagram-object').forEach(g=>{const box=g.getBBox(),m=g.getScreenCTM();if(!m||!box.width&&!box.height)return;const point=new DOMPoint(box.x+box.width/2,box.y+box.height/2).matrixTransform(m);add(g.getAttribute('aria-label'),{x:point.x-frame.x,y:point.y-frame.y},null);});
 }
 const ns='http://www.w3.org/2000/svg',leaders=document.createElementNS(ns,'svg');
 leaders.setAttribute('viewBox','0 0 '+w+' '+h);leaders.classList.add('diagram-leaders');host.append(leaders);
 const occupied=[];
 const tool=$('fullscreen').getBoundingClientRect();
 if(tool.width)occupied.push({x:tool.x-frame.x-6,y:tool.y-frame.y-6,w:tool.width+12,h:tool.height+12});
 if(!$('inset').hidden){const r=$('inset').getBoundingClientRect();occupied.push({x:r.x-frame.x-8,y:r.y-frame.y-8,w:r.width+16,h:r.height+16});}
 for(const item of items){
  const el=document.createElement('span');el.className='diagram-label';el.textContent=item.name;host.append(el);
  const lw=el.offsetWidth,lh=el.offsetHeight,a=item.anchor;
  const bound=item.bounds||{x:a.x,y:a.y,w:0,h:0};
  const candidates=[
   [a.x,bound.y-lh/2-10],[a.x,bound.y+bound.h+lh/2+10],
   [bound.x-lw/2-12,a.y],[bound.x+bound.w+lw/2+12,a.y],
   [a.x,lh/2+12],[a.x,h-lh/2-12]
  ];
  for(let y=lh/2+10;y<h-lh/2-5;y+=Math.max(lh+10,42))for(let x=lw/2+10;x<w-lw/2-5;x+=Math.max(lw+10,90))candidates.push([x,y]);
  let best=null,score=Infinity;
  for(let [cx,cy] of candidates){
   cx=Math.max(lw/2+7,Math.min(w-lw/2-7,cx));cy=Math.max(lh/2+7,Math.min(h-lh/2-7,cy));
   const r={x:cx-lw/2-3,y:cy-lh/2-3,w:lw+6,h:lh+6};
   const collisions=occupied.filter(q=>overlaps(q,r)).length;
   const objectOverlap=items.filter(q=>q.bounds&&overlaps(q.bounds,r)).length;
   const cost=collisions*100000+objectOverlap*650+Math.hypot(cx-a.x,cy-a.y);
   if(cost<score){score=cost;best={cx,cy,r};}
  }
  if(!best)continue;
  occupied.push(best.r);el.style.left=best.cx+'px';el.style.top=best.cy+'px';
  const dx=a.x-best.cx,dy=a.y-best.cy;
  const scale=Math.min(dx?lw/2/Math.abs(dx):Infinity,dy?lh/2/Math.abs(dy):Infinity,1);
  const line=document.createElementNS(ns,'line');line.setAttribute('x1',a.x);line.setAttribute('y1',a.y);line.setAttribute('x2',best.cx+dx*scale);line.setAttribute('y2',best.cy+dy*scale);line.dataset.target=item.name;leaders.append(line);
  const dot=document.createElementNS(ns,'circle');dot.setAttribute('cx',a.x);dot.setAttribute('cy',a.y);dot.setAttribute('r','3');dot.dataset.target=item.name;leaders.append(dot);
  el.dataset.targetX=a.x;el.dataset.targetY=a.y;
 }
};
Features.syncHints=function(){
 const is2d=state.view==='front'||state.id===7,b=$('names-toggle');
 b.hidden=is2d;b.textContent=state.hints?'이름 숨기기':'이름 보이기';b.setAttribute('aria-pressed',state.hints);
 $('labels').hidden=is2d||!state.hints;$('stage').classList.remove('hints-off');$('stage').classList.toggle('names-on',is2d||state.hints);
 $('diagram-labels').hidden=!is2d;
 if(is2d)this.layoutDiagramNames();else $('diagram-labels').replaceChildren();
};
const guides={
 0:[{box:[.72,.10,.14,.24],text:'밝은 부분: 구름이 많아 햇빛을 반사하는 영역이에요.'},{box:[.46,.33,.16,.14],text:'어두운 부분: 구름 사이로 바다가 보이는 영역이에요. 같은 사진 안의 공간 비교이며 실험 전후 비교는 아니에요.'}],
 1:[{box:[.38,.45,.29,.20],text:'바다의 청록색 소용돌이 무늬가 플랑크톤 번성으로 색이 달라진 부분이에요.'}],
 2:[{box:[.015,.655,.97,.22],text:'아래의 1991년 사진에서 어두운 에어로졸 띠를 찾아 위의 1984년 사진과 비교해 보세요.'}],
 3:[{ellipse:[.774,.32,.035,.046],text:'오른쪽 사진의 밝은 지점은 거울에서 반사된 햇빛이 강하게 보이는 부분이에요. 태양열 발전소의 참고 사진이에요.'}],
 5:[{box:[.22,.42,.42,.19],text:'건물과 연결된 설비가 모인 매머드 구역을 보세요. 모형은 실제 배치를 그대로 옮긴 것이 아니라 포집·저장 과정을 단순화했어요.'}]
};
let activePhoto=null;
Features.drawPhotoGuide=function(){
 const image=$('photo-image'),overlay=$('photo-annotations'),list=$('photo-look'),regions=guides[activePhoto]||[];
 list.replaceChildren(...regions.map(item=>{const li=document.createElement('li');li.textContent=item.text;return li;}));
 if(!image.naturalWidth||!image.clientWidth)return;
 const scale=Math.min(image.clientWidth/image.naturalWidth,image.clientHeight/image.naturalHeight);
 const width=image.naturalWidth*scale,height=image.naturalHeight*scale,left=(image.clientWidth-width)/2,top=(image.clientHeight-height)/2;
 overlay.style.left=left+'px';overlay.style.top=top+'px';overlay.style.width=width+'px';overlay.style.height=height+'px';overlay.setAttribute('viewBox','0 0 1000 1000');overlay.setAttribute('preserveAspectRatio','none');
 overlay.replaceChildren();
 const wrap=image.parentElement;wrap.querySelectorAll('.photo-number').forEach(el=>el.remove());
 const ns='http://www.w3.org/2000/svg';
 regions.forEach((item,index)=>{
  const shape=document.createElementNS(ns,item.ellipse?'ellipse':item.polygon?'polygon':'rect');
  if(item.ellipse){const [x,y,rx,ry]=item.ellipse;shape.setAttribute('cx',x*1000);shape.setAttribute('cy',y*1000);shape.setAttribute('rx',rx*1000);shape.setAttribute('ry',rx*width/height*1000);}else if(item.polygon)shape.setAttribute('points',item.polygon.map(p=>p.map(n=>n*1000).join(',')).join(' '));
  else{const [x,y,w,h]=item.box;shape.setAttribute('x',x*1000);shape.setAttribute('y',y*1000);shape.setAttribute('width',w*1000);shape.setAttribute('height',h*1000);shape.setAttribute('rx','6');}
  shape.setAttribute('class','photo-focus'+([2,3].includes(activePhoto)?' red-focus':''));overlay.append(shape);

 });
};
const oldShow=Features.showPhoto.bind(Features);
Features.showPhoto=function(index){activePhoto=index;oldShow(index);this.drawPhotoGuide();};
const oldInit=Features.init.bind(Features);
Features.init=function(){
 oldInit();$('photo-image').addEventListener('load',()=>this.drawPhotoGuide());
 new ResizeObserver(()=>this.drawPhotoGuide()).observe($('photo-image'));
};
})();