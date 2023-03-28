import * as React from 'react';
import {useState} from 'react';
import PropTypes from 'prop-types';
import toasts from "@sitevision/api/client/toasts"; 
import FeedbackForm from './FeedbackForm';

const App = ({ currentVersion }) => {
    console.log(`Online/offline ${currentVersion}`)
    const [feedbackSent, setFeedbackSent] = useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        toasts.publish({ 
            message: `Skickat.`, 
            type: "success", 
            ttl: 3, 
       }); 
        setFeedbackSent(true);
    }
    return (
        currentVersion 
            ?   (feedbackSent 
                    ? (<div>Tack för din feedback!</div>) 
                    : <FeedbackForm handleSubmit={handleSubmit} />) 
            : <div>Feedbackmodulen kan bara användas i visningsläget</div>
    );
};

App.propTypes = {
  message: PropTypes.string,
  name: PropTypes.string,
};

export default App;
