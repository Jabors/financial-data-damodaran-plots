import React, { Component } from 'react';
import Visualizer from './Visualizer.js';
import './App.css';

const apiURL='https://api.quickfinstats.com/';
const queryTypes=['equityRiskPremiums', 'currencyRates?country=all', 'currencyRates','bondYields','riskByIndustryPublic','riskByIndustryPrivate'];
const chartTypes=['choropleth', 'choropleth', 'bar', 'choropleth', 'choropleth', 'choropleth', 'choropleth'];
const chartTitles=['Equity Risk Premiums', 'Risk-free rates by country', 'Risk-free rates by currency', 'Government Bond Yields', 'Public Company Risk', 'Private Company Risk'];
//[x,y,z,text,locations,options]
const chartFields=[[null,null,'equity_risk_premium',null,'_id',null],[null,null,'risk_free_rate','_id','country',null],['_id','risk_free_rate',null,'name',null,null],[null,null,'yield',null,'_id',null],[null,null,'unlevered_beta_cash_corrected',null,'country','sector'],[null,null,'unlevered_beta',null,'country','sector']]
const initalSectors=[null, null, null, null, 'Software (Internet)', 'Software (Internet)']

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: new Array(queryTypes.length).fill({}),
      sectors: initalSectors,
    }
    this.handleSectorChange=this.handleSectorChange.bind(this);
  };

  fetch_data(graphType) {
    var chartIndex=queryTypes.indexOf(graphType);
    var extraQueryParams='';
    var options=null;
    if(this.state.sectors[chartIndex]!=null){
      options=[]
      extraQueryParams='?sector='+this.state.sectors[chartIndex].replace('&','%26')+'&byCountry=yes';
      fetch(apiURL+'allSectors').then(response => {return response.json()})
        .then((responseJSON) =>{          
          responseJSON.forEach(function(point){
            options.push(point)
          });
        });
    }
    fetch(apiURL+graphType+extraQueryParams).then(response => {return response.json()})
      .then((responseJSON) =>{
        var result=[];      
        chartFields[chartIndex].forEach(function(field){
          var field_result=[];
          responseJSON.forEach(function(point){
            var val = parseFloat(point[field]);
            if(isNaN(val)){    
              field_result.push(point[field]);
            }
            else{
              field_result.push((val*100).toFixed(2));
            }
          });
          result.push(field_result);
        });
          const data = this.state.data;
          data[chartIndex]={'x': result[0], 'y':result[1], 'z':result[2] ,'text':result[3] ,'locations':result[4], 'options':options, value:this.state.sectors[chartIndex], 'type':chartTypes[chartIndex], 'title': chartTitles[chartIndex]};
          this.setState({data:data})
      });
  };

  componentDidMount() {
    queryTypes.forEach(function(type){
      this.fetch_data(type);
    }, this);
  };

  handleSectorChange(i, event){
    const sectors = this.state.sectors;
    sectors[i] = event.target.value;
    this.setState({sectors: sectors});
    this.fetch_data(queryTypes[i]);
  };

  render() {    
      return (
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">Welcome to our financial data visualizer</h1>
          </header>

          {this.state.data.map((item, i) => (
            <div key={i} className="App-intro">
              <Visualizer locations={item.locations} z={item.z} title={item.title} type={item.type} x={item.x} y={item.y} text={item.text} options={item.options} value={item.value} onChangeSector={ (event) => this.handleSectorChange(i, event)}/>
            </div>
          ),this)}
        </div>
      );
  }
}

export default App;
