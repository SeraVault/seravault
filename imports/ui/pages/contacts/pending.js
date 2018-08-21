import './pending.html';

Template.contactsPending.helpers({
  invitations: function() {
    var shareRequests = ShareRequests.find({toUserId: Meteor.userId()});
    shareRequests.forEach(function(data) {
      Notifications.find({objectId: data._id}).forEach(function(data){
        Notifications.remove(data._id)
      })
    });
    return shareRequests;
  },
  noInvites: function() {
    return (ShareRequests.find({toUserId: Meteor.userId()}).count() == 0);
  },
  formatDate: function(date) {
    return moment(date).calendar();
  },
  sharingCode: function() {
    return Meteor.user().profile.sharing_code;
  },
})

Template.contactsPending.events({
  'click .accept-invite': function(event, template) {
      var id = event.currentTarget.getAttribute("data-id");
      Meteor.call('acceptSharingRequest',id, function(err, result) {
        if (err) {
          toastr.error(err.reason);
        } else {
          toastr.success(TAPi18n.__("ContactAdded"))
        }
      });
  },
  'click .delete-invite': function(event, template) {
    var id = event.currentTarget.getAttribute("data-id");
    var modalData = {
      modalAction: TAPi18n.__("Delete"),
      modalActionTarget: TAPi18n.__("invitation"),
      modalMessage: TAPi18n.__("areYouSureDelete"),
      modalMessageTarget: TAPi18n.__("deleteInvitation"),
      modalYesButtonText: TAPi18n.__("Delete"),
      callback: function(result) {
        if (result == true) {
          ShareRequests.remove({_id: id});
          toastr.success(TAPi18n.__("invitationDeleted"));
        }
      }
    };
    Modal.show('App_generic_modal', modalData);
  },
})
