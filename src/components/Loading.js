import React from 'react';
import { Dimmer, Loader, Segment} from 'semantic-ui-react';


const Loading = props => {

  const renderDimmer = (flag) =>{
    if(flag){
      return <Dimmer className={"myloader"} active page>
              <Loader>Loading</Loader>
          </Dimmer>
    }else if(props.nonsegment){
      return <Dimmer className={"myloader"} inverted active >
              <Loader>Loading</Loader>
          </Dimmer>
    }else{
      return <Segment>
          <Dimmer className={"myloader"} inverted active >
              <Loader>Loading</Loader>
          </Dimmer>
        </Segment>
    }
    
  }
  
  return (
    // <div className="loading">
  
    renderDimmer(props.full === true)
    
    
    // </div>
  );
};


export default Loading;
