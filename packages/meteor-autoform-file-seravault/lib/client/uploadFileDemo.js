Template.uploadFileDemo.helpers({
    
});

Template.uploadFileDemo.events({
    'click .download': function(e, t) {
        decryptDownloadFile(t.data);
    }
});