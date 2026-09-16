const slides=[...document.querySelectorAll('.slide')];
const progress=document.querySelector('#progress');

function activeSlide(i){
  const s=slides[i]; if(!s) return;
  const pct=slides.length>1?i/(slides.length-1)*100:0;
  if(progress) progress.style.width=pct+'%';
  const presenterTitle=document.querySelector('#presenterTitle');
  const presenterTime=document.querySelector('#presenterTime');
  const presenterNote=document.querySelector('#presenterNote');
  const kicker=s.querySelector('.kicker')?.textContent?.trim()||'';
  const title=s.querySelector('h1,h2,blockquote')?.textContent?.trim().replace(/\s+/g,' ')||'';
  if(presenterTitle) presenterTitle.textContent=(kicker?kicker+' · ':'')+title.slice(0,82);
  const timing=['0–5분 · Opening','5–10분 · 오늘의 지도','10–18분 · 나의 경로','18–23분 · Career Path','23–27분 · 메시지','27–30분 · 학생 인터랙션','30–33분 · AI Timeline','33–37분 · Turing','37–42분 · Perceptron','42–47분 · Backprop','47–55분 · CNN','55–63분 · AlphaGo','63–71분 · Transformer','71–77분 · Diffusion','77–83분 · ChatGPT','83–88분 · Agents','88–93분 · Future of Work','93–96분 · Bill Gates','96–98분 · Andrew Ng','98–100분 · Closing'];
  if(presenterTime) presenterTime.textContent=timing[i]||'';
  const notes=['첫 질문: “여기서 10년 뒤 직업이 정확히 정해진 사람?”','세 파트만 기억시키기: 나 → AI → 너','직함보다 문제의 이동을 강조','계획된 직선이 아니라 연결된 점이었다','진로를 명사보다 동사로 생각시키기','손들기 또는 휴대폰으로 직접 선택','AI의 도약은 아이디어×데이터×컴퓨팅','사람처럼 보이는 것과 생각하는 것은 같은가?','직선 하나의 한계를 직접 보여주기','오류를 뒤로 보내며 조금씩 수정','필터를 바꾸면 같은 입력도 다르게 보임','37수 버튼을 누르고 “왜 놀라웠나” 질문','AI 단어를 눌러 attention 연결선 보기','noise에서 구조가 생기는 감각','다음 단어 예측과 temperature 체험','답변→행동으로 변화하는 AI','직업보다 task가 먼저 변한다','자동화할 수 있음과 자동화해야 함은 다르다','AI를 진로의 thought partner로 쓰기','Learn · Ask · Make · Care로 마무리'];
  if(presenterNote) presenterNote.textContent=notes[i]||'';
}
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting) activeSlide(slides.indexOf(e.target));}),{threshold:.56});
slides.forEach(s=>observer.observe(s));
addEventListener('scroll',()=>{const h=document.documentElement.scrollHeight-innerHeight;if(progress&&h>0)progress.style.width=(scrollY/h*100)+'%'},{passive:true});

// Presenter / fullscreen
const presenter=document.querySelector('#presenterPanel');
const presenterToggle=document.querySelector('#presenterToggle');
if(presenterToggle&&presenter){presenterToggle.onclick=()=>{const on=presenter.classList.toggle('on');presenter.setAttribute('aria-hidden',String(!on));presenterToggle.classList.toggle('active',on)}}
const fullscreenBtn=document.querySelector('#fullscreenBtn');
if(fullscreenBtn) fullscreenBtn.onclick=()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen?.();

