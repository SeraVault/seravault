import {} from 'meteor-accounts-t9n';

if (Meteor.isClient) {
  Tracker.autorun(function() {    
    var lang = Meteor.user() && Meteor.user().profile && Meteor.user().profile.language || 'en';
    TAPi18n.setLanguage(lang)
    .done(function () {      
    })
    .fail(function (error_message) {
      // Handle the situation
      console.log(error_message);
    });
    moment.locale(lang);

    //summernote language
    var slang = 'en-US';
    switch (lang) {
      case 'fr':
        slang = 'fr-FR';
        break;
      case 'es':
        slang = 'es-ES';
        break;
      case 'zh-CN':
        slang = 'zh-CN';
        break;
      case 'da':
        slang = 'da-DA';
        break;
      case 'nl': 
        slang = 'nl-NL';
        break;
      case 'de': 
        slang = 'de-DE';
        break;
    }
    Session.set('slang', slang);
    //T9n.setLanguage('fr');
  });
}
