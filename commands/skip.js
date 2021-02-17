module.exports.run =  (client, message, args, queue, searcher) => {
    
    const serverQueue = queue.get(message.guild.id);

    if(message.member.voice.channel != message.guild.me.voice.channel){

        return message.channel.send("Tens de estar ao mesmo voice chat que o BOT.");

    }

    if(!serverQueue) return message.channel.send("Não há nada para reproduzir!");
        

    let roleN = message.guild.roles.cache.find(role => role.name === "DJ");

    if(!message.member.roles.cache.get(roleN.id)) return message.channel.send("Não tens o role necessário para passar a música.")


    serverQueue.connection.dispatcher.end();
}

module.exports.config = {

    name:"skip",
    aliases: ["s", "fs"]
}