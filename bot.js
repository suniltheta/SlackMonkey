/**
 * Created by Sunil on 4/24/2017.
 */

var moment = require('moment');
var _ = require('underscore');
var fs = require('fs');
var Botkit = require('botkit');
var monitorAWS = false;

// Amazon related imports
var AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-2'});


// configure AWS with security tokens and region
// AWS.config.update({
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_KEY
// });

var params = {
    ImageId: 'ami-f173cc91', // Amazon Linux AMI x86_64 EBS
    InstanceType: 't2.micro',
    KeyName: 'devops',
    MinCount: 1, MaxCount: 1
};

var EC2 = new AWS.EC2();

EC2.describeInstances(function(err, data){
    console.log("\nIn describe instances:\n");
    if (err){
        console.log(err, err.stack);
    }
    else{
        var instance = data.Reservations[0].Instances[0];
        var ipAddress = data.Reservations[0].Instances[0].PublicIpAddress;
        console.log("IP address of AWS instance: " + ipAddress);
    }
});

// EC2.describeInstances( function(err, data) {
//     console.log("\nIn describe instances:\n");
//     if (err) console.log(err, err.stack); // an error occurred
//     else
//         console.log("\n\n" + data + "\n\n"); // successful response
// });


var controller = Botkit.slackbot({
    debug: false
    //include "log: false" to disable logging
    //or a "logLevel" integer from 0 to 7 to adjust logging verbosity
});

// connect the bot to a stream of messages
controller.spawn({
    token: process.env.ALTCODETOKEN
    //slack bot token here
}).startRTM()

controller.hears('','direct_message, direct_mention, mention',function(bot, message) {

    //Below are triggers to converse with the Bot
    if(message.text.toLowerCase() == "hi" || message.text.toLowerCase() == "hello"){
        dummy(bot, message);
    }
    else if(message.text.toLowerCase() == "aws" || message.text.toLowerCase() == "amazon" || message.text.toLowerCase() == "server" || message.text.toLowerCase() == "ec2" || message.text.toLowerCase() == "prod" || message.text.toLowerCase() == "production" || message.text.toLowerCase() == "server"){
        aws(bot, message);
    }
    // else if(message.text == "aws" || message.text == "AWS" || message.text == "Amazon" || message.text == "amazon" || message.text == "AMAZON" || message.text == "server" || message.text == "Server" || message.text == "EC2" || message.text == "ec2" || message.text == "prod" || message.text == "Production" || message.text == "production" || message.text == "PRODUCTION" || message.text == "Prod" || message.text == "server" )
    // {
    //     aws(bot, message);
    // }
    else if(message.text.toLowerCase() == "quit" || message.text.toLowerCase() == "exit"){
        bot.reply(message, "Thank you for using Slack Monkey :+1:  Peace :v:");
        return;
    }
    else if(message.text=="HELP"||message.text=="help"||message.text=="Help")
    {
        bot.reply(message, "Use '@slackmonkey Hi' / '@slackmonkey hello' to test if the monkey is awake  :monkey_face: ");
        bot.reply(message, "Use '@slackmonkey aws' / '@slackmonkey AWS' to see your active AWS :cloud: instances :innocent: ");
        return;
    }
    else
    {
        bot.reply(message, "Sorry didn't understand what you said :see_no_evil: ");
        bot.reply(message, "Please say \'@slackmonkey help\' for more info :monkey_face: ");
        return;
    }
});

//Dummy function
var dummy = function(bot,message) {

    var dumb = function (err, convo) {
        convo.ask('Dummy function called', function (response, convo) {
            if(response.text.toLowerCase() == "quit" || response.text.toLowerCase() == "exit"){
                bot.reply(message, "Thank you for using Slack Monkey :+1:  Peace :v:");
                convo.next();
                return;
            }
            bot.reply(message, "Echoing your message." + response.text + "\n");
            dumb(response, convo);
            convo.next();

        });
    };

    // start a conversation with the user.
    bot.startConversation(message, dumb);
    bot.reply(message, "Let me manage your DevOps pipeline.");
};

//aws function
var aws = function(bot,message) {

    var dumb = function (err, convo) {
        convo.ask('aws function called', function (response, convo) {
            if(response.text.toLowerCase() == "quit" || response.text.toLowerCase() == "exit"){
                bot.reply(message, "Thank you for using Slack Monkey :+1:  Peace :v:");
                convo.next();
                return;
            }
            bot.reply(message, ":cloud: " + response.text + "\n");
            dumb(response, convo);
            convo.next();

        });
    };

    var startAWSMonitor = function (err, convo) {
        convo.ask('reply yes or no', function (response, convo) {
            if(response.text.toLowerCase() == "yes"){
                bot.reply(message, "Starting AWS:partly_sunny_rain: monitoring :+1:");
                monitorAWS = true;
                // TODO: Add function which starts aws monitoring.
                convo.next();
                return;
            }
            convo.next();

        });
    };

    var stopAWSMonitor = function (err, convo) {
        convo.ask('reply yes or no', function (response, convo) {
            if(response.text.toLowerCase() == "yes"){
                bot.reply(message, "AWS:partly_sunny_rain: monitoring stopped :+1: ");
                monitorAWS = false;
                // TODO: Add function which stops aws monitoring.
                convo.next();
                return;
            }
            convo.next();

        });
    };

    // start a conversation with the user.
    //bot.startConversation(message, dumb);
    bot.reply(message, "Let me manage your DevOps pipeline :cloud: ");

    if(monitorAWS){
        bot.reply(message, "Do you want to stop monitoring your EC2 instances? :sweat_smile:");
        bot.startConversation(message, stopAWSMonitor);
    }
    else{
        bot.reply(message, "Do you want to start monitoring your EC2 instances? :innocent:");
        bot.startConversation(message, startAWSMonitor);
    }
};