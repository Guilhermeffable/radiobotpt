async function createDispatcher(url, message){

    const voiceChannel = message.member.voice.channel;
    
    //vê se o user está numa sala de voz
    if(!voiceChannel) {
        return message.channel.send("Precisas de estar num voice channel para usar este comando.");
    }
    console.log(voiceChannel.name);
    const permissions = voiceChannel.permissionsFor(message.client.user);
        
     //vê se tem permissões para entrar na sala
    if(!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
        return message.channel.send("Não tenho permissões para entrar nessa sala.");
    }

    //conecta ao canal de voz e reproduz o link
    const connection = await voiceChannel.join();

    dispatcher = connection.play(url);

    return dispatcher

}

module.exports.createDispatcher = createDispatcher;