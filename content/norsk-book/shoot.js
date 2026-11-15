// node shoot.js ПАПКА [pdf] — проверка переполнения, листы по главам, PDF
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const out=process.argv[2];
const p=await b.newPage({viewport:{width:1640,height:1000},deviceScaleFactor:2});
await p.goto('file://'+__dirname+'/book.html');await p.waitForTimeout(2500);
const o=await p.evaluate(()=>[...document.querySelectorAll('.page')].map(e=>{const r=e.getBoundingClientRect();let m=0;
 e.querySelectorAll('*').forEach(c=>{if(c.closest('.stamp')||c.closest('svg')||c.classList.contains('folio'))return;const q=c.getBoundingClientRect();if(q.height)m=Math.max(m,q.bottom-r.top)});
 return e.dataset.p+':'+Math.round(m/r.height*100)}));
console.log(o.join(' '));
const pages=await p.$$('.page');
for(const [name,from,to] of [['ch0',0,5],['ch1',6,11]]){const a=await pages[from].boundingBox(),z=await pages[to].boundingBox();
 await p.screenshot({path:out+'/'+name+'.png',clip:{x:0,y:a.y-10,width:1640,height:z.y+z.height-a.y+20},fullPage:true});}
if(process.argv[3]){await p.emulateMedia({media:'print'});await p.pdf({path:__dirname+'/norsk-med-polly-0-1.pdf',format:'A4',printBackground:true,preferCSSPageSize:true});}
await b.close()})()
