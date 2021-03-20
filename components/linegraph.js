import React from "react"
import {
    View,
    Text,
} from "react-native"

import {LineChart} from "react-native-chart-kit";

export default class Linegraph extends React.Component{
    render(){
        return(
            <LineChart
              data={{
                datasets: [
                  {
                    data: this.props.data
                  }
                ]
              }}
              width={this.props.graph_width} // from react-native
              height={this.props.graph_height}
              yAxisInterval={1} // optional, defaults to 1
              chartConfig={{
                backgroundColor: this.props.backgroundColor,
                backgroundGradientFrom: this.props.backgroundGradientFrom,
                backgroundGradientTo: this.props.backgroundGradientTo,
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 0) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "0",
                  strokeWidth: "0",
                  stroke: "#ffa726"
                }
              }}
              bezier
              style={this.props.style}
            />
        )
    }
}