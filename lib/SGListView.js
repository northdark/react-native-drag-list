var React = require('react-native');
var { ListView, PropTypes, ScrollView } = React;
var SGListViewCell = require('./SGListViewCell');

var SGListView = React.createClass({

  /**
   * Object Lifecycle Methods
   */

  propTypes: {
    // Default the propTypes to those as specified by ListView
    //...是拓展运算符，例子：var a = [1,2,3,4,5]; var b = [0,...a]; 则b=[0,1,2,3,4,5]
    ...ListView.propTypes,

    /**
     * OVERRIDE LISTVIEW's DEFAULT VALUE: Made component not required, since SGListView will provide one by default
     * 重写ListView的默认值：使得item不是必需属性，因为SGListView会提供一个默认的
     * (props) => renderable
     *
     * A function that returns the scrollable component in which the list rows
     * are rendered. Defaults to returning a ScrollView with the given props.
     * 函数返回当前ListView所基于的ScrollView
     */
    renderScrollComponent: React.PropTypes.func,

    /**
     * Number of cells to preeptively render in front of the users scrolling
     * 用户滑动中优先渲染的cell
     */
    premptiveLoading: PropTypes.number,
  },

  getDefaultProps: function() {
    return {
      premptiveLoading: 2,
    }
  },

  /**
   * View Lifecycle Methods
   */

  componentWillMount() {
    // This object keeps track of the cell data.
    // NOTE: We don't want to trigger a render pass when updating the data here
    //       so we don't store this information in this.state.
    this.cellData = {
      lastVisibleRow: 0, // keep track of the last row rendered
    };
  },

  getNativeListView() {
    return this.refs.nativeListView;
  },

  /**
   * Render Methods
   */

  render: function() {
    return (
      <ListView {...this.props}
        ref='nativeListView'
        renderScrollComponent={this.renderScrollComponent}
        renderRow={this.renderRow}
        onChangeVisibleRows={this.onChangeVisibleRows} />
    );
  },

  //渲染的ScrollView
  renderScrollComponent: function(props) {
    if (props.renderScrollComponent) {
      return props.renderScrollComponent(props);
    } else {
      return (
        <ScrollView {...props} />
      );
    }
  },

  renderRow(rowData, sectionID, rowID) {
    // Get the user's view
    //获取用户自定义的row的JSX-View
    var view = this.props.renderRow(rowData, sectionID, rowID);

    // Wrap the user's view in a SGListViewCell for tracking & performance
    //把真正的row-view包装在SGCell里，用来回溯和执行调用
    return <SGListViewCell
              usersView={view}
              ref={(row) => {
                // Capture a reference to the cell on creation
                // 用来获取cell内部usersView的引用
                // We have to do it this way for ListView: https://github.com/facebook/react-native/issues/897
                PrivateMethods.captureReferenceFor(this.cellData, sectionID, rowID, row);
              }}/>
  },

  //可见行变化时：
  onChangeVisibleRows(visibleRows, changedRows) {
    // Update cell visibibility per the changedRows
    //更新每一个可见性变化行的cell的可见性
    PrivateMethods.updateCellsVisibility(this.cellData, changedRows);

    // Premepty show rows to avoid onscreen flashes
    //提前load所有会显示的行
    PrivateMethods.updateCellsPremptively(this.props, this.cellData, visibleRows);

    // If the user supplied an onChangeVisibleRows function, then call it
    //如果用户在<SGListView >上声明了onChangeVisibleRows，调用它
    if (this.props.onChangeVisibleRows) {
      this.props.onChangeVisibleRows(visibleRows, changedRows);
    }
  },
});

/**
 * Some methods are stored here. The benefit of doing so are:
 * 1. The methods are truly private from the outside (unliked the _methodName pattern)
 * 2. The methods aren't instantiated with every instance
 * 3. They're static and hold 0 state
 * 4. Keeps the class size smaller
 声明了一些私有方法，优点是：
 1.对外不可见
 2.不需要被实例化
 3.静态&无状态的
 4.使得组件类小点儿
 */
