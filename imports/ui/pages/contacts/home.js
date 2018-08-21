import './home.html';

Template.contactHome.helpers({
  countContacts: function() {
    return Contacts.find({visible: {$ne: false}}).count();
  },
  countPending: function() {
    return ShareRequests.find({toUserId: Meteor.userId()}).count();
  },
  countSent: function() {
    return ShareRequests.find({fromUserId: Meteor.userId()}).count();
  }
})

Template.contactHome.events({
  'click .contacts': function() {
    FlowRouter.go('App.contacts.manage')
  },
  'click .pending': function() {
    FlowRouter.go('App.contacts.pending')
  },
  'click .sent': function() {
    FlowRouter.go('App.contacts.sent')
  },
})
