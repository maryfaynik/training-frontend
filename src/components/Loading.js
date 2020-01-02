import React from 'react';
import { Dimmer, Loader} from 'semantic-ui-react';


const Loading = props => {
  
  return (
    <div className="loading">
         <Dimmer active>
            <Loader />
        </Dimmer>
    </div>
  );
};


export default Loading;
