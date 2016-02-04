//Required files
var Discord = require("discord.js");
var bot = new Discord.Client();
var games = require("./options/games.json").games;
var options = require("./options/options.json");
var commands = require("./commands.js").commands;
var mod_commands = require("./mod_commands.js").mod_commands;
var admin_commands = require("./admin_commands.js").admin_commands;
var admins = require("./options/admins.json").admins;
//Setup cleverbot
var cleverbot = require("cleverbot-node");
var onee = new cleverbot;
cleverbot.prepare(function () {});
//Chalk Colours
var chalk = require("chalk");
var c = new chalk.constructor({enabled: true});
var serverC = c.black.bold;
var channelC = c.green.bold;
var userC = c.cyan.bold;
var warningC = c.yellow.bold;
var errorC = c.red.bold;
var botC = c.magenta.bold;
var welcome = [];

var commandsProcessed = 0;//used to count the ammount of commands processed in the current session
var talked = 0;//used to count how many times people talked to WishBot in the current session

//Does this stuff when the bot is ready and running
bot.on("ready", function ()
{
	bot.setPlayingGame(games[Math.floor(Math.random() * (games.length))]);//randomly sets a game
	console.log(botC("@WishBot")+" - Ready to begin! Serving in " + channelC(bot.channels.length) + " channels");//tells you that the bot is ready as well as in how many channels
});

//Does this stuff when the bot detects a message, can be in a channel its part of or through a private chat
bot.on("message", function (msg) {
	if (Math.floor((Math.random() * 99) + 1) == 1) {bot.setPlayingGame(games[Math.floor(Math.random() * (games.length))])}
	if (msg.channel.isPrivate && msg.author.id != bot.user.id && (/(^https?:\/\/discord\.gg\/[A-Za-z0-9]+$|^https?:\/\/discordapp\.com\/invite\/[A-Za-z0-9]+$)/.test(msg.content)))
	{
		bot.joinServer(msg.content, function (error, server)
		{
			if (error){bot.sendMessage(msg, "There was an error connecting to that server")}
			else
			{
				welcome.push("Hello!")
				welcome.push("I'm WishBot, better known as "+bot.user+".")
				welcome.push("I was written by Mᴉsɥ using Discord.js.")
				welcome.push("My \"website\" can be found at `https://github.com/hsiw/Wishbot`")
				welcome.push("If I was wrongfully invited please feel free to kick me.")
				welcome.push("For more information on what I can do use -help.")
				welcome.push("Thanks!")
				bot.sendMessage(msg.author, "Successfully joined "+server.name)
			  bot.sendMessage(server.defaultChannel, welcome)
				console.log(serverC("@"+server.name+":")+channelC(" #" + server.defaultChannel.name) + ": " + userC("@WishBot") + " - Joined Server!")
				console.log(botC("@WishBot")+" - Now Serving in " + channelC(bot.channels.length) + " channels")
			}
		});
		return;
	}
	if (msg.channel.isPrivate && (msg.content[0] === options.command_prefix || msg.content[0] === options.mod_command_prefix || msg.content[0] === options.admin_command_prefix)) {bot.sendMessage(msg.author, bot.user + " does not accept commands through private chat."); return;}
	if(msg.author.id === bot.user.id || msg.channel.isPrivate){return;}
	var suffix = msg.content.substring((msg.content.split(" ")[0].substring(1)).length + 2);
	if (msg.content.indexOf(bot.user.mention()) == 0) {
		console.log(serverC("@"+msg.channel.server.name+":")+channelC(" #" + msg.channel.name) + ": " + userC(msg.author.username) + " - " + msg.content);
		bot.startTyping(msg.channel);
		talked += 1;
		onee.write(suffix, function (response) {
			console.log(serverC("@"+msg.channel.server.name+":")+channelC(" #" + msg.channel.name) + ": "+botC("@WishBot")+" - 💭 - " + response.message);
			bot.sendMessage(msg, "💭 - " + response.message).then(bot.stopTyping(msg.channel));
		})
		return;
	}
	if ((msg.content[0] === options.command_prefix) || (msg.content[0] === options.mod_command_prefix) || (msg.content[0] === options.admin_command_prefix)) {
		var cmdTxt = (msg.content.split(" ")[0].substring(1)).toLowerCase();
		if ((commands[cmdTxt] && msg.content[0] === options.command_prefix) ||
		(mod_commands[cmdTxt] && msg.content[0] === options.mod_command_prefix && msg.channel.permissionsOf(msg.sender).hasPermission("manageRoles")) ||
		(msg.content[0] === options.admin_command_prefix && admin_commands[cmdTxt] && admins.indexOf(msg.author.id) > -1))
		{
			if (msg.content[0] === options.command_prefix){var cmd = commands[cmdTxt]}
			if (msg.content[0] === options.mod_command_prefix){var cmd = mod_commands[cmdTxt]}
			if (msg.content[0] === options.admin_command_prefix){var cmd = admin_commands[cmdTxt]}
			console.log(serverC("@"+msg.channel.server.name+":")+channelC(" #" + msg.channel.name) + ": "+botC("@WishBot")+" - "+warningC(cmdTxt) + " was used by " + userC(msg.author.username))
			commandsProcessed += 1;
			cmd.process(bot, msg, suffix, commandsProcessed, talked)
			if(cmd.delete){bot.deleteMessage(msg)}
			return;
		}
	}
});

bot.on("serverDeleted", function(Serverstuff) {
	console.log(botC("@WishBot")+" - Left server " + serverC(Serverstuff.name));
	console.log(botC("@WishBot")+" - Now Serving in " + channelC(bot.channels.length) + " channels");
});

//Login
if(options.private)
{
	bot.login(process.env.email, process.env.password)
	console.log("Logged in using " + warningC(process.env.email))
}
else
{
	bot.login(options.email, options.password)
	console.log("Logged in using " + warningC(options.email))
}

//If disconnected try to reconnect
bot.on("disconnected", function () {
console.log(errorC("Disconnected"));
if(!options.private){process.exit(0);}
else
{
	setTimeout(function(){
		console.log(warningC("Attempting to re-connect..."));
		bot.login(options.email, options.password, function (err, token) {
		if (err) { console.log(err); process.exit(0); }
		if (!token) { console.log(errorC("Failed to re-connect")); process.exit(0); }
	});}, 33333);
}

});
