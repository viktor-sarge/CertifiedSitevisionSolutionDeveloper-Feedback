// Grundläggande importer
import * as React from 'react';
import {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

// Subkomponent för själva formuläret
import FeedbackForm from './FeedbackForm';

// Sitevisionspecifika importer
import requester from "@sitevision/api/client/requester";
import router from "@sitevision/api/common/router";
import toasts from "@sitevision/api/client/toasts"; 

const App = ({ currentVersion, anonymous }) => {
    // Avsluta direkt om användaren är oinloggad
    if(anonymous) return; 

    // States för om inskickat + tidigare feedbackposter
    const [feedbackSent, setFeedbackSent] = useState(false);
    const [previousFeedback, setPreviousFeedback] = useState([]);

    // Slussa feedback från formulär till /feedback-routen i index.js
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
        setFeedbackSent(true); // Styr vilket gränssnitt som visas
    }

    // Ladda tidigare feedback från route i index.js
    useEffect(()=>{
        requester.doGet({
            url: router.getStandaloneUrl("/feedback"),
            data: {}
        })
        .then((previousFeedback)=>{
            setPreviousFeedback(previousFeedback.feedbackEntries)
        })
        .catch(()=>{
            console.log("Ett fel uppstod. Normalt vid omladdning av appen under utveckling. Felsök om detta visas under normal användning.")
        });
    }, [])

    // Timestamps till klartexttid
    const formatDate = (unixTimestamp) => {
        if(!unixTimestamp) return '';
        const date = new Date(unixTimestamp);
        return date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    }

    return (
        <>
            {/* Visa feedback-form om vi är i visningsläge och inte redan skickat in */}
            {currentVersion 
                ?   (feedbackSent 
                        ? (<div>Tack för din feedback!</div>) 
                        : <FeedbackForm handleSubmit={handleSubmit} />) 
                : <div>Feedbackmodulen kan bara användas i visningsläget</div>
            }

            {/* Tidigare feedbackposte */}
            <div class="example-demo-dark">
                <div class="env-cardholder-grid">
                    {previousFeedback.map((entry) => {return(
                        <article class="env-card env-block env-shadow-small">
                            <div class="env-card__body">
                                <h2 class="env-ui-text-subheading">{entry.user}</h2>
                                <p class="env-ui-text-caption env-p-bottom--medium">
                                    {entry.feedback}
                                </p>
                                <p class="env-ui-text-caption">
                                    {formatDate(entry.timePosted)}
                                </p>
                                {entry.current 
                                    ? <p class="env-ui-text-caption env-status-badge env-status-badge--active">Aktuell version</p> 
                                    : <p class="env-ui-text-caption env-status-badge">Äldre version</p>
                                }
                            </div>
                        </article>
                    )})}
                </div>
            </div>
        </>
    );
};

// Typa props
App.propTypes = {
    currentVersion: PropTypes.number,
    anonymous: PropTypes.bool,
};

export default App;
