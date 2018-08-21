import './register.html';

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
    //T9n.setLanguage(lang);
  },
  'click .terms-link': function() {
    //Modal.show('App_terms-of-use');
    $('#modal-terms').modal('show');
  },
  'click .register': function(e) {
    e.preventDefault();
    var clean = $("#register").parsley().validate();
 //disable register button
    //var l = Ladda.create( document.querySelector( '.register' ) );

    //check values
    /*var clean = true;
    $('div').removeClass("has-error");*/
    var email = $('#email').val();
    var displayName = $('#displayName').val();
    var terms = $('#terms:checked').val();
    var password = $('#password').val();
    var password2 = $('#password2').val();
    var cantResetPassword = $('#cantResetPassword:checked').val();

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
          Meteor.call('userLogin');
          TAPi18n.setLanguage(language);   
          
          Modal.show('App_user_setup');    
      
          //once the setup modal is hidden, generate the default items
          $('#setup-dialog').on('hidden.bs.modal', function () {
            generateDefaultItems(email, password);
          });      
          FlowRouter.go('App.all');
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
