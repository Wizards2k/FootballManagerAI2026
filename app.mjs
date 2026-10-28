import { Match } from './engine.mjs';
import { PITCH, PLAYER, BALL, pitchViewport } from './geometry.mjs';
const $=id=>document.getElementById(id);
const match=new Match();let paused=false,speed=1,last=0,accumulator=0,lastEvent=0,selected=null;const trail=[];
const canvas=$('pitch'),ctx=canvas.getContext('2d');
const colors=['#f5f3e9','#ed675e'];let view={};
function pitch(){
  const w=canvas.clientWidth,h=canvas.clientHeight,dpr=window.devicePixelRatio||1;
  if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
  const {s,ox,oy}=pitchViewport(w,h);view={s,ox,oy};
  ctx.save();ctx.translate(ox,oy);ctx.scale(s,s);
  ctx.fillStyle='#315b37';ctx.fillRect(0,0,105,68);
  for(let i=0;i<10;i++){ctx.fillStyle=i%2?'#345f3a':'#305735';ctx.fillRect(i*10.5,0,10.5,68);}
  ctx.strokeStyle='#b5cda0aa';ctx.lineWidth=PITCH.lineWidth;
  const rect=(x,y,w,h)=>ctx.strokeRect(x,y,w,h),circle=(x,y,r)=>{ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.stroke();};
  rect(0,0,105,68);ctx.beginPath();ctx.moveTo(52.5,0);ctx.lineTo(52.5,68);ctx.stroke();circle(52.5,34,9.15);
  for(const left of [true,false]){
    rect(left?0:88.5,13.84,16.5,40.32);rect(left?0:99.5,24.84,5.5,18.32);
    const px=left?11:94;circle(px,34,.22);
    ctx.beginPath();ctx.arc(px,34,9.15,left?-0.93:Math.PI-.93,left?.93:Math.PI+.93);ctx.stroke();
    ctx.fillStyle='#dbe3d00b';ctx.fillRect(left?-2.2:105,30.34,2.2,7.32);ctx.strokeStyle='#cedac5aa';rect(left?-2.2:105,30.34,2.2,7.32);
    ctx.lineWidth=.06;for(let j=1;j<7;j++){ctx.beginPath();ctx.moveTo(left?-2.2:105,30.34+j);ctx.lineTo(left?0:107.2,30.34+j);ctx.stroke();}ctx.lineWidth=PITCH.lineWidth;ctx.strokeStyle='#b5cda0aa';
  }
  circle(52.5,34,.25);
  for(const [x,y,start] of [[0,0,0],[105,0,Math.PI/2],[105,68,Math.PI],[0,68,Math.PI*1.5]]){ctx.beginPath();ctx.arc(x,y,1,start,start+Math.PI/2);ctx.stroke();}
  if($('trails').checked&&trail.length>1){for(let i=1;i<trail.length;i++){ctx.strokeStyle=`rgba(255,246,204,${i/trail.length*.35})`;ctx.lineWidth=.06;ctx.beginPath();ctx.moveTo(trail[i-1].x,trail[i-1].y);ctx.lineTo(trail[i].x,trail[i].y);ctx.stroke();}}
  for(const p of [...match.players].sort((a,b)=>a.y-b.y)){
    const chosen=p===selected;const carrier=match.players[match.owner]===p&&!match.flight;
    if(carrier||chosen){ctx.strokeStyle=chosen?'#f6d783':'#ffffff70';ctx.lineWidth=1/s;circle(p.x,p.y,PLAYER.radius+3/s);}
    ctx.fillStyle='#0b1d1f55';ctx.beginPath();ctx.ellipse(p.x+.08,p.y+.15,PLAYER.radius,.16,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=p.number===1?(p.team===0?'#e8cb6b':'#8cb9e3'):colors[p.team];ctx.strokeStyle=p.team===0?'#29342c':'#652d2a';ctx.lineWidth=.04;
    // Inset the stroke so the OUTER diameter remains exactly 0.65 m.
    ctx.beginPath();ctx.arc(p.x,p.y,PLAYER.radius-ctx.lineWidth/2,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.textAlign='center';ctx.textBaseline='middle';
    if(PLAYER.diameter*s>=12){ctx.fillStyle=p.team===0?'#1c3027':'#fff4e9';ctx.font=`bold ${PLAYER.diameter*.52}px Arial`;ctx.fillText(p.number,p.x,p.y);}
    if($('names').checked||chosen){const fontSize=10/s;ctx.font=`${fontSize}px Arial`;const label=`${p.team===0?'B':'R'}${p.number} · ${p.role}`;const tw=ctx.measureText(label).width;const ly=p.y+PLAYER.radius+8/s;ctx.fillStyle='#15251ed9';ctx.fillRect(p.x-tw/2-3/s,ly-7/s,tw+6/s,14/s);ctx.fillStyle='#f5f4df';ctx.fillText(label,p.x,ly);}
  }
  ctx.fillStyle='#fff9d7';ctx.strokeStyle='#24312b';ctx.lineWidth=.015;ctx.beginPath();ctx.arc(match.ball.x,match.ball.y,BALL.radius-ctx.lineWidth/2,0,Math.PI*2);ctx.fill();ctx.stroke();
  // A ten-metre ruler gives a visual reference at every screen size.
  ctx.strokeStyle='#adc49c';ctx.lineWidth=1/s;ctx.beginPath();ctx.moveTo(0,71);ctx.lineTo(10,71);ctx.moveTo(0,70.6);ctx.lineTo(0,71.4);ctx.moveTo(10,70.6);ctx.lineTo(10,71.4);ctx.stroke();ctx.fillStyle='#adc49c';ctx.textAlign='left';ctx.font=`${9/s}px Arial`;ctx.fillText('10 m',12,71);
  if(paused){ctx.fillStyle='#12251b88';ctx.fillRect(0,0,105,68);ctx.fillStyle='#f5f3e9';ctx.textAlign='center';ctx.font='bold 3px Arial';ctx.fillText('PARTITA IN PAUSA',52.5,34);}
  ctx.restore();
}
function minute(t){return `${String(Math.floor(t/60)).padStart(2,'0')}:${String(Math.floor(t%60)).padStart(2,'0')}`;}
function ui(){
  $('clock').textContent=minute(match.time);$('period').textContent=match.finished?'FINE PARTITA':`${match.half}° TEMPO`;
  const ends=document.querySelectorAll('.pitch-bottom span');ends[0].textContent=match.half===1?'BIANCHI →':'ROSSI →';ends[1].textContent=match.half===1?'← ROSSI':'← BIANCHI';
  for(const [id,value] of Object.entries({homeScore:match.score[0],awayScore:match.score[1],shotsHome:match.shots[0],shotsAway:match.shots[1],targetHome:match.onTarget[0],targetAway:match.onTarget[1],passesHome:match.passes[0],passesAway:match.passes[1]}))$(id).textContent=value;
  const total=match.possession[0]+match.possession[1];const percent=total?Math.round(match.possession[0]/total*100):50;
  $('possHome').innerHTML=`${percent}<span>%</span>`;$('possAway').innerHTML=`${100-percent}<span>%</span>`;$('possBar').style.width=percent+'%';
  const ev=match.events[0];if(ev.id!==lastEvent){lastEvent=ev.id;$('commentary').textContent=ev.text;$('eventMinute').textContent=Math.floor(ev.time/60).toString().padStart(2,'0')+'′';$('events').replaceChildren(...match.events.slice(0,8).map(e=>{const li=document.createElement('li'),time=document.createElement('span');time.textContent=Math.floor(e.time/60)+'′';li.append(time,document.createTextNode(e.text));return li;}));}
  if(match.finished){$('play').textContent='↺';$('play').setAttribute('aria-label','Avvia una nuova partita');}
}
function frame(t){
  const delta=last?Math.min((t-last)/1000,.15):0;last=t;
  if(!paused&&!match.finished){accumulator+=delta*speed;while(accumulator>=1/60){match.update(1/60);accumulator-=1/60;}trail.push({...match.ball});if(trail.length>18)trail.shift();}
  pitch();ui();requestAnimationFrame(frame);
}
$('play').onclick=()=>{if(match.finished){reset();return;}paused=!paused;$('play').textContent=paused?'▶':'Ⅱ';$('play').setAttribute('aria-label',paused?'Riprendi la partita':'Metti in pausa');};
function reset(){const mentality=$('mentality').value,pressing=Number($('pressing').value);match.reset();match.mentality=mentality;match.pressing=pressing;paused=false;accumulator=0;trail.length=0;selected=null;$('play').textContent='Ⅱ';$('play').setAttribute('aria-label','Metti in pausa');}
$('reset').onclick=reset;
document.querySelectorAll('[data-speed]').forEach(button=>button.onclick=()=>{speed=Number(button.dataset.speed);document.querySelectorAll('[data-speed]').forEach(b=>{b.classList.toggle('selected',b===button);b.setAttribute('aria-pressed',String(b===button));});});
$('mentality').onchange=e=>{match.mentality=e.target.value;$('tacticNote').textContent={balanced:'Linee compatte e costruzione paziente.',attacking:'Baricentro più alto e più uomini in avanti.',defensive:'Baricentro basso e maggiore copertura.'}[match.mentality];};
$('pressing').oninput=e=>{match.pressing=Number(e.target.value);$('pressValue').textContent=['Basso','Medio','Alto'][match.pressing];};
$('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await $('pitchWrap').requestFullscreen();}catch{$('commentary').textContent='La modalità a schermo intero non è disponibile in questa anteprima.';}};
canvas.onclick=e=>{const rect=canvas.getBoundingClientRect(),x=(e.clientX-rect.left-view.ox)/view.s,y=(e.clientY-rect.top-view.oy)/view.s;selected=match.players.find(p=>Math.hypot(p.x-x,p.y-y)<2.3)||null;};
document.addEventListener('keydown',e=>{if(e.code==='Space'&&!['INPUT','SELECT','BUTTON'].includes(e.target.tagName)){e.preventDefault();$('play').click();}});
requestAnimationFrame(frame);
