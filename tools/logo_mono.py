# Однотонный значок v3 в любом цвете из чёрного (pigeon-polly-black-only-transparent-4000.png):
# PNG 4000 без фона, PNG 1080 на фоне, PDF 100 мм (через Playwright, без фона).
# python3 tools/logo_mono.py имя #цвет #фон1080   (пример: brown '#2E2521' '#F4F0EA')
import sys, subprocess, os
from PIL import Image
name, col, bg = sys.argv[1:4]
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'site/images/logo/v3')
src = Image.open(os.path.join(D, 'pigeon-polly-black-only-transparent-4000.png')).convert('RGBA')
rgb = tuple(int(col.lstrip('#')[i:i+2], 16) for i in (0, 2, 4))
out = Image.new('RGBA', src.size, rgb + (0,)); out.putalpha(src.getchannel('A'))
p = lambda s: os.path.join(D, f'pigeon-polly-{name}-only-{s}')
out.save(p('transparent-4000.png'), optimize=True)
bgc = Image.new('RGBA', (1080, 1080), bg); bgc.alpha_composite(out.resize((1000, 1000), Image.LANCZOS), (40, 40))
bgc.convert('RGB').save(os.path.join(D, f'pigeon-polly-{name}-1080.png'))
js = """const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const q=await b.newPage();
await q.goto('file://'+process.argv[2]);await q.addStyleTag({content:'html,body{margin:0}img{width:100mm!important;height:100mm!important;display:block}'});
await q.pdf({path:process.argv[1],width:'100mm',height:'100mm',pageRanges:'1'});await b.close()})()"""
subprocess.run(['node', '-e', js, os.path.join(D, f'pigeon-polly-{name}-100mm.pdf'), os.path.abspath(p('transparent-4000.png'))], check=True)
print('ok', name)
