(function(){
function fmt(n){return (n>=0?'+':'')+Number(n).toFixed(2);}
function paint(price,chg,pct){
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
function load(){
  paint(340.44,0.69,0.20);
  fetch('https://query1.finance.yahoo.com/v8/finance/chart/AAPL?interval=1d&range=1d')
    .then(function(r){return r.json();})
    .then(function(j){
      var m=j.chart.result[0].meta;
      var price=m.regularMarketPrice;
      var prev=m.chartPreviousClose||m.previousClose||price;
      var chg=price-prev;
      paint(price,chg,prev?(chg/prev)*100:0);
    }).catch(function(){});
}
function tick(){ if(document.getElementById('port-body')) load(); }
setTimeout(tick,600);
setTimeout(tick,2000);
setInterval(tick,45000);
})();
