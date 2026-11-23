// HTML (make.py) → PDF A4 для учебника норвежского
const {chromium}=require('playwright'),path=require('path');(async()=>{const b=await chromium.launch();const p=await b.newPage();
await p.goto('file://'+path.join(__dirname,'out.html'),{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
await p.pdf({path:path.join(__dirname,'../../site/members/norsk/norsk-a1-a2-en-ei-et.pdf'),format:'A4',printBackground:true,preferCSSPageSize:true});await b.close()})();
