import {db,ready,esc,url,money,nights,ST} from './app.js';
import {doc,getDoc,getDocs,collection,setDoc,serverTimestamp} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
const $=s=>document.querySelector(s),show=(id,v=true)=>{$(id).hidden=!v};
if(!ready){show('#setup');$('#main').hidden=true}else{
const S=(await getDoc(doc(db,'settings','hotel'))).data()||{},cur=S.currency||'';
const rows=async c=>(await getDocs(collection(db,c))).docs.map(d=>({id:d.id,...d.data()}));
const T=(await rows('roomTypes')).filter(r=>r.active),F=(await rows('features')).filter(r=>r.active);
if(S.name){$('#nm').textContent=S.name;document.title=S.name}
$('#ds').textContent=S.shortDesc||'';
if(url(S.logo)){$('#logo').src=url(S.logo);show('#logo')}
if(S.desc){$('#ab').textContent=S.desc;show('#about')}
if(S.policies){$('#pl').textContent=S.policies;show('#pol')}
const im=u=>url(u)?`<img class="im" src="${esc(url(u))}" alt="" loading="lazy">`:`<div class="im"></div>`;
if(T.length){show('#rooms');show('#book');
$('#rg').innerHTML=T.map(r=>`<div class="rc">${im(r.image)}<h3>${esc(r.name)}</h3><p>${esc(r.desc)}</p><p>${r.guests?r.guests+' نزلاء':''} ${r.beds?'· '+r.beds+' أسرّة':''} ${r.area?'· '+r.area+' م²':''}</p><div class="pr">${money(r.price,cur)} / الليلة</div></div>`).join('');
$('#bt').innerHTML=T.map(r=>`<option value="${esc(r.id)}">${esc(r.name)}</option>`).join('')}
if(F.length){show('#features');
$('#fg').innerHTML=F.map(f=>`<div class="rc">${im(f.image)}<h3>${esc(f.name)}</h3><p>${esc(f.desc)}</p><div class="pr">${f.free?'مجانية':money(f.price,cur)}</div></div>`).join('');
const B=F.filter(f=>f.atBooking);$('#bx').innerHTML=B.length?'<label class="mu">مميزات إضافية</label>'+B.map(f=>`<label class="ck"><input type="checkbox" value="${esc(f.id)}"> ${esc(f.name)} (${f.free?'مجانية':money(f.price,cur)})</label>`).join(''):''}
const ct=[S.phone&&`<p>الهاتف: <a href="tel:${esc(S.phone)}">${esc(S.phone)}</a></p>`,S.email&&`<p>البريد: <a href="mailto:${esc(S.email)}">${esc(S.email)}</a></p>`,S.address&&`<p>${esc(S.address)}</p>`,url(S.mapUrl)&&`<p><a class="btn s" href="${esc(url(S.mapUrl))}" target="_blank" rel="noopener">افتح الموقع على الخريطة</a></p>`,(S.checkIn||S.checkOut)&&`<p class="mu">تسجيل الوصول: ${esc(S.checkIn||'—')} · المغادرة: ${esc(S.checkOut||'—')}</p>`].filter(Boolean);
if(ct.length){$('#ct').innerHTML=ct.join('');show('#contact')}
const sel=()=>[...document.querySelectorAll('#bx input:checked')].map(i=>i.value);
function calc(){const t=T.find(r=>r.id==$('#bt').value),a=$('#ba').value,d=$('#bd').value;if(!t||!a||!d||d<=a){$('#est').textContent='';return 0}
const n=nights(a,d),rc=Math.max(1,+$('#br').value||1),x=sel().reduce((s,i)=>s+(F.find(f=>f.id==i)?.free?0:+F.find(f=>f.id==i)?.price||0),0),tot=n*t.price*rc+x;
$('#est').textContent=`التكلفة التقديرية: ${money(tot,cur)} (${n} ليلة)`;return tot}
document.querySelectorAll('#bf input,#bf select').forEach(e=>e.oninput=calc);
$('#ba').min=new Date().toISOString().slice(0,10);
$('#sb').onclick=async()=>{const v=i=>$(i).value.trim(),a=v('#ba'),d=v('#bd');
if(!v('#bn')||v('#bp').length<6)return alert('أدخل الاسم ورقم هاتف صحيحًا');
if(!a||!d||d<=a)return alert('تأكد أن تاريخ المغادرة بعد تاريخ الوصول');
const ref=[...crypto.getRandomValues(new Uint8Array(10))].map(b=>'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[b%32]).join('');
try{await setDoc(doc(db,'bookings',ref),{name:v('#bn'),phone:v('#bp'),email:v('#be'),arrive:a,depart:d,guests:+v('#bg')||1,rooms:+v('#br')||1,typeId:v('#bt'),featureIds:sel(),notes:v('#bo'),status:'new',paid:0,total:calc(),createdAt:serverTimestamp()});
$('#rf').textContent=ref;show('#bf',false);show('#done')}catch(e){alert('تعذر إرسال الطلب، حاول مرة أخرى.')}};
$('#tb').onclick=async()=>{const r=$('#tr').value.trim().toUpperCase(),o=$('#tres');o.textContent='';
try{const b=(await getDoc(doc(db,'bookings',r))).data();
if(!b||b.phone!==$('#tp').value.trim())return o.innerHTML='<p class="mu">لا يوجد حجز بهذه البيانات. تأكد من الرقم المرجعي والهاتف.</p>';
o.innerHTML=`<p>الحالة: <span class="pill">${ST[b.status]||''}</span></p><p>${esc(b.arrive)} ← ${esc(b.depart)}</p><p>الإجمالي: ${money(b.total,cur)} · المدفوع: ${money(b.paid,cur)}</p>`}
catch(e){o.innerHTML='<p class="mu">لا يوجد حجز بهذه البيانات.</p>'}}}
