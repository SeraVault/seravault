import './login.html';
Template.App_login.helpers({
  notCordova: function () {
    return !Meteor.isCordova;
  }
});

Template.App_login.events({
  'click .logout': function () {
    Meteor.logout();
  },
  'click .login': function (e) {
    e.preventDefault();
    var email = $('#email').val();
    var password = $('#password').val();
    $(".login").prop("disabled", true);
    login = function () {
      Meteor.loginWithPassword(email, password, function (error) {
        if (error) {
          if (error.error = 403) {
            toastr.error(TAPi18n.__("WrongPassword"))
            /*if (!Meteor.isCordova){
              reCAPTCHA.reset("SeraVault");
            }*/
            $(".login").prop("disabled", false);
            //Session.set('showSpinner', false);
          }
        } else {
          //Meteor.call('setupSupport');
          Sv.getUserKeys(password);
          FlowRouter.go("App.all");
        }
      });
    };

    login();

    /*
    if (Meteor.isCordova) {
      login();
    }
    else
    {
      Meteor.call("testRecaptcha", reCAPTCHA.getResponse("SeraVault"), function(error, response) {
        if (!response) {
          toastr.error(TAPi18n.__("AreYouARobot"));
          $(".login").prop("disabled",false);
          return;
        }
        else
        {
          login();
        }//else
      }) //recaptcha test method call
    }*/
  }

})

Template.App_login.onRendered(function () {

})