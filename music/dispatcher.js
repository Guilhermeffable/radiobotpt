const {
	getVoiceConnection,
	joinVoiceChannel,
	createAudioPlayer,
	createAudioResource,
} = require('@discordjs/voice');

const { createReadStream } = require('node:fs');

let createDispatcher = (url, message) => {
	const voiceChannel = message.member.voice.channel;

	//vê se o user está numa sala de voz
	if (!voiceChannel) {
		return message.channel.send(
			'Precisas de estar num voice channel para usar este comando.'
		);
	}
	console.log(voiceChannel.name);
	const permissions = voiceChannel.permissionsFor(message.client.user);

	//vê se tem permissões para entrar na sala
	if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
		return message.channel.send('Não tenho permissões para entrar nessa sala.');
	}
	let connection = getVoiceConnection(message.guild.id);

	if (!connection) {
		connection = joinVoiceChannel({
			channelId: message.member.voice.channel.id,
			guildId: message.guild.id,
			adapterCreator: message.guild.voiceAdapterCreator,
		});
	}
	//conecta ao canal de voz e reproduz o link

	const audioResource = createAudioResource(url);
	try {
		let audioPlayer = createAudioPlayer();
		connection.subscribe(audioPlayer);
		audioPlayer.play(audioResource);
	} catch (ex) {
		console.error(ex);
	}
};

module.exports.createDispatcher = createDispatcher;
