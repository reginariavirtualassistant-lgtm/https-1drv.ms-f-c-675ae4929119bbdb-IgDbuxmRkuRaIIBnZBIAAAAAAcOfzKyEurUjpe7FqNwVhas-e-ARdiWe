// LOCAL DEMO SERVER ONLY. No real issuer integration, card collection or payments.
const http = require('node:http');
const crypto = require('node:crypto');
const allowed = new Set(['SNAP','WIC','TANF']);
const server = http.createServer((req,res)=>{
  res.setHeader('Content-Type','application/json');
  res.setHeader('Cache-Control','no-store');
  if(req.url==='/health' && req.method==='GET') return res.end(JSON.stringify({ok:true,mode:'DEMO'}));
  if(req.url==='/v1/card-link-sessions' && req.method==='POST'){
    let body=''; req.on('data',chunk=>{body+=chunk;if(body.length>2048)req.destroy()});
    return req.on('end',()=>{
      let data;try{data=JSON.parse(body)}catch{return fail(400,'Invalid JSON')}
      if(!allowed.has(data.program))return fail(400,'Invalid program');
      // Never accept card number, PIN, SSN, DOB, or identity uploads.
      if(Object.keys(data).some(k=>k!=='program'))return fail(400,'Only program is accepted');
      return res.end(JSON.stringify({mode:'DEMO',sessionId:crypto.randomUUID(),status:'SIMULATED_ONLY',authorizationUrl:null,issuerConnected:false}));
    });
  }
  return fail(404,'Not found');
  function fail(code,message){res.statusCode=code;res.end(JSON.stringify({error:message}))}
});
if(require.main===module)server.listen(4100,'127.0.0.1',()=>console.log('BronzeManna local mock API: http://127.0.0.1:4100'));
module.exports=server;
