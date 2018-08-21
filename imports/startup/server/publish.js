Meteor.publish('Items', function() {  
  if (Roles.userIsInRole(this.userId, ['wheel'], 'global-group')) {
    return Items.find();
  } else {
    if (this.userId) {
      return Items.find({'keys.userId': this.userId});
    }
  }});

Meteor.publish('Chats', function() {
  if (this.userId) {
    return Chats.find({$or: [{owner_id: this.userId},{members: {$regex: ".*"+this.userId+".*"}}]});
  }
});

Meteor.publish('Mail', function() {
  if (this.userId) {
    return Mail.find({$or: [{owner_id: this.userId},{recipients: {$regex : ".*"+this.userId+".*"}}]})
  }
});

Meteor.publish('Contacts', function() {  
  if (Roles.userIsInRole(this.userId, ['wheel'], 'global-group')) {    
    Contacts.find().forEach(function(contact){
      var user = Meteor.users.findOne(contact.userId);
      //console.log(user);
      if (user) {
        Contacts.update({_id: contact._id}, {$set: {displayName: user && user.profile.displayName, 
                                                pubKey: user && user.profile.enc_publicKey}})
        } else {
          //Contacts.remove(contact._id);
        }
    });
    return Contacts.find();
  } else {
    if (this.userId) {
      return Contacts.find({owner_id: this.userId});    
    }
  }
});

Meteor.publish('Groups', function() {
  if (this.userId) {
    return Groups.find({owner_id: this.userId});
  }
});

Meteor.publish('Notifications', function() {
  if (this.userId) {
    return Notifications.find({userId: this.userId});
  }
});

Meteor.publish('Tags', function() {
  if (this.userId) {
    return Tags.find({owner_id: this.userId});
  }
});

Meteor.publish('Folders', function() {
  if (this.userId) {
    return Folders.find({owner_id: this.userId});
    //return Folders.find();
  }
});

Meteor.publish('ShareRequests', function() {
  if (this.userId) {
    return ShareRequests.find({$or: [{fromUserId: this.userId}, {toUserId: this.userId}]});
  }
});

