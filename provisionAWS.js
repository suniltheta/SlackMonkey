var AWS = require('aws-sdk');
var dotenv = require('dotenv');
dotenv.load();

// configure AWS with security tokens and region
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY
});

AWS.config.update({region: 'us-west-2'});

var params = {
    ImageId: 'ami-f173cc91', // Amazon Linux AMI x86_64 EBS
    InstanceType: 't2.micro',
    KeyName: 'DevOpsHW1',
    MinCount: 1, MaxCount: 1
};

var EC2 = new AWS.EC2();

EC2.runInstances(params, function(err, data) {
    if (err) {
        console.log("Could not create instance", err); return;
    }

    var instanceId = data.Instances[0].InstanceId;
    //console.log("New AWS instance Started with instanceId:" , instanceId);

    var params = {
        InstanceIds: [ instanceId ]
    };

    EC2.describeInstances(params, function(err, data)    {
        if (err){
            console.log(err, err.stack);
        }
        else{
            var ipAddress = data.Reservations[0].Instances[0].PublicIpAddress;
            console.log("IP address of AWS instance: " + ipAddress);
        }
    });

});