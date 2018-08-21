Meteor.methods({
  storeKeys: function (encryptedKey, publicKey, nonce, passwordBytes, sharingCode, plan, language, displayName) {
    var diskSize = 0;
    switch(plan) {
      case 'free':
      diskSize = 536870912;  // 0.5 gigabyte
      break;
    };
    Meteor.users.update({
      _id: this.userId
    }, {
      $set: {
        'profile.enc_privateKey': encryptedKey,
        'profile.enc_publicKey': publicKey,
        'profile.enc_nonce': nonce,
        'profile.enc_passwordBytes': passwordBytes,
        'profile.sharing_code': sharingCode,
        'profile.disk_size': diskSize,
        'profile.language': language,
        'profile.displayName': displayName
      }
    });
  },
  updatePrivateKey: function(privateKey, passwordBytes, nonce) {
    Meteor.users.update({_id: this.userId}, {
      $set: {
        'profile.enc_privateKey': privateKey,
        'profile.enc_nonce': nonce,
        'profile.enc_passwordBytes': passwordBytes,
      }
    })
  },
  checkSharingCode: function(code) {
    if (Meteor.users.find({'profile.sharing_code': code}).count() > 0) {
      return false
    }
    return true;
  },
  initSchema: function (collectionName, addOwner) {
    var collection = Mongo.Collection.get(collectionName),
    currentSchema = {};
    // check if the collection already has a schema
    if (_.isFunction(collection.simpleSchema)) {
      currentSchema = collection.simpleSchema()._schema;
    }
    // check if the existing schema already defines a the field
    /*if (!!currentSchema.encrypted) {
      return
    }*/
    // add fields to the collection schema
    collection.attachSchema(SchemaKeys);

    if (addOwner) {
      collection.attachSchema(SchemaCollectionFields);
    } else {
      collection.attachSchema(SchemaCollectionFieldsNoOwner);
    }
  },
  getUserId: function(userName) {
    return Meteor.users.findOne({username: userName})._id;
  },
  getUserPubKey: function(userId) {
    var user = Meteor.users.findOne(userId);
    return user.profile.enc_publicKey;
  },
  isDocSharedWithUser: function(userId, docId) {
    if (DocKeys.find({user_id: userId, doc_id: docId}).count() > 0 ) {
      return true;
    } else {
      return false;
    }
  },
  getDocSharedWithUsers: function(docId) {
    if (this.userId) {
      //make sure the this is being requested by the owner of the doc
      var docCount = DocKeys.find({doc_id: docId, owner_id: this.userId, user_id: this.userId}).count();
      if (docCount > 0) {
        var collection;
        var contacts = [];
        DocKeys.find({doc_id: docId}).forEach(function(data){
          collection = data.collection;
          contacts.push(data.user_id);
        });
        return contacts;
      }
    }
  },
  removeDocSharedWithUsers: function(docId) {
    if (this.userId) {
      DocKeys.remove({doc_id: docId, user_id: {$ne: this.userId}});
      Items.update({_id: docId}, {$set: {shared_with: null}});
      //make sure the this is being requested by the owner of the doc
      //var docCount = DocKeys.find({doc_id: docId, owner_id: this.userId}).count();
      //if (docCount > 0) {
        //remove all user keys except for owner
        //var users = [];
        //if (userIds) {users.push(userIds)};
        //users.push(this.userId);
        //DocKeys.remove({doc_id: docId, user_id: {$neq: meteor.userId}})
      }
  },
  changeDisplayName: function(displayName) {
    Meteor.users.update({_id: this.userId}, {
      $set: {
        'profile.displayName': displayName
      }
    });
  },
  /*unShareDoc: function(docId) {
    if (this.userId) {
      Items.update(docId, {$pull: {shared_with: this.userId}});
      DocKeys.remove({doc_id: docId, user_id: this.userId});
    }
  }*/
})

Meteor.publish('DocKeys', function() {
  if (Roles.userIsInRole(this.userId, ['wheel'], 'global-group')) {
    return DocKeys.find();
  }
  else {
    return DocKeys.find({'user_id': this.userId});
  }
});
