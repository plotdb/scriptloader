window.addEventListener \DOMContentLoaded, ->
  consume = (list, idx = 0) ->
    if !(link = list[idx]) => return Promise.resolve!
    (res, rej) <- new Promise _
    script = document.createElement("script")
    script.setAttribute \src, link.getAttribute(\href)
    script.onload = -> res consume(list, idx + 1)
    document.body.appendChild script
  t1 = Date.now!
  consume Array.from(document.querySelectorAll("link[as=script][rel=preload]"))
    .then -> console.log "script loaded. elapsed time: ", (Date.now! - t1)
