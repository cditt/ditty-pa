/* BUILD89 jug + CPAP to Calendar */
(function(){
  var KEY='dpa_cpap';
  function today(){
    var d=new Date();
    var m=d.getMonth()+1, day=d.getDate();
    return d.getFullYear()+'-'+(m<10?'0':'')+m+'-'+(day<10?'0':'')+day;
  }
  function tomorrow(iso){
    var p=iso.split('-');
    var d=new Date(Number(p[0]), Number(p[1])-1, Number(p[2]));
    d.setDate(d.getDate()+1);
    var m=d.getMonth()+1, day=d.getDate();
    return d.getFullYear()+'-'+(m<10?'0':'')+m+'-'+(day<10?'0':'')+day;
  }
  function token(){
    try{ return localStorage.getItem('dpa3_g')||''; }catch(e){ return ''; }
  }
  function load(){
    try{ return JSON.parse(localStorage.getItem(KEY)||'{}'); }catch(e){ return {}; }
  }
  function saveAll(obj){
    try{ localStorage.setItem(KEY, JSON.stringify(obj)); }catch(e){}
  }
  function last7(log){
    var keys=Object.keys(log).sort().reverse().slice(0,7);
    if(!keys.length) return '';
    return keys.map(function(k){
      var r=log[k]||{};
      return k.slice(5)+' '+((r.h||'—')+'h/'+(r.s||'—'));
    }).join(' · ');
  }
  function pushCal(h,s){
    var tok=token();
    if(!tok || !(h||s)) return;
    var day=today();
    var title='CPAP '+((h||'?')+'h / '+(s||'?'));
    var hdr={Authorization:'Bearer '+tok,'Content-Type':'application/json'};
    var q='https://www.googleapis.com/calendar/v3/calendars/primary/events'
      +'?timeMin='+encodeURIComponent(day+'T00:00:00-05:00')
      +'&timeMax='+encodeURIComponent(day+'T23:59:59-05:00')
      +'&singleEvents=true&maxResults=20';
    fetch(q,{headers:{Authorization:'Bearer '+tok}})
      .then(function(r){ return r.ok ? r.json() : {items:[]}; })
      .then(function(data){
        var items=data.items||[];
        var hit=null;
        for(var i=0;i<items.length;i++){
          if((items[i].summary||'').indexOf('CPAP ')===0){ hit=items[i]; break; }
        }
        var body=JSON.stringify({
          summary:title,
          description:'Ditty PA CPAP log',
          start:{date:day},
          end:{date:tomorrow(day)}
        });
        if(hit && hit.id){
          return fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events/'+encodeURIComponent(hit.id),{
            method:'PUT', headers:hdr, body:body
          });
        }
        return fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events',{
          method:'POST', headers:hdr, body:body
        });
      })
      .catch(function(){});
  }
  function mountCpap(home){
    if(document.getElementById('cpap-row')) return;
    var row=document.createElement('div');
    row.id='cpap-row';
    row.innerHTML='<span class="cpap-lbl">CPAP</span> Hours <input id="cpap-h" inputmode="decimal" maxlength="5" placeholder="____"> Score <input id="cpap-s" inputmode="numeric" maxlength="3" placeholder="____"><div id="cpap-hist"></div>';
    var brief=home.querySelector('#ab-body') || home.querySelector('.ab-wrap');
    if(brief && brief.parentNode) brief.parentNode.insertBefore(row, brief.nextSibling);
    else {
      var sc=home.querySelector('.home-scroll');
      if(sc) sc.appendChild(row);
    }
    var log=load();
    var rec=log[today()]||{};
    var ih=document.getElementById('cpap-h');
    var is=document.getElementById('cpap-s');
    var hist=document.getElementById('cpap-hist');
    if(rec.h) ih.value=rec.h;
    if(rec.s) is.value=rec.s;
    hist.textContent=last7(log);
    function persist(){
      var h=(ih.value||'').trim();
      var s=(is.value||'').trim();
      var all=load();
      all[today()]={h:h,s:s};
      saveAll(all);
      hist.textContent=last7(all);
      pushCal(h,s);
    }
    ih.addEventListener('change', persist);
    is.addEventListener('change', persist);
    ih.addEventListener('blur', persist);
    is.addEventListener('blur', persist);
  }
  function grab(){
    var home=document.getElementById('scr-home');
    if(!home) return '';
    function t(sel){
      var el=home.querySelector(sel);
      return el ? String(el.innerText||el.textContent||'').replace(/\s+/g,' ').trim() : '';
    }
    var parts=[], g=t('.hgreet-txt'), d=t('.hdate'), w=t('.hwx'), brief=t('#ab-body');
    if(g) parts.push(g);
    if(d) parts.push(d);
    if(w) parts.push(w);
    var rec=load()[today()]||{};
    if(rec.h||rec.s) parts.push('CPAP '+((rec.h||'blank')+' hours, score '+(rec.s||'blank')));
    else parts.push('CPAP not logged today.');
    if(brief) parts.push(brief);
    return parts.join('. ');
  }
  function speak(){
    if(!window.speechSynthesis) return;
    if(speechSynthesis.speaking){ speechSynthesis.cancel(); return; }
    var u=new SpeechSynthesisUtterance(grab()||'Daily brief is empty.');
    u.rate=0.95;
    speechSynthesis.speak(u);
  }
  function sync(){
    var home=document.getElementById('scr-home');
    var btn=document.getElementById('home-listen');
    if(!btn){
      btn=document.createElement('button');
      btn.id='home-listen';
      btn.type='button';
      btn.setAttribute('aria-label','Read brief aloud');
      btn.addEventListener('click', function(e){
        e.preventDefault(); e.stopPropagation(); speak();
      });
      document.body.appendChild(btn);
    }
    btn.style.display = (home && home.classList.contains('active')) ? 'block' : 'none';
    if(home) mountCpap(home);
  }
  setInterval(sync, 400);
  sync();
})();
