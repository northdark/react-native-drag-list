var React = require('react-native');
var { Text, View } = React;
var PropTypes = React.PropTypes;

var SGListViewCell = React.createClass({

  /**
   * Object Lifecycle Methods
   */

  propTypes: {
    /**
     * This is the user's view as supplied by their datasource
     */
    usersView: PropTypes.element.isRequired
  },

  getInitialState() {
    // 是否可见
    return {
      visibility: true,
    }
  },

  /**
   * View Lifecycle Methods
   */
  componentDidMount() {
    // Don't want to trigger a render pass, so we're putting the view property
    // data directly on the class
    // 不想因为触发state而渲染，所以把height和width这两个属性直接绑在this.上
    this.viewProperties = {
      width: 0, // the view defaults to width of size 0
      height: 0, // the view defaults to height of size 0
    };
  },

  /**
   * Render Methods
   */

  render: function() {
    if (this.state.visibility === false) {
      //不可见返回一个占宽高的View组件
      return (
        <View style={{width:this.viewProperties.width, height:this.viewProperties.height}}></View>
      );
    }
    return (
      <View onLayout={this.onLayout}>
        {this.props.usersView}
      </View>
    );
  },

  onLayout(evt) {
    // When the cell has actually been layed out, record the rendered width & height
    //Layout之后记录当前组件的宽高，留作占位
    this.viewProperties.width = evt.nativeEvent.layout.width;
    this.viewProperties.height = evt.nativeEvent.layout.height;
  },

  /**
   * View Management Methods
   * 视图管理方法；就是通过这个方法控制state来实现控制渲染的
   */
  setVisibility(visibility) {
    //如果相同不调用setSate,但是调用的话会触发回调么？
    if (this.state.visibility == visibility) {
      return; // already have the passed in state, so return early 早返回
    }

    if (visibility == true) {
      this.setState({visibility: true});
    } else {
      this.setState({visibility: false});
    }
  },
});

module.exports = SGListViewCell;
