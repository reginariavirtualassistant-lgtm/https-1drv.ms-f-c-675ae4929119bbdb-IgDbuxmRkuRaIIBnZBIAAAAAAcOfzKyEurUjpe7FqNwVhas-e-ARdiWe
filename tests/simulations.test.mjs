import {test} from 'node:test';
import assert from 'node:assert/strict';
import {authorizeFictionalCard,programs} from '../src/services/benefitLinking.ts';
import {initialWallet,simulatePurchase,planSpend} from '../src/services/demoWallet.ts';
for (const program of programs) test(`${program}: approve, decline and cancel fictional linking`,async()=>{
 const approved=await authorizeFictionalCard(program,'approved');
 assert.equal(approved.card.program,program); assert.match(approved.card.id,/^DEMO-/);
 for(const response of ['declined','cancelled']) {const r=await authorizeFictionalCard(program,response);assert.equal(r.status,response);assert.equal(r.card,undefined);}
 assert.deepEqual(await authorizeFictionalCard(program,'approved'),approved);
});
test('reject unsupported link input',async()=>{await assert.rejects(authorizeFictionalCard('REAL CARD','approved'));await assert.rejects(authorizeFictionalCard('WIC','unknown'));});
const request={program:'SNAP / EBT',item:'Eligible groceries',cents:1250,linked:true,approve:true};
test('approved SNAP and TANF debit cents without mutating the old wallet',()=>{
 for(const program of ['SNAP / EBT','TANF']) {const wallet=initialWallet();const result=simulatePurchase(wallet,{...request,program});assert.equal(result.approved,true);assert.equal(result.wallet[program==='TANF'?'tanfCents':'snapCents'],wallet[program==='TANF'?'tanfCents':'snapCents']-1250);assert.equal(wallet.receipts.length,0);assert.equal(result.wallet.receipts.length,1);}
});
test('WIC deducts an item, never cash',()=>{const wallet=initialWallet();const r=simulatePurchase(wallet,{...request,program:'WIC',item:'WIC sample food'});assert.equal(r.wallet.wicItems,7);assert.equal(r.wallet.snapCents,wallet.snapCents);assert.equal(r.wallet.receipts[0].cents,0);});
test('declines preserve balances and receipts',()=>{
 for(const override of [{linked:false},{approve:false},{cents:0},{cents:NaN},{cents:1.5},{cents:50000},{item:'Household supplies'},{program:'WIC',item:'Eligible groceries'},{program:'INVALID'}]) {
 const wallet=initialWallet();const r=simulatePurchase(wallet,{...request,...override});assert.equal(r.approved,false,JSON.stringify(override));assert.strictEqual(r.wallet,wallet);
 }
 const empty={...initialWallet(),wicItems:0};assert.equal(simulatePurchase(empty,{...request,program:'WIC',item:'WIC sample food'}).approved,false);
});
test('SmartSpend floors cents and validates time horizon',()=>{assert.equal(planSpend(42850,4),10712);assert.equal(planSpend(0,4),0);for(const n of [0,-1,9,1.5])assert.throws(()=>planSpend(42850,n));});
