(function(){
  var rescope;
  rescope = function(opt){
    opt == null && (opt = {});
    this.opt = opt;
    this.global = opt.global || window;
    this.scope = {};
    return this;
  };
  rescope.prototype = import$(Object.create(Object.prototype), {
    peekScope: function(){
      console.log("is delegate: " + !!this.global._rescopeDelegate);
      return this.global._rescopeDelegate;
    },
    init: function(){
      var this$ = this;
      if (!this.opt.delegate) {
        return Promise.resolve();
      }
      return new Promise(function(res, rej){
        var node, ref$, code;
        node = document.createElement('iframe');
        node.setAttribute('sandbox', 'allow-same-origin allow-scripts');
        ref$ = node.style;
        ref$.opacity = 0;
        ref$.zIndex = -1;
        ref$.pointerEvents = 'none';
        ref$.width = '0px';
        ref$.height = '0px';
        code = "<html><body>\n<script>\nfunction init() {\n  if(!window._scope) { window._scope = new rescope({delegate:false,global:window}) }\n}\nfunction load(url) {\n  init();\n  return _scope.load(url,false);\n}\nfunction context(url,func) {\n  init();\n  _scope.context(url,func,false);\n}\n</script></body></html>";
        node.onerror = function(it){
          return rej(it);
        };
        node.onload = function(){
          var ref$;
          ref$ = this$.delegate = node.contentWindow;
          ref$.rescope = rescope;
          ref$._rescopeDelegate = true;
          return res();
        };
        node.src = URL.createObjectURL(new Blob([code], {
          type: 'text/html'
        }));
        return document.body.appendChild(node);
      });
    },
    context: function(url, func, delegate){
      var stacks, scopes, i$, to$, i, ref$, stack, scope, k, lresult$, results$ = [];
      delegate == null && (delegate = true);
      if (delegate && this.opt.delegate) {
        return this.delegate.context(url, func);
      }
      url = Array.isArray(url)
        ? url
        : [url];
      stacks = [];
      scopes = [];
      for (i$ = 0, to$ = url.length; i$ < to$; ++i$) {
        i = i$;
        ref$ = [{}, this.scope[url[i].url || url[i]] || {}], stack = ref$[0], scope = ref$[1];
        for (k in scope) {
          stack[k] = this.global[k];
          this.global[k] = scope[k];
        }
        stacks.push(stack);
        scopes.push(scope);
      }
      func(this.global);
      for (i$ = scopes.length - 1; i$ >= 0; --i$) {
        i = i$;
        lresult$ = [];
        scope = scopes[i];
        stack = stacks[i];
        for (k in scope) {
          lresult$.push(this.global[k] = stack[k]);
        }
        results$.push(lresult$);
      }
      return results$;
    },
    load: function(url, delegate){
      var ret, this$ = this;
      delegate == null && (delegate = true);
      if (delegate && this.opt.delegate) {
        return this.delegate.load(url).then(function(it){
          import$(this$.scope, this$.delegate._scope.scope);
          return it;
        });
      }
      if (!url) {
        return Promise.resolve();
      }
      url = Array.isArray(url)
        ? url
        : [url];
      ret = {};
      return new Promise(function(res, rej){
        var _;
        _ = function(list, idx){
          var items, i$, to$, i;
          items = [];
          if (idx >= list.length) {
            return res(ret);
          }
          for (i$ = idx, to$ = list.length; i$ < to$; ++i$) {
            i = i$;
            items.push(list[i]);
            if (list[i].async != null && !list[i].async) {
              break;
            }
          }
          if (!items.length) {
            return res(ret);
          }
          return Promise.all(items.map(function(it){
            return this$._load(it.url || it).then(function(it){
              return import$(ret, it);
            });
          })).then(function(){
            return this$.context(items.map(function(it){
              return it.url || it;
            }), function(){
              return _(list, idx + items.length);
            });
          });
        };
        return _(url, 0);
      });
    },
    _load: function(url){
      var this$ = this;
      return new Promise(function(res, rej){
        var script, hash, k, ref$, v, fullUrl;
        script = this$.global.document.createElement("script");
        hash = {};
        for (k in ref$ = this$.global) {
          v = ref$[k];
          hash[k] = v;
        }
        script.onerror = function(it){
          return rej(it);
        };
        script.onload = function(){
          var scope, k, ref$, v;
          this$.scope[url] = scope = {};
          for (k in ref$ = this$.global) {
            v = ref$[k];
            if (hash[k] != null || !(this$.global[k] != null)) {
              continue;
            }
            scope[k] = this$.global[k];
            this$.global[k] = hash[k];
          }
          return res(scope);
        };
        fullUrl = /(https?:)?\/\//.exec(url)
          ? url
          : window.location.origin + (url[0] === '/' ? '' : '/') + url;
        script.setAttribute('src', fullUrl);
        return this$.global.document.body.appendChild(script);
      });
    }
  });
  if (typeof module != 'undefined' && module !== null) {
    module.exports = rescope;
  }
  if (typeof window != 'undefined' && window !== null) {
    window.rescope = rescope;
  }
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
