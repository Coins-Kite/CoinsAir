import React from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  ScrollView,
  Modal,
  FlatList,
  Alert
} from "react-native"

import Linegraph from "./components/linegraph"
import {test} from "./components/data"
import {LineChart,ProgressChart,BarChart} from "react-native-chart-kit";
import NetInfo from "@react-native-community/netinfo";
// <Image source={{uri:"https://image.freepik.com/free-vector/flat-design-camping-area-landscape-with-tents-hot-air-balloon_23-2148658608.jpg"}} style={{height:"20%",width:"100%"}} resizeMode="cover" />

import { AnimatedCircularProgress } from 'react-native-circular-progress';
const Dev_Height = Dimensions.get("window").height
const Dev_Width = Dimensions.get("window").width
const MAX_POINTS = 500;

export default class App extends React.Component{
  constructor(props){
    super(props);
    this.state={
      data : {},
      ppm : [10,20],
      temprature:[30,40],
      Humidity:[67,67],
      text:"Good",
      caption:"Air quality considered satisfactory, and air pollution poses little or no risk 😄",
      modalVisible : false,
      categories:test
  }
}

  componentDidMount(){
    this.checkinternet()
    fetch('https://thingspeak.com/channels/1322706/feed.json?key=******')
      .then((response) => response.json())
      .then((json) => {
        this.setState({ data: json }, () => {
          console.log(this.state.data, 'data1');
          this.onPressthis()
          this.checkclasify()
        }); 
      })
      .catch((error) => Alert.alert("Mi Air",str(error)))
      .finally(() => {
      });

  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }
 
  checkinternet=()=>{
    NetInfo.fetch().then(state => {
      if(!state.isConnected){
        Alert.alert("Mi Air","Connect to Internet",[
          { text: "OK", onPress: () => this.checkinternet() }
        ])
      }
      else{
        fetch('https://thingspeak.com/channels/1322706/feed.json?key=****')
        .then((response) => response.json())
        .then((json) => {
          this.setState({ data: json }, () => {
            console.log(this.state.data, 'data1');
            this.onPressthis()
            this.checkclasify()
          }); 
        })
        .catch((error) => Alert.alert("Mi Air",str(error)))
        .finally(() => {
        });
      }
    });
  }

  onPressthis=()=>{
    this.state.data.feeds.filter((i)=>{
      this.state.ppm.push(Number(i["field4"].slice(0,3)))
      this.setState({ ppm : this.state.ppm })
    })

    this.state.data.feeds.filter((i)=>{
      this.state.temprature.push(Number(i["field1"]))
      this.setState({temprature : this.state.temprature })
    })

    this.state.data.feeds.filter((i)=>{
      this.state.Humidity.push(Number(i["field2"]))
      this.setState({Humidity : this.state.Humidity })
    })
  }

  checkclasify =()=>{
    var ppm = this.state.ppm[this.state.ppm.length-1]
    console.log(ppm)
    if(ppm <= 50){
      this.setState({caption : "Air quality considered satisfactory, and air pollution poses little or no risk 😄"})
      this.setState({ text : "Good"})
      console.log(1)
    }
    else if(ppm > 50 & ppm<=100){
      this.setState({caption : "air quality acceptable. However for some pollutants there may be a modrate health concern for a very small number of people who are unusually sensitive to air pollution"})
      this.setState({ text : "Moderate"})
      console.log(2)
    }
    else if(ppm > 100 & ppm <=150){
      this.setState({caption : "Members of sensitive groups may experience health effects. The general public is not likely to be affected"})
      this.setState({ text: "Unhealthy for Sensitive Groups"})
      console.log(3)
    }
    else if(ppm > 150 & ppm <=200){
      this.setState({caption : "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects"})
      this.setState({ text : "Unhealthy"})
      console.log(4)
    }
    else if(ppm > 200 & ppm<= 300){
      this.setState({caption:"Health Alert: Everyone may experience more serious health effects"})
      this.setState({text:"Very Unhealthy"})

      console.log(5)
    }
    else if(ppm > 300 & ppm<= 500){
      this.setState({caption:"Health warning of emergency conditions. The entire population is more likely to be affected"})
      this.setState({text:"Hazardous"})
      console.log(6)
    }
    else{
      this.setState({caption : "Air quality considered satisfactory, and air pollution poses little or no risk 😄"})
      this.setState({ text : "Good"})
      console.log(7)
    }
  }

