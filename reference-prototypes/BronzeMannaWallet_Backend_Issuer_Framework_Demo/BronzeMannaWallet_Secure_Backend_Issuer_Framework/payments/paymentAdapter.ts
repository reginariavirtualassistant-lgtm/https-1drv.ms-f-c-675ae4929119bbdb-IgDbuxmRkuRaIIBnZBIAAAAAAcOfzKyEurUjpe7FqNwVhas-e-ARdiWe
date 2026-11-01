/** BronzeManna DEMO adapter. No NFC, issuer credentials, real money, or network access. */
export type PaymentProgram = 'SNAP / EBT' | 'WIC' | 'TANF';
export type PaymentState = 'idle' | 'authenticating' | 'ready-to-tap' | 'processing' | 'approved' | 'declined';
export type PaymentRequest = {program:PaymentProgram; item:string; amount:number; frozen:boolean; linked:boolean; balance:number; wicItems:number};
export type PaymentResult = {approved:boolean; reason:string; receiptId?:string};
export interface PaymentAdapter { authorize(request:PaymentRequest): Promise<PaymentResult> }
export function validateDemoPurchase(r:PaymentRequest):string|null {
  if(r.frozen) return 'Wallet is frozen';
  if(!r.linked) return 'Benefit card is not linked';
  if(!Number.isFinite(r.amount) || r.amount <= 0 || Math.round(r.amount*100) !== r.amount*100) return 'Invalid amount';
  if(r.program==='SNAP / EBT' && r.item!=='Eligible groceries') return 'Illustrative SNAP restriction: eligible groceries only';
  if(r.program==='WIC' && r.item!=='WIC sample food item') return 'Illustrative WIC restriction: sample WIC item only';
  if(r.program==='WIC' && r.wicItems<1) return 'No sample WIC items remaining';
  if(r.program!=='WIC' && r.amount>r.balance) return 'Insufficient fictional balance';
  return null;
}
export const demoPaymentAdapter:PaymentAdapter = {
 async authorize(request) {
   const reason=validateDemoPurchase(request);
   if(reason) return {approved:false,reason};
   return {approved:true,reason:'Simulated authorization only',receiptId:'DEMO-'+Date.now().toString(36).toUpperCase()};
 }
};
/** A production adapter must only be supplied by an authorized issuer/processor integration.
 * Never implement real NFC by broadcasting a static card number or collecting EBT PINs. */
