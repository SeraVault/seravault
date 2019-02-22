Meteor.startup(function() {
    reCAPTCHA.config({
        sitekey: '6LdDh0UUAAAAAOH4IqNTQWeFIBtu9RUrFkNKnLHq'
    });
});

Tracker.autorun(function() {   
    if (Meteor.userId() && Meteor.user() && Meteor.user().profile && Session.get('tmp_set_default_items')) {
        setTimeout(function() {
            generateDefaultItems(Session.get('tmp_email'), Session.get('tmp_password'));
            Session.set('tmp_email', '');
            Session.set('tmp_password', '');            
            }, 2000);        
        Session.set('tmp_set_default_items', false); //set session var so that routine doesn't run again.
    }
});