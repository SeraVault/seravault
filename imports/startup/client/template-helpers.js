getDisplayName = function (id) {
  if (id == null) {
    return "SeraVault"
  };
  var existingContact = Contacts.findOne({
    userId: id
  });
  if (existingContact) {
    return existingContact.displayName;
  }
  var userInfo = ReactiveMethod.call('userInfo', id);
  return userInfo && userInfo.profile.displayName;
};

getMyDisplayName = function () {
  return Meteor.user() && Meteor.user().profile.displayName;
};

getDisplayNameAbbr = function (id) {
  if (id == null) {
    return "SV"
  }
  var display = getDisplayName(id);
  return display && display.substring(0, 1);
}

getMyDisplayNameAbbr = function () {
  return Meteor.user() && Meteor.user().profile.displayName.substring(0, 1);
}

getTypeIcon = function (type) {
  var icon = null;
  switch (type) {
    case "account":
      icon = 'mdi-account';
      break;
    case "note":
      icon = 'mdi-file-text';
      break;
    case "key":
      icon = 'mdi-key';
      break;
    case "file":
      icon = 'mdi-file';
      break;
    case "folder":
      icon = 'mdi-folder';
      break;
    case "folderAll":
      icon = 'mdi-collection-folder-image';
      break;
    case "message":
      icon = 'mdi-comments';
      break;
    case "help":
      icon = 'mdi-pin-help';
      break;
    case "contacts":
      icon = 'mdi-accounts-list';
      break;
    case "sharing":
      icon = "mdi-share";
      break;
    case "storage":
      icon = "mdi-storage";
      break;
    case "allItems":
      icon = "mdi-folder-star-alt";
      break;
    case "profile":
      icon = "mdi-face";
  }
  return icon;
};

Template.registerHelper('getCollaborators', (id) => {
  var collaborators = "";
  Items && Items.findOne(id).recipients.forEach(function(userId){
    collaborators = collaborators + getDisplayName(userId) + "; ";
  });
  return collaborators;
});

Template.registerHelper('isSearchVisible', () => {
  return Session.get('searchIconVisible');
});

Template.registerHelper('getDisplayName', (id) => {
  return getDisplayName(id);
});

Template.registerHelper('getDisplayNameAbbr', (id) => {
  return getDisplayNameAbbr(id);
});

Template.registerHelper('getMyDisplayNameAbbr', () => {
  return getMyDisplayNameAbbr();
});

Template.registerHelper('getMyDisplayName', () => {
  return Meteor.user() && Meteor.user().profile.displayName;
})

Template.registerHelper('getCalendarDate', (date) => {
  return moment(date).calendar();
});

Template.registerHelper('getPageTitle', function () {
  return Session.get('pageTitle');
});

Template.registerHelper('getCopyright', () => {
  return "&copy; " + new Date().getFullYear() + " Seravault. All Rights Reserved.";
});

Template.registerHelper('isDocOwner', (userId) => {
  return userId == Meteor.userId();
});

Template.registerHelper('getPlanUsage', function () {
  var itemCount = Items && Items.find().count();
  var planCount = plan() && plan().items;
  return Math.ceil((itemCount / planCount) * 100);
});

Template.registerHelper('getDiskUsage', function() {
  var diskTotal = 0;
  var planDisk = plan() && plan().disk;
  Files.find().forEach(function(data){
    diskTotal = diskTotal + data.size;
  });
  return Math.ceil((diskTotal / planDisk) * 100);
});

Template.registerHelper('getAvatar', function (id, width) {
    var name = getDisplayName(id);
    var img = {};
    width = width || 60;
    //console.log('width', width);
    img.width = width;
    img.height = width;
    img.class = "avatar-round";
    img.src = LetterAvatar(name, width);
    return img;
  }),

  Template.registerHelper('getMyAvatar', function (width) {
    var name = Meteor.user() && Meteor.user().profile.displayName;
    var img = {};
    var width = width || 60;
    img.width = width;
    img.height = width;
    img.class = "avatar-round";
    img.src = LetterAvatar(name, img.width)
    return img;
  });

Template.registerHelper('equals', (a, b) => {
  return (a == b);
});

Template.registerHelper('getCardParams', (type) => {
  return getCardParams(type);
});

Template.registerHelper('getTypeIcon', (type) => {
  return getTypeIcon(type);
});

Template.registerHelper('getTypeIconFullHTML', (type) => {
  var icon = getTypeIcon(type);
  //console.log(icon);
  return "<span class='icon mdi " + icon + "'></span>";
});

Template.registerHelper('isCordova', function () {
  return Meteor.isCordova;
});

Template.registerHelper('getTypeColor', (type) => {
  var color = null;

  //dark: 51ffdc-89f3ff-adcbff-dcbaff-fffbaa
  //light: bffff2-d4faff-d9e6ff-efdfff-fffce0
  switch (type) {
    case "account":
      color = "#51ffdc";
      break;
    case "note":
      color = "#89f3ff";
      break;
    case "key":
      color = "#adcbff";
      break;
    case "folder":
      color = "	#dcbaff";
      break;
    case "message":
      color = "	#fffbaa";
      break;
  }
  return color;
})

Template.registerHelper('getTypeColorLight', (type) => {
  var color = null;

  //dark: 51ffdc-89f3ff-adcbff-dcbaff-fffbaa
  //light: bffff2-d4faff-d9e6ff-efdfff-fffce0
  switch (type) {
    case "account":
      color = "#bffff2";
      break;
    case "note":
      color = "#d4faff";
      break;
    case "key":
      color = "#d9e6ff";
      break;
    case "folder":
      color = "	#efdfff";
      break;
    case "message":
      color = "	#fffce0";
      break;
  }
  return color;
});

Template.registerHelper('showSpinner', function() {
  return Session.get('showSpinner');
});