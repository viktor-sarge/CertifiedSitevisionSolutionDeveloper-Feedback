"use strict";

(function () {
  window.validate = function () {
    var emailInputs = document.querySelectorAll('input[type=email]');
    var valid = true;
    emailInputs.forEach(function (emailInput) {
      if (!emailInput.validity.valid) {
        valid = false;
        window.sv.addErrorMessage(emailInput, {
          message: emailInput.validationMessage,
          isValid: function isValid(e) {
            return e.target.validity.valid;
          }
        });
      }
    });
    return valid && window.sv.validate();
  };
})();