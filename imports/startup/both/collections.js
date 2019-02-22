
Items = new Mongo.Collection('Items');
Items.attachSchema(Schema.Items);

Notes = new Mongo.Collection('Notes');
Notes.attachSchema(Schema.Notes);

Chats = new Mongo.Collection('Chats');
Chats.attachSchema(Schema.Chats);

Mail = new Mongo.Collection('Mail');
Mail.attachSchema(Schema.Mail);

Contacts = new Mongo.Collection('Contacts');
Contacts.attachSchema(Schema.Contacts);

Groups = new Mongo.Collection('Groups');
Groups.attachSchema(Schema.Groups);

Notifications = new Mongo.Collection('Notifications');
Notifications.attachSchema(Schema.Notifications);

Folders = new Mongo.Collection('Folders');
Folders.attachSchema(Schema.Folders);

ShareRequests = new Mongo.Collection('ShareRequests');
ShareRequests.attachSchema(Schema.ShareRequests);

Tags = new Mongo.Collection('Tags');
Tags.attachSchema(Schema.Tags);

Feedback = new Mongo.Collection('Feedback');
Feedback.attachSchema(Schema.Feedback);

BlogPosts = new Mongo.Collection('BlogPosts');
BlogPosts.attachSchema(Schema.BlogPosts);

//Meteor.users.attachSchema(Schema.User);

if (Meteor.isClient) {
  ItemsDecrypted = new Mongo.Collection(null);
  Tracker.autorun(function() {
    ItemsDecrypted.remove({});
    Items && Items.find().forEach(function(data) {
      var item = Items.findOne(data._id);
      ItemsDecrypted.insert(item);
    })
  });
}


if (Meteor.isClient) {
  GroupsDecrypted = new Mongo.Collection(null);
  Tracker.autorun(function() {
    GroupsDecrypted.remove({});
    Groups.find().forEach(function(data) {
      var group = Groups.findOne(data._id);
      GroupsDecrypted.insert(group);
    })
  })
}

if (Meteor.isClient) {
  ContactsDecrypted = new Mongo.Collection(null);
  Tracker.autorun(function() {
    ContactsDecrypted.remove({});
    Contacts.find().forEach(function(data) {
      var contact = Contacts.findOne(data._id);
      ContactsDecrypted.insert(contact);
    })
  })
}

