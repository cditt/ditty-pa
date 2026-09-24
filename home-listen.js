/* BUILD93 CPAP, bills due, stocks up/down */
(function(){
  var KEY='dpa_cpap';
  var BILLS=[
    {n:'Electric', d:23, a:270},
    {n:'Car insurance', d:24, a:380.34},
    {n:'Chase', d:26, a:222},
    {n:'YouTube TV', d:26, a:82.99},
    {n:'Amazon Visa', d:27, a:137},
    {n:'IUCU line', d:28, a:85},
    {n:'Camper loan', d:30, a:192.89}
  ];
  function pad(n){ return (n<10?'0':'')+n; }
  function ymd(d){ return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate()); }
  function today(){ return ymd(new Date()); }
  function yesterday(){ var d=new Date(); d.setDate(d.getDate()-1); return ymd(d); }
  function load(){
    try{ return JSON.parse(localStorage.getItem(KEY)||'{}'); }catch(e){ return {}; }
  }
  function saveAll(obj){
    try{ localStorage.setItem(KEY, JSON.stringify(obj)); }catch(e){}
  }
  function money(n){
    var r=Math.round(n*100)/100;
    if(Math.abs(r-Math.round(r))<0.001) return '$'+Math.round(r);
    return '$'+r.toFixed(2);
  }
  function dayWord(d, today){
    if(d===today) return 'today';
    if(d===today+1) return 'tomorrow';
    var suf='th';
    if(d===1||d===21||d===31) suf='st';
    else if(d===2||d===22) suf='nd';
    else if(d===3||d===23) suf='rd';
    return 'the '+d+suf;
  }
  function billsLine(){
    var day=new Date().getDate();
    var soon=BILLS.filter(function(b){ return b.d>=day && b.d<=day+7; });
    if(!soon.length) return '';
    return 'Due: '+soon.map(function(b){
      return b.n+' '+dayWord(b.d, day)+' '+money(b.a);
    }).join('. ')+'.';
  }
  function last7(log){
    var keys=Object.keys(log).sort().reverse().slice(0,7);
    if(!keys.length) return '';
    return keys.map(function(k){
      var r=log[k]||{};
      return k.slice(5)+' '+((r.h||'—')+'h/'+(r.s||'—'));
    }).join(' · ');
  }
  function coach(rec){
    if(!rec || !(rec.h||rec.s)) return 'Log last night when you have it.';
    var hrs=parseFloat(rec.h);
    var sc=parseFloat(rec.s);
    var line='Yesterday your score was '+(rec.s||'?')+' and '+(rec.h||'?')+' hours.';
    var ok=(!isNaN(hrs) && hrs>=4) && (!isNaN(sc) ? sc>=70 : true);
    if(isNaN(hrs) && !isNaN(sc)) ok = sc>=70;
    return line+' '+(ok ? 'Good job.' : 'Tighten up, pal.');
  }
  function paintMkt(){
    var el=document.getElementById('mkt-line');
    if(!el || el.getAttribute('data-on')) return;
    el.setAttribute('data-on','1');
    fetch('https://ditty-pa-proxy.hddittemore.workers.dev/stocks?symbols=GOOGL,DKNG,LMT,MU,IHAK,SCZ,SPY,VO,VOO')
      .then(function(r){ return r.json(); })
      .then(function(data){
        var up=[], down=[], flat=[];
        (data.stocks||[]).forEach(function(s){
          var c=Number(s.change);
          if(c>0) up.push(s.ticker);
          else if(c<0) down.push(s.ticker);
          else flat.push(s.ticker);
        });
        var bits=[];
        if(up.length) bits.push('Up: '+up.join(', '));
        if(down.length) bits.push('Down: '+down.join(', '));
        if(flat.length) bits.push('Flat: '+flat.join(', '));
        el.textContent=bits.length ? bits.join('. ')+'.' : '';
      })
      .catch(function(){ el.textContent=''; });
  }
  function mountCpap(home){
    if(document.getElementById('cpap-row')) return;
    var wrap=document.createElement('div');
    wrap.id='cpap-wrap';
    wrap.innerHTML='<div id="cpap-yest"></div><div id="bills-line"></div><div id="mkt-line"></div><div id="cpap-row"><span class="cpap-lbl">CPAP</span> Hours <input id="cpap-h" inputmode="decimal" maxlength="5" placeholder="____"> Score <input id="cpap-s" inputmode="numeric" maxlength="3" placeholder="____"></div><div id="cpap-hist"></div>';
    var brief=home.querySelector('#ab-body') || home.querySelector('.ab-wrap');
    if(brief && brief.parentNode) brief.parentNode.insertBefore(wrap, brief);
    else {
      var sc=home.querySelector('.home-scroll');
      if(sc) sc.insertBefore(wrap, sc.firstChild);
    }
    var log=load();
    var rec=log[today()]||{};
    var ih=document.getElementById('cpap-h');
    var is=document.getElementById('cpap-s');
    var hist=document.getElementById('cpap-hist');
    var y=document.getElementById('cpap-yest');
    var bills=document.getElementById('bills-line');
    if(rec.h) ih.value=rec.h;
    if(rec.s) is.value=rec.s;
    y.textContent=coach(log[yesterday()]);
    if(bills) bills.textContent=billsLine();
    hist.textContent=last7(log);
    paintMkt();
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
    var parts=[], g=t('.hgreet-txt'), d=t('.hdate'), w=t('.hwx');
    var y=t('#cpap-yest'), bills=t('#bills-line'), mkt=t('#mkt-line'), brief=t('#ab-body');
    if(g) parts.push(g);
    if(d) parts.push(d);
    if(w) parts.push(w);
    if(y) parts.push(y);
    if(bills) parts.push(bills);
    if(mkt) parts.push(mkt);
    var rec=load()[today()]||{};
    if(rec.h||rec.s) parts.push('Today '+((rec.h||'?')+' hours, score '+(rec.s||'?')));
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
