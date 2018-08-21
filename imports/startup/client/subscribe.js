Tracker.autorun(function () {
    if (Meteor.user()) {
        if (Contacts.find().count() == 0) {
            Meteor.call('initContacts');
        }
    }
});

/*if (Meteor.user()) {
    Meteor.setInterval(function() {
        if (DDP._allSubscriptionsReady()) {
            Session.set('showSpinner', false);    
        } else {
            Session.set('showSpinner', true);
        }
    }, 50);    
}*/