var PrivateMethods = {
  captureReferenceFor: function(cellData, sectionId, rowId, row) {
    if (cellData[sectionId] === undefined) {
      cellData[sectionId] = {};
    }

    cellData[sectionId][rowId] = row; // Capture the reference
  },

  /**
   * Go through the changed rows and update the cell with their new visibility state
   * 遍历所有可见性改变的行&更新内部cell
   */
  updateCellsVisibility: function(cellData, changedRows) {
    for (var section in changedRows) {
      if (changedRows.hasOwnProperty(section)) { // Good JS hygiene check
        var currentSection = changedRows[section];

        for (var row in currentSection) {
          if (currentSection.hasOwnProperty(row)) { // Good JS hygiene check
            var currentCell = cellData[section][row];
            var currentCellVisibility = currentSection[row];

            // Set the cell's new visibility state
            if (currentCell && currentCell.setVisibility) {
              currentCell.setVisibility(currentCellVisibility);
            }
          }
        }
      }
    }
  },

  /**
   * When the user is scrolling up or down - load the cells in the future to make it
   * so the user doesn't see any flashing
   * 用户上下滑动时提前load每行的Cell
   */
  updateCellsPremptively: function(props, cellData, visibleRows) {
    if (!props.premptiveLoading) {
      return; // No need to run is preemptive loading is 0 or false
      //提前加载量为0或者返回false时不执行
    }

    if (!cellData.premptiveLoadedCells) {
      cellData.premptiveLoadedCells = [];
    };

    // Get the first and last visible rows
    //获取第一条和最后一条可见行
    //Section是row的容器；listView插入节点的时候实际上是先load一个section；类似于list-m里面page的概念，每次加载就Load一批数据（20条），然后这个section里面有20条row
    var firstVisibleRow, lastVisibleRow, firstVisibleSection, lastVisibleSection;
    for (var section in visibleRows) {
      for (var row in visibleRows[section]) {
        if (firstVisibleRow === undefined) {
          firstVisibleSection = section;
          firstVisibleRow = Number(row);
        } else {
          lastVisibleSection = section;
          lastVisibleRow = Number(row);
        }

        /* 
         * Dont consider a cell preemptiveloaded if it is touched by default visibility logic.
         * 如果这个cell上有固定逻辑让他不显示，那么不强制改变它
         */
        var currentCell = cellData[section][row];
        if (cellData.premptiveLoadedCells) {
          var i = cellData.premptiveLoadedCells.indexOf(currentCell);
          if (i >= 0) {
            cellData.premptiveLoadedCells.splice(i, 1);
          }
        };
      };
    };

    // Figure out if we're scrolling up or down
    //判断用户正在上滑还是下滑；cellData里面缓存了上一次的滑动记录
    var isScrollingUp = cellData.firstVisibleRow > firstVisibleRow;
    var isScrollingDown = cellData.lastVisibleRow < lastVisibleRow;

    var scrollDirectionChanged;
    if (isScrollingUp && cellData.lastScrollDirection === 'down'){
      scrollDirectionChanged = true;
    } else if (isScrollingDown && cellData.lastScrollDirection === 'up') {
      scrollDirectionChanged = true;
    }

    // remove the other side's preemptive cells
    if (scrollDirectionChanged) {
      var cell;
      while(cell = cellData.premptiveLoadedCells.pop()) {
        cell.setVisibility(false);
      }
    };

    // Preemptively set cells
    for (var i = 1; i <= props.premptiveLoading; i++) {
      var cell;

      if (isScrollingUp){
        cell = cellData[firstVisibleSection][firstVisibleRow - i];
      } else if (isScrollingDown) {
        cell = cellData[lastVisibleSection][lastVisibleRow + i];
      }

      if (cell) {
        cell.setVisibility(true);
        cellData.premptiveLoadedCells.push(cell);
      } else {
        break;
      }
    }

    cellData.firstVisibleRow = firstVisibleRow; // cache the first seen row
    cellData.lastVisibleRow = lastVisibleRow; // cache the last seen row

    if (isScrollingUp){
      cellData.lastScrollDirection = 'up';
    } else if (isScrollingDown) {
      cellData.lastScrollDirection = 'down';
    }
    
  },
};

module.exports = SGListView;
