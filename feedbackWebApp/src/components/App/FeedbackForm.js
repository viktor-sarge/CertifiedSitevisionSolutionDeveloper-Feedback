import * as React from 'react';
import styles from './App.scss';

const FeedbackForm = ({handleSubmit}) => {
    return(
        <div className={styles.container}>
            <form class="env-form" action="/">
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
                            ></textarea>
                        </div>
                    </div>
                </div>
                <div class="env-form-element">
                    <button onClick={handleSubmit} type="submit" class="env-button env-button--primary">
                        Skicka
                    </button>
                </div>
            </form>
        </div>
    );
}

export default FeedbackForm;