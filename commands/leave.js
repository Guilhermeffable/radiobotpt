const { getVoiceConnection } = require('@discordjs/voice');

module.exports.run = (client, message, args, queue, searcher) => {
	const guildID = message.guildId;

	const connection = getVoiceConnection(guildID);

	connection.state.subscription.unsubscribe();
	connection.disconnect();
	connection.destroy();

	queue.delete(guildID);
};

module.exports.config = {
	name: 'leave',
	aliases: [],
};
