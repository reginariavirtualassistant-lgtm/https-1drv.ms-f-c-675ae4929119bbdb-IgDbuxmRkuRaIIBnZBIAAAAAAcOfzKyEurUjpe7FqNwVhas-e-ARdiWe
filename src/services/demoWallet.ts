import type {Program} from './benefitLinking.ts';
export type DemoItem = 'Eligible groceries' | 'WIC sample food' | 'Household supplies';
export const demoItems: DemoItem[] = ['Eligible groceries', 'WIC sample food', 'Household supplies'];
export type Receipt = {id: string; program: Program; item: DemoItem; cents: number};
export type Wallet = {snapCents: number; tanfCents: number; wicItems: number; receipts: Receipt[]};
export const initialWallet = (): Wallet => ({snapCents:42850,tanfCents:18500,wicItems:8,receipts:[]});
export function simulatePurchase(wallet: Wallet, request: {program: Program; item: DemoItem; cents: number; linked: boolean; approve: boolean}): {wallet: Wallet; message: string; approved: boolean} {
  const decline = (message: string) => ({wallet, message, approved:false});
  if (!request.linked) return decline('Link this fictional card first.');
  if (!request.approve) return decline('Simulated processor decline. No balance changed.');
  if (!Number.isSafeInteger(request.cents) || request.cents <= 0) return decline('Choose a positive fictional amount in cents.');
  if (!demoItems.includes(request.item)) return decline('Unknown fictional product.');
  if (request.program === 'SNAP / EBT' && request.item !== 'Eligible groceries') return decline('Demo SNAP allows the eligible groceries example only.');
  if (request.program === 'WIC' && request.item !== 'WIC sample food') return decline('Demo WIC allows the sample food example only.');
  const next = {...wallet};
  if (request.program === 'WIC') {
    if (wallet.wicItems < 1) return decline('No fictional WIC items remain.');
    next.wicItems--;
  } else {
    if (request.program !== 'SNAP / EBT' && request.program !== 'TANF') return decline('Unsupported fictional program.');
    const key = request.program === 'SNAP / EBT' ? 'snapCents' : 'tanfCents';
    if (wallet[key] < request.cents) return decline('Insufficient fictional balance.');
    next[key] -= request.cents;
  }
  const id = `DEMO-RECEIPT-${wallet.receipts.length + 1}`;
  next.receipts = [...wallet.receipts, {id, program:request.program, item:request.item, cents:request.program === 'WIC' ? 0 : request.cents}];
  return {wallet:next, message:`Simulated approval · ${id} · No real payment`, approved:true};
}
export function planSpend(balanceCents: number, weeks: number): number {
  if (!Number.isSafeInteger(balanceCents) || balanceCents < 0 || !Number.isInteger(weeks) || weeks < 1 || weeks > 8) throw new Error('Invalid fictional budget');
  return Math.floor(balanceCents / weeks);
}
