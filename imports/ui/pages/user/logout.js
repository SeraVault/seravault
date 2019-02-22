import './logout.html';

Template.App_user_logout.onRendered(function() {
  Session.clear();
  Meteor.logout();
})