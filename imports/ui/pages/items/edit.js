import './edit.html';

Template.App_items_edit.helpers({
  record: function() {
    notification = Notifications.findOne({objectId: FlowRouter.getParam('id')});
    notification && Notifications.remove(notification._id);
    Session.set('item_id', FlowRouter.getParam('id'));
    return Items.findOne(FlowRouter.getParam('id'));
  },
  isMessageOrHelp: function() {
    var record = Items.findOne(FlowRouter.getParam('id'));
    if (record && record.type) {
      return (record.type == 'message' || record.type == 'help');
    }
  },
  isDocOwner: function() {
    var record = Items.findOne(FlowRouter.getParam('id'));
    if (record && record.owner_id) {
      return (record.owner_id == Meteor.userId());
    }
  }

});

var hooksObject = {
  before: {
    // Replace `formType` with the form `type` attribute to which this hook applies
    update: function(doc) {
      //if (roughSizeOfObjectInMB(doc) > 5) {toastr.error(TAPi18n.__("ItemTooLarge")); return false};

      var record = Items.findOne(FlowRouter.getParam('id'));
      if (record.type == 'message' || record.type == 'help') {
        var clean = $("#editItems").parsley().validate();        
        if (clean) {
          var message = $('#message').val();
          var newMessage = [];
          var oldMessage = record.message;
          if (oldMessage) {
            oldMessage.forEach(function(data) {
              newMessage.push({body: data.body, createdAt: data.createdAt, from: data.from})
            });
          }
          newMessage.push({body: message, createdAt: new Date(), from: Meteor.userId()});
          doc.$set.message = newMessage;
        } else {
          return false;
        }
      }
      return doc;// (synchronous)
    }
  },
  onSuccess: function () {
    toastr.success(TAPi18n.__('encryptedAndSaved'));
    //console.log(Session.get('var-send'));
    if (Session.get('var-send')) {
      Session.set('var-send', false);
      $('#message').val("");
    } else {
      var route = "App." + this.currentDoc.type + "s";
      FlowRouter.go(route);
    }
  },
  onError: function(err, message) {
    //console.log(err);
    //console.log(message);
    toastr.error(message.reason);
  }
};

AutoForm.hooks({
  editItems: hooksObject
});

Template.App_items_edit.events({
  'click .send': function() {
    Session.set('var-send', true);
    $('editItems').submit();
  },
  'click .cancel': function() {
    history.back();
    //FlowRouter.go(Session.get('lastRoute'));
  }
});

Template.App_items_edit.onRendered(function() {
  if (Session.get('goToShare')) {
    Session.set('goToShare', false);
    $('html, body').animate({
      scrollTop: ($('#share').first().offset().top)
    },300);
    //document.location = '#share';
  } else {
    $(window).scrollTop(0);  //scroll to top
  }       
});
