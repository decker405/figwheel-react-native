/*
* @providesModule FigwheelBridge
*/

var CLOSURE_UNCOMPILED_DEFINES = null;

var config = {
  basePath: '/rn-test/build/out/',
  googBasePath: 'goog/',
  platform: 'ios',
  dev: 'true'
};

// Uninstall watchman???
function importJs(src, success, error){
  if(typeof success !== 'function') { success = function(){}; }
  if(typeof error !== 'function') { error = function(){}; }

  console.log('(Figwheel Bridge) Importing: ' + config.basePath + src);
  try {
    importScripts(config.basePath + src);
    success();
  } catch(e) {
    console.warn('Could not load: ' + config.basePath + src);
    console.error('Import error: ' + e);
    error();
  }
}

// Loads base goog js file then cljs_deps, goog.deps, core project cljs, and then figwheel
// Also calls the function to shim goog.require and goog.net.jsLoader.load
function startEverything() {
  if(typeof goog === "undefined") {
    console.log('Loading Closure base.');
    importJs('goog/base.js');
    shimBaseGoog();
    fakeLocalStorageAndDocument();
    importJs('cljs_deps.js');
    importJs('goog/deps.js');
    importJs('figwheel/connect.js');

    // goog.require('figwheel.connect');
    // goog.require('rn_test.core');
    shimJsLoader();

    console.log('Done loading Figwheel and Clojure app');
  }
}

function shimBaseGoog(){
  goog.basePath = 'goog/';
  goog.writeScriptSrcNode = importJs;
  goog.writeScriptTag_ = function(src, opt_sourceText){
    importJs(src);
    return true;
  }
  goog.inHtmlDocument_ = function(){ return true; };
}

function fakeLocalStorageAndDocument() {
  window.localStorage = {};
  window.localStorage.getItem = function(){ return 'true'; };
  window.localStorage.setItem = function(){};

  window.document = {};
  window.document.body = {};
  window.document.body.dispatchEvent = function(){};
  window.document.createElement = function(){};
}

module.exports = {
  start: startEverything,
  config: config
}


// Used by figwheel - uses importScript to load JS rather than <script>'s
function shimJsLoader(){
  goog.net.jsloader.load = function(uri, options) {
    var deferred = {
      callbacks: [],
      errbacks: [],
      addCallback: function(cb){
        deferred.callbacks.push(cb);
      },
      addErrback: function(cb){
        deferred.errbacks.push(cb);
      },
      callAllCallbacks: function(){
        while(deferred.callbacks.length > 0){
          deferred.callbacks.shift()();
        }
      },
      callAllErrbacks: function(){
        while(deferred.errbacks.length > 0){
          deferred.errbacks.shift()();
        }
      }
    };

    // Figwheel needs this to be an async call, so that it can add callbacks to deferred
    setTimeout(function(){
      importJs(uri.getPath(), deferred.callAllCallbacks, deferred.callAllErrbacks);
    }, 1)

    return deferred;
  }
}
