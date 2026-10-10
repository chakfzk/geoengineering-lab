/* Scene revisions: reflection physics, atmosphere layers, connected capture and surface blooms. */
(()=>{
LabVisuals.earth=function(a){
 scene.background=new THREE.Color(0x080f20);camera.far=2200;camera.updateProjectionMatrix();
 const planet=mesh(new THREE.SphereGeometry(1.5,80,56),0xffffff,2.5,.1,0);planet.material.dispose();
 planet.material=new THREE.MeshPhongMaterial({map:this.texture('day'),normalMap:this.texture('normal'),normalScale:new THREE.Vector2(.6,.6),specularMap:this.texture('specular'),specular:new THREE.Color(0x466b8f),shininess:16});
 dynamic.push(t=>planet.rotation.y=-1.8+t*.025);
 const halo=ball(2.5,.1,0,1.54,0x579bd2);halo.material.transparent=true;halo.material.opacity=.1;halo.material.side=THREE.BackSide;halo.castShadow=false;halo.receiveShadow=false;
 const sun=ball(-300,-180,-1300,163.5,0xffbc52);sun.material.emissive.set(0xffad39);sun.material.emissiveIntensity=1.2;sun.castShadow=false;sun.receiveShadow=false;sun.userData.labelName='태양 (먼 거리)';
 label('태양 (먼 거리)',-300,-180,-1300);
 const angle=-20*Math.PI/180,height=.15+a*2.35,center=V(-.35,.1,0),normal=V(-Math.cos(angle),-Math.sin(angle),0);
 let mirror=null;
 if(a){
  mirror=box(center.x,center.y,0,.08,height,1.55,0x90c8e6);mirror.rotation.z=angle;mirror.material.metalness=.7;this.edge(mirror,0xcceafa);mirror.userData.mirror=true;
 }
 for(let i=0;i<7;i++){
  const y=(i-3)*.42,start=V(-4.55,y,0),x=center.x+(.04-(y-center.y)*normal.y)/normal.x,hit=V(x,y,0);
  const local=hit.clone().sub(center).applyAxisAngle(V(0,0,1),-angle);
  const reflects=a>0&&Math.abs(local.y)<=height/2;
  const incoming=V(1,0,0),outgoing=incoming.clone().reflect(normal);
  const endpoint=reflects?hit.clone().addScaledVector(outgoing,3):V(2.5-Math.sqrt(Math.max(0,2.25-(y-.1)*(y-.1))),y,0);
  path(reflects?[start.toArray(),hit.toArray(),endpoint.toArray()]:[start.toArray(),endpoint.toArray()],0xf0bb43,'light',2);
  Object.assign(paths.at(-1),{reflected:reflects,incoming,normal:normal.clone(),outgoing,hit});
 }
 label('들어오는 태양빛',-3.45,1.75);label(a?'우주 반사경':'반사경 적용 전',-.25,1.75);label('지구',2.6,2.05);if(a)label('반사된 태양빛',-1.65,2.85);
};
LabVisuals.aerosols=function(a){
 this.ground(0x94b28b);
 const body=cylinder(-2.65,1.7,.1,.15,1.65,0xf5f8f8);body.rotation.z=Math.PI/2;
 const nose=mesh(new THREE.ConeGeometry(.15,.38,16),0x506f83,-1.69,1.7,.1);nose.rotation.z=-Math.PI/2;
 const wing=box(-2.72,1.68,.1,.48,.065,1.6,0x557f9b);wing.rotation.y=.14;
 box(-3.3,1.74,.1,.36,.06,.68,0x64849a);box(-3.36,1.9,.1,.28,.42,.07,0x64849a);
 box(-2.07,1.77,.22,.24,.09,.01,0x315973);
 for(const z of [-.45,.65]){const e=cylinder(-2.65,1.57,z,.09,.4,0x4c687b);e.rotation.z=Math.PI/2;}
 const n=Math.round(a*95);
 for(let i=0;i<n;i++){const x=-1.8+(i%19)*.28,y=.95+Math.floor(i/19)*.14,z=Math.sin(i*2.4)*.65;const p=ball(x,y,z,.035,0xd5c8e6);p.material.transparent=true;p.material.opacity=.75;dynamic.push(t=>p.position.y=y+Math.sin(t*.7+i)*.028);}
 if(a)path([[-3.4,1.65,0],[-2.8,1.25,0],[-1.5,1.2,0]],0xaaa1c6,'spray',2);
 sunRays(a*.8,-1.5,1.15,.8);
 label('대류권',3,-.5,-1.4);label('성층권',3,1.35,-1.4);label('에어로졸 입자층',.5,1.75);label('살포 비행기',-2.6,2.3);
};
const build=LabVisuals.build.bind(LabVisuals);
LabVisuals.build=function(id,a){if(id===1){this.aerosols(a);return true;}return build(id,a);};
const enhance=LabVisuals.enhance.bind(LabVisuals);
LabVisuals.enhance=function(id,a){
 enhance(id,a);
 if(id!==10)return;
 if(!this.bloomTexture){
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=256;const ctx=canvas.getContext('2d');
  for(let i=0;i<150;i++){
   const radius=Math.sqrt((i+.5)/150),angle=i*2.399;
   const x=256+Math.cos(angle)*radius*215+Math.sin(i*1.8)*12,y=128+Math.sin(angle)*radius*100;
   const size=16+12*(.5+.5*Math.sin(i*2.1));
   const g=ctx.createRadialGradient(x,y,0,x,y,size);
   g.addColorStop(0,'rgba(207,249,237,.95)');g.addColorStop(.55,'rgba(123,225,199,.85)');g.addColorStop(1,'rgba(91,180,169,0)');
   ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(x,y,size,size*.6,Math.sin(i)*.8,0,Math.PI*2);ctx.fill();
  }
  this.bloomTexture=new THREE.CanvasTexture(canvas);this.bloomTexture.colorSpace=THREE.SRGBColorSpace;this.bloomTexture.userData.shared=true;
 }
 const coverage=.15+a*.85;
 const surface=new THREE.Mesh(new THREE.PlaneGeometry(8.4,4),new THREE.MeshBasicMaterial({map:this.bloomTexture,transparent:true,opacity:.18+a*.78,depthWrite:false,side:THREE.DoubleSide}));
 surface.rotation.x=-Math.PI/2;surface.position.set(.1,.235,0);surface.scale.set(coverage,coverage,1);surface.material.toneMapped=false;surface.userData.labelName="표층의 플랑크톤 번성";surface.userData.bloomSurface=true;surface.userData.coverage=coverage*coverage;root.add(surface);
 dynamic.push(time=>{surface.rotation.z=Math.sin(time*.12)*.015;});
};
const init=Features.init.bind(Features);
Features.init=function(){init();this.photos[0]={name:'구름이 많은 바다와 구름 사이의 바다 비교',image:'assets/real-cloud-comparison.jpg',description:'같은 위성 사진에서 구름이 많은 밝은 부분과 구름 사이의 어두운 바다를 비교해 보세요. 긴 구름 줄은 선박 배출 입자의 영향을 받은 관측 사례이며, 해상 구름 밝히기 실험의 전후 사진은 아닙니다.',credit:'NASA Earth Observatory · Terra/MODIS, 2008년 7월 13일',url:'https://science.nasa.gov/earth/earth-observatory/ship-tracks-in-the-northern-pacific-20248/'};};
const overlay=Features.overlay.bind(Features);
Features.overlay=function(){overlay();$('inset').hidden=state.id!==4||state.view!=='front';};
const diagram=Features.diagram.bind(Features);
Features.diagram=function(){
 if(![1,8,10].includes(state.id)){diagram();return;}
 const a=(state.compare?0:state.strength)/100,narrow=$('stage').clientWidth<600;
 const w=narrow?440:800,h=520;
 const r=(x,y,ww,hh,fill)=>'<rect x="'+x+'" y="'+y+'" width="'+ww+'" height="'+hh+'" rx="5" fill="'+fill+'" stroke="#4a6a70" stroke-width="2"/>';
 const text=(x,y,t,ax=x,ay=y)=>'<text data-anchor-x="'+ax+'" data-anchor-y="'+ay+'" x="'+x+'" y="'+y+'" text-anchor="middle" fill="#2a4d44" font-size="17">'+t+'</text>';
 const flow=(d,c='#9363b7')=>'<path class="diagram-flow" d="'+d+'" fill="none" stroke="'+c+'" stroke-width="4" marker-end="url(#scene-tip)"/>';
 let content='';
 if(state.id===1){
  content+=r(0,305,w,180,'#cadfeb')+r(0,60,w,245,'#e4edf5')+r(0,485,w,35,'#a1b893');
  content+=text(w*.82,395,'대류권')+text(w*.82,100,'성층권');
  content+='<path d="M0 305 H'+w+'" stroke="#7796af" stroke-width="2" stroke-dasharray="5 5"/>';
  const x=w*.22;
  content+='<path d="M'+(x-40)+' 187 h80 l-30 10 -14 25 -6-25 h-30Z" fill="#647f96"/>'+text(x,162,'살포 비행기');
  for(let i=0;i<Math.round(a*50);i++)content+='<circle cx="'+(w*.4+i%10*w*.035)+'" cy="'+(205+Math.floor(i/10)*10)+'" r="3" fill="#a392b7"/>';
  content+=text(w*.57,285,'에어로졸 입자층');
  for(let i=0;i<4;i++){const xx=w*.4+i*w*.08;content+=flow('M'+(xx-25)+' 70 L'+xx+' 225','#cda337');content+=flow('M'+xx+' 225 L'+(i<Math.round(a*3)?xx+35:xx+10)+' '+(i<Math.round(a*3)?75:480),'#cda337');}
 }else if(state.id===8){
  const x0=w*.28,unit=w*.09,y=185;
  content+=r(0,320,w,55,'#a8b58f')+r(0,375,w,70,'#cfb88e')+r(0,445,w,75,'#a99c86');
  for(let i=0;i<3;i++){content+=r(x0+i*unit,y,unit*.78,120,i<Math.ceil(a*3)?'#548e82':'#9caead');for(let j=0;j<5;j++)content+='<path d="M'+(x0+i*unit+5)+' '+(y+17+j*21)+' h'+(unit*.78-10)+'" stroke="#dfede7" stroke-width="3"/>';}
  const collect=w*.69,well=w*.88,storage=w*.75;
  content+=r(collect-22,205,44,95,'#c9dfd9');
  const pipe='M'+(x0+unit*.4)+' 305 V338 H'+collect+' V260 H'+well+' V475 H'+storage;
  content+='<path d="'+pipe+'" stroke="#648c9b" stroke-width="13" fill="none" stroke-linejoin="round"/>';
  content+=flow('M'+(w*.05)+' 235 H'+x0)+flow('M'+x0+' 235 H'+(x0+unit*.4)+' V305');
  if(a)content+=flow(pipe);
  content+=flow('M'+(w*.12)+' 120 Q'+(w*.4)+' 55 '+(w*.67)+' 130');
  content+='<ellipse cx="'+storage+'" cy="475" rx="'+(13+a*20)+'" ry="'+(9+a*10)+'" fill="#ac88c4"/>';
  content+=text(w*.12,277,'공기 속 CO₂')+text(w*.41,163,'포집 장치')+text(collect,185,'모은 CO₂')+text(storage,435,'지하 저장');
 }else{
  content+=r(0,270,w,200,'#a7d5dc')+r(0,470,w,50,'#719c88');
  const grow=.12+a*.78;
  for(let i=0;i<8+Math.round(a*25);i++){const x=w*(.18+(i%11)*.065*grow),y=281+Math.floor(i/11)*10;content+='<ellipse cx="'+x+'" cy="'+y+'" rx="'+(10+18*a)+'" ry="5" fill="#b4e9dc" opacity="'+(.3+a*.4)+'"/>';}
  for(let i=0;i<4+Math.round(a*10);i++)content+='<circle cx="'+(w*.38+i%7*13)+'" cy="'+(300+Math.floor(i/7)*12)+'" r="4" fill="#599c74"/>';
  if(state.mode==='iron'){
   content+='<path d="M'+w*.08+' 252 l20 18 h65 l16-18Z" fill="#5e7f8c"/>'+r(w*.14,230,35,23,'#f4f5ed');
   if(a)for(let i=0;i<7;i++)content+='<circle cx="'+(w*.28+i*4)+'" cy="'+(255+i*5)+'" r="2.5" fill="#b29453"/>';
   content+=text(w*.19,221,'철분 공급');
  }else{
   content+=r(w*.17,276,15,175,'#7897a4');
   for(let i=0;i<5;i++)content+='<circle cx="'+(w*.09+i*10)+'" cy="452" r="5" fill="#c9a251"/>';
   if(a)content+=flow('M'+(w*.17+7)+' 447 V285 H'+(w*.35),'#b8984a');
   content+=text(w*.17,255,'심층수 펌프')+text(w*.16,496,'심층수의 영양분');
  }
  content+=flow('M'+(w*.62)+' 100 V258 L'+(w*.56)+' 300')+text(w*.62,84,'CO₂');
  content+=flow('M'+(w*.53)+' 325 L'+(w*.61)+' 450')+flow('M'+(w*.6)+' 323 Q'+(w*.89)+' 356 '+(w*.85)+' 300');
  content+=text(w*.48,365,'식물 플랑크톤')+text(w*.55,463,'가라앉는 탄소',w*.61,450)+text(w*.84,396,'다시 순환하는 탄소',w*.85,300);
 }
 $('diagram').innerHTML='<svg viewBox="0 0 '+w+' '+h+'" role="img" aria-label="'+Features.data()[0]+' 원리"><defs><marker id="scene-tip" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6" fill="none" stroke="context-stroke" stroke-width="1.3"/></marker></defs><rect width="'+w+'" height="'+h+'" fill="#e8f0f3"/>'+content+'</svg>';
};
})();