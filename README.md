# scriptloader

preload script while execute in order, when DOMContentLoaded is called.

The test under `web` folder ( 20 requests, 533kB resources ) contains test with `scriptloader` and `synchronous` tags. Their results:

 - `tag`: `DOMContentLoaded` ~ `Load`. ( 670ms )
 - `tag` with `defer`: similar to `tag`.
 - `scriptloader`: `DOMContentLoaded` (588ms) faster than `Load` by ~ 80ms (666ms)

where

 - `DOMContentLoaded`: DOM is ready, so the handler can lookup DOM nodes.
 - `Load`: external resources are loaded, so styles are applied, image sizes are known etc.


## Discuss

 - `scriptloader` is faster in `DOMConentLoaded`, because it defers script executing after `DOMContentLoaded`.
 - `scriptloader` may be used to control cache of js files.

