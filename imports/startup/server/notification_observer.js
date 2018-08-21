Items.after.insert(function(userId, doc){
  doc.keys.forEach(function(key){
    if (key.userId != userId) {
      Notifications.insert({userId: key.userId, fromId: doc.owner_id, message: "NewItemShared", link: '/app/item/' + doc._id + '/view', icon: 'share', objectId: doc._id});
    }
  });
});

Items.after.update(function(userId, doc) {
  var keys = doc.keys;
  var editor = Meteor.users.findOne(userId).profile;
  if (keys) {
    keys.forEach(function(data) {
      if (userId != data.userId) {
        Notifications.insert({userId: data.userId, fromId: userId, message: 'ItemUpdated', link: '/app/item/' + doc._id + '/view', icon: 'update', objectId: doc._id});
      }
    });
  }
});
