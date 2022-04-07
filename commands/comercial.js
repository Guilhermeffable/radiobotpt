const dis = require('../music/dispatcher');
const { MessageEmbed } = require('discord.js');

module.exports.run = (client, message, args, queue, searcher) => {
	dis.createDispatcher(
		'http://mcrwowza7.mcr.iol.pt/comercial/smil:comercial.smil/playlist.m3u8',
		message
	);

	let msg = new MessageEmbed()
		.setTitle('Rádio ')
		.setDescription(`Comercial`)
		.setColor('ORANGE');

	message.channel.send({ embeds: [msg] });
};

module.exports.config = {
	name: '',
	aliases: [],
};
