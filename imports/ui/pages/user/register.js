import './register.html';
import parsley from 'parsleyjs';

Template.App_register.helpers({
  notCordova: function() {
    return !Meteor.isCordova;
  }
})

Template.App_register.events({
  'click .logout': function() {
    Meteor.logout();
  },
  'click .select-language': function() {
    var lang = $('.select-language').val();
    TAPi18n.setLanguage(lang);
  },
  'click .terms-link': function() {
    //Modal.show('App_terms-of-use');
    $('#modal-terms').modal('show');
  },
  'click .register': function(e) {
    e.preventDefault();
    var clean = $("#register").parsley().validate();

    var email = $('#email').val();
    var displayName = $('#displayName').val();
    //var terms = $('#terms:checked').val();
    var password = $('#password').val();
    //var password2 = $('#password2').val();
    //var cantResetPassword = $('#cantResetPassword:checked').val();
    //var enableMultiFactor = $('#enableMultiFactor').val();

    var language = $('.select-language').val();

    createAccount = function() {
      Accounts.createUser({
        email: email,
        password: password,

      }, function(error) {
        if (error) {
          toastr.error(error.reason);
          /*if (!Meteor.isCordova) {
            reCAPTCHA.reset("SeraVault");
          }*/
          $(".register").prop("disabled",false);
          //l.stop();
        }
        else
        {
          $(".register").prop("disabled",true);
          //Meteor.call('setupSupport');
          Sv.setUserKeys(password, language, displayName);
          TAPi18n.setLanguage(language);  
          Modal.show('App_user_setup');             
          $('#setup-dialog').on('hidden.bs.modal', function () {   
            Session.set('tmp_password', password);         
            Session.set('tmp_email', email);
            Session.set('tmp_set_default_items', true);
            Session.set('runIntroJs', true);
            FlowRouter.go('App.all');
          });                       
        }
      });
    };

    if (!clean) {
    }
    else {
      createAccount();
    }

/*    if (Meteor.isCordova) {
      if (!clean) {
        l.stop();
      }
      else {
        createAccount();
      }
    }
    else
    {
      Meteor.call("testRecaptcha", reCAPTCHA.getResponse("SeraVault"), function(error, response) {
        if (!response) {
          toastr.error(TAPi18n.__("AreYouARobot"));
          l.stop();
        }
        else
        {
          if (!clean) {
            $(".register").removeAttr("disabled");
          } else {
            createAccount();
          }
        }//else
      }) //recaptcha test method call
    }  //is not cordova  */
  } //click .register
});

Template.App_register.helpers( {
  langSelected: function(id) {
    if (TAPi18n.getLanguage() == id) {
      return "selected"
    }
  }
})
