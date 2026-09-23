(function(){
function vaultSrc(){
  var a=window.DITTY_VAULT_A||"";
  var b=window.DITTY_VAULT_B||"";
  var c=window.DITTY_VAULT_C||"";
  if(!a||!b||!c) return "";
  return "data:image/jpeg;base64,"+a+b+c;
}
function fmt(n){return (n>=0?"+":"")+Number(n).toFixed(2);}
function paintAapl(price,chg,pct,meta){
  var body=document.getElementById("port-body");
  if(!body)return;
  var old=document.getElementById("aapl-watch");
  if(old)old.remove();
  var up=chg>=0;
  var el=document.createElement("div");
  el.id="aapl-watch";
  el.className="port-row "+(up?"up-row":"dn-row");
  el.innerHTML='<div class="port-bar"></div><div class="port-left"><div class="port-ticker">AAPL</div><div class="port-shares">watch</div></div><div class="port-sparkline"></div><div class="port-right"><div class="port-price">'+Number(price).toFixed(2)+'</div><div class="port-chg">'+fmt(chg)+'</div><div class="port-chg">'+fmt(pct)+'%</div></div>';
  body.insertBefore(el, body.firstChild);
  var strip=document.getElementById("port-quote-strip");
  if(!strip){
    strip=document.createElement("div");
    strip.id="port-quote-strip";
    var host=document.getElementById("port-content")||body.parentNode;
    if(host&&host.parentNode) host.parentNode.insertBefore(strip, host.nextSibling);
    else body.parentNode.appendChild(strip);
  }
  var bid=(meta&&meta.bid)|| (price-0.01);
  var ask=(meta&&meta.ask)|| (price+0.01);
  var vol=(meta&&meta.vol)||"\u2014";
  strip.innerHTML='<span>VOL</span><b>'+vol+'</b><span>BID</span><b>'+Number(bid).toFixed(2)+'</b><span>ASK</span><b>'+Number(ask).toFixed(2)+'</b>';
}
function loadAapl(){
  paintAapl(340.44,0.69,0.20);
  fetch("https://query1.finance.yahoo.com/v8/finance/chart/AAPL?interval=1d&range=1d")
    .then(function(r){return r.json();})
    .then(function(j){
      var m=j.chart.result[0].meta;
      var price=m.regularMarketPrice;
      var prev=m.chartPreviousClose||m.previousClose||price;
      var chg=price-prev;
      var vol=m.regularMarketVolume;
      var volS=vol?(vol>=1e6?(vol/1e6).toFixed(2)+"M":String(vol)):"\u2014";
      paintAapl(price,chg,prev?(chg/prev)*100:0,{bid:m.bid||price,ask:m.ask||price,vol:volS});
    }).catch(function(){});
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
function svgVault(){
  return '<svg id="vault-art" viewBox="0 0 640 560" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMin slice"><defs><radialGradient id="g" cx="50%" cy="42%" r="58%"><stop offset="0%" stop-color="#3a3324"/><stop offset="55%" stop-color="#1a1810"/><stop offset="100%" stop-color="#070705"/></radialGradient><radialGradient id="m" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#c4a35a"/><stop offset="45%" stop-color="#8a6a32"/><stop offset="100%" stop-color="#3e2f14"/></radialGradient></defs><rect width="640" height="560" fill="#050705"/><circle cx="320" cy="300" r="250" fill="url(#g)" stroke="#2a2618" stroke-width="8"/><circle cx="320" cy="300" r="210" fill="none" stroke="#6e5a30" stroke-width="10"/><circle cx="320" cy="300" r="168" fill="none" stroke="#4a3c1e" stroke-width="18"/><circle cx="320" cy="300" r="118" fill="url(#m)" stroke="#d7b56a" stroke-width="6"/><circle cx="320" cy="300" r="38" fill="#1a160c" stroke="#c4a35a" stroke-width="5"/><g stroke="#1a160c" stroke-width="10" stroke-linecap="round"><line x1="320" y1="190" x2="320" y2="248"/><line x1="320" y1="352" x2="320" y2="410"/><line x1="210" y1="300" x2="268" y2="300"/><line x1="372" y1="300" x2="430" y2="300"/><line x1="243" y1="223" x2="284" y2="264"/><line x1="356" y1="336" x2="397" y2="377"/><line x1="243" y1="377" x2="284" y2="336"/><line x1="356" y1="264" x2="397" y2="223"/></g><rect x="230" y="148" width="180" height="36" rx="4" fill="#2b2414" stroke="#c4a35a" stroke-width="2"/><text x="320" y="173" text-anchor="middle" font-family="Georgia,serif" font-size="16" fill="#e6d39a" letter-spacing="2">DITTY MONEY</text><circle cx="430" cy="248" r="8" fill="#7a0d0d"/><circle cx="430" cy="248" r="4" fill="#ff2a2a"/></svg>';
}
function mountVault(){
  var scr=document.getElementById("scr-portfolio");
  if(!scr)return;
  hideHandsOff();
  var src=vaultSrc();
  var wrap=document.getElementById("vault-art-wrap");
  if(!wrap){
    wrap=document.createElement("div");
    wrap.id="vault-art-wrap";
    wrap.innerHTML=src?'<img id="vault-art" alt="Ditty Money vault">':svgVault();
    scr.appendChild(wrap);
  }
  if(src){
    var img=document.getElementById("vault-art");
    if(img && img.tagName==="IMG" && img.getAttribute("src")!==src) img.src=src;
    else if(!img || img.tagName!=="IMG"){ wrap.innerHTML='<img id="vault-art" alt="Ditty Money vault" src="'+src+'">'; }
  }
}
function loadParts(done){
  var files=["vault-a.js?v=3","vault-b.js?v=3","vault-c.js?v=3"];
  var left=files.length;
  files.forEach(function(src){
    var s=document.createElement("script");
    s.src=src;
    s.onload=s.onerror=function(){ left--; if(!left) done(); };
    document.head.appendChild(s);
  });
}
function tick(){
  mountVault();
  if(document.getElementById("port-body")) loadAapl();
}
loadParts(function(){ tick(); setTimeout(tick,800); });
setTimeout(tick,400);
setTimeout(tick,1600);
setInterval(function(){
  mountVault();
  if(document.getElementById("port-body")&&!document.getElementById("aapl-watch")) loadAapl();
}, 20000);
})();
