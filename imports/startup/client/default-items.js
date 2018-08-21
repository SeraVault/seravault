generateDefaultItems = function(email, password) {
    Items.insert({type: 'account',
        title: 'SeraVault',
        url: 'https://www.seravault.com',
        login: email,
        password: password,
        notes: TAPi18n.__('SeravaultWelcomeMessage'),
    });
    Items.insert({type: 'note',
        title: TAPi18n.__('SeravaultWelcome'),
        notes: TAPi18n.__('SeravaultWelcomeMessage'),
    });
};

/*Tracker.autorun(function () {
    if (Meteor.user()) {
        var me = Contacts.findOne({owner_id: Meteor.userId(), userId: Meteor.userId()});
        if (!me) {
            Contacts.insert({owner_id: Meteor.userId(), userId: Meteor.userId(), displayName: Meteor.user().profile.displayName, 
            pubKey: Meteor.user().profile.enc_publicKey, visible: false, status: 'Enabled'});
        }
    }
});*/