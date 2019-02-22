import './container.html';

Template.App_ui_home_container.helpers({
  getLanguage: function() {
    var lang = TAPi18n.getLanguage();
    return TAPi18n.getLanguages()[lang].name;
  },
  isCordova: function() {
    return Meteor.isCordova;
  },
  hasPosts: function() {
    return BlogPosts.find().count() > 0;
  }
});

Template.App_ui_home_container.events({
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
  }, 
  'click .close-navbar': function() {
    $('.navbar-toggler').addClass('collapsed');
    $('.navbar-toggler').attr("aria-expanded","false");
    $('.navbar-collapse').removeClass('show');
  },
  'click .logout': function() {
    Meteor.logout();
  }
})

Template.App_ui_home_container.onRendered(function() {
  $(".auto-update-year").html(new Date().getFullYear());
});
