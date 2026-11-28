# Массовая правка свойств в Notion через API (ключ — в окружении, прокси подставляет). python3 tools/pins/scf_apply.py updates.json — [{id,page,props:{Тип,Сезон,Праздник,📅 Конкретная дата}}]
import json,sys,time,urllib.request
u=json.load(open(sys.argv[1]))
H={"Notion-Version":"2022-06-28","Authorization":"Bearer proxy-injected","Content-Type":"application/json"}
ok=0;fail=[]
for i,x in enumerate(u):
    p=x['props']
    body={"properties":{"Тип":{"select":{"name":p['Тип']}},"Сезон":{"select":{"name":p['Сезон']}},"Праздник":{"select":{"name":p['Праздник']}},"📅 Конкретная дата":{"checkbox":p['📅 Конкретная дата']=='__YES__'}}}
    for t in range(4):
        try:
            r=urllib.request.Request(f"https://api.notion.com/v1/pages/{x['page']}",data=json.dumps(body).encode(),headers=H,method='PATCH')
            urllib.request.urlopen(r,timeout=30).read(); ok+=1; break
        except urllib.error.HTTPError as e:
            if e.code==429 or e.code>=500: time.sleep(2*(t+1)); continue
            fail.append((x['id'],e.code,e.read()[:200])); break
        except Exception as e:
            time.sleep(2); 
            if t==3: fail.append((x['id'],'err',str(e)[:100]))
    time.sleep(0.34)
print('ok',ok,'fail',len(fail)); print(fail[:10])
