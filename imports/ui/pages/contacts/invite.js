import './invite.html';

Template.App_contact_invite.events({
  'click .invite': function() {
    Meteor.call('sendInvitation', $('.sharing-code').val(), $('.note').val(), function(err) {
      if (err) {
        toastr.error(err.reason);
      } else {
        toastr.success(TAPi18n.__("InvitationSent"));
        FlowRouter.go('App.contacts.sent');
      }
    })
  }
})
