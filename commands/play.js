const ytdl = require('ytdl-core');
const ytpl = require('ytpl');
const Discord = require('discord.js');

module.exports.run = async (client, message, args, queue, searcher) => {
	const vc = message.member.voice.channel;

	if (!vc)
		return message.channel.send('Tens de estar conectado a um canal de voz!');

	let url = args.join(' ');

	let play = (guild, song) => {
		const serverQueue = queue.get(guild.id);

		if (!song) {
			serverQueue.vChannel.leave();
			queue.delete(guild.id);
			return;
		}

		const dispatcher = serverQueue.connection
			.play(ytdl(song.url, { highWaterMark: 1 << 25 }))
			.on('finish', () => {
				serverQueue.songs.shift();
				play(guild, serverQueue.songs[0]);
			});

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
			.setFooter(message.guild.name, message.guild.iconURL());

		serverQueue.txtChannel.send(msg);
	};

	let videoHandler = async (songInfo, message, vc, playlist = false) => {
		const serverQueue = queue.get(message.guild.id);

		const song = {
			title: songInfo.videoDetails.title,
			url: songInfo.videoDetails.video_url,
			vLength: songInfo.videoDetails.lengthSeconds,
			thumbnail: songInfo.videoDetails.thumbnails[3].url,
			askedBy: message.author.toString(),
			askedByUsername: message.author.username,
		};

		if (!serverQueue) {
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

			try {
				let connection = await vc.join();
				message.guild.me.voice.setSelfDeaf(true);
				queueConstructor.connection = connection;
				play(message.guild, queueConstructor.songs[0]);
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
			message.channel.send(msg);
			return;
		}
	};

	if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
		try {
			await ytpl(url).then(async (playlist) => {
				message.channel.send(`A playlist: "${playlist.title}" foi adicionada.`);
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
		return videoHandler(songInfo, message, vc);
	}
};

module.exports.config = {
	name: 'play',
	aliases: ['p', 'pl'],
};