// Taewon High School mark — sourced from the NamuWiki page the lecturer referenced.
// Microlink captures the logo element itself so the page does not depend on NamuWiki hot-linking rules.
const crest=document.querySelector('.crest');
if(crest){
  const fallback=crest.textContent.trim()||'泰園';
  const target='https://namu.wiki/w/%ED%83%9C%EC%9B%90%EA%B3%A0%EB%93%B1%ED%95%99%EA%B5%90';
  const encoded=encodeURIComponent(target);
  const selector=encodeURIComponent('img[alt*="Taewon High School Logo"]');
  const elementCapture=`https://api.microlink.io?url=${encoded}&screenshot.element=${selector}&meta=false&embed=screenshot.url`;
  const metadataImage=`https://api.microlink.io?url=${encoded}&embed=image.url`;
  const img=new Image();
  img.alt='태원고등학교 교표';
  img.referrerPolicy='no-referrer';
  img.style.width='100%';
  img.style.height='100%';
  img.style.objectFit='contain';
  img.style.display='block';
  img.style.borderRadius='50%';
  let triedMetadata=false;
  img.onload=()=>{crest.textContent='';crest.style.padding='7px';crest.style.background='#fff';crest.appendChild(img);crest.title='태원고등학교 교표 · NamuWiki reference'};
  img.onerror=()=>{
    if(!triedMetadata){triedMetadata=true;img.src=metadataImage;return;}
    crest.textContent=fallback;
    crest.style.padding='';
    crest.style.background='';
  };
  img.src=elementCapture;
}

// Career interest
const interestMap={
 '만들기':'직업명보다 “무언가를 실제로 만드는 사람”이라는 정체성이 오래 간다.',
 '설명하기':'복잡한 것을 쉽게 설명하는 능력은 AI 시대에도 강력한 레버리지다.',
 '사람 돕기':'좋은 기술은 결국 누군가의 문제를 줄이는 데서 가치가 생긴다.',
 '경쟁하기':'측정하고 개선하는 것을 좋아한다면 실험·스포츠·비즈니스·연구 모두 연결될 수 있다.',
 '관찰하기':'좋은 엔지니어와 과학자는 남들이 지나치는 패턴을 본다.',
 '상상하기':'새로운 조합을 떠올리는 능력은 AI를 쓸수록 더 큰 힘을 얻는다.'
};
document.querySelectorAll('#interestChoices button').forEach(b=>b.onclick=()=>{document.querySelectorAll('#interestChoices button').forEach(x=>x.classList.remove('active'));b.classList.add('active');const out=document.querySelector('#interestResult');if(out)out.textContent=interestMap[b.textContent]});

// Turing game
document.querySelectorAll('.answer').forEach(b=>b.onclick=()=>{const out=document.querySelector('#turingResult');if(!out)return;out.textContent=b.dataset.answer==='human'?'A를 사람 답변으로 설정했습니다. 하지만 표현만 보고 확신하기가 점점 어려워지고 있습니다.':'B를 AI 답변으로 설정했습니다. 중요한 건 “사람처럼 보인다”와 “사람처럼 생각한다”가 같은 질문은 아니라는 점입니다.'});

// Perceptron
let xor=false; const viz=document.querySelector('#perceptronViz'),slope=document.querySelector('#slope'),offset=document.querySelector('#offset');
const linear=[[20,25,0],[30,62,0],[38,40,0],[66,28,1],[74,58,1],[82,42,1]],xorPts=[[25,25,0],[75,75,0],[25,75,1],[75,25,1]];
function renderPerceptron(){if(!viz||!slope||!offset)return;viz.innerHTML='';(xor?xorPts:linear).forEach(([x,y,c])=>{const d=document.createElement('i');d.className='dot';d.style.left=x+'%';d.style.top=y+'%';d.style.background=c?'#96e7bd':'#e78288';viz.appendChild(d)});const line=document.createElement('i');line.className='boundary';line.style.width='150%';line.style.left='-20%';line.style.top=offset.value+'%';line.style.transform=`rotate(${Math.atan(+slope.value)*180/Math.PI}deg)`;viz.appendChild(line)}
if(slope)slope.oninput=renderPerceptron;if(offset)offset.oninput=renderPerceptron;const xorBtn=document.querySelector('#xorBtn');if(xorBtn)xorBtn.onclick=()=>{xor=!xor;const note=document.querySelector('#perceptronNote');if(note)note.textContent=xor?'XOR: 직선 하나로는 완벽히 나눌 수 없다. 그래서 여러 층의 신경망이 필요해진다.':'점을 나누도록 선을 움직여보자.';renderPerceptron()};renderPerceptron();

