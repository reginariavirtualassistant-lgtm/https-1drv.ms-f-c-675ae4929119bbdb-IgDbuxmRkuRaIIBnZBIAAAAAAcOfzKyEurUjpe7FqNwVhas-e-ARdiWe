'use strict';
const {test,after}=require('node:test');const assert=require('node:assert/strict');const {createServer}=require('../src/server');
const server=createServer();let base;
async function ready(){if(base)return;base=await new Promise(resolve=>server.listen(0,'127.0.0.1',()=>resolve('http://127.0.0.1:'+server.address().port)))}
after(()=>server.close());
async function req(method,path,body,token){await ready();const r=await fetch(base+path,{method,headers:{...(token?{Authorization:'Bearer '+token}:{}),...(body!==undefined?{'Content-Type':'application/json'}:{})},...(body!==undefined?{body:JSON.stringify(body)}:{})});return {status:r.status,data:await r.json()}}
test('health confirms no issuer and no payments',async()=>{const r=await req('GET','/health');assert.equal(r.data.issuerConnected,false);assert.equal(r.data.paymentsEnabled,false)});
test('rejects personal information and credentials',async()=>{assert.equal((await req('POST','/v1/demo/sessions',{name:'Real Person'})).status,400);assert.equal((await req('POST','/v1/demo/sessions',{pin:'1234'})).status,400)});
test('session required for wallet endpoints',async()=>{assert.equal((await req('GET','/v1/wallet/cards')).status,401)});
test('link, view benefits, revoke, audit and isolate accounts',async()=>{
 const a=(await req('POST','/v1/demo/sessions',{})).data.sessionToken;
 const b=(await req('POST','/v1/demo/sessions',{})).data.sessionToken;
 assert.equal((await req('POST','/v1/issuer/link-sessions',{program:'SNAP / EBT',cardNumber:'123'},a)).status,400);
 const link=await req('POST','/v1/issuer/link-sessions',{program:'SNAP / EBT'},a);assert.equal(link.status,201);
 assert.equal((await req('POST','/v1/issuer/demo-approve',{sessionId:link.data.sessionId,state:'wrong',approved:true},a)).status,403);
 assert.equal((await req('POST','/v1/issuer/demo-approve',{sessionId:link.data.sessionId,state:link.data.state,approved:true},b)).status,404);
 const done=await req('POST','/v1/issuer/demo-approve',{sessionId:link.data.sessionId,state:link.data.state,approved:true},a);assert.equal(done.status,201);
 const id=done.data.card.id;
 assert.equal((await req('GET','/v1/wallet/cards',undefined,a)).data.cards.length,1);
 assert.equal((await req('GET','/v1/wallet/cards',undefined,b)).data.cards.length,0);
 assert.equal((await req('GET',`/v1/wallet/cards/${id}/benefits`,undefined,b)).status,404);
 assert.equal((await req('GET',`/v1/wallet/cards/${id}/benefits`,undefined,a)).data.benefits.balance.amount,428.5);
 assert.equal((await req('POST','/v1/issuer/demo-approve',{sessionId:link.data.sessionId,state:link.data.state,approved:true},a)).status,404);
 assert.equal((await req('DELETE',`/v1/wallet/cards/${id}`,{},a)).status,200);
 assert.equal((await req('GET',`/v1/wallet/cards/${id}/benefits`,undefined,a)).status,404);
 assert.ok((await req('GET','/v1/audit/events',undefined,a)).data.events.length>=4);
 assert.equal((await req('POST','/v1/demo/logout',{},a)).status,200);
 assert.equal((await req('GET','/v1/wallet/cards',undefined,a)).status,401);
});
test('Medicaid coverage is not a cash balance',async()=>{const token=(await req('POST','/v1/demo/sessions',{})).data.sessionToken;const x=(await req('POST','/v1/issuer/link-sessions',{program:'Medicaid'},token)).data;const y=(await req('POST','/v1/issuer/demo-approve',{sessionId:x.sessionId,state:x.state,approved:true},token)).data;const z=(await req('GET',`/v1/wallet/cards/${y.card.id}/benefits`,undefined,token)).data.benefits;assert.equal(z.kind,'coverage');assert.equal(z.balance,undefined);assert.equal(z.allowance.status,'NOT_CONNECTED')});
