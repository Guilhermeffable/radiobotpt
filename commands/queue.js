const Discord = require('discord.js');

module.exports.run = (client, message, args, queue, searcher) => {
	const serverQueue = queue.get(message.guild.id);

	let embed = new Discord.MessageEmbed()
		.setTitle('Queue de reprodução')
		.setColor('DARK_VIVID_PINK')
		.setTimestamp(new Date())
		.setFooter({
			text: message.guild.name,
			iconURL: message.guild.iconURL(),
		});

	if (!serverQueue) {
		embed.addField('Queue vazio', 'Não há nada para ser reproduzido.');
	} else {
		serverQueue.songs.map((item, pos) => {
			embed.addField(
				`${pos + 1} - [${serverQueue.songs[0].title}](${
					serverQueue.songs[0].url
				})`,
				`@${item.askedByUsername}`
			);
		});
	}

	message.channel.send({ embeds: [embed] });
};

module.exports.config = {
	name: 'queue',
	aliases: ['q'],
};
