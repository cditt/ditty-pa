/* BUILD84 real jug, pinned to deck */
(function(){
  var SRC="data:image/jpeg;base64,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";
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
    var brief=t('#ab-body')||t('.ab-body');
    if(g) parts.push(g);
    if(d) parts.push(d);
    if(w) parts.push(w);
    if(brief) parts.push(brief);
    return parts.join('. ');
  }
  function speak(){
    if(!window.speechSynthesis) return;
    if(speechSynthesis.speaking){
      speechSynthesis.cancel();
      var btn=document.getElementById('home-listen');
      if(btn) btn.classList.remove('talking');
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
  function homeOn(){
    var h=document.getElementById('scr-home');
    if(!h) return false;
    var s=window.getComputedStyle(h);
    if(s.display==='none' || s.visibility==='hidden') return false;
    if(h.classList.contains('off')) return false;
    return true;
  }
  function mount(){
    var home=document.getElementById('scr-home');
    var btn=document.getElementById('home-listen');
    if(!btn && home){
      btn=document.createElement('button');
      btn.id='home-listen';
      btn.type='button';
      btn.setAttribute('aria-label','Read brief aloud');
      var img=document.createElement('img');
      img.src=SRC;
      img.alt='';
      btn.appendChild(img);
      btn.addEventListener('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        speak();
      });
      home.appendChild(btn);
    }
    if(btn) btn.style.display = homeOn() ? 'block' : 'none';
  }
  setInterval(mount, 300);
})();
