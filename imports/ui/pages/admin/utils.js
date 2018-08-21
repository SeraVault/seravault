import './utils.html';

Template.ui_admin_utils.events({
    'click #regenerate_shared_into_doc': function(event, template) {
        console.log('clicked!');
    },
    'click #copy_dockeys_to_doc': function() {
        console.log('copying doc keys');                
        //Temporary: move DocKeys to Items
        Items.find().forEach(function(item){
            Items.direct.update(item._id, {$set: {keys: []}})
        });     
        DocKeys.find().forEach(function(data){     
            var pushArray = {userId: data.user_id, encKey: data.encrypted_key, asymNonce: data.asymNonce};
            var result = Items.direct.update({_id: data.doc_id}, {$push: {keys: pushArray}});
            if (result) {DocKeys.remove({_id: data._id});}          
          });
        console.log('updating recipients field')
        Items.find().forEach(function(item){
            var recipients = [];
            item.keys.forEach(function(key){
                recipients.push(key.userId);
            });
            //console.log(recipients);
            Items.direct.update({_id: item._id}, {$set: {recipients: recipients}})
        });        
    },
    'click #copy_pubkey_to_contacts': function() {
        console.log('copying pubkey to contacts');
        /*Contacts.find().forEach(function(contact){
            console.log('updating', contact.displayName);
            Contacts.update({_id: contact._id}, {$set: {tmp_reset: '1'}});
            /*Meteor.call('getUserPubKey', contact.userId, function(err, userPubKey) {
                Contacts.update({_id: contact._id}, {$set: {pubKey: userPubKey}});
            })*/
        
    },
    'click #remove-orphaned-files': function() {
        Meteor.call('removeOrphanedFiles');
    }
});