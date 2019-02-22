/* SECURITY FOR COLLECTIONS*/
Items.allow({
    insert: function(userId, doc) {
        // only allow posting if you are logged in
        return !!userId;
    },
    update: function(userId, doc) {
        // only allow updating if you are logged in
        return !!userId; //doc.owner_id === Meteor.userId();
    },
    remove: function(userId, doc) {
        //only allow deleting if you are owner
        if (Roles.userIsInRole(this.userId, ['wheel'], 'global-group')) {
            return true;
        }
        return doc.owner_id === userId;
    }
});

Feedback.allow({
  insert: function() {
    return true;
  }
});

Groups.allow({
    insert: function(userId, doc) {
        // only allow posting if you are logged in
        return !!userId;
    },
    update: function(userId, doc) {
        // only allow updating if you are logged in
        return !!userId;
    },
    remove: function(userID, doc) {
        //only allow deleting if you are owner
        return doc.owner_id === Meteor.userId();
    }
});

ShareRequests.allow({
  remove: function(userId, doc) {
    return doc.fromUserId === Meteor.userId() || doc.toUserId === Meteor.userId();
  }
});

Contacts.allow({
  insert: function(userId, doc) {
    return true;
  },
  update: function(userId, doc) {
    return doc.owner_id === Meteor.userId();
  },
  remove: function(userId, doc) {
    return doc.owner_id === Meteor.userId();
  }
});

Notifications.allow({
  remove: function(userId, doc) {
    return doc.userId === Meteor.userId();
  }
});

BlogPosts.allow( {
    insert: function(userId, doc) {        
        if (Roles.userIsInRole(userId, ['blogAuthor'], 'global-group')) {
            return true;
        }
    },
    update: function(userId, doc) {
        if (Roles.userIsInRole(userId, ['blogAuthor'], 'global-group')) {
            return true;
        }
    },
    remove: function(userId, doc) {
        if (Roles.userIsInRole(userId, ['blogAuthor'], 'global-group')) {
            return true;
        }
    },    
})



/*Files.allow({
  insert: function(userId, doc) {
      // only allow posting if you are logged in
      return true; //!!userId;
  },
  update: function(userId, doc) {
      // only allow updating if you are logged in
      return true //!!userId;
  },
  remove: function(userID, doc) {
      //only allow deleting if you are owner
      return true ///doc.submittedById === Meteor.userId();
  },
  download: function(userId, fileObj) {
		return true

  },
});*/
