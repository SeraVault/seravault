import './accounts.html';

Template.App_accounts_fieldset.events({
  'click .generatePassword': function(event, template) {
    event.preventDefault();
    Modal.show('svPasswordModal');
    //$("#svPassword").val(generatePassword());
  },
});
