import './sent.html';

Template.contactsSent.helpers({
  invitations: function() {
    return ShareRequests.find({fromUserId: Meteor.userId()});
  },
  noInvites: function() {
    return ShareRequests.find({fromUserId: Meteor.userId()}).count() == 0;
  }
})

Template.contactsSent.events({
  'click .retract-invite': function(event, template) {
    var id = event.currentTarget.getAttribute("data-id");
    ShareRequests.remove({_id: id});
  }
})
