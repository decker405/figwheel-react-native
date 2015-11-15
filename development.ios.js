'use strict';
// This file is used to setup React Native and fighweel dev environment
// It should only be used when in development
// For production run: react-native bundle, instead

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
  console.log('Dev? ' + __DEV__);
  console.log(config);
  if (typeof goog === 'undefined') {
    console.log('Loading Closure base.');
    importJs('goog/base.js', function() {
      console.log('Goog? ' + goog);
      shimBaseGoog();
      fakeLocalStorageAndDocument();
      importJs('cljs_deps.js');
      importJs('goog/deps.js', function() {
        // seriously React packager? why.
        var fig = 'figwheel.connect';
        goog.require(fig);
        goog.require('rn_test' + '.core');
        // console.log('Done loading Figwheel and Clojure app');
      });
    });
  }else {
    console.log('Something is wrong. Goog is defined...');
  }
}

if (!importScripts) {
  console.log('Not in a web worker environment.');
  console.log('Shimming importScripts function.');
  var importScripts = myImportScripts;
}

var globalEval = eval;
var scriptQueue = [];

function customEval(url, javascript, success, error) {
  if (scriptQueue.length > 0){
    if (scriptQueue[0] === url) {
      try {
        globalEval(javascript);
        console.log('Evaluated: ' + url);
        scriptQueue.shift();
        if(url.indexOf('jsloader') > -1){
          shimJsLoader();
        }
        success();
      } catch (e) {
        console.log('Evaluation error in: ' + url);
        console.log(e);
        error();
      }
    } else {
      setTimeout(customEval, 5, url, javascript, success, error);
    }
  } else {
    console.log('Something bad happened...');
    error()
  }
}

function myImportScripts(path, success, error) {
  var url = config.SERVER + '/' + path;

  //console.log('Fetching: ' + url);
  scriptQueue.push(url);
  fetch(url)
    .then((response) => response.text())
    .then((responseText) => {
      var js = responseText;
      customEval(url, js, success, error);
    })
    .catch((error) => {
      console.log('Error loading script, please check your config setup.');
      console.log(error);
      error();
    });
}

// Async load of javascript files
function importJs(src, success, error) {
  if (typeof success !== 'function') { success = function() {}; }
  if (typeof error !== 'function') { error = function() {}; }

  var filePath = config.OUTPUTDIR + '/' + src;

  //console.log('(Figwheel Bridge) Importing: ' + filePath);
  importScripts(filePath, success, error);
  // try {
  //   importScripts(filePath);
  //   success();
  // } catch (e) {
  //   console.warn('Could not load: ' + filePath);
  //   console.error('Import error: ' + e);
  //   error();
  // }
}

// Goog fixes
function shimBaseGoog() {
  console.log('Shimming goog functions.');
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

  window.location = {};
  console.debug = console.warn;
  window.addEventListener = function() {};
}

// Figwheel fixes
// Used by figwheel - uses importScript to load JS rather than <script>'s
function shimJsLoader() {
  console.log('==== Shimming jsloader ====');
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
