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
      icon = 'mdi-download';
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
      icon = "mdi-lock-open";
      break;
    case "profile":
      icon = "mdi-face";
      break;
    case "credit_card":
      icon = "mdi-card";
      break;
  }
  return icon;
};

getTypeColor = function(type) {
  var color = null;

  var lightGreenishBlue = "#55efc4";
  var fadedPoster = "#81ecec";
  var greenDarnerTrail = "#74b9ff";
  var shyMoment = "#a29bfe";
  var cityLights = "#dfe6e9";
  var mintLeaf = "#00b894";
  var robinEggBlue = "#00cec9";
  var electronBlue = "#0984e3";
  var exodusFruit = "#6c5ce7";
  var soothingBreeze = "#b2bec3";
  var sourLemon = "#ffeaa7";
  var firstDate = "#fab1a0";
  var pinkGlamour = "#ff7675";
  var piko8Pink = "#fd79a8";
  var americanRiver = "#636e72";
  var brightYarrow = "#fdcb6e";
  var orangeVille = "#e17055";
  var chiGong = "#d63031";
  var prunusAviaum = "#e84393";
  var draculaOrchid = "#2d3436";

  switch (type) {
    case "account":
      color = lightGreenishBlue;
      break;
    case "note":
      color = shyMoment;
      break;
    case "key":
      color = electronBlue;
      break;
    case "folder":
      color = exodusFruit;
      break;
    case "message":
      color = sourLemon;
      break;
    case "credit_card":
      color = pinkGlamour;
      break;
    case "file":
      color = americanRiver;
      break;
    case "sharing":
      color = greenDarnerTrail;
      break;
    case "multifactor":
      color = mintLeaf;
      break;
    case "silver": 
      color= soothingBreeze;
      break;
    case "gold": 
      color = brightYarrow;
      break;
  }
  return color;
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
  var itemCount = Items && Items.find({owner_id: Meteor.userId()}).count();
  var planCount = plan() && plan().items;
  return Math.ceil((itemCount / planCount) * 100);
});

Template.registerHelper('getDiskUsage', function() {
  var diskTotal = 0;
  var planDisk = plan() && plan().disk;
  Files.find({userId: Meteor.userId()}).forEach(function(data){
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
  return getTypeColor(type);
});

Template.registerHelper('getSaturatedColor', function(type, saturationPercent) {
  var color = getTypeColor(type);
  var backColor = applySaturationToHexColor(color, saturationPercent);
  return backColor;
});

Template.registerHelper('getTypeFontColor', function(type) {
  var color = getTypeColor(type);
  var fontColor = hexContrast(color);
  console.log('fontcolor:', fontColor);
  return fontColor;
})

Template.registerHelper('noContacts', () => {
  return Contacts.find().count() == 1;  //each user has themself as a contact
});

Template.registerHelper('sharingCode', () => {
  return Meteor.user() && Meteor.user().profile.sharing_code;  //each user has themself as a contact
});

Template.registerHelper('showSpinner', function() {
  return Session.get('showSpinner');
});