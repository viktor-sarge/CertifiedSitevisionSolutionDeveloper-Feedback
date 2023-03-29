import * as React from 'react';
import {useState} from 'react';
import PropTypes from 'prop-types';
import toasts from "@sitevision/api/client/toasts"; 
import FeedbackForm from './FeedbackForm';
import requester from "@sitevision/api/client/requester";
import router from "@sitevision/api/common/router";

const App = ({ currentVersion, anonymous }) => {
    if(anonymous) return; // Guard clause som avslutar direkt om användaren är oinloggad

    const [feedbackSent, setFeedbackSent] = useState(false);
    const handleSubmit = (text) => {
        requester["doPost"]({
            url: router.getStandaloneUrl("/feedback"),
            data: {feedback: text}
        }).then(()=>{
            // Visuell bekräftelse genom en toast
            toasts.publish({ 
                message: `Skickat.`, 
                type: "success", 
                ttl: 3, 
           }); 
        })
        setFeedbackSent(true); // Boolean för vilket gränssnitt som skall visas
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
