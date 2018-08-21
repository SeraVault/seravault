import './view.html';

Template.App_items_view.helpers({
  record: function() {
    //notification = Notifications.findOne({objectId: FlowRouter.getParam('id')});
    //notification && Notifications.remove(notification._id);
    return Items.findOne(FlowRouter.getParam('id'));
  },
  getRelatedItem: function(id) {
    return ItemsDecrypted && ItemsDecrypted.findOne(id);
  },
  getFileName: function(id) {
    return Files.findOne(id).name;
  },
  getFileSize: function(id) {
    return bytesToSize(Files && Files.findOne(id).size);
  },
});

Template.App_items_view.events( {
  
  'click .cancel': function() {
    FlowRouter.go(Session.get('lastRoute'));
  },
  'click .share': function(event) {
    var id = event.currentTarget.getAttribute("data-id");
    Session.set('goToShare', true);
    FlowRouter.go("App.edit", {id: id});
  },
  'click .delete': function (event) {
    var type = event.currentTarget.getAttribute("data-type");
    var id = event.currentTarget.getAttribute("data-id");
    var modalData = {
      modalIcon: 'delete_forever',
      modalButton: 'btn-danger',
      modalAction: TAPi18n.__('Delete'),
      modalActionTarget: event.currentTarget.getAttribute("data-title"),
      modalMessage: TAPi18n.__("areYouSureDelete"),
      modalMessageTarget: TAPi18n.__(type) + "?",
      modalYesButtonText: TAPi18n.__("Delete"),
      callback: function(result) {
        if (result == true) {
          Items.remove(id);
          toastr.success(TAPi18n.__("thisDeleted"), TAPi18n.__(type));
          Modal.hide('App_generic_modal');
        }
      }
    };
    Modal.show('App_generic_modal', modalData);
  },
  'click .copyPassword': function(event) {
    toastr.success(TAPi18n.__("passwordCopiedToClipboard"))
    //using zenorocha:clipboard.  See onRendered event
  },
  'click .copyPrivateKey': function(event) {
    toastr.success(TAPi18n.__("keyCopiedToClipboard"))
    //using zenorocha:clipboard.  See onRendered event
  },
  'click .download': function(event) {
    var fileId = event.currentTarget.getAttribute("data-id");
    var file = Files.findOne(fileId);
    decryptDownloadFile(file);
  }
});
