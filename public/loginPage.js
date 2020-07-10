"use strict";

let login = new UserForm();
let verificationAuthorization = (user) => {
  if (user.success) {
    location.reload();
  } else {
    login.setLoginErrorMessage(user.data);
  }
};
login.loginFormCallback = (data) =>
  ApiConnector.login(data, (user) => verificationAuthorization(user));

let verificationRegistration = (user) => {
    if (user.success) {
        location.reload();
    } else {
        login.setRegisterErrorMessage(user.data);
    }
    
};
login.registerFormCallback = (data) =>
  ApiConnector.register(data, (user) => verificationRegistration(user));
