getDiskUsage = function () {
    var diskTotal = 0;
    var planDisk = plan() && plan().disk;
    Files.find().forEach(function (data) {
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