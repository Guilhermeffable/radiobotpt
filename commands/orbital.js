const dis = require('../music/dispatcher');
const { MessageEmbed } = require('discord.js');

module.exports.run = (client, message, args, queue, searcher) => {
	dis.createDispatcher('http://centova.radios.pt:8401/stream.mp3/1', message);

	let msg = new MessageEmbed()
		.setTitle('Rádio ')
		.setDescription(`Orbital`)
		.setColor('ORANGE');

	message.channel.send({ embeds: [msg] });
};

module.exports.config = {
	name: 'orbital',
	aliases: [],
};
