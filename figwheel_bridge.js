/*
* @providesModule FigwheelBridge
*/

var CLOSURE_UNCOMPILED_DEFINES = null;

var baseUrl = 'http://localhost:8081/'
var basePath = 'rn-test/build/out';

var queue = [];

// Synchronously evals code (even if later ajax's complete first)
function waitForTurn(src, content, callback){
  setTimeout(function(){
    if(queue.length > 0){
      if(queue[0] === src){
        eval.call(window, content);
        let last = queue.shift();
        // hacky, but shims goog.net.jsLoader after it is evaled.
        if(last.indexOf('goog/net/jsloader') > -1) { shimJsLoader(); }
        console.log('Evaled.');
        callback();
      }else{
        waitForTurn(src, content, callback);
      }
    }else{
      // ???
    }
  }, 100);
}

// Synchronously loads JS (using queue variable)
//   run into a lot of errors if code is async eval'd
function loadSyncJS(src, cb) {
  if (typeof cb !== 'function') { cb = function(){}; }
  queue.push(src);

  var r = new XMLHttpRequest();
  r.open('GET', baseUrl + src, true);
  r.onreadystatechange = function () {
    if (r.readyState != 4 || r.status != 200) return;
    waitForTurn(src, r.responseText, cb);
  };
  r.send();
  console.log('GET: ' + src);
}

// Loads base goog js file then cljs_deps, goog.deps, core project cljs, and then figwheel
// Also calls the function to shim goog.require
function startEverything() {
  if(typeof goog === "undefined") {
    console.log('Loading Closure base.');
    loadSyncJS(basePath + '/goog/base.js', function(){
      shim(goog, loadSyncJS, basePath);
      loadSyncJS(basePath + '/cljs_deps.js');
      loadSyncJS(basePath + '/goog/deps.js', function(){
        goog.require('rn_test.core');
        goog.require('figwheel.connect');
      });
    });
  }
}

module.exports = {
  start: startEverything
}

// Function to shim goog to use above write function instead of modifying the body...
function shim(goog, writeSync, basePath){
  console.log('Shimming google\'s Closure library.');
  // Sets goog.writeScriptSrcNode_ to above function
  //   Not sure if there is a native goog closure way to have code remotely evaled...
  goog.writeScriptSrcNode_ = writeSync;
  // Clears up a small (document) error
  goog.writeScriptTag_ = function(src, opt_sourceText) {
    goog.writeScriptSrcNode_(src);
    return true;
  };
  // Sets goog basePath to above basePath plus the goog folder
  goog.basePath = basePath + '/goog/';


  // To fix figwheel errors
  // fake that we're in an html document
  goog.inHtmlDocument_ = function(){ return true; };
  // fake localStorage
  eval.call(window, 'var localStorage = {}; localStorage.getItem = function(){ return "true"; }; localStorage.setItem = function(){};');
  eval.call(window, 'var document = {}; document.body = {}; document.body.dispatchEvent = function(){}; document.createElement = function(){};');
}

// Used by figwheel - Loads and evals js over HTTP instead of adding script tags
//   have it call after src==='goog.net.jsLoader' in the async load above
//   or call it from figwheel start script...
function shimJsLoader(){
  goog.net.jsloader.load = function(uri, options) {
    var deferred = {
      callbacks: [],
      errbacks: [],
      addCallback: function(cb){
        this.callbacks.push(cb);
      },
      addErrback: function(cb){
        this.errbacks.push(cb);
      },
      callAllCallbacks: function(){
        while(this.callbacks.length > 0){
          this.callbacks.shift()();
        }
      },
      callAllErrbacks: function(){
        while(this.errbacks.length > 0){
          this.errbacks.shift()();
        }
      }
    };

    loadSyncJS(uri.getPath(), function(){
      deferred.callAllCallbacks();
    });


    return deferred;
  }
}








