/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var FigBridge = require('FigwheelBridge');

var {
  AppRegistry,
  View
} = React;

var figTest = React.createClass({
  render: function() {
    return (
      <View>
      </View>
    );
  }
});

AppRegistry.registerComponent('figTest', () => figTest);

FigBridge.start();





