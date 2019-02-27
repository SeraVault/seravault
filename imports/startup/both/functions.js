getDiskUsage = function () {
    var diskTotal = 0;
    var planDisk = plan() && plan().disk;
    Files.find({userId: Meteor.userId()}).forEach(function (data) {
        diskTotal = diskTotal + data.size;
    });
    return diskTotal;
};

enoughDisk = function (size) {
    var planDisk = plan() && plan().disk;
    var diskUsage = getDiskUsage();
    var diskUsagePlusFile = diskUsage + size;
    var enoughSpace = (planDisk >= diskUsagePlusFile);    
    return enoughSpace;
};

getItemUsage = function() {
    return Items.find({owner_id: Meteor.userId()}).count();
    //var planTotal = plan() && plan().items;
}

enoughItems = function() {
    var planItems = plan() && plan().items;
    return (getItemUsage <= planItems);
}