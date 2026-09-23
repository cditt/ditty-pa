(function(){
function vaultSrc(){
  var a=window.DITTY_VAULT_A||"";
  var b=window.DITTY_VAULT_B||"";
  var c=window.DITTY_VAULT_C||"";
  if(a.indexOf("/9j/")===0 && !b) return "data:image/jpeg;base64,"+a;
  if(!a||!b||!c) return "";
  return "data:image/jpeg;base64,"+a+b+c;
}
function hideHandsOff(){
  var scr=document.getElementById("scr-portfolio");
  if(!scr)return;
  var nodes=scr.querySelectorAll("h1,h2,h3,.banner,div,span,p");
  for(var i=0;i<nodes.length;i++){
    var t=(nodes[i].childNodes.length===1)?(nodes[i].textContent||"").replace(/\s+/g," ").trim():"";
    if(/^HANDS\s*OFF$/i.test(t)) nodes[i].style.display="none";
  }
}
function mountVault(){
  var scr=document.getElementById("scr-portfolio");
  if(!scr)return;
  hideHandsOff();
  var src=vaultSrc();
  if(!src)return;
  var wrap=document.getElementById("vault-art-wrap");
  if(!wrap){
    wrap=document.createElement("div");
    wrap.id="vault-art-wrap";
    scr.appendChild(wrap);
  }
  wrap.innerHTML='<img id="vault-art" alt="Ditty Money vault" src="'+src+'">';
}
function loadParts(done){
  var s=document.createElement("script");
  s.src="vault-a.js?v=6";
  s.onload=s.onerror=function(){ done(); };
  document.head.appendChild(s);
}
function tick(){ mountVault(); }
loadParts(function(){ tick(); setTimeout(tick,600); });
setTimeout(tick,300);
})();
