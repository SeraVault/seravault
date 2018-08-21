import './leave.html';

Template.App_leave.events({
  'click #sendfeedback': function() {
    var message = $("#feedback").val();
    Feedback.insert({subject: 'leaving', message: message});
    Meteor.logout();
    FlowRouter.go("App.home");
  }
})
Template.App_leave.onRendered(function() {
  Meteor.logout();
  progress(0, '.remove-items', function() {
    progress(0, '.remove-contacts', function() {
      progress(0, '.remove-keys', function() {
        $('#done-remove').css('visibility', 'visible');
      }
    )})
  });


})
