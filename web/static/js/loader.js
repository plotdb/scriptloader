window.addEventListener('DOMContentLoaded', function(){
  var consume, t1;
  consume = function(list, idx){
    var link;
    idx == null && (idx = 0);
    if (!(link = list[idx])) {
      return Promise.resolve();
    }
    return new Promise(function(res, rej){
      var script;
      script = document.createElement("script");
      script.setAttribute('src', link.getAttribute('href'));
      script.onload = function(){
        return res(consume(list, idx + 1));
      };
      return document.body.appendChild(script);
    });
  };
  t1 = Date.now();
  return consume(Array.from(document.querySelectorAll("link[as=script][rel=preload]"))).then(function(){
    return console.log("script loaded. elapsed time: ", Date.now() - t1);
  });
});