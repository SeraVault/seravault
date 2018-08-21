import './contact-us.html';

Template.App_contact.events({
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
                $("#modal-contact").modal("hide");
            } else {
                toastr.error(error);
            }
        });
    }
})