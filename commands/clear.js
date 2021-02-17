module.exports.run = (message) => {


    message.channel.messages.fetch().then(messages => {

        const botCommands = messages.filter(msg => msg.content.startsWith('!') || msg.author.bot)
        message.channel.bulkDelete(botCommands)
        const messagesDeleted = botCommands.array().length;
        message.channel.send("Número de mensagens eliminadas: " + messagesDeleted)

    })

}
 


module.exports.config = {
    name:"clear",
    aliases: ["clean", "delete"]
};