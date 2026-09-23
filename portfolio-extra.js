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
  var vol=(meta&&meta.vol)||"—";
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
      var volS=vol?(vol>=1e6?(vol/1e6).toFixed(2)+"M":String(vol)):"—";
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
    wrap.innerHTML='<img id="vault-art" alt="Ditty Money vault">';
    scr.appendChild(wrap);
  }
  var img=document.getElementById("vault-art");
  if(img && img.getAttribute("src")!==src) img.src=src;
}
function loadParts(done){
  var files=["vault-a.js?v=2","vault-b.js?v=2","vault-c.js?v=2"];
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
