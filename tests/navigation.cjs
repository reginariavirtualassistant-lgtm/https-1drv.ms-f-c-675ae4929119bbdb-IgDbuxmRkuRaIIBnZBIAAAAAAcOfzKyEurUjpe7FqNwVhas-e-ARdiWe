// Run with Playwright installed: node tests/navigation.cjs
// Start Expo web on port 8081 first. CHROMIUM_PATH may select a local browser.
const {chromium}=require('playwright');
const fs=require('node:fs');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:412,height:915}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const text=(s)=>page.getByText(s,{exact:true});
 const click=async(s)=>text(s).last().click();
 const visible=async(s)=>{await text(s).first().waitFor({state:'visible'});};
 const home=()=>page.getByLabel('Home',{exact:true}).click();
 try {
  await page.goto('http://127.0.0.1:8081');
  await visible('One Wallet. Every Benefit.');
  await click('Get Started');await visible('Create Your Account');
  await click('Continue');await visible('Verify Your Identity');
  await click('Continue with Demo');await visible('Add Benefit Cards');
  for(const program of ['SNAP / EBT','WIC','TANF']) await page.getByRole('button',{name:`Simulate linking ${program}`,exact:true}).click();
  await visible('Simulated approval: TANF fictional card linked.');
  await click('declined');await page.getByRole('button',{name:'Simulate linking TANF',exact:true}).click();await visible('Simulated declined: no card linked.');
  await click('cancelled');await page.getByRole('button',{name:'Simulate linking WIC',exact:true}).click();await visible('Simulated cancelled: no card linked.');
  await click('Open My Wallet');await visible('Good morning, Taylor!');
  const routes=[['SNAP / EBT','Recent Transactions'],['WIC Benefits','Illustrative food package'],['Scan WIC Item','Simulated WIC eligibility checker'],['Store Finder','Find Stores'],['Future Checkout','Mobile Checkout'],['Benefit Calendar','November 2026'],['Notifications','Fictional activity alerts'],['Profile & Settings','Demo account'],['Help & Support','Demo help center'],['Accessibility & Language','Customize your demo experience']];
  for(const [route,heading] of routes){await click(route);await visible(heading);await page.getByLabel('Back',{exact:true}).click();await visible('Good morning, Taylor!');}
  await click('Scan WIC Item');await click('Simulate Scan');await visible('Whole-grain bread: WIC eligible (demo)');await click('Reset Result');await visible('Tap below to simulate a product scan');await home();
  await click('Family Benefits Hub');await click('Complete WIC demo task');await visible('3 open sample tasks');await click('Open Benefits Guardian');await click('Medicaid');await visible('Source: fictional notice MD-001. Contact the relevant official agency for real instructions.');await home();
  await click('Family Benefits Hub');await visible('3 open sample tasks');await home();
  await click('SmartSpend');await visible('SNAP: $107.12 / week');await click('2 weeks');await visible('SNAP: $214.25 / week');await click('Open Tap-to-Pay Demo');
  async function pay(){await click('Begin simulated payment');await click('Confirm fictional authorization');await click('Simulate terminal tap');}
  await pay();await visible('Simulated approval · DEMO-RECEIPT-1 · No real payment');await visible('Fictional SNAP: $416.00 · TANF: $185.00');
  await click('Try another simulation');await click('Simulated decline');await pay();await visible('Simulated processor decline. No balance changed.');await visible('Fictional SNAP: $416.00 · TANF: $185.00');
  await click('Try another simulation');await click('WIC');await click('WIC sample food');await click('Simulated approval');await pay();await visible('Simulated approval · DEMO-RECEIPT-2 · No real payment');await visible('WIC: 7 sample items · Medicaid: coverage concept, no cash balance');
  await click('Open Wallet Activity');await visible('DEMO-RECEIPT-2 · WIC · WIC sample food · 1 sample item');
  await click('Cards');await visible('Add Benefit Cards');await page.getByRole('button',{name:'Unlink SNAP / EBT',exact:true}).click();await visible('SNAP / EBT fictional link removed.');
  await home();await click('Tap-to-Pay Demo');await click('Begin simulated payment');await click('Confirm fictional authorization');await click('Simulate terminal tap');await visible('Link this fictional card first.');
  await click('Profile');await visible('Demo account');await click('Return to Welcome');await visible('One Wallet. Every Benefit.');
  assert.deepEqual(errors,[]);console.log('PASS: all 15 original screens, 5 added screens, back/home/tabs, linking outcomes, scan reset, family tasks, Guardian, SmartSpend, payment approval/decline/WIC/unlinked, and receipts. No browser runtime errors.');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
