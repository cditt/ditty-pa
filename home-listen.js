/* BUILD90 jug + CPAP local only */
(function(){
  var KEY='dpa_cpap';
  function today(){
    var d=new Date();
    var m=d.getMonth()+1, day=d.getDate();
    return d.getFullYear()+'-'+(m<10?'0':'')+m+'-'+(day<10?'0':'')+day;
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
      var all=load();
      all[today()]={h:(ih.value||'').trim(), s:(is.value||'').trim()};
      saveAll(all);
      hist.textContent=last7(all);
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
