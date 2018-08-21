upgrade = function () {
    if (Meteor.user()) {
    //Move folders  
    //Introduce data versions
        if (Meteor.user().profile && (Meteor.user().profile.code_version != 1.3)) {
            console.log("Upgrading data to 1.3");
            Items && Items.find({
                type: {
                    $ne: 'folder'
                }
            }).forEach(function (item) {
                if (item.folders) {
                    item.folders.forEach(function (id) {
                        Items.update(id, {
                            $push: {
                                related: item._id
                            }
                        });
                    });
                }
                Items.update(item._id, {
                    $set: {
                        folders: []
                    }
                });
            });
            Meteor.users.update(Meteor.userId(), {
                $set: {
                    'profile.code_version': 1.3
                }
            });
        }
    }
};