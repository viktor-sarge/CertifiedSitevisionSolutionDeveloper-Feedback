// Grundläggande importer
import * as React from 'react';
import {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

// Subkomponent för själva formuläret
import FeedbackForm from './FeedbackForm';

// Sitevisionspecifika importer
import app from "@sitevision/api/common/app";
import i18n from "@sitevision/api/common/i18n";
import requester from "@sitevision/api/client/requester";
import router from "@sitevision/api/common/router";
import toasts from "@sitevision/api/client/toasts"; 

const App = ({ currentVersion, anonymous }) => {
    // Avsluta direkt om användaren är oinloggad
    if(anonymous) return;
    const locale = app.locale;

    // States för om inskickat + tidigare feedbackposter
    const [feedbackSent, setFeedbackSent] = useState(false);
    const [previousFeedback, setPreviousFeedback] = useState([]);

    // Funktion för att hämta tidigare feedback
    const getPreviousFeedback = () => {
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
    }

    // Slussa feedback från formulär till /feedback-routen i index.js
    const handleSubmit = (text) => {
        requester["doPost"]({
            url: router.getStandaloneUrl("/feedback"),
            data: {feedback: text}
        }).then(()=>{
            // Visuell bekräftelse genom en toast
            toasts.publish({ 
                message: i18n.get('sent'), 
                type: "success", 
                ttl: 3, 
            }); 
            getPreviousFeedback();
        })
        setFeedbackSent(true); // Styr vilket gränssnitt som visas
    }

    // Ladda tidigare feedback från route i index.js
    useEffect(()=>{
        getPreviousFeedback();
    }, [])

    // Timestamps till klartexttid
    const formatDate = (unixTimestamp) => {
        if(!unixTimestamp) return '';
        const date = new Date(unixTimestamp);
        return date.toLocaleDateString(locale === 'sv' ? 'sv-SE' : 'en-US', {
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
                        ? (<div>{ i18n.get('thanks')}</div>) 
                        : <FeedbackForm handleSubmit={handleSubmit} />) 
                : <div>{ i18n.get('notInEditView')}</div>
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
                                    ? <p class="env-ui-text-caption env-status-badge env-status-badge--active">{ i18n.get('currentVersion')}</p> 
                                    : <p class="env-ui-text-caption env-status-badge">{ i18n.get('oldVersion')}</p>
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
