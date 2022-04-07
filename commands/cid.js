const dis = require('../music/dispatcher');
const { MessageEmbed } = require('discord.js');

module.exports.run = (client, message, args, queue, searcher) => {
	dis.createDispatcher(
		'https://mcrwowza7.mcr.iol.pt/cidade/smil:cidade.smil/playlist.m3u8',
		message
	);
	let msg = new MessageEmbed()
		.setTitle('Rádio ')
		.setDescription(`CidadeFM`)
		.setColor('ORANGE');

	message.channel.send({ embeds: [msg] });
};

module.exports.config = {
	name: 'cid',
	aliases: [],
};
