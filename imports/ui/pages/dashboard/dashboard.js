import './dashboard.html';

Template.App_dashboard.helpers({
  countNotes: function() {
    return ItemsDecrypted.find({type: 'note'}).count();
  },
  countAccounts: function() {
    return ItemsDecrypted.find({type: 'account'}).count();
  },
  countKeys: function() {
    return ItemsDecrypted.find({type: 'key'}).count();
  },
  countMessages: function() {
    return ItemsDecrypted.find({type: 'messages'}).count();
  },
  countContacts: function() {
    return Contacts.find().count();
  },
  countPending: function() {
    return ShareRequests.find({toUserId: Meteor.userId()}).count();
  },
  countSent: function() {
    return ShareRequests.find({fromUserId: Meteor.userId()}).count();
  },
  sharingCode: function() {
    return Meteor.user() && Meteor.user().profile.sharing_code
  },
  countInbox: function() {
    return MailDecrypted.find({recipients: {$regex : ".*"+Meteor.userId()+".*"}}).count();
  },
  countMailRead: function() {
    return Mail.find({"readBy.userId": Meteor.userId()}).count();
  },
  displayName: function() {
    return Meteor.user() && Meteor.user().profile.displayName;
  }
})

Template.App_dashboard.events({
  'click .notes': function() {
    FlowRouter.go('App.notes')
  },
  'click .accounts': function() {
    FlowRouter.go('App.accounts')
  },
  'click .keys': function() {
    FlowRouter.go('App.keys')
  },  
  'click .messages': function() {
    FlowRouter.go('App.messages')
  },
  'click .inbox': function() {
    FlowRouter.go('App.mail.inbox')
  },
  'click .mail-sent': function() {
    FlowRouter.go('App.mail.sent')
  },
  'click .contacts': function() {
    FlowRouter.go('App.contacts.manage')
  },
  'click .pending': function() {
    FlowRouter.go('App.contacts.pending')
  },
  'click .invites-sent': function() {
    FlowRouter.go('App.contacts.sent')
  },
  'click .profile': function() {
    FlowRouter.go('App.user.profile')
  },
  'click .copy-sharing-code': function(event) {
    toastr.success(TAPi18n.__('sharingCodeCopiedToClipboard'));
  },
})
