/* BUILD82 jug reads greeting + date + weather + brief */
(function(){
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
