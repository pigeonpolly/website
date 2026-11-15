const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const t of process.argv.slice(2)){const p=await b.newPage({viewport:{width:1640,height:1000},deviceScaleFactor:+process.env.DSF||1});
await p.goto('file://'+__dirname+'/unit1.html#'+t);await p.waitForTimeout(2500);
const o=await p.evaluate(()=>[...document.querySelectorAll('.page')].map((e,i)=>{const r=e.getBoundingClientRect();let m=0;e.querySelectorAll('*').forEach(c=>{if(c.closest('.stamp')||c.closest('svg'))return;const q=c.getBoundingClientRect();if(q.height)m=Math.max(m,q.bottom-r.top)});return (i+1)+':'+Math.round(m/r.height*100)+'%'}));
console.log(t,o.join(' '));
await p.screenshot({path:process.env.OUT+'/'+t+'.png',fullPage:true});
if(process.env.PDF){await p.emulateMedia({media:'print'});await p.pdf({path:__dirname+'/norsk-med-polly-1-'+t+'.pdf',format:'A4',printBackground:true,preferCSSPageSize:true});}
await p.close()}
await b.close()})()
