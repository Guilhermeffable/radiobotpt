
module.exports = async (client,message) => {
    //const channelID = message.member.lastMessageChannelID;
    const voiceChannel = message.member.voice.channel;
    console.log(voiceChannel.name);

    
        //vê se o user está numa sala de voz
     if(!voiceChannel) {
        return message.channel.send("Precisas de estar num voice channel para usar este comando.")
    }
    const permissions = voiceChannel.permissionsFor(message.client.user);
        
     //vê se tem permissões para entrar na sala
    if(!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
        return message.channel.send("Não tenho permissões para entrar nessa sala.")
    }


        
    const connection = await voiceChannel.join()
    const dispatcher = connection.play('http://centova.radios.pt:8401/stream.mp3/1')
    
    return dispatcher




    

    

}