Files = new FilesCollection({
    collectionName: 'Files',
    allowClientCode: false, // Disallow remove files from Client
    storagePath: function() {
        //break up the storage path so that the system can handle the filesystem without limitations
        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();
        var path = Meteor.settings.private && Meteor.settings.private.fileStoragePath || '~/';
        return path + year + '/' + month + '/' + day;
    },
    onBeforeUpload(file) {
        return true;  //this is handled in the fileUpload.js in the Autoform extension instead.        
    }
});

if (Meteor.isClient) {
    Meteor.subscribe('files.all');
}

if (Meteor.isServer) {
    Meteor.publish('files.all', function () {
        if (this.userId) {
            this.autorun(function() {
                var files = []; 
                //if files are shared to this user add them 
                Items.find({'keys.userId': this.userId}).forEach(function(data) {

                        data.files && data.files.forEach(function(file) {
                            files.push(file);
                            }
                        );           
                    });
                //return files owned by user + files shared to user
                return Files.find({
                    $or: [{_id: {$in: files}}, {userId: Meteor.userId()}]
                    }).cursor;
            });    
        } else {return;}
    });

    Items.before.update(function (userId, doc, fieldNames, modifier, options) {
        modifier.$set = modifier.$set || {};
        //console.log(modifier.$set);
        doc.files && doc.files.filter(function(x) {  // return elements in previousArray matching...
            if (!modifier.$set.files.includes(x)) {
                Files.remove(x);  // "this element doesn't exist in currentArray, delete file"
                //console.log('removed', x);
            }
        });
      });

    Items.before.remove(function (userId, doc) {
        //console.log(doc);
        if (doc.files) {
            doc.files.forEach(function(x){
                Files.remove(x);
                //console.log('removed', x);
            });
        }
    });
}