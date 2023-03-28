import * as React from 'react';
import styles from './App.scss';

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
                            Lämna feedback
                        </label>
                        <div class="env-form-element__control">
                            <textarea
                                class="env-form-input"
                                placeholder="Placeholder text"
                                id="textarea"
                                rows="3"
                                ref={textareaRef} // set the ref to the textarea element
                            ></textarea>
                        </div>
                    </div>
                </div>
                <div class="env-form-element">
                    <button type="submit" class="env-button env-button--primary">
                        Skicka
                    </button>
                </div>
            </form>
        </div>
    );
}

export default FeedbackForm;
