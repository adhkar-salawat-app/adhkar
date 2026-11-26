const webpush=require('web-push'),fs=require('fs');
const PUB='BHdDUeV5am1b08uzdY0yxPmFhxm4QVaa_6JdjKg8Iv3kk8QiSVf3oAXU3W1vbuWC7WNvyY7P-Tmru6lyOn3eOtc';
const TZ='Africa/Cairo';
async function main(){
 if(!process.env.SUB_JSON){console.log('no subscription yet');return}
 const d=JSON.parse(/^\s*\{/.test(process.env.SUB_JSON)?process.env.SUB_JSON:Buffer.from(process.env.SUB_JSON.trim(),'base64').toString('utf8'));const sub=d.s,c=d.c||{};
 webpush.setVapidDetails('https://adhkar-salawat-app.github.io/adhkar/',PUB,process.env.VAPID_PRIVATE);
 const test=(process.env.TEST||'').trim();
 if(test){await webpush.sendNotification(sub,JSON.stringify({title:'أذكار وصلاة على النبي',body:test,tag:'test'}));console.log('test sent');return}
 const parts=new Intl.DateTimeFormat('en-GB',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(new Date());
 const g=t=>parts.find(p=>p.type===t).value;const date=g('year')+'-'+g('month')+'-'+g('day'),now=(+g('hour')%24)*60+ +g('minute');
 const mins=h=>{const [a,b]=h.split(':').map(Number);return a*60+b};
 const ev=[];
 if(c.m)ev.push(['morning',mins(c.m),'أذكار الصباح','حان وقت أذكار الصباح. افتح التطبيق واقرأها.']);
 if(c.e)ev.push(['evening',mins(c.e),'أذكار المساء','حان وقت أذكار المساء. افتح التطبيق واقرأها.']);
 if(c.p&&c.la!=null){
  try{const ds=g('day')+'-'+g('month')+'-'+g('year');const r=await fetch('https://api.aladhan.com/v1/timings/'+ds+'?latitude='+c.la+'&longitude='+c.lo+'&method=5');const t=(await r.json()).data.timings;
   [['Fajr','الفجر'],['Dhuhr','الظهر'],['Asr','العصر'],['Maghrib','المغرب'],['Isha','العشاء']].forEach(([k,n])=>ev.push([k,mins(t[k]),'حان وقت صلاة '+n,'حان الآن وقت صلاة '+n+' بحسب مدينتك. اللهم صلِّ على محمد.']))}catch(e){console.log('prayer times failed')}}
 let st={};try{st=JSON.parse(fs.readFileSync('.cache/state.json','utf8'))}catch(e){}
 for(const k of Object.keys(st))if(!k.startsWith(date))delete st[k];
 for(const [k,m,title,body] of ev){const key=date+'|'+k;
  if(!st[key]&&m<=now&&now-m<=25){
   try{await webpush.sendNotification(sub,JSON.stringify({title,body,tag:k}));st[key]=1;console.log('sent',k)}catch(e){console.log('send failed',k,e.statusCode);}
  }}
 fs.mkdirSync('.cache',{recursive:true});fs.writeFileSync('.cache/state.json',JSON.stringify(st));
}
main().catch(e=>{console.error('failed',e&&e.statusCode);process.exit(1)});
