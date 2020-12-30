// Generated by LiveScript 1.6.0
(function(){
  var hub, json0, e, sharehub;
  try {
    hub = require("./datahub");
    json0 = require("ot-json0");
  } catch (e$) {
    e = e$;
    hub = datahub;
    json0 = otJson0;
  }
  sharehub = function(opt){
    var this$ = this;
    opt == null && (opt = {});
    this.evtHandler = {};
    this.data = {};
    this.id = opt.id || '';
    this.create = opt.create || null;
    hub.src.call(this, import$(import$({}, opt), {
      opsOut: function(ops){
        this$.data = json0.type.apply(this$.data, ops);
        return this$.doc.submitOp(JSON.parse(JSON.stringify(ops)));
      },
      get: function(){
        return JSON.parse(JSON.stringify(this$.data));
      }
    }));
    return this;
  };
  sharehub.prototype = import$(import$({}, hub.src.prototype), {
    on: function(n, cb){
      var ref$;
      return ((ref$ = this.evtHandler)[n] || (ref$[n] = [])).push(cb);
    },
    fire: function(n){
      var v, res$, i$, to$, ref$, len$, cb, results$ = [];
      res$ = [];
      for (i$ = 1, to$ = arguments.length; i$ < to$; ++i$) {
        res$.push(arguments[i$]);
      }
      v = res$;
      for (i$ = 0, len$ = (ref$ = this.evtHandler[n] || []).length; i$ < len$; ++i$) {
        cb = ref$[i$];
        results$.push(cb.apply(this, v));
      }
      return results$;
    },
    watch: function(ops, opt){
      if (!opt) {
        this.data = json0.type.apply(this.data, ops);
      }
      return this.opsIn(JSON.parse(JSON.stringify(ops)));
    },
    init: function(){
      var this$ = this;
      return Promise.resolve().then(function(){
        var sdb;
        this$.sdb = sdb = new sharedbWrapper({
          url: window.location.protocol.replace(':', '')
        }, window.location.domain);
        sdb.on('error', function(e){
          var ref$;
          if (!((ref$ = this$.evtHandler).error || (ref$.error = [])).length) {
            return console.error(e.err);
          } else {
            return this$.fire('error', e.err);
          }
        });
        return sdb.get({
          id: this$.id,
          create: this$.create ? function(){
            return this$.create();
          } : null,
          watch: function(){
            var args, res$, i$, to$;
            res$ = [];
            for (i$ = 0, to$ = arguments.length; i$ < to$; ++i$) {
              res$.push(arguments[i$]);
            }
            args = res$;
            return this$.watch.apply(this$, args);
          }
        });
      }).then(function(doc){
        this$.doc = doc;
        this$.data = JSON.parse(JSON.stringify(this$.doc.data));
        return {
          sdb: this$.sdb
        };
      });
    }
  });
  if (typeof module != 'undefined' && module !== null) {
    module.exports = sharehub;
  } else if (typeof window != 'undefined' && window !== null) {
    window.sharehub = sharehub;
  }
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