// Backprop
let loss=.82;const trainBtn=document.querySelector('#trainBtn');if(trainBtn)trainBtn.onclick=()=>{loss=Math.max(.04,loss*.62);const lv=document.querySelector('#lossValue'),lb=document.querySelector('#lossBar'),pl=document.querySelector('#predLabel');if(lv)lv.textContent=loss.toFixed(2);if(lb)lb.style.width=(loss*100)+'%';if(pl)pl.textContent=loss<.24?'CAT '+Math.round((1-loss)*100)+'%':'DOG '+Math.round(loss*100)+'%'};

// CNN: 7x7 input, 3x3 filter, convolution + pooling
const inputData=[[0,0,1,1,1,0,0],[0,1,1,1,1,1,0],[1,1,0,1,0,1,1],[1,1,1,1,1,1,1],[1,0,1,1,1,0,1],[0,1,0,1,0,1,0],[0,0,1,0,1,0,0]];
let filter=[[1,0,-1],[1,0,-1],[1,0,-1]];
function drawMatrix(el,data){if(!el)return;el.innerHTML='';const flat=data.flat();const max=Math.max(...flat.map(v=>Math.abs(v)),1);data.forEach(row=>row.forEach(v=>{const c=document.createElement('span');c.textContent=Number.isInteger(v)?v:v.toFixed(1);const a=.12+.78*Math.abs(v)/max;c.style.background=v>=0?`rgba(150,231,189,${a})`:`rgba(231,130,136,${a})`;c.style.color=Math.abs(v)/max>.48?'#07100d':'#dce7e1';el.appendChild(c)}))}
function conv2d(inp,k){const out=[];for(let y=0;y<=inp.length-k.length;y++){const row=[];for(let x=0;x<=inp[0].length-k[0].length;x++){let s=0;for(let ky=0;ky<k.length;ky++)for(let kx=0;kx<k[0].length;kx++)s+=inp[y+ky][x+kx]*k[ky][kx];row.push(s)}out.push(row)}return out}
function maxPool(inp){const out=[];for(let y=0;y<inp.length-1;y+=2){const row=[];for(let x=0;x<inp[0].length-1;x+=2)row.push(Math.max(inp[y][x],inp[y+1][x],inp[y][x+1],inp[y+1][x+1]));out.push(row)}return out}
function renderCNN(){const feat=conv2d(inputData,filter);drawMatrix(document.querySelector('#cnnInput'),inputData);drawMatrix(document.querySelector('#cnnFilter'),filter);drawMatrix(document.querySelector('#cnnFeature'),feat);drawMatrix(document.querySelector('#cnnPool'),maxPool(feat))}
const edge=document.querySelector('#edgeFilter'),blur=document.querySelector('#blurFilter');if(edge)edge.onclick=()=>{filter=[[1,0,-1],[1,0,-1],[1,0,-1]];renderCNN()};if(blur)blur.onclick=()=>{filter=[[1/9,1/9,1/9],[1/9,1/9,1/9],[1/9,1/9,1/9]];renderCNN()};renderCNN();

// AlphaGo board (simplified teaching visualization)
const board=document.querySelector('#goBoard');
function renderGo(show37=false){if(!board)return;board.innerHTML='';for(let i=0;i<19*19;i++){const p=document.createElement('button');p.className='go-point';p.setAttribute('aria-label',`바둑 교차점 ${i+1}`);board.appendChild(p)}const stones=[[3,3,'b'],[15,15,'b'],[3,15,'w'],[15,3,'w'],[9,9,'b'],[10,9,'w'],[9,10,'b'],[10,10,'w'],[12,6,'b'],[11,7,'w']];stones.forEach(([x,y,c])=>{const p=board.children[y*19+x];p.classList.add('stone',c)});if(show37){const x=4,y=9,p=board.children[y*19+x];p.classList.add('stone','b','move37');p.innerHTML='<span>37</span>'}}
renderGo(false);const m37=document.querySelector('#move37Btn');if(m37)m37.onclick=()=>{renderGo(true);m37.textContent='이 수가 당시 약 1만분의 1 수준으로 평가되었다고 알려진 37수'};

