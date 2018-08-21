import './setup.html';

Template.App_user_setup.onRendered(function() {
  progress(0, '.harden-password', function() {
    progress(0, '.generate-keys', function() {
      progress(0, '.encrypt-key', function() {
        $('.ok-button').prop("disabled",false);
      }
    )})
  });
})
