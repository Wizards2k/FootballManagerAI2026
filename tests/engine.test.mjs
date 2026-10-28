import test from 'node:test';
import assert from 'node:assert/strict';
import {Match,TEMPO} from '../engine.mjs';
test('una partita completa conserva giocatori, coordinate e statistiche valide',()=>{
  const m=new Match();let flipped=false;
  for(let i=0;i<325000&&!m.finished;i++){
    m.update(1/60);
    assert.equal(m.players.length,22);
    for(const p of m.players){assert.ok(Number.isFinite(p.x)&&p.x>=0&&p.x<=105);assert.ok(Number.isFinite(p.y)&&p.y>=0&&p.y<=68);}
    assert.ok(Number.isFinite(m.ball.x)&&Number.isFinite(m.ball.y));
    if(m.half===2){flipped=true;assert.equal(m.direction(0),-1);}
  }
  assert.ok(flipped);assert.ok(m.finished);assert.equal(m.time,5400);
  assert.ok(m.passes.every(n=>n>0));assert.ok(m.shots.every(n=>n>0));
  for(let t=0;t<2;t++){assert.ok(m.score[t]<=m.onTarget[t]);assert.ok(m.onTarget[t]<=m.shots[t]);}
  const time=m.time;m.update(1);assert.equal(m.time,time);
});
test('il tempo base è reale e accelerazione e velocità della palla sono limitate',()=>{
  const m=new Match(),dt=1/60;
  for(let i=0;i<60;i++){
    const before=m.players.map(p=>({vx:p.vx,vy:p.vy}));m.update(dt);
    m.players.forEach((p,j)=>{assert.ok(Math.hypot(p.vx-before[j].vx,p.vy-before[j].vy)<=TEMPO.acceleration*dt+1e-9);});
  }
  assert.ok(Math.abs(m.time-1)<1e-9);
  m.pass(m.players[m.owner]);const before={...m.ball};m.update(dt);
  assert.ok(Math.abs(Math.hypot(m.ball.x-before.x,m.ball.y-before.y)-TEMPO.passSpeed*dt)<1e-9);
});
test('ripristino e tattiche producono uno stato coerente',()=>{
  const a=new Match(),b=new Match();a.mentality='attacking';a.pressing=2;
  for(let i=0;i<500;i++){a.update(1/60);b.update(1/60);}
  assert.notDeepEqual(a.players,b.players);a.reset();assert.equal(a.time,0);assert.deepEqual(a.score,[0,0]);assert.equal(a.owner,9);assert.equal(a.events.length,1);
});
