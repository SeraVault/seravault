import './add.html';

Template.App_items_add.helpers({
  equals: function (a, b) {
    return (a == b);
  },
  itemType: function() {
    return FlowRouter.getParam('type');
  },
  itemTypeText: function() {
    return TAPi18n.__(FlowRouter.getParam('type'))
  }

});

var hooksObject = {
  before: {
    insert: function(doc) {
      var count = Items.find().count({$ne: {help: true}});
      if (count > plan().items) {
        toastr.error(TAPi18n.__("exceededLimit"));
        return false;
      }
      //if (roughSizeOfObjectInMB(doc) > 5) {toastr.error(TAPi18n.__("ItemTooLarge")); return false};

      doc.type = FlowRouter.getParam('type');
      if (doc.type == 'help') {
        doc.recipients = [Meteor.settings.public.supportUserId]
      }
      if (doc.type == 'message' || doc.type == 'help') {
        //console.log('its a message!')
        var message = $('#message').val();
        //console.log("message", message);
        if (message) {
          //console.log(message)
          doc.message = [{body: message}];
          //console.log(doc);
        }
      }
      console.log(doc);
      return doc;
    }
  },
  onSuccess: function (formType, result) {
    toastr.success(TAPi18n.__('encryptedAndSaved'));
    var type = FlowRouter.getParam('type');
    //console.log('onSuccess');
    //console.log(type);
    var docId = result;

    switch(type) {
      case "help":
        //console.log('it is help!')
        FlowRouter.go("App.help");
        break;
      case "message":
        FlowRouter.go('App.edit', {id: docId})
        break;
      default:
        FlowRouter.go("App." + type + "s");
    }
  },
  onError: function(err, message) {
    toastr.error(message);
  }
};

AutoForm.hooks({
  insertItem: hooksObject
});

Template.App_items_add.created = function(){
  Session.set('item_id', null);  
  Session.set('docKeys', null);
  $(window).on("beforeunload", function() {
    toastr.error('onbeforeunload hit!');
  });
};

Template.App_items_add.events({
  'click .cancel': function() {
    history.back();
    //FlowRouter.go(Session.get('lastRoute'));     
  },
});
