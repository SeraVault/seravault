Meteor.methods({
    removeOrphanedFiles: function() {
        var validFiles = [];
        Items.find().forEach(function(data){
            if (data.files) {
                data.files.forEach(function(file){
                validFiles.push(file);
                });
            }
        });
        console.log(validFiles);
        Files.remove({_id: {$nin: validFiles}});
    }
});