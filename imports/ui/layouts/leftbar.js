import './leftbar.html';

Template.App_ui_leftbar.helpers({
  folders: function() {
    return ItemsDecrypted && ItemsDecrypted.find({
      type: 'folder'
    })
  },
  showAdmin: function() {
    return Roles.userIsInRole(joesUserId, ['wheel', 'blogAdmin'], 'global-group');
  }
})

Template.App_ui_leftbar.events({
  'click .data-usage': function () {
    FlowRouter.go('/app/profile#plans')
  },
  'click .close-sidebar': function () {
    $(".left-sidebar-toggle").click();
  },
  'click .open-folder': function(event) {
    Session.set('type', null);
    Session.set('search_folder', event.currentTarget.getAttribute("data-id"));
    FlowRouter.go('App.items');
  },
  'click .open-folders': function() {
    FlowRouter.go('App.folders');
  },
  'click .open-items': function() {
    FlowRouter.go('App.all');
  },
  'drop .open-folder': function(ev) {
    ev.preventDefault();
    //console.log(Session.get('item_id'));
    var item = Items && Items.findOne(Session.get('item_id'));
    var folder = Items && Items.findOne(ev.currentTarget.getAttribute("data-id"));
    //console.log(item);
    var related = folder.related || [];
    //console.log(related);
    if (!related.includes(item._id)) {
      related.push(item._id);
    }
    //console.log(related);
    Items.update(folder._id, {$set: {related: related}});
    $('.open-folder').removeClass('hover-folder-link');
  },
  'dragover .open-folder': function(ev, t) {
    ev.preventDefault();
    //console.log(ev);
    $(ev.currentTarget).addClass("hover-folder-link");
    //this.addClass('hover-folder-link');
    //console.log(event.currentTarget.getAttribute("data-id"));
    //$("'.[data-id = '" + id + "']'").addClass('hover-folder-link');
    //console.log('dragover');
  },
  'dragleave .open-folder': function(ev) {
    ev.preventDefault();
    $('.open-folder').removeClass('hover-folder-link');
    //console.log('dragover');
  },
  'dragover .open-folders': function(e, t) {
    e.preventDefault();    
    $('.folder-parent').addClass('open');
  },
  'click .contact_us': function() {
    FlowRouter.go('App.contact_us');
  },
  'click .replay-intro': function () {
    introJs().start();
  }
});