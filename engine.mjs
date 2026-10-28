const clamp = (n,a,b) => Math.max(a,Math.min(b,n));
const distance = (a,b) => Math.hypot(a.x-b.x,a.y-b.y);
const formation = [[5,34],[24,9],[21,26],[21,42],[24,59],[42,18],[38,34],[42,50],[63,10],[65,34],[63,58]];
const surnames = ['Portiere','Terzino D','Centrale D','Centrale S','Terzino S','Mezzala D','Regista','Mezzala S','Ala D','Punta','Ala S'];
export class Match {
  constructor(seed=2026){this.seed=seed;this.reset();}
  random(){this.seed=(Math.imul(1664525,this.seed)+1013904223)>>>0;return this.seed/4294967296;}
  reset(){
    this.seed=2026;this.time=0;this.elapsed=0;this.half=1;this.finished=false;this.score=[0,0];this.shots=[0,0];this.onTarget=[0,0];this.passes=[0,0];this.possession=[0,0];this.events=[];this.flight=null;this.cooldown=2;this.hold=0;this.mentality='balanced';this.pressing=1;
    this.players=[0,1].flatMap(team=>formation.map(([x,y],i)=>({team,number:i+1,role:surnames[i],baseX:x,baseY:y,x:team?105-x:x,y,phase:this.random()*6.28})));
    this.owner=9;this.ball={x:this.players[9].x,y:this.players[9].y};this.event('Calcio d’inizio. I Bianchi muovono il primo pallone.','kickoff');
  }
  direction(team){return (team===0?1:-1)*(this.half===1?1:-1);}
  event(text,type='play'){this.events.unshift({time:this.time,text,type,id:(this.eventId=(this.eventId||0)+1)});this.events=this.events.slice(0,30);}
  kickoff(team){
    this.flight=null;this.owner=team*11+9;this.hold=0;this.cooldown=2;
    for(const p of this.players){p.x=this.direction(p.team)>0?p.baseX:105-p.baseX;p.y=p.baseY;}
    this.players[this.owner].x=52.5;this.players[this.owner].y=34;
    this.ball={x:52.5,y:34};
  }
  update(dt){
    if(this.finished||dt<=0)return;
    dt=Math.min(dt,.05);this.elapsed+=dt;this.time=Math.min(5400,this.time+dt*12);
    if(this.half===1&&this.time>=2700){this.half=2;this.kickoff(1);this.event('Secondo tempo: le squadre si scambiano il campo.','half');}
    if(this.time>=5400){this.finished=true;this.flight=null;this.event('Triplice fischio. La partita è terminata.','end');return;}
    const carrier=this.players[this.owner];const team=this.flight?this.flight.team:carrier.team;this.possession[team]+=dt;this.hold+=dt;this.cooldown-=dt;
    const dir=this.direction(team);const progress=(this.ball.x-52.5)*dir;
    for(const p of this.players){
      const ownDir=this.direction(p.team);const base=ownDir>0?p.baseX:105-p.baseX;
      let tx=base,ty=p.baseY;
      if(p.number===1){tx=ownDir>0?4:101;ty=clamp(34+(this.ball.y-34)*.23,27,41);}
      else {
        const attacking=p.team===team;const mental=p.team===0?(this.mentality==='attacking'?8:this.mentality==='defensive'?-7:0):0;
        tx=base+ownDir*(attacking?clamp(progress*.45+7+mental,-8,24):clamp(-progress*.35-3,-18,12));
        ty=p.baseY+(this.ball.y-34)*.16+Math.sin(this.elapsed*.8+p.phase)*2;
        if(p===carrier&&!this.flight){tx=p.x+ownDir*9;ty=34+(p.y-34)*.91;}
        if(!attacking){
          const pressure=p.team===0?this.pressing:1;
          if(distance(p,this.ball)<10+pressure*5){tx=this.ball.x-ownDir*1.4;ty=this.ball.y;}
        }
      }
      tx=clamp(tx,2,103);ty=clamp(ty,3,65);const d=Math.hypot(tx-p.x,ty-p.y);const speed=p.number===1?4.5:!this.flight&&p===carrier?4:5.6;
      if(d>.05){const step=Math.min(d,speed*dt);p.x+=(tx-p.x)/d*step;p.y+=(ty-p.y)/d*step;}
    }
    if(this.flight){
      const f=this.flight;f.t+=dt;const t=clamp(f.t/f.duration,0,1);const target=f.target===null?f.end:this.players[f.target];this.ball.x=f.start.x+(target.x-f.start.x)*t;this.ball.y=f.start.y+(target.y-f.start.y)*t;
      if(t===1){
        this.flight=null;
        if(f.type==='shot'){
          if(f.goal){this.score[f.team]++;this.event(`Gol dei ${f.team===0?'Bianchi':'Rossi'}! Il numero ${f.shooter} trova la rete.`,'goal');this.kickoff(1-f.team);this.cooldown=3;}
          else{this.owner=(1-f.team)*11;this.cooldown=1.5;this.hold=0;this.event(f.saved?'Il portiere respinge e controlla il pallone.':'Tiro fuori. Si riparte dal portiere.','shot');}
        }else{
          this.owner=f.target;this.hold=0;this.cooldown=.8+this.random()*1.2;
          if(f.intercepted)this.event(`I ${this.players[f.target].team===0?'Bianchi':'Rossi'} intercettano il passaggio.`,'turnover');else this.passes[f.team]++;
        }
      }
      return;
    }
    this.ball.x=carrier.x+dir*1.1;this.ball.y=carrier.y+.2;
    if(this.cooldown>0)return;
    const nearest=this.players.filter(p=>p.team!==carrier.team&&p.number!==1).sort((a,b)=>distance(a,carrier)-distance(b,carrier))[0];
    if(distance(nearest,carrier)<2&&this.random()<.4){this.owner=this.players.indexOf(nearest);this.hold=0;this.cooldown=1.2;this.event(`Recupero dei ${nearest.team===0?'Bianchi':'Rossi'}: riparte l’azione.`,'turnover');return;}
    const advance=dir>0?carrier.x:105-carrier.x;
    if(carrier.number!==1&&(advance>78||(advance>65&&this.hold>5))){this.shoot(carrier);return;}
    this.pass(carrier);
  }
  pass(carrier){
    const team=carrier.team,dir=this.direction(team);
    const candidates=this.players.filter(p=>p.team===team&&p!==carrier&&p.number!==1).map(p=>({p,value:(p.x-carrier.x)*dir*.9-distance(p,carrier)*.3+this.random()*22})).sort((a,b)=>b.value-a.value);
    let target=candidates[0].p;let intercepted=false;
    if(this.random()<.12){const opponents=this.players.filter(p=>p.team!==team&&p.number!==1).sort((a,b)=>distance(a,target)-distance(b,target));if(distance(opponents[0],target)<13){target=opponents[0];intercepted=true;}}
    this.flight={type:'pass',team,target:this.players.indexOf(target),intercepted,start:{...this.ball},t:0,duration:Math.max(.22,distance(carrier,target)/29)};
    if(!intercepted&&this.random()<.25)this.event(`${team===0?'Bianchi':'Rossi'} in costruzione: passaggio dal ${carrier.number} al ${target.number}.`);
  }
  shoot(carrier){
    const team=carrier.team;this.shots[team]++;const accurate=this.random()<.63;const goal=accurate&&this.random()<.34;if(accurate)this.onTarget[team]++;
    this.flight={type:'shot',team,target:null,start:{...this.ball},end:{x:this.direction(team)>0?105:0,y:accurate?31+this.random()*6:24+this.random()*20},t:0,duration:.65,goal,saved:accurate,shooter:carrier.number};
    this.event(`Il numero ${carrier.number} dei ${team===0?'Bianchi':'Rossi'} cerca la porta!`,'shot');
  }
}
