## Figwheel React Native Hot Reloading (with Reagent)
#### Instructions

1. Clone the repo: `https://github.com/decker405/figwheel-react-native.git`
2. `cd figwheel-react-native`
3. Install node dependencies: `npm i`
4. Run figwheel: `lein figwheel` or `rlwrap lein figwheel` (if rlwrap installed)
5. Run packager: `npm start` or `./node_modules/react-native/packager/packager.sh`
6. Open `ios/figTest.xcodeproj` in Xcode
7. Run app in simulator
8. You should see the figwheel dependencies load in the Xcode Console
9. Make changes to your code or in the repl and watch figwheel do it's magic

(Optionally (and it's a bit nicer to use) you can press `⌘ + D ` in the simulator and select `Debug in Chrome` to have your debug ouput in the chrome browser. Be warned that this can lead to errors with your code as Chrome's V8 and iOS' JavascriptCore have some functions that behave differently)

I also advise you to install watchman `brew install watchman` (it will make the packager faster)
[watchman](https://facebook.github.io/watchman/)

#### Dependency Information

- Should work with React Native >=0.13 (probably works on 0.12 as well)
- Only tested on iOS, not yet on Android

#### Caveats

- There are issues with requiring nodejs modules because of how React Native's packager works
  (may be solvable by direct linking instead of using the module name)
- Have not yet devised a great/simple production build step

#### Production Build Instructions

- Run `lein cljs-build once min`
- Run `npm run build`
- Link to the local js bundle in AppDelegate.m and run in the simulator
- Errors are most likely related to how React Native is setting its \_\_DEV\_\_ variable
  (try setting developMode? to false in [src/rn_test/core.cljs](https://github.com/decker405/figwheel-react-native/blob/inSimulatorReload/src/rn_test/core.cljs#L6-L8) - need to use the runProduction function rather than runDevelop)

#### License
[LICENSE](/LICENSE)





