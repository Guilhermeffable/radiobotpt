const { getVoiceConnection } = require('@discordjs/voice');

module.exports.run = (client, message, args, queue, searcher) => {
	const guildID = message.guild.id;
	const serverQueue = queue.get(guildID);

	if (!serverQueue) {
		return message.channel.send('Impossível parar o que nunca começou...');
	}

	if (!message.member.voice.channel) {
		return message.channel.send(
			'Tens de estar conectado/a a um voice channel.'
		);
	}

	queue.delete(guildID);

	const connection = getVoiceConnection(guildID);

	connection.state.subscription.unsubscribe();
};

module.exports.config = {
	name: 'stop',
	aliases: ['st'],
};
