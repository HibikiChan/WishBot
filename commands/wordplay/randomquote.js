var quotes = require('./../../database/quote.json');

module.exports = {
    usage: "Prints a random quote from The People Chat's quote channel\n⚠Will not work on any other server⚠",
    delete: true,
    privateServer: ['87601506039132160', '180142674353979392'],
    cooldown: 2,
    type: "words",
    process: function(bot, msg, suffix) {
        if (suffix.match(/^\d+$/)) bot.createMessage(msg.channel.id, quotes[suffix]).catch(err => errorC(err));
        else if (suffix) {
            var quoteRegex = new RegExp(suffix, "i");
            var quoteCache = quotes.filter(message => message.match(quoteRegex));
            if (quoteCache.length < 1) bot.createMessage(msg.channel.id, "No quotes found that contain " + suffix);
            else bot.createMessage(msg.channel.id, quoteCache[Math.floor((Math.random() * quoteCache.length) + 1)]).catch(err => errorC(err));
        } else bot.createMessage(msg.channel.id, quotes[Math.floor((Math.random() * quotes.length) + 1)]).catch(err => errorC(err));
    }
}