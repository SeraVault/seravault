import "./decrypt_modal.html";

Template.App_decrypt_modal.helpers({
  percent: function() {
    return Session.get('tmp_decrypting_percent');
  }
});

Template.App_decrypt_modal.events ({
  'click .yes': function(event, template) {        
    if ($('.dont-show-again').is(':checked')) {
      Meteor.call('setProfileVar', 'decryptedDownloadAcknowledgement', true);
    }
    Modal.hide('App_info_modal');    
  },
});
