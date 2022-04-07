module.exports.run = (client, message, args, queue, searcher) => {
	message.channel.messages.fetch().then((messages) => {
		const botCommands = messages.filter(
			(msg) => msg.content.startsWith('!') || msg.author.bot
		);

		const messagesToRemove = Array.from(botCommands.values());

		message.channel.bulkDelete(messagesToRemove);

		const messagesDeleted = messagesToRemove.length;
		message.channel.send('Número de mensagens eliminadas: ' + messagesDeleted);
	});
};

module.exports.config = {
	name: 'clear',
	aliases: ['clean', 'delete'],
};
