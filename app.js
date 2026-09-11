const slides=[...document.querySelectorAll('.slide')];
const progress=document.querySelector('#progress');
const pos=document.querySelector('#position');

const io=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const i=slides.indexOf(e.target);
      pos.textContent=String(i+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');
    }
  })
},{threshold:.58});
slides.forEach(s=>io.observe(s));

addEventListener('scroll',()=>{
  const h=document.documentElement.scrollHeight-innerHeight;
  progress.style.width=(scrollY/h*100)+'%';
},{passive:true});

const interestMap={
 '만들기':'직업명보다 “무언가를 실제로 만드는 사람”이라는 정체성이 오래 간다.',
 '설명하기':'복잡한 것을 쉽게 설명하는 능력은 AI 시대에도 강력한 레버리지다.',
 '사람 돕기':'좋은 기술은 결국 누군가의 문제를 줄이는 데서 가치가 생긴다.',
 '경쟁하기':'측정하고 개선하는 것을 좋아한다면 실험·스포츠·비즈니스·연구 모두 연결될 수 있다.',
 '관찰하기':'좋은 엔지니어와 과학자는 남들이 지나치는 패턴을 본다.',
 '상상하기':'새로운 조합을 떠올리는 능력은 AI를 쓸수록 더 큰 힘을 얻는다.'
};
document.querySelectorAll('#interestChoices button').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('#interestChoices button').forEach(x=>x.classList.remove('active'));
  b.classList.add('active'); document.querySelector('#interestResult').textContent=interestMap[b.textContent];
});

document.querySelectorAll('.answer').forEach(b=>b.onclick=()=>{
  const human=b.dataset.answer==='human';
  document.querySelector('#turingResult').textContent=human?'사람으로 설정한 답변입니다. 하지만 문장만으로 확신하기 점점 어려워지죠.':'AI로 설정한 답변입니다. “사람답다”는 판단 기준 자체가 흔들립니다.';
});

let xor=false;
const viz=document.querySelector('#perceptronViz'), slope=document.querySelector('#slope'), offset=document.querySelector('#offset');
const pointsLinear=[[20,25,0],[30,62,0],[38,40,0],[66,28,1],[74,58,1],[82,42,1]];
const pointsXor=[[25,25,0],[75,75,0],[25,75,1],[75,25,1]];
function renderPerceptron(){
  viz.innerHTML='';
  const pts=xor?pointsXor:pointsLinear;
  pts.forEach(([x,y,c])=>{const d=document.createElement('i');d.className='dot';d.style.left=x+'%';d.style.top=y+'%';d.style.background=c?'#96e7bd':'#e78288';viz.appendChild(d)});
  const line=document.createElement('i');line.className='boundary';
  const m=+slope.value, off=+offset.value;
  line.style.width='150%';line.style.left='-20%';line.style.top=off+'%';line.style.transform=`rotate(${Math.atan(m)*180/Math.PI}deg)`;viz.appendChild(line);
}
slope.oninput=offset.oninput=renderPerceptron;
document.querySelector('#xorBtn').onclick=()=>{xor=!xor;document.querySelector('#perceptronNote').textContent=xor?'XOR: 직선 하나로는 네 점을 완벽히 분리할 수 없다. → 여러 층이 필요해진다.':'점을 나누도록 선을 움직여보자.';renderPerceptron()};
renderPerceptron();

let loss=.82;
document.querySelector('#trainBtn').onclick=()=>{
  loss=Math.max(.05,loss*.66);
  document.querySelector('#lossValue').textContent=loss.toFixed(2);
  document.querySelector('#lossBar').style.width=(loss*100)+'%';
  document.querySelector('#predLabel').textContent=loss<.25?'CAT '+Math.round((1-loss)*100)+'%':'DOG '+Math.round(loss*100)+'%';
};

