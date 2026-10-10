/* Start with visible choices; retain the drawer for changing methods during a visit. */
(()=>{
const art=window.LAB_ILLUSTRATIONS;
const choices=[
 ['우주 반사',0,'iron'],['하늘 반사',1,'iron'],['지면 반사',2,'iron'],
 ['인공 나무 ‘매머드’ 설치',8,'iron'],['철분 살포하기',10,'iron'],['심층수 끌어올리기',10,'up']
];
const container=document.getElementById('start-options');
for(let category=0;category<2;category++){
 const section=document.createElement('section');section.className='start-group';
 const heading=document.createElement('h2');heading.textContent=category===0?'태양빛 줄이기':'이산화탄소 잡기';section.append(heading);
 const row=document.createElement('div');row.className='start-grid';
 choices.slice(category*3,category*3+3).forEach(([name,id,mode],index)=>{
  const button=document.createElement('button');button.type='button';button.className='start-choice';button.dataset.choice=String(category*3+index);
  button.innerHTML='<svg viewBox="0 0 220 130" aria-hidden="true" fill="none" stroke="#658e88" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">'+art[category*3+index]+'</svg><span>'+name+'</span><i data-lucide="arrow-right" class="choice-arrow"></i>';
  button.onclick=()=>{document.body.classList.remove('choosing');select(id,mode);requestAnimationFrame(()=>document.getElementById('strength').focus({preventScroll:true}));};
  row.append(button);
 });
 section.append(row);container.append(section);
}
document.getElementById('choose-home').onclick=()=>{
 document.getElementById('navigation-dialog').close();
 document.body.classList.add('choosing');
 document.getElementById('start-screen').scrollTop=0;
 requestAnimationFrame(()=>document.querySelector('.start-choice').focus({preventScroll:true}));
};
LabVisuals.icons();
})();