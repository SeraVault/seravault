twoFactor.sendCode = (user, code) => {
  // Don't hold up the client
  Meteor.defer(() => {
    // Send code via email    
    var lang = user.profile.language;
    var footer = "<img src='https://www.seravault.com/img/seravault_logo.png'><br><b>" + TAPi18n.__("tagLine", null, lang) + "</b>";
    var message = "<b>" + code.toString() + "</b> " + TAPi18n.__("emailAuthenicationCodeMessage1", null, lang) + "  (" + TAPi18n.__("emailAuthenicationCodeWarning", null, lang) + ")" + "</br></br><hr>" + footer;
    Email.send({
      to: user.emails[0].address,
      from: Meteor.settings.private.emailNotificationAddress,
      subject: TAPi18n.__("emailAuthenticationCodeSubject", null, lang),
      html: message
    });
  });
};