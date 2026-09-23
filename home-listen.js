/* BUILD83 cream + brown XXX jug. Reads brief. */
(function(){
  var JUG='<svg viewBox="0 0 90 130" width="52" height="74" aria-hidden="true"><ellipse cx="45" cy="124" rx="24" ry="4" fill="rgba(0,0,0,.28)"/><rect x="18" y="58" width="54" height="62" rx="8" fill="#e6d3b3"/><rect x="18" y="58" width="54" height="62" rx="8" fill="none" stroke="#c4ad8a" stroke-width="1.5"/><path d="M28 62c2 18 4 36 4 50h26c0-14 2-32 4-50z" fill="#f3e6cc" opacity=".35"/><text x="45" y="98" text-anchor="middle" font-size="20" font-family="Georgia,serif" font-weight="700" fill="#1a120c">XXX</text><path d="M30 62 L45 22 L60 62z" fill="#5a2e16"/><path d="M34 58 L45 26 L56 58z" fill="#3d1c0e"/><ellipse cx="45" cy="22" rx="8" ry="5" fill="#2a1208"/><path d="M52 28c10 4 14 16 8 26" fill="none" stroke="#3d1c0e" stroke-width="7" stroke-linecap="round"/><rect x="42" y="12" width="7" height="12" rx="1" fill="#6b5340"/><path d="M42 14h18v3H49l11-1v3" fill="#8a7358"/></svg>';
  function grab(){
    var home=document.getElementById('scr-home');
    if(!home) return '';
    function t(sel){
      var el=home.querySelector(sel);
      return el? (el.innerText||el.textContent||'').replace(/\s+/g,' ').trim(): '';
    }
    var parts=[];
    var g=t('.hgreet-txt')||t('#h-greeting');
    var d=t('.hdate');
    var w=t('.hwx');
    var b=t('#ab-body')||t('.ab-body');
    if(g) parts.push(g);
    if(d) parts.push(d);
    if(w) parts.push(w);
    if(b) parts.push(b);
    return parts.join('. ');
  }
  function speak(){
    if(!window.speechSynthesis) return;
    if(speechSynthesis.speaking){
      speechSynthesis.cancel();
      var b=document.getElementById('home-listen');
      if(b) b.classList.remove('talking');
      return;
    }
    var txt=grab();
    if(!txt) return;
    var u=new SpeechSynthesisUtterance(txt);
    u.rate=0.95;
    var btn=document.getElementById('home-listen');
    u.onstart=function(){ if(btn) btn.classList.add('talking'); };
    u.onend=function(){ if(btn) btn.classList.remove('talking'); };
    u.onerror=function(){ if(btn) btn.classList.remove('talking'); };
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  }
  function mount(){
    var home=document.getElementById('scr-home');
    if(!home || document.getElementById('home-listen')) return;
    var btn=document.createElement('button');
    btn.id='home-listen';
    btn.type='button';
    btn.setAttribute('aria-label','Read brief aloud');
    btn.innerHTML=JUG;
    btn.addEventListener('click', function(e){
      e.preventDefault();
      e.stopPropagation();
      speak();
    });
    home.appendChild(btn);
  }
  var n=0;
  var id=setInterval(function(){
    mount();
    n++;
    if(document.getElementById('home-listen')||n>80) clearInterval(id);
  },250);
})();
