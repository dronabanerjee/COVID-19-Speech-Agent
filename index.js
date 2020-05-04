// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const bent = require('bent');
const getJSON = bent('json');
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand.`);
    agent.add(`I'm sorry, can you try again?`);
  }
  
  function worldwideLatestStats(agent) {
    const type = agent.parameters.type;
    var type_length = type.length;
    //agent.add(`It's working. Type length is ` + type_length);
    return getJSON('https://coronavirus-tracker-api.ruizlab.org/v2/latest?source=jhu').then((result) => {
      agent.add(`According to my latest data :`);
      //var type_length = type.length;
      if(type_length === 1)
      {
          switch(type[0]){
          	case 'confirmed':
          	agent.add(`There are currently ${result.latest.confirmed} confirmed cases of COVID-19.`);
          	break;
            case 'deaths':
          	agent.add(`There are currently ${result.latest.deaths} reported deaths from COVID-19.`);
          	break; 
            case 'recovered':
          	agent.add(`${result.latest.recovered} people have recovered from COVID-19.`);
          	break;  
          	default:
          	agent.add(`There are currently ${result.latest.confirmed} confirmed cases of COVID-19, ${result.latest.deaths} reported deaths and ${result.latest.recovered} recoveries. This is really really bad!`);
      	  }
        
      }
      else if(type_length === 2)
      {
        	switch(type[0]){
          	case 'confirmed':
          	agent.add(`There are currently ${result.latest.confirmed} confirmed cases of COVID-19.`);
          	break;
            case 'deaths':
          	agent.add(`There are currently ${result.latest.deaths} reported deaths from COVID-19.`);
          	break; 
            case 'recovered':
          	agent.add(`${result.latest.recovered} people have recovered from COVID-19.`);
          	break;  
          	default:
          	agent.add(`There are currently ${result.latest.confirmed} confirmed cases of COVID-19, ${result.latest.deaths} reported deaths and ${result.latest.recovered} recoveries. This is really really bad!`);
      	  }
        	
          switch(type[1]){
          	case 'confirmed':
          	agent.add(`And there are ${result.latest.confirmed} confirmed cases.`);
          	break;
            case 'deaths':
          	agent.add(`And there are ${result.latest.deaths} reported deaths.`);
          	break; 
            case 'recovered':
          	agent.add(`and ${result.latest.recovered} people have recovered so far. I hope the number increases!`);
          	break;  
          	default:
          	agent.add(`There are currently ${result.latest.confirmed} confirmed cases of COVID-19, ${result.latest.deaths} reported deaths and ${result.latest.recovered} recoveries. This is really really bad!`);
      	  }
        
      }
      else if(type_length === 3)
      {
        	agent.add(`There are currently ${result.latest.confirmed} confirmed cases of COVID-19, ${result.latest.deaths} reported deaths and ${result.latest.recovered} recoveries. This is really really bad!`);
      }  
    
      
    }).catch((error) => {
      console.error(error);
    });
    
  }
  
  //location intent
    function LocationLatestStats(agent) {
    const type = agent.parameters.type;
    const country = agent.parameters.country;
    const county = agent.parameters.county;  
    const state = agent.parameters.state; 
    const time_period = agent.parameters.time;   
    var type_length = type.length;
    var country_alpha2;
    var province; 
    if(type.length > 0 && country.length == 0 && county.length == 0 && state.length == 0)
    {
      
      agent.add(`I am so sorry! Looks like I don't have any data for this location. I may have misapprehended the name. Give it another try maybe?`);
      
      return getJSON('https://coronavirus-tracker-api.ruizlab.org/v2/locations?source=csbs').then((result) => {
      
      }).catch((error) => {
		  //agent.add(` In catch  ${error}`);  
		  console.error(error);
		});
    }
    
      
    agent.add(`According to latest data, `);
    
    if(country.length > 0 && time_period.length === 0)
    {
       //calling api dynamically ******************
       for(let j=0; j<country.length; j++)
       {
         	getJSON(`https://coronavirus-tracker-api.ruizlab.org/v2/locations?source=jhu&country_code=${country[j]['alpha-2']}`).then((resp_data) => {
    	  
            if(j>0)
         		agent.add(`And..`);
             
          	if(type_length === 1)
      		{
          		switch(type[0])
				{
          		case 'confirmed':
          		agent.add(`The number of confirmed cases in ${country[j]['name']}  is currently ${resp_data.latest.confirmed}.`);
          		break;
            	case 'deaths':
          		agent.add(`The number of deaths reported in ${country[j]['name']}  is ${resp_data.latest.deaths}.`);
          		break; 
            	case 'recovered':
          		agent.add(`${resp_data.latest.recovered} people have recovered from COVID-19 in ${country[j]['name']}.`);
          		break;  
          		default:
          		agent.add(`There are ${resp_data.latest.confirmed} confirmed cases of COVID-19, ${resp_data.latest.deaths} deaths and ${resp_data.latest.recovered} recoveries in ${country[j]['name']}.`);
      	  	}
        
      	}
      	else if(type_length === 2)
      	{
        		switch(type[0]){
          		case 'confirmed':
          		agent.add(`The number of confirmed cases in ${country[j]['name']}  is currently ${resp_data.latest.confirmed}.`);
          		break;
            	case 'deaths':
          		agent.add(`The number of deaths reported in ${country[j]['name']}  is ${resp_data.latest.deaths}.`);
          		break; 
            	case 'recovered':
          		agent.add(`${resp_data.latest.recovered} people have recovered from COVID-19 in ${country[j]['name']}.`);
          		break;  
          		default:
          		agent.add(`There are ${resp_data.latest.confirmed} confirmed cases of COVID-19, ${resp_data.latest.deaths} deaths and ${resp_data.latest.recovered} recoveries in ${country[j]['name']}.`);
      	  	}
        	
          	switch(type[1]){
          	case 'confirmed':
          	agent.add(`And there are ${resp_data.latest.confirmed} confirmed cases.`);
          	break;
            case 'deaths':
          	agent.add(`And there are ${resp_data.latest.deaths} reported deaths.`);
          	break; 
            case 'recovered':
          	agent.add(`and ${resp_data.latest.recovered} people have recovered so far. I hope the number increases!`);
          	break;  
          	default:
          	agent.add(`There are ${resp_data.latest.confirmed} confirmed cases of COVID-19, ${resp_data.latest.deaths} deaths and ${resp_data.latest.recovered} recoveries in ${country[j]['name']}.`);
      	  }
        
      	}
      	else if(type_length === 3)
      	{
        	agent.add(`There are ${resp_data.latest.confirmed} confirmed cases of COVID-19, ${resp_data.latest.deaths} deaths and ${resp_data.latest.recovered} recoveries in ${country[j]['name']}.`);
      	}
          
  		});
       } //looping through countries   
         
      return getJSON('https://coronavirus-tracker-api.ruizlab.org/v2/locations?source=csbs').then((result) => {
      
      }).catch((error) => {
		  //agent.add(` In catch  ${error}`);  
		  console.error(error);
		});
      
      
    }// If country is mentioned 
      
    //Implementing time period ******************  
      
       if(country.length === 1 && time_period.length > 0)
       {
      
            var start = time_period[0]['startDate'].replace("-04:00","Z");
         	getJSON(`https://coronavirus-tracker-api.ruizlab.org/v2/locations?source=jhu&country_code=${country[0]['alpha-2']}&timelines=true`).then((resp_data) => {
            
          
            var start_count = resp_data.locations[0].timelines.confirmed.timeline[start];
            var latest_count = resp_data.latest.confirmed;
            var new_confirmed = latest_count - start_count;  
              
            start_count = resp_data.locations[0].timelines.deaths.timeline[start];
            latest_count = resp_data.latest.deaths;
            var new_deaths = latest_count - start_count;  
              
            start_count = resp_data.locations[0].timelines.recovered.timeline[start];
            latest_count = resp_data.latest.recovered;
            var new_recovered = latest_count - start_count;    
              
             
          	if(type_length === 1)
      		{
          		switch(type[0])
				{
          		case 'confirmed':
          		agent.add(`there were ${new_confirmed} new COVID-19 cases added in ${country[0]['name']} in the time period you mentioned.`);
          		break;
            	case 'deaths':
          		agent.add(`there were ${new_deaths} new deaths reported in ${country[0]['name']} in the time period you mentioned.`);
          		break; 
            	case 'recovered':
          		agent.add(` ${new_recovered} people recovered from COVID-19 in ${country[0]['name']} in the time period you mentioned.`);
          		break;  
          		default:
          		agent.add(`There were ${new_confirmed} new confirmed cases of COVID-19, ${new_deaths} deaths and ${new_recovered} recoveries in ${country[0]['name']} from the time you mentioned.`);
      	  	}
        
      	}
      	else if(type_length === 2)
      	{
        		switch(type[0]){
          		case 'confirmed':
          		agent.add(`there were ${new_confirmed} new COVID-19 cases added in ${country[0]['name']} in the time period you mentioned.`);
          		break;
            	case 'deaths':
          		agent.add(` ${new_deaths} new deaths were reported in ${country[0]['name']} in the time period you mentioned.`);
          		break; 
            	case 'recovered':
          		agent.add(`there were ${new_recovered} new recoveries in ${country[0]['name']} in the time period you mentioned.`);
          		break;  
          		default:
          		agent.add(`There were ${new_confirmed} new confirmed cases of COVID-19, ${new_deaths} new deaths and ${new_recovered} recoveries in ${country[0]['name']} in the time period you mentioned.`);
      	  	}
        	
          	switch(type[1]){
          	case 'confirmed':
          	agent.add(`And there were ${new_confirmed} new confirmed cases.`);
          	break;
            case 'deaths':
          	agent.add(`And there were ${new_deaths} new reported deaths.`);
          	break; 
            case 'recovered':
          	agent.add(`and ${new_recovered} new people recovered from COVID-19.`);
          	break;  
          	default:
          	agent.add(`There were ${new_confirmed} new confirmed cases of COVID-19, ${new_deaths} new deaths and ${new_recovered} recoveries in ${country[0]['name']} in the time period you mentioned.`);
      	  }
        
      	}
      	else if(type_length === 3)
      	{
        	agent.add(`There were ${new_confirmed} new confirmed cases of COVID-19, ${new_deaths} new deaths and ${new_recovered} recoveries in ${country[0]['name']} in the time period you mentioned.`);
      	}
          
  		});   
         
      return getJSON('https://coronavirus-tracker-api.ruizlab.org/v2/locations?source=csbs').then((result) => {
      
      }).catch((error) => {
		  //agent.add(` In catch  ${error}`);  
		  console.error(error);
		});   
      
    }   
      
    // time period *******************************  
      
       //calling api statically ******************  
    /*  
    return getJSON('https://coronavirus-tracker-api.ruizlab.org/v2/locations?source=jhu').then((result) => {
      var len = result.locations.length;
      //agent.add(` zzzz  ${result.locations[0].country_code}  ${len}`);
      
      var j;
      for(j=0; j<country.length; j++)
      {
        country_alpha2 = country[j]['alpha-2'];
      var i;
      for (i = 0; i<len ; i++) {
    	if(result.locations[i].country_code === country_alpha2)
        {
            if(j>0)
              agent.add(`And `);
          	if(type_length === 1)
      		{
          		switch(type[0]){
          		case 'confirmed':
          		agent.add(`The number of confirmed cases in ${result.locations[i].country}  is currently ${result.locations[i].latest.confirmed}`);
          		break;
            	case 'deaths':
          		agent.add(`The number of deaths reported in ${result.locations[i].country}  is ${result.locations[i].latest.deaths}`);
          		break; 
            	case 'recovered':
          		agent.add(`${result.locations[i].latest.recovered} people have recovered from COVID-19 in ${result.locations[i].country}`);
          		break;  
          		default:
          		agent.add(`There are ${result.locations[i].latest.confirmed} confirmed cases of COVID-19, ${result.locations[i].latest.deaths} deaths and ${result.locations[i].latest.recovered} recoveries in ${result.locations[i].country}`);
      	  	}
        
      	}
      	else if(type_length === 2)
      	{
        		switch(type[0]){
          		case 'confirmed':
          		agent.add(`The number of confirmed cases in ${result.locations[i].country}  is currently ${result.locations[i].latest.confirmed}`);
          		break;
            	case 'deaths':
          		agent.add(`The number of deaths reported in ${result.locations[i].country}  is ${result.locations[i].latest.deaths}`);
          		break; 
            	case 'recovered':
          		agent.add(`${result.locations[i].latest.recovered} people have recovered from COVID-19 in ${result.locations[i].country}`);
          		break;  
          		default:
          		agent.add(`There are ${result.locations[i].latest.confirmed} confirmed cases of COVID-19, ${result.locations[i].latest.deaths} deaths and ${result.locations[i].latest.recovered} recoveries in ${result.locations[i].country}`);
      	  	}
        	
          	switch(type[1]){
          	case 'confirmed':
          	agent.add(`And there are ${result.locations[i].latest.confirmed} confirmed cases.`);
          	break;
            case 'deaths':
          	agent.add(`And there are ${result.locations[i].latest.deaths} reported deaths`);
          	break; 
            case 'recovered':
          	agent.add(`and ${result.locations[i].latest.recovered} people have recovered so far. I hope the number increases!`);
          	break;  
          	default:
          	agent.add(`There are ${result.locations[i].latest.confirmed} confirmed cases of COVID-19, ${result.locations[i].latest.deaths} deaths and ${result.locations[i].latest.recovered} recoveries in ${result.locations[i].country}`);
      	  }
        
      	}
      	else if(type_length === 3)
      	{
        	agent.add(`There are ${result.locations[i].latest.confirmed} confirmed cases of COVID-19, ${result.locations[i].latest.deaths} deaths and ${result.locations[i].latest.recovered} recoveries in ${result.locations[i].country}`);
      	}  
      }
          
	}
    } //loop through the number of countries in query
      
      
      
    }).catch((error) => {
      console.error(error);
    });
      */
    
     //if there is a country  
      
    if(state.length > 0 || county.length > 0)
    {
       //var j=0;
       var curr_state; 
       //agent.add(`county = ${county[0]}`);
       if(county.length === 0)
       {
       for(let j=0; j<state.length; j++)
       { 
      	 curr_state = state[j];
         
         
        getJSON(`https://coronavirus-tracker-api.ruizlab.org/v2/locations?source=csbs&province=${state[j]}`).then((resp_data) => {
    	  
            if(j>0)
         		agent.add(`And..`);
             
          	if(type_length === 1)
      		{
          		switch(type[0])
				{
          		case 'confirmed':
          		agent.add(`The number of confirmed cases in ${state[j]}  is currently ${resp_data.latest.confirmed}.`);
          		break;
            	case 'deaths':
          		agent.add(`The number of deaths reported in ${state[j]}  is ${resp_data.latest.deaths}.`);
          		break; 
            	case 'recovered':
          		agent.add(`${resp_data.latest.recovered} people have recovered from COVID-19 in ${state[j]}.`);
          		break;  
          		default:
          		agent.add(`There are ${resp_data.latest.confirmed} confirmed cases of COVID-19, ${resp_data.latest.deaths} deaths and ${resp_data.latest.recovered} recoveries in ${state[j]}.`);
      	  	}
        
      	}
      	else if(type_length === 2)
      	{
        		switch(type[0]){
          		case 'confirmed':
          		agent.add(`The number of confirmed cases in ${state[j]}  is currently ${resp_data.latest.confirmed}.`);
          		break;
            	case 'deaths':
          		agent.add(`The number of deaths reported in ${state[j]}  is ${resp_data.latest.deaths}.`);
          		break; 
            	case 'recovered':
          		agent.add(`${resp_data.latest.recovered} people have recovered from COVID-19 in ${state[j]}.`);
          		break;  
          		default:
          		agent.add(`There are ${resp_data.latest.confirmed} confirmed cases of COVID-19, ${resp_data.latest.deaths} deaths and ${resp_data.latest.recovered} recoveries in ${state[j]}.`);
      	  	}
        	
          	switch(type[1]){
          	case 'confirmed':
          	agent.add(`And there are ${resp_data.latest.confirmed} confirmed cases.`);
          	break;
            case 'deaths':
          	agent.add(`And there are ${resp_data.latest.deaths} reported deaths.`);
          	break; 
            case 'recovered':
          	agent.add(`and ${resp_data.latest.recovered} people have recovered so far. I hope the number increases!`);
          	break;  
          	default:
          	agent.add(`There are ${resp_data.latest.confirmed} confirmed cases of COVID-19, ${resp_data.latest.deaths} deaths and ${resp_data.latest.recovered} recoveries in ${state[j]}.`);
      	  }
        
      	}
      	else if(type_length === 3)
      	{
        	agent.add(`There are ${resp_data.latest.confirmed} confirmed cases of COVID-19, ${resp_data.latest.deaths} deaths and ${resp_data.latest.recovered} recoveries in ${state[j]}.`);
      	}
          
  		});
        
         
       } 
      } //if there are no counties
      else
      {
         
       for(let j=0; j<county.length; j++)
       { 
         
         county[j] = county[j].replace(/ county/ig,"");
          county[j] = county[j].replace(/ parish/ig,"");
         
        if(state.length === 1) 
        {
          
          //county[j] = county[j].replace(/ county/ig,"");
          //county[j] = county[j].replace(/ parish/ig,"");
        getJSON(`https://coronavirus-tracker-api.ruizlab.org/v2/locations?source=csbs&province=${state[0]}&county=${county[j]}`).then((resp_data) => {
    	  
             
          	if(type_length === 1)
      		{
          		switch(type[0])
				{
          		case 'confirmed':
          		agent.add(`The number of confirmed cases in ${county[j]} county  is currently ${resp_data.latest.confirmed}.`);
          		break;
            	case 'deaths':
          		agent.add(`The number of deaths reported in ${county[j]} county is ${resp_data.latest.deaths}.`);
          		break; 
            	case 'recovered':
          		agent.add(`${resp_data.latest.recovered} people have recovered from COVID-19 in ${county[j]} county.`);
          		break;  
          		default:
          		agent.add(`There are ${resp_data.latest.confirmed} confirmed cases of COVID-19, ${resp_data.latest.deaths} deaths and ${resp_data.latest.recovered} recoveries in ${county[j]} county.`);
      	  	}
        
      	}
      	else if(type_length === 2)
      	{
        		switch(type[0]){
          		case 'confirmed':
          		agent.add(`The number of confirmed cases in ${county[j]} county is currently ${resp_data.latest.confirmed}.`);
          		break;
            	case 'deaths':
          		agent.add(`The number of deaths reported in ${county[j]} county is ${resp_data.latest.deaths}.`);
          		break; 
            	case 'recovered':
          		agent.add(`${resp_data.latest.recovered} people have recovered from COVID-19 in ${county[j]} county.`);
          		break;  
          		default:
          		agent.add(`There are ${resp_data.latest.confirmed} confirmed cases of COVID-19, ${resp_data.latest.deaths} deaths and ${resp_data.latest.recovered} recoveries in ${county[j]} county.`);
      	  	}
        	
          	switch(type[1]){
          	case 'confirmed':
          	agent.add(`And there are ${resp_data.latest.confirmed} confirmed cases.`);
          	break;
            case 'deaths':
          	agent.add(`And there are ${resp_data.latest.deaths} reported deaths`);
          	break; 
            case 'recovered':
          	agent.add(`and ${resp_data.latest.recovered} people have recovered so far. I hope the number increases!`);
          	break;  
          	default:
          	agent.add(`There are ${resp_data.latest.confirmed} confirmed cases of COVID-19, ${resp_data.latest.deaths} deaths and ${resp_data.latest.recovered} recoveries in ${county[j]} county.`);
      	  }
        
      	}
      	else if(type_length === 3)
      	{
        	agent.add(`There are ${resp_data.latest.confirmed} confirmed cases of COVID-19, ${resp_data.latest.deaths} deaths and ${resp_data.latest.recovered} recoveries in ${county[j]} county.`);
      	}
 		 
          if(j>0)
         	agent.add(`And..`);
          
  		});
        } //If state is specified
        else
        {
          	
            getJSON(`https://coronavirus-tracker-api.ruizlab.org/v2/locations?source=csbs&county=${county[j]}`).then((resp_data) => {
    	  
             
          	if(type_length === 1)
      		{
          		switch(type[0])
				{
          		case 'confirmed':
          		agent.add(`The number of confirmed cases in ${county[j]} county is currently ${resp_data.latest.confirmed}.`);
          		break;
            	case 'deaths':
          		agent.add(`The number of deaths reported in ${county[j]} county is ${resp_data.latest.deaths}.`);
          		break; 
            	case 'recovered':
          		agent.add(`${resp_data.latest.recovered} people have recovered from COVID-19 in ${county[j]} county.`);
          		break;  
          		default:
          		agent.add(`There are ${resp_data.latest.confirmed} confirmed cases of COVID-19, ${resp_data.latest.deaths} deaths and ${resp_data.latest.recovered} recoveries in ${county[j]} county.`);
      	  	}
        
      	}
      	else if(type_length === 2)
      	{
        		switch(type[0]){
          		case 'confirmed':
          		agent.add(`The number of confirmed cases in ${county[j]} county is currently ${resp_data.latest.confirmed}.`);
          		break;
            	case 'deaths':
          		agent.add(`The number of deaths reported in ${county[j]} county is ${resp_data.latest.deaths}.`);
          		break; 
            	case 'recovered':
          		agent.add(`${resp_data.latest.recovered} people have recovered from COVID-19 in ${county[j]} county.`);
          		break;  
          		default:
          		agent.add(`There are ${resp_data.latest.confirmed} confirmed cases of COVID-19, ${resp_data.latest.deaths} deaths and ${resp_data.latest.recovered} recoveries in ${county[j]} county.`);
      	  	}
        	
          	switch(type[1]){
          	case 'confirmed':
          	agent.add(`And there are ${resp_data.latest.confirmed} confirmed cases.`);
          	break;
            case 'deaths':
          	agent.add(`And there are ${resp_data.latest.deaths} reported deaths.`);
          	break; 
            case 'recovered':
          	agent.add(`and ${resp_data.latest.recovered} people have recovered so far. I hope the number increases!`);
          	break;  
          	default:
          	agent.add(`There are ${resp_data.latest.confirmed} confirmed cases of COVID-19, ${resp_data.latest.deaths} deaths and ${resp_data.latest.recovered} recoveries in ${county[j]} county.`);
      	  }
        
      	}
      	else if(type_length === 3)
      	{
        	agent.add(`There are ${resp_data.latest.confirmed} confirmed cases of COVID-19, ${resp_data.latest.deaths} deaths and ${resp_data.latest.recovered} recoveries in ${county[j]} county.`);
      	}
 		 
          if(j>0)
         	agent.add(`And..`);
          
  		});
        } //no state specified or more than 1 state specified
         
       }
      } // If there are counties
      
      return getJSON('https://coronavirus-tracker-api.ruizlab.org/v2/locations?source=csbs').then((result) => {
      
      }).catch((error) => {
		  //agent.add(` In catch  ${error}`);  
		  console.error(error);
		});  
     
    } 
    
  }
    
  
  
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Worldwide Latest Stats', worldwideLatestStats);
  intentMap.set('Location Latest Stats', LocationLatestStats);
  // intentMap.set('your intent name here', yourFunctionHandler);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
});
