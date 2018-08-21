import './add-button.html';

Template.addButton.helpers({
  getCurrentAddPath: function() {
    var route = FlowRouter.getRouteName();
    switch(route) {
      case 'App.notes':
        return FlowRouter.path("App.item.add", {type:'note'});
      case 'App.accounts':
        return FlowRouter.path("App.item.add", {type:'account'});
      case 'App.keys':
        return FlowRouter.path("App.item.add", {type:'key'});
      case 'App.chats':
        return FlowRouter.path("App.chats.new");
      case 'App.messages':
        return FlowRouter.path("App.item.add", {type:'message'});
      case 'App.contacts':
        return FlowRouter.path("App.contacts.invite");
      case 'App.contacts.manage':
        return FlowRouter.path("App.contacts.invite");
      case 'App.folders':
        return FlowRouter.path("App.item.add", {type:'folder'});
      case 'App.help':
        return FlowRouter.path("App.item.add", {type:'help'});
    }
    return null;
  },
  getCurrentAddType: function() {
    var route= FlowRouter.getRouteName();
    switch(route) {
      case 'App.notes':
        return TAPi18n.__('NewNote')
      case 'App.accounts':
        return TAPi18n.__('NewAccount');
      case 'App.keys':
        return TAPi18n.__('NewKey')
      case 'App.messages':
        return TAPi18n.__('NewMail');
      case 'App.contacts':
        return TAPi18n.__('NewContact');
      case 'App.contacts.manage':
        return TAPi18n.__('NewContact');
      case 'App.folders':
        return TAPi18n.__('NewFolder');
      case 'App.help':
        return TAPi18n.__('NewHelpRequest')
    }
    return TAPi18n.__('AddItem');
  },

})
