const dis = require('../music/dispatcher');
const { MessageEmbed } = require('discord.js');

module.exports.run = (client, message, args, queue, searcher) => {
	dis.createDispatcher(
		'https://centova.radio.com.pt/proxy/500?mp=/stream',
		message
	);

	let msg = new MessageEmbed()
		.setTitle('Rádio ')
		.setDescription(`HiperFM`)
		.setColor('ORANGE');

	message.channel.send({ embeds: [msg] });
};

module.exports.config = {
	name: 'hiper',
	aliases: [],
};
