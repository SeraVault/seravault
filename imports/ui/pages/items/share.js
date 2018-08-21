Template.App_items_share.helpers({
  record: function() {
    return Items.findOne(Session.get('item_id'));
  },
  contacts: function() {
    var opts = [];
    Contacts.find({visible: {$ne: false}}).forEach(function(contact) {
      opts.push({value: contact.userId, label: contact.displayName})
    });
    return opts;
  },
  noContacts: function() {
    return Contacts.find().count() === 0;
  },
  groups: function() {
    var opts = [];
    GroupsDecrypted.find().forEach(function(group) {
      opts.push({value: group._id, label: group.name})
    })
  },
  defaultContacts: function(doc_id) {

  },  
  sharingCode: function() {
    return Meteor.user() && Meteor.user().profile.sharing_code;
  }

});

var hooksObject = {
  onSuccess: function () {
    toastr.success(TAPi18n.__('encryptedAndSaved'));    
    Modal.hide('App_items_share');
  },
  onError: function(err, message) {
    toastr.error(message);
  }
};

AutoForm.hooks({
  shareItems: hooksObject
});

