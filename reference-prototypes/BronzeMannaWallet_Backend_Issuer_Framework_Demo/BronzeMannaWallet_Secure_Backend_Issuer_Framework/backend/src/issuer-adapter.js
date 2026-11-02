'use strict';
const { randomUUID } = require('node:crypto');
const PROGRAMS = Object.freeze(['SNAP / EBT', 'WIC', 'TANF', 'Medicaid']);
const FIXTURES = Object.freeze({
  'SNAP / EBT': {kind:'food-benefit', balance:{amount:428.50,currency:'USD'}, cardSuffix:'4821'},
  'WIC': {kind:'food-quantity', benefits:{remainingSampleItems:8},cardSuffix:'1936'},
  'TANF': {kind:'cash-benefit',balance:{amount:185.00,currency:'USD'},cardSuffix:'7524'},
  'Medicaid': {kind:'coverage',coverage:{status:'ACTIVE_DEMO'},allowance:{status:'NOT_CONNECTED'},cardSuffix:'0000'}
});
class IssuerAdapter {
  async startAuthorization(_program,_state){throw new Error('not implemented')}
  async completeAuthorization(_session,_approval){throw new Error('not implemented')}
  async getBenefits(_grant){throw new Error('not implemented')}
  async revoke(_grant){throw new Error('not implemented')}
}
class FictionalIssuerAdapter extends IssuerAdapter {
  async startAuthorization(program,state){
    if(!PROGRAMS.includes(program))throw new Error('unsupported program');
    return {sessionId:randomUUID(),state,program,issuer:'FICTIONAL_ISSUER',authorizationUrl:null,status:'AWAITING_DEMO_APPROVAL'};
  }
  async completeAuthorization(session,approved){
    if(!approved)return {approved:false};
    return {approved:true,grantId:randomUUID(),program:session.program,scope:['benefits:read'],issuer:'FICTIONAL_ISSUER'};
  }
  async getBenefits(grant){return structuredClone({program:grant.program, ...FIXTURES[grant.program],source:'FICTIONAL_ISSUER',verified:false})}
  async revoke(_grant){return {revoked:true}}
}
module.exports={IssuerAdapter,FictionalIssuerAdapter,PROGRAMS};
