import './contacts.html';

Template.contacts.helpers ({
  contacts: function() {
    return searchContacts();
  },

  groups: function() {
    return GroupsDecrypted.find();
  },
  groupCount: function() {
    return GroupsDecrypted.find().count();
  },
  getSearchTerm: function() {
    return Session.get('contact_search_term');
  },
  noContacts: function() {
    return Contacts.find({visible: {$ne: false}}).count() == 0;
  },
  sharingCode: function() {
    return Meteor.user() && Meteor.user().profile.sharing_code;
  }
})

Template.contacts.events({
  'keyup #search': function(event, template) {
    Session.set('contact_search_term', $("input[id=search]").val());
  },
  'click .invite': function() {
    Modal.show('App_contact_invite');
  },
  'click .contact-add': function() {
    Groups.insert({name: $("#group-name").val(), contacts: $("#group-contacts").val()}, function(error, result){
      if (error) {
        console.log(error);
      }
    })
  },
  'click .delete-invite': function(event, template) {
    var id = event.currentTarget.getAttribute("data-id");
    var id = event.currentTarget.getAttribute("data-id");
    var modalData = {
      modalAction: TAPi18n.__("Delete"),
      modalActionTarget: 'share request',
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
  'click .accept-invite': function(event, template) {
      var id = event.currentTarget.getAttribute("data-id");
      Meteor.call('acceptSharingRequest',id, function(err, result) {
        if (err) {
          //$('.error').html('').append( err.reason );
          toastr.error(err.reason);
        } else {
          //Modal.hide('App_contact_invite');
          toastr.success(TAPi18n.__("allCommunicationsEncrypted"),TAPi18n.__("contactAdded"))
        }
      });
  },
  'click .delete-contact': function(event, template) {
    var id = event.currentTarget.getAttribute("data-user-id");
    var name = event.currentTarget.getAttribute("data-user-name");
    var modalData = {
      modalAction: TAPi18n.__("Delete"),
      modalActionTarget: TAPi18n.__("Contact"),
      modalMessage: TAPi18n.__("areYouSureDelete"),
      modalMessageTarget: name,
      modalYesButtonText: TAPi18n.__("Delete"),
      callback: function(result) {
        if (result == true) {
          Meteor.call('deleteContact', id, function(result) {
            toastr.success(TAPi18n.__("contactDeleted"))
          });
        }
      }
    };
    Modal.show('App_generic_modal', modalData);
  }
})

Template.contacts.rendered = function(){
}
