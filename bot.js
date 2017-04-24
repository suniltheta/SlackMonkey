/**
 * Created by Sunil on 4/24/2017.
 */

var moment = require('moment');
var _ = require('underscore');
var fs = require('fs');
var Botkit = require('botkit');

var controller = Botkit.slackbot({
    debug: false
    //include "log: false" to disable logging
    //or a "logLevel" integer from 0 to 7 to adjust logging verbosity
});

// connect the bot to a stream of messages
controller.spawn({
    token: process.env.ALTCODETOKEN,
    //slack bot token here
}).startRTM()

controller.hears('','direct_message, direct_mention, mention',function(bot, message) {

    if(message.text == "Hi" || message.text == "Hello" || message.text == "hi" || message.text == "hello" || message.text == "HI" || message.text == "HELLO" || message.text == "h"){
        dummy(bot, message);
    }
    else if(message.text == "QUIT" || message.text == "quit" || message.text == "Quit")
    {
        bot.reply(message, "Thank you for using Slack Monkey :+1:  Peace :v:");
        return;
    }
    else if(message.text=="HELP"||message.text=="help"||message.text=="Help")
    {
        bot.reply(message, "Use '@slackmonkey Hi' / '@slackmonkey hello' to test if the monkey is awake  :monkey_face: ");
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
            if(response.text == "QUIT" || response.text == "quit" || response.text == "Quit"){
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