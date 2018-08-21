import './header.html';



Template.App_ui_header.helpers({
  notifications: function() {
    var notificationSummary = [];
    var distinctNotifications = _.uniq(Notifications.find({}, {
      sort: {link: 1}, fields: {link: true, fromId: true}
    }).fetch().map(function(x) {
      return x.link;
    }), true);
    //console.log("distinctNotifications", distinctNotifications);
    distinctNotifications.forEach(function(link){
      var maxIt;
      var createdAt = new Date('1/1/1900');
      Notifications.find({link: link}).fetch().forEach(function(loopIt) {
        //console.log("loopIt", loopIt);
        if (loopIt.createdAt > createdAt) {
          maxIt = loopIt._id;
          //console.log('loopIt._id', loopIt._id);
        }        
      })
      //console.log('maxIt', maxIt);
      notificationSummary.push(Notifications.findOne(maxIt));
    });
    return notificationSummary;
  },
  notificationCount: function() {
    var distinctNotifications = _.uniq(Notifications.find({}, {
      sort: {link: 1}, fields: {link: true, fromId: true}
    }).fetch().map(function(x) {
      return x.link;
    }), true);

    return Notifications && distinctNotifications.length;
  },
  hasNotifications: function() {
    return Notifications && Notifications.find().count() > 0;
  },
  translate: function(msg) {
    var item = Items && Items.findOne(msg.objectId);
    var user = Contacts && Contacts.findOne({userId: msg.fromId});
    //console.log(msg);
    switch(msg.message) {
      case 'NewItemShared':
        return TAPi18n.__(msg.message, { postProcess: 'sprintf', sprintf: [item.title, item.type, user.displayName]});        
      case 'ItemUpdated':
        return TAPi18n.__(msg.message, { postProcess: 'sprintf', sprintf: [item.title, item.type, user.displayName]});
      case 'NewSharingRequest':
        return TAPi18n.__(msg.message, { postProcess: 'sprintf', sprintf: [msg.data.displayName]});
      case 'InvitationAccepted':
        return TAPi18n.__(msg.message, { postProcess: 'sprintf', sprintf: [msg.data.displayName]});
      default:
        return TAPi18n.__(msg.message);
    }
  
  },
  sortDirection: function() {
    var sortDirection = Meteor.user() && Meteor.user().profile && Meteor.user().profile.sort_direction;
    if (!sortDirection) {
      Meteor.users.update(Meteor.userId(), {$set: {'profile.sort_direction': 1}});
    }
    return sortDirection;
  },
  sortTypeSelected: function(id) {
    var sortType = Meteor.user() && Meteor.user().profile && Meteor.user().profile.sort_type;
    if (!sortType) {
      Meteor.users.update(Meteor.userId(), {$set: {'profile.sort_type': "modified"}});
      sortType = "modified";
    }
    if (sortType == id) {
      return "selected"
    }
  },
  typeSelected: function(id) {
    var type = Session.get('type');
    if (type == id) {
      return "selected";
    }
  },
  sortIcon: function() {
    var direction = Meteor.user() && Meteor.user().profile && Meteor.user().profile.sort_direction;
    if (direction == 1) {
      return 'mdi-sort-amount-asc'
    } else {
      return 'mdi-sort-amount-desc'
    }
  },
  getSearchTerm: function() {
    return Session.get('search_term');
  },
  searchIconVisible: function() {
    return Session.get('searchIconVisible');
  },
  getTypeIcon: function() {
    return Session.get('typeIcon');
  }

})

Template.App_ui_header.events({
  'click .logout': function(event) {
    Meteor.logout();
    Session.clear();
    FlowRouter.go("App.login");
  },
  'click .notification': function(event) {
    var id = event.currentTarget.getAttribute("data-id");
    //remove other notications that are for this item/object
    Notifications.find({objectId: id}).forEach(function(data) {
      Notifications.remove(data._id);
    })
  },
  'click .exit-app': function() {
    //for Cordova only
    Meteor.logout();
    Session.clear();
    navigator.app.exitApp();
  },
  'keyup #search': function(event, template) {
    Session.set('search_term', $("input[id=search]").val());
  },
  'click .sort-direction' : function() {
    var sortDirection = Meteor.user().profile.sort_direction;
    if (sortDirection == 1) {
      //Session.set('sort_direction', -1);}
      Meteor.users.update(Meteor.userId(), {$set: {'profile.sort_direction': -1}});
    }
    else {
      Meteor.users.update(Meteor.userId(), {$set: {'profile.sort_direction': 1}});
      //Session.set('sort_direction', 1)
    }
  },
  'change .sort-type': function() {
    //Session.set('sort_type', $(".sort-type").val())
    Meteor.users.update(Meteor.userId(), {$set: {'profile.sort_type': $(".sort-type").val()}});
  },
  'change .type': function() {
    var type = $(".type").val();
    switch(type) {
      case 'note':
        return FlowRouter.go("App.notes");
      case 'account':
        return FlowRouter.go("App.accounts");
      case 'key':
        return FlowRouter.go("App.keys");
      case 'message':
        return FlowRouter.go("App.messages");
      case 'App.contacts':
        return FlowRouter.go("App.contacts.invite");
      case 'folder':
        return FlowRouter.go("App.folders");
      case '':
        return FlowRouter.go("App.all");
    }
  },
  'click .clear-search': function() {
    Session.set('search_term', null);
  },  
  'click .close-all-notifications': function() {
    Notifications.find().forEach(function(data) {
      Notifications.remove({_id: data._id});
    });
  }
});

Template.App_ui_header.onRendered(function() {
  //LetterAvatar.transform();
})
