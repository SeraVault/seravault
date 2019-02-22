import parsley from 'parsleyjs';

import './email-invite.html';

Template.emailInvite.events({
  'click .sendInvite': function(e, t) {
    e.preventDefault();    
    var clean = $("#email-invite").parsley().validate();
    if (clean) {
      $('.sendInvite').prop("disabled",true);
      Meteor.call('emailSeravaultInvitation', $("#inputEmail").val(), $("#inputMessage").val(), function(err, result) {
        toastr.success(TAPi18n.__("inviteToSeravaultSent1") + " " + $("#inputEmail").val() + " " + TAPi18n.__("inviteToSeravaultSent2"));
        $("#inputEmail").val("");
        $("#inputMessage").val("");
        $('.sendInvite').prop("disabled",false);
      });
    }
  },
  'click .inviteSection': function(e, t) {
    e.preventDefault();
  }
})