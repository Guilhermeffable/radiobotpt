const volume = require('../commands/volume')
const pause = require('../commands/pause')
const clear = require('../commands/clear')
const dis = require('../commands/dispatcher')
const Youtube = require('simple-youtube-api');
const youtube = new Youtube('AIzaSyCH34xrduFmR_dL9os0ev-lfO1S_9jbyp0');
const ytdl = require('ytdl-core');

global.dispatcher = undefined;
const queue = new Map();

module.exports = (client, message) => {

    const serverQueue = queue.get(message.guild.id);

    if(message.content.startsWith('!play')){
        
        executePlay(message, serverQueue);

    }

    if(message.content.startsWith('!antena3')) {

        // stream Antena3
        dispatcher = dis.createDispatcher('https://streaming-live.rtp.pt/liveradio/antena380a/playlist.m3u8?DVR', message)
        
    }

    if(message.content.startsWith('!orbital')) {

        // stream Orbital FM
        dispatcher = dis.createDispatcher('http://centova.radios.pt:8401/stream.mp3/1', message)
        
    }
    
    if(message.content.startsWith('!hiper')) {

        //stream Hiper FM
        dispatcher = dis.createDispatcher('https://centova.radio.com.pt/proxy/500?mp=/stream', message)
        
    }

    if(message.content.startsWith('!cidhip')) {

        // stream Cidade FM Hip-Hop
        dispatcher = dis.createDispatcher('https://mcrwowza7.mcr.iol.pt/cidhiphop/cidhiphop.stream/playlist.m3u8', message)
        
    }

    if(message.content.startsWith('!cid')) {

        // stream Cidade FM
        dispatcher = dis.createDispatcher('https://mcrwowza7.mcr.iol.pt/cidade/smil:cidade.smil/playlist.m3u8', message)
        
    }

    if(message.content.startsWith('!comercial')) {

        // stream Comrcial
        dispatcher = dis.createDispatcher('http://mcrwowza7.mcr.iol.pt/comercial/smil:comercial.smil/playlist.m3u8', message)
        
    }

    if(message.content.startsWith('!volume')) {

        const vol = message.content.split(' ')[1]/100

        volume.vol(message, dispatcher, vol)

    }

    if(message.content.startsWith('!pause')) {

        dispatcher.pause();

        
    }

    if(message.content.startsWith('!help')) {

        message.channel
            .send('Comandos: \n -!help \n -!clear Limpa as mensagens do bot \n -!volume [valor] \n -!play \n -!pause\
                    \n -!orbital Rádio Orbital \n -!antena3 Rádio Antena3 \n -!cid Rádio Cidade FM \
                    \n -!cidhip Rádio Cidade FM Hip-Hop \n -!hiper Rádio HiperFM \n -!comercial Rádio Comrcial')

    }
    
    if(message.content.startsWith('!clear')){

        clear(message)

    }



}

async function executePlay(message, serverQueue){

    const voiceChannel = message.member.voice.channel;

    const args = message.content.split(" ");
    
    let songTitle = "";

    for(let i = 1; i < args.length; i++){

        songTitle += args[i];
        songTitle += " ";

    }

    try{

        const videos = await youtube.searchVideos(songTitle, 5);

        const song = videos[0].id;
    
        if (videos.length < 5){

            return message.reply('Não foram encontrados vídeos com esse nome.');

        }
        console.log(serverQueue);

        if(!serverQueue) {

            const queueConstruct = {
                textChannel : message.channel,
                voiceChannel : voiceChannel,
                connection : null,
                songs: [],
                volume: 5,
                playing: true
            };
    
            queue.set(message.guild.id, queueConstruct);
    

            try{
                const connection = await voiceChannel.join();
                queueConstruct.connection = connection;

                queueConstruct.songs.push(song);
                play(message.guild, queueConstruct.songs[0]);
        
            } catch(err){
        
                console.error(err);
                return message.reply('Ocorreu um erro ao ir buscar o vídeo.')
        
            }
            
    
        }
        else{
            console.log(song);
            serverQueue.songs.push(song);
            return message.channel.send(songTitle + " foi adicionado à queue.");

        }

    } catch(err){

        console.error(err);

    }


}

function play(guild, song){

    const serverQueue = queue.get(guild.id);

    if(!song){

        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;

    }

    console.log(song);

    const url = `https://www.youtube.com/watch?v=${song}`;
        
    dispatcher = serverQueue.connection
        .play(ytdl(url, {
            highWaterMark: 1024 * 1024 * 10
        })
        .on("finish", () => {
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
        .on("error", error => console.error(error))
    );
    
    return dispatcher;

}
