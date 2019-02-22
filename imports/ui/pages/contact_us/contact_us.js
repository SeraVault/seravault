import './contact_us.html';

Template.App_contact_us.helpers({
  getName: function() {
    return Meteor.user().profile.displayName;
  },
  getEmail: function() {
    return Meteor.user().emails[0].address;
  }
})

Template.App_contact_us.events({
  'click .send': function() {
    var name = $('#inputName').val();
    var email = $('#inputEmail').val();
    var message = $('#inputMessage').val();

    if (!name || !email || !message) {
        toastr.error(TAPi18n.__('tryAgain'));
        return;
    }

    Meteor.call('contactUs', name, email, message, function(error, result) {
        if (!error) {
            toastr.success(TAPi18n.__("messageSent"));
            FlowRouter.go('App.all');
        } else {
            toastr.error(error);
        }
    });
}
})