## Figwheel React Native Hot Reloading (with Reagent)
#### Instructions

1. Clone the repo: `https://github.com/decker405/figwheel-react-native.git`
2. `cd figwheel-react-native`
3. Install node dependencies: `npm i`
4. `cd rn-test`
5. Run figwheel: `lein figwheel` or `rlwrap lein figwheel` (if rlwrap installed)
6. Find `/build/out/react.inc.js`, delete all content, and save
6. `cd ../`
7. Run packager: `./node_modules/react-native/packager/packager.sh`
8. Open `ios/figTest.xcodeproj` in XCode
9. Run app in simulator
10. Press `⌘ + D `  and select `Debug in Chrome`
11. Watch figwheel dependencies load and then connect
12. Make changes to your code or in the repl

#### Notes

- This is very expiremental (should work with RN 0.12.0 and below...haven't tested on anything other than 0.12.0 - original version that used `<script>` tags worked best with 0.11.0, but they started using web workers to run client code in 0.12.0)
- Only tested with iOS
- Live-reload works
- There may be errors when adding or removing files that will require you to reload the simulator
- I expect uncaught errors in edge-cases (the code is not incredibly robust)

#### TODO:
- Automatically remove react.inc.js from dependencies (when reagent or om is required)
- Write a plugin (or fork) for lein-figwheel to use alternative loading scheme instead of shimming js (possibly a new :target :webworker option?)
- Test on RN 0.13.0-RC
- Production app build step
- Test on actual iOS device (not simulator)
- Remove @providesModule from figwheel_bridge.js and put in npm?

### How it works:
- React Native's `Debug in Chrome` option opens up a web socket with the simulator/device, executes all javascript code in a web worker, and then sends the results to device (or something of the sort, not sure I fully understand)
- Shimming goog.require and goog.net.jsLoader (figwheel uses jsLoader to reload files) to get js files via HTTP and eval them allows this to work inside of a web worker (i.e. without a global document)

### Contributing
Advice, tips, and general code contributions welcome and encouraged.

### License
[LICENSE](/LICENSE)





