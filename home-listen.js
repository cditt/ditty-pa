/* BUILD82 jug reads greeting + date + weather + brief */
(function(){
  var JUG='<svg viewBox="0 0 80 110" width="72" height="96" aria-hidden="true"><ellipse cx="40" cy="102" rx="22" ry="5" fill="rgba(0,0,0,.25)"/><path d="M28 18c0-6 4-10 12-10s12 4 12 10v6H28z" fill="#6b3a1e"/><rect x="36" y="6" width="8" height="14" rx="2" fill="#c4a574"/><path d="M22 28c0-6 8-10 18-10s18 4 18 10v8c12 6 14 22 8 38-6 16-22 26-26 26s-20-10-26-26c-6-16-4-32 8-38z" fill="#6b3a1e"/><path d="M24 36c2-4 10-8 16-8 8 0 16 3 18 8 2 14-2 30-10 40-6 8-16 12-18 8-8-14-10-32-6-48z" fill="#8a4e28" opacity=".55"/><path d="M56 34c10 4 14 16 10 28-2 8-8 12-8 12" fill="none" stroke="#4a2a14" stroke-width="5" stroke-linecap="round"/><circle cx="30" cy="52" r="6" fill="#c4a574" opacity=".25"/></svg>';
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
    u.pitch=1;
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
