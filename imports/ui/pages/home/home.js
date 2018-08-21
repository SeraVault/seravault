import './home.html';

Template.App_home.helpers({
  isNotCordova: function() {
    return !Meteor.isCordova;
  }
})

Template.App_home.events({
  'click .terms': function() {
    $('#modal-terms').modal('show');
  },
  'click .privacy': function() {
    $("#modal-privacy").modal("show");
  },
  'click .contact': function() {
    $("#modal-contact").modal("show");
  }
});

Template.App_home.onRendered(function() {
  $(".auto-update-year").html(new Date().getFullYear());
})
