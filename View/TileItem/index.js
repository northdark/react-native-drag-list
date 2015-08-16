'use strict';

var React = require('react-native');
var Dimensions = require('Dimensions');

var {
    StyleSheet,
    Image,
    View,
    Text
} = React;


var TileItem = React.createClass({
    render : function(data){
        return (
            <View style={itemStyles.container}>
                <Image style={itemStyles.img} source={{uri:data.titleImage}} />
                <View style={itemStyles.info}>
                    <View style={itemStyles.info_con}>
                        <View style={itemStyles.info_ln1}>
                            <View style={itemStyles.info_ln1_lb}></View>
                            <View style={itemStyles.info_ln1_text_wrapper}>
                                <Text style={itemStyles.info_ln1_text}>{data.author.name}</Text>
                            </View>    
                            <View style={itemStyles.info_ln1_lb}></View>
                        </View>
                        <View style={itemStyles.info_ln2}>
                            <Text style={itemStyles.info_ln2_text}>{data.title}</Text>
                        </View>
                    </View>
                </View>    
            </View>
        );        
    }
});

var Screen = {
    width:Dimensions.get('window').width,
    height:Dimensions.get('window').height
}

var itemStyles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
        justifyContent:'center',
        height:Screen.width*0.52,
        overflow:'hidden',
        marginBottom:3,
    },
    img:{
        flex:1
    },
    info:{
        width:180,
        height:70,
        position:'absolute',
        right:10,
        bottom:10,
        backgroundColor:'transparent',
        borderWidth:8,
        borderColor:'rgba(255,255,255,0.7)',
        borderStyle:'solid',
        padding:2
    },
    info_con:{
        flex:1,
        padding:5,
        flexDirection:'column',
        backgroundColor:"#FFF",
        opacity:0.7
    },
    info_ln1:{
        flex:1,
        flexDirection:'row',
    },
    info_ln1_lb:{
        flex:1.3,
        backgroundColor:'#28C0DE',
        height:2,
        alignSelf:'center'
    },
    info_ln1_text_wrapper:{
        flex:7.4,
        flexDirection:'row',
        alignItems:'flex-end',
    },
    info_ln1_text:{
        alignSelf:'center',
        flex:1,
        fontSize:14,
        height:14,
        lineHeight:14,
        fontWeight:'600',
        textAlign:'center',
        overflow:'hidden'
    },
    info_ln2:{
        flex:1,
        flexDirection:'row'
    },
    info_ln2_text:{
        flex:1,
        height:12,
        lineHeight:12,
        overflow:'hidden',
        fontSize:12,
        textAlign:'center',
        alignSelf:'center',
        fontWeight:'500'
    }    
});

module.exports = TileItem;

