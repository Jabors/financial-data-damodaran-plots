const apiURL='http://localhost:8080/';
export const queryTypes=['equityRiskPremiums/','bondYields/'];

export function fetch_data(graphType) {
	var response={};
	switch(graphType){
	  case queryTypes[0]:
	    fetch(apiURL+graphType).then(response => {return response.json()})
	      .then((responseJSON) =>{
	        var locations=[];
	        var z=[];

	        responseJSON.forEach(function(point, index){
	          locations.push(point['_id']);
	          z.push((point['equity_risk_premium']*100).toFixed(2))
	        });
	        response.title='Equity Risk Premiums';
	        response.locations=locations;
	        response.z=z;

	        return response;
	        
	      });
	    break;
	  case queryTypes[1]:
	    fetch(apiURL+graphType).then(response => {return response.json()})
	      .then((responseJSON) =>{
	        var locations=[];
	        var z=[];

	        responseJSON.forEach(function(point, index){
	          locations.push(point['_id']);
	          z.push((point['yield']*100).toFixed(2))
	        });
	        response.title='Government Bond Yields';
	        response.locations=locations;
	        response.z=z;

	        return response;
	        
	      });        
	    break;    
	  default:
	    break;
	}
	return response;

};