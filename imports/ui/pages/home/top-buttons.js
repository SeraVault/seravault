import './top-buttons.html';

Template.homeTopButtons.helpers({
  getLanguage: function() {
    return TAPi18n.getLanguage()
  },
  isCordova: function() {
    return Meteor.isCordova;
  }
})

Template.homeTopButtons.events({
  'click #english': function() {
    TAPi18n.setLanguage('en');
  },
  'click #french': function() {
    TAPi18n.setLanguage('fr');
  },
  'click #spanish': function() {
    TAPi18n.setLanguage('es');
  },
  'click #chinese': function() {
    TAPi18n.setLanguage('zh-CN');
  },
  'click #danish': function() {
    TAPi18n.setLanguage('da');
  },
  'click #dutch': function() {
    TAPi18n.setLanguage('nl');
  },
  'click #german': function() {
    TAPi18n.setLanguage('de');
  },
  'click #exit-app': function() {
    if (Meteor.isCordova) {
      navigator.app.exitApp();
    }
  }
})
