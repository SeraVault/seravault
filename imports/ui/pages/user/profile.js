import './profile.html';

Template.App_user_profile.helpers({
  sharingCode: function() {
    return Meteor.user() && Meteor.user().profile.sharing_code;
  },
  getDisplayName: function() {
    return Meteor.user() && Meteor.user().profile.displayName;
  },
  getEmailAddress: function() {
    return Meteor.user() && Meteor.user().emails[0].address;
  },
  currentUser: function() {
    return Meteor.user();
  },
  getExpiration: function(plan) {
    if (AppPlans.endDate(plan)) {
      return moment(AppPlans.endDate(plan)).calendar();
    }
  },
  isLangChecked: function(lang) {
    var checked = Meteor.user() && Meteor.user().profile.language == lang;
    if (checked) return "checked";
  },
  freePlan: function() {
    return !AppPlans.has('silver') && !AppPlans.has('gold');
  },
  silverPlan: function() {
    return AppPlans.has('silver') && !AppPlans.has('gold');
  },
  goldPlan: function() {
    return AppPlans.has('gold');
  }
});

Template.App_user_profile.events({
  'click .copy-sharing-code': function(event) {
    toastr.success(TAPi18n.__('sharingCodeCopiedToClipboard'))
  },
  'click #change-password': function(event) {
    var clean = $("#change-password").parsley().validate();
    if (!clean) {return;}
    var oldPassword = $('#current-password').val();
    var newPassword = $('#new-password').val();
    var newPassword2 = $('#new-password2').val();
    if (!newPassword) {
      toastr.error(TAPi18n.__("PasswordEmpty"));
      return;
    }
    if (newPassword != newPassword2)  {
      toastr.error(TAPi18n.__("PassphraseMatchError"));
      return;
    };
    var modalData = {
      modalIcon: 'warning',
      modalAction: TAPi18n.__('ChangePassword'),
      modalActionTarget: "",
      modalMessage: "<b>" + TAPi18n.__("passphraseWarning0") + "<b><br>" +TAPi18n.__("passphraseWarning1") + "<br>" + TAPi18n.__("passphraseWarning2"),
      modalMessageTarget: "",
      modalYesButtonText: TAPi18n.__("Change"),
      callback: function(result) {
        if (result == true) {
          Accounts.changePassword(oldPassword, newPassword, function(error) {
            //console.log(error);
            if (error) {
              toastr.error(error.reason);
            } else {
              Sv.changePassword(newPassword);
              toastr.success(TAPi18n.__("PasswordChanged"));
            }
          });
        }
      }
    }
    Modal.show('App_generic_modal', modalData);
  },
  'click #change-display-name': function(event) {
    var clean = $("#change-display-name").parsley().validate();
    if (!clean) {return};
    Meteor.call('changeDisplayName', $('#display-name').val(), function(err) {
      if (err) {
        toastr.error(err);
      } else {
        toastr.success(TAPi18n.__("DisplayNameChanged"))
      }
    });
  },
  'click #change-email-address': function(event) {
    var clean = $("#change-email").parsley().validate();
    if (!clean) {return};
    Meteor.call('changeEmail', $('#email-address').val(), function(err) {
      if (err) {
        toastr.error(err);
      } else {
        toastr.success(TAPi18n.__('EmailChanged'))
      }
    });
  },
  'click #change-language': function(event) {
    var lang = $('input[name=optionsLang]:checked').val();
    TAPi18n.setLanguage(lang);
    Meteor.call('changeLanguage', lang);
    toastr.success(TAPi18n.__("LanguageChanged"));
  },
  'click .select-silver': function(event) {
    //console.log('selected silver');
    AppPlans.set('silver', function (error) {
      if (error) {
        toastr.error(TAPi18n.__('PlanSignupError'), error);
      }
    });
  },
  'click .cancel-silver': function(event) {
    var modalData = {
      modalIcon: 'warning',
      modalAction: TAPi18n.__('cancelPlan'),
      modalActionTarget: TAPi18n.__('Silver'),
      modalMessage: TAPi18n.__("areYouSureCancel"),
      modalMessageTarget: "",
      modalYesButtonText: TAPi18n.__("yesCancelPlan"),
      callback: function(result) {
        if (result == true) {
          AppPlans.remove('silver', function (error) {
            // If no error, the plan was successfully removed
            if (error) {
              toastr.error(error);
            } else {
              AppPlans.sync({userId: Meteor.userId()});
              toastr.success(TAPi18n.__("PlanUnsubscribed"));
            }
          });
        }
      }
    };
    Modal.show('App_generic_modal', modalData);
   
  },
  'click .select-gold': function(event) {
    //console.log('selected silver');
    AppPlans.set('gold', function (error) {
      if (error) {
        toastr.error(TAPi18n.__('PlanSignupError'), error);
      }
    });
  },
  'click .cancel-gold': function(event) {
    var modalData = {
      modalIcon: 'warning',
      modalAction: TAPi18n.__('cancelPlan'),
      modalActionTarget: TAPi18n.__('Gold'),
      modalMessage: TAPi18n.__("areYouSureCancel"),
      modalMessageTarget: "",
      modalYesButtonText: TAPi18n.__("yesCancelPlan"),
      callback: function(result) {
        if (result == true) {
          AppPlans.remove('gold', function (error) {
            // If no error, the plan was successfully removed
            if (error) {
              toastr.error(error);
            } else {
              AppPlans.sync({userId: Meteor.userId()});
              toastr.success(TAPi18n.__("PlanUnsubscribed"));
            }
          });
        }
      }
    };
    Modal.show('App_generic_modal', modalData);    
  },  
  'click .delete-account': function(event) {
    //console.log('delete-account');
    var modalData = {
      modalIcon: 'warning',
      modalAction: TAPi18n.__('DeleteAccount'),
      modalActionTarget: Meteor.user().emails[0].address || Meteor.user().username,
      modalMessage: TAPi18n.__("areYouSureDelete"),
      modalMessageTarget: TAPi18n.__("UserAccount") + "?",
      modalYesButtonText: TAPi18n.__("Delete"),
      callback: function(result) {
        if (result == true) {
          Meteor.call("removeAccount", function(error) {
            if (error) {
              toastr.error(error);
            } else {
              FlowRouter.go('App.leave');
            }
          })
          FlowRouter.go('App.leave');
        }
      }
    }
    Modal.show('App_generic_modal', modalData);
  },
  'click .data-usage': function() {
    FlowRouter.go('/app/profile#plans');
  }
})
