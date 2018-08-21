contactsExists = function(user1, user2) {
  var way1 = Contacts.findOne({owner_id: user1, userId: user2})
  var way2 = Contacts.findOne({owner_id: user2, userId: user1})
  return way1 || way2;
}

Meteor.methods({
  testRecaptcha: function(recaptcha) {
    return reCAPTCHA.verifyCaptcha(this.connection.clientAddress, recaptcha);
  },
  sendInvitation: function(sharingCode, note) {
    var toUser = Meteor.users.findOne({'profile.sharing_code': sharingCode});
    if (!toUser) {throw new Meteor.Error(1001, TAPi18n.__('sharingCodeNotFound'));}
    var fromUser = Meteor.user();
    if (toUser._id == fromUser._id) { throw new Meteor.Error(1005, TAPi18n.__('cantShareToSelf'))}
    var sharingRequestExists = ShareRequests.findOne({fromUserId: fromUser._id, toUserId: toUser._id});
    if (sharingRequestExists) { throw new Meteor.Error(1002, TAPi18n.__('alreadySentRequest'))};
    if (contactsExists(toUser._id, fromUser._id)) { throw new Meteor.Error(1004, TAPi18n.__("alreadyAContact"));}
    var additional = {displayName : fromUser.profile.displayName};

    requestNumber = ShareRequests.insert({fromUserId: fromUser._id, toUserId: toUser._id, fromUserDisplayName: fromUser.profile.displayName, toUserDisplayName: toUser.profile.displayName,note: note, status: 'Not Accepted'});
    //var message = {key: 'NewSharingRequest', sprintf: [fromUser.profile.displayName]};
    Notifications.insert({userId: toUser._id, fromId: fromUser._id, message: 'NewSharingRequest', link: '/app/contacts/pending', icon: 'share', read: false, objectId: requestNumber, data: additional});
  },
  acceptSharingRequest: function(requestId) {
    //TAPi18n.setLanguage(Meteor.user() && Meteor.user().profile.language || 'en');
    request = ShareRequests.findOne(requestId);
    if (!request) { throw new Meteor.Error(1003, TAPi18n.__("requestDoesntExist"))};
    if (request.toUserId != Meteor.userId()) { throw new Meteor.Error(1004, TAPi18.n__("cantApproveRequest"))}

    //make sure contact doesn't already exist before adding
    if (!Contacts.findOne({owner_id: request.fromUserId, userId: request.toUserId})) {
      var toUser = Meteor.users && Meteor.users.findOne(request.toUserId);
      //console.log(toUser);
      Contacts.insert({owner_id: request.fromUserId, userId: request.toUserId, status: 'Enabled', 
                        pubKey: toUser.profile.enc_publicKey, displayName: toUser.profile.displayName});
    }
    if (!Contacts.findOne({owner_id: request.toUserId, userId: request.fromUserId})) {
      var fromUser = Meteor.users && Meteor.users.findOne(request.fromUserId);
      //console.log(fromUser);
      Contacts.insert({owner_id: request.toUserId, userId: request.fromUserId, status: 'Enabled', 
                        pubKey: fromUser.profile.enc_publicKey, displayName: fromUser.profile.displayName});
    }
    ShareRequests.remove({_id: request._id});

    //send notification
    //var toUserDisplayName = Meteor.user(request.toUserId).profile.displayName;
    //var message = {key: 'InvitationAccepted', sprintf: [toUserDisplayName]};
    var user = Meteor.users.findOne(request.toUserId);
    var additional = {displayName : user.profile.displayName};
    Notifications.insert({userId: request.fromUserId, fromId: request.toUserId, message: 'InvitationAccepted', link: '/app/contacts/manage', icon: 'share', read: false, data: additional});
  },
  userLogin: function() {
    doc = UserOnline.findOne({userId: Meteor.userId()});
    doc ? UserOnline.update({_id: doc._id}, {$set: {online: true}})  : UserOnline.insert({userId: Meteor.userId(), online: true});
  },
  userLogout: function() {
    doc = UserOnline.findOne({userId: Meteor.userId()});
    doc ? UserOnline.update({_id: doc._id}, {$set: {online: false}})  : UserOnline.insert({userId: Meteor.userId(), online: false});
  },
  diskUsage: function() {
    //console.log('SizeOf:');
    var size = sizeof(Items.find({owner_id: Meteor.userId()}));
    //console.log(size);
    return size;
  },
  deleteContact: function(contactId) {
    if (Meteor.userId()) {
      Contacts.remove({owner_id: Meteor.userId(), userId: contactId});
      Contacts.remove({owner_id: contactId, userId: Meteor.userId()});
    }
  },
  changeLanguage: function(language) {
    if (Meteor.userId()) {
      Meteor.users.update({
        _id: this.userId
      }, {
        $set: {
          'profile.language': language
        }
      });
    }
  },
  changeEmail: function(address) {
    if (Meteor.userId()) {
      Meteor.users.update({
        _id: this.userId
      }, {
        $set: {
          'emails.0.address': address,
        }
      });
    }
  },
  finishSetup: function(val) {
    if (Meteor.userId()) {      
      Meteor.users.update({
        _id: this.userId
      }, {
        $set: {
          'profile.finishSetup': val,
        }
      });
    }
  },  
  removeAccount: function() {
    Items.remove({owner_id: Meteor.userId()});
    //Items.update({"$pull": { "shared_with" : Meteor.userId()}});
    DocKeys.remove({user_id: Meteor.userId()});
    DocKeys.remove({owner_id: Meteor.userId()});
    Contacts.remove({owner_id: Meteor.userId()});
    Contacts.remove({userId: Meteor.userId()});
    Notifications.remove({userId: Meteor.userId()});
    ShareRequests.remove({fromUserId: Meteor.userId()});
    ShareRequests.remove({toUserId: Meteor.userId()});
    Meteor.users.remove(Meteor.userId());
  },
  setProfileVar: function(variable, value) {
    var field = 'profile.' + variable;
    if (Meteor.userId()) {
      Meteor.users.update({
        _id: this.userId
      },
      {
        $set: {[field] : value}
      });
    }
  },
  setupSupport: function() {
    var cnt = Contacts.find({userId: Meteor.settings.public.supportUserId}).count();
    if (cnt < 1) {
      Contacts.insert({owner_id: Meteor.userId(), userId: Meteor.settings.public.supportUserId, status: 'Enabled', visible: false, displayName: 'Seravault Support'});
    }
  },
  initContacts: function() {
    if (this.userId) {
      var me = Contacts.findOne({owner_id: this.userId, userId: this.userId});
      if (!me) {
        var user = Meteor.users.findOne(this.userId);
        Contacts.insert({owner_id: this.userId, userId: this.userId, displayName: user.profile.displayName, 
          pubKey: user.profile.enc_publicKey, visible: false, status: 'Enabled'});
      }
    }
  },
  contactUs: function(name, email, message) {    
      Email.send({
      from: email,
      to: "admin@seravault.com",
      subject: name,
      text: message + "email: " + email
      });
      
  }
});
