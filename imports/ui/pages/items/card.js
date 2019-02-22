import './card.html';

Template.App_items_card.onCreated(function() {
    this.data.hidePassword = new ReactiveVar(true);
});

Template.App_items_card.helpers({
  isShared: function(id) {
    //console.log(id, ItemsDecrypted && ItemsDecrypted.findOne(id).keys.length);
    return ItemsDecrypted && ItemsDecrypted.findOne(id).keys.length > 1;  //automatically shared to owner
  },
  notDocOwner: function(userId) {
    return userId != Meteor.userId();
  },
  docOwner: function(userId) {
    return Contacts.findOne({userId: userId}) && Contacts.findOne({userId: userId}).displayName;
  },
  passwordToggle: function(id) {
    if (Session.get('showPassword_' + id)) {
      return this.password;
    }
    return '*********';
  },
  keyToggle: function(id) {
    if (Session.get('showKey_' + id)) {
      return this.private_key;
    }
    return '*********';
  },
  securityCodeToggle: function(id) {
    if (Session.get('showSecurityCode_' + id)) {
      return this.security_code;
    }
    return '***';
  },
  passwordToggleState: function(id) {
    if (Session.get('showPassword_' + id)) {
        return 'mdi-eye';
    }
    return 'mdi-eye-off';
  },
  keyToggleState: function(id) {
    if (Session.get('showKey_' + id)) {
        return 'mdi-eye';
    }
    return 'mdi-eye-off';
  },
  securityCodeToggleState: function(id) {
    if (Session.get('showSecurityCode_' + id)) {
        return 'mdi-eye';
    }
    return 'mdi-eye-off';
  },  
  cardParams: function() {
    getCardParams(this.type)
  },
  numOfChildren: function() {
    if (this.related) {
      return this.related.length;
    } else {
      return 0;
    } 
  },
  fileInfo: function(id) {
    return Files.findOne(id);
  },
  itemName: function(id) {
    return ItemsDecrypted.findOne(id) && ItemsDecrypted.findOne(id).title;
  },
  getFileName: function(id) {
    var file = Files.findOne(id);    
    if (file) {
      return file.name;
    }
  },
  getFileSize: function(id) {
    var file = Files && Files.findOne(id);
    if (file) {
      return bytesToSize(file.size);
    }
  }
});

Template.App_items_card.events({
  'click .passwordToggle': function(event, template) {
    var id = event.currentTarget.getAttribute("data-id");
    Session.set('showPassword_' + id, !Session.get('showPassword_' + id));
  },
  'click .keyToggle': function(event, template) {
    var id = event.currentTarget.getAttribute("data-id");
    Session.set('showKey_' + id, !Session.get('showKey_' + id));
  },
  'click .securityCodeToggle': function(event, template) {
    var id = event.currentTarget.getAttribute("data-id");
    Session.set('showSecurityCode_' + id, !Session.get('showSecurityCode_' + id));
  },  
  'click .open': function(event) {
    Session.set('item_id', event.currentTarget.getAttribute("data-id"));    
    FlowRouter.go('App.item.view', {id: event.currentTarget.getAttribute("data-id")});
  },
  'click .open-or-drag': function(event) {
    Session.set('item_id', event.currentTarget.getAttribute("data-id"));
    FlowRouter.go('App.item.view', {id: event.currentTarget.getAttribute("data-id")});
  },
  'click .open-folder': function(event) {
    Session.set('type', null);
    Session.set('search_folder', event.currentTarget.getAttribute("data-id"));
    FlowRouter.go('App.items');
  },
  'click .open-user': function(event) {
    /*Session.set('type', null);
    Session.set('search_folder', null);
    Session.set('search_userid', event.currentTarget.getAttribute("data-id"));
    FlowRouter.go('App.items')*/
  },
  'click .delete': function (event) {
    var type = event.currentTarget.getAttribute("data-type");
    var id = event.currentTarget.getAttribute("data-id");
    var title = event.currentTarget.getAttribute("data-title")
    Session.set('var-id', id);
    var modalData = {
      modalIcon: 'mdi-delete',
      modalButton: 'btn-danger',
      modalAction: TAPi18n.__('Delete'),
      modalActionTarget: title,
      modalMessage: TAPi18n.__("areYouSureDelete"),
      modalMessageTarget: TAPi18n.__(type) + "?",
      modalYesButtonText: TAPi18n.__("Delete"),
      modalShowCancelButton: true,
      callback: function(result) {
        if (result == true) {
          var id = Session.get('var-id');
          var item = Items.findOne(id);
          if (item.owner_id === Meteor.userId()) {
            Items.remove(id);
          } else {            
            var recipients = item.recipients.filter(item => item !== Meteor.userId());
            //var recipients = item.recipients.pop(Meteor.userId());
            Items.update(id, {$set: {recipients: recipients, }});
          }
          toastr.success(TAPi18n.__("thisDeleted"), TAPi18n.__(type).toUpperCase());
        }
      }
    };
    Modal.show('App_generic_modal', modalData);
    //Session.set('item_id', id);
    //Modal.show('App_items_delete');
  },
  'click .share': function(event) {
    var id = event.currentTarget.getAttribute("data-id");
    Session.set('goToShare', true);
    FlowRouter.go("App.edit", {id: id});
  },
  'click .copyPassword': function(event) {
    toastr.success(TAPi18n.__("passwordCopiedToClipboard"))
    //using zenorocha:clipboard.  See onRendered event
  },
  'click .copyPrivateKey': function(event) {
    toastr.success(TAPi18n.__("keyCopiedToClipboard"))
    //using zenorocha:clipboard.  See onRendered event
  },
  'dragstart .open-or-drag': function(event) {
    //event.preventDefault();
    Session.set('item_id', event.currentTarget.getAttribute("data-id"));
    //event.currentTarget.dataTransfer.setData("item_id", event.currentTarget.getAttribute("data-id"));
  },
  'click .download': function(event) {
    var fileId = event.currentTarget.getAttribute("data-id");
    var file = Files.findOne(fileId);
    decryptDownloadFile(file);
  }
});

Template.App_items_card.onRendered(function() {
  $('.modal').modal();
  new Clipboard('.copyPassword');
});

Template.App_items_card.resized = function() {

}
