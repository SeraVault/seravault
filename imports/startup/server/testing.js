Meteor.methods({
  createTestUser: function(password) {
    var newUserId = Accounts.createUser({
      username: faker.internet.userName(),
      password: 'password',
      profile: {
        displayName: faker.name.firstName() + ' ' + faker.name.lastName()
      }
    })
    /*Meteor.users.insert({
      username: faker.internet.userName(),
      profile: {
        displayName: faker.name.firstName() + ' ' + faker.name.lastName()
      }
    });*/
    //Accounts.setPassword(newUserId, password);
    console.log(newUserId);
    return newUserId;
  },
  createContacts: function(num) {
    Meteor.users.find().forEach(function(data) {
      for (var i = 0; i < num; i++) {
        var array = Meteor.users.find().fetch();
        var randomIndex = Math.floor(Math.random() * array.length);
        var element = array[randomIndex];
        console.log('element id : ' + element['_id']);
        console.log(data._id);
        //make sure contact doesn't already exist before adding
        if (!Contacts.findOne({
            owner_id: data._id,
            userId: element['_id']
          })) {
          Contacts.insert({
            owner_id: data._id,
            userId: element['_id'],
            status: 'Enabled'
          });
        };
        if (!Contacts.findOne({
            owner_id: element['_id'],
            userId: data._id
          })) {
          Contacts.insert({
            owner_id: element['_id'],
            userId: data._id,
            status: 'Enabled'
          });
        };
      }
    })
  },
  storeKeysTest: function(userId, encryptedKey, publicKey, nonce, passwordBytes, sharingCode) {
    console.log('Storing keys for ' + userId);
    console.log('Encrypted key: ' + encryptedKey);
    console.log('publicKey : ' + publicKey);

    Meteor.users.update({
      _id: userId
    }, {
      $set: {
        'profile.enc_privateKey': encryptedKey,
        'profile.enc_publicKey': publicKey,
        'profile.enc_nonce': nonce,
        'profile.enc_passwordBytes': passwordBytes,
        'profile.sharing_code': sharingCode,
      }
    });
    return true;
  },
  getTestUsers: function() {
    console.log('Returning users...');
    var users = Meteor.users.find().fetch();
    return(users);
  }
});
