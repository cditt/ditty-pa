/* BUILD86 jug from xxx-jug.svg */
(function(){
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
  }
  setInterval(sync, 400);
  sync();
})();
