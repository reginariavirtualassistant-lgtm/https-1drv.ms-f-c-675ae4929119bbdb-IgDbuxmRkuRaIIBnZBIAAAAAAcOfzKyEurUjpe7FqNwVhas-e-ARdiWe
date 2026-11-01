import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {programs} from '../services/benefitLinking';
import type {DemoCard, Program} from '../services/benefitLinking';
import {demoItems, planSpend, simulatePurchase} from '../services/demoWallet';
import type {DemoItem, Wallet} from '../services/demoWallet';
export type FeatureScreen = 'Family Benefits Hub'|'Benefits Guardian'|'SmartSpend'|'Tap-to-Pay Demo'|'Wallet Activity';
const notices = [
 {id:'WIC-014',member:'Avery (fictional child)',program:'WIC',task:'Confirm sample nutrition appointment',due:'November 10, 2026'},
 {id:'MD-001',member:'Diana (fictional guardian)',program:'Medicaid',task:'Review sample renewal notice',due:'November 15, 2026'},
 {id:'SNAP-022',member:'Fictional household',program:'SNAP',task:'Review sample recertification checklist',due:'December 1, 2026'},
 {id:'TANF-003',member:'Diana (fictional guardian)',program:'TANF',task:'Review sample household update',due:'December 5, 2026'},
];
const money=(cents:number)=>`$${(cents/100).toFixed(2)}`;
export default function FeatureDemos({screen,wallet,cards,onWallet,go,completed,onCompleted}: {screen:FeatureScreen;wallet:Wallet;cards:DemoCard[];onWallet:(wallet:Wallet)=>void;go:(screen:FeatureScreen)=>void;completed:string[];onCompleted:(ids:string[])=>void}) {
 const [noticeId,setNoticeId]=useState(notices[0].id);
 const [weeks,setWeeks]=useState(4);
 const [program,setProgram]=useState<Program>('SNAP / EBT');
 const [item,setItem]=useState<DemoItem>('Eligible groceries');
 const [approve,setApprove]=useState(true);
 const [stage,setStage]=useState<'idle'|'confirm'|'ready'|'done'>('idle');
 const [message,setMessage]=useState('');
 const button=(label:string,action:()=>void)=><TouchableOpacity accessibilityRole="button" onPress={action} style={s.button}><Text style={s.white}>{label}</Text></TouchableOpacity>;
 const choice=(label:string,selected:boolean,action:()=>void)=><TouchableOpacity key={label} accessibilityRole="radio" accessibilityState={{selected}} onPress={action} style={[s.choice,selected&&s.selected]}><Text style={selected?s.white:s.text}>{label}</Text></TouchableOpacity>;
 const heading=(text:string)=><Text style={s.heading}>{text}</Text>;
 const summary=<View style={s.card}><Text style={s.text}>Fictional SNAP: {money(wallet.snapCents)} · TANF: {money(wallet.tanfCents)}</Text><Text style={s.text}>WIC: {wallet.wicItems} sample items · Medicaid: coverage concept, no cash balance</Text></View>;
 const reset=()=>{setStage('idle');setMessage('');};
 if(screen==='Family Benefits Hub') return <View>{heading('Family Benefits Hub')}<Text style={s.text}>Fictional household and action planner. Nothing is shared with an agency.</Text>{summary}{notices.map(n=><View key={n.id} style={s.card}>{heading(n.program)}<Text style={s.text}>{n.member}</Text><Text style={s.text}>{n.task} · {n.due}</Text><Text style={s.text}>Source: fictional notice {n.id}</Text>{button((completed.includes(n.id)?'Reopen':'Complete')+` ${n.program} demo task`,()=>onCompleted(completed.includes(n.id)?completed.filter(id=>id!==n.id):[...completed,n.id]))}</View>)}<Text style={s.text}>{notices.length-completed.length} open sample tasks</Text>{button('Open Benefits Guardian',()=>go('Benefits Guardian'))}</View>;
 if(screen==='Benefits Guardian') {const n=notices.find(n=>n.id===noticeId)!;return <View>{heading('Benefits Guardian')}<Text style={s.text}>Rule-based demo, not live AI. Choose a fictional notice; no uploads or personal information.</Text>{notices.map(n=>choice(n.program,n.id===noticeId,()=>setNoticeId(n.id)))}<View style={s.card}>{heading('Sample notice explanation')}<Text style={s.text}>{n.member}: {n.task} by {n.due}. This is a fictional reminder, not an eligibility decision or an official deadline.</Text><Text style={s.text}>Source: fictional notice {n.id}. Contact the relevant official agency for real instructions.</Text></View>{button('Open Family Benefits Hub',()=>go('Family Benefits Hub'))}</View>;}
 if(screen==='SmartSpend') return <View>{heading('SmartSpend')}<Text style={s.text}>Illustrative weekly budget using fictional balances. This does not determine eligibility or actual food approval.</Text>{summary}<Text style={s.text}>Split remaining demo funds over:</Text>{[1,2,4,8].map(n=>choice(`${n} weeks`,weeks===n,()=>setWeeks(n)))}<View style={s.card}>{heading('Fictional weekly plan')}<Text style={s.text}>SNAP: {money(planSpend(wallet.snapCents,weeks))} / week</Text><Text style={s.text}>TANF: {money(planSpend(wallet.tanfCents,weeks))} / week</Text><Text style={s.text}>WIC remains item-based and is not converted to dollars.</Text></View>{button('Open Tap-to-Pay Demo',()=>go('Tap-to-Pay Demo'))}</View>;
 if(screen==='Wallet Activity') return <View>{heading('Wallet Activity')}{summary}{wallet.receipts.length===0?<Text style={s.text}>No simulated payments yet.</Text>:wallet.receipts.map(r=><View key={r.id} style={s.card}><Text style={s.text}>{r.id} · {r.program} · {r.item} · {r.program==='WIC'?'1 sample item':money(r.cents)}</Text><Text style={s.text}>Simulation only. No money moved.</Text></View>)}{button('Open Tap-to-Pay Demo',()=>go('Tap-to-Pay Demo'))}</View>;
 return <View>{heading('Tap-to-Pay Demo')}<Text style={s.text}>Simulation only: no NFC, biometric authentication, terminal connection or real charge. Reloading resets the fictional wallet.</Text>{summary}
 <Text style={s.text}>Choose a fictional card (link it in Cards first):</Text>{programs.map(p=>choice(p,program===p,()=>{setProgram(p);reset();}))}
 <Text style={s.text}>Choose an illustrative product:</Text>{demoItems.map(x=>choice(x,item===x,()=>{setItem(x);reset();}))}
 <Text style={s.text}>Fixed sample purchase: {program==='WIC'?'one WIC food item':'$12.50'}</Text>
 {choice('Simulated approval',approve,()=>{setApprove(true);reset();})}{choice('Simulated decline',!approve,()=>{setApprove(false);reset();})}
 {stage==='idle'&&button('Begin simulated payment',()=>setStage('confirm'))}
 {stage==='confirm'&&button('Confirm fictional authorization',()=>setStage('ready'))}
 {stage==='ready'&&button('Simulate terminal tap',()=>{const result=simulatePurchase(wallet,{program,item,cents:1250,linked:cards.some(c=>c.program===program),approve});onWallet(result.wallet);setMessage(result.message);setStage('done');})}
 <Text accessibilityLiveRegion="polite" style={s.text}>{message}</Text>
 {stage!=='idle'&&button(stage==='done'?'Try another simulation':'Cancel simulation',reset)}
 {button('Open Wallet Activity',()=>go('Wallet Activity'))}</View>;
}
const s=StyleSheet.create({text:{color:'#351329',fontSize:15,lineHeight:23,marginVertical:5},heading:{color:'#351329',fontSize:23,fontWeight:'800',marginVertical:12},card:{backgroundColor:'#FFFFFF',padding:16,borderRadius:17,borderWidth:1,borderColor:'#EADDCF',marginVertical:10},button:{backgroundColor:'#78401F',padding:15,borderRadius:12,marginVertical:10},white:{color:'#FFFFFF',fontWeight:'700'},choice:{padding:12,borderWidth:1,borderColor:'#AE713C',borderRadius:12,marginVertical:5},selected:{backgroundColor:'#65406E'}});