const weights=[[1,.2,.2,.1,.8,.3],[.2,1,.5,.1,.2,.4],[.2,.6,1,.5,.7,.4],[.1,.2,.7,1,.9,.6],[.1,.2,.5,.9,1,.8],[.2,.3,.3,.5,.8,1]];
const att=[...document.querySelectorAll('#attention button')];
att.forEach((b,i)=>b.onclick=()=>{
 att.forEach((x,j)=>{const w=weights[i][j];x.style.opacity=.35+.65*w;x.style.transform=`translateY(${-6*w}px) scale(${.96+.08*w})`;x.classList.toggle('hot',w>.75)});
 document.querySelector('#attentionHint').textContent=`“${b.textContent}”가 다른 단어와 맺는 관계의 강도를 밝기로 표현한 예시입니다.`;
});

const noise=document.querySelector('#noiseGrid');
for(let i=0;i<128;i++){const x=document.createElement('i');noise.appendChild(x)}
function drawNoise(v){
 [...noise.children].forEach((x,i)=>{
  const col=i%16,row=Math.floor(i/16);
  const cx=7.5,cy=3.5,dist=Math.hypot(col-cx,(row-cy)*1.6);
  const shape=Math.max(0,1-dist/7);
  const rnd=Math.random();
  const mix=v/100;
  const br=Math.floor(20+(rnd*110)*(1-mix)+shape*170*mix);
  x.style.background=`rgb(${br},${Math.min(235,br+20)},${Math.min(220,br+10)})`;
 })
}
const denoise=document.querySelector('#denoise');denoise.oninput=()=>drawNoise(+denoise.value);drawNoise(0);

document.querySelectorAll('.token-options button').forEach(b=>b.onclick=()=>document.querySelector('#nextToken').textContent=b.dataset.token);
document.querySelector('#temperature').oninput=e=>{
 const t=(e.target.value/10).toFixed(1);
 document.querySelector('#tempText').textContent=t<.5?`${t} — 매우 안정적. 가장 가능성 높은 표현을 반복적으로 고른다.`:t<1?`${t} — 안정성과 다양성의 균형.`:`${t} — 더 다양하고 의외지만 실수도 늘어난다.`;
};

document.addEventListener('keydown',e=>{
 if(['ArrowDown','PageDown',' '].includes(e.key)){e.preventDefault();scrollTo({top:scrollY+innerHeight*.82,behavior:'smooth'})}
 if(['ArrowUp','PageUp'].includes(e.key)){e.preventDefault();scrollTo({top:scrollY-innerHeight*.82,behavior:'smooth'})}
});

const presenter=document.querySelector('#presenterPanel');
const presenterBtn=document.querySelector('#presenterBtn');
const closePresenter=document.querySelector('#closePresenter');
presenterBtn.onclick=()=>{presenter.classList.toggle('on');presenter.setAttribute('aria-hidden',!presenter.classList.contains('on'))};
closePresenter.onclick=()=>{presenter.classList.remove('on');presenter.setAttribute('aria-hidden','true')};
document.querySelector('#fullscreenBtn').onclick=()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen?.();

const timing=['0–5분','5–10분','10–18분','18–23분','23–27분','27–30분','30–33분','33–37분','37–42분','42–47분','47–54분','54–61분','61–67분','67–73분','73–78분','78–84분','84–90분','90–94분','94–97분','97–100분'];
const slideObserver2=new IntersectionObserver(es=>es.forEach(e=>{
 if(e.isIntersecting){
   const i=slides.indexOf(e.target);
   const kicker=e.target.querySelector('.kicker')?.textContent||'';
   const title=e.target.querySelector('h1,h2,blockquote')?.textContent.trim().replace(/\s+/g,' ')||'';
   document.querySelector('#presenterTitle').textContent=(kicker?kicker+' · ':'')+title.slice(0,70);
   document.querySelector('#sectionTime').textContent=timing[i]||'';
 }
}),{threshold:.58});
slides.forEach(s=>slideObserver2.observe(s));
