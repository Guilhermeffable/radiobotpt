const ytdl = require('ytdl-core');
const ytpl = require('ytpl');
const Discord = require('discord.js');

module.exports.run = async (client, message, args, queue, searcher) => {

    const vc = message.member.voice.channel;

    console.log(queue);

    if(!vc) return message.send("Tens de estar conectado a um canal de voz!");

    let url = args.join(" ");

    
    let play = (guild, song) => {

        const serverQueue = queue.get(guild.id);

        if(!song){

            serverQueue.vChannel.leave();
            queue.delete(guild.id);
            return;

        }

        const dispatcher = serverQueue.connection
            .play(ytdl(song.url))
            .on('finish', () => {
                serverQueue.songs.shift();
                play(guild, serverQueue.songs[0]);
            })
            
        let seconds = serverQueue.songs[0].vLength - 60 * parseInt(serverQueue.songs[0].vLength / 60);
         
        let dur = `${parseInt(serverQueue.songs[0].vLength / 60)}:${seconds < 10 ? '0' + seconds : seconds}`;
        let msg = new Discord.MessageEmbed()
                .setTitle("A tocar: ")
                .addField(serverQueue.songs[0].title, "_______")
                .addField("Duração: ", dur)
                .setThumbnail(serverQueue.songs[0].thumbnail)
                .setColor("PINK")
        
        serverQueue.txtChannel.send(msg);
        


    }

    let videoHandler = async (songInfo, message, vc, playlist = false) => {

        

        const serverQueue = queue.get(message.guild.id);

        const song = {

            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
            vLength: songInfo.videoDetails.lengthSeconds,
            thumbnail: songInfo.videoDetails.thumbnails[3].url

        }

        if(!serverQueue) {
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
        }else{

                serverQueue.songs.push(song);
                

                return;
        }
    }


    if(url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)){

        try{
            await ytpl(url).then(async playlist => {
                message.channel.send(`A playlist: "${playlist.title}" foi adicionada.`)
                playlist.items.forEach(async item => {
                    await videoHandler(await ytdl.getInfo(item.shortUrl), message, vc, true);
                })
            })
        }catch(err){
            return message.channel.send(`Insere um link válido.\n${err}`)
        }
        
    }
    else{

        let result = await searcher.search(args.join(" "), {type: "video"});
        if(result.first == null) return message.channel.send("Não foram encontrados resultados.");
        //message.channel.send(result.first.url);
        let songInfo = await ytdl.getInfo(result.first.url);
        return videoHandler(songInfo, message, vc);

    }

    
};

module.exports.config = {

    name: "play",
    aliases: ["p", "pl"]

}