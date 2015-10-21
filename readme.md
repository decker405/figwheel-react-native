Instructions

1. In index.ios.js: var App = require('MainApp'); App.start();
	 - make sure you leave a basic component and registration in there so that ReactNative doesn't blow up
2. Put cljs_bridge in root directory (probably doesn't actually matter...)
   - change basePath in this file if necessary
3. Delete or empty react.inc.js if included in your cljs project
4. Run packager: ./node_modules/react-native/packager/packager.sh
5. Press command + D and select 'Debug in Chrome' (this is what opens the web socket)
6. Run (rlwrap) lein figwheel from your cljs directory to connect to your app

- This is very expiremental (should work with RN 0.12.0 and below...haven't tested on anything other than 0.12.0)
- Only tested with iOS
- Live-reload works
- There may be errors when adding or removing files that will require you to reload the simulator
- I expect uncaught errors in edge-cases (the code is not incredibly robust)

TODO:
- Automatically remove react.inc.js from dependencies (when reagent or om is required)
- Write a plugin (or fork) for lein-figwheel to use alternative loading scheme instead of shimming js
  - if forking, create a new :target option (:web-worker)
- Test on RN 0.13.0-RC
- Production app build
- Test on actual device
- Remove @providesModule from figwheel_bridge.js and put in npm?