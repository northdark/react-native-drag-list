/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
// 'use strict';

// var React = require('react-native');
// var {
//   AppRegistry,
//   StyleSheet,
//   Text,
//   ScrollView,
//   PanResponder,
//   View,
// } = React;

// var Slider = React.createClass({
//   getInitialState:function(){
//     return {
//       current:0
//     };
//   },
//   _panResponder: {},
//   componentWillMount: function() {
//     this._panGesture = PanResponder.create({
//       // Ask to be the responder:
//       onStartShouldSetPanResponder: (evt, gestureState) => true,
//       onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
//       onMoveShouldSetPanResponder: (evt, gestureState) => true,
//       onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
//       onPanResponderGrant: (evt, gestureState) => {
//         // The guesture has started. Show visual feedback so the user knows
//         // what is happening!
//         // gestureState.{x,y}0 will be set to zero now
//         console.log(1);
//       },
//       onPanResponderMove: (evt, gestureState) => {
//         // The most recent move distance is gestureState.move{X,Y}
//         // The accumulated gesture distance since becoming responder is
//        // gestureState.d{x,y}
//        console.log(2);
//       },
//       onResponderTerminationRequest: (evt, gestureState) => true,
//       onPanResponderRelease: (evt, gestureState) => {
//         //释放所有触摸操作，即完成一次手势
//         console.log(3);
//       },
//       onPanResponderTerminate: (evt, gestureState) => {
//         // Another component has become the responder, so this gesture
//         // should be cancelled
//         console.log(4);
//       },
//     });
//   },
//   render: function() {
//     return (
//       <View style={styles.container} >
//         <ScrollView style={styles.pannel} horizontal="true" ref={(scrollview)=>{this.scrollview=scrollview}} {...this._panResponder.panHandlers}>
//           <Text>112312232222222222222222222</Text><Text></Text><Text>13333333333333333333</Text><Text>1</Text><Text>1</Text><Text>1</Text><Text>1</Text><Text>1</Text><Text>1</Text><Text>1</Text><Text>1</Text><Text>1</Text><Text>1</Text><Text>1</Text><Text>1</Text><Text>1</Text><Text>1</Text><Text>1</Text><Text>1</Text>
//         </ScrollView>
//       </View>
//     );
//   }
// });

// var styles = StyleSheet.create({
//   container: {
//     height:300,
//     flexDirection:'row',
//     backgroundColor:'red'
//   },
//   pannel:{
//   }
// });

// AppRegistry.registerComponent('Slider', () => Slider);
/**
 * The examples provided by Facebook are for non-commercial testing and
 * evaluation purposes only.
 *
 * Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * @flow
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  PanResponder,
  View,
} = React;

var CIRCLE_SIZE = 80;
var CIRCLE_COLOR = 'blue';
var CIRCLE_HIGHLIGHT_COLOR = 'green';


var NavigatorIOSExample = React.createClass({

  statics: {
    title: 'PanResponder Sample',
    description: 'Basic gesture handling example',
  },

  _panResponder: {},
  _previousLeft: 0,
  _previousTop: 0,
  _circleStyles: {},
  circle: (null : ?{ setNativeProps(props: Object): void }),

  componentWillMount: function() {
    this._panResponder = PanResponder.create({
      /*
        事件发生时，手势识别是否开始（设为false的话就在手势开始时不识别任何手势操作）
        这里不是指整个响应器在该次手势过程中不识别，而是初始时；
        开关函数
      */
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      /*
        手势事件为move时，是否为其设置响应器，即识别本次操作；
        开关函数
      */
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      /*
        当事件开始发生时触发的函数
        仅识别一次；
        这个是基于整个响应器的函数；
        onStart是开关，决定是否识别本次手势；
        而onGrant是执行，当响应器开始识别后执行一次；
        每次手势过程仅执行一次；
        类似JS里的ontouchstart
      */
      onPanResponderGrant: this._handlePanResponderGrant,
      /*
        发生move操作时的处理函数
        类似于JS的ontouchmove
      */
      onPanResponderMove: this._handlePanResponderMove,
      /*
        当动作未执行完而被释放掉时的操作
      */
      onPanResponderRelease: this._handlePanResponderEnd,
      /*
        动作完整执行后的操作
      */
      onPanResponderTerminate: this._handlePanResponderEnd,
    });
    this._previousLeft = 20;
    this._previousTop = 84;
    this._circleStyles = {
      left: this._previousLeft,
      top: this._previousTop,
    };
  },

  componentDidMount: function() {
    this._updatePosition();
  },

  render: function() {
    console.log('render');
    return (
      <View
        style={styles.container}>
        <View
          ref={(circle) => {
            this.circle = circle;
          }}
          style={styles.circle}
          {...this._panResponder.panHandlers}
        />
      </View>
    );
  },

  _highlight: function() {
    this.circle && this.circle.setNativeProps({
      backgroundColor: CIRCLE_HIGHLIGHT_COLOR
    });
  },

  _unHighlight: function() {
    this.circle && this.circle.setNativeProps({
      backgroundColor: CIRCLE_COLOR
    });
  },

  _updatePosition: function() {
    this.circle && this.circle.setNativeProps(this._circleStyles);
  },

  _handleStartShouldSetPanResponder: function(e: Object, gestureState: Object): boolean {
    // Should we become active when the user presses down on the circle?
    //event参数：本次手势识别的事件对象，内部参数包括了事件起始的屏幕位置、时间、本次过程中的执行历史、事件ID
    //gestureState是一个累积参数，记录了本次手势从开始到现在的数据，比如水平位移、竖直位移、速度、当前目标容器的屏幕位置等
    return true;
  },

  _handleMoveShouldSetPanResponder: function(e: Object, gestureState: Object): boolean {
    // Should we become active when the user moves a touch over the circle?
    return true;
  },

  _handlePanResponderGrant: function(e: Object, gestureState: Object) {
    console.log('事件开始执行了');
    this._highlight();
  },
  _handlePanResponderMove: function(e: Object, gestureState: Object) {
    this._circleStyles.left = this._previousLeft + gestureState.dx;
    this._circleStyles.top = this._previousTop + gestureState.dy;
    this._updatePosition();
  },
  _handlePanResponderEnd: function(e: Object, gestureState: Object) {
    this._unHighlight();
    this._previousLeft += gestureState.dx;
    this._previousTop += gestureState.dy;
  },
});

var styles = StyleSheet.create({
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: CIRCLE_COLOR,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  container: {
    flex: 1,
    paddingTop: 64,
  },
});

//module.exports = NavigatorIOSExample;

AppRegistry.registerComponent('Slider', () => NavigatorIOSExample);





