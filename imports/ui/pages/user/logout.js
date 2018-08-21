import './logout.html';

Template.App_logout.onRendered(function() {
  Meteor.logout();
  FlowRouter.go('App.home');
})
