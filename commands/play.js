const ytdl = require('ytdl-core');
const ytpl = require('ytpl');
const Discord = require('discord.js');
const {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    getVoiceConnection
} = require('@discordjs/voice');

module.exports.run = async (client, message, args, queue, searcher) => {
    const vc = message.member.voice.channel;

    if (!vc)
        return message.channel.send(
            'Tens de estar conectado a um canal de voz!'
        );

    let url = args.join(' ');

    if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
        try {
            await ytpl(url).then(async (playlist) => {
                message.channel.send(
                    `A playlist: "${playlist.title}" foi adicionada.`
                );
                playlist.items.forEach(async (item) => {
                    await videoHandler(
                        await ytdl.getInfo(item.shortUrl),
                        message,
                        vc,
                        true
                    );
                });
            });
        } catch (err) {
            return message.channel.send(`Insere um link válido.\n${err}`);
        }
    } else {
        let result = await searcher(args.join(' '));
        if (result.videos == null || result.videos.length == 0)
            return message.channel.send('Não foram encontrados resultados.');
        let songInfo = await ytdl.getInfo(result.videos[0].url);
        return videoHandler(songInfo, message, vc, queue);
    }
};

const play = (guild, song, queue) => {
    const serverQueue = queue.get(guild.id);

    if (!song) {
        getVoiceConnection(message.guild.id).state.subscription.unsubscribe();

        queue.delete(guild.id);

        return;
    }

    const audioResource = createAudioResource(
        ytdl(song.url, { highWaterMark: 1 << 25 })
    );
    const player = createAudioPlayer();

    player.addListener('stateChange', (oldOne, newOne) => {
        console.log(newOne.status, oldOne.status);
        if (newOne.status == 'idle') {
            getVoiceConnection(
                message.guild.id
            ).state.subscription.unsubscribe();
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0], queue);
        }
    });

    const dispatcher = serverQueue.connection.subscribe(player);

    player.play(audioResource);

    let seconds =
        serverQueue.songs[0].vLength -
        60 * parseInt(serverQueue.songs[0].vLength / 60);

    let dur = `${parseInt(serverQueue.songs[0].vLength / 60)}:${
        seconds < 10 ? '0' + seconds : seconds
    }`;

    let msg = new Discord.MessageEmbed()
        .setTitle('A tocar: ')
        .setDescription(
            `[${serverQueue.songs[0].title}](${serverQueue.songs[0].url})`,
            '_______'
        )
        .addField('Duração', dur, true)
        .addField('\u200B', '\u200B', true)
        .addField('Pedida por:', `${serverQueue.songs[0].askedBy}`)
        .setImage(serverQueue.songs[0].thumbnail)
        .setColor('DARK_VIVID_PINK')
        .setTimestamp(new Date())
        .setFooter({
            text: message.guild.name,
            iconURL: message.guild.iconURL()
        });

    serverQueue.txtChannel.send({ embeds: [msg] });
};

const videoHandler = async (songInfo, message, vc, queue, playlist = false) => {
    const serverQueue = queue.get(message.guild.id);

    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
        vLength: songInfo.videoDetails.lengthSeconds,
        thumbnail: songInfo.videoDetails.thumbnails[3].url,
        askedBy: message.author.toString(),
        askedByUsername: message.author.username
    };

    if (!serverQueue) {
        const queueConstructor = {
            txtChannel: message.channel,
            vChannel: message.member.voice.channel,
            connection: null,
            songs: [],
            volume: 10,
            playing: true
        };

        queue.set(message.guild.id, queueConstructor);

        queueConstructor.songs.push(song);

        try {
            let connection = getVoiceConnection(message.guild.id);

            if (!connection) {
                connection = joinVoiceChannel({
                    channelId: message.member.voice.channel.id,
                    guildId: message.guild.id,
                    adapterCreator: message.guild.voiceAdapterCreator
                });
            }
            queueConstructor.connection = connection;
            play(message.guild, queueConstructor.songs[0], queue);
        } catch (err) {
            console.error(err);
            queue.delete(message.guild.id);
            return message.channel.send(
                `Não foi possível conectar-me ao voice channel ${err}.`
            );
        }
    } else {
        let msg = new Discord.MessageEmbed()
            .setTitle('Adicionada à queue. ')
            .setDescription(
                `[${song.title}](${song.url}) pedida por: ${song.askedBy}`
            )
            .setColor('DARK_VIVID_PINK');
        serverQueue.songs.push(song);
        message.channel.send({ embeds: [msg] });
        return;
    }
};

module.exports.config = {
    name: 'play',
    aliases: ['p', 'pl']
};
