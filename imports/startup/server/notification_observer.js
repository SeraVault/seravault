sendNewItemUpdateEmail = function (fromUserId, toUserId, doc) {
  var toUser = Meteor.users.findOne({_id: toUserId});
  var fromUser = Meteor.users.findOne({_id: fromUserId});
  //console.log('fromUser:', fromUser);
  //console.log('toUser:', toUser);
  //console.log('fromUserId:', fromUserId);
  //console.log('toUserId:', toUserId);
  var lang = toUser.profile.language;
  var displayName = fromUser.profile.displayName;
  var email = toUser.emails[0].address;
  //console.log('sendNewItemEmail');
  var subject = displayName + " " + TAPi18n.__("hasSharedAnItem", null, lang);
  var staticMessage = "<h4>" + displayName + " " + TAPi18n.__("hasSharedAnItem", null, lang) + "</h4></br>" +
    " <a href='https://www.seravault.com/login'>" + TAPi18n.__("clickHere", null, lang) + "</a></br></br>";

  var message = "";
  var footer = "<img src='https://www.seravault.com/img/seravault_logo.png'><br><b>" + TAPi18n.__("tagLine", null, lang) + "</b>";
  message = staticMessage + "<br><br>" + footer;
  Meteor.defer(() => {
    Email.send({
      from: Meteor.settings.private.emailNotificationAddress,
      to: email,
      subject: subject,
      html: message
    });
  })
};

Items.after.insert(function (userId, doc) {
  doc.keys.forEach(function (key) {
    if (key.userId != userId) {
      Notifications.insert({
        userId: key.userId,
        fromId: doc.owner_id,
        message: "NewItemShared",
        link: '/app/item/' + doc._id + '/view',
        icon: 'share',
        objectId: doc._id
      });
      sendNewItemUpdateEmail(userId, key.userId, doc);

    }
  });
});

Items.after.update(function (userId, doc) {
  var keys = doc.keys;  
  if (keys) {
    keys.forEach(function (key) {
      if (userId != key.userId) {
        Notifications.insert({
          userId: key.userId,
          fromId: userId,
          message: 'ItemUpdated',
          link: '/app/item/' + doc._id + '/view',
          icon: 'update',
          objectId: doc._id
        });
        sendNewItemUpdateEmail(userId, key.userId, doc);
      }
    });
  }
});