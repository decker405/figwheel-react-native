/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var FigBridge = require('FigwheelBridge');

var {
  AppRegistry,
  View,
  Text
} = React;

var figTest = React.createClass({
  render: function() {
    return (
      <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
        <Text>Reagent/Om not loaded yet.</Text>
      </View>
    );
  }
});

AppRegistry.registerComponent('figTest', () => figTest);

// For some reason, Reagent doesn't render on inital load unless this is async...
setTimeout(FigBridge.start, 1);





