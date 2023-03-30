import * as React from 'react';
import styles from './App.scss';

// Sitevisions intrantionalization-funktioner
import i18n from "@sitevision/api/common/i18n";

const FeedbackForm = ({handleSubmit}) => {
    const textareaRef = React.useRef(null); // create a ref to the textarea element

    const onSubmit = (event) => {
        event.preventDefault(); // prevent default form submission behavior
        const text = textareaRef.current.value; // get the value of the textarea
        handleSubmit(text); // call the handleSubmit function with the textarea content
    };

    return(
        <div className={styles.container}>
            <form class="env-form" onSubmit={onSubmit}>
                <div class="env-form__row">
                    <div class="env-form-element">
                        <label for="textarea" class="env-form-element__label">
                            { i18n.get('leaveFeedback') }
                        </label>
                        <div class="env-form-element__control">
                            <textarea
                                class="env-form-input"
                                placeholder={ i18n.get('feedbackFormText') }
                                id="textarea"
                                rows="3"
                                ref={textareaRef} // set the ref to the textarea element
                            ></textarea>
                        </div>
                    </div>
                </div>
                <div class="env-form-element">
                    <button type="submit" class="env-button env-button--primary">
                    { i18n.get('send') }
                    </button>
                </div>
            </form>
        </div>
    );
}

export default FeedbackForm;
