/* Scene revisions: reflection physics, atmosphere layers, connected capture and surface blooms. */
(()=>{
LabVisuals.earth=function(a){
 scene.background=new THREE.Color(0x080f20);camera.far=2200;camera.updateProjectionMatrix();
 const planet=mesh(new THREE.SphereGeometry(1.5,80,56),0xffffff,2.5,.1,0);planet.material.dispose();
 planet.material=new THREE.MeshPhongMaterial({map:this.texture('day'),normalMap:this.texture('normal'),normalScale:new THREE.Vector2(.6,.6),specularMap:this.texture('specular'),specular:new THREE.Color(0x466b8f),shininess:16});
 dynamic.push(t=>planet.rotation.y=-1.8+t*.025);
 const halo=ball(2.5,.1,0,1.54,0x579bd2);halo.material.transparent=true;halo.material.opacity=.1;halo.material.side=THREE.BackSide;halo.castShadow=false;halo.receiveShadow=false;
 const sunCenter=V(-6.2,.1,0),sunRadius=2.15;const sun=ball(sunCenter.x,sunCenter.y,sunCenter.z,sunRadius,0xffbc52);sun.material.emissive.set(0xffad39);sun.material.emissiveIntensity=1.2;sun.castShadow=false;sun.receiveShadow=false;sun.userData.labelName='태양';sun.userData.sunSource=true;
 label('태양',sunCenter.x,2.55,0);
 const angle=-20*Math.PI/180,height=.15+a*2.35,center=V(-.35,.1,0),normal=V(-Math.cos(angle),-Math.sin(angle),0);
 let mirror=null;
 if(a){
  mirror=box(center.x,center.y,0,.08,height,1.55,0x90c8e6);mirror.rotation.z=angle;mirror.material.metalness=.7;this.edge(mirror,0xcceafa);mirror.userData.mirror=true;
 }
 for(let i=0;i<7;i++){
  const y=(i-3)*.42,start=V(sunCenter.x+Math.sqrt(sunRadius*sunRadius-(y-sunCenter.y)*(y-sunCenter.y)),y,0),x=center.x+(.04-(y-center.y)*normal.y)/normal.x,hit=V(x,y,0);
  const local=hit.clone().sub(center).applyAxisAngle(V(0,0,1),-angle);
  const reflects=a>0&&Math.abs(local.y)<=height/2;
  const incoming=V(1,0,0),outgoing=incoming.clone().reflect(normal);
  const endpoint=reflects?hit.clone().addScaledVector(outgoing,3):V(2.5-Math.sqrt(Math.max(0,2.25-(y-.1)*(y-.1))),y,0);
  path(reflects?[start.toArray(),hit.toArray(),endpoint.toArray()]:[start.toArray(),endpoint.toArray()],0xf0bb43,'light',2);
  Object.assign(paths.at(-1),{reflected:reflects,incoming,normal:normal.clone(),outgoing,hit});
 }
 label('들어오는 태양빛',-3.45,1.75);label(a?'우주 반사경':'반사경 적용 전',-.35,-1.75);label('지구',2.6,2.05);if(a)label('반사된 태양빛',-1.65,2.85);
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
 if(id!==10)return;scene.background=new THREE.Color(0xf0f0e8);root.children.filter(m=>m.isMesh&&m.geometry.type==='BoxGeometry'&&Math.abs(m.position.y-.15)<.02).forEach(m=>{m.material.transparent=true;m.material.opacity=.1;m.material.depthWrite=false;});
 const count=70+Math.round(a*410);
 const cells=new THREE.InstancedMesh(new THREE.SphereGeometry(1,8,6),new THREE.MeshPhongMaterial({color:0x85ddc8,emissive:0x286d60,emissiveIntensity:.22,shininess:35}),count);
 const dummy=new THREE.Object3D(),positions=[];
 for(let i=0;i<count;i++){
  const x=-1.6+((i*.61803398875)%1)*5.5,z=-.95+((i*.41421356)%1)*1.9,y=-.12-((i*.7320508)%1)*.85;
  positions.push([x,y,z]);dummy.position.set(x,y,z);dummy.scale.set(.055,.027,.035);dummy.rotation.set(i*.7,i*.9,i*.3);dummy.updateMatrix();cells.setMatrixAt(i,dummy.matrix);
 }
 cells.userData.planktonPopulation=true;cells.userData.count=count;cells.userData.labelName='광합성하는 식물 플랑크톤';cells.frustumCulled=false;root.add(cells);
 dynamic.push(t=>{positions.forEach(([x,y,z],i)=>{dummy.position.set(x+Math.sin(t*.35+i)*.018,y+Math.sin(t*.4+i)*.012,z);dummy.scale.set(.055,.027,.035);dummy.rotation.set(i*.7,i*.9+t*.05,i*.3);dummy.updateMatrix();cells.setMatrixAt(i,dummy.matrix);});cells.instanceMatrix.needsUpdate=true;});
 const debris=new THREE.Group();debris.userData.labelName='사체·배설물이 뭉친 입자';debris.userData.organicAggregate=true;
 for(let i=0;i<9;i++){const grain=new THREE.Mesh(new THREE.SphereGeometry(.045,7,5),new THREE.MeshPhongMaterial({color:0xb79a72}));grain.position.set(Math.sin(i*2.4)*.13,Math.cos(i*1.7)*.1,Math.sin(i)*.1);debris.add(grain);}debris.position.set(.7,-1.15,.7);root.add(debris);

};
const init=Features.init.bind(Features);
Features.init=function(){init();this.photos[0]={name:'구름이 많은 바다와 구름 사이의 바다 비교',image:'assets/real-cloud-comparison.jpg',description:'같은 위성 사진에서 구름이 많은 밝은 부분과 구름 사이의 어두운 바다를 비교해 보세요. 긴 구름 줄은 선박 배출 입자의 영향을 받은 관측 사례이며, 해상 구름 밝히기 실험의 전후 사진은 아닙니다.',credit:'NASA Earth Observatory · Terra/MODIS, 2008년 7월 13일',url:'https://science.nasa.gov/earth/earth-observatory/ship-tracks-in-the-northern-pacific-20248/'};new ResizeObserver(()=>{if(state.id===4&&state.view==='front'&&!document.getElementById('inset').hidden)this.layoutDiagramNames();}).observe(document.getElementById('inset'));};
const overlay=Features.overlay.bind(Features);
Features.overlay=function(){overlay();$('inset').hidden=state.id!==4||state.view!=='front';if(state.id===4&&state.view==='front')this.layoutDiagramNames();};
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
  content+=r(collect-22,205,44,95,'#c9dfd9');content+=r(collect-17,255,34,39,'#8bcbdc');
  const pipe='M'+(x0+unit*.4)+' 305 V338 H'+collect+' V260 H'+well+' V475 H'+storage;
  content+='<path d="'+pipe+'" stroke="#648c9b" stroke-width="13" fill="none" stroke-linejoin="round"/>';
  content+=flow('M'+(w*.05)+' 235 H'+x0)+flow('M'+x0+' 235 H'+(x0+unit*.4)+' V305');
  if(a)content+=flow(pipe);
  content+=flow('M'+(x0+unit*.4)+' 235 V115 H'+(w*.93));content+=text(w*.75,92,'포집되지 않은 CO₂',w*.90,115);
  content+='<g data-storage-rock="true">';for(let i=0;i<5;i++){const rx=storage-20+i*10,ry=474+Math.sin(i)*4;content+='<path d="M'+rx+' '+(ry-8)+' l8-3 5 10 -6 8 -10-4Z" fill="'+(i<Math.round(a*5)?'#e2d7c7':'#827c77')+'" stroke="#575b58" stroke-width="1.5"/>';}content+='</g>';
  content+=text(w*.12,277,'공기 속 CO₂')+text(w*.41,163,'포집 장치')+text(collect,185,'CO₂를 물에 녹이기')+text(storage,435,'암석 속 광물로 고정');
 }else{
  content+=r(0,270,w,200,'#e2e9e9')+r(0,470,w,50,'#719c88');
  const population=22+Math.round(a*100);
  for(let i=0;i<population;i++){const x=w*(.32+((i*.61803398875)%1)*.52),y=284+((i*.41421356)%1)*54;content+='<ellipse data-plankton="true" cx="'+x+'" cy="'+y+'" rx="3.7" ry="1.8" transform="rotate('+((i*47)%180)+' '+x+' '+y+')" fill="#399d8c" stroke="#d5f7eb" stroke-width=".7"/>';}
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
  content+=flow('M'+(w*.53)+' 325 L'+(w*.56)+' 370','#ab8c65');for(let i=0;i<7;i++)content+='<circle cx="'+(w*.56+Math.sin(i*2.4)*7)+'" cy="'+(376+Math.cos(i*1.7)*5)+'" r="2.5" fill="#a78b68"/>';content+=flow('M'+(w*.56)+' 386 L'+(w*.61)+' 450','#ab8c65');
  content+=text(w*.43,344,'식물 플랑크톤',w*.45,307)+text(w*.36,408,'유기물(탄소 포함)',w*.56,376)+text(w*.55,463,'일부 유기물의 침강',w*.61,450);
 }
 $('diagram').innerHTML='<svg viewBox="0 0 '+w+' '+h+'" role="img" aria-label="'+Features.data()[0]+' 원리"><defs><marker id="scene-tip" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6" fill="none" stroke="context-stroke" stroke-width="1.3"/></marker></defs><rect width="'+w+'" height="'+h+'" fill="#e8f0f3"/>'+content+'</svg>';
};
})();