/* global Plotly:true */

import React, { Component } from 'react';
import createPlotlyComponent from 'react-plotly.js/factory'

const Plot = createPlotlyComponent(Plotly);

class Visualizer extends Component {

  constructor(props) {
    super(props);
    var showscale;
    if (0.75*window.innerWidth<600){
      showscale=false;
    }
    else{
      showscale=true;
    }
    this.state = {
      width:0.75*window.innerWidth,
      showscale:showscale,
      height:window.innerHeight/2,
    }
  }

  updateDimensions(){
    var width = 0.75*window.innerWidth;
    var height = window.innerHeight/2;
    var showscale=true;
    if (width<600){
      showscale=false;
    }
    this.setState({showscale: showscale})
    this.setState({height: height})
    this.setState({width: width});
  };

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions.bind(this));

  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  };

  render() {
      return (
        <div>
          <Plot data={[
            {
              type: this.props.type,
              locationmode: 'country names',
              locations: this.props.locations,
              x: this.props.x,
              y: this.props.y,
              z: this.props.z,
              text: this.props.text,
              autocolorscale: true,
              showscale:this.state.showscale,
              tick0: 0,
              zmin: 0,
              dtick: 1000,
              colorbar: {
                  thickness: 5,
                  autotic: false,
                  ticksuffix: '%',
                  title: this.props.title
              }
            }
            ]}
            layout={{
              title: this.props.title,
              width: this.state.width,
              height: this.state.height,
              geo: {
                projection: {
                    type: 'robinson'
                }
              },
              margin: {
                l: this.props.type==='choropleth'? this.state.width/40 : 50,
                r: this.props.type==='choropleth'? this.state.width/40 : 50,
                b: 20,
                t: 120,
                pad: 0
              },
              yaxis:{
                 side: 'right',
                 ticksuffix: '%'
              }
            }}
            config={{
              displayModeBar:false
            }}
          />
          {this.props.options!=null ? (
            <div>
              {'Sector:  '}           
              <select id="Sector" onChange={this.props.onChangeSector} value={this.props.value}>
                {this.props.options.map((item, i) => (
                  <option key={i} value={item}>{item}</option>
                ))}
              </select>
            </div>
            ): <div/>}          
        </div>     
      );
  }
}

export default Visualizer;
