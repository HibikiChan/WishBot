module.exports = {
    usage: "This bot prints a song in the current channel",
    cooldown: 5,
    process: (bot, msg)=> {
        bot.createMessage(msg.channel.id, "*🎶 sings a beautiful song about Onii-chan 🎶*");
    }
}