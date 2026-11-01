'use strict';
// LOCAL-ONLY PROTOTYPE. Memory-only sessions, fake users, fake issuer, no payment rails.
const http=require('node:http');
const {randomUUID,randomBytes,timingSafeEqual,createHash}=require('node:crypto');
const {FictionalIssuerAdapter,PROGRAMS}=require('./issuer-adapter');
const adapter=new FictionalIssuerAdapter();
const users=new Map(), sessions=new Map(), grants=new Map(), linkSessions=new Map(), events=[];
const MAX_BODY=4096, TTL=15*60*1000;
function hash(s){return createHash('sha256').update(s).digest('hex')}
function fail(res,code,error){res.writeHead(code,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify({error,mode:'FICTIONAL_DEMO'}))}
function send(res,code,data){res.writeHead(code,{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify({mode:'FICTIONAL_DEMO',...data}))}
function audit(type,userId,details={}){events.push({id:randomUUID(),type,userId,time:new Date().toISOString(),...details});if(events.length>1000)events.shift()}
function cleanExpired(){for(const [k,v] of sessions)if(v.expires<Date.now())sessions.delete(k);for(const [k,v] of linkSessions)if(v.expires<Date.now())linkSessions.delete(k)}
function body(req){return new Promise((resolve,reject)=>{let size=0,buf='';req.on('data',c=>{size+=c.length;if(size>MAX_BODY){reject(Object.assign(new Error('Payload too large'),{status:413}));req.destroy();return}buf+=c});req.on('end',()=>{try{resolve(buf?JSON.parse(buf):{})}catch{reject(Object.assign(new Error('Invalid JSON'),{status:400}))}});req.on('error',reject)})}
function exactKeys(obj,keys){return obj&&typeof obj==='object'&&!Array.isArray(obj)&&Object.keys(obj).every(k=>keys.includes(k))}
function auth(req){const h=req.headers.authorization||'';if(!h.startsWith('Bearer '))return null;const key=hash(h.slice(7));const session=sessions.get(key);if(!session||session.expires<Date.now())return null;return session}
function ensureDemoOnly(obj){const serialized=JSON.stringify(obj).toLowerCase();return !/("(pin|pan|ssn|dob|cardnumber|card_number|password|medicalrecord|access_token|refresh_token)"\s*:)/.test(serialized)}
async function handle(req,res){
  res.setHeader('Access-Control-Allow-Origin','null'); // local file demos only; no wildcard credential access
  if(req.method==='OPTIONS')return fail(res,405,'Unsupported method');
  cleanExpired();const path=new URL(req.url,'http://localhost').pathname;
  if(req.method==='GET'&&path==='/health')return send(res,200,{ok:true,issuerConnected:false,paymentsEnabled:false});
  let data={};if(['POST','DELETE'].includes(req.method)){try{data=await body(req)}catch(e){return fail(res,e.status||400,'Invalid request body')}}
  if(!ensureDemoOnly(data))return fail(res,400,'Sensitive credentials are prohibited');
  if(req.method==='POST'&&path==='/v1/demo/sessions'){
    if(!exactKeys(data,[])||Object.keys(data).length)return fail(res,400,'This endpoint accepts no personal information');
    const userId=randomUUID(),token=randomBytes(32).toString('base64url');users.set(userId,{displayName:'Diana Prince (Demo)'});
    sessions.set(hash(token),{userId,expires:Date.now()+TTL});audit('demo.session.created',userId);
    return send(res,201,{sessionToken:token,expiresInSeconds:TTL/1000,user:{displayName:'Diana Prince (Demo)'},warning:'Ephemeral, unauthenticated demo session. Not a secure user login.'});
  }
  const session=auth(req);if(!session)return fail(res,401,'Demo session required');const userId=session.userId;
  if(req.method==='GET'&&path==='/v1/wallet/cards'){
    const cards=[];for(const grant of grants.values())if(grant.userId===userId&&grant.active)cards.push({id:grant.id,program:grant.program,issuer:'FICTIONAL_ISSUER',scope:['benefits:read'],status:'LINKED_DEMO'});
    return send(res,200,{cards});
  }
  if(req.method==='POST'&&path==='/v1/issuer/link-sessions'){
    if(!exactKeys(data,['program'])||!PROGRAMS.includes(data.program))return fail(res,400,'Only supported program is accepted');
    const state=randomBytes(24).toString('base64url');const started=await adapter.startAuthorization(data.program,state);
    linkSessions.set(started.sessionId,{userId,program:data.program,stateHash:hash(state),expires:Date.now()+5*60*1000});audit('issuer.link.started',userId,{program:data.program});
    return send(res,201,{sessionId:started.sessionId,program:data.program,status:started.status,authorizationUrl:null,issuerConnected:false,state,warning:'State is a demo nonce. In production, issuer auth occurs in an approved browser redirect.'});
  }
  if(req.method==='POST'&&path==='/v1/issuer/demo-approve'){
    if(!exactKeys(data,['sessionId','state','approved'])||typeof data.sessionId!=='string'||typeof data.state!=='string'||data.approved!==true)return fail(res,400,'Invalid demo approval');
    const link=linkSessions.get(data.sessionId);
    if(!link||link.userId!==userId||link.expires<Date.now())return fail(res,404,'Link session unavailable');
    const actual=Buffer.from(hash(data.state)),expected=Buffer.from(link.stateHash);
    if(actual.length!==expected.length||!timingSafeEqual(actual,expected))return fail(res,403,'Invalid link state');
    linkSessions.delete(data.sessionId);const issued=await adapter.completeAuthorization({program:link.program},true);
    const grant={id:issued.grantId,userId,program:link.program,active:true,created:new Date().toISOString()};grants.set(grant.id,grant);audit('issuer.link.approved.demo',userId,{program:link.program});
    return send(res,201,{card:{id:grant.id,program:grant.program,status:'LINKED_DEMO'},warning:'No issuer authenticated the user; no real card was linked.'});
  }
  const cardPath=path.match(/^\/v1\/wallet\/cards\/([a-f0-9-]{36})(?:\/benefits)?$/);
  if(cardPath){const grant=grants.get(cardPath[1]);if(!grant||!grant.active||grant.userId!==userId)return fail(res,404,'Card not found');
    if(req.method==='GET'&&path.endsWith('/benefits')){audit('issuer.benefits.read.demo',userId,{program:grant.program});return send(res,200,{benefits:await adapter.getBenefits(grant)})}
    if(req.method==='DELETE'&&!path.endsWith('/benefits')){if(Object.keys(data).length)return fail(res,400,'No request body allowed');await adapter.revoke(grant);grant.active=false;audit('issuer.link.revoked.demo',userId,{program:grant.program});return send(res,200,{revoked:true})}
  }
  if(req.method==='GET'&&path==='/v1/audit/events')return send(res,200,{events:events.filter(e=>e.userId===userId).map(({id,type,time,program})=>({id,type,time,program}))});
  if(req.method==='POST'&&path==='/v1/demo/logout'){if(Object.keys(data).length)return fail(res,400,'No request body allowed');sessions.delete(hash(req.headers.authorization.slice(7)));audit('demo.session.ended',userId);return send(res,200,{loggedOut:true})}
  return fail(res,404,'Not found');
}
function createServer(){return http.createServer((req,res)=>{handle(req,res).catch(()=>fail(res,500,'Internal demo error'))})}
if(require.main===module){const port=Number(process.env.PORT||4200);createServer().listen(port,'127.0.0.1',()=>console.log(`BronzeManna fictional issuer API on http://127.0.0.1:${port}`))}
module.exports={createServer};
