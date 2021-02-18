module.exports.run =  (client, message, args, queue, searcher) => {

    const serverQueue = queue.get(message.guild.id);

    if(!serverQueue){
        return message.channel.send("Impossível parar o que nunca começou...");
    }

    if(!message.member.voice.channel){

        return message.channel.send("Tens de estar conectado/a a um voice channel.");

    }

    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();

}

module.exports.config = {

    name:"stop",
    aliases: ["st", "leave"]
}