import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {authorizeFictionalCard, programs} from '../services/benefitLinking';
import type {Program, AuthorizationScenario, DemoCard} from '../services/benefitLinking';
export default function BenefitCards({cards,onChange}: {cards: DemoCard[]; onChange: (cards: DemoCard[])=>void}) {
  const [scenario,setScenario]=useState<AuthorizationScenario>('approved');
  const [message,setMessage]=useState('Choose a predefined fictional authorization response.');
  const [busy,setBusy]=useState(false);
  async function link(program: Program) {
    if (busy) return;
    setBusy(true);
    try {
      const result=await authorizeFictionalCard(program,scenario);
      if(result.card) onChange([...cards.filter(c=>c.program!==program),result.card]);
      setMessage(result.message);
    } catch {setMessage('Simulation unavailable. No fictional card changed.');}
    finally {setBusy(false);}
  }
  return <View><Text style={s.text}>Offline demonstration. No real card numbers, PINs, Social Security numbers or identity information are requested. Cards and balances reset when the app reloads.</Text>
    <Text style={s.heading}>Simulated authorization response</Text>
    <View style={s.row}>{(['approved','declined','cancelled'] as const).map(x=><TouchableOpacity key={x} accessibilityRole="radio" accessibilityState={{selected:scenario===x}} onPress={()=>setScenario(x)} style={[s.choice,scenario===x&&s.selected]}><Text style={scenario===x?s.white:s.text}>{x}</Text></TouchableOpacity>)}</View>
    {programs.map(program=><View key={program} style={s.card}><Text style={s.heading}>{program}</Text><Text style={s.text}>{cards.some(c=>c.program===program)?'Fictional card linked':'No fictional card linked'}</Text>
      <TouchableOpacity accessibilityRole="button" disabled={busy} onPress={()=>link(program)} style={s.button}><Text style={s.white}>Simulate linking {program}</Text></TouchableOpacity>
      {cards.some(c=>c.program===program)&&<TouchableOpacity accessibilityRole="button" onPress={()=>{onChange(cards.filter(c=>c.program!==program));setMessage(`${program} fictional link removed.`);}} style={s.choice}><Text style={s.text}>Unlink {program}</Text></TouchableOpacity>}
    </View>)}<Text accessibilityLiveRegion="polite" style={s.text}>{message}</Text></View>;
}
const s=StyleSheet.create({text:{color:'#351329',fontSize:15,lineHeight:22},heading:{color:'#351329',fontSize:18,fontWeight:'800',marginVertical:10},row:{flexDirection:'row',flexWrap:'wrap',gap:6},card:{backgroundColor:'#FFFFFF',borderColor:'#EADDCF',borderWidth:1,borderRadius:17,padding:16,marginVertical:9},choice:{borderWidth:1,borderColor:'#AE713C',borderRadius:10,padding:10,marginTop:8},selected:{backgroundColor:'#65406E'},button:{backgroundColor:'#78401F',padding:14,borderRadius:12,marginVertical:10},white:{color:'#FFFFFF',fontWeight:'700'}});
