(function(){
  var REDIR='https://cditt.github.io/ditty-pa/';
  function authUrl(prompt){
    return 'https://accounts.google.com/o/oauth2/v2/auth?client_id='+GID
      +'&redirect_uri='+encodeURIComponent(REDIR)
      +'&response_type=token&include_granted_scopes=true'
      +'&scope='+encodeURIComponent(GSCOPE)
      +(prompt?('&prompt='+prompt):'');
  }
  window.gConnect=function(){ location.href=authUrl(); };
  var tries=0;
  setInterval(function(){
    if(window.GAUTH==='expired' && tries<2){
      tries++;
      location.href=authUrl('none');
    }
  }, 4000);
})();
