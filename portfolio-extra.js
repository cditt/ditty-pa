(function(){
function fmt(n){return (n>=0?'+':'')+Number(n).toFixed(2);}
function paintAapl(price,chg,pct){
  var body=document.getElementById('port-body');
  if(!body)return;
  var old=document.getElementById('aapl-watch');
  if(old)old.remove();
  var up=chg>=0;
  var el=document.createElement('div');
  el.id='aapl-watch';
  el.className='port-row '+(up?'up-row':'dn-row');
  el.innerHTML='<div class="port-bar"></div><div class="port-left"><div class="port-ticker">AAPL</div><div class="port-shares">watch</div></div><div class="port-sparkline"></div><div class="port-right"><div class="port-price">$'+Number(price).toFixed(2)+'</div><div class="port-chg">'+fmt(chg)+'</div><div class="port-chg" style="font-size:11px">'+fmt(pct)+'%</div></div>';
  body.insertBefore(el, body.firstChild);
}
function loadAapl(){
  paintAapl(340.44,0.69,0.20);
  fetch('https://query1.finance.yahoo.com/v8/finance/chart/AAPL?interval=1d&range=1d')
    .then(function(r){return r.json();})
    .then(function(j){
      var m=j.chart.result[0].meta;
      var price=m.regularMarketPrice;
      var prev=m.chartPreviousClose||m.previousClose||price;
      var chg=price-prev;
      paintAapl(price,chg,prev?(chg/prev)*100:0);
    }).catch(function(){});
}
function mountVault(){
  var scr=document.getElementById('scr-portfolio');
  if(!scr||document.getElementById('vault-art'))return;
  if(!window.DITTY_VAULT)return;
  var wrap=document.createElement('div');
  wrap.id='vault-art-wrap';
  wrap.innerHTML='<img id="vault-art" alt="Ditty Money vault" src="'+window.DITTY_VAULT+'">';
  scr.appendChild(wrap);
}
function boot(){
  mountVault();
  if(document.getElementById('port-body')) loadAapl();
}
var s=document.createElement('script');
s.src='vault-photo.js?v=1';
s.onload=boot;
document.head.appendChild(s);
setTimeout(boot,700);
setTimeout(boot,2000);
})();