// Transformer attention lines
const weights=[[1,.2,.2,.15,.72,.3],[.2,1,.42,.15,.25,.36],[.2,.42,1,.58,.68,.42],[.15,.18,.68,1,.92,.65],[.2,.28,.55,.9,1,.84],[.24,.36,.42,.62,.86,1]];
const att=[...document.querySelectorAll('#attention button')],svg=document.querySelector('#attentionLines');
function drawAttention(i){if(!svg||!att.length)return;svg.innerHTML='';const stage=svg.parentElement.getBoundingClientRect(),src=att[i].getBoundingClientRect();att.forEach((b,j)=>{const w=weights[i][j];b.style.opacity=.3+.7*w;b.classList.toggle('hot',w>.75);const r=b.getBoundingClientRect();const x1=src.left+src.width/2-stage.left,x2=r.left+r.width/2-stage.left,y1=src.top-stage.top+src.height/2,y2=r.top-stage.top+r.height/2;const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',`M ${x1} ${y1} Q ${(x1+x2)/2} ${Math.max(12,y1-70*w)} ${x2} ${y2}`);path.setAttribute('fill','none');path.setAttribute('stroke',`rgba(150,231,189,${.12+.78*w})`);path.setAttribute('stroke-width',String(1+5*w));svg.appendChild(path)});const hint=document.querySelector('#attentionHint');if(hint)hint.textContent=`“${att[i].textContent}”가 다른 단어를 얼마나 참고하는지 선의 굵기와 밝기로 표현한 예시입니다.`}
att.forEach((b,i)=>b.onclick=()=>drawAttention(i));addEventListener('resize',()=>{const hot=att.findIndex(b=>b.classList.contains('hot'));if(hot>=0)drawAttention(hot)});

// Diffusion toy
const noise=document.querySelector('#noiseGrid');if(noise){for(let i=0;i<128;i++)noise.appendChild(document.createElement('i'))}
function drawNoise(v){if(!noise)return;[...noise.children].forEach((x,i)=>{const col=i%16,row=Math.floor(i/16),cx=7.5,cy=3.5,dist=Math.hypot(col-cx,(row-cy)*1.6),shape=Math.max(0,1-dist/7),rnd=Math.random(),mix=v/100,br=Math.floor(20+rnd*110*(1-mix)+shape*170*mix);x.style.background=`rgb(${br},${Math.min(235,br+20)},${Math.min(220,br+10)})`})}
const denoise=document.querySelector('#denoise');if(denoise){denoise.oninput=()=>drawNoise(+denoise.value);drawNoise(0)}

// Next-token demo
document.querySelectorAll('.token-options button').forEach(b=>b.onclick=()=>{const n=document.querySelector('#nextToken');if(n)n.textContent=b.dataset.token});const temp=document.querySelector('#temperature');if(temp)temp.oninput=e=>{const t=(e.target.value/10).toFixed(1),out=document.querySelector('#tempText');if(out)out.textContent=t<.5?`${t} — 안정적이지만 뻔한 선택.`:t<1?`${t} — 안정성과 다양성의 균형.`:`${t} — 더 의외롭지만 실수도 늘어난다.`};

// Presentation navigation
let navLock=false;document.addEventListener('keydown',e=>{if(['INPUT','TEXTAREA','BUTTON'].includes(document.activeElement?.tagName))return;if(['ArrowDown','PageDown',' '].includes(e.key)){e.preventDefault();if(navLock)return;navLock=true;scrollTo({top:scrollY+innerHeight*.9,behavior:'smooth'});setTimeout(()=>navLock=false,350)}if(['ArrowUp','PageUp'].includes(e.key)){e.preventDefault();if(navLock)return;navLock=true;scrollTo({top:scrollY-innerHeight*.9,behavior:'smooth'});setTimeout(()=>navLock=false,350)}});
