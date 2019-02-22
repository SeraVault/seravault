generateDefaultItems = function (email, password) {
    console.log('generating default items...');  
    Items.insert({
        owner_id: Meteor.user()._id,
        type: 'account',
        title: 'SeraVault',
        url: 'https://www.seravault.com',
        login: email,
        password: password,
        notes: TAPi18n.__('SeravaultWelcomeMessage'),
    });
    Items.insert({
        owner_id: Meteor.user()._id,
        type: 'note',
        title: TAPi18n.__('SeravaultWelcome'),
        notes: TAPi18n.__('SeravaultWelcomeMessage'),
    });
    Items.insert({
        owner_id: Meteor.user()._id,
        type: 'note',
        title: TAPi18n.__('multiFactorAuthenticationTitle'),
        notes: TAPi18n.__('multiFactorAuthenticationMessage')
    });
};