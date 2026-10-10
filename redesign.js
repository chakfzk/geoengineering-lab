/* Six topics and the combined direct-air-capture/storage exhibit. */
(()=>{
const groups=[
 {name:'우주 반사',icon:'orbit',note:'우주에서 빛의 방향 바꾸기',ids:[0]},
 {name:'하늘 반사',icon:'cloud-sun',note:'입자와 구름으로 햇빛 돌려보내기',ids:[1,3,4]},
 {name:'지면 반사',icon:'building-2',note:'사막과 지붕을 더 밝게',ids:[2,6]},
 {name:'인공 나무 ‘매머드’ 설치',icon:'fan',note:'공기에서 잡아 지하에 저장하기',ids:[8]},
 {name:'철분 살포하기',icon:'sprout',note:'철분으로 플랑크톤 성장 돕기',ids:[10],mode:'iron'},
 {name:'심층수 끌어올리기',icon:'arrow-up-from-line',note:'깊은 물의 영양분을 표층으로',ids:[10],mode:'up'}
];
const originalData=Features.data.bind(Features);
Features.data=function(){const key=state.id===10&&state.mode==='up'?'up':String(state.id);return window.LAB_LESSONS[key]||originalData();};
Features.navigation=function(){
 const current=groups.find(g=>g.ids.includes(state.id)&&(!g.mode||g.mode===state.mode));
 const entries=state.id<8?groups.slice(0,3):groups.slice(3);
 $('techniques').replaceChildren(...entries.map(g=>{
  const b=document.createElement('button');b.type='button';
  const illustration=window.LAB_ILLUSTRATIONS[groups.indexOf(g)];
  b.innerHTML='<span class="menu-illustration" aria-hidden="true"><svg viewBox="0 0 220 130" fill="none" stroke="#658e88" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">'+illustration+'</svg></span><span class="topic-text">'+g.name+'</span>';
  b.classList.toggle('selected',g===current);b.setAttribute('aria-pressed',g===current);
  b.onclick=()=>{select(g.ids[0],g.mode||'iron');if($('navigation-dialog').open)$('navigation-dialog').close();};return b;
 }));
 $('number').textContent=(state.id<8?'태양빛 줄이기':'이산화탄소 잡기')+' - '+(current?.name||'');
 const sub=$('subtechniques');sub.hidden=!current||current.ids.length===1;
 const names={1:'성층권 에어로졸 살포',3:'새 구름 만들기',4:'기존 구름 밝히기',2:'사막 반사판',6:'흰 지붕'};
 sub.replaceChildren(...(current?.ids.length>1?current.ids:[]).map(id=>{
  const b=document.createElement('button');b.type='button';b.textContent=names[id];b.setAttribute('aria-pressed',id===state.id);b.onclick=()=>select(id);return b;
 }));
};
const oldInit=Features.init.bind(Features);
Features.init=function(){
 oldInit();
 this.photos.push({name:'아이슬란드 매머드 시설의 실제 전경',image:'assets/real-mammoth.jpg',description:'2023년 12월, 건설 중인 매머드를 촬영한 전경입니다. 공기 속 CO₂를 모으는 필터 시설과 처리 시설을 갖춘 곳이에요. 체험 장면은 공기 → 필터 → 지하 저장이라는 원리를 쉽게 보이도록 다시 구성했어요.',credit:'사진: Climeworks · Mammoth, December 2023',url:'https://climeworks.com/news/mammoth-taking-final-shape'});
 document.querySelector('.photo-head .eyebrow').textContent='실제 모습과 참고 사례';
 const drawer=$('navigation-dialog'),opener=$('menu-toggle');
 opener.onclick=()=>{drawer.showModal();opener.setAttribute('aria-expanded','true');document.body.classList.add('menu-open');};
 $('close-navigation').onclick=()=>drawer.close();
 drawer.addEventListener('close',()=>{opener.setAttribute('aria-expanded','false');document.body.classList.remove('menu-open');opener.focus();});
 drawer.addEventListener('click',e=>{if(e.target!==drawer)return;const r=drawer.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)drawer.close();});

};
LabVisuals.dac=function(a){
 scene.background=new THREE.Color(0xdce8ed);
 const layers=[0x9cad93,0xcab38c,0x746a62,0xa59986];
 for(let i=0;i<4;i++)this.edge(box(0,-1.32-i*.5,0,8.8,.49,3,layers[i]),0x685b4d);
 const fans=[];
 for(let i=0;i<3;i++){
  const x=-2.8+i*1.25,on=i<Math.ceil(a*3);
  this.edge(box(x,-.18,0,1.08,1.6,.9,on?0x486b70:0x879291));
  for(let j=0;j<7;j++)box(x,-.8+j*.2,.48,.97,.035,.035,0xc5d4d4);
  for(let j=0;j<2;j++){
   const fy=-.56+j*.74;
   mesh(new THREE.TorusGeometry(.26,.025,8,24),on?0x64bcb1:0x607775,x,fy,.51);
   ball(x,fy,.53,.065,0xd7e4de);
   const rotor=new THREE.Group();rotor.position.set(x,fy,.54);root.add(rotor);
   for(let k=0;k<4;k++){
    const blade=new THREE.Mesh(new THREE.BoxGeometry(.075,.37,.025),new THREE.MeshStandardMaterial({color:on?0xb4dace:0xadb7b1}));
    blade.position.set(Math.sin(k*Math.PI/2)*.095,Math.cos(k*Math.PI/2)*.095,0);blade.rotation.z=-k*Math.PI/2;rotor.add(blade);
   }
   if(on)fans.push(rotor);
  }
  this.tube([[x,-.98,.05],[x,-1.04,.95],[.95,-1.04,.95]],.06,0x6e949e);
 }
 if(a)dynamic.push(t=>fans.forEach((f,i)=>f.rotation.z=t*1.5+i*.3));
 this.edge(box(1.15,-.32,.2,.85,1.3,.8,0xc6d9d7));
 this.edge(cylinder(2.35,-.58,.1,.34,.9,0xe3d9bc));
 this.tube([[.95,-1.04,.95],[1.15,-.2,.95],[2.35,-.2,1],[2.85,-.65,1.65],[2.85,-2.7,1.65],[3.45,-2.7,1.65]],.085,0x5f8593);
 for(let i=0;i<4;i++){
  const y=.12+i*.28;
  path(i<Math.round(a*3)?[[-4.25,y,.75],[-2.8,.05,.56],[-2.8,-1.04,.95],[.95,-1.04,.95],[1.15,-.2,.95],[2.35,-.2,1],[2.85,-.65,1.69],[2.85,-2.7,1.69],[3.45,-2.7,1.69]]:[[-4.25,y,.75],[-2,1.5,.7],[1.8,2,.7]],0x965bc0,'co2',1);
 }
 path([[-4.2,.8,-.45],[-1.4,.8,-.45],[.2,1.45,-.45]],0x74aab9,'air',2);
 for(let i=0;i<Math.round(a*12);i++)ball(2.55+i%4*.25,-2.89+Math.floor(i/4)*.13,1.57,.055,0x9d63be);
 label('주변 공기의 CO₂',-3.65,1.45,.8);
 label('포집 장치',-1.6,1.02,.5);
 label('모은 CO₂를 관으로',1.6,.6,1);
 label('지하 저장층',2.8,-2.15,1.7);
};
const oldDiagram=Features.diagram.bind(Features);
Features.diagram=function(){
 if(state.id!==8)return oldDiagram();
 const a=(state.compare?0:state.strength)/100,active=Math.ceil(a*3);
 if($('stage').clientWidth<600){
  let units='';
  for(let i=0;i<3;i++)units+='<rect x="'+(120+i*47)+'" y="162" width="38" height="125" rx="4" fill="'+(i<active?'#438f84':'#9ba9a8')+'" stroke="#355669" stroke-width="2"/>'+Array.from({length:5},(_,j)=>'<path d="M'+(125+i*47)+' '+(178+j*22)+' h28" stroke="#dfebe8" stroke-width="3"/>').join('');
  $('diagram').innerHTML='<svg viewBox="0 0 440 520" role="img" aria-label="공기에서 필터를 거쳐 지하에 저장되는 CO₂"><defs><marker id="dac-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L7 4 L0 8" fill="#9363b7"/></marker></defs><rect width="440" height="520" fill="#e3edf0"/><rect y="315" width="440" height="55" fill="#a4b291"/><rect y="370" width="440" height="65" fill="#cbb38e"/><rect y="435" width="440" height="85" fill="#a79b87"/>'+units+'<rect x="318" y="190" width="58" height="95" rx="6" fill="#c9dedb" stroke="#355669" stroke-width="2"/><path d="M137 287 V329 H347 V250 H391 V468 H335" fill="none" stroke="#6e93a0" stroke-width="11" stroke-linejoin="round"/><g stroke="#9363b7" stroke-width="4" fill="none" marker-end="url(#dac-arrow)"><path class="diagram-flow" d="M30 225 H117"/><path class="diagram-flow" opacity="'+a+'" d="M137 287 V329 H347 V250 H391 V468 H340"/><path class="diagram-flow" opacity="'+(1-a*.65)+'" d="M35 175 Q135 66 277 127"/></g><ellipse cx="320" cy="468" rx="'+(10+a*20)+'" ry="'+(8+a*12)+'" fill="#a57ac3"/><g font-size="18" fill="#284758" text-anchor="middle"><text x="72" y="265">공기 속 CO₂</text><text x="190" y="150">포집 필터</text><text x="349" y="171">모은 CO₂</text><text x="304" y="422">지하 저장층</text></g></svg>';return;
 }
 let filters='';
 for(let i=0;i<3;i++)filters+='<rect x="'+(210+i*60)+'" y="115" width="48" height="150" rx="4" fill="'+(i<active?'#438f84':'#9ba9a8')+'" stroke="#355669" stroke-width="2"/>'+Array.from({length:6},(_,j)=>'<path d="M'+(216+i*60)+' '+(130+j*22)+' h36" stroke="#deebe7" stroke-width="4"/>').join('');
 $('diagram').innerHTML='<svg viewBox="0 0 800 460" role="img" aria-label="주변 공기에서 CO₂를 모아 지하에 저장하는 과정"><defs><marker id="dac-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L7 4 L0 8" fill="#9363b7"/></marker></defs><rect width="800" height="460" fill="#e3edf0"/><rect y="282" width="800" height="54" fill="#a4b291"/><rect y="336" width="800" height="50" fill="#cbb38e"/><rect y="386" width="800" height="74" fill="#a79b87"/>'+filters+'<rect x="462" y="150" width="74" height="115" rx="8" fill="#c9dedb" stroke="#355669" stroke-width="2"/><path d="M236 265 V294 H499 V208 H633 V422 H709" stroke="#6e93a0" stroke-width="15" fill="none" stroke-linejoin="round"/><g stroke="#9363b7" stroke-width="5" fill="none" marker-end="url(#dac-arrow)"><path class="diagram-flow" d="M48 178 H208"/><path class="diagram-flow" opacity="'+a+'" d="M238 266 V294 H499 V208 H633 V422 H699"/><path class="diagram-flow" opacity="'+(1-a*.65)+'" d="M90 100 Q285 18 431 80"/></g><ellipse cx="699" cy="421" rx="'+(16+30*a)+'" ry="'+(10+10*a)+'" fill="#a57ac3"/><g font-size="18" fill="#284758" text-anchor="middle"><text x="105" y="215">공기 속 CO₂</text><text x="299" y="100">공기에서 잡는 필터</text><text x="500" y="132">분리·수집</text><text x="669" y="378">지하 저장</text></g></svg>';
};
})();