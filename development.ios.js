'use strict';
// This file is used to setup React Native and fighweel dev environment
// It should only be used when in development
// For production run: `npm run build`

// TODO:
// - update readme for production minification
// - shim figwheel HUD to work in iOS simulator
// - general cleanup
// - move to npm package?
// - look into `Unbalanced calls start/end for tag 5`

// React setup
var React = require('react-native');

var placeHolder = React.createClass({
  render: function() {
    var plainStyle = {flex: 1,alignItems: 'center',justifyContent: 'center'};
    return (
      <React.View style={plainStyle}>
        <React.Text>Waiting for Figwheel to load files.</React.Text>
      </React.View>
    );
  }
});

React.AppRegistry.registerComponent('figTest', () => placeHolder);

// Config setup
var CLOSURE_UNCOMPILED_DEFINES = null;

var config = {
  SERVER: 'http://localhost:8081',
  OUTPUTDIR: 'dev',
  PROJECTNAME: 'rn-test'
};

// Load Cljs code and shim necessary js functions
function loadProject() {
  console.info('Dev? ' + __DEV__);
  console.info(config);
  if (typeof goog === 'undefined') {
    console.info('Loading Closure base.');
    importJs('goog/base.js', function() {
      shimBaseGoog();
      fakeLocalStorageAndDocument();
      importJs('cljs_deps.js');
      importJs('goog/deps.js', function() {
        // seriously React packager? why.
        var fig = 'figwheel.connect';
        goog.require(fig);
        goog.require('rn_test' + '.core');
      });
    });
  }else {
    console.error('Something is wrong. Goog is defined...');
  }
}

var globalEval = eval;
var importScripts = myImportScripts;
var scriptQueue = [];

function customEval(url, javascript, success, error) {
  if (scriptQueue.length > 0){
    if (scriptQueue[0] === url) {
      try {
        globalEval(javascript);
        console.info('Evaluated: ' + url);
        scriptQueue.shift();
        if(url.indexOf('jsloader') > -1){
          shimJsLoader();
        }
        success();
      } catch (e) {
        console.error('Evaluation error in: ' + url);
        console.error(e);
        error();
      }
    } else {
      setTimeout(customEval, 5, url, javascript, success, error);
    }
  } else {
    console.error('Something bad happened...');
    error()
  }
}

function myImportScripts(path, success, error) {
  var url = config.SERVER + '/' + path;

  console.info('(myImportScripts) Importing: ' + url);
  scriptQueue.push(url);
  fetch(url)
    .then((response) => response.text())
    .then((responseText) => {
      var js = responseText;
      customEval(url, js, success, error);
    })
    .catch((error) => {
      console.error('Error loading script, please check your config setup.');
      console.error(error);
      error();
    });
}

// Async load of javascript files
function importJs(src, success, error) {
  if (typeof success !== 'function') { success = function() {}; }
  if (typeof error !== 'function') { error = function() {}; }

  var filePath = config.OUTPUTDIR + '/' + src;

  console.info('(importJs) Importing: ' + filePath);
  importScripts(filePath, success, error);
}

// Goog fixes
function shimBaseGoog() {
  console.info('Shimming goog functions.');
  goog.basePath = 'goog/';
  goog.writeScriptSrcNode = importJs;
  goog.writeScriptTag_ = function(src, optSourceText) {
    importJs(src);
    return true;
  };
  goog.inHtmlDocument_ = function() { return true; };
}

function fakeLocalStorageAndDocument() {
  window.localStorage = {};
  window.localStorage.getItem = function() { return 'true'; };
  window.localStorage.setItem = function() {};

  window.document = {};
  window.document.body = {};
  window.document.body.dispatchEvent = function() {};
  window.document.createElement = function() {};

  if (typeof window.location === 'undefined') {
      window.location = {};
  }
  console.debug = console.warn;
  window.addEventListener = function() {};
}

// Figwheel fixes
// Used by figwheel - uses importScript to load JS rather than <script>'s
function shimJsLoader() {
  console.info('==== Shimming jsloader ====');
  goog.net.jsloader.load = function(uri, options) {
    var deferred = {
      callbacks: [],
      errbacks: [],
      addCallback: function(cb) {
        deferred.callbacks.push(cb);
      },
      addErrback: function(cb) {
        deferred.errbacks.push(cb);
      },
      callAllCallbacks: function() {
        while (deferred.callbacks.length > 0) {
          deferred.callbacks.shift()();
        }
      },
      callAllErrbacks: function() {
        while (deferred.errbacks.length > 0) {
          deferred.errbacks.shift()();
        }
      }
    };

    // Figwheel needs this to be an async call,
    //    so that it can add callbacks to deferred
    setTimeout(function() {
      importJs(uri.getPath(),
               deferred.callAllCallbacks,
               deferred.callAllErrbacks);
    }, 1);

    return deferred;
  };
}

// Load Cljs
loadProject();
