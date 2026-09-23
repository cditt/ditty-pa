(function(){
  var PROXY='https://ditty-pa-proxy.hddittemore.workers.dev';
  var REDIR='https://cditt.github.io/ditty-pa/';
  function authUrl(){
    return 'https://accounts.google.com/o/oauth2/v2/auth?client_id='+GID
      +'&redirect_uri='+encodeURIComponent(REDIR)
      +'&response_type=code&access_type=offline&include_granted_scopes=true'
      +'&scope='+encodeURIComponent(GSCOPE);
  }
  window.gConnect=function(){ location.href=authUrl(); };

  var q=new URLSearchParams(location.search);
  var code=q.get('code');
  if(code){
    fetch(PROXY+'/google/exchange',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({code:code,redirect_uri:REDIR})
    }).then(function(r){return r.json();}).then(function(d){
      if(d&&d.access_token){
        localStorage.setItem('dpa3_g', d.access_token);
        if(d.refresh_token) localStorage.setItem('dpa3_gr', d.refresh_token);
        if(window.GT!==undefined) window.GT=d.access_token;
      }
      history.replaceState(null,'',location.pathname);
      location.reload();
    }).catch(function(){ history.replaceState(null,'',location.pathname); });
    return;
  }

  function refresh(){
    var rt=localStorage.getItem('dpa3_gr');
    if(!rt) return Promise.resolve(null);
    return fetch(PROXY+'/google/refresh',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({refresh_token:rt})
    }).then(function(r){return r.json();}).then(function(d){
      if(d&&d.access_token){
        localStorage.setItem('dpa3_g', d.access_token);
        if(window.GT!==undefined) window.GT=d.access_token;
        if(window.GAUTH!==undefined) window.GAUTH='ok';
        return d.access_token;
      }
      return null;
    }).catch(function(){return null;});
  }

  setInterval(function(){
    if(window.GAUTH==='expired') refresh();
  }, 4000);
})();
