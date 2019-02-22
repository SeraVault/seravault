import './login.html';
Template.App_login.helpers({
  notCordova: function () {
    return !Meteor.isCordova;
  },
  showEnterCode: function () {
    return twoFactor.isVerifying();
  },
  notShowEnterCode: function () {
    return !twoFactor.isVerifying();
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
    Session.set('tmp_password', password);
    $(".login").prop("disabled", true);
    $("#email").prop("disabled", true);
    $("#password").prop("disabled", true);
    twoFactor.getAuthCode(email, password, error => {
      if (error) {
        if (error.error = 403) {
          toastr.error(error.message)
          /*if (!Meteor.isCordova){
            reCAPTCHA.reset("SeraVault");
          }*/
          $(".login").prop("disabled", false);
          $("#email").prop("disabled", false);
          $("#password").prop("disabled", false);
          //Session.set('showSpinner', false);
        }
      }      
    });    
  },
  'click .verifyCode': function (e) {
    e.preventDefault();
    var code = $('#verificationCode').val();
    var password = $('#password').val();
    twoFactor.verifyAndLogin(code, error => {
      if (error) {
        toastr.error(error.message);
      }
      //console.log(Meteor.user());
      Meteor.user() && Sv.getUserKeys(Session.get('tmp_password'));
      Session.set('tmp_password', '');
      Meteor.call('userLogin');
      redirect = Session.get('redirectAfterLogin');
      if (redirect) {
        FlowRouter.go(redirect);
      } else {
        FlowRouter.go("App.all");
      }
    });
  },
  'click .resetLogin': function () {
    twoFactor.isVerifying(false);
  }
});