  getAPIData=()=>{

  }

  renderSeparator = () => (
    <View
      style={{
        width: 20,
      }}
    />
  );  

  _renderItemCatogories=({item,index})=>{
    return(
        <View style={{ 
          height:"90%",
          width:Dev_Width-(0.3*Dev_Width),
          backgroundColor:"#FFF",
          borderRadius:15,justifyContent:"center",alignItems:"center"}}
            >
              <View style={{height:"90%",width:"100%",backgroundColor:"#FFF",elevation:2,borderRadius:10}}>
                <View style={{height:"30%",width:"100%",justifyContent:"center"}}>
                  <Text style={{color:"#11c786",fontSize:20,fontWeight:"bold",marginLeft:"5%"}}>{item.Name}</Text>
                </View>
                <View style={{height:"60%",width:"100%"}}>
                <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                  <Text style={{color:"gray",fontSize:16,marginLeft:"7%",textAlign:"left",marginRight:"4%"}}>{item.desc}</Text>
                </ScrollView>
                </View>
              </View>
            </View>
    )
  }


  render(){
    let fill = (this.state.ppm[this.state.ppm.length-1] / MAX_POINTS) * 100;
    let Humidity_Fill = (this.state.Humidity[this.state.Humidity.length-1] / 100) * 100;
    return(
      <View style={styles.container}>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
        >
          <View style={styles.centeredView}>
            <View style={{height:"10%",width:"100%",alignItems:"center",flexDirection:"row"}}>
                <View style={{height:20,width:20,marginLeft:"5%",borderRadius:180,backgroundColor:"#79bd8e"}}/>
                <Text style={styles.appname_text}>Air Quality</Text>
                <TouchableOpacity onPress={()=> this.setState({ modalVisible : false })} style={{height:"100%",width:"40%",justifyContent:"center",alignItems:"center",marginLeft:"15%"}}>
                  <Text style={{fontSize:15,color:"gray"}}>Close</Text>
                </TouchableOpacity>
            </View>
            <View style={{height:"25%",width:"100%",justifyContent:"center",alignItems:"center"}}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View style={{height:"100%",width:120,marginLeft:15,backgroundColor:"#FFF",justifyContent:"center",alignItems:"center"}}>
              <TouchableOpacity style={{height:"90%",width:"100%",backgroundColor:"#FFF",elevation:2,borderRadius:10,justifyContent:"center",alignItems:"center"}}>
                <Text style={{color:"gray",fontSize:18,fontWeight:"bold"}}>Air Quality</Text>
                <Text style={{color:"#7591af",fontSize:35,fontWeight:"bold",marginTop:20}}>{this.state.ppm[this.state.ppm.length-1]}</Text>
              </TouchableOpacity>
            </View>

            <View style={{height:"100%",width:120,marginLeft:15,backgroundColor:"#FFF",justifyContent:"center",alignItems:"center"}}>
              <TouchableOpacity style={{height:"90%",width:"100%",backgroundColor:"#FFF",elevation:2,borderRadius:10,justifyContent:"center",alignItems:"center"}}>
                  <Text style={{color:"gray",fontSize:18,fontWeight:"bold",marginTop:15}}>Humidity</Text>
                  <AnimatedCircularProgress
                    size={80}
                    width={6}
                    backgroundWidth={2}
                    fill={Humidity_Fill}
                    tintColor="#11c786"
                    tintColorSecondary="green"
                    backgroundColor="#f1f1f1"
                    arcSweepAngle={240}
                    rotation={240}
                    lineCap="round"
                    duration={5000}
                    style={{marginTop:20}}
                  >
                  {fill => <Text style={{...styles.points,fontSize:16}}>{this.state.Humidity[this.state.Humidity.length-1]}</Text>}
                  </AnimatedCircularProgress>
              </TouchableOpacity>
            </View>

            <View style={{height:"100%",width:120,marginLeft:15,backgroundColor:"#FFF",justifyContent:"center",alignItems:"center"}}>
              <TouchableOpacity style={{height:"90%",width:"100%",backgroundColor:"#FFF",elevation:2,borderRadius:10,justifyContent:"center",alignItems:"center"}}>
                <Text style={{color:"gray",fontSize:18,fontWeight:"bold"}}>Temprature</Text>
                <Text style={{color:"#7591af",fontSize:30,fontWeight:"bold",marginTop:20}}>{this.state.temprature[this.state.temprature.length-1]} C °</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        <View style={{height:"8%",width:"100%",marginTop:30}}>
          <Text style={{...styles.main_comment,marginLeft:"10%"}}>Health Tips</Text>
        </View>

        <View style={{height:"25%",width:"100%",justifyContent:"center",alignItems:"center"}}>
	        <FlatList
                style={{height:"100%",width:"93%"}}
                data={this.state.categories}
                keyExtractor={(item, index) => item.key}
                renderItem={this._renderItemCatogories}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={this.renderSeparator}
                alwaysBounceHorizontal={true}
                bounces={true}
              />
          </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{height:80,width:"100%",marginTop:30}}>
            <Text style={{...styles.main_comment,marginLeft:"10%"}}>Air Quality This Week</Text>
            <Text style={{...styles.main_comment,marginLeft:"10%",color:"#A3A3A3",fontSize:15,marginTop:6}}>Today's Air Quality - {this.state.ppm[this.state.ppm.length-1]} ppm</Text>
            </View>

            <Linegraph 
              data={this.state.ppm} 
              graph_width={Dimensions.get("window").width-30} 
              graph_height={Dev_Height-(0.8*Dev_Height)}
              style={{borderRadius: 16,marginLeft:"5%",marginTop:2}}
              backgroundColor="#039f86"
              backgroundGradientFrom="#79bd8e"
              backgroundGradientTo="#039f86"
              />

              <View style={{height:20,width:Dev_Width}} />
          </ScrollView>
          </View>
        </Modal>

      <StatusBar backgroundColor="#FFF" barStyle="dark-content"/>
      <ScrollView>
        <View style={styles.appname_view}>
          <View style={{height:20,width:20,marginLeft:"5%",borderRadius:180,backgroundColor:"#79bd8e"}}/>
          <Text style={styles.appname_text}>Mi Air</Text>
        </View>
        <View style={{height:250,width:"100%",justifyContent:"center",alignItems:"center",marginTop:20}}>
          <AnimatedCircularProgress
            size={Dev_Width-150}
            width={8}
            backgroundWidth={2}
            fill={fill}
            tintColor="#11c786"
            tintColorSecondary="#EB334D"
            backgroundColor="#f1f1f1"
            arcSweepAngle={240}
            rotation={240}
            lineCap="round"
            duration={3000}
          >
          {fill => <Text style={styles.points}>{this.state.ppm[this.state.ppm.length-1]}</Text>}
          </AnimatedCircularProgress>
        </View>
        <View style={styles.Comments_View}>
          <Text style={styles.main_comment}>Air Quality is {this.state.text}</Text>
          <Text style={styles.second_comment}>{this.state.caption}</Text>
          </View>

        <View style={{height:150,width:"100%",marginTop:50,justifyContent:"center",alignItems:"center"}}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View style={{height:"100%",width:120,marginLeft:15,backgroundColor:"#FFF",justifyContent:"center",alignItems:"center"}}>
              <TouchableOpacity onPress={()=> this.setState({ modalVisible : true })} style={{height:"90%",width:"100%",backgroundColor:"#FFF",elevation:2,borderRadius:10,justifyContent:"center",alignItems:"center"}}>
                <Text style={{color:"gray",fontSize:18,fontWeight:"bold"}}>Air Quality</Text>
                <Text style={{color:"#7591af",fontSize:35,fontWeight:"bold",marginTop:20}}>{this.state.ppm[this.state.ppm.length-1]}</Text>
              </TouchableOpacity>
            </View>

            <View style={{height:"100%",width:120,marginLeft:15,backgroundColor:"#FFF",justifyContent:"center",alignItems:"center"}}>
              <TouchableOpacity style={{height:"90%",width:"100%",backgroundColor:"#FFF",elevation:2,borderRadius:10,justifyContent:"center",alignItems:"center"}}>
                  <Text style={{color:"gray",fontSize:18,fontWeight:"bold",marginTop:15}}>Humidity</Text>
                  <AnimatedCircularProgress
                    size={80}
                    width={6}
                    backgroundWidth={2}
                    fill={Humidity_Fill}
                    tintColor="#11c786"
                    tintColorSecondary="green"
                    backgroundColor="#f1f1f1"
                    arcSweepAngle={240}
                    rotation={240}
                    lineCap="round"
                    duration={5000}
                    style={{marginTop:20}}
                  >
                  {fill => <Text style={{...styles.points,fontSize:16}}>{this.state.Humidity[this.state.Humidity.length-1]}</Text>}
                  </AnimatedCircularProgress>
              </TouchableOpacity>
            </View>

            <View style={{height:"100%",width:120,marginLeft:15,backgroundColor:"#FFF",justifyContent:"center",alignItems:"center"}}>
              <TouchableOpacity style={{height:"90%",width:"100%",backgroundColor:"#FFF",elevation:2,borderRadius:10,justifyContent:"center",alignItems:"center"}}>
                <Text style={{color:"gray",fontSize:18,fontWeight:"bold"}}>Temprature</Text>
                <Text style={{color:"#7591af",fontSize:30,fontWeight:"bold",marginTop:20}}>{this.state.temprature[this.state.temprature.length-1]} C °</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        <View style={{height:80,width:"100%",marginTop:30}}>
          <Text style={{...styles.main_comment,marginLeft:"10%"}}>Temparature</Text>
          <Text style={{...styles.main_comment,marginLeft:"10%",color:"#A3A3A3",fontSize:15,marginTop:6}}>Today's Temprature - {this.state.temprature[this.state.temprature.length-1]} C °</Text>
        </View>

          <Linegraph 
            data={this.state.temprature} 
            graph_width={Dimensions.get("window").width-30} 
            graph_height={Dev_Height-(0.8*Dev_Height)}
            style={{borderRadius: 16,marginLeft:"5%",marginTop:2}}
            backgroundColor="#75f7de"
            backgroundGradientFrom="#2bc4c9"
            backgroundGradientTo="#1773a6"
            />

          <View style={styles.knowMore_View}>
            <TouchableOpacity onPress={()=>this.setState({ modalVisible : true })} style={{height:"90%",width:"30%",justifyContent:"center",alignItems:"center",backgroundColor:"rgba(225,225,225,0.2)",borderRadius:15}}>
              <Text style={styles.knowmore_text}>Know More</Text>
            </TouchableOpacity>
          </View>
          <View style={{height:30,width:Dev_Width}}/>
      </ScrollView>
    </View>
    )
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:"#FFF",
    height:Dev_Height,
    width:Dev_Width
  },
  points: {
    textAlign: 'center',
    color: '#7591af',
    fontSize: 80,
    fontWeight: '100',
  },
  appname_view:{
    height:40,
    width:"100%",
    alignItems:"center",
    flexDirection:"row",
    marginTop:20,
  },
  appname_text:{
    fontSize:24,
    marginLeft:"5%",
    color:"#11c786",
    fontWeight:"bold"
  },
  Comments_View:{
    height:90,
    width:"100%",
    alignItems:"center",
    marginTop:10
  },
  main_comment:{
    fontSize:18,
    color:"#686868",
    fontWeight:"bold"
  },
  second_comment:{
    fontSize:16,
    color:"#A3A3A3",
    paddingLeft:"10%",
    paddingRight:"10%",
    textAlign:"center",
    marginTop:"5%"
  },
  knowMore_View:{
    height:50,
    width:"100%",
    justifyContent:"center",
    alignItems:"center",
    marginTop:20
  },
  knowmore_text:{
    fontSize:16,
    color:"gray",
    textAlign:"center",
    fontWeight:"bold"
  },
  
  centeredView: {
    flex: 1,
    height:Dev_Height,
    width:Dev_Width,
    backgroundColor:"#FFF"
  }
})
