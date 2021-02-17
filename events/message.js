const volume = require('../commands/volume')
const pause = require('../commands/pause')
const clear = require('../commands/clear')
const dis = require('../commands/dispatcher')
const play = require('../commands/play')

const ytdl = require('ytdl-core');
const {YTSearcher} = require('ytsearcher');

const searcher = new YTSearcher({
    key: process.env.youtube_api,
    revealed: true
});


let vol = 5;


const queue = new Map();

module.exports = async (client, message) => {

    let dispatcher;

    let content = message.content;
    
    const prefix = "!";

    const serverQueue = queue.get(message.guild.id);
    let args = message.content.slice(prefix.length).trim().split(/ +/g);

    const command = args.shift().toLowerCase();

    if(!content.startsWith(prefix) || message.author.bot) return;

    switch(command){

        case "play":

            execute(message, serverQueue, args, queue);
            break;
        
        case "skip":

            skip(message, serverQueue);
            break;
        
        case "stop":

            stop(message, serverQueue);
            break;        

        case "queue":

            showQueue(client, message, serverQueue);
            break;

        case "antena3":

            dispatcher = dis.createDispatcher('https://streaming-live.rtp.pt/liveradio/antena380a/playlist.m3u8?DVR', message);
            break;
        
        case "hiper":

            dispatcher = dis.createDispatcher('https://centova.radio.com.pt/proxy/500?mp=/stream', message);
            break;

        case "orbital":

            dispatcher = dis.createDispatcher('http://centova.radios.pt:8401/stream.mp3/1', message);
            break;

        case "cidhip":

            dispatcher = dis.createDispatcher('https://mcrwowza7.mcr.iol.pt/cidhiphop/cidhiphop.stream/playlist.m3u8', message);
            break;

        case "cid":

            dispatcher = dis.createDispatcher('https://mcrwowza7.mcr.iol.pt/cidade/smil:cidade.smil/playlist.m3u8', message);
            break;

        case "comercial":

            dispatcher = dis.createDispatcher('http://mcrwowza7.mcr.iol.pt/comercial/smil:comercial.smil/playlist.m3u8', message);
            break;
        
        case "mega":

            dispatcher = dis.createDispatcher('https://20133.live.streamtheworld.com/MEGA_HITSAAC.aac?dist=triton-widget&tdsdk=js-2.9&pname=tdwidgets&pversion=2.9&banners=none', message);
             break;

        case "leave":

            leave(message, serverQueue);
            break;
            
        case "volume":

            vol = message.content.split(' ')[1]/100
            console.log(vol);
            volume.vol(message, dispatcher, vol)
            break;

        case "help":
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
                    name: `${prefix}play [query]`,
                    value: "Pesquisa e reproduz o primeiro resultado encontrado no Youtube."
                },
                {
                    name:`${prefix}skip`,
                    value: "Passa a música atual, reproduz a próxima música na queue."
                },
                {
                    name:`${prefix}stop`,
                    value: "Pára toda a reprodução de música do BOT."
                },
                {
                    name:`${prefix}leave`,
                    value: "Disconecta o BOT do canal de voz."
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
                    value: "Controla o volume do BOT (apenas nas streams de rádio)."
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
                },
                {
                    name: `${prefix}mega`,
                    value: "Reproduz a stream da Rádio MegaHits"
                }
                ],
                timestamp: new Date(),
                footer: {
                    icon_url: message.guild.iconURL(),
                    text: message.guild.name
                }
            }
        });
        break;

        case "clear":
            clear(message);
            break;
        
        default:
            message.channel.send(`Não sei que comando é esse. Usa ${prefix}help para saberes os comandos disponíveis.`);

    }


    

}

let execute = async (message, serverQueue, args, queue) => {

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
                play.play(message.guild, queueConstructor.songs[0], queue);
            }
            catch(err){
                console.error(err);
                queue.delete(message.guild.id);
                return message.channel.send(`Não foi possível conectar-me ao voice channel ${err}.`)
            }
        }
        else{
            serverQueue.songs.push(song);
            
            return;
        }

    }
        
}

let leave = (message, serverQueue) => {

    if(!message.member.voice.channel){

        return message.channel.send("Tens de estar conectado/a a um voice channel.");

    }

    serverQueue.connection.dispatcher.end();

}

let stop = (message, serverQueue) => {

    if(!message.member.voice.channel){

        return message.channel.send("Tens de estar conectado/a a um voice channel.");

    }

    serverQueue.songs = [];
    setInterval(serverQueue.connection.dispatcher.end(), 300000);
}

let skip = (message, serverQueue) => {

    
    if(!message.member.voice.channel){

        return message.channel.send("Tens de estar conectado/a a um voice channel.");

    }

    if(!serverQueue) {
        
        return message.channel.send("Não há nada para reproduzir!");
        
    }

    setInterval(serverQueue.connection.dispatcher.end(), 300000);
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
