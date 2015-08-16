/**
 * DragList DEMO
 * 无限下拉列表
 */
 
'use strict';

var React = require('react-native');
var TileItem = require('./View/TileItem');

var {
    AppRegistry,
    StyleSheet,
    Image,
    ListView,
    ScrollView,
    TouchableHighlight,
    ActivityIndicatorIOS,
    View,
    Text
} = React;

var APP = React.createClass({
    getInitialState:function(){
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            currentTab:0,
            dataArray:[],
            dataSource: ds.cloneWithRows([]),
            loaded:false,
            isError:false,
            currentPage:1
        };
    },
    getUrl:function(){
        return 'http://zhuanlan.zhihu.com/api/columns/pinapps/posts?limit=10&offset='+this.state.currentPage*10;
    },
    componentDidMount:function(){
        this.fetchData();
    },
    onEndReached:function(){
        this.fetchData();
    },
    fetchData:function(){
        var self = this;
        fetch(this.getUrl()).then((response) => response.json() ).then((responseData) => {
            this.nowPage++;
            var dataArr = this.state.dataArray.concat(responseData);
            var thisData =  this.state.dataSource.cloneWithRows(dataArr);
            this.setState({
                dataArray:dataArr,
                dataSource:thisData,
                loaded:true,
                currentPage:++this.state.currentPage
            })
          }).catch(error=>{
                self.setState({
                    isError:true,
                })
            }).done();
    },
    i:0,
    renderItems:function(data){
        return new TileItem().render(data);
    },
    renderTab:function(){
        var tabContent = [{name:'精选'},{name:'话题'},{name:'最热'},{name:'专栏'}];
        var self = this;
        return (
            <View style={tabStyles.tabContainer}>
                {
                    tabContent && tabContent.map(function(item,key){
                        if( key == self.state.currentTab ){
                            return (
                                <View style={tabStyles.tabItem} key={key}>
                                    <Text style={tabStyles.tabItem_text_active}>{item.name}</Text>
                                    <View style={tabStyles.underline}></View>
                                </View>
                            )
                        }
                        else{
                            return (
                                <View style={tabStyles.tabItem} key={key}>
                                    <Text style={tabStyles.tabItem_text}>{item.name}</Text>
                                </View>
                            )
                        }
                    })
                }
            </View>
        );
    },
    render : function(){
        if( !this.state.loaded && !this.state.isError ){
            return (
                <View style={loadingStyles.container}>
                    <ActivityIndicatorIOS style={loadingStyles.loading} color='#f32d2d' animating={!this.loaded} size='large'/>
                </View>
            );
        }
        else if( this.state.loaded && !this.state.isError ){
            return (
                <ListView renderSectionHeader={this.renderTab} onEndReached={this.onEndReached} onEndReachedThreshold='900' style={tileStyles.container} dataSource={this.state.dataSource} renderRow={this.renderItems}/>
            );
        }
        else{
            return (
                <View style={{backgroundColor:'red',flex:1}}>
                    <Text>Error</Text>
                </View>
            )
        }
    }
});
var tileStyles = StyleSheet.create({
    container:{
        flexDirection:'column',
        backgroundColor:"#f2f2f2"
    }
});
var tabStyles = StyleSheet.create({
    tabContainer:{
        height:50,
        flexDirection:'row',
        backgroundColor:'#FFF',
        borderWidth:1.5,
        borderColor:'#FFF',
        borderBottomColor:'#EEE'
    },
    tabItem:{
        flex:1,
        height:48,
        flexDirection:'column',
        paddingRight:12,
        paddingLeft:12
    },
    tabItem_text:{
        flex:1,
        height:48,
        textAlign:'center',
        fontSize:14,
        lineHeight:31,
        color:'#999',
        fontWeight:'700'
    },
    tabItem_text_active:{
        flex:1,
        height:46,
        textAlign:'center',
        fontSize:14,
        lineHeight:31,
        color:'#DD2727',
        fontWeight:'700'
    },
    underline:{
        height:2,
        backgroundColor:'#DD2727'
    }
});

var loadingStyles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
        backgroundColor:'#f2f2f2'
    },
    loading:{
        flex:1,
        flexDirection:'row',
        alignSelf:'center',
        backgroundColor:"#f2f2f2"
    }
});


AppRegistry.registerComponent('DragList', () => APP);





