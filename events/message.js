const volume = require('../commands/volume')
const pause = require('../commands/pause')
const clear = require('../commands/clear')
const dis = require('../commands/dispatcher')


const ytdl = require('ytdl-core');
const {YTSearcher} = require('ytsearcher');

const searcher = new YTSearcher({
    key: process.env.youtube_api,
    revealed: true
});


let vol = 5;

let dispatcher;

const queue = new Map();
module.exports = async (client, message) => {

    let content = message.content;
    
    const prefix = "!";

    const serverQueue = queue.get(message.guild.id);
    let args = message.content.slice(prefix.length).trim().split(/ +/g);

    const command = args.shift().toLowerCase();

    if(!content.startsWith(prefix) || message.author.bot) return;

    if(content.startsWith(prefix + "play")){

        execute(message, serverQueue, args);

    }
    else if(content.startsWith(prefix + "skip")){
        console.log(message);
        skip(message, serverQueue);

    }
    else if(content.startsWith(prefix + "stop")){

        stop(message, serverQueue);

    }
    else if(content.startsWith(prefix + "queue")){

        showQueue(client, message, serverQueue);

    }
    else if(content.startsWith(prefix + "antena3")){

        dispatcher = dis.createDispatcher('https://streaming-live.rtp.pt/liveradio/antena380a/playlist.m3u8?DVR', message);

    }
    else if(content.startsWith(prefix + "orbital")){

        dispatcher = dis.createDispatcher('http://centova.radios.pt:8401/stream.mp3/1', message);

    }
    else if(content.startsWith(prefix + "hiper")){

        dispatcher = dis.createDispatcher('https://centova.radio.com.pt/proxy/500?mp=/stream', message);

    }
    else if(content.startsWith(prefix + "cidhip")){
        
        dispatcher = dis.createDispatcher('https://mcrwowza7.mcr.iol.pt/cidhiphop/cidhiphop.stream/playlist.m3u8', message);

    }
    else if(content.startsWith(prefix + "cid")){

        dispatcher = dis.createDispatcher('https://mcrwowza7.mcr.iol.pt/cidade/smil:cidade.smil/playlist.m3u8', message);

    }
    else if(content.startsWith(prefix + "comercial")){

        dispatcher = dis.createDispatcher('http://mcrwowza7.mcr.iol.pt/comercial/smil:comercial.smil/playlist.m3u8', message);

    }
    else if(content.startsWith(prefix + "volume")){

        vol = message.content.split(' ')[1]/100
        console.log(vol);
        volume.vol(message, dispatcher, vol)
 

    }
    else if(content.startsWith(prefix + "help")){
        message.channel
        .send({embed: {
            color: 3447003,
            author:{
                name: client.user.username,
            icon_url: client.user.avatarURL()
        },
            title: "Comandos disponíveis",
            description: "Todos os comandos disponíveis.",
            fields:[{
                name: `${prefix}play [link Youtube]`,
                value: "Reproduz o link Youtube enviado"
            },
            {
                name: `${prefix}help`,
                value: "Mostra todos os comandos disponíveis."
            },
            {
                name: `${prefix}clear`,
                value: "Elimina todas as mensagens enviadas pelo BOT."
            },
            {
                name: `${prefix}volume [valor]`,
                value: "Controla o volume do BOT."
            },
            {
                name: `${prefix}orbital`,
                value: "Reproduz a stream da Rádio Orbital."
            },
            {
                name: `${prefix}antena3`,
                value: "Reproduz a stream da Rádio Antena 3."
            },
            {
                name: `${prefix}cid`,
                value: "Reproduz a stream da Rádio CidadeFM."
            },
            {
                name: `${prefix}cidhip`,
                value: "Reproduz a stream da Rádio CidadeFM Hip-Hop."
            },
            {
                name: `${prefix}hiper`,
                value: "Reproduz a stream da Rádio HiperFM."
            },
            {
                name: `${prefix}comercial`,
                value: "Reproduz a stream da Rádio Comercial."
            }],
            timestamp: new Date(),
            footer: {
                icon_url: message.guild.iconURL(),
                text: message.guild.name
            }
        }
    });
    }
    else if(content.startsWith(prefix + "clear")){
        clear(message);
    }
    else{
        message.channel.send(`Não sei que comando é esse. Usa ${prefix}help para saberes os comandos disponíveis.`)
    }


}

let execute = async (message, serverQueue, args) => {

    let vc = message.member.voice.channel;

    if(!vc){

        return message.channel.send("Please join a voice chat first!");


    }
    else{
        let result = await searcher.search(args.join(" "), { type: "video" });
        message.channel.send(result.first.url);
        const songInfo = await ytdl.getInfo(result.first.url);

        let song = {
            title : songInfo.videoDetails.title,
            url: songInfo.videoDetails.videoId
        };
        
        if(!serverQueue){

            const queueConstructor = {

                txtChannel: message.channel,
                vChannel: vc,
                connection: null,
                songs: [],
                volume: 10,
                playing: true,

            };

            queue.set(message.guild.id, queueConstructor);

            queueConstructor.songs.push(song);

            try{
                let connection = await vc.join();
                queueConstructor.connection = connection;
                play(message.guild, queueConstructor.songs[0]);
            }
            catch(err){
                console.error(err);
                queue.delete(message.guild.id);
                return message.channel.send(`Não foi possível conectar-me ao voice channel ${err}.`)
            }
        }
        else{
            serverQueue.songs.push(song);
            
            return message.channel.send(`A música foi adicionada à queue ${song.url}`);
        }

    }
        
}

let play = (guild, song) => {

    const serverQueue = queue.get(guild.id);

    if(!song){

        serverQueue.vChannel.leave();
        queue.delete(guild.id);
        return;

    }

    serverQueue.duration = song.duration;

    const dispatcher = serverQueue.connection
        .play(ytdl(song.url))
        .on('finish', () => {
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })


};

let stop = (message, serverQueue) => {

    if(!message.member.voice.channel){

        return message.channel.send("Tens de estar conectado/a a um voice channel.");

    }

    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
}

let skip = (message, serverQueue) => {

    
    if(!message.member.voice.channel){

        return message.channel.send("Tens de estar conectado/a a um voice channel.");

    }

    if(!serverQueue) {
        
        return message.channel.send("Não há nada para reproduzir!");
        
    }
    serverQueue.connection.dispatcher.end();
};

let showQueue = (client, message, serverQueue) => {

    if(!message.member.voice.channel){

        return message.channel.send("Tens de estar conectado/a a um voice channel.");

    }

    if(!serverQueue) {
        
        return message.channel.send({embed:{
            color: 3447003,
            author:{
                name: client.user.username,
            icon_url: client.user.avatarURL()
        },
            title: "Queue",
            description: "Músicas na Queue",
            fields:[{
                name:"Nada para reproduzir.",
                value: "0"
            },
            ]
        }});
        
    }
    else{

        let embed = {
            color: 3447003,
            author:{
                name: client.user.username,
            icon_url: client.user.avatarURL()
        },
            title: "Queue",
            description: "Músicas na Queue",
            fields:[]
        
        };

        serverQueue.songs.map( (item, pos) => {

            embed.fields.push({
                name: `${pos + 1} - ${item.title}`});

        })


        return message.channel.send({embed});

    }



}
